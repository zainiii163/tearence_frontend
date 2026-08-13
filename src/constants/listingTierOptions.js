/**
 * Launch promotional advert tiers — fallback when API offline.
 * Live prices/durations come from GET /promo/pricing-plans (Filament-editable).
 */

export const MIN_LISTING_PRICE = 10;

export const DEFAULT_FREE_DURATION_DAYS = 3;

export const LISTING_TIERS = [
  {
    id: 'free',
    name: 'Free',
    subtitle: 'Basic listing',
    price: 0,
    duration_days: 3,
    benefits: ['Standard search listing', '3 days live', 'Free badge'],
    apiTier: 'basic',
    popular: false,
  },
  {
    id: 'paid',
    name: 'Paid',
    subtitle: '1 week listing',
    price: 10,
    duration_days: 7,
    benefits: ['Search priority', 'Paid badge', '1 week live'],
    apiTier: 'plus',
    popular: false,
  },
  {
    id: 'promoted',
    name: 'Promoted',
    subtitle: 'Highlighted for 1 week',
    price: 20,
    duration_days: 7,
    benefits: ['Highlighted card', 'Above standard', 'Promoted badge', '1 week live'],
    apiTier: 'plus',
    popular: true,
  },
  {
    id: 'featured',
    name: 'Featured',
    subtitle: 'Top of category — 1 week',
    price: 30,
    duration_days: 7,
    benefits: ['Top of category', 'Featured badge', 'Priority search', '1 week live'],
    apiTier: 'plus',
    popular: false,
  },
  {
    id: 'sponsored',
    name: 'Sponsored',
    subtitle: 'Maximum visibility — 1 week',
    price: 40,
    duration_days: 7,
    benefits: ['Homepage placement', 'Sponsored badge', '1 week live'],
    apiTier: 'premium',
    popular: false,
  },
];

/** Default selection for new posts */
export const DEFAULT_LISTING_TIER_ID = 'free';

/** Affiliate hop/cookie packages when advertising on WWA (fallback) */
export const AFFILIATE_COOKIE_PACKAGES = [
  {
    id: 'cookie_30',
    slug: 'cookie_30',
    name: '30-day cookie',
    tier: 'cookie',
    price: 20,
    price_usd: 20,
    duration_days: 30,
    description: 'Affiliate hop / cookie window — 30 days',
  },
  {
    id: 'cookie_60',
    slug: 'cookie_60',
    name: '60-day cookie',
    tier: 'cookie',
    price: 30,
    price_usd: 30,
    duration_days: 60,
    description: 'Affiliate hop / cookie window — 60 days',
  },
  {
    id: 'cookie_90',
    slug: 'cookie_90',
    name: '90-day cookie',
    tier: 'cookie',
    price: 40,
    price_usd: 40,
    duration_days: 90,
    description: 'Affiliate hop / cookie window — 90 days',
  },
];

/** Map UI tier id → sponsored-adverts API sponsorship_tier */
export const toSponsorshipApiTier = (tierId) => {
  if (!tierId || tierId === 'basic' || tierId === 'free' || tierId === 'standard') {
    return 'basic';
  }
  if (tierId === 'paid' || tierId === 'promoted') return 'plus';
  if (tierId === 'featured') return 'plus';
  if (tierId === 'sponsored') return 'premium';
  const tier = LISTING_TIERS.find((t) => t.id === tierId);
  return tier?.apiTier || tierId;
};

export const getTierById = (id) => {
  if (!id) return LISTING_TIERS.find((t) => t.id === DEFAULT_LISTING_TIER_ID) || LISTING_TIERS[0];
  return LISTING_TIERS.find((t) => t.id === id) || LISTING_TIERS[0];
};

export const isPaidTier = (tier) => {
  const price = typeof tier === 'object' ? Number(tier?.price) : Number(getTierById(tier)?.price);
  return Number.isFinite(price) && price >= MIN_LISTING_PRICE;
};

export const isFreeTier = (tier) => {
  const price = typeof tier === 'object' ? Number(tier?.price) : Number(getTierById(tier)?.price);
  return !Number.isFinite(price) || price < 0.01;
};
