import DOMPurify from 'dompurify';

/**
 * Sanitize untrusted HTML before dangerouslySetInnerHTML.
 */
export function sanitizeHtml(dirty, options = {}) {
  if (dirty == null || dirty === '') return '';
  const html = String(dirty);
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ...options,
  });
}

export default sanitizeHtml;
