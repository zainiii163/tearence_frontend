import React, { useState, useEffect, useMemo } from 'react';
import { FiGrid, FiChevronDown, FiChevronUp, FiBriefcase } from 'react-icons/fi';
import jobService from '../../services/JobServices';

const GRID_CLASS =
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1';

const INITIAL_VISIBLE = 24;

const extractCategories = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data?.data)) return response.data.data;
  if (Array.isArray(response.categories)) return response.categories;
  return [];
};

/** Compact chips — same pattern as Buy & Sell / Services. */
const JobsCategoryGrid = ({ selectedCategorySlug, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await jobService.getCategories();
        if (!cancelled) setCategories(extractCategories(res));
      } catch (error) {
        console.error('Error fetching job categories:', error);
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => {
    if (expanded || categories.length <= INITIAL_VISIBLE) return categories;
    return categories.slice(0, INITIAL_VISIBLE);
  }, [categories, expanded]);

  const hiddenCount = Math.max(0, categories.length - INITIAL_VISIBLE);

  const renderChip = (category) => {
    const slug = category.slug || String(category.id);
    const active = selectedCategorySlug && String(selectedCategorySlug) === String(slug);

    return (
      <button
        key={category.id ?? slug}
        type="button"
        onClick={() => onSelectCategory(slug)}
        title={category.name}
        className={`group flex items-center gap-1.5 min-w-0 bg-white rounded border px-1.5 py-1 text-left transition-colors ${
          active
            ? 'border-blue-500 ring-1 ring-blue-200 bg-blue-50/50'
            : 'border-gray-200 hover:border-blue-400'
        }`}
      >
        <span
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded ${
            active ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <FiBriefcase className="h-3 w-3" />
        </span>
        <span
          className={`text-[10px] sm:text-[11px] font-semibold truncate leading-tight ${
            active ? 'text-blue-800' : 'text-gray-800 group-hover:text-blue-700'
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
        <FiGrid className="h-3.5 w-3.5 text-blue-600 shrink-0" />
        <h2 className="text-sm font-bold text-gray-900">Categories</h2>
        <span className="text-[10px] text-gray-500">{loading ? '…' : `${categories.length}`}</span>
      </div>

      {loading ? (
        <div className={GRID_CLASS}>
          {[...Array(12)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-100 rounded h-7" />
          ))}
        </div>
      ) : categories.length === 0 ? null : (
        <>
          <div className={GRID_CLASS}>{visible.map((category) => renderChip(category))}</div>
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900"
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

export default JobsCategoryGrid;
