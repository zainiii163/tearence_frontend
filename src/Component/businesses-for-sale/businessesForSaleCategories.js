export const BUSINESS_SALE_GROUPS = [
  {
    id: 'online',
    name: 'Online Businesses',
    subtitle: 'Websites, apps, eBooks, SaaS and digital assets',
    emoji: '🌐',
  },
  {
    id: 'physical',
    name: 'Physical Businesses',
    subtitle: 'Shops, garages, restaurants, hotels and more',
    emoji: '🏪',
  },
];

export const BUSINESS_SALE_CATEGORIES = [
  { id: 'websites', group: 'online', name: 'Websites', keywords: ['website', 'web', 'domain', 'ecommerce site'] },
  { id: 'apps', group: 'online', name: 'Apps & Software', keywords: ['app', 'software', 'saas', 'mobile'] },
  { id: 'ebooks', group: 'online', name: 'eBooks & Digital', keywords: ['ebook', 'digital', 'content', 'online business', 'digital product'] },
  { id: 'online-stores', group: 'online', name: 'Online Stores', keywords: ['online store', 'ecommerce', 'shopify', 'amazon', 'etsy'] },
  { id: 'shops', group: 'physical', name: 'Shops & Retail', keywords: ['shop', 'retail', 'store', 'boutique', 'high street'] },
  { id: 'garages', group: 'physical', name: 'Garages & Automotive', keywords: ['garage', 'automotive', 'mechanic', 'mot', 'car wash'] },
  { id: 'restaurants', group: 'physical', name: 'Restaurants & Cafes', keywords: ['restaurant', 'cafe', 'food', 'takeaway', 'catering'] },
  { id: 'hotels', group: 'physical', name: 'Hotels & Hospitality', keywords: ['hotel', 'hospitality', 'bnb', 'guest house', 'bnb'] },
  { id: 'salons', group: 'physical', name: 'Salons & Services', keywords: ['salon', 'barber', 'spa', 'beauty', 'hairdresser'] },
  { id: 'warehouses', group: 'physical', name: 'Industrial & Warehouses', keywords: ['warehouse', 'industrial', 'factory', 'workshop'] },
];

export const getCategoryById = (id) => BUSINESS_SALE_CATEGORIES.find((c) => c.id === id) || null;

export const getGroupById = (id) => BUSINESS_SALE_GROUPS.find((g) => g.id === id) || null;

const categoryText = (value) => {
  if (value == null || value === '') return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    return [value.name, value.slug, value.label, value.title].filter(Boolean).map(String).join(' ');
  }
  return '';
};

const listingHaystack = (listing) =>
  [
    listing.title,
    listing.tagline,
    listing.description,
    listing.business_name,
    listing.business_sale_category,
    listing.business_sale_type,
    categoryText(listing.category),
    listing.category_name,
    listing.category_slug,
    Array.isArray(listing.tags) ? listing.tags.join(' ') : '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

/** Resolve stored sale category id from listing (explicit field preferred). */
export const resolveListingSaleCategory = (listing) => {
  const explicit = listing?.business_sale_category || listing?.sale_category;
  if (explicit && getCategoryById(String(explicit))) {
    return String(explicit);
  }

  const haystack = listingHaystack(listing);
  const hit = BUSINESS_SALE_CATEGORIES.find(
    (cat) =>
      haystack.includes(cat.id.replace(/-/g, ' ')) ||
      haystack.includes(cat.id) ||
      cat.keywords.some((k) => haystack.includes(k))
  );
  return hit?.id || null;
};

export const resolveListingSaleType = (listing) => {
  const explicit = listing?.business_sale_type || listing?.sale_type;
  if (explicit === 'online' || explicit === 'physical') return explicit;

  const catId = resolveListingSaleCategory(listing);
  if (catId) return getCategoryById(catId)?.group || null;

  const haystack = listingHaystack(listing);
  if (/\bonline\b|digital|saas|website|ecommerce|e-?book|app\b/.test(haystack)) return 'online';
  if (/\bphysical\b|brick|shop|restaurant|garage|hotel|salon|warehouse|retail/.test(haystack)) {
    return 'physical';
  }
  return null;
};

export const matchListingToCategory = (listing, categoryId) => {
  if (!categoryId) return true;
  const cat = getCategoryById(categoryId);
  if (!cat) return true;

  const resolved = resolveListingSaleCategory(listing);
  if (resolved) return resolved === categoryId;

  return cat.keywords.some((k) => listingHaystack(listing).includes(k));
};

export const matchListingToGroup = (listing, groupId) => {
  if (!groupId) return true;
  const resolved = resolveListingSaleType(listing);
  if (resolved) return resolved === groupId;
  const cats = BUSINESS_SALE_CATEGORIES.filter((c) => c.group === groupId);
  return cats.some((cat) => matchListingToCategory(listing, cat.id));
};
