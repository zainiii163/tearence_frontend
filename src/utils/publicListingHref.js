/**
 * Shared public listing URLs — always prefer slug (or id-title hybrid) over bare numeric ids.
 * Detail pages / APIs that accept slug OR id keep old numbered bookmarks working.
 */

const TITLE_FIELDS = [
  'title',
  'name',
  'product_service_title',
  'business_name',
  'headline',
  'job_title',
];

/** Lightweight slugify for URL keys (no dependency). */
export function slugifySegment(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * Public path key for a listing/post.
 * Order: slug → id-title hybrid → id → null
 */
export function listingPublicKey(item, options = {}) {
  if (item == null) return null;
  if (typeof item === 'string' || typeof item === 'number') {
    const raw = String(item).trim();
    return raw || null;
  }

  const slug = String(item.slug || item.public_slug || '').trim();
  if (slug && slug !== 'undefined' && slug !== 'null') {
    return slug;
  }

  const id =
    item.id ??
    item.source_id ??
    item.listing_id ??
    item.advert_id ??
    item.job_id ??
    item.project_id ??
    null;

  const titleFields = options.titleFields || TITLE_FIELDS;
  const title = titleFields.map((f) => item[f]).find((v) => v != null && String(v).trim());
  const titleSlug = slugifySegment(title);

  if (id != null && titleSlug && options.allowIdTitleHybrid !== false) {
    return `${id}-${titleSlug}`;
  }

  if (id != null && String(id).trim() !== '') {
    return String(id);
  }

  return titleSlug || null;
}

export function publicListingPath(basePath, item, options = {}) {
  const base = String(basePath || '').replace(/\/$/, '') || '';
  const key = listingPublicKey(item, options);
  if (!key) return base || '/';
  return `${base}/${encodeURIComponent(key).replace(/%2F/gi, '/')}`;
}

/** Vertical helpers — use these from grids/cards/browse pages. */
export const publicHref = {
  business: (item) => publicListingPath('/business', item, { allowIdTitleHybrid: false }),
  vehicle: (item) => publicListingPath('/vehicles', item),
  property: (item) => publicListingPath('/property', item),
  job: (item) => publicListingPath('/jobs', item),
  service: (item) => publicListingPath('/services', item),
  buySell: (item) => publicListingPath('/item', item),
  book: (item) => publicListingPath('/books', item),
  funding: (item) => publicListingPath('/funding', item),
  fundingProject: (item) => publicListingPath('/funding/project', item),
  store: (item) => publicListingPath('/store', item, { allowIdTitleHybrid: false }),
  events: (item) => publicListingPath('/events-venues', item),
  resorts: (item) => publicListingPath('/resorts-travel', item),
  images: (item) => publicListingPath('/images', item),
  software: (item) => publicListingPath('/software', item),
  donations: (item) => publicListingPath('/donations', item),
  sponsored: (item) => publicListingPath('/sponsored-adverts', item),
  promoted: (item) => publicListingPath('/promoted-adverts', item),
  featured: (item) => publicListingPath('/featured-adverts', item),
  affiliateOffer: (item) => {
    const id = String(item?.id || '').replace(/^business-/, '');
    return id ? `/affiliates/offer/${id}` : '/affiliates/marketplace';
  },
  community: (item) =>
    publicListingPath('/community', {
      slug: item?.slug || item?.community_id || item?.id,
    }, { allowIdTitleHybrid: false }),
};

export default publicHref;
