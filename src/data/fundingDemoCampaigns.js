/**
 * Demo funding campaigns shown when the API returns an empty list.
 * Clive: Funding page had examples before — restore sample campaigns.
 */
export const FUNDING_DEMO_CAMPAIGNS = [
  {
    id: 'demo-eco-bottle',
    title: 'Eco-Friendly Water Bottle',
    slug: 'eco-friendly-water-bottle',
    tagline: 'Sustainable hydration solution',
    category: 'environment',
    description:
      'A water bottle made from recycled materials with a built-in filtration system. Reduce plastic waste and drink cleaner water.',
    funding_goal: 50000,
    current_funding: 32500,
    current_funded: 32500,
    backers_count: 245,
    country: 'United States',
    city: 'San Francisco',
    is_featured: true,
    is_promoted: false,
    is_sponsored: false,
    status: 'active',
    cover_image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80',
    funding_model: 'reward_based',
  },
  {
    id: 'demo-smart-garden',
    title: 'Smart Garden System',
    slug: 'smart-garden-system',
    tagline: 'Automated indoor gardening for everyone',
    category: 'technology',
    description:
      'AI-powered indoor garden that waters, lights, and monitors plants automatically — fresh herbs without outdoor space.',
    funding_goal: 75000,
    current_funding: 41200,
    current_funded: 41200,
    backers_count: 318,
    country: 'United Kingdom',
    city: 'London',
    is_featured: true,
    is_promoted: true,
    is_sponsored: false,
    status: 'active',
    cover_image:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
    funding_model: 'reward_based',
  },
  {
    id: 'demo-community-art',
    title: 'Community Art Space',
    slug: 'community-art-space',
    tagline: 'A creative hub for local artists',
    category: 'community',
    description:
      'Convert a vacant warehouse into a shared studio, gallery, and workshop space for emerging creators.',
    funding_goal: 40000,
    current_funding: 18600,
    current_funded: 18600,
    backers_count: 152,
    country: 'Canada',
    city: 'Toronto',
    is_featured: false,
    is_promoted: false,
    is_sponsored: true,
    status: 'active',
    cover_image:
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    funding_model: 'donation',
  },
];

export default FUNDING_DEMO_CAMPAIGNS;
