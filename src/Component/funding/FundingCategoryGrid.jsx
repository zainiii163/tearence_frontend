import React from 'react';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';

const formatLabel = (name) =>
  String(name || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

/** Funding categories — same photo-tile cards as other marketplace hubs. */
const FundingCategoryGrid = ({ categories = [], selectedCategory, onCategorySelect, loading }) => (
  <div className="page-container py-2 sm:py-4">
    <MarketplaceCategoryCards
      categories={categories}
      loading={loading}
      selectedId={selectedCategory}
      title="Categories"
      subtitle="Browse live funding campaigns by market."
      countLabel="projects"
      getId={(c) => c.slug || c.id || c.name}
      getLabel={(c) => formatLabel(c.name || c.label || c.id)}
      getSlug={(c) => String(c.slug || c.id || c.name || '').toLowerCase()}
      getCount={(c) => c.project_count ?? c.count ?? null}
      onSelect={(category, id) => onCategorySelect?.(id ?? category.name ?? category.id)}
      accentRing="ring-emerald-500"
      accentBorder="border-emerald-300"
      hoverBorder="hover:border-emerald-200"
      hoverTitle="group-hover:text-emerald-700"
      hoverArrow="group-hover:bg-emerald-100 group-hover:text-emerald-700"
      initialVisible={18}
    />
  </div>
);

export default FundingCategoryGrid;
