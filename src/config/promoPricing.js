/** Clive promo pricing matrix — fallback when API unavailable */
export const DEFAULT_FREE_DURATION_DAYS = 30;

export const PROMO_PRICING_PLANS = [
  {
    slug: 'sponsored',
    name: 'Sponsored',
    tier: 'sponsored',
    price_usd: 100,
    duration_days: 30,
    duration_label: '1 month',
    description: 'Maximum visibility for 1 month',
    features: ['Homepage placement', 'Category top', 'Social promotion', 'Sponsored badge'],
  },
  {
    slug: 'featured',
    name: 'Featured',
    tier: 'featured',
    price_usd: 30,
    duration_days: 14,
    duration_label: '2 weeks',
    description: 'Top of category for 2 weeks',
    features: ['Top of category', 'Featured badge', 'Priority search'],
  },
  {
    slug: 'promoted',
    name: 'Promoted',
    tier: 'promoted',
    price_usd: 50,
    duration_days: 21,
    duration_label: '3 weeks',
    description: 'Highlighted promotion for 3 weeks',
    features: ['Highlighted card', 'Above standard', 'Promoted badge'],
  },
  {
    slug: 'paid_1w',
    name: 'Paid Advert — 1 Week',
    tier: 'paid',
    price_usd: 10,
    duration_days: 7,
    duration_label: '1 week',
    description: 'Paid listing for 1 week',
    features: ['Search priority', 'Paid badge'],
  },
  {
    slug: 'paid_2w',
    name: 'Paid Advert — 2 Weeks',
    tier: 'paid',
    price_usd: 15,
    duration_days: 14,
    duration_label: '2 weeks',
    description: 'Paid listing for 2 weeks',
    features: ['Search priority', 'Paid badge'],
  },
  {
    slug: 'paid_4w',
    name: 'Paid Advert — 4 Weeks',
    tier: 'paid',
    price_usd: 20,
    duration_days: 28,
    duration_label: '4 weeks',
    description: 'Paid listing for 4 weeks',
    features: ['Search priority', 'Paid badge'],
  },
];

export function formatDurationLabel(days) {
  const d = Number(days) || 0;
  if (d === 30) return '1 month';
  if (d % 7 === 0) {
    const w = d / 7;
    return w === 1 ? '1 week' : `${w} weeks`;
  }
  return `${d} days`;
}

export function planByTier(tier, plans = PROMO_PRICING_PLANS) {
  return plans.find((p) => p.tier === tier) || null;
}

export function planBySlug(slug, plans = PROMO_PRICING_PLANS) {
  return plans.find((p) => p.slug === slug) || null;
}
