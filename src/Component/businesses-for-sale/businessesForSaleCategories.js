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
  { id: 'ebooks', group: 'online', name: 'eBooks & Digital', keywords: ['ebook', 'digital', 'content', 'online business'] },
  { id: 'online-stores', group: 'online', name: 'Online Stores', keywords: ['online store', 'ecommerce', 'shopify', 'amazon'] },
  { id: 'shops', group: 'physical', name: 'Shops & Retail', keywords: ['shop', 'retail', 'store', 'boutique'] },
  { id: 'garages', group: 'physical', name: 'Garages & Automotive', keywords: ['garage', 'automotive', 'mechanic', 'mot'] },
  { id: 'restaurants', group: 'physical', name: 'Restaurants & Cafes', keywords: ['restaurant', 'cafe', 'food', 'takeaway'] },
  { id: 'hotels', group: 'physical', name: 'Hotels & Hospitality', keywords: ['hotel', 'hospitality', 'bnb', 'guest house'] },
  { id: 'salons', group: 'physical', name: 'Salons & Services', keywords: ['salon', 'barber', 'spa', 'beauty'] },
  { id: 'warehouses', group: 'physical', name: 'Industrial & Warehouses', keywords: ['warehouse', 'industrial', 'factory', 'workshop'] },
];

export const getCategoryById = (id) => BUSINESS_SALE_CATEGORIES.find((c) => c.id === id) || null;

export const matchListingToCategory = (listing, categoryId) => {
  if (!categoryId) return true;
  const cat = getCategoryById(categoryId);
  if (!cat) return true;

  const haystack = [
    listing.title,
    listing.tagline,
    listing.description,
    listing.category?.name,
    listing.category_name,
    listing.business_name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return cat.keywords.some((k) => haystack.includes(k));
};

export const matchListingToGroup = (listing, groupId) => {
  if (!groupId) return true;
  const cats = BUSINESS_SALE_CATEGORIES.filter((c) => c.group === groupId);
  return cats.some((cat) => matchListingToCategory(listing, cat.id));
};
