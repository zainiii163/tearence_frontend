import { getStorageAssetUrl } from './jobsHelpers';

export const TRAVEL_CATEGORY_TYPE_LABELS = {
  accommodation: 'Accommodation',
  transport: 'Transport',
  experience: 'Experience',
};

/** Group travel categories for optgroup dropdowns */
export function groupTravelCategories(categories = []) {
  const order = ['accommodation', 'transport', 'experience'];

  return order
    .map((type) => ({
      type,
      label: TRAVEL_CATEGORY_TYPE_LABELS[type] || type,
      items: categories.filter((cat) => cat.type === type),
    }))
    .filter((group) => group.items.length > 0);
}

/** Convert text input to Laravel array (e.g. "24/7" or "Mon-Fri 9-5, Sat 10-2") */
export function parseOperatingHoursInput(value) {
  if (value === null || value === undefined || value === '') return null;
  if (Array.isArray(value)) {
    const items = value.map(String).map((s) => s.trim()).filter(Boolean);
    return items.length ? items : null;
  }
  const items = String(value)
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length ? items : null;
}

/** Display stored array in a text field */
export function formatOperatingHoursForInput(value) {
  if (!value) return '';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

/** Resolve main/gallery image URL from API path or accessor */
export function getTravelMediaUrl(path) {
  if (!path) return null;
  if (typeof path === 'string') {
    return path.startsWith('http') ? path : getStorageAssetUrl(path);
  }
  const value = path.url || path.path;
  if (!value) return null;
  return value.startsWith('http') ? value : getStorageAssetUrl(value);
}

/** Best display image: main → gallery → logo */
export function getTravelImageUrl(advertOrPath) {
  if (!advertOrPath) return null;
  if (typeof advertOrPath === 'string') {
    return getTravelMediaUrl(advertOrPath);
  }

  const main = getTravelMediaUrl(advertOrPath.main_image_url || advertOrPath.main_image);
  if (main) return main;

  const gallery = advertOrPath.image_urls || advertOrPath.images;
  if (Array.isArray(gallery) && gallery.length > 0) {
    const resolved = getTravelMediaUrl(gallery[0]);
    if (resolved) return resolved;
  }

  return getTravelLogoUrl(advertOrPath);
}

export function getTravelLogoUrl(advertOrPath) {
  if (!advertOrPath) return null;
  if (typeof advertOrPath === 'string') {
    return getTravelMediaUrl(advertOrPath);
  }
  return getTravelMediaUrl(advertOrPath.logo_url || advertOrPath.logo);
}

export function enrichTravelAdvert(advert) {
  if (!advert) return advert;
  return {
    ...advert,
    main_image_url: getTravelMediaUrl(advert.main_image_url || advert.main_image),
    logo_url: getTravelMediaUrl(advert.logo_url || advert.logo),
    image_urls: Array.isArray(advert.images)
      ? advert.images.map((img) => getTravelMediaUrl(img)).filter(Boolean)
      : [],
    display_image_url: getTravelImageUrl(advert),
  };
}

export function enrichTravelAdverts(adverts = []) {
  return (Array.isArray(adverts) ? adverts : []).map(enrichTravelAdvert);
}
