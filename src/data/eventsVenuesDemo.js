/**
 * Professional sample listings when Events & Venues API returns empty (Clive).
 * Unique images — no duplicate stock photos across cards.
 */

export const DEMO_EVENTS = [
  {
    id: 'demo-event-summit',
    slug: 'global-trade-summit-2026',
    title: 'Global Trade Summit 2026',
    advert_type: 'event',
    type: 'event',
    city: 'Dubai',
    country: 'UAE',
    description:
      'Two-day conference for exporters, importers and marketplace sellers. Keynotes, breakout rooms and curated networking.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80',
    featured: true,
    is_featured: true,
    event_date: '2026-11-12',
    free_event: false,
    ticket_currency: 'USD',
    ticket_price: 149,
  },
  {
    id: 'demo-event-jazz',
    slug: 'harbourfront-jazz-night',
    title: 'Harbourfront Jazz Night',
    advert_type: 'event',
    type: 'event',
    city: 'Cape Town',
    country: 'South Africa',
    description:
      'Outdoor evening of live jazz with food stalls and waterfront seating. Family-friendly gates open at 5pm.',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
    featured: true,
    is_featured: true,
    event_date: '2026-09-20',
    free_event: false,
    ticket_currency: 'USD',
    ticket_price: 35,
  },
  {
    id: 'demo-event-startup',
    slug: 'startup-pitch-evening-london',
    title: 'Startup Pitch Evening — London',
    advert_type: 'event',
    type: 'event',
    city: 'London',
    country: 'UK',
    description:
      'Ten early-stage founders pitch to angels and operators. Limited tickets; networking after the final round.',
    image:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=900&q=80',
    featured: false,
    event_date: '2026-10-03',
    free_event: true,
    ticket_currency: 'GBP',
    ticket_price: 0,
  },
];

export const DEMO_VENUES = [
  {
    id: 'demo-venue-grand-hall',
    slug: 'riverside-grand-hall',
    title: 'Riverside Grand Hall',
    advert_type: 'venue',
    type: 'venue',
    city: 'Manchester',
    country: 'UK',
    description:
      'Column-free ballroom for 800 seated or 1,200 standing. Built-in AV, bridal suite and river terrace.',
    image:
      'https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?auto=format&fit=crop&w=900&q=80',
    featured: true,
    is_featured: true,
    capacity: 1200,
    price_range: 'From £1,200 / day',
  },
  {
    id: 'demo-venue-rooftop',
    slug: 'skyline-rooftop-terrace',
    title: 'Skyline Rooftop Terrace',
    advert_type: 'venue',
    type: 'venue',
    city: 'Singapore',
    country: 'Singapore',
    description:
      'Open-air terrace with skyline views — ideal for product launches and evening receptions (max 220 guests).',
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80',
    featured: true,
    is_featured: true,
    capacity: 220,
    price_range: 'From S$800 / evening',
  },
  {
    id: 'demo-venue-studio',
    slug: 'loft-studio-warehouse',
    title: 'Loft Studio Warehouse',
    advert_type: 'venue',
    type: 'venue',
    city: 'Austin',
    country: 'USA',
    description:
      'Daylight warehouse loft for shoots, pop-ups and workshops. Loading bay, kitchenette and free parking.',
    image:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
    featured: false,
    capacity: 150,
    price_range: 'From $450 / day',
  },
];
