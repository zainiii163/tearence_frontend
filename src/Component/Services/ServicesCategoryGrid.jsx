import React, { useState } from 'react';
import { FiChevronRight, FiGrid } from 'react-icons/fi';
import CompactCategoryChips, { COMPACT_CHIP_GRID } from '../shared/CompactCategoryChips';
import { resolveCategoryEmoji } from '../../utils/serviceCategoryUtils';

/**
 * Services categories — short consistent chips (Buy & Sell style).
 * Never renders heroicon class names as text.
 */
const ServicesCategoryGrid = ({
  categories = [],
  selectedSlug = null,
  onSelectCategory,
  title = 'Categories',
  variant = 'chips',
}) => {
  const [openSlug, setOpenSlug] = useState(null);

  if (!categories.length) return null;

  const iconFor = (item) => resolveCategoryEmoji(item?.slug, item?.emoji, item?.icon);

  if (variant !== 'groups') {
    return (
      <CompactCategoryChips
        items={categories}
        selectedId={selectedSlug}
        title={title}
        theme="emerald"
        initialVisible={36}
        getId={(c) => c.slug || c.id}
        getLabel={(c) => c.name || c.label}
        getMeta={() => null}
        onSelect={(item) => onSelectCategory?.(item)}
        renderIcon={(item) => (
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-50 text-[11px] shrink-0 leading-none">
            {iconFor(item)}
          </span>
        )}
      />
    );
  }

  const openCat = categories.find((c) => c.slug === openSlug);
  const kids = openCat?.children || [];

  return (
    <section className="mb-3">
      <div className="flex items-center gap-2 mb-1.5">
        <FiGrid className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        <span className="text-[10px] text-gray-500">{categories.length}</span>
      </div>

      <div className={COMPACT_CHIP_GRID}>
        {categories.map((category) => {
          const slug = category.slug || category.id;
          const hasKids = (category.children || []).length > 0;
          const active = openSlug === slug || String(selectedSlug) === String(slug);

          return (
            <button
              key={slug}
              type="button"
              title={category.name || category.label}
              onClick={() => {
                if (hasKids) {
                  setOpenSlug((prev) => (prev === slug ? null : slug));
                  return;
                }
                onSelectCategory?.(category);
              }}
              className={`group flex items-center gap-1.5 min-w-0 bg-white rounded border px-1.5 py-1 text-left transition-colors ${
                active
                  ? 'border-emerald-500 ring-1 ring-emerald-200 bg-emerald-50/60'
                  : 'border-gray-200 hover:border-emerald-400'
              }`}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-50 text-[11px] shrink-0 leading-none">
                {iconFor(category)}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-[10px] sm:text-[11px] font-semibold truncate leading-tight ${
                    active ? 'text-emerald-800' : 'text-gray-800'
                  }`}
                >
                  {category.name || category.label}
                </span>
                {hasKids && (
                  <span className="block text-[9px] text-gray-400 leading-none mt-0.5">
                    {category.children.length} types
                  </span>
                )}
              </span>
              {hasKids && (
                <FiChevronRight
                  className={`h-3 w-3 shrink-0 text-gray-400 transition-transform ${
                    openSlug === slug ? 'rotate-90 text-emerald-600' : ''
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {kids.length > 0 && (
        <div className="mt-2 rounded-md border border-emerald-100 bg-emerald-50/40 px-2.5 py-2">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <p className="text-[11px] font-semibold text-emerald-900">
              {openCat.name} — choose a type
            </p>
            <button
              type="button"
              onClick={() => onSelectCategory?.(openCat)}
              className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-900 underline"
            >
              View all in {openCat.name}
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {kids.map((child) => (
              <button
                key={child.slug}
                type="button"
                onClick={() => onSelectCategory?.(child)}
                className="inline-flex items-center gap-1 rounded border border-white bg-white px-2 py-1 text-[10px] font-semibold text-gray-700 shadow-sm hover:border-emerald-400 hover:text-emerald-800"
              >
                <span className="leading-none" aria-hidden="true">
                  {iconFor(child)}
                </span>
                {child.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesCategoryGrid;
