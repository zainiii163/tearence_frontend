/**
 * Allow only same-origin relative paths for post-login / payment redirects.
 * Blocks open redirects (//evil.com, https://evil.com, javascript:, etc.).
 */
export function getSafeInternalPath(candidate, fallback = '/') {
  if (candidate == null || candidate === '') return fallback;

  let path = String(candidate).trim();

  try {
    path = decodeURIComponent(path);
  } catch {
    return fallback;
  }

  path = path.trim();

  if (!path.startsWith('/')) return fallback;
  if (path.startsWith('//')) return fallback;
  if (path.includes('://')) return fallback;
  if (/[\u0000-\u001F\u007F]/.test(path)) return fallback;

  // Reject backslash tricks and protocol-relative schemes
  if (path.includes('\\')) return fallback;

  const lower = path.toLowerCase();
  if (
    lower.startsWith('/http:') ||
    lower.startsWith('/https:') ||
    lower.startsWith('/javascript:') ||
    lower.startsWith('/data:')
  ) {
    return fallback;
  }

  return path;
}

export default getSafeInternalPath;
