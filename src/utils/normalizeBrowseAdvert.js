/**
 * Normalize cross-category browse/feed adverts so Featured / Promoted cards
 * show real prices and images (services use starting_price + media, etc.).
 */
import { resolveImageUrl, resolveListingImage } from './resolveImageUrl';

const CATEGORY_STOCK = {
  services:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  'ai services':
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
  'web development':
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  seo:
    'https://images.unsplash.com/photo-1432888498266-38ffec3bdb47?auto=format&fit=crop&w=800&q=80',
  branding:
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
  property:
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  vehicles:
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  electronics:
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
  jobs:
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
  business:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  travel:
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
  default:
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
};

const TITLE_STOCK = [
  [/chatbot|ai\b|gpt/i, CATEGORY_STOCK['ai services']],
  [/website|web\s*dev|landing/i, CATEGORY_STOCK['web development']],
  [/seo|search\s*engine/i, CATEGORY_STOCK.seo],
  [/brand|logo|identity/i, CATEGORY_STOCK.branding],
  [/property|apartment|house|condo/i, CATEGORY_STOCK.property],
  [/car|vehicle|porsche|rover/i, CATEGORY_STOCK.vehicles],
  [/job|hiring|manager|career/i, CATEGORY_STOCK.jobs],
];

export const pickListingPrice = (advert) => {
  if (!advert || typeof advert !== 'object') return null;
  const candidates = [
    advert.formatted_price,
    advert.price,
    advert.starting_price,
    advert.price_from,
    advert.min_price,
    advert.amount,
    advert.salary,
    advert.ticket_size,
    advert.meta?.starting_price,
    advert.meta?.price,
    advert.original?.starting_price,
    advert.original?.price,
    advert.source?.starting_price,
    advert.source?.price,
  ];
  for (const c of candidates) {
    if (c == null || c === '') continue;
    return c;
  }
  return null;
};

export const formatListingPrice = (advert, fallback = 'POA') => {
  if (!advert) return fallback;
  if (advert.formatted_price) return advert.formatted_price;

  const price = pickListingPrice(advert);
  if (price == null || price === '') return fallback;

  if (typeof price === 'string' && /[a-z£$€]/i.test(price) && Number.isNaN(Number(price))) {
    return price;
  }
  if (price === 0 || price === '0') return 'FREE';

  const currency = advert.currency || advert.meta?.currency || 'GBP';
  const numeric = Number(String(price).replace(/[^0-9.-]/g, ''));
  if (Number.isNaN(numeric)) return String(price);

  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: String(currency).length === 3 ? currency : 'GBP',
      maximumFractionDigits: 0,
    }).format(numeric);
  } catch {
    return `${currency} ${numeric.toLocaleString()}`;
  }
};

const resolveMediaImage = (advert) => {
  const media = advert?.media || advert?.original?.media || advert?.source?.media;
  if (!Array.isArray(media) || !media.length) return null;
  const thumb =
    media.find((m) => m?.is_thumbnail || m?.isThumbnail) || media[0];
  return resolveImageUrl(thumb);
};

export const pickListingImage = (advert, { allowStock = true } = {}) => {
  if (!advert || typeof advert !== 'object') return null;

  const direct =
    resolveListingImage(advert) ||
    resolveMediaImage(advert) ||
    resolveImageUrl(advert.thumbnail_url) ||
    resolveImageUrl(advert.photo_url) ||
    resolveListingImage(advert.original) ||
    resolveListingImage(advert.source);

  if (direct) return direct;
  if (!allowStock) return null;

  const categoryKey = String(
    advert.category_name ||
      advert.source_label ||
      advert.category?.name ||
      advert.category ||
      ''
  )
    .trim()
    .toLowerCase();

  if (categoryKey && CATEGORY_STOCK[categoryKey]) {
    return CATEGORY_STOCK[categoryKey];
  }

  const title = String(advert.title || '');
  for (const [re, url] of TITLE_STOCK) {
    if (re.test(title)) return url;
  }

  if (categoryKey.includes('service')) return CATEGORY_STOCK.services;
  return CATEGORY_STOCK.default;
};

export const normalizeBrowseAdvert = (advert) => {
  if (!advert || typeof advert !== 'object') return advert;
  const price = pickListingPrice(advert);
  const image = pickListingImage(advert, { allowStock: true });
  return {
    ...advert,
    price: price ?? advert.price ?? null,
    starting_price: advert.starting_price ?? (typeof price === 'number' ? price : advert.starting_price),
    main_image: advert.main_image || image,
    main_image_url: advert.main_image_url || image,
    image: advert.image || image,
    _resolved_image: image,
    _resolved_price_label: formatListingPrice({ ...advert, price }),
  };
};

export const normalizeBrowseAdverts = (rows = []) =>
  (Array.isArray(rows) ? rows : []).map(normalizeBrowseAdvert);

/** True when most rows lack both price and a real (non-stock) image from API fields */
export const isLowQualityBrowseFeed = (rows = []) => {
  const list = Array.isArray(rows) ? rows : [];
  if (!list.length) return true;
  let weak = 0;
  for (const ad of list) {
    const hasPrice = pickListingPrice(ad) != null;
    const hasRealImage = Boolean(pickListingImage(ad, { allowStock: false }));
    if (!hasPrice && !hasRealImage) weak += 1;
  }
  return weak / list.length >= 0.7;
};

export default normalizeBrowseAdvert;
