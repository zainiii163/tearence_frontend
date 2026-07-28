import React from 'react';
import {
  FaShoppingCart, FaUtensils, FaBriefcase, FaStethoscope, FaGraduationCap, FaCar,
  FaHome, FaGamepad, FaPlane, FaHeart, FaDog, FaSeedling, FaLaptop, FaDumbbell,
  FaIndustry, FaChurch,
} from 'react-icons/fa';
import { CATEGORIES } from './BusinessFilters';
import { countBusinessesInCategory } from './businessFilterUtils';
import CompactCategoryChips from '../shared/CompactCategoryChips';

const CATEGORY_META = {
  retail: { icon: FaShoppingCart, bg: 'bg-orange-500' },
  restaurants: { icon: FaUtensils, bg: 'bg-red-500' },
  services: { icon: FaBriefcase, bg: 'bg-green-600' },
  healthcare: { icon: FaStethoscope, bg: 'bg-pink-500' },
  education: { icon: FaGraduationCap, bg: 'bg-purple-600' },
  automotive: { icon: FaCar, bg: 'bg-slate-600' },
  'real-estate': { icon: FaHome, bg: 'bg-teal-600' },
  entertainment: { icon: FaGamepad, bg: 'bg-fuchsia-500' },
  travel: { icon: FaPlane, bg: 'bg-indigo-500' },
  beauty: { icon: FaHeart, bg: 'bg-rose-500' },
  pets: { icon: FaDog, bg: 'bg-amber-500' },
  'home-garden': { icon: FaSeedling, bg: 'bg-emerald-600' },
  technology: { icon: FaLaptop, bg: 'bg-cyan-600' },
  'sports-fitness': { icon: FaDumbbell, bg: 'bg-lime-600' },
  industrial: { icon: FaIndustry, bg: 'bg-violet-600' },
  'non-profit': { icon: FaChurch, bg: 'bg-blue-600' },
};

const BusinessCategoryGrid = ({
  businesses = [],
  selectedCategoryId,
  onSelectCategory,
  apiCategoryLookup = {},
}) => {
  const items = CATEGORIES.map((category) => ({
    id: category.id,
    name: category.label,
    meta: String(countBusinessesInCategory(businesses, category.id, apiCategoryLookup)),
  }));

  return (
    <CompactCategoryChips
      items={items}
      selectedId={selectedCategoryId}
      title="Categories"
      theme="purple"
      initialVisible={24}
      onSelect={(item) => onSelectCategory?.(item.id)}
      renderIcon={(item) => {
        const meta = CATEGORY_META[item.id] || { icon: FaBriefcase, bg: 'bg-purple-600' };
        const Icon = meta.icon;
        return (
          <span className={`inline-flex h-5 w-5 items-center justify-center rounded-md shrink-0 text-white ${meta.bg}`}>
            <Icon className="h-2.5 w-2.5" />
          </span>
        );
      }}
    />
  );
};

export default BusinessCategoryGrid;
