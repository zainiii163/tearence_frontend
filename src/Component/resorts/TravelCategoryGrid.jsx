import React from 'react';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

/**
 * Travel categories — same MarketplaceCategoryCards pattern as Buy & Sell / Vehicles.
 */
const TravelCategoryGrid = ({
  categories = [],
  onCategorySelect,
  selectedCategory,
  loading = false,
}) => {
  const displayCategories = Array.isArray(categories) ? categories : [];

  const getImage = (c) =>
    resolveStorageUrl(c?.image || c?.image_url || c?.cover_image || c?.thumbnail) ||
    c?.image ||
    c?.image_url ||
    null;

  return (
    <MarketplaceCategoryCards
      categories={displayCategories}
      selectedId={selectedCategory?.id ?? selectedCategory?.slug ?? null}
      title="Travel categories"
      subtitle="Accommodation, transport and experiences — browse like other Worldwide Adverts hubs."
      countLabel="listings"
      loading={loading}
      getId={(c) => c.id ?? c.slug}
      getLabel={(c) => c.name || c.title || 'Category'}
      getSlug={(c) => c.slug || c.id}
      getCount={(c) => c.active_adverts_count ?? c.count ?? c.listings_count ?? null}
      getImage={getImage}
      onSelect={(cat) => onCategorySelect?.(cat)}
      accentRing="ring-cyan-500"
      accentBorder="border-cyan-300"
      hoverBorder="hover:border-cyan-200"
      hoverTitle="group-hover:text-cyan-800"
      hoverArrow="group-hover:bg-cyan-100 group-hover:text-cyan-800"
      initialVisible={16}
    />
  );
};

export default TravelCategoryGrid;
