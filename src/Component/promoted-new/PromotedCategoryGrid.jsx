import React from 'react';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';

const PromotedCategoryGrid = ({
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
    subtitle="Open a category to browse promoted ads in that market."
    countLabel="ads"
    getId={(c) => c.id ?? c.category_id ?? c.slug}
    getLabel={(c) => c.name || c.category_name || 'Category'}
    getSlug={(c) => c.slug || String(c.id ?? c.category_id ?? '')}
    getCount={(c) => c.adverts_count ?? c.count ?? c.listings_count ?? null}
    onSelect={(category, id) =>
      onSelectCategory?.(id ?? category.id ?? category.category_id ?? category.slug)
    }
    accentRing="ring-orange-500"
    accentBorder="border-orange-300"
    hoverBorder="hover:border-orange-200"
    hoverTitle="group-hover:text-orange-800"
    hoverArrow="group-hover:bg-orange-100 group-hover:text-orange-800"
  />
);

export default PromotedCategoryGrid;
