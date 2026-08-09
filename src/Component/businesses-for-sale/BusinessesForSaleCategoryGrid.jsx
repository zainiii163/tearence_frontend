import React from 'react';
import { BUSINESS_SALE_CATEGORIES, BUSINESS_SALE_GROUPS } from './businessesForSaleCategories';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';

const BusinessesForSaleCategoryGrid = ({
  selectedCategoryId,
  selectedGroupId,
  onSelectCategory,
  onSelectGroup,
  listingCounts = {},
}) => {
  const groupItems = BUSINESS_SALE_GROUPS.map((g) => ({
    id: g.id,
    name: g.name,
    emoji: g.emoji,
    subtitle: g.subtitle,
  }));

  const categoryItems = BUSINESS_SALE_CATEGORIES.filter(
    (c) => !selectedGroupId || c.group === selectedGroupId
  ).map((cat) => ({
    id: cat.id,
    name: cat.name,
    count: listingCounts[cat.id] || 0,
  }));

  return (
    <div className="mb-3 space-y-4">
      <MarketplaceCategoryCards
        categories={groupItems}
        selectedId={selectedGroupId}
        title="Type"
        subtitle="Choose a business sale type."
        countLabel="types"
        getId={(c) => c.id}
        getLabel={(c) => c.name}
        getSlug={(c) => c.id}
        getIcon={(c) => c.emoji || '🏢'}
        getCount={() => null}
        onSelect={(category, id) => onSelectGroup?.(id ?? category.id)}
        accentRing="ring-orange-500"
        accentBorder="border-orange-300"
        hoverBorder="hover:border-orange-200"
        hoverTitle="group-hover:text-orange-800"
        hoverArrow="group-hover:bg-orange-100 group-hover:text-orange-800"
        initialVisible={8}
      />
      <MarketplaceCategoryCards
        categories={categoryItems}
        selectedId={selectedCategoryId}
        title="Categories"
        subtitle="Open a category to browse businesses for sale."
        countLabel="listings"
        getId={(c) => c.id}
        getLabel={(c) => c.name}
        getSlug={(c) => c.id}
        getCount={(c) => c.count}
        onSelect={(category, id) => onSelectCategory?.(id ?? category.id)}
        accentRing="ring-orange-500"
        accentBorder="border-orange-300"
        hoverBorder="hover:border-orange-200"
        hoverTitle="group-hover:text-orange-800"
        hoverArrow="group-hover:bg-orange-100 group-hover:text-orange-800"
      />
    </div>
  );
};

export default BusinessesForSaleCategoryGrid;
