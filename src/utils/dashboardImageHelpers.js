import { getStorageAssetUrl } from './jobsHelpers';
import { getBookCoverUrl } from './bookFormHelpers';
import { getTravelImageUrl } from './travelFormHelpers';

function resolvePath(path) {
  if (!path) return null;
  if (typeof path !== 'string') return null;
  return path.startsWith('http') ? path : getStorageAssetUrl(path);
}

/** Resolve thumbnail URL for any dashboard listing row */
export function getListingImageUrl(item) {
  if (!item) return null;

  const directUrls = [
    item.display_image_url,
    item.cover_image_url,
    item.main_image_url,
    item.image_url,
    item.banner_image_url,
    item.thumbnail_url,
  ].filter(Boolean);

  for (const url of directUrls) {
    const resolved = resolvePath(url);
    if (resolved) return resolved;
  }

  const bookUrl = getBookCoverUrl(item);
  if (bookUrl) return bookUrl;

  const travelUrl = getTravelImageUrl(item);
  if (travelUrl) return travelUrl;

  const paths = [
    item.main_image,
    item.cover_image,
    item.banner_image,
    item.banner_image_url,
    item.logo,
    item.profile_photo,
    item.business_logo,
    item.primary_image,
  ];

  for (const path of paths) {
    const resolved = resolvePath(path);
    if (resolved) return resolved;
  }

  const images = item.images || item.additional_images || item.gallery;
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string') return resolvePath(first);
    if (first?.url || first?.path || first?.image_path) {
      return resolvePath(first.url || first.path || first.image_path);
    }
  }

  if (item.media?.length) {
    const img = item.media.find((m) => m.is_thumbnail) || item.media.find((m) => m.type === 'image') || item.media[0];
    if (img?.full_url) return resolvePath(img.full_url);
    if (img?.file_path) return resolvePath(img.file_path);
    if (img?.url || img?.path) return resolvePath(img.url || img.path);
  }

  return null;
}

export function formatListingDate(item) {
  const raw = item?.created_at || item?.posted_at || item?.createdAt;
  if (!raw) return '—';
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}
