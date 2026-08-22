/**
 * Live business directory examples for categories that need a real sample.
 * Restaurant inspired by RecipesBible.com food marketplace listings.
 * Automotive inspired by Car Services (mechanics / garage) profiles.
 */

const img = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const BUSINESS_DIRECTORY_EXAMPLES = [
  {
    id: 'example-recipesbible-restaurant',
    slug: 'example-recipesbible-restaurant',
    is_example: true,
    featured: true,
    is_featured: true,
    status: 'active',
    business_name: 'RecipesBible Kitchen House',
    business_description:
      'Featured restaurant from the RecipesBible food platform — seasonal tasting menus, chef-led dining, and marketplace-ready hospitality. Inspired by the Featured Restaurant spotlight on recipesbible.com.',
    business_category_slug: 'restaurants',
    business_category: 'Restaurants & Food',
    category: { name: 'Restaurants & Food', slug: 'restaurants-food' },
    category_name: 'Restaurants & Food',
    business_type: 'restaurant',
    city: 'London',
    country: 'United Kingdom',
    business_address: '48 Borough Market Row, London SE1 9AQ, United Kingdom',
    business_phone_number: '+44 20 7946 0182',
    business_email: 'bookings@recipesbible-kitchen.example',
    business_website: 'https://recipesbible.com',
    business_logo: img('1517248135467-4c7edcad34c4', 400),
    cover_image: img('1414235077428-338989a2e8c0', 1200),
    business_owner: 'Kitchen House Team',
    rating: 4.8,
    reviews_count: 214,
    verified: true,
    verification: 'verified',
    profile: {
      cuisine: ['Modern British', 'Seasonal', 'Seafood'],
      price_range: '£££',
      seating_capacity: 86,
      outdoor_seating: true,
      delivery: true,
      takeaway: true,
      reservations_required: true,
      booking_url: 'https://recipesbible.com',
      booking_phone: '+44 20 7946 0182',
      whatsapp: '+44 7700 900182',
      social_links: [
        {
          platform: 'custom',
          label: 'RecipesBible',
          url: 'https://recipesbible.com',
        },
        {
          platform: 'instagram',
          label: 'Instagram',
          url: 'https://www.instagram.com/',
        },
      ],
      dietary: ['Vegetarian', 'Vegan options', 'Gluten-free on request'],
      highlights: [
        'Chef spotlight evenings',
        'Market-fresh seasonal plates',
        'Private dining for 12',
        'RecipesBible partner kitchen',
      ],
      menu_samples: [
        { name: 'Snail Spring Rolls', note: 'Crispy seafood appetizer', price: '£12' },
        { name: 'Sinigang Salmon Belly', note: 'Tamarind broth', price: '£24' },
        { name: 'Chef tasting menu', note: '5 courses', price: '£65' },
      ],
      opening_hours: {
        monday: '12:00 – 22:00',
        tuesday: '12:00 – 22:00',
        wednesday: '12:00 – 22:00',
        thursday: '12:00 – 23:00',
        friday: '12:00 – 23:30',
        saturday: '11:00 – 23:30',
        sunday: '11:00 – 21:00',
      },
      booking_slots: [
        'Lunch 12:00–14:30',
        'Early dinner 17:30–19:00',
        'Prime dinner 19:00–21:30',
      ],
    },
  },
  {
    id: 'example-carservices-automotive',
    slug: 'example-carservices-automotive',
    is_example: true,
    featured: true,
    is_featured: true,
    status: 'active',
    business_name: 'CarServices Elite Garage',
    business_description:
      'Full-service automotive garage for MOT, servicing, diagnostics and repairs — the correct automotive business profile for the Business directory (Car Services style), not a generic tech listing.',
    business_category_slug: 'automotive',
    business_category: 'Automotive',
    category: { name: 'Automotive', slug: 'automotive' },
    category_name: 'Automotive',
    business_type: 'garage',
    city: 'Birmingham',
    country: 'United Kingdom',
    business_address: '17 Industrial Way, Aston, Birmingham B6 7RT, United Kingdom',
    business_phone_number: '+44 121 496 0288',
    business_email: 'bookings@carservices-elite.example',
    business_website: 'https://www.carservices.com',
    business_logo: img('1486262715619-67b85e0b08d3', 400),
    cover_image: img('1492144534655-ae79c964c9d7', 1200),
    business_owner: 'Workshop Manager',
    rating: 4.7,
    reviews_count: 318,
    verified: true,
    verification: 'verified',
    profile: {
      services: [
        'MOT testing',
        'Full / interim service',
        'Diagnostics & ECU',
        'Brakes & suspension',
        'Tyres & alignment',
        'Air conditioning recharge',
        'Courtesy car available',
      ],
      makes_serviced: ['All makes', 'BMW', 'Mercedes', 'Ford', 'Vauxhall', 'Toyota', 'VW'],
      warranties: '12-month parts & labour on most repairs',
      emergency_tow: true,
      tow_phone: '+44 121 496 0299',
      booking_url: 'https://www.carservices.com',
      booking_phone: '+44 121 496 0288',
      whatsapp: '+44 7700 900288',
      social_links: [
        {
          platform: 'custom',
          label: 'Car Services Ltd',
          url: 'https://carservicesltd.com',
        },
        {
          platform: 'website',
          label: 'carservices.com',
          url: 'https://www.carservices.com',
        },
        {
          platform: 'facebook',
          label: 'Facebook',
          url: 'https://www.facebook.com/',
        },
        {
          platform: 'instagram',
          label: 'Instagram',
          url: 'https://www.instagram.com/',
        },
      ],
      opening_hours: {
        monday: '08:00 – 18:00',
        tuesday: '08:00 – 18:00',
        wednesday: '08:00 – 18:00',
        thursday: '08:00 – 18:00',
        friday: '08:00 – 18:00',
        saturday: '08:00 – 13:00',
        sunday: 'Closed',
      },
      booking_slots: [
        'Drop-off from 08:00',
        'Morning bay 09:00–12:00',
        'Afternoon bay 13:00–17:00',
        'Saturday MOT slots (book ahead)',
      ],
      highlights: [
        'Class 4 & 7 MOT',
        'Manufacturer-spec servicing',
        'Online booking',
        'Live job updates by SMS',
      ],
    },
  },
];

/** Soft category-relevant profile templates for every business category */
export const CATEGORY_PROFILE_TEMPLATES = {
  restaurants: {
    label: 'Restaurant profile',
    accent: 'from-rose-600 to-orange-500',
    sections: ['opening_hours', 'booking', 'cuisine', 'menu', 'dietary', 'highlights'],
  },
  automotive: {
    label: 'Automotive / garage profile',
    accent: 'from-slate-700 to-sky-600',
    sections: ['opening_hours', 'booking', 'services', 'makes', 'tow', 'highlights'],
  },
  retail: {
    label: 'Retail store profile',
    accent: 'from-violet-600 to-fuchsia-500',
    sections: ['opening_hours', 'click_collect', 'highlights'],
  },
  services: {
    label: 'Professional services profile',
    accent: 'from-indigo-600 to-blue-500',
    sections: ['opening_hours', 'booking', 'consultation', 'highlights'],
  },
  healthcare: {
    label: 'Healthcare & wellness profile',
    accent: 'from-emerald-600 to-teal-500',
    sections: ['opening_hours', 'booking', 'specialties', 'insurance', 'highlights'],
  },
  education: {
    label: 'Education & training profile',
    accent: 'from-amber-600 to-yellow-500',
    sections: ['term_hours', 'enrollment', 'courses', 'highlights'],
  },
  'real-estate': {
    label: 'Real estate profile',
    accent: 'from-cyan-700 to-blue-600',
    sections: ['opening_hours', 'viewings', 'areas', 'highlights'],
  },
  entertainment: {
    label: 'Entertainment profile',
    accent: 'from-pink-600 to-purple-600',
    sections: ['opening_hours', 'booking', 'events', 'highlights'],
  },
  travel: {
    label: 'Travel & hospitality profile',
    accent: 'from-sky-600 to-cyan-500',
    sections: ['check_in', 'booking', 'amenities', 'highlights'],
  },
  beauty: {
    label: 'Beauty & personal care profile',
    accent: 'from-fuchsia-600 to-rose-500',
    sections: ['opening_hours', 'booking', 'services', 'highlights'],
  },
  pets: {
    label: 'Pet services profile',
    accent: 'from-lime-600 to-green-500',
    sections: ['opening_hours', 'booking', 'services', 'highlights'],
  },
  'home-garden': {
    label: 'Home & garden profile',
    accent: 'from-green-700 to-emerald-500',
    sections: ['opening_hours', 'callouts', 'highlights'],
  },
  technology: {
    label: 'Technology profile',
    accent: 'from-blue-700 to-indigo-500',
    sections: ['support_hours', 'booking', 'services', 'products', 'highlights'],
  },
  'sports-fitness': {
    label: 'Sports & fitness profile',
    accent: 'from-orange-600 to-red-500',
    sections: ['opening_hours', 'booking', 'classes', 'highlights'],
  },
  industrial: {
    label: 'Industrial profile',
    accent: 'from-stone-700 to-amber-600',
    sections: ['opening_hours', 'capacity', 'highlights'],
  },
  'non-profit': {
    label: 'Non-profit profile',
    accent: 'from-teal-700 to-cyan-600',
    sections: ['opening_hours', 'donation', 'programs', 'highlights'],
  },
};

export const getBusinessExampleById = (id) =>
  BUSINESS_DIRECTORY_EXAMPLES.find(
    (b) => String(b.id) === String(id) || String(b.slug) === String(id)
  ) || null;

export const mergeBusinessExamples = (apiBusinesses = []) => {
  const list = Array.isArray(apiBusinesses) ? [...apiBusinesses] : [];
  const existing = new Set(
    list.map((b) => String(b.id ?? b.slug ?? b.business_name).toLowerCase())
  );

  BUSINESS_DIRECTORY_EXAMPLES.forEach((example) => {
    const key = String(example.id).toLowerCase();
    const nameKey = String(example.business_name).toLowerCase();
    // Drop wrong Tech Solutions-style automotive placeholders if present
    const wrongAuto = list.filter((b) => {
      const cat = `${b.business_category_slug || ''} ${b.category_name || ''} ${b.category?.name || ''}`.toLowerCase();
      const name = String(b.business_name || '').toLowerCase();
      return (
        cat.includes('auto') &&
        (name.includes('tech solution') || name.includes('software') || name.includes('it consulting'))
      );
    });
    wrongAuto.forEach((w) => {
      const idx = list.indexOf(w);
      if (idx >= 0) list.splice(idx, 1);
    });

    if (!existing.has(key) && !existing.has(nameKey)) {
      list.unshift(example);
      existing.add(key);
    }
  });

  return list;
};

export default BUSINESS_DIRECTORY_EXAMPLES;
