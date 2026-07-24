import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const CATEGORIES = [
  { id: 'retail', label: 'Retail & Shopping' },
  { id: 'restaurants', label: 'Restaurants & Food' },
  { id: 'services', label: 'Professional Services' },
  { id: 'healthcare', label: 'Healthcare & Wellness' },
  { id: 'education', label: 'Education & Training' },
  { id: 'automotive', label: 'Automotive' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'entertainment', label: 'Entertainment & Leisure' },
  { id: 'travel', label: 'Travel & Hospitality' },
  { id: 'beauty', label: 'Beauty & Personal Care' },
  { id: 'pets', label: 'Pet Services' },
  { id: 'home-garden', label: 'Home & Garden' },
  { id: 'technology', label: 'Technology & Electronics' },
  { id: 'sports-fitness', label: 'Sports & Fitness' },
  { id: 'industrial', label: 'Industrial & Manufacturing' },
  { id: 'non-profit', label: 'Non-Profit & Religious' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Any status' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
];

const POST_TYPES = [
  { key: 'sponsored', label: 'Sponsored' },
  { key: 'promoted', label: 'Promoted' },
  { key: 'featured', label: 'Featured' },
  { key: 'verified', label: 'Verified' },
  { key: 'other', label: 'Other' },
];

const OptionButton = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-center font-semibold text-sm py-2.5 px-4 rounded-[10px] border-2 transition-all duration-200 ${
      active
        ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
        : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-purple-400 hover:bg-purple-50'
    }`}
  >
    {label}
  </button>
);

const ToggleOption = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-center font-semibold text-sm py-2.5 px-4 rounded-[10px] border-2 transition-all duration-200 ${
      active
        ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
        : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-purple-400 hover:bg-purple-50'
    }`}
  >
    {label}
  </button>
);

const FilterPanelContent = ({
  filters,
  onFilterChange,
  onClearFilters,
  onApply,
  showClose,
  onClose,
  lockedCategoryId = null,
  lockedCategoryLabel = '',
  categoryPageMode = false,
  onCategorySelect,
}) => (
  <>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-bold text-gray-900">Filters</h3>
      {showClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          aria-label="Close filters"
        >
          <FiX className="h-5 w-5" />
        </button>
      )}
    </div>

    {lockedCategoryId && (
      <div className="mb-4 p-3 rounded-xl bg-purple-50 border border-purple-200">
        <p className="text-[10px] uppercase tracking-wide font-semibold text-purple-600 mb-1">Current category</p>
        <p className="text-sm font-bold text-purple-900">{lockedCategoryLabel}</p>
      </div>
    )}

    <details className="border-b border-gray-200 pb-3 mb-3" open={categoryPageMode || undefined}>
      <summary className="filter-title-csltd list-none cursor-pointer select-none">Search</summary>
      <div className="mt-3">
        <input
          type="text"
          placeholder={lockedCategoryId ? `Search in ${lockedCategoryLabel}…` : 'Business name, keyword…'}
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
        />
      </div>
    </details>

    <details className="border-b border-gray-200 pb-3 mb-3" open={categoryPageMode || undefined}>
      <summary className="filter-title-csltd list-none cursor-pointer select-none">Location</summary>
      <div className="mt-3 space-y-2">
        <label className="block text-xs font-medium text-gray-500 mb-1" htmlFor="business-filter-city">
          City / area
        </label>
        <input
          id="business-filter-city"
          type="text"
          placeholder="Enter city or area"
          value={filters.city || ''}
          onChange={(e) => onFilterChange('city', e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
        />
        <label className="block text-xs font-medium text-gray-500 mb-1 mt-2" htmlFor="business-filter-country">
          Country
        </label>
        <input
          id="business-filter-country"
          type="text"
          placeholder="Enter country"
          value={filters.country || ''}
          onChange={(e) => onFilterChange('country', e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
        />
      </div>
    </details>

    <details className="border-b border-gray-200 pb-3 mb-3" open={categoryPageMode || undefined}>
      <summary className="filter-title-csltd list-none cursor-pointer select-none">All categories</summary>
      <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
        {!categoryPageMode && (
          <OptionButton
            label="All categories"
            active={!filters.category}
            onClick={() => onFilterChange('category', '')}
          />
        )}
        {CATEGORIES.map((cat) => (
          <OptionButton
            key={cat.id}
            label={cat.label}
            active={filters.category === cat.id || lockedCategoryId === cat.id}
            onClick={() => {
              if (onCategorySelect) {
                onCategorySelect(cat.id);
              } else {
                onFilterChange('category', cat.id);
              }
            }}
          />
        ))}
      </div>
    </details>

    {!categoryPageMode && (
      <>
        <details className="border-b border-gray-200 pb-3 mb-3">
          <summary className="filter-title-csltd list-none cursor-pointer select-none">Status</summary>
          <div className="mt-3 space-y-2">
            {STATUS_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value || 'any-status'}
                label={opt.label}
                active={(filters.status || '') === opt.value}
                onClick={() => onFilterChange('status', opt.value)}
              />
            ))}
          </div>
        </details>

        <details className="border-b border-gray-200 pb-3 mb-3">
          <summary className="filter-title-csltd list-none cursor-pointer select-none">Post type</summary>
          <div className="mt-3 space-y-2">
            {POST_TYPES.map(({ key, label }) => (
              <ToggleOption
                key={key}
                label={label}
                active={!!filters[key]}
                onClick={() => onFilterChange(key, !filters[key])}
              />
            ))}
          </div>
        </details>
      </>
    )}

    <button
      type="button"
      onClick={onApply}
      className="w-full py-3 rounded-full bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm transition-colors shadow-sm"
    >
      Apply filters
    </button>

    <button
      type="button"
      onClick={onClearFilters}
      className="w-full mt-2 py-2 text-sm font-medium text-gray-600 hover:text-purple-700 transition-colors"
    >
      Clear all
    </button>
  </>
);

const BusinessFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  onApply,
  showFilters,
  setShowFilters,
  variant = 'drawer',
  lockedCategoryId = null,
  lockedCategoryLabel = '',
  onCategorySelect,
}) => {
  useEffect(() => {
    if (variant !== 'drawer' || !showFilters) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showFilters, variant]);

  const handleApply = () => {
    if (onApply) onApply();
    if (setShowFilters) setShowFilters(false);
  };

  const categoryPageMode = Boolean(lockedCategoryId);

  if (variant === 'sidebar') {
    return (
      <aside className="bg-white border border-gray-300 rounded-2xl shadow-md p-5">
        <FilterPanelContent
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          onApply={handleApply}
          showClose={false}
          lockedCategoryId={lockedCategoryId}
          lockedCategoryLabel={lockedCategoryLabel}
          categoryPageMode={categoryPageMode}
          onCategorySelect={onCategorySelect}
        />
      </aside>
    );
  }

  return (
    <AnimatePresence>
      {showFilters && (
        <>
          <motion.button
            type="button"
            aria-label="Close filters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
            className="fixed inset-0 z-40 bg-black/50 xl:hidden"
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed top-0 left-0 z-50 h-full w-[min(320px,90vw)] bg-white shadow-2xl overflow-y-auto xl:hidden"
          >
            <div className="p-5 pt-6">
              <FilterPanelContent
                filters={filters}
                onFilterChange={onFilterChange}
                onClearFilters={onClearFilters}
                onApply={handleApply}
                showClose
                onClose={() => setShowFilters(false)}
                lockedCategoryId={lockedCategoryId}
                lockedCategoryLabel={lockedCategoryLabel}
                categoryPageMode={categoryPageMode}
                onCategorySelect={onCategorySelect}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default BusinessFilters;
export { CATEGORIES };
