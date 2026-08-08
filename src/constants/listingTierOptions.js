/** Paid listing tiers only — nothing free (Clive / marketplace policy) */

export const MIN_LISTING_PRICE = 10;

export const LISTING_TIERS = [
  {
    id: 'promoted',
    name: 'Paid',
    subtitle: 'Boost in search results',
    price: 29,
    benefits: ['Higher in search results', '60 days listing', 'Priority support', 'Paid badge'],
    apiTier: 'plus',
    popular: false,
  },
  {
    id: 'featured',
    name: 'Featured',
    subtitle: 'Top of category pages',
    price: 49,
    benefits: ['Featured section placement', '90 days listing', 'Featured badge', 'Newsletter inclusion'],
    apiTier: 'plus',
    popular: true,
  },
  {
    id: 'sponsored',
    name: 'Sponsored',
    subtitle: 'Maximum visibility',
    price: 99,
    benefits: ['Homepage placement', '180 days listing', 'Sponsored badge', 'Analytics dashboard'],
    apiTier: 'premium',
  },
];

/** @deprecated Free tier removed — alias for lowest paid tier */
export const DEFAULT_LISTING_TIER_ID = 'promoted';

/** Map UI tier id → sponsored-adverts API sponsorship_tier */
export const toSponsorshipApiTier = (tierId) => {
  if (!tierId || tierId === 'basic' || tierId === 'free' || tierId === 'standard') {
    return 'plus';
  }
  const tier = LISTING_TIERS.find((t) => t.id === tierId);
  return tier?.apiTier || tierId;
};

export const getTierById = (id) => {
  if (!id || id === 'basic' || id === 'free' || id === 'standard') {
    return LISTING_TIERS[0];
  }
  return LISTING_TIERS.find((t) => t.id === id) || LISTING_TIERS[0];
};

export const isPaidTier = (tier) => {
  const price = typeof tier === 'object' ? Number(tier?.price) : Number(getTierById(tier)?.price);
  return Number.isFinite(price) && price >= MIN_LISTING_PRICE;
};
