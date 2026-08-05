import api from '../api';
import { PROMO_PRICING_PLANS, DEFAULT_FREE_DURATION_DAYS } from '../config/promoPricing';

const promoService = {
  getPricingPlans: async () => {
    try {
      const response = await api.get('/promo/pricing-plans');
      const plans = response.data?.data || response.data || [];
      if (Array.isArray(plans) && plans.length > 0) {
        return {
          plans,
          defaultFreeDurationDays:
            response.data?.default_free_duration_days || DEFAULT_FREE_DURATION_DAYS,
        };
      }
    } catch (e) {
      console.warn('promo pricing API unavailable, using fallback', e?.message);
    }
    return { plans: PROMO_PRICING_PLANS, defaultFreeDurationDays: DEFAULT_FREE_DURATION_DAYS };
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
