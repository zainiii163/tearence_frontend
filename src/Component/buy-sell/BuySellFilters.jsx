import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const PRICE_PRESETS = [
  { value: '', label: 'Any price' },
  { value: '0-50', label: 'Under $50' },
  { value: '50-100', label: '$50 – $100' },
  { value: '100-250', label: '$100 – $250' },
  { value: '250-500', label: '$250 – $500' },
  { value: '500-1000', label: '$500 – $1,000' },
  { value: '1000+', label: 'Over $1,000' },
];

const CONDITIONS = [
  { value: '', label: 'Any condition' },
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like new' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

const ITEM_TYPES = [
  { value: '', label: 'All types' },
  { value: 'for_sale', label: 'For sale' },
  { value: 'for_swap', label: 'For swap' },
  { value: 'give_away', label: 'Give away' },
];

const POST_TYPES = [
  { key: 'sponsored', label: 'Sponsored' },
  { key: 'promoted', label: 'Promoted' },
  { key: 'featured', label: 'Featured' },
  { key: 'urgent', label: 'Urgent' },
  { key: 'other', label: 'Other' },
];

const OptionButton = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-center font-semibold text-sm py-2.5 px-4 rounded-[10px] border-2 transition-all duration-200 ${
      active
        ? 'bg-green-700 text-white border-green-700 shadow-sm'
        : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50'
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
        ? 'bg-green-700 text-white border-green-700 shadow-sm'
        : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50'
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
}) => (
  <>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-bold text-gray-900 sr-only">Options</h3>
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
      <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200">
        <p className="text-[10px] uppercase tracking-wide font-semibold text-green-600 mb-1">Category</p>
        <p className="text-sm font-bold text-green-900">{lockedCategoryLabel}</p>
      </div>
    )}

    <details className="border-b border-gray-200 pb-3 mb-3 group">
      <summary className="filter-title-csltd list-none cursor-pointer select-none">
        Price range
      </summary>
      <div className="mt-3 space-y-2">
        {PRICE_PRESETS.map((range) => (
          <OptionButton
            key={range.value || 'any-price'}
            label={range.label}
            active={(filters.priceRange || '') === range.value}
            onClick={() => onFilterChange('priceRange', range.value)}
          />
        ))}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="number"
            min="0"
            placeholder="Min $"
            value={filters.priceMin || ''}
            onChange={(e) => onFilterChange('priceMin', e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max $"
            value={filters.priceMax || ''}
            onChange={(e) => onFilterChange('priceMax', e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
          />
        </div>
      </div>
    </details>

    <details className="border-b border-gray-200 pb-3 mb-3">
      <summary className="filter-title-csltd list-none cursor-pointer select-none">
        Condition
      </summary>
      <div className="mt-3 space-y-2">
        {CONDITIONS.map((condition) => (
          <OptionButton
            key={condition.value || 'any-condition'}
            label={condition.label}
            active={(filters.condition || '') === condition.value}
            onClick={() => onFilterChange('condition', condition.value)}
          />
        ))}
      </div>
    </details>

    <details className="border-b border-gray-200 pb-3 mb-3">
      <summary className="filter-title-csltd list-none cursor-pointer select-none">
        Listing type
      </summary>
      <div className="mt-3 space-y-2">
        {ITEM_TYPES.map((type) => (
          <OptionButton
            key={type.value || 'any-type'}
            label={type.label}
            active={(filters.itemType || '') === type.value}
            onClick={() => onFilterChange('itemType', type.value)}
          />
        ))}
      </div>
    </details>

    <details className="border-b border-gray-200 pb-3 mb-3">
      <summary className="filter-title-csltd list-none cursor-pointer select-none">
        Post type
      </summary>
      <div className="mt-3 space-y-2">
        {POST_TYPES.map(({ key, label }) => (
          <ToggleOption
            key={key}
            label={label}
            active={!!filters[key]}
            onClick={() => onFilterChange(key, !filters[key])}
          />
        ))}
        <p className="text-[11px] text-gray-500 pt-1 leading-snug">
          Select one or more. &quot;Other&quot; shows standard listings.
        </p>
      </div>
    </details>

    <details className="border-b border-gray-200 pb-3 mb-3">
      <summary className="filter-title-csltd list-none cursor-pointer select-none">
        Location
      </summary>
      <div className="mt-3 space-y-2">
        <label className="block text-xs font-medium text-gray-500 mb-1" htmlFor="buysell-filter-city">
          City
        </label>
        <input
          id="buysell-filter-city"
          type="text"
          placeholder="Enter city"
          value={filters.city || ''}
          onChange={(e) => onFilterChange('city', e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
        />
        <label className="block text-xs font-medium text-gray-500 mb-1 mt-2" htmlFor="buysell-filter-country">
          Country
        </label>
        <input
          id="buysell-filter-country"
          type="text"
          placeholder="Enter country"
          value={filters.country || ''}
          onChange={(e) => onFilterChange('country', e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
        />
      </div>
    </details>

    <button
      type="button"
      onClick={onApply}
      className="w-full py-3 rounded-full bg-green-700 hover:bg-green-800 text-white font-semibold text-sm transition-colors shadow-sm"
    >
      Apply
    </button>

    <button
      type="button"
      onClick={onClearFilters}
      className="w-full mt-2 py-2 text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
    >
      Clear all
    </button>
  </>
);

const BuySellFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  onApply,
  showFilters,
  setShowFilters,
  variant = 'drawer',
  lockedCategoryId = null,
  lockedCategoryLabel = '',
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

  if (variant === 'sidebar') {
    return (
      <aside className="bg-white border border-gray-300 rounded-2xl shadow-md p-5">
        <FilterPanelContent
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          onApply={handleApply}
          showClose={false}
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
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default BuySellFilters;
