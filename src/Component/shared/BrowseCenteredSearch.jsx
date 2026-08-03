import React from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * Single centred search bar — icon + input only (no Search button). Enter to submit.
 */
const BrowseCenteredSearch = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search by name…',
  theme = 'green',
  compact = false,
}) => {
  const ring = {
    green: 'focus-within:ring-green-500 focus-within:border-green-500',
    purple: 'focus-within:ring-purple-500 focus-within:border-purple-500',
    red: 'focus-within:ring-red-500 focus-within:border-red-500',
    amber: 'focus-within:ring-amber-500 focus-within:border-amber-500',
    emerald: 'focus-within:ring-emerald-500 focus-within:border-emerald-500',
    orange: 'focus-within:ring-orange-500 focus-within:border-orange-500',
    blue: 'focus-within:ring-blue-500 focus-within:border-blue-500',
  }[theme] || 'focus-within:ring-blue-500 focus-within:border-blue-500';

  return (
    <div className={`w-full mx-auto ${compact ? 'max-w-lg mb-4' : 'max-w-2xl mb-6'}`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.();
        }}
        className={`flex items-center w-full border border-gray-300 bg-white focus-within:ring-2 ${ring} ${
          compact ? 'rounded-lg' : 'rounded-xl'
        }`}
      >
        <FiSearch
          className={`ml-3 shrink-0 text-gray-400 ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`}
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={placeholder}
          className={`min-w-0 flex-1 border-0 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 ${
            compact ? 'px-2.5 py-1.5 text-xs sm:text-sm' : 'px-3 py-2.5 text-sm'
          }`}
        />
      </form>
    </div>
  );
};

export default BrowseCenteredSearch;
