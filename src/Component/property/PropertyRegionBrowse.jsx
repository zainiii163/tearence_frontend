import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search } from 'lucide-react';
import { PROPERTY_CONTINENTS } from '../../data/propertyContinents';

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
 * Countries under a continent map — A–Z filter + chips (Clive).
 * When embedded, sits inside the map frame under continent chips.
 */
const PropertyRegionBrowse = ({
  selectedContinentId = null,
  selectedCountry = null,
  onSelectCountry,
  onBack,
  embedded = false,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1.5">
        <div className="min-w-0">
          {!embedded && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--prop-copper-deep)] hover:underline mb-0.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              World map
            </button>
          )}
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2
              className={`prop-display text-[var(--prop-ink)] leading-tight ${
                embedded ? 'text-sm sm:text-base' : 'text-lg sm:text-xl'
              }`}
            >
              Countries in {continent.name}
            </h2>
            <span
              className={`text-[10px] font-bold ${
                changeUp ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {formatChange(continent.marketChange)} YoY · avg {continent.avgPriceLabel || '—'}
            </span>
            <span className="text-[10px] text-[var(--prop-ink)]/45">
              {filteredCountries.length}
              {query || letter !== 'All' ? ` of ${continent.countries.length}` : ''}
            </span>
            {embedded && (
              <button
                type="button"
                onClick={onBack}
                className="text-[10px] font-semibold text-[var(--prop-copper-deep)] hover:underline"
              >
                ← World
              </button>
            )}
          </div>
        </div>

        <div className={`relative w-full shrink-0 ${embedded ? 'sm:w-40' : 'sm:w-48'}`}>
          <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--prop-ink)]/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) setLetter('All');
            }}
            placeholder="Find a country…"
            className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-white/70 border border-[var(--prop-ink)]/10 rounded-md focus:border-[var(--prop-copper)] outline-none"
            aria-label="Find a country"
          />
        </div>
      </div>

      {!query && letters.length > 1 && (
        <div className="property-letter-filter mb-2" role="tablist" aria-label="Filter by letter">
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
            className="text-xs text-[var(--prop-ink)]/50 py-2"
          >
            No countries match
            {query ? ` “${query}”` : letter !== 'All' ? ` “${letter}”` : ''}.
          </motion.p>
        ) : (
          <motion.ul
            key={`${letter}-${query}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`property-country-chips ${isDense ? 'is-dense' : ''}`}
          >
            {filteredCountries.map((country) => {
              const active =
                String(selectedCountry || '').toLowerCase() ===
                country.toLowerCase();
              return (
                <li key={country}>
                  <button
                    type="button"
                    onClick={() => onSelectCountry?.(country, continent)}
                    className={`property-country-chip ${active ? 'is-active' : ''}`}
                  >
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
