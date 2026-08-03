import React, { useMemo, useState } from 'react';
import { FiGrid, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { CalendarDays, Building2 } from 'lucide-react';

const GRID_CLASS =
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1';

const INITIAL_VISIBLE = 24;

/** Compact chips — same pattern as Buy & Sell / Jobs. */
const EventsVenuesCategoryGrid = ({
  categories = [],
  viewType = 'event',
  selectedCategoryId,
  onSelectCategory,
  loading = false,
  /** Home: show event + venue categories together */
  showAll = false,
  title = 'Categories',
}) => {
  const [expanded, setExpanded] = useState(false);

  const list = (Array.isArray(categories) ? categories : []).filter((cat) => {
    if (showAll) return true;
    return !cat.type || cat.type === viewType || cat.type === 'both';
  });

  const visible = useMemo(() => {
    if (expanded || list.length <= INITIAL_VISIBLE) return list;
    return list.slice(0, INITIAL_VISIBLE);
  }, [list, expanded]);

  const hiddenCount = Math.max(0, list.length - INITIAL_VISIBLE);

  const chipIcon = (category) => {
    if (category.type === 'venue') return Building2;
    if (category.type === 'event') return CalendarDays;
    return viewType === 'venue' ? Building2 : CalendarDays;
  };

  const renderChip = (category) => {
    const id = category.id;
    const active = selectedCategoryId != null && String(selectedCategoryId) === String(id);
    const Icon = chipIcon(category);

    return (
      <button
        key={`${category.type || 'any'}-${id}`}
        type="button"
        onClick={() => onSelectCategory?.(id, category)}
        title={category.name}
        className={`group flex items-center gap-1.5 min-w-0 bg-white rounded border px-1.5 py-1 text-left transition-colors ${
          active
            ? 'border-purple-500 ring-1 ring-purple-200 bg-purple-50/50'
            : 'border-gray-200 hover:border-purple-400'
        }`}
      >
        <span
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded ${
            active ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <Icon className="h-3 w-3" />
        </span>
        <span
          className={`text-[10px] sm:text-[11px] font-semibold truncate leading-tight ${
            active ? 'text-purple-900' : 'text-gray-800 group-hover:text-purple-800'
          }`}
        >
          {category.name}
        </span>
      </button>
    );
  };

  if (!loading && list.length === 0) return null;

  return (
    <section className="mb-4">
      <div className="flex items-center gap-2 mb-1.5">
        <FiGrid className="h-3.5 w-3.5 text-purple-600 shrink-0" />
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        <span className="text-[10px] text-gray-500">{loading ? '…' : `${list.length}`}</span>
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
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900"
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

export default EventsVenuesCategoryGrid;
