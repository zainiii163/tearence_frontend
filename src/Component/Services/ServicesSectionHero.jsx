import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText } from 'react-icons/fi';
import { Calculator } from 'lucide-react';
import { TRENDING_SERVICE_SEARCHES } from '../../constants/serviceCategoryGroups';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';

const HERO_BG =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80';

const ServicesSectionHero = ({
  categoryLabel = null,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  onTrendingClick,
  templatesHref = '/services/templates',
  calculatorsHref = '/services/calculators',
}) => {
  const isCategoryView = Boolean(categoryLabel);

  return (
    <div
      className="relative overflow-hidden pt-14 sm:pt-16"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(17, 94, 89, 0.9) 0%, rgba(6, 78, 59, 0.82) 45%, rgba(19, 78, 74, 0.88) 100%),
          url('${HERO_BG}')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(17, 94, 89, 0.55), transparent 45%)',
        }}
      />
      <div className="relative page-container py-8 sm:py-10 lg:py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight drop-shadow-sm">
            {isCategoryView ? categoryLabel : 'Services & Solutions'}
          </h1>
          {!isCategoryView && (
            <p className="mt-2 text-sm sm:text-base text-emerald-50/90">
              Hire freelancers for web, apps, design &amp; IT — online tech services.
            </p>
          )}

          {typeof onSearchChange === 'function' && (
            <div className="mt-6 max-w-lg mx-auto">
              <BrowseHeroSearch
                value={searchValue}
                onChange={onSearchChange}
                onSubmit={onSearchSubmit}
                placeholder="Search tech services…"
                accentClass="text-teal-700"
                ringClass="focus:ring-emerald-300"
              />

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Link
                  to={templatesHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-white/95 text-teal-900 border border-white/80 hover:bg-white"
                >
                  <FiFileText className="h-3.5 w-3.5 text-teal-700" />
                  Business Templates
                </Link>
                <Link
                  to={calculatorsHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-white/95 text-teal-900 border border-white/80 hover:bg-white"
                >
                  <Calculator className="h-3.5 w-3.5 text-teal-700" />
                  Calculators
                </Link>
              </div>
            </div>
          )}

          {!isCategoryView && typeof onTrendingClick === 'function' && (
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {TRENDING_SERVICE_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onTrendingClick(term)}
                  className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesSectionHero;
