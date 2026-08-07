import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';

const HERO_BG =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80';

/**
 * Marketplace hero — same pattern as Sponsored / Buy & Sell.
 * Post CTA lives only in the bottom List your affiliate offer banner.
 */
const AffiliateHero = (props) => (
  <BrowseMarketplaceHero
    title="Affiliates Hub"
    titlePrefix="Affiliates"
    eyebrow="Affiliates"
    subtitle="Featured offers, business programs, and promoter links in one place"
    imageUrl={HERO_BG}
    theme="violet"
    searchPlaceholder="Search affiliate offers…"
    {...props}
  />
);

export default AffiliateHero;
