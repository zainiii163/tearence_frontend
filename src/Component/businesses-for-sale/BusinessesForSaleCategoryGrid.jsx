import React from 'react';
import { BUSINESS_SALE_CATEGORIES, BUSINESS_SALE_GROUPS } from './businessesForSaleCategories';
import CompactCategoryChips from '../shared/CompactCategoryChips';

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
    meta: g.subtitle,
  }));

  const categoryItems = BUSINESS_SALE_CATEGORIES.filter(
    (c) => !selectedGroupId || c.group === selectedGroupId
  ).map((cat) => ({
    id: cat.id,
    name: cat.name,
    meta: `${listingCounts[cat.id] || 0} listings`,
  }));

  return (
    <div className="mb-3 space-y-2">
      <CompactCategoryChips
        items={groupItems}
        selectedId={selectedGroupId}
        title="Type"
        theme="orange"
        initialVisible={8}
        onSelect={(item) => onSelectGroup?.(item.id)}
      />
      <CompactCategoryChips
        items={categoryItems}
        selectedId={selectedCategoryId}
        title="Categories"
        theme="orange"
        initialVisible={24}
        onSelect={(item) => onSelectCategory?.(item.id)}
      />
    </div>
  );
};

export default BusinessesForSaleCategoryGrid;
