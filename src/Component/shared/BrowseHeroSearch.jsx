import React from 'react';
import { FiSearch } from 'react-icons/fi';

/**
 * Single-bar search: icon + input only (no Search button).
 * Submit on Enter. size="xs" | "sm" | "md"
 */
const BrowseHeroSearch = ({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Search…',
  size = 'md',
  accentClass = 'text-blue-600',
  ringClass = 'focus-within:ring-2 focus-within:ring-blue-300',
}) => {
  const isXs = size === 'xs';
  const isSm = size === 'sm' || isXs;
  const focusRing = String(ringClass || '')
    .replace(/\bfocus:/g, 'focus-within:')
    .replace(/\bfocus-within:ring-2\b/g, '')
    .trim();

  const shell = isXs
    ? `max-w-[18rem] sm:max-w-xs mx-auto h-8 rounded-full focus-within:ring-2 ${focusRing}`
    : isSm
      ? `max-w-sm mx-auto h-9 rounded-full focus-within:ring-2 ${focusRing}`
      : `max-w-md mx-auto h-11 rounded-full focus-within:ring-2 ${focusRing}`;

  const iconCls = isXs
    ? `ml-2.5 h-3.5 w-3.5 shrink-0 ${accentClass}`
    : isSm
      ? `ml-3 h-3.5 w-3.5 shrink-0 ${accentClass}`
      : `ml-3.5 h-4 w-4 shrink-0 ${accentClass}`;

  const inputCls = isXs
    ? 'px-2 pr-3 text-[11px] leading-none'
    : isSm
      ? 'px-2.5 pr-3.5 text-xs'
      : 'px-3 pr-4 text-sm';

  return (
    <form
      className={`flex w-full items-center overflow-hidden bg-white shadow-md ${shell}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      role="search"
    >
      <FiSearch className={`pointer-events-none shrink-0 ${iconCls}`} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`min-w-0 flex-1 border-0 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 ${inputCls}`}
      />
    </form>
  );
};

export default BrowseHeroSearch;
