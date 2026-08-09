import React, { useState } from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1280&q=80';

/**
 * Single search bar only (no Search button / multi-field hero filters).
 */
const TravelHero = ({ onSearch }) => {
  const [destination, setDestination] = useState('');
  const theme = getCategoryTheme('resorts');

  const handleSubmit = () => {
    onSearch?.({
      destination,
      category: '',
      priceRange: '',
      travelDates: '',
    });
  };

  return (
    <BrowseMarketplaceHero
      title="Resorts & Travel"
      eyebrow=""
      subtitle="Find stays, tours and travel experiences worldwide."
      imageUrl={HERO_BG}
      theme={theme.heroTheme}
      searchValue={destination}
      onSearchChange={(e) => setDestination(e.target.value)}
      onSearchSubmit={handleSubmit}
      searchPlaceholder="Search destinations…"
    />
  );
};

export default TravelHero;
