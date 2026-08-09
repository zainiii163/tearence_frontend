import React from 'react';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';

const FeaturedCategoryGrid = ({
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
    subtitle="Open a category to browse featured ads in that market."
    countLabel="ads"
    getId={(c) => c.id ?? c.category_id ?? c.slug}
    getLabel={(c) => c.name || c.category_name || 'Category'}
    getSlug={(c) => c.slug || String(c.id ?? c.category_id ?? '')}
    getCount={(c) => c.adverts_count ?? c.count ?? c.listings_count ?? null}
    onSelect={(category, id) =>
      onSelectCategory?.(id ?? category.id ?? category.category_id ?? category.slug)
    }
    accentRing="ring-purple-500"
    accentBorder="border-purple-300"
    hoverBorder="hover:border-purple-200"
    hoverTitle="group-hover:text-purple-800"
    hoverArrow="group-hover:bg-purple-100 group-hover:text-purple-800"
  />
);

export default FeaturedCategoryGrid;
