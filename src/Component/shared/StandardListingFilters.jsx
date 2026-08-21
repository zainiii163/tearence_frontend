import React, { useState } from 'react';

/**
 * CarServices-style sidebar options — black triangle chevrons.
 * Search lives in the page hero only (Clive: no search inside the filter panel).
 * Order: Category → Price → Location → Type of advert
 */
const THEME_CLASSES = {
  green: {
    focus: 'focus:ring-green-500 focus:border-green-500',
    active: 'bg-[#1e3a5f] text-white border-[#1e3a5f]',
  },
  purple: {
    focus: 'focus:ring-purple-500 focus:border-purple-500',
    active: 'bg-[#1e3a5f] text-white border-[#1e3a5f]',
  },
  red: {
    focus: 'focus:ring-red-500 focus:border-red-500',
    active: 'bg-[#1e3a5f] text-white border-[#1e3a5f]',
  },
  amber: {
    focus: 'focus:ring-amber-500 focus:border-amber-500',
    active: 'bg-[#1e3a5f] text-white border-[#1e3a5f]',
  },
  emerald: {
    focus: 'focus:ring-emerald-500 focus:border-emerald-500',
    active: 'bg-[#1e3a5f] text-white border-[#1e3a5f]',
  },
  orange: {
    focus: 'focus:ring-orange-500 focus:border-orange-500',
    active: 'bg-[#1e3a5f] text-white border-[#1e3a5f]',
  },
  blue: {
    focus: 'focus:ring-blue-500 focus:border-blue-500',
    active: 'bg-[#1e3a5f] text-white border-[#1e3a5f]',
  },
  slate: {
    focus: 'focus:ring-[#b8895a] focus:border-[#b8895a]',
    active: 'bg-[#0c1520] text-[#f3efe6] border-[#0c1520]',
  },
};

const POST_TYPES = [
  { key: 'featured', label: 'Featured' },
  { key: 'promoted', label: 'Promoted' },
  { key: 'sponsored', label: 'Sponsored' },
];

/** Black triangle like CarServices reference */
const Triangle = ({ open }) => (
  <span
    className="inline-block w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-gray-900 shrink-0 transition-transform duration-200"
    style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
    aria-hidden="true"
  />
);

const FilterSection = ({ id, title, open, onToggle, children }) => (
  <div className="border-b border-gray-200">
    <button
      type="button"
      onClick={() => onToggle(id)}
      className="w-full flex items-center gap-2.5 py-3.5 text-left hover:bg-gray-50/80 px-0.5"
      aria-expanded={open}
    >
      <Triangle open={open} />
      <span className="text-[15px] font-medium text-gray-900">{title}</span>
    </button>
    {open && <div className="pb-3 pl-5 pr-0.5">{children}</div>}
  </div>
);

const StandardListingFilters = ({
  filters = {},
  onFilterChange,
  onApply,
  onClear,
  theme = 'blue',
  showPrice = true,
  showCategory = true,
  showAdvertType = true,
  categoryOptions = null,
  title = '',
  extraFields = null,
  asPanel = true,
  showActions = true,
  showTitle = false,
}) => {
  const t = THEME_CLASSES[theme] || THEME_CLASSES.blue;
  const inputClass = `w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 ${t.focus} focus:ring-2`;

  const categories = Array.isArray(categoryOptions) ? categoryOptions : [];
  const hasCategories = showCategory && categories.length > 0;

  // Category open by default when options exist (Clive: start with category)
  const [openSections, setOpenSections] = useState({
    category: true,
    price: false,
    location: false,
    listing: false,
  });

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggle = (key) => onFilterChange(key, !filters[key]);

  const body = (
    <>
      {showTitle && title ? (
        <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
      ) : null}

      {hasCategories && (
        <FilterSection
          id="category"
          title="Category"
          open={openSections.category}
          onToggle={toggleSection}
        >
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Browse by category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className={inputClass}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((cat) => {
              const id = String(cat.id ?? cat.category_id ?? cat.slug ?? cat.value ?? '');
              const label = cat.name || cat.category_name || cat.label || id;
              if (!id) return null;
              return (
                <option key={id} value={id}>
                  {label}
                </option>
              );
            })}
          </select>
        </FilterSection>
      )}

      {showPrice && (
        <FilterSection
          id="price"
          title="Price"
          open={openSections.price}
          onToggle={toggleSection}
        >
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={filters.priceMin || ''}
              onChange={(e) => onFilterChange('priceMin', e.target.value)}
              className={inputClass}
              aria-label="Minimum price"
            />
            <span className="text-gray-400 text-sm shrink-0">–</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={filters.priceMax || ''}
              onChange={(e) => onFilterChange('priceMax', e.target.value)}
              className={inputClass}
              aria-label="Maximum price"
            />
          </div>
        </FilterSection>
      )}

      <FilterSection
        id="location"
        title="Location"
        open={openSections.location}
        onToggle={toggleSection}
      >
        <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
        <input
          type="text"
          placeholder="Country"
          value={filters.country || ''}
          onChange={(e) => onFilterChange('country', e.target.value)}
          className={`${inputClass} mb-2`}
        />
        <label className="block text-xs font-medium text-gray-500 mb-1">City / Town</label>
        <input
          type="text"
          placeholder="City or town"
          value={filters.city || ''}
          onChange={(e) => onFilterChange('city', e.target.value)}
          className={inputClass}
        />
      </FilterSection>

      {showAdvertType && (
        <FilterSection
          id="listing"
          title="Type of advert"
          open={openSections.listing}
          onToggle={toggleSection}
        >
          <div className="space-y-2">
            {POST_TYPES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                className={`w-full text-center font-semibold text-sm py-2.5 px-4 rounded-[10px] border-2 transition-all ${
                  filters[key]
                    ? `${t.active} shadow-sm`
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {extraFields}
    </>
  );

  // Actions live on FilterSidebarPanel / FilterDrawer
  if (!asPanel) {
    return <div className="space-y-0">{body}</div>;
  }

  return (
    <aside className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 p-5">
      {body}
      {showActions && (
        <>
          <button
            type="button"
            onClick={onApply}
            className="w-full mt-4 py-3 rounded-full text-white font-bold text-sm bg-[#1e3a5f] hover:bg-[#162d4a]"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={onClear}
            className="w-full mt-2 py-1.5 text-xs font-medium text-gray-500"
          >
            Clear all
          </button>
        </>
      )}
    </aside>
  );
};

export default StandardListingFilters;
