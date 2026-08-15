import api from '../services/api';
import { buildConfirmPaymentPayload } from './paymentDefence';
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

const pickListingId = (data = {}) =>
  data.id ||
  data.advert_id ||
  data.listing_id ||
  data.upsell_id ||
  data?.advert?.id ||
  data?.data?.id ||
  data?.data?.advert?.id ||
  data?.offer?.id ||
  null;

const matchPlan = (plans, key) => {
  const k = String(key || '').toLowerCase();
  if (!k) return null;
  return (plans || []).find((p) =>
    [p.id, p.tier, p.slug, p.name].some((v) => String(v || '').toLowerCase() === k)
  );
};

const FREE_TIER_KEYS = new Set(['free', 'basic', 'standard', 'none', '']);

/** Resolve a listing/promo amount from Filament plans, listing tiers, or a raw number. */
export const resolvePromoAmount = (tierKey, plans = []) => {
  if (tierKey == null) return 0;
  if (typeof tierKey === 'number') return Number.isFinite(tierKey) ? tierKey : 0;

  const key = String(tierKey).trim();
  const fromPlans = matchPlan(plans, key);
  if (fromPlans) {
    return Number(fromPlans.price_usd ?? fromPlans.price ?? 0) || 0;
  }

  if (FREE_TIER_KEYS.has(key.toLowerCase())) return 0;

  const listing = getTierById(key);
  if (listing && String(listing.id).toLowerCase() === key.toLowerCase()) {
    return Number(listing.price) || 0;
  }

  const n = Number(key.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/** Follow API create response into checkout when payment is required */
export const handleListingCreatePayment = (response, navigate) => {
  // Prefer the full API envelope so payment_required / amount are not lost under nested `data`
  const envelope = response && typeof response === 'object' ? response : {};
  const nested =
    envelope.data && typeof envelope.data === 'object' && !Array.isArray(envelope.data)
      ? envelope.data
      : {};

  const paymentRequired =
    envelope.payment_required === true ||
    envelope.requires_payment === true ||
    nested.payment_required === true ||
    nested.requires_payment === true ||
    String(envelope.status || nested.status || '').includes('pending');

  const checkoutUrl =
    envelope.checkout_url ||
    envelope.payment_url ||
    envelope.redirect_url ||
    nested.checkout_url;

  const amount = Number(
    envelope.amount ??
      envelope.price ??
      envelope.promotion_price ??
      nested.amount ??
      nested.price ??
      nested.promotion_price ??
      nested.upsell_price ??
      nested.sponsorship_price ??
      0
  );

  if (checkoutUrl && typeof window !== 'undefined') {
    window.location.href = checkoutUrl;
    return { redirected: true };
  }

  const listingId = pickListingId(envelope) || pickListingId(nested);

  // Only redirect when the API explicitly requires payment OR amount is paid and listing is pending
  const shouldCheckout =
    (envelope.payment_required === true ||
      envelope.requires_payment === true ||
      nested.payment_required === true) &&
    amount >= MIN_LISTING_PRICE;

  if (shouldCheckout && navigate && listingId) {
    navigate('/payment', {
      state: {
        amount,
        listingId,
        paymentRequired: true,
        allowFree: false,
        description:
          envelope.description ||
          envelope.title ||
          envelope.message ||
          nested.title ||
          'Worldwide Adverts listing payment — PayPal or crypto (USDT/USDC)',
        upsellType:
          envelope.upsell_type || nested.upsell_type || envelope.promotion_tier || 'listing',
        upsellId: listingId,
        returnTo: envelope.return_to || '/dashboard',
      },
    });
    return { redirected: true, listingId, amount };
  }

  return { redirected: false, data: envelope, listingId, amount };
};

/**
 * After a successful create: follow API checkout if present, otherwise open
 * PayPal + crypto checkout when the selected plan is paid.
 */
export const maybeCheckoutAfterCreate = (navigate, response, {
  amount,
  listingId,
  description,
  upsellType = 'listing',
  returnTo = '/dashboard',
  skip = false,
} = {}) => {
  if (skip || !navigate) return false;

  const payment = handleListingCreatePayment(response, navigate);
  if (payment.redirected) return true;

  const id =
    listingId ||
    payment.listingId ||
    pickListingId(response?.data || {}) ||
    pickListingId(response || {});

  const total = Number(amount ?? payment.amount ?? 0);
  return startListingCheckout(navigate, {
    amount: total,
    listingId: id,
    description,
    upsellType,
    returnTo,
  });
};

export const startListingCheckout = (navigate, {
  amount,
  listingId,
  description,
  upsellType = 'listing',
  returnTo = '/dashboard',
} = {}) => {
  const total = Number(amount) || 0;
  if (!navigate || total < MIN_LISTING_PRICE) return false;
  navigate('/payment', {
    state: {
      amount: total,
      listingId,
      upsellId: listingId,
      upsellType,
      paymentRequired: true,
      allowFree: false,
      description: description || 'Worldwide Adverts listing payment — PayPal or crypto (USDT/USDC)',
      returnTo,
    },
  });
  return true;
};

/**
 * Map checkout upsellType → API confirm endpoint.
 * Called after PaymentProcessor success so the listing goes live.
 */
export const getListingConfirmPath = (upsellType, listingId) => {
  const id = encodeURIComponent(String(listingId));
  const type = String(upsellType || 'listing').toLowerCase();

  const map = {
    featured: `/featured-adverts/${id}/complete-payment`,
    featured_advert: `/featured-adverts/${id}/complete-payment`,
    buysell: `/buysell/${id}/confirm-promotion`,
    buy_sell: `/buysell/${id}/confirm-promotion`,
    listing: `/buysell/${id}/confirm-promotion`,
    sponsored: `/sponsored-adverts/${id}/complete-payment`,
    sponsored_advert: `/sponsored-adverts/${id}/complete-payment`,
    promoted: `/promoted-adverts/${id}/complete-payment`,
    promoted_advert: `/promoted-adverts/${id}/complete-payment`,
    banner: `/banner-ads/${id}/complete-payment`,
    banner_advert: `/banner-ads/${id}/complete-payment`,
    vehicles: `/vehicles-adverts/${id}/payment`,
    vehicle: `/vehicles-adverts/${id}/payment`,
    vehicle_advert: `/vehicles-adverts/${id}/payment`,
    books: `/books-adverts/${id}/payment`,
    book: `/books-adverts/${id}/payment`,
    book_listing: `/books-adverts/${id}/payment`,
    property_upsell: `/property-upsells/${id}/complete-payment`,
    property: `/property-upsells/${id}/complete-payment`,
    job: `/job-upsell/${id}/complete-payment`,
    jobs: `/job-upsell/${id}/complete-payment`,
    job_listing: `/job-upsell/${id}/complete-payment`,
    job_upsell: `/job-upsell/${id}/complete-payment`,
    candidate: `/candidate-upsell/${id}/complete-payment`,
    job_seeker: `/candidate-upsell/${id}/complete-payment`,
    affiliate: `/affiliates/business-offers/${id}/complete-payment`,
    affiliate_offer: `/affiliates/business-offers/${id}/complete-payment`,
    images: `/images-adverts/${id}/payment`,
    image: `/images-adverts/${id}/payment`,
    template: null,
    templates: null,
    classified: null,
    services: null,
    donations: null,
    funding: null,
    business: null,
    'events-venues': null,
    'resorts-travel': null,
  };

  const path = map[type];
  return path || null;
};

/**
 * Confirm server-side payment after client checkout succeeds.
 * Returns true when confirmation succeeded or was not needed.
 */
export const confirmListingPaymentAfterCheckout = async (paymentResult, {
  upsellType,
  upsellId,
  listingId,
} = {}) => {
  const id = upsellId || listingId || paymentResult?.upsellId;
  const type = upsellType || paymentResult?.upsellType || 'listing';
  if (!id) return { confirmed: false, skipped: true };

  const path = getListingConfirmPath(type, id);
  if (!path) return { confirmed: false, skipped: true };

  const payload = buildConfirmPaymentPayload(paymentResult, {
    paymentMethod: paymentResult?.paymentMethod || 'paypal',
  });

  const { data } = await api.post(path, {
    ...payload,
    transaction_id: payload.payment_id,
    payment_intent_id: payload.payment_id,
  });

  if (data?.success === false) {
    throw new Error(data?.message || 'Could not confirm listing payment.');
  }

  return { confirmed: true, data };
};

export default {
  assertPaidAmount,
  assertPaidTierSelection,
  normalizeTierId,
  resolvePromoAmount,
  handleListingCreatePayment,
  maybeCheckoutAfterCreate,
  startListingCheckout,
  getListingConfirmPath,
  confirmListingPaymentAfterCheckout,
};
