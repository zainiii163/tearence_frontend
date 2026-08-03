import React, { useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';
import { FilterDrawer, FilterSidebarPanel } from './FilterDrawer';

/**
 * CarServices layout:
 * - Optional toggle + left panel on every category page
 * - Mobile open: slide-out from left
 * - Desktop open: sticky left sidebar
 */
export const BrowseFilterLayout = ({
  open,
  onOpenChange,
  onApply,
  onClear,
  theme = 'blue',
  title = '',
  filterFields,
  children,
  activeCount = 0,
  toolbarLeft = null,
  toolbarRight = null,
  homeHref = '/',
  /** Clive property: no Show/Hide control — sidebar stays available */
  hideToggle = false,
  /** Keep desktop sidebar always open when hideToggle */
  forceOpen = false,
}) => {
  const filtersOpen = forceOpen ? true : open;

  // Desktop defaults to filters open; close the mobile drawer on first paint
  // (unless forceOpen — then only close mobile drawer overlay, keep desktop sidebar)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (forceOpen) return;
    if (window.matchMedia('(max-width: 1023px)').matches && open) {
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  const close = () => onOpenChange(false);
  const toggle = () => onOpenChange(!open);
  const isSlate = theme === 'slate';

  const handleApply = () => {
    onApply?.();
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
      close();
    }
  };

  const toggleClass = isSlate
    ? 'property-filter-toggle'
    : 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-[#1e3a5f] hover:bg-[#162d4a] rounded-full';

  const badgeClass = isSlate
    ? 'bg-[var(--prop-copper)] text-[#0c1520] text-[10px] px-1.5 py-0.5 font-bold'
    : 'bg-white text-[#1e3a5f] text-[10px] px-1.5 py-0.5 rounded-full font-bold';

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {!hideToggle && (
            <button
              type="button"
              onClick={toggle}
              className={toggleClass}
              aria-expanded={filtersOpen}
              aria-label={filtersOpen ? 'Hide options' : 'Show options'}
            >
              <FiFilter className="h-3.5 w-3.5 inline" />
              {filtersOpen ? 'Hide' : 'Show'}
              {activeCount > 0 && (
                <span className={badgeClass}>
                  {activeCount}
                </span>
              )}
            </button>
          )}
          {/* Mobile still needs a way to open the panel when toggle is hidden */}
          {hideToggle && (
            <button
              type="button"
              onClick={() => onOpenChange(true)}
              className={`lg:hidden ${toggleClass}`}
              aria-expanded={open}
              aria-label="Open options"
            >
              <FiFilter className="h-3.5 w-3.5 inline" />
              {activeCount > 0 && (
                <span className={badgeClass}>{activeCount}</span>
              )}
            </button>
          )}
          {toolbarLeft}
        </div>
        {toolbarRight}
      </div>

      {/* Mobile: slide-out drawer from the left */}
      <FilterDrawer
        show={open}
        onClose={close}
        onApply={handleApply}
        onClear={onClear}
        theme={theme}
        title={title}
        homeHref={homeHref}
      >
        {filterFields}
      </FilterDrawer>

      <div
        className={`grid grid-cols-1 gap-5 lg:gap-6 items-start ${
          filtersOpen ? 'lg:grid-cols-[280px_1fr]' : ''
        }`}
      >
        {/* Desktop: sticky left sidebar — not a slide overlay */}
        {filtersOpen && (
          <div className="hidden lg:block lg:sticky lg:top-20 lg:self-start order-1">
            <FilterSidebarPanel
              onApply={handleApply}
              onClear={onClear}
              theme={theme}
              homeHref={homeHref}
            >
              {filterFields}
            </FilterSidebarPanel>
          </div>
        )}

        <div className="min-w-0 order-2">{children}</div>
      </div>
    </>
  );
};

export default BrowseFilterLayout;
