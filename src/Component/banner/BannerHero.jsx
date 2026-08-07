import React from 'react';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';

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

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-indigo-800 to-slate-900 text-white">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400/40 via-transparent to-transparent" />
      <div className="relative page-container py-7 sm:py-9">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{title}</h1>
          <p className="mt-1.5 text-sm text-indigo-100/90">
            {categoryLabel
              ? `Paid banners to promote ${categoryLabel} — buy to download.`
              : 'Paid banners for every category — buy to promote your products.'}
          </p>

          <div className="mt-4">
            <BrowseHeroSearch
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onSubmit={handleSearch}
              placeholder={categoryLabel ? `Search ${categoryLabel} banners…` : 'Search banners…'}
              size="sm"
              accentClass="text-indigo-700"
              ringClass="focus-within:ring-2 focus-within:ring-indigo-300/80"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default BannerHero;
