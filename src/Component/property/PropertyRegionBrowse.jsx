import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { PROPERTY_CONTINENTS } from '../../data/propertyContinents';

/**
 * Continent cards (one row) → country category grid.
 * Drill-down: region → countries → listings (parent handles navigation).
 */
const PropertyRegionBrowse = ({
  selectedContinentId = null,
  selectedCountry = null,
  onSelectContinent,
  onSelectCountry,
  onBack,
}) => {
  const continent =
    PROPERTY_CONTINENTS.find((c) => c.id === selectedContinentId) || null;

  if (continent) {
    return (
      <section className="mb-8">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--prop-copper-deep)] hover:underline mb-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              All regions
            </button>
            <p className="prop-label text-[var(--prop-copper)] mb-1">Browse by country</p>
            <h2 className="prop-display text-2xl sm:text-3xl text-[var(--prop-ink)]">
              {continent.name}
            </h2>
            <p className="text-sm text-[var(--prop-ink)]/55 mt-1">
              {continent.countries.length} countries — select one to view properties
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {continent.countries.map((country, index) => {
            const active =
              String(selectedCountry || '').toLowerCase() === country.toLowerCase();
            return (
              <motion.button
                key={country}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.015, 0.35), duration: 0.3 }}
                onClick={() => onSelectCountry?.(country, continent)}
                className={`text-left px-3 py-2.5 text-sm font-medium border transition-colors ${
                  active
                    ? 'bg-[var(--prop-ink)] text-white border-[var(--prop-ink)]'
                    : 'bg-white/80 border-[var(--prop-ink)]/10 text-[var(--prop-ink)] hover:border-[var(--prop-copper)]'
                }`}
              >
                {country}
              </motion.button>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="mb-4">
        <p className="prop-label text-[var(--prop-copper)] mb-1">Browse by Region</p>
        <h2 className="prop-display text-2xl sm:text-3xl text-[var(--prop-ink)]">
          Continents
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
        {PROPERTY_CONTINENTS.map((region, index) => (
          <motion.button
            key={region.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.35 }}
            onClick={() => onSelectContinent?.(region)}
            className="property-region-card group text-left px-3 py-4 border border-[var(--prop-ink)]/10 bg-white/80 hover:border-[var(--prop-copper)] hover:bg-white transition-colors"
          >
            <p className="prop-display text-lg sm:text-xl text-[var(--prop-ink)] leading-tight group-hover:text-[var(--prop-copper-deep)]">
              {region.name}
            </p>
            <p className="mt-1 text-[11px] text-[var(--prop-ink)]/50">
              {region.countries.length} countries
            </p>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default PropertyRegionBrowse;
