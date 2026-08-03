import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';

const HERO_BG =
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1920&q=80';

/**
 * Marketplace hero — same pattern as Buy & Sell / Vehicles.
 * Post CTA lives only in the bottom Start selling banner.
 */
const SponsoredHero = (props) => (
  <BrowseMarketplaceHero
    title="Sponsored Adverts"
    titlePrefix="Sponsored"
    eyebrow="Sponsored"
    subtitle="Premium listings from across the site — vehicles, property, business and more"
    imageUrl={HERO_BG}
    theme="gold"
    searchPlaceholder="Search sponsored adverts…"
    {...props}
  />
);

export default SponsoredHero;
