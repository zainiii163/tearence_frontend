import {
  IT_SERVICE_CATEGORY_DEFS,
  SERVICE_MAIN_CATEGORIES,
  findMainCategory,
  findCategoryDef,
} from './itServiceCategories';

/**
 * Tech / IT services — Clive: category tiles (Logo Design, Book Writing, etc.)
 * with nested services under parents like Book Writing → Editing, Proofreading.
 */
export const SERVICE_CATEGORY_GROUPS = [
  {
    slug: 'it-computing',
    name: 'IT & Computing',
    emoji: '💻',
    icon: 'Monitor',
    color: 'emerald',
    description: 'Web, apps, design, marketing, books & IT support',
    subcategories: SERVICE_MAIN_CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      emoji: c.emoji,
      keywords: c.keywords,
      apiSlug: c.slug,
      children: c.children || [],
    })),
  },
];

/** Flat list for browse + forms */
export const TECH_SERVICE_CATEGORIES = IT_SERVICE_CATEGORY_DEFS.map((c) => ({
  slug: c.slug,
  name: c.name,
  emoji: c.emoji,
  keywords: c.keywords,
  apiSlug: c.slug,
  parentSlug: c.parentSlug || null,
}));

export const TRENDING_SERVICE_SEARCHES = [
  'Logo Design',
  'WordPress',
  'Book Writing',
  'Graphic Design',
  'Digital Marketing',
  'Advertising',
];

export const findGroupBySlug = (slug) =>
  SERVICE_CATEGORY_GROUPS.find((g) => g.slug === slug) || null;

export const findSubcategory = (groupSlug, subSlug) => {
  const group = findGroupBySlug(groupSlug) || SERVICE_CATEGORY_GROUPS[0];
  if (!group) return { group: null, subcategory: null };
  const subcategory =
    group.subcategories.find((s) => s.slug === subSlug || s.slug === groupSlug) ||
    TECH_SERVICE_CATEGORIES.find((s) => s.slug === subSlug || s.slug === groupSlug) ||
    null;
  return { group, subcategory };
};

export const findTechCategory = (slug) =>
  findCategoryDef(slug) ||
  TECH_SERVICE_CATEGORIES.find((c) => c.slug === slug) ||
  findMainCategory(slug) ||
  null;

export const allSubcategorySlugs = () => TECH_SERVICE_CATEGORIES.map((s) => s.slug);

export { SERVICE_MAIN_CATEGORIES, findMainCategory, getChildSlugs } from './itServiceCategories';

export default SERVICE_CATEGORY_GROUPS;
