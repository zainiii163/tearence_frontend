import React, { useMemo, useState } from 'react';
import { FiGrid, FiChevronDown, FiChevronUp, FiStar } from 'react-icons/fi';

const GRID_CLASS =
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1';

const INITIAL_VISIBLE = 24;

/** Compact chips — same pattern as Buy & Sell / Services. */
const SponsoredCategoryGrid = ({
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
            ? 'border-amber-500 ring-1 ring-amber-200 bg-amber-50/50'
            : 'border-gray-200 hover:border-amber-400'
        }`}
      >
        <span
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded ${
            active ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <FiStar className="h-3 w-3" />
        </span>
        <span
          className={`text-[10px] sm:text-[11px] font-semibold truncate leading-tight ${
            active ? 'text-amber-900' : 'text-gray-800 group-hover:text-amber-800'
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
        <FiGrid className="h-3.5 w-3.5 text-amber-600 shrink-0" />
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
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-900"
            >
              {expanded ? (
                <>
                  Show less <FiChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Show all {list.length} <FiChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default SponsoredCategoryGrid;
