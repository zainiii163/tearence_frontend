import { getStorageAssetUrl, rewriteLocalStorageUrl } from './jobsHelpers';

/**
 * Resolve any listing image field (string, object, array) to a displayable URL.
 * Skips known-broken local catalog placeholders.
 */
const BROKEN_PATH_MARKERS = [
  '/img/banners/marketplace/',
  '/img/no-image',
  '/img/NoImage.png',
  '/img/banner/default-banner',
  'via.placeholder.com',
  'example.com',
  'placehold.co',
  'placeholder.com',
];

export const isBrokenImagePath = (raw) => {
  if (!raw || typeof raw !== 'string') return true;
  const s = raw.trim().toLowerCase();
  if (!s) return true;
  return BROKEN_PATH_MARKERS.some((m) => s.includes(m.toLowerCase()));
};

const pickFromObject = (obj) => {
  if (!obj || typeof obj !== 'object') return null;
  return (
    obj.url ||
    obj.src ||
    obj.path ||
    obj.file_path ||
    obj.full_url ||
    obj.original_url ||
    obj.banner_image ||
    obj.image ||
    obj.main_image ||
    null
  );
};

/**
 * @param {string|object|array|null|undefined} input
 * @returns {string|null}
 */
export const resolveImageUrl = (input) => {
  if (input == null) return null;

  if (Array.isArray(input)) {
    for (const item of input) {
      const resolved = resolveImageUrl(item);
      if (resolved) return resolved;
    }
    return null;
  }

  if (typeof input === 'object') {
    return resolveImageUrl(pickFromObject(input));
  }

  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed || isBrokenImagePath(trimmed)) return null;

  const url = getStorageAssetUrl(trimmed) || rewriteLocalStorageUrl(trimmed);
  if (!url || isBrokenImagePath(url)) return null;
  return url;
};

/** First usable image from common listing fields */
export const resolveListingImage = (item) => {
  if (!item || typeof item !== 'object') return null;
  const candidates = [
    item.main_image,
    item.main_image_url,
    item.banner_image,
    item.cover_image,
    item.cover_image_url,
    item.image,
    item.image_url,
    item.thumbnail,
    item.thumbnail_url,
    item.photo,
    item.photo_url,
    item.photos,
    item.images,
    item.gallery,
    item.media,
    item.file_path,
    item.full_url,
  ];
  for (const c of candidates) {
    const resolved = resolveImageUrl(c);
    if (resolved) return resolved;
  }
  return null;
};

export default resolveImageUrl;
