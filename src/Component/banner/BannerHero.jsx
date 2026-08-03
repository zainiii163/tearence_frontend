import React from 'react';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';

/**
 * Single search bar only. Post CTA is the bottom “Start selling” banner.
 */
const BannerHero = ({ searchQuery, setSearchQuery }) => {
  const [localSearchQuery, setLocalSearchQuery] = React.useState(searchQuery || '');

  const handleSearch = () => {
    setSearchQuery?.(localSearchQuery);
  };

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
      <div className="relative page-container py-8 sm:py-10">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Banner Adverts</h1>
          <p className="mt-2 text-sm text-indigo-100">
            High-impact banner placements across the Worldwide Adverts network.
          </p>

          <div className="mt-4">
            <BrowseHeroSearch
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onSubmit={handleSearch}
              placeholder="Search banner adverts…"
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
