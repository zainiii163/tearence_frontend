import React from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * Clive: search field with “Search” control in the bar (not a separate button outside).
 * size="xs" | "sm" | "md" — optional buttonClass for brand-matched CTA colour.
 */
const BrowseHeroSearch = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Search…',
  size = 'md',
  accentClass = 'text-blue-600 hover:text-blue-800',
  ringClass = 'focus:ring-blue-300',
  buttonClass = 'bg-blue-600 hover:bg-blue-700',
}) => {
  const isXs = size === 'xs';
  const isSm = size === 'sm' || isXs;

  return (
    <div
      className={`relative ${
        isSm ? (isXs ? 'max-w-[16rem] sm:max-w-xs mx-auto' : 'max-w-sm mx-auto') : ''
      }`}
    >
      <FiSearch
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${
          isXs ? 'left-2 h-3 w-3' : isSm ? 'left-2.5 h-3.5 w-3.5' : 'left-3 h-4 w-4'
        } ${accentClass}`}
      />
      <input
        type="search"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
        placeholder={placeholder}
        className={`w-full border-0 bg-white outline-none focus:ring-2 ${ringClass} ${
          isXs
            ? 'pl-7 pr-[4.25rem] py-1 text-[11px] leading-tight rounded-lg shadow-md'
            : isSm
              ? 'pl-8 pr-[5rem] py-2 text-xs rounded-xl shadow-lg'
              : 'pl-10 pr-[5.5rem] py-3 text-sm rounded-lg shadow-lg'
        }`}
      />
      <button
        type="button"
        onClick={onSubmit}
        className={`absolute right-1 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 text-white font-semibold transition-colors ${buttonClass} ${
          isXs
            ? 'text-[10px] px-1.5 py-0.5 rounded-md'
            : isSm
              ? 'text-[11px] px-2.5 py-1 rounded-lg'
              : 'text-xs sm:text-sm px-3 py-1.5 right-1.5 rounded-md'
        }`}
      >
        Search
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
};

export default BrowseHeroSearch;
