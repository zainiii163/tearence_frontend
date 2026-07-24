import { IT_SERVICE_CATEGORY_DEFS } from './itServiceCategories';

/**
 * Tech / IT services only — Clive: Fiverr-style, no accountants / legal / architecture.
 */
export const SERVICE_CATEGORY_GROUPS = [
  {
    slug: 'it-computing',
    name: 'IT & Computing',
    emoji: '💻',
    icon: 'Monitor',
    color: 'emerald',
    description: 'Web, apps, design, marketing & IT support',
    subcategories: IT_SERVICE_CATEGORY_DEFS.map((c) => ({
      slug: c.slug,
      name: c.name,
      emoji: c.emoji,
      keywords: c.keywords,
      apiSlug: c.slug,
    })),
  },
];

/** Flat tech category list for browse + forms */
export const TECH_SERVICE_CATEGORIES = IT_SERVICE_CATEGORY_DEFS.map((c) => ({
  slug: c.slug,
  name: c.name,
  emoji: c.emoji,
  keywords: c.keywords,
  apiSlug: c.slug,
}));

export const TRENDING_SERVICE_SEARCHES = [
  'Logo Design',
  'Web Development',
  'WordPress',
  'SEO',
  'App Development',
  'Digital Marketing',
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
  TECH_SERVICE_CATEGORIES.find((c) => c.slug === slug) || null;

export const allSubcategorySlugs = () =>
  TECH_SERVICE_CATEGORIES.map((s) => s.slug);

export default SERVICE_CATEGORY_GROUPS;
