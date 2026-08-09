import api from '../api';
import { PROMO_PRICING_PLANS, DEFAULT_FREE_DURATION_DAYS } from '../config/promoPricing';

const normalizePlan = (p) => {
  const price = Number(p.price_usd ?? p.price ?? 0);
  return {
    ...p,
    id: p.id || p.tier || p.slug,
    slug: p.slug,
    tier: p.tier,
    name: p.name,
    price,
    price_usd: price,
    price_label:
      p.price_label ||
      `$${price.toFixed(price % 1 ? 2 : 0)}`,
    duration_days: p.duration_days,
    duration_label: p.duration_label,
    description: p.description,
    features: Array.isArray(p.features) ? p.features : (Array.isArray(p.benefits) ? p.benefits : []),
    benefits: Array.isArray(p.benefits) ? p.benefits : (Array.isArray(p.features) ? p.features : []),
    popular: Boolean(p.popular || p.is_popular),
    is_popular: Boolean(p.popular || p.is_popular),
    sort_order: p.sort_order ?? 0,
  };
};

const promoService = {
  /**
   * @param {{ vertical?: string, listingTiersOnly?: boolean }} [opts]
   */
  getPricingPlans: async (opts = {}) => {
    const vertical = opts.vertical || '';
    const listingTiersOnly = Boolean(opts.listingTiersOnly);
    try {
      const params = new URLSearchParams();
      if (vertical) params.set('vertical', vertical);
      if (listingTiersOnly) params.set('listing_tiers', '1');
      const qs = params.toString();
      const response = await api.get(`/promo/pricing-plans${qs ? `?${qs}` : ''}`);
      const plans = response.data?.data || response.data || [];
      if (Array.isArray(plans) && plans.length > 0) {
        return {
          plans: plans.map(normalizePlan),
          defaultFreeDurationDays:
            response.data?.default_free_duration_days || DEFAULT_FREE_DURATION_DAYS,
        };
      }
    } catch (e) {
      console.warn('promo pricing API unavailable, using fallback', e?.message || e);
    }

    let plans = PROMO_PRICING_PLANS.map(normalizePlan);
    if (listingTiersOnly) {
      plans = plans.filter((p) => ['promoted', 'featured', 'sponsored'].includes(p.tier));
    }
    return { plans, defaultFreeDurationDays: DEFAULT_FREE_DURATION_DAYS };
  },

  validateCode: async ({ code, tier, plan_slug, original_price }) => {
    const response = await api.post('/promo/codes/validate', {
      code,
      tier,
      plan_slug,
      original_price,
    });
    return response.data;
  },

  extendDuration: async (payload) => {
    const response = await api.post('/promo/extend-duration', payload);
    return response.data;
  },
};

export default promoService;
