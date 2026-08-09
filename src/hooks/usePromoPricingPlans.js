import { useCallback, useEffect, useState } from 'react';
import promoService from '../services/PromoService';
import { PROMO_PRICING_PLANS } from '../config/promoPricing';

/**
 * Load Filament-managed promo pricing plans for a marketplace vertical.
 * @param {string} vertical - property|services|jobs|events|buysell|vehicles|books|funding|...
 * @param {{ listingTiersOnly?: boolean }} options
 */
export default function usePromoPricingPlans(vertical, options = {}) {
  const listingTiersOnly = options.listingTiersOnly !== false;
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { plans: next } = await promoService.getPricingPlans({
        vertical,
        listingTiersOnly,
      });
      setPlans(Array.isArray(next) ? next : []);
    } catch (e) {
      setError(e?.message || 'Failed to load promotion plans');
      const fallback = PROMO_PRICING_PLANS.filter((p) =>
        listingTiersOnly ? ['promoted', 'featured', 'sponsored'].includes(p.tier) : true
      ).map((p) => ({
        ...p,
        id: p.tier || p.slug,
        price: p.price_usd,
        price_label: `$${Number(p.price_usd).toFixed(Number(p.price_usd) % 1 ? 2 : 0)}`,
        features: p.features || [],
        popular: Boolean(p.is_popular),
      }));
      setPlans(fallback);
    } finally {
      setLoading(false);
    }
  }, [vertical, listingTiersOnly]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { plans, loading, error, reload };
}
