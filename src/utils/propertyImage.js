import { getStorageAssetUrl, rewriteLocalStorageUrl } from './jobsHelpers';

/** Attractive fallbacks when API storage files are missing (common on Hostinger). */
const FALLBACK_BY_TYPE = {
  residential:
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
  commercial:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  industrial:
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  land:
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  agricultural:
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  luxury:
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  rental:
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  investment:
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  default:
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
};

export const resolvePropertyAssetUrl = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null;
  return getStorageAssetUrl(trimmed) || rewriteLocalStorageUrl(trimmed) || trimmed;
};

/** Collect candidate image URLs from a property payload. */
export const collectPropertyImageUrls = (property) => {
  if (!property) return [];
  const out = [];
  const push = (raw) => {
    const url = resolvePropertyAssetUrl(raw);
    if (url && !out.includes(url)) out.push(url);
  };

  push(property.cover_image);
  push(property.main_image);
  push(property.image);
  push(property.thumbnail);
  push(property.photo);

  const bags = [
    property.images,
    property.gallery,
    property.media,
    property.photos,
    property.additional_images,
  ];

  bags.forEach((bag) => {
    if (!bag) return;
    if (typeof bag === 'string') {
      // sometimes JSON string
      try {
        const parsed = JSON.parse(bag);
        if (Array.isArray(parsed)) {
          parsed.forEach((item) =>
            push(typeof item === 'string' ? item : item?.url || item?.full_url || item?.path || item?.file_path)
          );
        } else {
          push(bag);
        }
      } catch {
        push(bag);
      }
      return;
    }
    if (Array.isArray(bag)) {
      bag.forEach((item) =>
        push(
          typeof item === 'string'
            ? item
            : item?.url || item?.full_url || item?.path || item?.file_path || item?.image_path
        )
      );
    }
  });

  return out;
};

export const getPropertyFallbackImage = (property) => {
  const type = String(property?.property_type || property?.category || '')
    .toLowerCase()
    .replace(/\s+/g, '_');
  let base = FALLBACK_BY_TYPE.default;
  if (FALLBACK_BY_TYPE[type]) base = FALLBACK_BY_TYPE[type];
  else if (type.includes('residential') || type.includes('home') || type.includes('apartment')) {
    base = FALLBACK_BY_TYPE.residential;
  } else if (type.includes('commercial') || type.includes('office')) {
    base = FALLBACK_BY_TYPE.commercial;
  } else if (type.includes('industrial') || type.includes('warehouse')) {
    base = FALLBACK_BY_TYPE.industrial;
  } else if (type.includes('land') || type.includes('plot') || type.includes('agricultur')) {
    base = FALLBACK_BY_TYPE.land;
  } else if (type.includes('luxury')) {
    base = FALLBACK_BY_TYPE.luxury;
  } else if (type.includes('rent')) {
    base = FALLBACK_BY_TYPE.rental;
  }
  return base;
};

/** Primary display URL: first API candidate, else type fallback. */
export const getPropertyDisplayImage = (property) => {
  const candidates = collectPropertyImageUrls(property);
  return candidates[0] || getPropertyFallbackImage(property);
};
