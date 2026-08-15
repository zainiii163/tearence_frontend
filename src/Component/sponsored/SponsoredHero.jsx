import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1920&q=80';

/**
 * Marketplace hero — same pattern as Buy & Sell / Vehicles.
 * Post CTA lives only in the bottom List your sponsored ads banner.
 */
const SponsoredHero = (props) => (
  <BrowseMarketplaceHero
    title="Sponsored"
    titlePrefix="Sponsored"
    eyebrow=""
    subtitle="Premium listings from across the site — vehicles, property, business and more"
    imageUrl={HERO_BG}
    theme={getCategoryTheme('sponsored').heroTheme}
    searchPlaceholder="Search sponsored adverts…"
    {...props}
  />
);

export default SponsoredHero;
