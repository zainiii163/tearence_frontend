/** Sample listing data based on https://pixmuse.io — for client demo previews */

export const PIXMUSE_WEBSITE = 'https://pixmuse.io';
export const PIXMUSE_COVER_IMAGE = 'https://pixmuse.io/og-image.png';

export const getPixmuseBusinessForSalePrefill = () => ({
  advert_type: 'business',
  title: 'PixMuse AI — SaaS Business For Sale',
  business_name: 'PixMuse AI',
  tagline: 'Profitable AI photo studio with 48+ brand-ready presets & credit-based monetisation',
  description: `Established online SaaS business — PixMuse AI (pixmuse.io) — an AI image generation studio for portraits, product photography, and lifestyle scenes.

Key highlights:
• 48+ curated style presets for brand-consistent visuals
• Credit-based SaaS model (20 free credits for new accounts)
• Average render time ~28 seconds with 2K output
• Serves agencies, ecommerce founders, and in-house marketing teams
• Encrypted uploads, private galleries, and enterprise governance
• Zapier & webhook integrations for DAM, CRM, and social workflows

Ideal acquisition for a creative-tech buyer, agency group, or martech platform seeking recurring-revenue AI imaging software.`,
  price: '350000',
  currency: 'USD',
  country: 'United Kingdom',
  city: 'London',
  seller_name: 'PixMuse Founder',
  phone: '+44 20 7946 0958',
  email: 'hello@pixmuse.io',
  website: PIXMUSE_WEBSITE,
  condition: 'not_applicable',
  sponsorship_tier: 'basic',
  sponsorship_price: 0,
  coverImageUrl: PIXMUSE_COVER_IMAGE,
});

export const getPixmuseFundingPrefill = () => {
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() + 60);

  return {
    title: 'PixMuse AI — Scale Our AI Photo Studio',
    tagline: 'Share partnership funding to expand presets, enterprise sales & API partnerships',
    project_type: 'startup',
    category: 'technology',
    country: 'United Kingdom',
    city: 'London',
    description: `PixMuse AI (pixmuse.io) transforms any photo into brand-ready visuals using curated AI styles — no design skills or complex prompts required.

We help agencies, ecommerce brands, and marketing teams automate retouching, apply cinematic color recipes, and scale imagery without reshoots.`,
    problem_solving:
      'Creative teams lose weeks to reshoots, retouching, and inconsistent brand visuals. PixMuse delivers on-brand 2K renders in under 30 seconds from any device.',
    vision_mission:
      'Make professional, brand-consistent imagery accessible to every business — without studio fees or prompt engineering.',
    why_now:
      'Demand for AI-generated brand content is accelerating. PixMuse has a live product, credit-based SaaS pricing, 48+ presets, and 4.9/5 customer satisfaction.',
    funding_goal: '500000',
    currency: 'USD',
    minimum_contribution: '100',
    funding_model: 'equity',
    funding_starts_at: today.toISOString().split('T')[0],
    funding_ends_at: end.toISOString().split('T')[0],
    website: PIXMUSE_WEBSITE,
    use_of_funds: [
      { item: 'Product & preset library expansion', amount: '150000' },
      { item: 'Enterprise sales & marketing', amount: '200000' },
      { item: 'Infrastructure & security (SOC2-ready)', amount: '100000' },
      { item: 'Team growth', amount: '50000' },
    ],
    milestones: [
      { milestone: 'Launch 20 new enterprise presets', expected_date: '2026-09-30' },
      { milestone: '100 paid business accounts', expected_date: '2026-12-31' },
      { milestone: 'Zapier & API partner integrations live', expected_date: '2027-03-31' },
    ],
    team_members: [{ name: 'PixMuse Founder', role: 'CEO & Product', photo: null }],
    social_links: [{ platform: 'website', url: PIXMUSE_WEBSITE }],
    agreeTerms: true,
    confirmAccuracy: true,
    coverImageUrl: PIXMUSE_COVER_IMAGE,
  };
};

export const isPixmuseDemo = (searchParams) => searchParams?.get('demo') === 'pixmuse';
