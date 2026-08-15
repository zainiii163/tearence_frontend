import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MapPin, Search } from 'lucide-react';
import { PROPERTY_CONTINENTS } from '../../data/propertyContinents';
import { getWorldCountryByName, isoToFlagEmoji } from '../../data/worldCountries';

function uniqueLetters(countries) {
  const set = new Set(
    countries.map((name) => String(name).charAt(0).toUpperCase())
  );
  return Array.from(set).sort();
}

const formatChange = (n) => {
  const v = Number(n) || 0;
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}%`;
};

/**
 * Countries under a continent map — A–Z filter + chips.
 * When embedded, sits inside the map frame under continent chips.
 */
const PropertyRegionBrowse = ({
  selectedContinentId = null,
  selectedCountry = null,
  onSelectCountry,
  onBack,
  embedded = false,
  /** Hide property YoY / avg price (used by business & jobs geo browse) */
  showMarketStats = true,
  subtitle = null,
}) => {
  const [query, setQuery] = useState('');
  const [letter, setLetter] = useState('All');
  const continent =
    PROPERTY_CONTINENTS.find((c) => c.id === selectedContinentId) || null;

  useEffect(() => {
    setQuery('');
    setLetter('All');
  }, [selectedContinentId]);

  const letters = useMemo(
    () => (continent ? uniqueLetters(continent.countries) : []),
    [continent]
  );

  const filteredCountries = useMemo(() => {
    if (!continent) return [];
    const q = query.trim().toLowerCase();
    return [...continent.countries]
      .sort((a, b) => a.localeCompare(b))
      .filter((c) => {
        const matchesQuery = !q || c.toLowerCase().includes(q);
        const matchesLetter =
          letter === 'All' || c.charAt(0).toUpperCase() === letter;
        return matchesQuery && matchesLetter;
      });
  }, [continent, query, letter]);

  if (!continent) return null;

  const isDense = continent.countries.length > 40;
  const changeUp = Number(continent.marketChange) >= 0;

  return (
    <section className={`property-country-dir ${embedded ? 'is-embedded' : 'mb-4'}`}>
      <div className="property-country-dir-head">
        <div className="min-w-0 flex-1">
          {!embedded && (
            <button
              type="button"
              onClick={onBack}
              className="property-country-back"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              World map
            </button>
          )}
          <div className="flex items-start gap-2.5 flex-wrap">
            <div className="property-country-dir-icon" aria-hidden="true">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="property-country-dir-kicker">Browse by country</p>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h2
                  className={`prop-display text-[var(--prop-ink)] leading-tight ${
                    embedded ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
                  }`}
                >
                  {continent.name}
                </h2>
                <span className="property-country-dir-count">
                  {filteredCountries.length}
                  {query || letter !== 'All' ? ` of ${continent.countries.length}` : ' countries'}
                </span>
              </div>
              {showMarketStats ? (
                <p
                  className={`property-country-dir-sub ${
                    changeUp ? 'is-up' : 'is-down'
                  }`}
                >
                  {formatChange(continent.marketChange)} YoY · avg {continent.avgPriceLabel || '—'}
                </p>
              ) : (
                <p className="property-country-dir-sub">
                  {subtitle || 'Select a country — the map will open that area'}
                </p>
              )}
            </div>
            {embedded && (
              <button type="button" onClick={onBack} className="property-country-world-link ml-auto">
                ← World
              </button>
            )}
          </div>
        </div>

        <div className={`property-country-search relative w-full shrink-0 ${embedded ? 'sm:w-44' : 'sm:w-52'}`}>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) setLetter('All');
            }}
            placeholder="Find a country…"
            className="property-country-search-input"
            aria-label="Find a country"
          />
        </div>
      </div>

      {!query && letters.length > 1 && (
        <div className="property-letter-filter" role="tablist" aria-label="Filter by letter">
          <button
            type="button"
            role="tab"
            aria-selected={letter === 'All'}
            className={`prop-letter-chip ${letter === 'All' ? 'is-active' : ''}`}
            onClick={() => setLetter('All')}
          >
            All
          </button>
          {letters.map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={letter === l}
              className={`prop-letter-chip ${letter === l ? 'is-active' : ''}`}
              onClick={() => setLetter(l)}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {filteredCountries.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-slate-500 py-3"
          >
            No countries match
            {query ? ` “${query}”` : letter !== 'All' ? ` “${letter}”` : ''}.
          </motion.p>
        ) : (
          <motion.ul
            key={`${letter}-${query}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className={`property-country-chips ${isDense ? 'is-dense' : ''}`}
          >
            {filteredCountries.map((country) => {
              const active =
                String(selectedCountry || '').toLowerCase() ===
                country.toLowerCase();
              const iso = getWorldCountryByName(country)?.iso;
              const flag = iso ? isoToFlagEmoji(iso) : '🏳️';
              return (
                <li key={country}>
                  <button
                    type="button"
                    onClick={() => onSelectCountry?.(country, continent)}
                    className={`property-country-chip ${active ? 'is-active' : ''}`}
                  >
                    <span className="property-country-chip-flag" aria-hidden="true">
                      {flag}
                    </span>
                    {country}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PropertyRegionBrowse;
