import React from 'react';
import { FiGrid } from 'react-icons/fi';

const GRID_CLASS =
  'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2';

/**
 * Services category grid — same compact chip layout as Buy & Sell / Business (Clive).
 */
const ServicesCategoryGrid = ({ categories = [], selectedSlug = null, onSelectCategory }) => {
  if (!categories.length) return null;

  return (
    <section className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <FiGrid className="h-4 w-4 text-emerald-600 shrink-0" />
        <h2 className="text-base sm:text-lg font-bold text-gray-900">Explore Categories</h2>
        <span className="text-xs text-gray-500">{categories.length} total</span>
      </div>

      <div className={GRID_CLASS}>
        {categories.map((category) => {
          const active = selectedSlug && String(selectedSlug) === String(category.slug);
          return (
            <button
              key={category.slug || category.id}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`group bg-white rounded-md border px-1.5 py-2 text-center transition-colors ${
                active
                  ? 'border-emerald-500 ring-1 ring-emerald-200'
                  : 'border-gray-200 hover:border-emerald-400'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl leading-none" aria-hidden="true">
                  {category.emoji || category.icon || '💻'}
                </span>
                <h3
                  className={`text-[10px] sm:text-[11px] font-semibold line-clamp-2 leading-tight px-0.5 ${
                    active ? 'text-emerald-700' : 'text-gray-800 group-hover:text-emerald-600'
                  }`}
                  title={category.name || category.label}
                >
                  {category.name || category.label}
                </h3>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesCategoryGrid;
