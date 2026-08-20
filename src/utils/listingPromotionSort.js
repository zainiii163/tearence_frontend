/** Featured listings — reserved for the top featured strip. */
export const isFeaturedListing = (item) =>
  !!(
    item?.featured ||
    item?.is_featured ||
    (item?.promotion_type &&
      String(item.promotion_type).toLowerCase() === 'featured') ||
    String(item?.promotion_tier).toLowerCase() === 'featured'
  );

/** Promoted listings — show in the middle promotion section. */
export const isPromotedListing = (item) =>
  !!(
    item?.promoted ||
    item?.is_promoted ||
    String(item?.promotion_type).toLowerCase() === 'promoted' ||
    String(item?.promotion_tier).toLowerCase() === 'promoted'
  );

/** Sponsored listings — show in the middle promotion section. */
export const isSponsoredListing = (item) =>
  !!(item?.sponsored || item?.is_sponsored || String(item?.promotion_type).toLowerCase() === 'sponsored');

export const isPremiumListing = (item) => isFeaturedListing(item) || isSponsoredListing(item);

export const isRegularListing = (item) => !isPremiumListing(item);

export const splitListingsByPromotion = (items = []) => ({
  featured: items.filter(isFeaturedListing),
  sponsored: items.filter(
    (item) => isSponsoredListing(item) && !isFeaturedListing(item)
  ),
  promoted: items.filter(
    (item) =>
      isPromotedListing(item) &&
      !isFeaturedListing(item) &&
      !isSponsoredListing(item)
  ),
  regular: items.filter(
    (item) =>
      !isFeaturedListing(item) &&
      !isPromotedListing(item) &&
      !isSponsoredListing(item)
  ),
});

/**
 * Pick listings for the category Featured slider only.
 * Clive: Featured on the top slider; Sponsored / Promoted are separate sections.
 */
export const pickPremiumForReel = (items = [], { limit = 12, allowFallback = false } = {}) => {
  const list = Array.isArray(items) ? items : [];
  const featured = list.filter(isFeaturedListing);
  if (featured.length) return featured.slice(0, limit);

  if (allowFallback && list.length) return list.slice(0, limit);
  return [];
};
