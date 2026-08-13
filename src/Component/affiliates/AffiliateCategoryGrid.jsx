import React from 'react';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';

/**
 * Category picker for affiliates.
 * compact=true → ClickBank-style chip row (offers stay above the fold).
 */
const AffiliateCategoryGrid = ({
  categories = [],
  selectedCategoryId,
  onSelectCategory,
  loading = false,
  compact = false,
}) => {
  if (compact) {
    if (loading) {
      return (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 w-24 shrink-0 rounded-full bg-slate-200 animate-pulse" />
          ))}
        </div>
      );
    }

    return (
      <div className="mb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <button
            type="button"
            onClick={() => onSelectCategory?.(null)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
              selectedCategoryId == null
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-slate-700 border-slate-200 hover:border-primary/40'
            }`}
          >
            All niches
          </button>
          {categories.map((c) => {
            const id = c.id ?? c.category_id;
            const active = String(selectedCategoryId) === String(id);
            const label = c.name || c.category_name || 'Category';
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectCategory?.(id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-primary/40'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <MarketplaceCategoryCards
      categories={categories}
      loading={loading}
      selectedId={selectedCategoryId}
      title="Categories"
      subtitle="Open a category to browse affiliate programs in that niche."
      countLabel="programs"
      getId={(c) => c.id ?? c.category_id}
      getLabel={(c) => c.name || c.category_name || 'Category'}
      getSlug={(c) => c.slug || String(c.id ?? c.category_id ?? '')}
      getCount={(c) => c.programs_count ?? c.count ?? c.listings_count ?? null}
      onSelect={(category, id) => onSelectCategory?.(id ?? category.id ?? category.category_id)}
      accentRing="ring-sky-500"
      accentBorder="border-sky-300"
      hoverBorder="hover:border-sky-200"
      hoverTitle="group-hover:text-sky-800"
      hoverArrow="group-hover:bg-sky-100 group-hover:text-sky-800"
    />
  );
};

export default AffiliateCategoryGrid;
