import React from 'react';
import { motion } from 'framer-motion';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';

/** Full-bleed hero — title + search only (filters hold purpose/type). */
const PropertyHero = ({
  categoryLabel = null,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search city, address or keyword…',
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
          <h1 className="prop-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05]">
            {isCategoryView ? categoryLabel : 'Global Property Marketplace'}
          </h1>

          {typeof onSearchChange === 'function' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
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
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyHero;
