/** Featured / promoted listings — show first in category browse results. */
export const isFeaturedListing = (item) =>
  !!(
    item?.featured ||
    item?.is_featured ||
    item?.is_promoted ||
    item?.promoted ||
    (item?.promotion_type &&
      ['featured', 'promoted', 'network_boost'].includes(String(item.promotion_type).toLowerCase()))
  );

/** Sponsored listings — show in bottom section on every category page. */
export const isSponsoredListing = (item) =>
  !!(item?.sponsored || item?.is_sponsored || String(item?.promotion_type).toLowerCase() === 'sponsored');

export const isPremiumListing = (item) => isFeaturedListing(item) || isSponsoredListing(item);

export const isRegularListing = (item) => !isPremiumListing(item);

export const splitListingsByPromotion = (items = []) => ({
  featured: items.filter(isFeaturedListing),
  sponsored: items.filter(isSponsoredListing),
  regular: items.filter((item) => !isFeaturedListing(item) && !isSponsoredListing(item)),
});

/**
 * Pick listings for the category premium reel.
 * Prefers featured/sponsored; falls back to live/paid tags or first items when the hub is inherently premium.
 */
export const pickPremiumForReel = (items = [], { limit = 12, allowFallback = false } = {}) => {
  const list = Array.isArray(items) ? items : [];
  const premium = list.filter(isPremiumListing);
  if (premium.length) return premium.slice(0, limit);

  const tagged = list.filter(
    (item) =>
      item?.isLive ||
      item?.is_live ||
      ['paid', 'live', 'premium', 'featured'].includes(String(item?.tag || '').toLowerCase()) ||
      item?.promotion_tier === 'featured' ||
      item?.promotion_tier === 'sponsored' ||
      item?.promotion_tier === 'promoted'
  );
  if (tagged.length) return tagged.slice(0, limit);

  if (allowFallback && list.length) return list.slice(0, limit);
  return [];
};
