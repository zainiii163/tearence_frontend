import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80';

/** Marketplace hero — same pattern as Buy & Sell / Sponsored. */
const FeaturedHero = (props) => (
  <BrowseMarketplaceHero
    title="Featured"
    titlePrefix="Featured"
    eyebrow=""
    subtitle="Premium hand-picked listings with top placement across Worldwide Adverts"
    imageUrl={HERO_BG}
    theme={getCategoryTheme('featured').heroTheme}
    searchPlaceholder="Search featured adverts…"
    {...props}
  />
);

export default FeaturedHero;
