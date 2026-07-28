import { SERVICE_CATEGORY_GROUPS, TECH_SERVICE_CATEGORIES } from '../constants/serviceCategoryGroups';
import { IT_SERVICE_CATEGORY_DEFS, SERVICE_MAIN_CATEGORIES } from '../constants/itServiceCategories';

const IT_FALLBACK = IT_SERVICE_CATEGORY_DEFS.map((c, index) => ({
  id: index + 1,
  name: c.name,
  slug: c.slug,
  label: c.name,
  emoji: c.emoji,
  sort_order: index + 1,
  is_active: true,
  parent_slug: c.parentSlug || null,
  parent_id: c.parentSlug ? 1 : null,
}));

const EMOJI_BY_SLUG = Object.fromEntries(
  IT_SERVICE_CATEGORY_DEFS.map((d) => [d.slug, d.emoji])
);
SERVICE_MAIN_CATEGORIES.forEach((m) => {
  EMOJI_BY_SLUG[m.slug] = m.emoji;
  (m.children || []).forEach((c) => {
    EMOJI_BY_SLUG[c.slug] = c.emoji || m.emoji;
  });
});

/** True if value is a real short emoji / glyph, not a heroicon class name. */
export const isDisplayEmoji = (value) => {
  if (value == null) return false;
  const s = String(value).trim();
  if (!s) return false;
  if (/^heroicon[-_]/i.test(s)) return false;
  if (/^(lucide|fa|fas|far|mdi|icon)[-_]/i.test(s)) return false;
  if (s.length > 4) return false;
  return true;
};

/** Safe emoji for category chips (never prints heroicon-o-…). */
export const resolveCategoryEmoji = (slug, ...candidates) => {
  for (const c of candidates) {
    if (isDisplayEmoji(c)) return String(c).trim();
  }
  if (slug && EMOJI_BY_SLUG[slug]) return EMOJI_BY_SLUG[slug];
  return '💻';
};

const sanitizeCategory = (c, parentSlug = null) => {
  if (!c) return null;
  const slug = c.slug;
  return {
    ...c,
    name: c.name || c.label,
    label: c.label || c.name,
    emoji: resolveCategoryEmoji(slug, c.emoji, c.icon),
    icon: resolveCategoryEmoji(slug, c.emoji, c.icon),
    parentSlug: c.parentSlug || c.parent_slug || parentSlug || null,
  };
};

/**
 * Live DB may still have old single group "it-computing" + heroicon icons.
 * Prefer Clive's multi-main tree; keep API ids when slugs match.
 */
const buildMainsFromApi = (groups, flat) => {
  const bySlug = new Map();
  (flat || []).forEach((c) => {
    if (c?.slug) bySlug.set(c.slug, c);
  });
  (groups || []).forEach((g) => {
    if (g?.slug) bySlug.set(g.slug, g);
    (g.children || g.subcategories || []).forEach((c) => {
      if (c?.slug) bySlug.set(c.slug, c);
    });
  });

  const onlyLegacyIt =
    groups.length === 1 &&
    (groups[0].slug === 'it-computing' || /it\s*&\s*computing/i.test(groups[0].name || ''));

  if (onlyLegacyIt || groups.length === 0) {
    return SERVICE_MAIN_CATEGORIES.map((m) => {
      const liveParent = bySlug.get(m.slug);
      return {
        id: liveParent?.id || m.slug,
        slug: m.slug,
        name: m.name,
        emoji: resolveCategoryEmoji(m.slug, m.emoji, liveParent?.emoji, liveParent?.icon),
        description: m.description || liveParent?.description,
        children: (m.children || []).map((c) => {
          const live = bySlug.get(c.slug);
          return {
            id: live?.id || c.slug,
            slug: c.slug,
            name: c.name,
            emoji: resolveCategoryEmoji(c.slug, c.emoji, live?.emoji, live?.icon),
            parentSlug: m.slug,
          };
        }),
      };
    });
  }

  return groups
    .filter((g) => g && g.is_active !== false && g.slug !== 'it-computing')
    .map((g) => {
      const kids = (g.children || g.subcategories || []).map((c) =>
        sanitizeCategory(c, g.slug)
      );
      return {
        id: g.id,
        slug: g.slug,
        name: g.name,
        emoji: resolveCategoryEmoji(g.slug, g.emoji, g.icon),
        description: g.description,
        children: kids,
      };
    });
};

/**
 * Normalize GET /services/categories for Services & Solutions browse + forms.
 */
export const parseCategoriesResponse = (raw) => {
  const payload = raw?.data ?? raw ?? {};
  let flat = [];
  let groups = [];

  if (Array.isArray(raw?.groups)) groups = raw.groups;
  else if (Array.isArray(raw?.mains)) groups = raw.mains;
  else if (Array.isArray(payload?.groups)) groups = payload.groups;
  else if (Array.isArray(payload?.mains)) groups = payload.mains;

  if (Array.isArray(raw) && !raw.groups) flat = raw;
  else if (Array.isArray(payload) && !payload.groups) flat = payload;
  else if (Array.isArray(payload?.data)) flat = payload.data;
  else if (Array.isArray(raw?.data) && Array.isArray(raw.data) && !raw.groups) flat = raw.data;
  else if (Array.isArray(raw?.data)) flat = raw.data;

  flat = (flat || []).filter((c) => c && c.is_active !== false).map((c) => sanitizeCategory(c));

  let mains = buildMainsFromApi(groups || [], flat);

  if (!mains.length) {
    mains = SERVICE_MAIN_CATEGORIES.map((m) => ({ ...m }));
  }

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

  if (!flat.length) {
    flat = IT_FALLBACK;
  } else {
    flat = flat.map((c) => sanitizeCategory(c));
  }

  // Ensure form flat list includes parent leafs + children from mains
  const bySlug = new Set(flat.map((c) => c.slug));
  mains.forEach((m) => {
    if (!(m.children || []).length && !bySlug.has(m.slug)) {
      flat.push({
        id: m.id || m.slug,
        slug: m.slug,
        name: m.name,
        label: m.name,
        emoji: resolveCategoryEmoji(m.slug, m.emoji),
        is_active: true,
      });
    }
    (m.children || []).forEach((c) => {
      if (!bySlug.has(c.slug)) {
        flat.push({
          id: c.id || c.slug,
          slug: c.slug,
          name: c.name,
          label: c.name,
          emoji: resolveCategoryEmoji(c.slug, c.emoji),
          parent_slug: m.slug,
          is_active: true,
        });
      }
    });
  });

  return { flat, groups, mains };
};

export const findGroupInApi = (groups, slug) =>
  groups.find((g) => g.slug === slug) || null;

export const findSubcategoryInApi = (groups, groupSlug, subSlug) => {
  const group = findGroupInApi(groups, groupSlug) || groups[0];
  if (!group) return { group: null, subcategory: null };
  const subcategory =
    (group.subcategories || group.children || []).find((s) => s.slug === subSlug) || null;
  return { group, subcategory };
};

export const findMainInTree = (mains, slug) => {
  if (!slug || !mains?.length) return null;
  const direct = mains.find((m) => m.slug === slug);
  if (direct) return direct;
  for (const m of mains) {
    if ((m.children || []).some((c) => c.slug === slug)) return m;
  }
  return null;
};

export default parseCategoriesResponse;
