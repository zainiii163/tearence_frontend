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

const LIVE_STORAGE =
  'https://api.worldwideadverts.info/storage';

const PRODUCTION_STORAGE =
  (process.env.REACT_APP_STORAGE_URL || LIVE_STORAGE).replace(/\/$/, '');

/**
 * Always prefer the public live storage host for displayable images.
 * Localhost / 127.0.0.1 storage URLs are rewritten so deployed & local
 * frontends never show broken images from private APP_URL paths.
 */
export const rewriteLocalStorageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;

  // Any local storage URL → live public storage
  const localMatch = url.match(
    /^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?\/storage\/(.+)$/i
  );
  if (localMatch) {
    return `${LIVE_STORAGE}/${localMatch[1]}`;
  }

  // Relative /storage paths returned by some APIs
  if (url.startsWith('/storage/')) {
    return `${LIVE_STORAGE}${url.replace(/^\/storage/, '')}`;
  }

  return url;
};

/** Resolve storage asset URL (logos, profile photos, CV paths from API) */
export const getStorageAssetUrl = (path) => {
  if (!path) return null;
  if (typeof path !== 'string') return null;

  const trimmed = path.trim();
  if (!trimmed) return null;

  // Skip known-broken placeholder hosts
  if (/example\.com|placehold\.co|via\.placeholder\.com|placeholder\.com/i.test(trimmed)) {
    return null;
  }

  // Absolute URLs — rewrite localhost to live storage; keep Unsplash/CDN as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return rewriteLocalStorageUrl(trimmed);
  }

  if (trimmed.startsWith('/storage')) {
    return `${LIVE_STORAGE}${trimmed.replace(/^\/storage/, '')}`;
  }

  // Relative disk path → live storage (never use localhost for display)
  const base =
    process.env.NODE_ENV === 'production' || !PRODUCTION_STORAGE.includes('127.0.0.1')
      ? LIVE_STORAGE
      : PRODUCTION_STORAGE.includes('127.0.0.1')
        ? LIVE_STORAGE
        : PRODUCTION_STORAGE;

  return `${base}/${trimmed.replace(/^\//, '')}`;
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
  logo: getJobLogoUrl(job.logo || job.company_logo || job.logo_url) || null,
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
