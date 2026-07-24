import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFileText } from 'react-icons/fi';
import { Calculator } from 'lucide-react';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';

/** Full-bleed architectural hero — search + Templates/Calculators under the bar. */
const PropertyHero = ({
  categoryLabel = null,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search city, address or keyword…',
  templatesHref = '/property/templates',
  calculatorsHref = '/property/calculators',
}) => {
  const isCategoryView = Boolean(categoryLabel);

  return (
    <div className="property-hero-shell">
      <div className="relative z-10 page-container py-10 sm:py-14 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="prop-label text-[var(--prop-copper)] mb-3">
            {isCategoryView ? 'Property type' : 'Worldwide Adverts'}
          </p>
          <h1 className="prop-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
            {isCategoryView ? categoryLabel : 'Global Property Marketplace'}
          </h1>
          {!isCategoryView && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="mt-4 text-sm sm:text-base text-white/75 max-w-xl mx-auto font-light tracking-wide"
            >
              Buy, rent and invest across cities worldwide
            </motion.p>
          )}

          {typeof onSearchChange === 'function' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-8 max-w-xl mx-auto"
            >
              <BrowseHeroSearch
                value={searchValue}
                onChange={onSearchChange}
                onSubmit={onSearchSubmit}
                placeholder={searchPlaceholder}
                accentClass="text-[var(--prop-copper)]"
                ringClass="focus:ring-[var(--prop-copper)]"
              />

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link
                  to={templatesHref}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-white/95 text-[var(--prop-ink)] border border-white/80 hover:bg-white transition-colors"
                >
                  <FiFileText className="h-3.5 w-3.5 shrink-0 text-[var(--prop-copper)]" />
                  Property Templates
                </Link>
                <Link
                  to={calculatorsHref}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-white/95 text-[var(--prop-ink)] border border-white/80 hover:bg-white transition-colors"
                >
                  <Calculator className="h-3.5 w-3.5 shrink-0 text-[var(--prop-copper)]" />
                  Calculators
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyHero;
