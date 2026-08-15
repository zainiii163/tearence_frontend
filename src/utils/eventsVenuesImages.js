const API_ORIGIN =
  (process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1')
    .replace(/\/api\/v1\/?$/, '');

const PLACEHOLDER = '/img/sample-electronics.jpg';

const resolvePath = (path) => {
  if (!path || path === 'null') {
    return null;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/storage/')) {
    return `${API_ORIGIN}${path}`;
  }

  return `${API_ORIGIN}/storage/${path.replace(/^\/+/, '')}`;
};

/**
 * Resolve the best display URL for an events/venues advert card or detail view.
 */
export const getEventsVenuesImageUrl = (advert) => {
  if (!advert) {
    return PLACEHOLDER;
  }

  const fromMain = resolvePath(advert.main_image || advert.image || advert.cover_image);
  if (fromMain) {
    return fromMain;
  }

  const images = advert.images;
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string') {
      const resolved = resolvePath(first);
      if (resolved) {
        return resolved;
      }
    }
    if (first && typeof first === 'object' && first.url) {
      const resolved = resolvePath(first.url);
      if (resolved) {
        return resolved;
      }
    }
  }

  return PLACEHOLDER;
};

export default getEventsVenuesImageUrl;
