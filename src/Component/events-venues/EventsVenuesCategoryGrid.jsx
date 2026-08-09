import React, { useMemo } from 'react';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';

const EventsVenuesCategoryGrid = ({
  categories = [],
  viewType = 'event',
  selectedCategoryId,
  onSelectCategory,
  loading = false,
  showAll = false,
  title = 'Categories',
}) => {
  const list = useMemo(
    () =>
      (Array.isArray(categories) ? categories : []).filter((cat) => {
        if (showAll) return true;
        return !cat.type || cat.type === viewType || cat.type === 'both';
      }),
    [categories, showAll, viewType]
  );

  return (
    <MarketplaceCategoryCards
      categories={list}
      loading={loading}
      selectedId={selectedCategoryId}
      title={title}
      subtitle={
        showAll
          ? 'Open a category to browse events and venues.'
          : viewType === 'venue'
            ? 'Open a category to browse venues in that space.'
            : 'Open a category to browse events in that market.'
      }
      countLabel={viewType === 'venue' ? 'venues' : 'events'}
      getId={(c) => c.id}
      getLabel={(c) => c.name}
      getSlug={(c) => c.slug || String(c.id)}
      getCount={(c) => c.adverts_count ?? c.count ?? c.listings_count ?? null}
      getIcon={(c) => (c.type === 'venue' ? '🏛' : c.type === 'event' ? '📅' : null)}
      onSelect={(category, id) => onSelectCategory?.(id ?? category.id, category)}
      accentRing="ring-purple-500"
      accentBorder="border-purple-300"
      hoverBorder="hover:border-purple-200"
      hoverTitle="group-hover:text-purple-800"
      hoverArrow="group-hover:bg-purple-100 group-hover:text-purple-800"
    />
  );
};

export default EventsVenuesCategoryGrid;
