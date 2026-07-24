/** Standard listing tiers — Free, Paid, Featured, Sponsored (Clive spec) */

export const LISTING_TIERS = [
  {
    id: 'basic',
    name: 'Free',
    subtitle: 'Standard listing',
    price: 0,
    benefits: ['Standard visibility', '30 days listing', 'Basic support'],
    apiTier: 'basic',
  },
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

/** Map UI tier id → sponsored-adverts API sponsorship_tier */
export const toSponsorshipApiTier = (tierId) => {
  const tier = LISTING_TIERS.find((t) => t.id === tierId);
  return tier?.apiTier || tierId;
};

export const getTierById = (id) => LISTING_TIERS.find((t) => t.id === id);
