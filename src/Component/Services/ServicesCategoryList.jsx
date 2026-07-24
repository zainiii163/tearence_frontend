import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

/**
 * Compact Fiverr-style category list — tech services only (Clive: save space, keep simple).
 */
const ServicesCategoryList = ({ categories = [], selectedSlug = null, onSelect }) => {
  if (!categories.length) return null;

  return (
    <section className="mb-5">
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white overflow-hidden">
        {categories.map((cat) => {
          const active = selectedSlug && String(selectedSlug) === String(cat.slug);
          return (
            <li key={cat.slug || cat.id}>
              <button
                type="button"
                onClick={() => onSelect(cat)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  active
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'hover:bg-gray-50 text-gray-900'
                }`}
              >
                <span className="text-lg leading-none shrink-0" aria-hidden="true">
                  {cat.emoji || '💻'}
                </span>
                <span className="flex-1 text-sm font-semibold">{cat.name || cat.label}</span>
                <FiChevronRight
                  className={`h-4 w-4 shrink-0 ${active ? 'text-emerald-600' : 'text-gray-400'}`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ServicesCategoryList;
