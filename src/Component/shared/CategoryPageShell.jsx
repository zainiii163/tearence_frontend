import React from 'react';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import BrowsePageBackBar from './BrowsePageBackBar';
import { BrowseFilterLayout } from './BrowseFilterLayout';
import BrowseBottomPostCta from './BrowseBottomPostCta';
import { getCategoryTheme } from '../../constants/categoryThemes';

/**
 * Shared marketplace category page shell (Buy & Sell pattern).
 * Structure is identical across hubs; only colors change via categoryId.
 *
 * Stack: Navbar → Hero → [BackBar] → [CategoryGrid]
 *        → FilterLayout(children) → Bottom CTA → Footer
 */
const CategoryPageShell = ({
  categoryId = 'buy-sell',
  backHref = '/',
  showBackButton = true,
  hero = null,
  backBar = null,
  /** Explicit back bar under hero; pass false to hide */
  showBackBar = false,
  backBarTo = null,
  backBarLabel = 'Back',
  categoryGrid = null,
  /** Compact premium/featured reel under hero (Clive) */
  premiumReel = null,
  /** @deprecated Live Activity removed site-wide — ignored */
  activityFeed: _activityFeed = null,
  /** Extra content between grid and filters (e.g. carousels) */
  beforeFilters = null,
  filterLayoutProps = null,
  children,
  bottomCta = null,
  /** Content after CTA, before footer (e.g. EbayAds, modals) */
  afterContent = null,
  className = '',
  contentClassName = 'page-container py-4 sm:py-6',
}) => {
  const theme = getCategoryTheme(categoryId);

  const resolvedBackHref = backHref || theme.route || '/';

  return (
    <div className={`min-h-screen bg-gray-50 overflow-x-hidden ${className}`}>
      <UnifiedNavbar showBackButton={showBackButton} backHref={resolvedBackHref} />

      {hero}

      <div className={contentClassName}>
        {backBar}
        {!backBar && (showBackBar || resolvedBackHref === '/') && (
          <BrowsePageBackBar
            to={backBarTo || (resolvedBackHref === '/' ? '/' : resolvedBackHref)}
            label={
              backBarLabel !== 'Back'
                ? backBarLabel
                : resolvedBackHref === '/'
                  ? 'Back Home'
                  : backBarLabel
            }
          />
        )}

        {categoryGrid}

        {premiumReel}

        {beforeFilters}

        {filterLayoutProps ? (
          <BrowseFilterLayout
            {...filterLayoutProps}
            theme={filterLayoutProps.theme || theme.filterTheme}
            homeHref={filterLayoutProps.homeHref || theme.route}
          >
            {children}
          </BrowseFilterLayout>
        ) : (
          children
        )}

        {bottomCta && (
          <BrowseBottomPostCta
            theme={bottomCta.theme || theme.ctaTheme}
            buttonLabel={bottomCta.buttonLabel || bottomCta.title}
            onPostClick={bottomCta.onPostClick}
            compact={bottomCta.compact}
          />
        )}
      </div>

      {afterContent}

      <Footer />
    </div>
  );
};

export default CategoryPageShell;
