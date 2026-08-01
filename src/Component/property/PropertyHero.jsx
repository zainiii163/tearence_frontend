import React from 'react';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';
import { withImageWidth } from '../../utils/responsiveImage';

const HERO_BG =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1280&q=80';

/**
 * Clive (new.mp4): short hero only — reduce banner + search size.
 * Title + compact search; no templates/calculators in the banner.
 */
const PropertyHero = ({
  categoryLabel = null,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search city or keyword…',
}) => {
  const heading = categoryLabel || 'Global Property Marketplace';
  const heroSrc = withImageWidth(HERO_BG, 1280);

  return (
    <header className="property-hero-slim relative overflow-hidden pt-28 md:pt-16">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: heroSrc ? `url('${heroSrc}')` : undefined }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(125deg, rgba(12, 21, 32, 0.94) 0%, rgba(26, 40, 56, 0.82) 48%, rgba(42, 58, 46, 0.78) 100%),
            linear-gradient(to top, rgba(12, 21, 32, 0.55) 0%, transparent 55%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative page-container py-1.5 sm:py-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3 max-w-3xl mx-auto">
          <div className="text-center sm:text-left min-w-0 sm:shrink-0">
            <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-amber-200/85">
              Property
            </p>
            <h1 className="prop-display text-base sm:text-lg text-white leading-tight truncate">
              {heading}
            </h1>
          </div>

          {typeof onSearchChange === 'function' && (
            <div className="w-full sm:max-w-xs sm:flex-1">
              <BrowseHeroSearch
                value={searchValue}
                onChange={onSearchChange}
                onSubmit={onSearchSubmit}
                placeholder={searchPlaceholder}
                size="xs"
                accentClass="text-amber-700"
                ringClass="focus-within:ring-2 focus-within:ring-amber-400/70"
                buttonClass="bg-amber-700 hover:bg-amber-800"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PropertyHero;
