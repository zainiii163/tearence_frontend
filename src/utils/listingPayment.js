import { getTierById, isPaidTier, MIN_LISTING_PRICE, DEFAULT_LISTING_TIER_ID } from '../constants/listingTierOptions';

/**
 * Shared guards for paid-only listing / purchase flows.
 */

export const assertPaidAmount = (amount, label = 'This item') => {
  const n = Number(amount);
  if (!Number.isFinite(n) || n < MIN_LISTING_PRICE) {
    throw new Error(`${label} requires payment of at least $${MIN_LISTING_PRICE}. Nothing is free.`);
  }
  return n;
};

export const assertPaidTierSelection = (tierIdOrTier) => {
  const tier = typeof tierIdOrTier === 'object' ? tierIdOrTier : getTierById(tierIdOrTier);
  if (!isPaidTier(tier)) {
    throw new Error(`Select a paid plan (from $${MIN_LISTING_PRICE}). Free listings are not available.`);
  }
  return tier;
};

export const normalizeTierId = (tierId) => {
  if (!tierId || tierId === 'basic' || tierId === 'free' || tierId === 'standard') {
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

  if (paymentRequired && navigate) {
    const listingId = data.id || data.advert_id || data.listing_id;
    navigate('/payment', {
      state: {
        amount: amount > 0 ? amount : MIN_LISTING_PRICE,
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
