/**
 * Normalizes job list payloads from /jobs/my-jobs and related endpoints.
 */
export const extractJobsList = (response) => {
  if (!response) return [];

  if (Array.isArray(response)) return response;

  const data = response.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.jobs)) return data.jobs;
  if (Array.isArray(response.jobs)) return response.jobs;

  return [];
};

const STORAGE_URL = process.env.REACT_APP_STORAGE_URL
  || (process.env.REACT_APP_API_BASE_URL?.startsWith('/')
    ? ''
    : process.env.REACT_APP_API_BASE_URL?.replace(/\/api\/v1\/?$/, ''))
  || 'https://api.worldwideadverts.info';

/** Resolve storage asset URL (logos, profile photos, CV paths from API) */
export const getStorageAssetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/storage')) {
    return STORAGE_URL ? `${STORAGE_URL.replace(/\/$/, '')}${path}` : path;
  }
  const base = STORAGE_URL ? `${STORAGE_URL.replace(/\/$/, '')}/storage` : '/storage';
  return `${base}/${path.replace(/^\//, '')}`;
};

/** @deprecated Use getStorageAssetUrl */
export const getJobLogoUrl = getStorageAssetUrl;

const WORK_TYPE_LABELS = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  temporary: 'Temporary',
  internship: 'Internship',
  remote: 'Remote',
  'Full-time': 'Full-time',
  'Part-time': 'Part-time',
};

const formatPostedDate = (dateStr) => {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString();
};

const formatSalary = (job) => {
  if (job.salary_range) return job.salary_range;
  if (job.salary_min && job.salary_max) {
    const currency = job.salary_currency || job.currency || 'USD';
    return `${currency} ${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}`;
  }
  if (job.salary_min) {
    const currency = job.salary_currency || job.currency || 'USD';
    return `${currency} ${Number(job.salary_min).toLocaleString()}+`;
  }
  return 'Negotiable';
};

/** Maps API job records to JobsGrid card shape */
export const normalizeJobForCard = (job) => ({
  ...job,
  company: job.company || job.company_name || 'Company',
  logo: getJobLogoUrl(job.logo || job.company_logo || job.logo_url) || '/images/default-company.png',
  location: job.location || [job.city, job.state, job.country].filter(Boolean).join(', ') || 'Location TBD',
  salary: job.salary || formatSalary(job),
  type: job.type || WORK_TYPE_LABELS[job.work_type] || job.work_type || 'Full-time',
  remote: job.remote ?? job.is_remote ?? false,
  views: job.views ?? job.views_count ?? 0,
  applicants: job.applicants ?? job.applications_count ?? 0,
  posted: job.posted || formatPostedDate(job.created_at || job.posted_at),
  companyVerified: job.companyVerified ?? job.is_verified_employer ?? false,
  urgent: job.urgent ?? job.is_urgent ?? false,
  badges: job.badges || [
    ...(job.is_featured ? ['Featured'] : []),
    ...(job.is_sponsored ? ['Sponsored'] : []),
    ...((job.is_remote || job.remote) ? ['Remote'] : []),
    ...(job.is_urgent ? ['Urgent Hire'] : []),
  ],
});
