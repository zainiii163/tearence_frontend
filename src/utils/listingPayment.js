import {
  getTierById,
  isPaidTier,
  isFreeTier,
  MIN_LISTING_PRICE,
  DEFAULT_LISTING_TIER_ID,
} from '../constants/listingTierOptions';

/**
 * Listing payment helpers for launch promo (free 3d allowed; paid from $10).
 */

export const assertPaidAmount = (amount, label = 'This item') => {
  const n = Number(amount);
  if (!Number.isFinite(n) || n < 0) {
    throw new Error(`${label} has an invalid amount.`);
  }
  if (n > 0 && n < MIN_LISTING_PRICE) {
    throw new Error(`${label} paid plans start at $${MIN_LISTING_PRICE}.`);
  }
  return n;
};

export const assertPaidTierSelection = (tierIdOrTier) => {
  const tier = typeof tierIdOrTier === 'object' ? tierIdOrTier : getTierById(tierIdOrTier);
  if (isFreeTier(tier)) return tier;
  if (!isPaidTier(tier)) {
    throw new Error(`Select a valid plan (Free or from $${MIN_LISTING_PRICE}).`);
  }
  return tier;
};

export const normalizeTierId = (tierId) => {
  if (!tierId || tierId === 'basic' || tierId === 'standard') {
    return DEFAULT_LISTING_TIER_ID;
  }
  return tierId;
};

/** Follow API create response into checkout when payment is required */
export const handleListingCreatePayment = (response, navigate) => {
  const data = response?.data || response || {};
  const paymentRequired =
    data.payment_required === true ||
    data.requires_payment === true ||
    String(data.status || '').includes('pending_payment');

  const checkoutUrl = data.checkout_url || data.payment_url || data.redirect_url;
  const amount = Number(data.amount ?? data.price ?? data.promotion_price ?? 0);

  if (checkoutUrl && typeof window !== 'undefined') {
    window.location.href = checkoutUrl;
    return { redirected: true };
  }

  if (paymentRequired && amount >= MIN_LISTING_PRICE && navigate) {
    const listingId = data.id || data.advert_id || data.listing_id;
    navigate('/payment', {
      state: {
        amount,
        listingId,
        paymentRequired: true,
        allowFree: false,
      },
    });
    return { redirected: true };
  }

  return { redirected: false, data };
};

export default {
  assertPaidAmount,
  assertPaidTierSelection,
  normalizeTierId,
  handleListingCreatePayment,
};
