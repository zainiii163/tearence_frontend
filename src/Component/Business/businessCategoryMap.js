import { CATEGORIES } from './BusinessFilters';

export const LOCAL_TO_API_SLUG = {
  retail: 'retail-shopping',
  restaurants: 'restaurants-food',
  services: 'professional-services',
  healthcare: 'healthcare-wellness',
  education: 'education-training',
  automotive: 'automotive',
  'real-estate': 'real-estate',
  entertainment: 'entertainment-leisure',
  travel: 'travel-hospitality',
  beauty: 'beauty-personal-care',
  pets: 'pet-services',
  'home-garden': 'home-garden',
  technology: 'technology-electronics',
  'sports-fitness': 'sports-fitness',
  industrial: 'industrial-manufacturing',
  'non-profit': 'non-profit-religious',
};

export const API_SLUG_TO_LOCAL = Object.fromEntries(
  Object.entries(LOCAL_TO_API_SLUG).map(([localId, slug]) => [slug, localId])
);

export const resolveCategoryId = (param) => {
  if (!param) return null;
  const normalized = param.toLowerCase().trim();

  if (CATEGORIES.some((c) => c.id === normalized)) return normalized;
  if (API_SLUG_TO_LOCAL[normalized]) return API_SLUG_TO_LOCAL[normalized];

  const byLabel = CATEGORIES.find(
    (c) => c.label.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalized
  );
  return byLabel?.id || null;
};

export const buildApiCategoryLookup = (apiCategories = []) => {
  const slugToId = {};
  const idToLocal = {};

  apiCategories.forEach((cat) => {
    const slug = (cat.slug || '').toLowerCase();
    const apiId = cat.category_id ?? cat.id;
    if (slug && apiId != null) slugToId[slug] = apiId;

    const localId = API_SLUG_TO_LOCAL[slug];
    if (localId && apiId != null) idToLocal[localId] = apiId;
  });

  return { slugToId, idToLocal };
};
