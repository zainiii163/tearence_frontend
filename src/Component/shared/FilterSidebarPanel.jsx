import React from 'react';
import { FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const APPLY_BTN = {
  green: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
  purple: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
  red: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
  amber: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
  emerald: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
  orange: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
  blue: 'bg-[#1e3a5f] hover:bg-[#162d4a]',
  slate: 'bg-[#0c1520] hover:bg-[#1a2838]',
};

const HOME_BTN = {
  green: 'bg-gradient-to-br from-teal-500 to-cyan-600',
  purple: 'bg-gradient-to-br from-teal-500 to-cyan-600',
  red: 'bg-gradient-to-br from-teal-500 to-cyan-600',
  amber: 'bg-gradient-to-br from-teal-500 to-cyan-600',
  emerald: 'bg-gradient-to-br from-teal-500 to-cyan-600',
  orange: 'bg-gradient-to-br from-teal-500 to-cyan-600',
  blue: 'bg-gradient-to-br from-teal-500 to-cyan-600',
  slate: 'bg-[#0c1520] ring-2 ring-[#b8895a]/60',
};

/** CarServices-style sticky options card — white, rounded, home button, Apply */
export const FilterSidebar = ({ children, className = '', theme = 'blue' }) => (
  <aside
    className={`${
      theme === 'slate'
        ? 'bg-[#faf8f4] rounded-none border border-[#0c1520]/12 shadow-none'
        : 'bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100'
    } p-5 ${className}`}
  >
    {children}
  </aside>
);

export const FilterSidebarPanel = ({
  onApply,
  onClear,
  theme = 'blue',
  applyLabel = 'Apply',
  homeHref = '/',
  children,
}) => {
  const navigate = useNavigate();
  const btnClass = APPLY_BTN[theme] || APPLY_BTN.blue;
  const homeClass = HOME_BTN[theme] || HOME_BTN.blue;
  const isSlate = theme === 'slate';

  return (
    <FilterSidebar theme={theme}>
      <button
        type="button"
        onClick={() => navigate(homeHref)}
        aria-label="Home"
        className={`mb-4 flex h-11 w-11 items-center justify-center text-white shadow-md hover:opacity-95 transition-opacity ${
          isSlate ? 'rounded-none' : 'rounded-full'
        } ${homeClass}`}
      >
        <FiHome className="h-5 w-5" />
      </button>

      {children}

      <button
        type="button"
        onClick={onApply}
        className={`w-full mt-4 py-3 text-white font-bold text-sm transition-colors shadow-sm ${
          isSlate ? 'rounded-none' : 'rounded-full'
        } ${btnClass}`}
      >
        {applyLabel}
      </button>
      {typeof onClear === 'function' && (
        <button
          type="button"
          onClick={onClear}
          className="w-full mt-2 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800"
        >
          Clear all
        </button>
      )}
    </FilterSidebar>
  );
};

export default FilterSidebarPanel;
