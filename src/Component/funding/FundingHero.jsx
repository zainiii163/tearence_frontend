import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1920&q=80';

/** Funding page title banner — same polished marketplace hero treatment. */
const FundingHero = ({ categoryLabel = null }) => (
  <BrowseMarketplaceHero
    title="Business Funding"
    eyebrow="Funding"
    imageUrl={HERO_BG}
    theme={getCategoryTheme('funding').heroTheme}
    categoryLabel={categoryLabel}
  />
);

export default FundingHero;
