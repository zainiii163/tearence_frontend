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

const LIVE_STORAGE = 'https://api.worldwideadverts.info/storage';

const apiOrigin = (() => {
  const api =
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_API_URL ||
    '';
  const match = String(api).match(/^(https?:\/\/[^/]+)/i);
  return match ? match[1].replace(/\/$/, '') : '';
})();

const API_IS_LOCAL = /127\.0\.0\.1|localhost/i.test(apiOrigin);

/** Configured storage base (no trailing slash). Local API always prefers local Laravel storage. */
const STORAGE_BASE = (() => {
  const raw = (process.env.REACT_APP_STORAGE_URL || '').replace(/\/$/, '');

  // Local API → local storage (ignore stale production STORAGE_URL)
  if (API_IS_LOCAL) {
    if (raw && /127\.0\.0\.1|localhost/i.test(raw)) {
      return /\/storage$/i.test(raw) ? raw : `${raw}/storage`;
    }
    return `${apiOrigin || 'http://127.0.0.1:8000'}/storage`;
  }

  if (raw) {
    if (/\/storage$/i.test(raw)) return raw;
    if (/127\.0\.0\.1|localhost/i.test(raw)) return `${raw}/storage`;
    return raw;
  }

  return LIVE_STORAGE;
})();

const USE_LOCAL_STORAGE = API_IS_LOCAL || /127\.0\.0\.1|localhost/i.test(STORAGE_BASE);

/**
 * Normalize media URLs for the current environment.
 * - Local API: keep/serve from localhost; rewrite live API storage → local
 * - Production: rewrite localhost storage → live public storage
 */
export const rewriteLocalStorageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;

  const liveMatch = url.match(
    /^https?:\/\/api\.worldwideadverts\.info\/storage\/(.+)$/i
  );
  const localMatch = url.match(
    /^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?\/storage\/(.+)$/i
  );
  const localAnyMatch = url.match(
    /^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?(\/.*)$/i
  );

  if (USE_LOCAL_STORAGE) {
    if (liveMatch) return `${STORAGE_BASE}/${liveMatch[1]}`;
    if (localMatch) return `${STORAGE_BASE}/${localMatch[1]}`;
    if (url.startsWith('/storage/')) {
      return `${STORAGE_BASE}${url.replace(/^\/storage/, '')}`;
    }
    // Keep other absolute local URLs (e.g. /images/...) on local origin
    if (localAnyMatch) {
      return `${apiOrigin || 'http://127.0.0.1:8000'}${localAnyMatch[1]}`;
    }
    return url;
  }

  if (localMatch) {
    return `${LIVE_STORAGE}/${localMatch[1]}`;
  }

  // Production: rewrite any localhost asset URL to live API host
  if (localAnyMatch) {
    const path = localAnyMatch[1];
    if (path.startsWith('/storage/')) {
      return `${LIVE_STORAGE}${path.replace(/^\/storage/, '')}`;
    }
    return `https://api.worldwideadverts.info${path}`;
  }

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

  // Absolute URLs — env-aware rewrite; keep Unsplash/CDN as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return rewriteLocalStorageUrl(trimmed);
  }

  if (trimmed.startsWith('/storage')) {
    return `${STORAGE_BASE}${trimmed.replace(/^\/storage/, '')}`;
  }

  return `${STORAGE_BASE}/${trimmed.replace(/^\//, '')}`;
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
