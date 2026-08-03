import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FilterSidebar, FilterSidebarPanel } from './FilterSidebarPanel';

const OptionButton = ({ label, active, onClick, theme = 'red' }) => {
  const activeClass =
    theme === 'blue'
      ? 'bg-blue-700 text-white border-blue-700'
      : theme === 'amber'
        ? 'bg-amber-600 text-white border-amber-600'
        : theme === 'green'
          ? 'bg-green-700 text-white border-green-700'
          : theme === 'purple'
            ? 'bg-purple-700 text-white border-purple-700'
            : theme === 'slate'
              ? 'bg-[#0c1520] text-[#f3efe6] border-[#0c1520]'
              : 'bg-red-700 text-white border-red-700';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-center font-semibold text-sm py-2.5 px-4 rounded-[10px] border-2 transition-all duration-200 ${
        active ? `${activeClass} shadow-sm` : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
};

/** Mobile: slides in from the left (CarServices style). Desktop uses sticky sidebar. */
export const FilterDrawer = ({
  show,
  onClose,
  onApply,
  onClear,
  title = '',
  theme = 'blue',
  applyLabel = 'Apply',
  homeHref = '/',
  children,
}) => {
  const navigate = useNavigate();
  const homeClass =
    theme === 'slate'
      ? 'bg-[#0c1520] ring-2 ring-[#b8895a]/60'
      : 'bg-gradient-to-br from-teal-500 to-cyan-600';
  const applyClass =
    theme === 'slate'
      ? 'bg-[#0c1520] hover:bg-[#1a2838]'
      : 'bg-[#1e3a5f] hover:bg-[#162d4a]';

  useEffect(() => {
    if (!show) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className={`fixed top-0 left-0 z-50 h-full w-[min(300px,88vw)] shadow-2xl overflow-y-auto lg:hidden ${
              theme === 'slate' ? 'bg-[#faf8f4] rounded-none' : 'bg-white rounded-r-[20px]'
            }`}
          >
            <div className="p-5 pt-5">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(homeHref);
                  }}
                  aria-label="Home"
                  className={`flex h-11 w-11 items-center justify-center text-white shadow-md ${
                    theme === 'slate' ? 'rounded-none' : 'rounded-full'
                  } ${homeClass}`}
                >
                  <FiHome className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                  aria-label="Close"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <p className="sr-only">{title}</p>
              {children}
              <button
                type="button"
                onClick={onApply}
                className={`w-full mt-4 py-3 text-white font-bold text-sm shadow-sm ${
                  theme === 'slate' ? 'rounded-none' : 'rounded-full'
                } ${applyClass}`}
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
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export { FilterSidebar, FilterSidebarPanel, OptionButton };
