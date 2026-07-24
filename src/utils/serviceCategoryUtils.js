import { SERVICE_CATEGORY_GROUPS, TECH_SERVICE_CATEGORIES } from '../constants/serviceCategoryGroups';
import { IT_SERVICE_CATEGORY_DEFS } from '../constants/itServiceCategories';

const IT_FALLBACK = IT_SERVICE_CATEGORY_DEFS.map((c, index) => ({
  id: index + 1,
  name: c.name,
  slug: c.slug,
  label: c.name,
  emoji: c.emoji,
  sort_order: index + 1,
  is_active: true,
  group_slug: 'it-computing',
  parent_id: 1,
}));

/**
 * Normalize GET /services/categories — tech leaves only (Clive: IT services).
 */
export const parseCategoriesResponse = (raw) => {
  const payload = raw?.data ?? raw ?? {};
  let flat = [];
  let groups = [];

  if (Array.isArray(raw?.groups)) groups = raw.groups;
  else if (Array.isArray(payload?.groups)) groups = payload.groups;

  if (Array.isArray(raw)) flat = raw;
  else if (Array.isArray(payload)) flat = payload;
  else if (Array.isArray(payload?.data)) flat = payload.data;
  else if (Array.isArray(raw?.data)) flat = raw.data;

  const allowed = new Set(IT_SERVICE_CATEGORY_DEFS.map((d) => d.slug));

  flat = flat.filter(
    (c) => c && c.is_active !== false && (c.parent_id != null || allowed.has(c.slug)) && allowed.has(c.slug)
  );

  // Prefer only IT group from API
  groups = groups.filter((g) => g.slug === 'it-computing');

  if (!groups.length) {
    groups = SERVICE_CATEGORY_GROUPS.map((g) => ({
      slug: g.slug,
      name: g.name,
      description: g.description,
      emoji: g.emoji,
      icon: g.icon,
      color: g.color,
      subcategories: (g.subcategories || TECH_SERVICE_CATEGORIES).map((s, i) => ({
        id: s.slug,
        slug: s.slug,
        name: s.name,
        emoji: s.emoji,
        sort_order: i + 1,
      })),
    }));
  }

  if (!flat.length) flat = IT_FALLBACK;

  return { flat, groups };
};

export const findGroupInApi = (groups, slug) =>
  groups.find((g) => g.slug === slug) || null;

export const findSubcategoryInApi = (groups, groupSlug, subSlug) => {
  const group = findGroupInApi(groups, groupSlug) || groups[0];
  if (!group) return { group: null, subcategory: null };
  const subcategory =
    (group.subcategories || []).find((s) => s.slug === subSlug) || null;
  return { group, subcategory };
};

export default parseCategoriesResponse;
