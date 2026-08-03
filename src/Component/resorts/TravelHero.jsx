import React, { useState } from 'react';
import BrowseHeroSearch from '../shared/BrowseHeroSearch';

/**
 * Single search bar only (no Search button / multi-field hero filters).
 */
const TravelHero = ({ onSearch }) => {
  const [destination, setDestination] = useState('');

  const handleSubmit = () => {
    onSearch?.({
      destination,
      category: '',
      priceRange: '',
      travelDates: '',
    });
  };

  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white">
      <div className="relative page-container py-8 sm:py-10">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Resorts & Travel</h1>
          <p className="mt-2 text-sm text-blue-100">
            Find stays, tours and travel experiences worldwide.
          </p>

          <div className="mt-4">
            <BrowseHeroSearch
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onSubmit={handleSubmit}
              placeholder="Search destinations…"
              size="sm"
              accentClass="text-teal-700"
              ringClass="focus-within:ring-2 focus-within:ring-teal-300/80"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TravelHero;
