import React from 'react';
import { CATEGORIES } from './BusinessFilters';

/** Compact text nav — all categories on category pages (not icon cards) */
const BusinessCategoryNav = ({ selectedCategoryId, onSelectCategory }) => (
  <section className="mb-5">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
      All categories
    </p>
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {CATEGORIES.map((cat) => {
        const active = selectedCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-2.5 py-1.5 text-xs sm:text-sm font-medium rounded-full border transition-colors ${
              active
                ? 'bg-purple-700 text-white border-purple-700'
                : 'bg-white text-gray-700 border-gray-200 hover:border-purple-400 hover:text-purple-700'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  </section>
);

export default BusinessCategoryNav;
