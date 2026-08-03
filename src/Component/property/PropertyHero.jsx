import React from 'react';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';
import { withImageWidth } from '../../utils/responsiveImage';

const HERO_BG =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1280&q=80';

/**
 * Clive: centered title at top, search directly below, then page content.
 * Region titles: "Property Europe", "Property North America", etc.
 */
const PropertyHero = ({
  categoryLabel = null,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search city or keyword…',
}) => {
  const heading = categoryLabel || 'Property';
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

      <div className="relative page-container py-3 sm:py-4">
        <div className="mx-auto max-w-md text-center">
          <h1 className="prop-display text-xl sm:text-2xl text-white leading-tight tracking-tight">
            {heading}
          </h1>

          {typeof onSearchChange === 'function' && (
            <div className="mt-3">
              <BrowseHeroSearch
                value={searchValue}
                onChange={onSearchChange}
                onSubmit={onSearchSubmit}
                placeholder={searchPlaceholder}
                size="sm"
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
