import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1280&q=80';

/**
 * Clean hero title (Clive). Category name when drilling into a category.
 */
const BannerHero = ({ searchQuery, setSearchQuery, categoryLabel = null }) => {
  const [localSearchQuery, setLocalSearchQuery] = React.useState(searchQuery || '');

  React.useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery?.(localSearchQuery);
  };

  const title = categoryLabel ? `${categoryLabel} Banners` : 'Banner Adverts';
  const theme = getCategoryTheme('banner');

  return (
    <BrowseMarketplaceHero
      title={title}
      eyebrow=""
      subtitle={
        categoryLabel
          ? `Paid banners to promote ${categoryLabel} — buy to download.`
          : 'Paid banners for every category — buy to promote your products.'
      }
      imageUrl={HERO_BG}
      theme={theme.heroTheme}
      searchValue={localSearchQuery}
      onSearchChange={(e) => setLocalSearchQuery(e.target.value)}
      onSearchSubmit={handleSearch}
      searchPlaceholder={categoryLabel ? `Search ${categoryLabel} banners…` : 'Search banners…'}
    />
  );
};

export default BannerHero;
