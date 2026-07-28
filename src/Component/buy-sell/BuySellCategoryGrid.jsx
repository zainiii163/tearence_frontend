import React, { useState, useEffect, useMemo } from 'react';
import { FiGrid, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { buysellAPI } from '../../api/buysell';
import BuySellCategoryIcon from './BuySellCategoryIcon';

/** Compact horizontal chips — short height, many per row (Clive: less space waste). */
const GRID_CLASS =
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1';

const INITIAL_VISIBLE = 24;

const BuySellCategoryGrid = ({ selectedCategoryId, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await buysellAPI.getCategories();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const visible = useMemo(() => {
    if (expanded || categories.length <= INITIAL_VISIBLE) return categories;
    return categories.slice(0, INITIAL_VISIBLE);
  }, [categories, expanded]);

  const hiddenCount = Math.max(0, categories.length - INITIAL_VISIBLE);

  const renderChip = (category) => {
    const active = String(selectedCategoryId) === String(category.id);

    return (
      <button
        key={category.id}
        type="button"
        onClick={() => onSelectCategory(category.id)}
        title={category.name}
        className={`group flex items-center gap-1.5 min-w-0 bg-white rounded border px-1.5 py-1 text-left transition-colors ${
          active
            ? 'border-green-500 ring-1 ring-green-200 bg-green-50/50'
            : 'border-gray-200 hover:border-green-400'
        }`}
      >
        <BuySellCategoryIcon category={category} size="xs" />
        <span
          className={`text-[10px] sm:text-[11px] font-semibold truncate leading-tight ${
            active ? 'text-green-800' : 'text-gray-800 group-hover:text-green-700'
          }`}
        >
          {category.name}
        </span>
      </button>
    );
  };

  return (
    <section className="mb-3">
      <div className="flex items-center gap-2 mb-1.5">
        <FiGrid className="h-3.5 w-3.5 text-green-600 shrink-0" />
        <h2 className="text-sm font-bold text-gray-900">Categories</h2>
        <span className="text-[10px] text-gray-500">{loading ? '…' : `${categories.length}`}</span>
      </div>

      {loading ? (
        <div className={GRID_CLASS}>
          {[...Array(12)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-100 rounded h-7" />
          ))}
        </div>
      ) : (
        <>
          <div className={GRID_CLASS}>{visible.map((category) => renderChip(category))}</div>
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 hover:text-green-900"
            >
              {expanded ? (
                <>
                  Show less <FiChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Show all {categories.length} <FiChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default BuySellCategoryGrid;
