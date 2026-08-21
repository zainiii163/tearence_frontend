import React from 'react';

/**
 * Category browse stack (all hubs):
 * - Featured lives in the top slider (CompactPremiumReel / premiumReel)
 * - Promoted appears here, above standard listings
 * - Sponsored belongs on the viewed advert detail page — not here
 * Do not label listings as "Paid".
 */
const BrowsePromotionLanes = ({
  promoted = [],
  paid = null,
  renderGrid,
  maxPromoted = 9,
  className = '',
  promotedTitle = 'Promoted',
}) => {
  if (typeof renderGrid !== 'function') return null;

  const promotedItems = Array.isArray(promoted) ? promoted.slice(0, maxPromoted) : [];
  const paidItems = Array.isArray(paid) ? paid : null;

  return (
    <div className={`space-y-6 ${className}`}>
      <section>
        <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 text-center">
          {promotedTitle}
        </h2>
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

      {paidItems != null && (
        <section>
          {paidItems.length > 0 ? (
            renderGrid(paidItems, 'regular')
          ) : (
            <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">No listings in this view yet.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default BrowsePromotionLanes;
