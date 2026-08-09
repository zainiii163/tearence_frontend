import React from 'react';
import { CalendarDays, Building2 } from 'lucide-react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80';

/**
 * Marketplace hero — same pattern as Buy & Sell / Jobs.
 * Home: Explore Events / Explore Venues chips. Post CTA only at bottom (List your events/venues).
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
  const subtitle =
    mode === 'venues'
      ? 'Halls, hotels, stadiums, grounds and caravan parks for hire worldwide'
      : mode === 'events'
        ? 'Concerts, conferences, festivals and more'
        : 'Find concerts, conferences, festivals and venues for hire';

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
    : mode === 'events'
      ? [
          {
            to: '/events-venues',
            label: 'Back to Events & Venues',
            icon: <CalendarDays className="h-3.5 w-3.5 text-purple-700" />,
          },
          {
            to: '/events-venues/venues',
            label: 'Explore Venues',
            icon: <Building2 className="h-3.5 w-3.5 text-purple-700" />,
          },
        ]
      : [
          {
            to: '/events-venues',
            label: 'Back to Events & Venues',
            icon: <Building2 className="h-3.5 w-3.5 text-purple-700" />,
          },
          {
            to: '/events-venues/events',
            label: 'Explore Events',
            icon: <CalendarDays className="h-3.5 w-3.5 text-purple-700" />,
          },
        ];

  return (
    <BrowseMarketplaceHero
      title={title}
      titlePrefix={mode === 'venues' ? 'Venues' : mode === 'events' ? 'Events' : 'Events & Venues'}
      eyebrow={title}
      subtitle={subtitle}
      imageUrl={HERO_BG}
      theme={getCategoryTheme('events').heroTheme}
      categoryLabel={categoryLabel}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onSearchSubmit={onSearchSubmit}
      searchPlaceholder={
        mode === 'venues'
          ? 'Search venues, stadiums, caravan parks…'
          : mode === 'events'
            ? 'Search events…'
            : 'Search events or venues…'
      }
      heroChips={heroChips}
    />
  );
};

export default EventsVenuesHero;
