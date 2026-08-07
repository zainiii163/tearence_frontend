import React, { useMemo, useState } from 'react';
import { FiGrid, FiChevronDown, FiChevronUp, FiDollarSign } from 'react-icons/fi';

const GRID_CLASS =
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1';

const INITIAL_VISIBLE = 24;

/** Compact chips — same pattern as Sponsored / Buy & Sell. */
const AffiliateCategoryGrid = ({
  categories = [],
  selectedCategoryId,
  onSelectCategory,
  loading = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const list = Array.isArray(categories) ? categories : [];

  const visible = useMemo(() => {
    if (expanded || list.length <= INITIAL_VISIBLE) return list;
    return list.slice(0, INITIAL_VISIBLE);
  }, [list, expanded]);

  const hiddenCount = Math.max(0, list.length - INITIAL_VISIBLE);

  const renderChip = (category) => {
    const id = category.id ?? category.category_id;
    const name = category.name || category.category_name || 'Category';
    const active = selectedCategoryId != null && String(selectedCategoryId) === String(id);

    return (
      <button
        key={id}
        type="button"
        onClick={() => onSelectCategory?.(id)}
        title={name}
        className={`group flex items-center gap-1.5 min-w-0 bg-white rounded border px-1.5 py-1 text-left transition-colors ${
          active
            ? 'border-violet-500 ring-1 ring-violet-200 bg-violet-50/50'
            : 'border-gray-200 hover:border-violet-400'
        }`}
      >
        <span
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded ${
            active ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <FiDollarSign className="h-3 w-3" />
        </span>
        <span
          className={`text-[10px] sm:text-[11px] font-semibold truncate leading-tight ${
            active ? 'text-violet-900' : 'text-gray-800 group-hover:text-violet-800'
          }`}
        >
          {name}
        </span>
      </button>
    );
  };

  return (
    <section className="mb-3">
      <div className="flex items-center gap-2 mb-1.5">
        <FiGrid className="h-3.5 w-3.5 text-violet-600 shrink-0" />
        <h2 className="text-sm font-bold text-gray-900">Categories</h2>
        <span className="text-[10px] text-gray-500">{loading ? '…' : `${list.length}`}</span>
      </div>

      {loading ? (
        <div className={GRID_CLASS}>
          {[...Array(12)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-100 rounded h-7" />
          ))}
        </div>
      ) : list.length === 0 ? null : (
        <>
          <div className={GRID_CLASS}>{visible.map((category) => renderChip(category))}</div>
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-900"
            >
              {expanded ? (
                <>
                  Show less <FiChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Show {hiddenCount} more <FiChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default AffiliateCategoryGrid;
