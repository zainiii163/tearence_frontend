/** Launch promo matrix — fallback when API unavailable (Filament is source of truth) */
export const DEFAULT_FREE_DURATION_DAYS = 3;

export const PROMO_PRICING_PLANS = [
  {
    slug: 'free',
    name: 'Free Ad',
    tier: 'free',
    price_usd: 0,
    duration_days: 3,
    duration_label: '3 days',
    description: 'Basic listing — runs for 3 days',
    features: ['Standard search listing', '3 days live', 'Free badge'],
    is_popular: false,
  },
  {
    slug: 'paid',
    name: 'Paid Advert',
    tier: 'paid',
    price_usd: 10,
    duration_days: 7,
    duration_label: '1 week',
    description: 'Paid listing for 1 week',
    features: ['Search priority', 'Paid badge', '1 week live'],
    is_popular: false,
  },
  {
    slug: 'promoted',
    name: 'Promoted Ad',
    tier: 'promoted',
    price_usd: 20,
    duration_days: 7,
    duration_label: '1 week',
    description: 'Highlighted promotion for 1 week',
    features: ['Highlighted card', 'Above standard', 'Promoted badge', '1 week live'],
    is_popular: true,
  },
  {
    slug: 'featured',
    name: 'Featured Ad',
    tier: 'featured',
    price_usd: 30,
    duration_days: 7,
    duration_label: '1 week',
    description: 'Top of category for 1 week',
    features: ['Top of category', 'Featured badge', 'Priority search', '1 week live'],
    is_popular: false,
  },
  {
    slug: 'sponsored',
    name: 'Sponsored Ad',
    tier: 'sponsored',
    price_usd: 40,
    duration_days: 7,
    duration_label: '1 week',
    description: 'Maximum visibility for 1 week',
    features: ['Homepage placement', 'Category top', 'Sponsored badge', '1 week live'],
    is_popular: false,
  },
  {
    slug: 'cookie_30',
    name: 'Affiliate Cookie — 30 Days',
    tier: 'cookie',
    price_usd: 20,
    duration_days: 30,
    duration_label: '30 days',
    description: 'Promotional affiliate hop / cookie window — 30 days',
    features: ['30-day cookie', 'Hop links on WWA'],
    vertical: 'affiliates',
  },
  {
    slug: 'cookie_60',
    name: 'Affiliate Cookie — 60 Days',
    tier: 'cookie',
    price_usd: 30,
    duration_days: 60,
    duration_label: '60 days',
    description: 'Promotional affiliate hop / cookie window — 60 days',
    features: ['60-day cookie', 'Hop links on WWA'],
    vertical: 'affiliates',
  },
  {
    slug: 'cookie_90',
    name: 'Affiliate Cookie — 90 Days',
    tier: 'cookie',
    price_usd: 40,
    duration_days: 90,
    duration_label: '90 days',
    description: 'Promotional affiliate hop / cookie window — 90 days',
    features: ['90-day cookie', 'Hop links on WWA'],
    vertical: 'affiliates',
  },
];

export function formatDurationLabel(days) {
  const d = Number(days) || 0;
  if (d === 3) return '3 days';
  if (d === 30) return '30 days';
  if (d === 60) return '60 days';
  if (d === 90) return '90 days';
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

export function affiliateCookieFallbackPlans() {
  return PROMO_PRICING_PLANS.filter((p) => p.tier === 'cookie');
}
