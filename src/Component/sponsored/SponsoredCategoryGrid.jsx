import React from 'react';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';

const SponsoredCategoryGrid = ({
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
    subtitle="Open a category to browse sponsored ads in that market."
    countLabel="ads"
    getId={(c) => c.id ?? c.category_id}
    getLabel={(c) => c.name || c.category_name || 'Category'}
    getSlug={(c) => c.slug || String(c.id ?? c.category_id ?? '')}
    getCount={(c) => c.adverts_count ?? c.count ?? c.listings_count ?? null}
    getImage={(c) => c.image_url || c.image || null}
    getImages={(c) => c.images || c.post_images || []}
    onSelect={(category, id) => onSelectCategory?.(id ?? category.id ?? category.category_id)}
    accentRing="ring-amber-500"
    accentBorder="border-amber-300"
    hoverBorder="hover:border-amber-200"
    hoverTitle="group-hover:text-amber-800"
    hoverArrow="group-hover:bg-amber-100 group-hover:text-amber-800"
    rotateMs={4000}
  />
);

export default SponsoredCategoryGrid;
