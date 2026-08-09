import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80';

/** Marketplace hero — same pattern as Buy & Sell / Sponsored. */
const PromotedHero = (props) => (
  <BrowseMarketplaceHero
    title="Promoted Adverts"
    titlePrefix="Promoted"
    eyebrow="Promoted"
    subtitle="Boosted listings from across the site — higher visibility for serious sellers"
    imageUrl={HERO_BG}
    theme={getCategoryTheme('promoted').heroTheme}
    searchPlaceholder="Search promoted adverts…"
    {...props}
  />
);

export default PromotedHero;
