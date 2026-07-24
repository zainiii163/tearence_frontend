import React from 'react';
import {
  FaShoppingCart, FaUtensils, FaBriefcase, FaStethoscope, FaGraduationCap, FaCar,
  FaHome, FaGamepad, FaPlane, FaHeart, FaDog, FaSeedling, FaLaptop, FaDumbbell,
  FaIndustry, FaChurch,
} from 'react-icons/fa';
import { CATEGORIES } from './BusinessFilters';
import { countBusinessesInCategory } from './businessFilterUtils';

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

const GRID_CLASS =
  'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2';

const BusinessCategoryGrid = ({
  businesses = [],
  selectedCategoryId,
  onSelectCategory,
  apiCategoryLookup = {},
}) => {
  const getCount = (categoryId) =>
    countBusinessesInCategory(businesses, categoryId, apiCategoryLookup);

  return (
    <section>
      <div className={GRID_CLASS}>
        {CATEGORIES.map((category) => {
          const meta = CATEGORY_META[category.id] || { icon: FaBriefcase, bg: 'bg-purple-600' };
          const Icon = meta.icon;
          const count = getCount(category.id);
          const active = selectedCategoryId === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={`group flex flex-col items-center text-center gap-1 px-1 py-2 rounded-md border transition-colors ${
                active
                  ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-200'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <div
                className={`w-9 h-9 ${meta.bg} rounded-lg flex items-center justify-center`}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="w-full min-w-0">
                <h3
                  className={`text-[10px] sm:text-[11px] font-semibold line-clamp-2 leading-tight ${
                    active ? 'text-purple-700' : 'text-gray-800 group-hover:text-purple-600'
                  }`}
                  title={category.label}
                >
                  {category.label}
                </h3>
                <p className="text-[9px] text-gray-500 mt-0.5">{count}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default BusinessCategoryGrid;
