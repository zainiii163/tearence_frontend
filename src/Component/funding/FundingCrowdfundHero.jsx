import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1920&q=80';

const FundingCrowdfundHero = ({
  categoryLabel = null,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
}) => (
  <BrowseMarketplaceHero
    title="Business Funding"
    eyebrow="Crowdfunding"
    subtitle="Raise or discover funding worldwide"
    imageUrl={HERO_BG}
    theme={getCategoryTheme('funding').heroTheme}
    categoryLabel={categoryLabel}
    searchValue={searchValue}
    onSearchChange={onSearchChange}
    onSearchSubmit={onSearchSubmit}
    searchPlaceholder="Search campaigns…"
  />
);

export default FundingCrowdfundHero;
