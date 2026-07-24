import React from 'react';
import { FiGrid } from 'react-icons/fi';
import CalculatorCategoryIcon from './CalculatorCategoryIcon';

const THEMES = {
  green: { active: 'border-green-500 ring-1 ring-green-200', text: 'text-green-700', hover: 'hover:border-green-400', hoverText: 'group-hover:text-green-600', icon: 'text-green-600' },
  purple: { active: 'border-purple-500 ring-1 ring-purple-200', text: 'text-purple-700', hover: 'hover:border-purple-400', hoverText: 'group-hover:text-purple-600', icon: 'text-purple-600' },
  emerald: { active: 'border-emerald-500 ring-1 ring-emerald-200', text: 'text-emerald-700', hover: 'hover:border-emerald-400', hoverText: 'group-hover:text-emerald-600', icon: 'text-emerald-600' },
  red: { active: 'border-red-500 ring-1 ring-red-200', text: 'text-red-700', hover: 'hover:border-red-400', hoverText: 'group-hover:text-red-600', icon: 'text-red-600' },
  blue: { active: 'border-blue-500 ring-1 ring-blue-200', text: 'text-blue-700', hover: 'hover:border-blue-400', hoverText: 'group-hover:text-blue-600', icon: 'text-blue-600' },
  amber: { active: 'border-amber-500 ring-1 ring-amber-200', text: 'text-amber-700', hover: 'hover:border-amber-400', hoverText: 'group-hover:text-amber-600', icon: 'text-amber-600' },
  teal: { active: 'border-teal-500 ring-1 ring-teal-200', text: 'text-teal-700', hover: 'hover:border-teal-400', hoverText: 'group-hover:text-teal-600', icon: 'text-teal-600' },
};

/** Same grid as Buy & Sell categories — circular icons + label (Clive). */
const GRID_CLASS =
  'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2';

const CalculatorCategoryGrid = ({
  categories = [],
  selectedId = null,
  onSelect,
  theme = 'emerald',
  title = 'Calculators',
}) => {
  const t = THEMES[theme] || THEMES.emerald;

  if (!categories.length) return null;

  return (
    <section className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <FiGrid className={`h-3.5 w-3.5 shrink-0 ${t.icon}`} />
        <h2 className="text-sm sm:text-base font-bold text-gray-900">{title}</h2>
        <span className="text-[10px] text-gray-500">{categories.length}</span>
      </div>

      <div className={GRID_CLASS}>
        {categories.map((cat) => {
          const active = selectedId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect?.(cat.id)}
              className={`group bg-white rounded-md border px-1.5 py-2 text-center transition-colors ${
                active ? t.active : `border-gray-200 ${t.hover}`
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <CalculatorCategoryIcon id={cat.id} emoji={cat.emoji} size="sm" />
                <h3
                  className={`text-[10px] sm:text-[11px] font-semibold line-clamp-2 leading-tight px-0.5 ${
                    active ? t.text : `text-gray-800 ${t.hoverText}`
                  }`}
                  title={cat.name}
                >
                  {cat.name}
                </h3>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CalculatorCategoryGrid;
