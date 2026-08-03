import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';

/**
 * Clive: no public counters — title, search, Post Promoted CTA; trending lives in sidebar.
 */
const PromotedHero = ({
  onSearch,
  onPostPromoted,
  searchQuery = '',
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const submit = () => {
    onSearch?.(localQuery);
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="page-container py-8 sm:py-10">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Promoted Adverts</h1>
          <p className="mt-2 text-sm text-orange-100">
            Boosted listings from across categories — view trending topics and promoted posts in one feed.
          </p>

          <div className="mt-4">
            <BrowseHeroSearch
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onSubmit={submit}
              placeholder="Search promoted adverts…"
              size="sm"
              accentClass="text-orange-600"
              ringClass="focus-within:ring-2 focus-within:ring-orange-200/80"
              buttonClass="bg-orange-700 hover:bg-orange-800"
            />
          </div>

          {typeof onPostPromoted === 'function' && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onPostPromoted}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white text-orange-700 hover:bg-orange-50 text-xs sm:text-sm font-semibold px-4 py-2.5 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Post Promoted Advert
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PromotedHero;
