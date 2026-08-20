import React from 'react';

/**
 * Clive: under Featured slider — Sponsored (~3 rows) then Promoted.
 * Do not label listings as "Paid".
 */
const BrowsePromotionLanes = ({
  sponsored = [],
  promoted = [],
  renderGrid,
  maxSponsored = 9,
  maxPromoted = 9,
  className = '',
}) => {
  if (typeof renderGrid !== 'function') return null;

  const sponsoredItems = Array.isArray(sponsored) ? sponsored.slice(0, maxSponsored) : [];
  const promotedItems = Array.isArray(promoted) ? promoted.slice(0, maxPromoted) : [];

  return (
    <div className={`space-y-6 mt-6 ${className}`}>
      <section>
        <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 text-center">Sponsored</h2>
        {sponsoredItems.length > 0 ? (
          renderGrid(sponsoredItems, 'sponsored')
        ) : (
          <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/60 px-4 py-8 text-center">
            <p className="text-sm font-semibold text-amber-950">Sponsored adverts</p>
            <p className="mt-1 text-xs text-amber-900/70">
              This space is reserved for sponsored placements.
            </p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 text-center">Promoted</h2>
        {promotedItems.length > 0 ? (
          renderGrid(promotedItems, 'promoted')
        ) : (
          <div className="rounded-xl border border-dashed border-sky-200 bg-sky-50/60 px-4 py-8 text-center">
            <p className="text-sm font-semibold text-sky-950">Promoted adverts</p>
            <p className="mt-1 text-xs text-sky-900/70">
              Promoted listings appear here above standard placements.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default BrowsePromotionLanes;
