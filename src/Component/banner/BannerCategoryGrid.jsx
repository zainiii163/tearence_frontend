import React from 'react';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';

/** Banner marketplace categories — compact cards with rotating post images. */
const BannerCategoryGrid = ({ categories, selectedCategory, onCategorySelect, loading }) => (
  <div className="page-container py-2 sm:py-3">
    <MarketplaceCategoryCards
      categories={categories}
      loading={loading}
      selectedId={selectedCategory}
      title="Categories"
      subtitle="Browse live banner adverts by market."
      countLabel="banners"
      getId={(c) => c.slug || c.id}
      getLabel={(c) => c.name}
      getSlug={(c) => c.slug || String(c.id || '').toLowerCase()}
      getCount={(c) => c.active_banners_count ?? c.count ?? null}
      getImage={(c) => c.image_url || c.image || null}
      getImages={(c) => c.images || c.post_images || []}
      onSelect={(category) => onCategorySelect?.(category)}
      accentRing="ring-indigo-500"
      accentBorder="border-indigo-300"
      hoverBorder="hover:border-indigo-200"
      hoverTitle="group-hover:text-indigo-700"
      hoverArrow="group-hover:bg-indigo-100 group-hover:text-indigo-700"
      initialVisible={24}
      rotateMs={3800}
    />
    </div>
  );

export default BannerCategoryGrid;
