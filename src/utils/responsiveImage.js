/**
 * Responsive image helpers — right resolution for mobile vs desktop.
 * Works with Unsplash, Cloudinary, optional resize proxy, and plain storage URLs.
 * (Does NOT invent a CDN host — only rewrites hosts we know.)
 */

export const FALLBACK_IMG = '/img/no-image.png';

const WIDTH_PRESETS = {
  thumb: 320,
  card: 640,
  hero: 1280,
  full: 1920,
};

const RESIZE_PROXY = (process.env.REACT_APP_IMAGE_RESIZE_URL || '').replace(/\/$/, '');

/**
 * Rewrite known image hosts to a target width (saves mobile bandwidth).
 */
export const withImageWidth = (url, width = WIDTH_PRESETS.card, { quality } = {}) => {
  if (!url || typeof url !== 'string') return url;
  const w = Math.max(32, Math.round(width));
  const q = quality != null ? quality : 80;

  try {
    if (url.includes('images.unsplash.com')) {
      const u = new URL(url);
      u.searchParams.set('auto', 'format');
      u.searchParams.set('fit', 'crop');
      u.searchParams.set('w', String(w));
      u.searchParams.set('q', String(q));
      return u.toString();
    }

    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
      const transform = `w_${w},c_fill,f_auto,q_${q}`;
      if (/\/upload\/[^/]*w_\d+/.test(url)) {
        return url.replace(/\/upload\/[^/]+\//, `/upload/${transform}/`);
      }
      return url.replace('/upload/', `/upload/${transform}/`);
    }

    // Optional self-hosted / imgproxy-style resize: REACT_APP_IMAGE_RESIZE_URL/w_640?url=
    if (RESIZE_PROXY && /^https?:\/\//i.test(url) && !url.startsWith(RESIZE_PROXY)) {
      return `${RESIZE_PROXY}/w_${w}?url=${encodeURIComponent(url)}`;
    }

    // Generic ?w= for hosts that already support it
    if (/[?&]w=\d+/i.test(url)) {
      return url.replace(/([?&])w=\d+/i, `$1w=${w}`);
    }
  } catch {
    return url;
  }

  return url;
};

/** Tiny blurred preview for LQIP (Unsplash/Cloudinary only). */
export const getLazySrc = (url, width = 32) => {
  if (!url || typeof url !== 'string') return FALLBACK_IMG;
  if (url.includes('images.unsplash.com') || url.includes('res.cloudinary.com') || RESIZE_PROXY) {
    return withImageWidth(url, width, { quality: 10 });
  }
  return FALLBACK_IMG;
};

/**
 * Build srcSet for hosts we can resize.
 */
export const buildSrcSet = (url, widths = [320, 640, 960, 1280]) => {
  if (!url || typeof url !== 'string') return undefined;
  const canResize =
    url.includes('images.unsplash.com') ||
    url.includes('res.cloudinary.com') ||
    Boolean(RESIZE_PROXY) ||
    /[?&]w=\d+/i.test(url);
  if (!canResize) return undefined;
  return widths.map((w) => `${withImageWidth(url, w)} ${w}w`).join(', ');
};

export const defaultSizes = (variant = 'card') => {
  if (variant === 'hero') return '100vw';
  if (variant === 'thumb') return '(max-width: 640px) 40vw, 160px';
  return '(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw';
};

/**
 * Pick display URL + optional srcSet/sizes for an <img>.
 */
export const getResponsiveImageProps = (url, { variant = 'card', widths } = {}) => {
  if (!url) {
    return { src: FALLBACK_IMG, srcSet: undefined, sizes: undefined };
  }
  const width = WIDTH_PRESETS[variant] || WIDTH_PRESETS.card;
  const src = withImageWidth(url, width) || url;
  const srcSet = buildSrcSet(url, widths);
  return {
    src,
    srcSet,
    sizes: srcSet ? defaultSizes(variant) : undefined,
  };
};

export { WIDTH_PRESETS };
