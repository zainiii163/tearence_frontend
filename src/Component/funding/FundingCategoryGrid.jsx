import React from 'react';
import CompactCategoryChips from '../shared/CompactCategoryChips';

const FundingCategoryGrid = ({ categories = [], selectedCategory, onCategorySelect }) => {
  const items = (categories || []).map((category) => ({
    id: category.id ?? category.name,
    name: category.name || category.label,
    meta: category.project_count != null ? `${category.project_count} projects` : null,
    emoji: category.emoji,
  }));

  return (
    <CompactCategoryChips
      items={items}
      selectedId={selectedCategory}
      title="Categories"
      theme="emerald"
      initialVisible={16}
      getId={(item) => item.name || item.id}
      onSelect={(item) => onCategorySelect?.(item.name || item.id)}
    />
  );
};

export default FundingCategoryGrid;
