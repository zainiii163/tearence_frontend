import React from 'react';
import { CalendarDays, Building2 } from 'lucide-react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80';

/**
 * Home: Events & Venues title + Explore Events / Explore Venues.
 * Events or Venues subpage: title + search only (no cross-links — Clive).
 */
const EventsVenuesHero = ({
  mode = 'home',
  categoryLabel = null,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
}) => {
  const isHome = mode === 'home';
  const title =
    mode === 'events' ? 'Events' : mode === 'venues' ? 'Venues' : 'Events & Venues';

  const heroChips = isHome
    ? [
        {
          to: '/events-venues/events',
          label: 'Explore Events',
          icon: <CalendarDays className="h-3.5 w-3.5 text-purple-700" />,
        },
        {
          to: '/events-venues/venues',
          label: 'Explore Venues',
          icon: <Building2 className="h-3.5 w-3.5 text-purple-700" />,
        },
      ]
    : null;

  return (
    <BrowseMarketplaceHero
      title={title}
      eyebrow=""
      imageUrl={HERO_BG}
      theme={getCategoryTheme('events').heroTheme}
      categoryLabel={categoryLabel}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onSearchSubmit={onSearchSubmit}
      searchPlaceholder={
        mode === 'venues'
          ? 'Search venues, halls, stadiums…'
          : mode === 'events'
            ? 'Search events…'
            : 'Search events or venues…'
      }
      heroChips={heroChips}
    />
  );
};

export default EventsVenuesHero;
