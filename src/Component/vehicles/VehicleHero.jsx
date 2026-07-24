import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText } from 'react-icons/fi';
import { Calculator } from 'lucide-react';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';

const HERO_BG =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80';

/** Banner hero — search + Templates/Calculators under the bar (same pattern as Buy & Sell). */
const VehicleHero = ({
  categoryLabel = null,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search by make, model or vehicle name…',
  templatesHref = '/vehicles/templates',
  calculatorsHref = '/vehicles/calculators',
}) => {
  const isCategoryView = Boolean(categoryLabel);

  return (
    <div
      className="relative overflow-hidden pt-14 sm:pt-16 text-white"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.82) 45%, rgba(17, 24, 39, 0.88) 100%),
          url('${HERO_BG}')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(17, 24, 39, 0.55), transparent 45%)',
        }}
      />
      <div className="relative page-container py-8 sm:py-10 lg:py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight drop-shadow-sm">
            {isCategoryView ? categoryLabel : 'Vehicles'}
          </h1>
          {!isCategoryView && (
            <p className="mt-2 text-sm sm:text-base text-white/75">
              Cars, bikes and commercial vehicles worldwide
            </p>
          )}

          {typeof onSearchChange === 'function' && (
            <div className="mt-6 max-w-lg mx-auto">
              <BrowseHeroSearch
                value={searchValue}
                onChange={onSearchChange}
                onSubmit={onSearchSubmit}
                placeholder={searchPlaceholder}
                accentClass="text-red-600"
                ringClass="focus:ring-red-300"
              />
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Link
                  to={templatesHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-white/95 text-slate-900 border border-white/80 hover:bg-white"
                >
                  <FiFileText className="h-3.5 w-3.5 text-red-600" />
                  Business Templates
                </Link>
                <Link
                  to={calculatorsHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-white/95 text-slate-900 border border-white/80 hover:bg-white"
                >
                  <Calculator className="h-3.5 w-3.5 text-red-600" />
                  Calculators
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleHero;
