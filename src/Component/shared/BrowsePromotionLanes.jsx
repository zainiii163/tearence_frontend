import React from 'react';

/**
 * Category browse stack (all hubs):
 * - Featured lives in the top slider (CompactPremiumReel / premiumReel)
 * - Promoted appears here, above standard listings (only when items exist — no empty placeholder copy)
 * - Site-wide Sponsored ads are interleaved inside hub grids (e.g. vehicles) and also shown below detail pages
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
  const showPromoted = promotedItems.length > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {showPromoted && (
        <section>
          <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 text-center">
            {promotedTitle}
          </h2>
          {renderGrid(promotedItems, 'promoted')}
        </section>
      )}

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
