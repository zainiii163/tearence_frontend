import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Building2, MapPin } from 'lucide-react';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';

/**
 * Clive: title "Events & Venues" only; search; then Explore Events / Explore Venues under search.
 * No Total Views / Categories counters on the landing hero.
 */
const EventsVenuesHero = ({
  mode = 'home', // home | events | venues
  onSearch,
  searchValue = '',
  onSearchChange,
  locationValue = '',
  onLocationChange,
}) => {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [localLocation, setLocalLocation] = useState(locationValue);

  const title =
    mode === 'events' ? 'Events' : mode === 'venues' ? 'Venues' : 'Events & Venues';

  const submit = (e) => {
    e?.preventDefault?.();
    onSearch?.({
      search: (onSearchChange ? searchValue : localSearch) || '',
      location: (onLocationChange ? locationValue : localLocation) || '',
    });
  };

  const q = onSearchChange ? searchValue : localSearch;
  const setQ = onSearchChange || ((e) => setLocalSearch(e.target.value));
  const loc = onLocationChange ? locationValue : localLocation;
  const setLoc = onLocationChange || ((e) => setLocalLocation(e.target.value));

  return (
    <header className="relative overflow-hidden pt-28 md:pt-16 bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.9) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      <div className="relative page-container py-5 sm:py-7">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>

          <div className="mt-4 space-y-2.5">
            <BrowseHeroSearch
              value={q}
              onChange={setQ}
              onSubmit={submit}
              placeholder={
                mode === 'venues'
                  ? 'Search venues…'
                  : mode === 'events'
                    ? 'Search events…'
                    : 'Search events or venues…'
              }
              size="sm"
              accentClass="text-purple-700"
              ringClass="focus-within:ring-2 focus-within:ring-purple-300/80"
              buttonClass="bg-purple-700 hover:bg-purple-800"
            />
            <div className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-left shadow-sm">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={loc}
                onChange={setLoc}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit(e);
                }}
                placeholder="Location (city, country)"
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
              />
            </div>
          </div>

          {mode === 'home' && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/events-venues/events"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/30 bg-white/95 px-3 py-2 text-[11px] sm:text-xs font-semibold text-purple-900 shadow-sm hover:bg-white"
              >
                <CalendarDays className="h-3.5 w-3.5 text-purple-700" />
                Explore Events
              </Link>
              <Link
                to="/events-venues/venues"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/30 bg-white/95 px-3 py-2 text-[11px] sm:text-xs font-semibold text-purple-900 shadow-sm hover:bg-white"
              >
                <Building2 className="h-3.5 w-3.5 text-purple-700" />
                Explore Venues
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default EventsVenuesHero;
