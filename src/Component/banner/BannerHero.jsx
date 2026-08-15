import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';
import { paidAdvertChips } from '../promoted-new/PromotedHero';

const HERO_BG =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1280&q=80';

/**
 * Paid Adverts → Banner tab
 */
const BannerHero = ({ searchQuery, setSearchQuery, categoryLabel = null }) => {
  const [localSearchQuery, setLocalSearchQuery] = React.useState(searchQuery || '');

  React.useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery?.(localSearchQuery);
  };

  const title = categoryLabel ? categoryLabel : 'Paid Adverts';
  const theme = getCategoryTheme('banner');

  return (
    <BrowseMarketplaceHero
      title={title}
      eyebrow={categoryLabel ? 'Paid Adverts' : ''}
      subtitle={
        categoryLabel
          ? `Paid banners to promote ${categoryLabel} — buy to download.`
          : 'Site-wide display banners for brand campaigns.'
      }
      imageUrl={HERO_BG}
      theme={theme.heroTheme}
      searchValue={localSearchQuery}
      onSearchChange={(e) => setLocalSearchQuery(e.target.value)}
      onSearchSubmit={handleSearch}
      searchPlaceholder={categoryLabel ? `Search ${categoryLabel} banners…` : 'Search banners…'}
      heroChipSize="lg"
      heroChips={paidAdvertChips('banners')}
    />
  );
};

export default BannerHero;
