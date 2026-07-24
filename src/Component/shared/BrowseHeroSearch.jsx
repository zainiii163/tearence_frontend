import React from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * Clive: search field with blue "Search" control in the bar (not a separate button outside).
 */
const BrowseHeroSearch = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Search…',
  accentClass = 'text-blue-600 hover:text-blue-800',
  ringClass = 'focus:ring-blue-300',
}) => (
  <div className="relative">
    <FiSearch className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${accentClass}`} />
    <input
      type="search"
      value={value}
      onChange={onChange}
      onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
      placeholder={placeholder}
      className={`w-full pl-10 pr-[5.5rem] py-3 text-sm rounded-lg border-0 bg-white shadow-lg ${ringClass} focus:ring-2 outline-none`}
    />
    <button
      type="button"
      onClick={onSubmit}
      className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3 py-1.5"
    >
      Search
      <span aria-hidden="true">→</span>
    </button>
  </div>
);

export default BrowseHeroSearch;
