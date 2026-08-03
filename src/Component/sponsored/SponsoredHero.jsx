import React, { useState } from 'react';
import { Crown, Plus } from 'lucide-react';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';

/**
 * Clive: no public counters — title, search, Post Sponsored CTA only.
 */
const SponsoredHero = ({
  searchQuery = '',
  setSearchQuery,
  onSearch,
  onPostAdvert,
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const value = setSearchQuery ? searchQuery : localQuery;
  const onChange = setSearchQuery
    ? (e) => setSearchQuery(e.target.value)
    : (e) => setLocalQuery(e.target.value);

  const submit = () => {
    onSearch?.(value);
  };

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="page-container py-8 sm:py-10">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-medium text-amber-800 mb-3">
            <Crown className="h-3.5 w-3.5 text-amber-600" />
            Sponsored Adverts
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Sponsored Adverts
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Premium listings from across the site — vehicles, property, business, events and more.
          </p>

          <div className="mt-4">
            <BrowseHeroSearch
              value={value}
              onChange={onChange}
              onSubmit={submit}
              placeholder="Search sponsored adverts…"
              size="sm"
              accentClass="text-amber-700"
              ringClass="focus-within:ring-2 focus-within:ring-amber-300/80"
              buttonClass="bg-amber-600 hover:bg-amber-700"
            />
          </div>

          {typeof onPostAdvert === 'function' && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onPostAdvert}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Post Sponsored Advert
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SponsoredHero;
