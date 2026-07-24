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
