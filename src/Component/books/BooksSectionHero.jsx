import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText } from 'react-icons/fi';
import { Calculator } from 'lucide-react';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';

const HERO_BG =
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5040?auto=format&fit=crop&w=1920&q=80';

/** Books browse hero — blue Search + Templates/Calculators under the bar. */
const BooksSectionHero = ({
  categoryLabel = null,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search by book title or author…',
  templatesHref = '/books/templates',
  calculatorsHref = '/books/calculators',
}) => {
  const isCategoryView = Boolean(categoryLabel);

  return (
    <div
      className="relative overflow-hidden pt-14 sm:pt-16"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(180, 83, 9, 0.9) 0%, rgba(217, 119, 6, 0.82) 45%, rgba(234, 88, 12, 0.88) 100%),
          url('${HERO_BG}')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(146, 64, 14, 0.5), transparent 45%)',
        }}
      />
      <div className="relative page-container py-8 sm:py-10 lg:py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-sm">
            {isCategoryView ? categoryLabel : 'Books'}
          </h1>
          {!isCategoryView && (
            <p className="mt-2 text-sm sm:text-base text-white/85">
              Discover books and authors worldwide
            </p>
          )}

          {typeof onSearchChange === 'function' && (
            <div className="mt-6 max-w-lg mx-auto">
              <BrowseHeroSearch
                value={searchValue}
                onChange={onSearchChange}
                onSubmit={onSearchSubmit}
                placeholder={searchPlaceholder}
                accentClass="text-amber-700"
                ringClass="focus:ring-amber-300"
              />
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Link
                  to={templatesHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-white/95 text-amber-950 border border-white/80 hover:bg-white"
                >
                  <FiFileText className="h-3.5 w-3.5 text-amber-700" />
                  Business Templates
                </Link>
                <Link
                  to={calculatorsHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-white/95 text-amber-950 border border-white/80 hover:bg-white"
                >
                  <Calculator className="h-3.5 w-3.5 text-amber-700" />
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

export default BooksSectionHero;
