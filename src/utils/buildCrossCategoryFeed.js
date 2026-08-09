/**
 * Build Featured / Promoted browse feeds from real category APIs.
 * Used when /site-feed returns empty or poorly mapped rows (missing price/images).
 */
import api from '../api';
import { extractListItems, formatCountry } from './apiResponseHelpers';
import { resolveCrossFeedHref } from './resolveCrossFeedHref';
import { pickListingImage, pickListingPrice, formatListingPrice } from './normalizeBrowseAdvert';

const safeGet = async (url, params) => {
  try {
    const res = await api.get(url, { params, timeout: 12000 });
    return extractListItems(res.data);
  } catch {
    return [];
  }
};

const mapCommon = (item, source, categoryName, hrefFallback) => {
  if (!item || typeof item !== 'object') return null;
  const id = item.id ?? item.uuid ?? item.slug;
  if (id == null) return null;

  const price = pickListingPrice(item);
  const image = pickListingImage(item, { allowStock: true });
  const city = item.city || item.location_city || null;
  const country =
    formatCountry(item.country) ||
    formatCountry(item.location_country) ||
    item.country_name ||
    null;

  const mapped = {
    ...item,
    id: `${source}-${id}`,
    source,
    source_id: id,
    source_label: categoryName,
    category_name: item.category?.name || item.category_name || categoryName,
    title: item.title || item.name || item.headline || 'Listing',
    price,
    starting_price: item.starting_price ?? price,
    currency: item.currency || item.price_currency || 'GBP',
    city,
    country,
    location: [city, country].filter(Boolean).join(', ') || item.location || '',
    main_image: item.main_image || image,
    main_image_url: item.main_image_url || image,
    image: item.image || image,
    media: item.media,
    featured: true,
    is_featured: true,
    promoted: source.includes('promoted') || item.promotion_type === 'promoted' || item.is_promoted,
    is_promoted:
      item.is_promoted ||
      item.promoted ||
      item.promotion_type === 'promoted' ||
      false,
    href: resolveCrossFeedHref(
      {
        ...item,
        source,
        source_id: id,
        id: `${source}-${id}`,
        slug: item.slug || id,
      },
      hrefFallback
    ),
  };

  mapped._resolved_image = image;
  mapped._resolved_price_label = formatListingPrice(mapped);
  return mapped;
};

const mapService = (item, lane) => {
  const promotion = String(item.promotion_type || lane || 'featured').toLowerCase();
  const mapped = mapCommon(item, 'services', 'Services', '/services');
  if (!mapped) return null;
  mapped.price = item.starting_price ?? item.price ?? mapped.price;
  mapped.starting_price = item.starting_price ?? mapped.price;
  mapped.featured = promotion === 'featured' || !!item.is_featured;
  mapped.is_featured = mapped.featured;
  mapped.promoted = promotion === 'promoted' || !!item.is_promoted;
  mapped.is_promoted = mapped.promoted;
  mapped.badge = promotion === 'promoted' ? 'Promoted' : 'Featured';
  mapped._resolved_price_label = formatListingPrice(mapped);
  return mapped;
};

const mapVehicle = (item, lane) => {
  const mapped = mapCommon(item, 'vehicles', 'Vehicles', '/vehicles');
  if (!mapped) return null;
  mapped.badge = lane === 'promoted' ? 'Promoted' : 'Featured';
  mapped.promoted = lane === 'promoted' || !!item.is_promoted || !!item.promoted;
  mapped.is_promoted = mapped.promoted;
  return mapped;
};

const mapProperty = (item, lane) => {
  const mapped = mapCommon(item, 'property', 'Property', '/property');
  if (!mapped) return null;
  mapped.badge = lane === 'promoted' ? 'Promoted' : 'Featured';
  mapped.promoted = lane === 'promoted' || !!item.is_promoted || !!item.promoted;
  mapped.is_promoted = mapped.promoted;
  return mapped;
};

const mapBuySell = (item, lane) => {
  const mapped = mapCommon(item, 'buy_sell', 'Buy & Sell', '/buy-sell');
  if (!mapped) return null;
  mapped.badge = lane === 'promoted' ? 'Promoted' : 'Featured';
  mapped.promoted = lane === 'promoted' || !!item.is_promoted || !!item.promoted;
  mapped.is_promoted = mapped.promoted;
  return mapped;
};

const mapEvents = (item, lane) => {
  const mapped = mapCommon(item, 'events_venues', 'Events & Venues', '/events-venues');
  if (!mapped) return null;
  mapped.badge = lane === 'promoted' ? 'Promoted' : 'Featured';
  return mapped;
};

const mapJobs = (item, lane) => {
  const mapped = mapCommon(item, 'jobs', 'Jobs', '/jobs');
  if (!mapped) return null;
  mapped.badge = lane === 'promoted' ? 'Promoted' : 'Featured';
  mapped.formatted_price = item.salary || item.formatted_salary || mapped.formatted_price;
  mapped._resolved_price_label =
    mapped.formatted_price || formatListingPrice(mapped) || 'Competitive';
  return mapped;
};

const mapBooks = (item, lane) => {
  const mapped = mapCommon(item, 'books', 'Books', '/books');
  if (!mapped) return null;
  mapped.badge = lane === 'promoted' ? 'Promoted' : 'Featured';
  return mapped;
};

const mapDedicatedFeatured = (item) => {
  const mapped = mapCommon(item, 'featured', 'Featured', '/featured-adverts');
  if (!mapped) return null;
  mapped.badge = 'Featured';
  mapped.href = resolveCrossFeedHref(item, '/featured-adverts');
  return mapped;
};

const mapDedicatedPromoted = (item) => {
  const mapped = mapCommon(item, 'promoted', 'Promoted', '/promoted-adverts');
  if (!mapped) return null;
  mapped.badge = 'Promoted';
  mapped.promoted = true;
  mapped.is_promoted = true;
  mapped.href = resolveCrossFeedHref(
    { ...item, source: 'promoted' },
    '/promoted-adverts'
  );
  return mapped;
};

const dedupe = (rows) => {
  const seen = new Set();
  return rows.filter((row) => {
    if (!row) return false;
    const key = `${row.source || ''}:${row.source_id || row.slug || row.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/**
 * @param {'featured'|'promoted'} lane
 * @param {{ per_page?: number, search?: string, country?: string }} params
 */
export async function buildCrossCategoryFeed(lane = 'featured', params = {}) {
  const perSource = Math.max(4, Math.min(12, Number(params.per_page) || 8));
  const q = {
    per_page: perSource,
    limit: perSource,
    search: params.search || undefined,
    country: params.country || undefined,
  };

  const promotion = lane === 'promoted' ? 'promoted' : 'featured';

  const tasks =
    lane === 'promoted'
      ? [
          safeGet('/promoted-adverts', q).then((rows) => rows.map(mapDedicatedPromoted)),
          safeGet('/services', { ...q, promotion_type: 'promoted' }).then((rows) =>
            rows.map((r) => mapService(r, 'promoted'))
          ),
          safeGet('/vehicles-adverts', { ...q, promotion_tier: 'promoted', is_promoted: 1 }).then(
            (rows) => rows.map((r) => mapVehicle(r, 'promoted'))
          ),
          safeGet('/properties/promoted', q).then((rows) =>
            rows.map((r) => mapProperty(r, 'promoted'))
          ),
          safeGet('/buysell', { ...q, promoted: 1 }).then((rows) =>
            rows.map((r) => mapBuySell(r, 'promoted'))
          ),
          safeGet('/events-venues', { ...q, promoted: 1 }).then((rows) =>
            rows.map((r) => mapEvents(r, 'promoted'))
          ),
          safeGet('/books-adverts', { ...q, promotion: 'promoted' }).then((rows) =>
            rows.map((r) => mapBooks(r, 'promoted'))
          ),
        ]
      : [
          safeGet('/featured-adverts', q).then((rows) => rows.map(mapDedicatedFeatured)),
          safeGet('/services/featured', q).then((rows) =>
            rows.map((r) => mapService(r, 'featured'))
          ),
          safeGet('/services', { ...q, promotion_type: 'featured' }).then((rows) =>
            rows.map((r) => mapService(r, 'featured'))
          ),
          safeGet('/vehicles-adverts/featured', q).then((rows) =>
            rows.map((r) => mapVehicle(r, 'featured'))
          ),
          safeGet('/properties/featured', q).then((rows) =>
            rows.map((r) => mapProperty(r, 'featured'))
          ),
          safeGet('/buysell/featured', { limit: perSource }).then((rows) =>
            rows.map((r) => mapBuySell(r, 'featured'))
          ),
          safeGet('/events-venues/featured', q).then((rows) =>
            rows.map((r) => mapEvents(r, 'featured'))
          ),
          safeGet('/jobs/featured', { limit: perSource }).then((rows) =>
            rows.map((r) => mapJobs(r, 'featured'))
          ),
          safeGet('/books-adverts/featured', q).then((rows) =>
            rows.map((r) => mapBooks(r, 'featured'))
          ),
        ];

  const settled = await Promise.all(tasks);
  let merged = dedupe(settled.flat());

  if (params.search) {
    const s = String(params.search).toLowerCase();
    merged = merged.filter((r) =>
      `${r.title} ${r.description || ''} ${r.category_name || ''}`.toLowerCase().includes(s)
    );
  }
  if (params.country) {
    const c = String(params.country).toLowerCase();
    merged = merged.filter((r) => String(r.country || '').toLowerCase().includes(c));
  }

  // Prefer items that already have price or a real image
  merged.sort((a, b) => {
    const score = (x) =>
      (pickListingPrice(x) != null ? 2 : 0) +
      (pickListingImage(x, { allowStock: false }) ? 2 : 0) +
      (x.views_count || x.view_count || 0) / 10000;
    return score(b) - score(a);
  });

  return merged.slice(0, params.per_page || 48);
}

export default buildCrossCategoryFeed;
