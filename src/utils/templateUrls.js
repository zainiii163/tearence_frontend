/** API host — template HTML files live in backend public/templates */
export const TEMPLATE_API_ORIGIN = (
  process.env.REACT_APP_API_ORIGIN ||
  process.env.REACT_APP_API_BASE_URL?.replace(/\/api\/v1\/?$/i, '') ||
  'https://api.worldwideadverts.info'
).replace(/\/$/, '');

/** Turn /templates/foo.html into full API URL for production */
export function resolveTemplateAssetUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${TEMPLATE_API_ORIGIN}${normalized}`;
}
