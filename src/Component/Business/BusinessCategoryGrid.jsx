import React, { useMemo } from 'react';
import { CATEGORIES } from './BusinessFilters';
import { countBusinessesInCategory, matchesBusinessCategory } from './businessFilterUtils';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';

const CATEGORY_EMOJI = {
  retail: '🛒',
  restaurants: '🍽',
  services: '💼',
  healthcare: '🏥',
  education: '🎓',
  automotive: '🚗',
  'real-estate': '🏠',
  entertainment: '🎮',
  travel: '✈️',
  beauty: '💅',
  pets: '🐕',
  'home-garden': '🌱',
  technology: '💻',
  'sports-fitness': '🏋',
  industrial: '🏭',
  'non-profit': '⛪',
};

const businessImage = (b) =>
  b?.cover_image ||
  b?.image_url ||
  b?.image ||
  b?.logo_url ||
  b?.logo ||
  b?.thumbnail ||
  (Array.isArray(b?.images) ? b.images[0] : null) ||
  null;

const BusinessCategoryGrid = ({
  businesses = [],
  selectedCategoryId,
  onSelectCategory,
  apiCategoryLookup = {},
}) => {
  const items = useMemo(
    () =>
      CATEGORIES.map((category) => {
        const matched = businesses.filter((b) =>
          matchesBusinessCategory(b, category.id, apiCategoryLookup)
        );
        const images = [];
        for (const b of matched) {
          const img = businessImage(b);
          if (img && !images.includes(img)) images.push(img);
          if (images.length >= 8) break;
        }
        return {
          id: category.id,
          name: category.label,
          count: matched.length || countBusinessesInCategory(businesses, category.id, apiCategoryLookup),
          images,
          post_images: images,
          image: images[0] || null,
          image_url: images[0] || null,
        };
      }),
    [businesses, apiCategoryLookup]
  );

  return (
    <MarketplaceCategoryCards
      categories={items}
      selectedId={selectedCategoryId}
      title="Categories"
      subtitle="Open a category to browse businesses in that market."
      countLabel="businesses"
      getId={(c) => c.id}
      getLabel={(c) => c.name}
      getSlug={(c) => c.id}
      getCount={(c) => c.count}
      getIcon={(c) => CATEGORY_EMOJI[c.id] || '🏢'}
      getImage={(c) => c.image_url || c.image}
      getImages={(c) => c.images || c.post_images || []}
      onSelect={(category, id) => onSelectCategory?.(id ?? category.id)}
      accentRing="ring-violet-500"
      accentBorder="border-violet-300"
      hoverBorder="hover:border-violet-200"
      hoverTitle="group-hover:text-violet-700"
      hoverArrow="group-hover:bg-violet-100 group-hover:text-violet-700"
      rotateMs={4000}
    />
  );
};

export default BusinessCategoryGrid;
