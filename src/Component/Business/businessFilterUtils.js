import { CATEGORIES } from './BusinessFilters';

const CATEGORY_KEYWORDS = {
  retail: ['retail', 'shopping', 'store'],
  restaurants: ['restaurant', 'food', 'cafe', 'dining'],
  services: ['service', 'professional', 'consulting', 'lawyer', 'accountant', 'plumber', 'legal', 'accounting'],
  healthcare: ['health', 'medical', 'wellness', 'doctor', 'clinic'],
  education: ['education', 'training', 'school', 'university'],
  automotive: ['auto', 'car', 'vehicle', 'automotive'],
  'real-estate': ['real estate', 'property', 'housing', 'commercial', 'industrial', 'lease', 'rental', 'for sale'],
  entertainment: ['entertainment', 'leisure', 'fun'],
  travel: ['travel', 'hospitality', 'hotel'],
  beauty: ['beauty', 'salon', 'spa', 'personal care'],
  pets: ['pet', 'animal', 'veterinary', 'grooming', 'pet food', 'pet product'],
  'home-garden': ['home', 'garden', 'furniture'],
  technology: ['technology', 'tech', 'electronics', 'software'],
  'sports-fitness': ['sports', 'fitness', 'gym'],
  industrial: ['industrial', 'manufacturing', 'factory'],
  'non-profit': ['non-profit', 'charity', 'religious', 'church'],
};

export const matchesBusinessCategory = (business, categoryId, apiCategoryLookup = {}) => {
  if (!categoryId) return true;

  const apiCategoryId = apiCategoryLookup?.idToLocal?.[categoryId];

  if (apiCategoryId != null && business.category_id != null) {
    return String(business.category_id) === String(apiCategoryId);
  }

  const keywords = CATEGORY_KEYWORDS[categoryId] || [];
  const businessCategory = (
    business.category ||
    business.business_category ||
    business.category_name ||
    business.category_slug ||
    ''
  ).toLowerCase();

  const searchableText = [
    businessCategory,
    business.business_name,
    business.business_description,
    business.business_type,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return keywords.some((keyword) => searchableText.includes(keyword));
};

export const countBusinessesInCategory = (businesses, categoryId, apiCategoryLookup = {}) =>
  businesses.filter((b) => matchesBusinessCategory(b, categoryId, apiCategoryLookup)).length;

export const isRegularBusiness = (business) =>
  !business?.featured &&
  !business?.is_featured &&
  !business?.is_promoted &&
  !business?.promoted &&
  !business?.is_sponsored &&
  !business?.sponsored &&
  !business?.verified &&
  business?.verification !== 'verified';

export const matchesBusinessPostType = (business, filters) => {
  const checks = [];
  if (filters.sponsored) checks.push(!!(business.is_sponsored || business.sponsored));
  if (filters.promoted) checks.push(!!(business.is_promoted || business.promoted));
  if (filters.featured) checks.push(!!(business.is_featured || business.featured));
  if (filters.verified) checks.push(!!(business.verified || business.verification === 'verified'));
  if (filters.other) checks.push(isRegularBusiness(business));
  return checks.some(Boolean);
};

export const hasActiveFilters = (filters = {}) =>
  Object.entries(filters).some(([key, value]) => {
    if (key === 'category') return false;
    if (typeof value === 'boolean') return value;
    return value !== '' && value != null;
  });

export const applyBusinessFilters = (businesses, filters = {}, apiCategoryLookup = {}) => {
  let result = [...businesses];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (b) =>
        b.business_name?.toLowerCase().includes(q) ||
        b.business_description?.toLowerCase().includes(q) ||
        b.business_address?.toLowerCase().includes(q)
    );
  }

  if (filters.category) {
    result = result.filter((b) =>
      matchesBusinessCategory(b, filters.category, apiCategoryLookup)
    );
  }

  if (filters.status) {
    result = result.filter((b) => (b.status || 'active').toLowerCase() === filters.status);
  }

  if (filters.city) {
    const city = filters.city.toLowerCase();
    result = result.filter((b) => (b.business_address || b.city || '').toLowerCase().includes(city));
  }

  if (filters.country) {
    const country = filters.country.toLowerCase();
    result = result.filter((b) => (b.country || b.business_address || '').toLowerCase().includes(country));
  }

  const hasPostType =
    filters.sponsored || filters.promoted || filters.featured || filters.verified || filters.other;

  if (hasPostType) {
    result = result.filter((b) => matchesBusinessPostType(b, filters));
  }

  return result;
};

export const getCategoryLabel = (categoryId) =>
  CATEGORIES.find((c) => c.id === categoryId)?.label || categoryId;
