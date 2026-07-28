import React, { useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiGrid } from 'react-icons/fi';

/**
 * Shared compact category chips — horizontal icon + label, short height.
 * Same density as Buy & Sell categories.
 */
export const COMPACT_CHIP_GRID =
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1';

const THEME = {
  green: {
    iconWrap: 'bg-green-100 text-green-700',
    active: 'border-green-500 ring-1 ring-green-200 bg-green-50/50',
    activeText: 'text-green-800',
    hover: 'hover:border-green-400',
    title: 'text-green-600',
    link: 'text-green-700 hover:text-green-900',
  },
  emerald: {
    iconWrap: 'bg-emerald-100 text-emerald-700',
    active: 'border-emerald-500 ring-1 ring-emerald-200 bg-emerald-50/50',
    activeText: 'text-emerald-800',
    hover: 'hover:border-emerald-400',
    title: 'text-emerald-600',
    link: 'text-emerald-700 hover:text-emerald-900',
  },
  teal: {
    iconWrap: 'bg-teal-100 text-teal-700',
    active: 'border-teal-500 ring-1 ring-teal-200 bg-teal-50/50',
    activeText: 'text-teal-800',
    hover: 'hover:border-teal-400',
    title: 'text-teal-600',
    link: 'text-teal-700 hover:text-teal-900',
  },
  red: {
    iconWrap: 'bg-red-100 text-red-700',
    active: 'border-red-500 ring-1 ring-red-200 bg-red-50/40',
    activeText: 'text-red-800',
    hover: 'hover:border-red-400',
    title: 'text-red-600',
    link: 'text-red-700 hover:text-red-900',
  },
  purple: {
    iconWrap: 'bg-purple-100 text-purple-700',
    active: 'border-purple-500 ring-1 ring-purple-200 bg-purple-50/50',
    activeText: 'text-purple-800',
    hover: 'hover:border-purple-400',
    title: 'text-purple-600',
    link: 'text-purple-700 hover:text-purple-900',
  },
  amber: {
    iconWrap: 'bg-amber-100 text-amber-800',
    active: 'border-amber-500 ring-1 ring-amber-200 bg-amber-50/50',
    activeText: 'text-amber-900',
    hover: 'hover:border-amber-400',
    title: 'text-amber-600',
    link: 'text-amber-700 hover:text-amber-900',
  },
  orange: {
    iconWrap: 'bg-orange-100 text-orange-700',
    active: 'border-orange-500 ring-1 ring-orange-200 bg-orange-50/50',
    activeText: 'text-orange-900',
    hover: 'hover:border-orange-400',
    title: 'text-orange-600',
    link: 'text-orange-700 hover:text-orange-900',
  },
  slate: {
    iconWrap: 'bg-slate-200 text-slate-800',
    active: 'border-amber-600 ring-1 ring-amber-200 bg-amber-50/40',
    activeText: 'text-slate-900',
    hover: 'hover:border-slate-400',
    title: 'text-amber-700',
    link: 'text-amber-800 hover:text-amber-950',
  },
};

const CompactCategoryChips = ({
  items = [],
  selectedId = null,
  onSelect,
  title = 'Categories',
  theme = 'green',
  initialVisible = 24,
  getId = (item) => item.id ?? item.slug ?? item.key,
  getLabel = (item) => item.name || item.label || String(getId(item)),
  getMeta = (item) => item.meta || item.count || item.subtitle || null,
  renderIcon = null,
}) => {
  const [expanded, setExpanded] = useState(false);
  const t = THEME[theme] || THEME.green;

  const visible = useMemo(() => {
    if (expanded || items.length <= initialVisible) return items;
    return items.slice(0, initialVisible);
  }, [items, expanded, initialVisible]);

  const hiddenCount = Math.max(0, items.length - initialVisible);

  if (!items.length) return null;

  return (
    <section className="mb-3">
      <div className="flex items-center gap-2 mb-1.5">
        <FiGrid className={`h-3.5 w-3.5 shrink-0 ${t.title}`} />
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        <span className="text-[10px] text-gray-500">{items.length}</span>
      </div>

      <div className={COMPACT_CHIP_GRID}>
        {visible.map((item) => {
          const id = getId(item);
          const active = selectedId != null && String(selectedId) === String(id);
          const label = getLabel(item);
          const meta = getMeta(item);

          return (
            <button
              key={id}
              type="button"
              title={label}
              onClick={() => onSelect?.(item, id)}
              className={`group flex items-center gap-1.5 min-w-0 bg-white rounded border px-1.5 py-1 text-left transition-colors ${
                active ? t.active : `border-gray-200 ${t.hover}`
              }`}
            >
              {typeof renderIcon === 'function' ? (
                renderIcon(item, { active, className: 'shrink-0' })
              ) : (
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-md text-[10px] shrink-0 ${t.iconWrap}`}
                >
                  {(() => {
                    const raw = String(item.emoji || item.icon || '').trim();
                    const ok =
                      raw &&
                      raw.length <= 4 &&
                      !/^heroicon|^lucide|^fa[-_]/i.test(raw);
                    return ok ? raw : (label.charAt(0) || '?');
                  })()}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-[10px] sm:text-[11px] font-semibold truncate leading-tight ${
                    active ? t.activeText : 'text-gray-800'
                  }`}
                >
                  {label}
                </span>
                {meta != null && meta !== '' && (
                  <span className="block text-[9px] text-gray-400 truncate leading-none mt-0.5">
                    {meta}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold ${t.link}`}
        >
          {expanded ? (
            <>
              Show less <FiChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Show all {items.length} <FiChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      )}
    </section>
  );
};

export default CompactCategoryChips;
