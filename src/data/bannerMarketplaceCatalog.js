/**
 * Paid banner creatives for every Banner Adverts category (Clive).
 * Shown when users open a category — for sale, not free.
 */

export const BANNER_CATEGORY_FALLBACKS = [
  { id: 'real-estate', slug: 'real-estate', name: 'Real Estate', description: 'Property & housing marketing banners' },
  { id: 'vehicles', slug: 'vehicles', name: 'Vehicles', description: 'Automotive & dealer banners' },
  { id: 'travel-resorts', slug: 'travel-resorts', name: 'Travel & Resorts', description: 'Hotels, tours & resort banners' },
  { id: 'jobs-recruitment', slug: 'jobs-recruitment', name: 'Jobs & Recruitment', description: 'Hiring & career banners' },
  { id: 'books-authors', slug: 'books-authors', name: 'Books & Authors', description: 'Book & author promo banners' },
  { id: 'services', slug: 'services', name: 'Services', description: 'Professional services banners' },
  { id: 'events', slug: 'events', name: 'Events', description: 'Event & venue promo banners' },
  { id: 'food-hospitality', slug: 'food-hospitality', name: 'Food & Hospitality', description: 'Restaurant & hospitality banners' },
  { id: 'fashion-beauty', slug: 'fashion-beauty', name: 'Fashion & Beauty', description: 'Fashion & beauty brand banners' },
  { id: 'tech-electronics', slug: 'tech-electronics', name: 'Tech & Electronics', description: 'Gadgets & tech banners' },
  { id: 'health-wellness', slug: 'health-wellness', name: 'Health & Wellness', description: 'Health & wellness banners' },
  { id: 'business-finance', slug: 'business-finance', name: 'Business & Finance', description: 'Business & finance banners' },
];

const PURCHASE_KEY = 'wwa_banner_marketplace_purchases';

const SIZE_META = {
  hero: { size: '1200x628', label: 'Social / Hero', price: 49 },
  leaderboard: { size: '728x90', label: 'Leaderboard', price: 29 },
  rectangle: { size: '300x250', label: 'Medium Rectangle', price: 35 },
  billboard: { size: '970x250', label: 'Billboard', price: 59 },
};

const PACK_COPY = {
  'real-estate': {
    business: 'WWA Banner Studio',
    titles: {
      hero: 'Luxury Homes — Real Estate Hero Banner',
      leaderboard: 'Prime Listings Leaderboard Banner',
      rectangle: 'Open House Rectangle Banner',
      billboard: 'Property Showcase Billboard',
    },
  },
  vehicles: {
    business: 'WWA Banner Studio',
    titles: {
      hero: 'Drive Deals — Vehicles Hero Banner',
      leaderboard: 'Auto Sale Leaderboard Banner',
      rectangle: 'Certified Cars Rectangle Banner',
      billboard: 'Dealership Billboard Pack',
    },
  },
  'travel-resorts': {
    business: 'WWA Banner Studio',
    titles: {
      hero: 'Escape — Travel & Resorts Hero Banner',
      leaderboard: 'Resort Escape Leaderboard',
      rectangle: 'Beach Getaway Rectangle',
      billboard: 'Holiday Package Billboard',
    },
  },
  'jobs-recruitment': {
    business: 'WWA Banner Studio',
    titles: {
      hero: 'Hire Faster — Jobs Hero Banner',
      leaderboard: 'Careers Leaderboard Banner',
      rectangle: 'Now Hiring Rectangle',
      billboard: 'Recruitment Drive Billboard',
    },
  },
  'books-authors': {
    business: 'WWA Banner Studio',
    titles: {
      hero: 'New Release — Books Hero Banner',
      leaderboard: 'Author Spotlight Leaderboard',
      rectangle: 'Bestsellers Rectangle Banner',
      billboard: 'Book Launch Billboard',
    },
  },
  services: {
    business: 'WWA Banner Studio',
    titles: {
      hero: 'Trusted Pros — Services Hero Banner',
      leaderboard: 'Book a Pro Leaderboard',
      rectangle: 'Local Services Rectangle',
      billboard: 'Professional Services Billboard',
    },
  },
  events: {
    business: 'WWA Banner Studio',
    titles: {
      hero: 'Tonight — Events Hero Banner',
      leaderboard: 'Ticket Drop Leaderboard',
      rectangle: 'Conference Rectangle Banner',
      billboard: 'Festival Billboard Pack',
    },
  },
  'food-hospitality': {
    business: 'WWA Banner Studio',
    titles: {
      hero: 'Taste — Food & Hospitality Hero Banner',
      leaderboard: 'Restaurant Promo Leaderboard',
      rectangle: 'Chef Special Rectangle',
      billboard: 'Dining Night Billboard',
    },
  },
  'fashion-beauty': {
    business: 'WWA Banner Studio',
    titles: {
      hero: 'Style — Fashion & Beauty Hero Banner',
      leaderboard: 'New Collection Leaderboard',
      rectangle: 'Beauty Drop Rectangle',
      billboard: 'Runway Sale Billboard',
    },
  },
  'tech-electronics': {
    business: 'WWA Banner Studio',
    titles: {
      hero: 'Next-Gen — Tech Hero Banner',
      leaderboard: 'Gadget Deals Leaderboard',
      rectangle: 'Electronics Rectangle Banner',
      billboard: 'Launch Day Billboard',
    },
  },
  'health-wellness': {
    business: 'WWA Banner Studio',
    titles: {
      hero: 'Wellness — Health Hero Banner',
      leaderboard: 'Feel Better Leaderboard',
      rectangle: 'Fitness Offer Rectangle',
      billboard: 'Clinic Promo Billboard',
    },
  },
  'business-finance': {
    business: 'WWA Banner Studio',
    titles: {
      hero: 'Grow — Business & Finance Hero Banner',
      leaderboard: 'Invest Smart Leaderboard',
      rectangle: 'Finance Tips Rectangle',
      billboard: 'Business Growth Billboard',
    },
  },
};

function buildCatalog() {
  const items = [];
  let n = 1;
  for (const cat of BANNER_CATEGORY_FALLBACKS) {
    const pack = PACK_COPY[cat.slug];
    if (!pack) continue;
    for (const kind of ['hero', 'leaderboard', 'rectangle', 'billboard']) {
      const meta = SIZE_META[kind];
      const image =
        kind === 'hero'
          ? `/img/banners/marketplace/banner-${cat.slug}.png`
          : `/img/banners/marketplace/${cat.slug}-${kind}.svg`;
      items.push({
        id: `wwa-banner-${cat.slug}-${kind}`,
        catalog_id: `wwa-banner-${cat.slug}-${kind}`,
        slug: `wwa-${cat.slug}-${kind}`,
        title: pack.titles[kind],
        description: `Paid ${meta.label} banner for ${cat.name}. Ready to use for ads, social, and site placements. Not free — purchase unlocks download.`,
        business_name: pack.business,
        banner_image: image,
        download_url: image,
        destination_link: image,
        banner_size: meta.size,
        banner_size_display: meta.label,
        banner_category_slug: cat.slug,
        category_slug: cat.slug,
        category_name: cat.name,
        country: 'Global',
        city: 'Worldwide',
        promotion_tier: kind === 'hero' || kind === 'billboard' ? 'sponsored' : 'featured',
        promotion_badge: 'For sale',
        promotion_price: meta.price,
        price: meta.price,
        is_catalog: true,
        is_verified_business: true,
        status: 'active',
        views_count: 800 + n * 17,
        clicks_count: 40 + n * 3,
        ctr: (2.1 + (n % 5) * 0.3).toFixed(1),
        call_to_action: 'Buy & download',
      });
      n += 1;
    }
  }
  return items;
}

export const PAID_BANNER_CATALOG = buildCatalog();

export function resolveBannerCategoryKey(category) {
  if (category == null || category === 'all') return null;
  if (typeof category === 'object') {
    return category.slug || category.id || category.name || null;
  }
  return String(category);
}

export function matchBannerCategory(banner, categoryKey, categories = []) {
  if (!categoryKey) return true;
  const key = String(categoryKey).toLowerCase();
  const slug = (banner.banner_category_slug || banner.category_slug || '').toLowerCase();
  const name = (banner.category_name || '').toLowerCase();
  if (slug && (slug === key || slug.includes(key) || key.includes(slug))) return true;
  if (name && name === key) return true;

  const cat = categories.find((c) => {
    const cid = String(c.id ?? '');
    const cslug = String(c.slug ?? '').toLowerCase();
    const cname = String(c.name ?? '').toLowerCase();
    return cid === String(categoryKey) || cslug === key || cname === key;
  });
  if (!cat) return slug === key || name.includes(key);
  const cslug = String(cat.slug || '').toLowerCase();
  const cname = String(cat.name || '').toLowerCase();
  return slug === cslug || name === cname || String(banner.banner_category_id) === String(cat.id);
}

export function getPaidBannersForCategory(categoryKey, categories = []) {
  if (!categoryKey || categoryKey === 'all') return PAID_BANNER_CATALOG;
  return PAID_BANNER_CATALOG.filter((b) => matchBannerCategory(b, categoryKey, categories));
}

export function mergeBannersWithCatalog(apiBanners = [], categoryKey, categories = []) {
  const catalog = getPaidBannersForCategory(categoryKey, categories);
  const api = Array.isArray(apiBanners) ? apiBanners : [];
  const seen = new Set(api.map((b) => String(b.slug || b.id)));
  const extras = catalog.filter((b) => !seen.has(String(b.slug || b.id)));
  return [...extras, ...api];
}

export function getBannerPurchases() {
  try {
    return JSON.parse(localStorage.getItem(PURCHASE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function isBannerPurchased(id) {
  return Boolean(getBannerPurchases()[id]);
}

export function purchaseBanner(item) {
  const map = getBannerPurchases();
  const key = item.id || item.catalog_id;
  map[key] = {
    title: item.title,
    amount: item.price ?? item.promotion_price ?? 0,
    paidAt: new Date().toISOString(),
    download_token: item.download_token || null,
    download_url: item.download_url || null,
  };
  localStorage.setItem(PURCHASE_KEY, JSON.stringify(map));
  return map;
}

/** True when a URL points at the creative file (must not open freely in browser). */
export function isBannerCreativeFileUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.toLowerCase();
  return (
    u.includes('/storage/banner-images') ||
    u.includes('/img/banners/marketplace') ||
    (u.includes('/banner-ads/') && u.includes('/preview')) ||
    u.includes('/banner-ads/download/')
  );
}

/** Safe external Visit link — never the creative file. */
export function getSafeBannerVisitUrl(banner) {
  const link = banner?.destination_link || banner?.website_url || null;
  if (!link || isBannerCreativeFileUrl(link)) return null;
  return link;
}

/**
 * Force a paid file download (attachment). Never opens the image in a browser tab.
 */
export async function triggerBannerDownload(item) {
  const token =
    item?.download_token ||
    getBannerPurchases()[item?.id || item?.catalog_id]?.download_token;
  const apiBase = (
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_API_URL ||
    ''
  ).replace(/\/$/, '');

  let url =
    item?.download_url ||
    getBannerPurchases()[item?.id || item?.catalog_id]?.download_url ||
    null;

  if (token && apiBase) {
    url = `${apiBase}/banner-ads/download/${token}`;
  }

  if (!url || !String(url).includes('/banner-ads/download/')) {
    return false;
  }

  try {
    const tokenAuth = localStorage.getItem('token');
    const res = await fetch(url, {
      method: 'GET',
      headers: tokenAuth ? { Authorization: `Bearer ${tokenAuth}` } : {},
    });
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    const ext =
      /\.(jpe?g|png|webp|gif)(\?|$)/i.exec(
        res.headers.get('content-disposition') || item?.slug || ''
      )?.[1] || 'jpg';
    a.download = `${item.slug || item.id || 'banner'}.${ext}`;
    // Do NOT set target=_blank — that opens in browser and allows free save of preview
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
    return true;
  } catch {
    // Fallback: navigate same-tab to attachment URL (server forces download)
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `${item.slug || item.id || 'banner'}.jpg`);
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  }
}

/** Prefer live API categories; keep helper for any legacy callers */
export function mergeBannerCategories(apiCategories = []) {
  return Array.isArray(apiCategories) ? apiCategories : [];
}
