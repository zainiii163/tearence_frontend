import React from 'react';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';

const AffiliateCategoryGrid = ({
  categories = [],
  selectedCategoryId,
  onSelectCategory,
  loading = false,
}) => (
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
    accentRing="ring-violet-500"
    accentBorder="border-violet-300"
    hoverBorder="hover:border-violet-200"
    hoverTitle="group-hover:text-violet-800"
    hoverArrow="group-hover:bg-violet-100 group-hover:text-violet-800"
  />
);

export default AffiliateCategoryGrid;
