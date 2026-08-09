import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1280&q=80';

/**
 * Clive: centered title at top, search directly below, then page content.
 * Region titles: "Property Europe", "Property North America", etc.
 */
const PropertyHero = ({
  categoryLabel = null,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search city or keyword…',
}) => {
  const heading = categoryLabel || 'Property';
  const theme = getCategoryTheme('property');

  return (
    <BrowseMarketplaceHero
      title={heading}
      eyebrow=""
      imageUrl={HERO_BG}
      theme={theme.heroTheme}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onSearchSubmit={onSearchSubmit}
      searchPlaceholder={searchPlaceholder}
      dense
    />
  );
};

export default PropertyHero;
