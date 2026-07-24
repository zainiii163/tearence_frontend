import React from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * Centred search bar on browse pages — always visible (no show/hide toggle).
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
    green: 'focus:ring-green-500 focus:border-green-500',
    purple: 'focus:ring-purple-500 focus:border-purple-500',
    red: 'focus:ring-red-500 focus:border-red-500',
    amber: 'focus:ring-amber-500 focus:border-amber-500',
    emerald: 'focus:ring-emerald-500 focus:border-emerald-500',
    orange: 'focus:ring-orange-500 focus:border-orange-500',
    blue: 'focus:ring-blue-500 focus:border-blue-500',
  }[theme] || 'focus:ring-blue-500 focus:border-blue-500';

  const btn = {
    green: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
    purple: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
    red: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
    amber: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
    emerald: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
    orange: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
    blue: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
  }[theme] || 'bg-[#1e3a5f] hover:bg-[#162d4a]';

  return (
    <div className={`w-full mx-auto ${compact ? 'max-w-lg mb-4' : 'max-w-2xl mb-6'}`}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <FiSearch
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${
              compact ? 'h-3.5 w-3.5' : 'h-4 w-4'
            }`}
          />
          <input
            type="search"
            value={value}
            onChange={onChange}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
            placeholder={placeholder}
            className={`w-full border border-gray-300 rounded-lg bg-white focus:ring-2 ${ring} ${
              compact ? 'pl-8 pr-2.5 py-1.5 text-xs sm:text-sm' : 'pl-9 pr-3 py-2.5 text-sm rounded-xl'
            }`}
          />
        </div>
        <button
          type="button"
          onClick={onSubmit}
          className={`font-semibold text-white shrink-0 rounded-full ${btn} ${
            compact ? 'px-4 py-1.5 text-xs sm:text-sm' : 'px-5 py-2.5 text-sm'
          }`}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default BrowseCenteredSearch;
