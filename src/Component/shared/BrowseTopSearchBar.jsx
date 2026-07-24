import React from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * Top search bar for browse pages (Clive spec: search at top).
 */
const BrowseTopSearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search listings…',
  theme = 'purple',
}) => {
  const ringClass = {
    purple: 'focus:ring-purple-500 focus:border-purple-500',
    green: 'focus:ring-green-500 focus:border-green-500',
    red: 'focus:ring-red-500 focus:border-red-500',
    amber: 'focus:ring-amber-500 focus:border-amber-500',
    emerald: 'focus:ring-emerald-500 focus:border-emerald-500',
  }[theme] || 'focus:ring-purple-500 focus:border-purple-500';

  const btnClass = {
    purple: 'bg-purple-700 hover:bg-purple-800',
    green: 'bg-green-700 hover:bg-green-800',
    red: 'bg-red-700 hover:bg-red-800',
    amber: 'bg-amber-600 hover:bg-amber-700',
    emerald: 'bg-emerald-700 hover:bg-emerald-800',
  }[theme] || 'bg-purple-700 hover:bg-purple-800';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) onSubmit();
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-2 max-w-2xl">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            className={`w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white focus:ring-2 ${ringClass}`}
          />
        </div>
        {onSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl shrink-0 ${btnClass}`}
          >
            Search
          </button>
        )}
      </div>
    </div>
  );
};

export default BrowseTopSearchBar;
