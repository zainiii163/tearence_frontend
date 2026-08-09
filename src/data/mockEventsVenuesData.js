// Mock Events & Venues Data for API Responses

// Mock Events Data
export const mockEvents = [
  {
    id: 1,
    title: "Summer Music Festival 2024",
    description: "Join us for an amazing outdoor music festival featuring top artists from around the world. Experience three days of incredible performances, food vendors, and entertainment.",
    category: "concert",
    subcategory: "music_festival",
    organizer_id: 1,
    organizer_name: "Worldwide Events Ltd",
    organizer_email: "events@worldwide.com",
    venue_id: 1,
    venue_name: "Central Park Arena",
    venue_address: "123 Park Avenue, New York, NY",
    country: "USA",
    city: "New York",
    date: "2024-07-15",
    start_time: "18:00",
    end_time: "23:00",
    timezone: "America/New_York",
    price_type: "paid",
    min_price: 75.00,
    max_price: 250.00,
    currency: "USD",
    capacity: 50000,
    tickets_sold: 32450,
    status: "published",
    promotion_tier: "featured",
    views: 15420,
    shares: 892,
    favorites: 2341,
    rating: 4.8,
    review_count: 156,
    images: [
      "https://picsum.photos/seed/event1/800/600.jpg",
      "https://picsum.photos/seed/event1b/800/600.jpg",
      "https://picsum.photos/seed/event1c/800/600.jpg"
    ],
    tags: ["music", "festival", "outdoor", "summer", "concert"],
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:22:00Z",
    featured_until: "2024-07-15T23:59:59Z"
  },
  {
    id: 2,
    title: "Tech Innovation Summit 2024",
    description: "Annual technology conference bringing together industry leaders, startups, and innovators. Keynote speeches, workshops, and networking opportunities.",
    category: "conference",
    subcategory: "technology",
    organizer_id: 2,
    organizer_name: "TechHub Events",
    organizer_email: "summit@techhub.com",
    venue_id: 2,
    venue_name: "Convention Center",
    venue_address: "456 Tech Boulevard, San Francisco, CA",
    country: "USA",
    city: "San Francisco",
    date: "2024-09-20",
    start_time: "09:00",
    end_time: "18:00",
    timezone: "America/Los_Angeles",
    price_type: "paid",
    min_price: 150.00,
    max_price: 500.00,
    currency: "USD",
    capacity: 2000,
    tickets_sold: 1850,
    status: "published",
    promotion_tier: "sponsored",
    views: 8920,
    shares: 445,
    favorites: 892,
    rating: 4.9,
    review_count: 89,
    images: [
      "https://picsum.photos/seed/event2/800/600.jpg",
      "https://picsum.photos/seed/event2b/800/600.jpg"
    ],
    tags: ["technology", "conference", "innovation", "networking", "startup"],
    created_at: "2024-02-01T09:15:00Z",
    updated_at: "2024-02-10T16:45:00Z",
    featured_until: "2024-09-20T23:59:59Z"
  },
  {
    id: 3,
    title: "Food & Wine Tasting Evening",
    description: "An exclusive evening of gourmet food and fine wine tasting. Featuring renowned chefs and sommeliers from around the world.",
    category: "food_drink",
    subcategory: "tasting",
    organizer_id: 3,
    organizer_name: "Gourmet Experiences",
    organizer_email: "taste@gourmet.com",
    venue_id: 3,
    venue_name: "Riverside Restaurant",
    venue_address: "789 River Road, Chicago, IL",
    country: "USA",
    city: "Chicago",
    date: "2024-05-10",
    start_time: "19:00",
    end_time: "22:00",
    timezone: "America/Chicago",
    price_type: "paid",
    min_price: 85.00,
    max_price: 150.00,
    currency: "USD",
    capacity: 100,
    tickets_sold: 78,
    status: "published",
    promotion_tier: "promoted",
    views: 3450,
    shares: 123,
    favorites: 234,
    rating: 4.7,
    review_count: 45,
    images: [
      "https://picsum.photos/seed/event3/800/600.jpg",
      "https://picsum.photos/seed/event3b/800/600.jpg"
    ],
    tags: ["food", "wine", "tasting", "gourmet", "dining"],
    created_at: "2024-03-01T11:20:00Z",
    updated_at: "2024-03-05T13:30:00Z",
    featured_until: "2024-05-10T23:59:59Z"
  }
];

// Mock Venues Data
export const mockVenues = [
  {
    id: 1,
    name: "Central Park Arena",
    description: "Premier outdoor venue perfect for large concerts and festivals. State-of-the-art sound system and stunning city views.",
    venue_type: "outdoor_arena",
    owner_id: 1,
    owner_name: "Arena Management Group",
    owner_email: "info@arenagroup.com",
    address: "123 Park Avenue, New York, NY",
    country: "USA",
    city: "New York",
    state: "NY",
    postal_code: "10001",
    latitude: 40.7829,
    longitude: -73.9654,
    capacity: 50000,
    min_capacity: 1000,
    max_capacity: 50000,
    hourly_rate: 5000.00,
    daily_rate: 25000.00,
    currency: "USD",
    status: "published",
    promotion_tier: "featured",
    views: 12450,
    shares: 567,
    favorites: 1234,
    rating: 4.8,
    review_count: 234,
    images: [
      "https://picsum.photos/seed/venue1/800/600.jpg",
      "https://picsum.photos/seed/venue1b/800/600.jpg",
      "https://picsum.photos/seed/venue1c/800/600.jpg"
    ],
    amenities: [
      "parking", "restrooms", "sound_system", "lighting", "catering_facilities", 
      "vip_areas", "security", "first_aid", "accessible", "wifi"
    ],
    features: [
      "outdoor_space", "stage", "backstage_areas", "dressing_rooms", 
      "equipment_storage", "ticket_booths", "merchandise_areas"
    ],
    rules: [
      "No outside food or beverages",
      "Professional security required",
      "Noise restrictions after 11 PM",
      "Insurance certificate required"
    ],
    availability: {
      monday: { available: true, hours: "09:00-23:00" },
      tuesday: { available: true, hours: "09:00-23:00" },
      wednesday: { available: true, hours: "09:00-23:00" },
      thursday: { available: true, hours: "09:00-23:00" },
      friday: { available: true, hours: "09:00-23:00" },
      saturday: { available: true, hours: "09:00-23:00" },
      sunday: { available: true, hours: "09:00-23:00" }
    },
    tags: ["outdoor", "concert", "festival", "large_capacity", "city_views"],
    created_at: "2024-01-10T08:30:00Z",
    updated_at: "2024-01-25T15:45:00Z",
    featured_until: "2024-12-31T23:59:59Z"
  },
  {
    id: 2,
    name: "Convention Center",
    description: "Modern convention center with flexible spaces for conferences, exhibitions, and corporate events. Advanced technology and professional services.",
    venue_type: "convention_center",
    owner_id: 2,
    owner_name: "City Convention Authority",
    owner_email: "bookings@conventioncenter.com",
    address: "456 Tech Boulevard, San Francisco, CA",
    country: "USA",
    city: "San Francisco",
    state: "CA",
    postal_code: "94105",
    latitude: 37.7749,
    longitude: -122.4194,
    capacity: 5000,
    min_capacity: 50,
    max_capacity: 5000,
    hourly_rate: 1000.00,
    daily_rate: 8000.00,
    currency: "USD",
    status: "published",
    promotion_tier: "sponsored",
    views: 8920,
    shares: 334,
    favorites: 892,
    rating: 4.7,
    review_count: 167,
    images: [
      "https://picsum.photos/seed/venue2/800/600.jpg",
      "https://picsum.photos/seed/venue2b/800/600.jpg"
    ],
    amenities: [
      "parking", "restrooms", "av_equipment", "wifi", "catering_kitchen",
      "registration_desk", "breakout_rooms", "exhibition_space", "accessible"
    ],
    features: [
      "multiple_rooms", "conference_facilities", "exhibition_halls",
      "presentation_systems", "simultaneous_translation", "loading_docks"
    ],
    rules: [
      "Professional setup required",
      "Catering must be approved",
      "Damage deposit required",
      "Event insurance mandatory"
    ],
    availability: {
      monday: { available: true, hours: "07:00-23:00" },
      tuesday: { available: true, hours: "07:00-23:00" },
      wednesday: { available: true, hours: "07:00-23:00" },
      thursday: { available: true, hours: "07:00-23:00" },
      friday: { available: true, hours: "07:00-23:00" },
      saturday: { available: false, hours: "" },
      sunday: { available: false, hours: "" }
    },
    tags: ["indoor", "conference", "exhibition", "corporate", "technology"],
    created_at: "2024-02-01T10:15:00Z",
    updated_at: "2024-02-15T14:30:00Z",
    featured_until: "2024-12-31T23:59:59Z"
  },
  {
    id: 3,
    name: "Riverside Restaurant",
    description: "Elegant restaurant with private dining spaces perfect for intimate events, corporate dinners, and special celebrations.",
    venue_type: "restaurant",
    owner_id: 3,
    owner_name: "Riverside Hospitality",
    owner_email: "events@riversiderestaurant.com",
    address: "789 River Road, Chicago, IL",
    country: "USA",
    city: "Chicago",
    state: "IL",
    postal_code: "60601",
    latitude: 41.8781,
    longitude: -87.6298,
    capacity: 150,
    min_capacity: 10,
    max_capacity: 150,
    hourly_rate: 200.00,
    daily_rate: 1500.00,
    currency: "USD",
    status: "published",
    promotion_tier: "promoted",
    views: 3450,
    shares: 123,
    favorites: 234,
    rating: 4.9,
    review_count: 89,
    images: [
      "https://picsum.photos/seed/venue3/800/600.jpg",
      "https://picsum.photos/seed/venue3b/800/600.jpg"
    ],
    amenities: [
      "parking", "restrooms", "bar", "kitchen", "private_rooms",
      "sound_system", "projector", "accessible", "climate_control"
    ],
    features: [
      "private_dining", "river_views", "outdoor_patio", "full_bar",
      "gourmet_kitchen", "wine_cellar", "valet_parking"
    ],
    rules: [
      "Minimum spend requirements",
      "Advance booking required",
      "Dress code enforced",
      "Limited noise levels"
    ],
    availability: {
      monday: { available: true, hours: "11:00-23:00" },
      tuesday: { available: true, hours: "11:00-23:00" },
      wednesday: { available: true, hours: "11:00-23:00" },
      thursday: { available: true, hours: "11:00-23:00" },
      friday: { available: true, hours: "11:00-23:00" },
      saturday: { available: true, hours: "11:00-23:00" },
      sunday: { available: true, hours: "11:00-23:00" }
    },
    tags: ["restaurant", "private_dining", "elegant", "river_views", "intimate"],
    created_at: "2024-03-01T09:45:00Z",
    updated_at: "2024-03-10T16:20:00Z",
    featured_until: "2024-12-31T23:59:59Z"
  }
];

// Mock Venue Services Data
export const mockVenueServices = [
  {
    id: 1,
    name: "Professional Event Planning",
    description: "Full-service event planning including coordination, logistics, vendor management, and on-site supervision.",
    service_category: "event_planning",
    provider_id: 1,
    provider_name: "Premier Events Co",
    provider_email: "planning@premierevents.com",
    country: "USA",
    city: "New York",
    service_areas: ["New York", "New Jersey", "Connecticut"],
    experience_years: 15,
    team_size: 12,
    hourly_rate: 150.00,
    daily_rate: 1200.00,
    currency: "USD",
    status: "published",
    promotion_tier: "featured",
    views: 8920,
    shares: 234,
    favorites: 567,
    rating: 4.9,
    review_count: 123,
    images: [
      "https://picsum.photos/seed/service1/800/600.jpg",
      "https://picsum.photos/seed/service1b/800/600.jpg"
    ],
    specializations: [
      "corporate_events", "weddings", "conferences", "product_launches", 
      "charity_events", "private_parties"
    ],
    packages: [
      {
        id: 1,
        name: "Basic Planning",
        description: "Essential planning services for small events",
        price: 500.00,
        duration: "per_event",
        features: [
          "Initial consultation",
          "Vendor recommendations",
          "Timeline creation",
          "Day-of coordination"
        ]
      },
      {
        id: 2,
        name: "Premium Planning",
        description: "Comprehensive planning services",
        price: 1500.00,
        duration: "per_event",
        features: [
          "Full event coordination",
          "Vendor management",
          "Budget planning",
          "On-site supervision",
          "Post-event follow-up"
        ]
      },
      {
        id: 3,
        name: "VIP Planning",
        description: "Luxury event planning with premium services",
        price: 5000.00,
        duration: "per_event",
        features: [
          "White-glove service",
          "Exclusive vendor access",
          "Custom design",
          "Full production team",
          "Concierge services",
          "Guest management"
        ]
      }
    ],
    tags: ["planning", "coordination", "professional", "experienced", "full_service"],
    created_at: "2024-01-20T11:30:00Z",
    updated_at: "2024-01-30T14:45:00Z",
    featured_until: "2024-12-31T23:59:59Z"
  },
  {
    id: 2,
    name: "Gourmet Catering Services",
    description: "Premium catering with custom menus, professional service, and exceptional cuisine for all types of events.",
    service_category: "catering",
    provider_id: 2,
    provider_name: "Gourmet Catering Co",
    provider_email: "catering@gourmet.com",
    country: "USA",
    city: "San Francisco",
    service_areas: ["San Francisco", "Oakland", "San Jose", "Marin County"],
    experience_years: 20,
    team_size: 25,
    hourly_rate: 100.00,
    daily_rate: 800.00,
    currency: "USD",
    status: "published",
    promotion_tier: "sponsored",
    views: 6780,
    shares: 189,
    favorites: 445,
    rating: 4.8,
    review_count: 98,
    images: [
      "https://picsum.photos/seed/service2/800/600.jpg",
      "https://picsum.photos/seed/service2b/800/600.jpg"
    ],
    specializations: [
      "corporate_catering", "wedding_catering", "buffet_service", 
      "plated_dinners", "cocktail_receptions", "dietary_accommodations"
    ],
    packages: [
      {
        id: 1,
        name: "Standard Buffet",
        description: "Quality buffet service for casual events",
        price: 25.00,
        duration: "per_person",
        features: [
          "3 main dishes",
          "2 side dishes",
          "Salad bar",
          "Dessert station",
          "Basic service staff"
        ]
      },
      {
        id: 2,
        name: "Premium Plated",
        description: "Elegant plated dinner service",
        price: 75.00,
        duration: "per_person",
        features: [
          "4-course meal",
          "Wine pairing",
          "Professional servers",
          "Table settings",
          "Chef presentation"
        ]
      }
    ],
    tags: ["catering", "food", "gourmet", "professional", "custom_menus"],
    created_at: "2024-02-10T09:15:00Z",
    updated_at: "2024-02-20T12:30:00Z",
    featured_until: "2024-12-31T23:59:59Z"
  }
];

// Mock Promotion Tiers
export const mockPromotionTiers = [
  {
    id: 1,
    name: "Standard",
    description: "Basic listing with standard visibility",
    price: 0.00,
    duration_days: 365,
    features: [
      "Basic listing",
      "Search visibility",
      "Standard placement",
      "Basic analytics"
    ],
    visibility_multiplier: 1.0,
    is_default: true,
    is_active: true
  },
  {
    id: 2,
    name: "Promoted",
    description: "Enhanced visibility with highlighted placement",
    price: 29.99,
    duration_days: 30,
    features: [
      "Enhanced listing",
      "Priority placement",
      "Highlighted badge",
      "Advanced analytics",
      "Email promotion"
    ],
    visibility_multiplier: 2.0,
    is_default: false,
    is_active: true
  },
  {
    id: 3,
    name: "Featured",
    description: "Premium placement with maximum exposure",
    price: 79.99,
    duration_days: 30,
    features: [
      "Premium listing",
      "Top placement",
      "Featured badge",
      "Social media promotion",
      "Priority support",
      "Detailed analytics"
    ],
    visibility_multiplier: 4.0,
    is_default: false,
    is_active: true,
    is_popular: true
  },
  {
    id: 4,
    name: "Sponsored",
    description: "Maximum visibility across all platforms",
    price: 149.99,
    duration_days: 30,
    features: [
      "Sponsored listing",
      "Guaranteed top placement",
      "Sponsored badge",
      "Cross-platform promotion",
      "Dedicated support",
      "Real-time analytics",
      "Performance reports"
    ],
    visibility_multiplier: 6.0,
    is_default: false,
    is_active: true
  },
  {
    id: 5,
    name: "Spotlight",
    description: "Ultimate exposure with exclusive features",
    price: 299.99,
    duration_days: 30,
    features: [
      "Spotlight listing",
      "Exclusive placement",
      "Premium badge",
      "Full marketing campaign",
      "VIP support",
      "Advanced analytics dashboard",
      "Custom branding",
      "Video promotion"
    ],
    visibility_multiplier: 10.0,
    is_default: false,
    is_active: true
  },
  {
    id: 6,
    name: "Network-Wide Boost",
    description: "Maximum exposure across entire network",
    price: 499.99,
    duration_days: 30,
    features: [
      "Network-wide promotion",
      "Exclusive homepage placement",
      "Newsletter feature",
      "Partner network promotion",
      "White-glove service",
      "Custom analytics",
      "Brand partnership opportunities",
      "Event sponsorship options"
    ],
    visibility_multiplier: 15.0,
    is_default: false,
    is_active: true
  }
];

// Mock Live Activity Feed
export const mockLiveActivity = [
  {
    id: 1,
    type: "event_created",
    content_type: "event",
    content_id: 1,
    content_title: "Summer Music Festival 2024",
    user_name: "John Organizer",
    user_avatar: "https://picsum.photos/seed/user1/50/50.jpg",
    timestamp: "2024-03-15T14:30:00Z",
    location: "New York, USA"
  },
  {
    id: 2,
    type: "venue_booked",
    content_type: "venue",
    content_id: 2,
    content_title: "Convention Center",
    user_name: "Sarah Manager",
    user_avatar: "https://picsum.photos/seed/user2/50/50.jpg",
    timestamp: "2024-03-15T13:45:00Z",
    location: "San Francisco, USA"
  },
  {
    id: 3,
    type: "service_hired",
    content_type: "venue_service",
    content_id: 1,
    content_title: "Professional Event Planning",
    user_name: "Mike Client",
    user_avatar: "https://picsum.photos/seed/user3/50/50.jpg",
    timestamp: "2024-03-15T12:20:00Z",
    location: "New York, USA"
  },
  {
    id: 4,
    type: "promotion_purchased",
    content_type: "event",
    content_id: 2,
    content_title: "Tech Innovation Summit 2024",
    user_name: "TechHub Events",
    user_avatar: "https://picsum.photos/seed/user4/50/50.jpg",
    timestamp: "2024-03-15T11:15:00Z",
    location: "San Francisco, USA"
  },
  {
    id: 5,
    type: "review_added",
    content_type: "venue",
    content_id: 3,
    content_title: "Riverside Restaurant",
    user_name: "Emily Reviewer",
    user_avatar: "https://picsum.photos/seed/user5/50/50.jpg",
    timestamp: "2024-03-15T10:30:00Z",
    location: "Chicago, USA",
    rating: 5,
    comment: "Amazing venue for our corporate event!"
  }
];

// Mock Categories
export const mockCategories = {
  events: [
    { id: 1, name: "Concert", slug: "concert", icon: "music", count: 1250 },
    { id: 2, name: "Workshop", slug: "workshop", icon: "tools", count: 890 },
    { id: 3, name: "Party", slug: "party", icon: "celebration", count: 2340 },
    { id: 4, name: "Festival", slug: "festival", icon: "calendar", count: 450 },
    { id: 5, name: "Conference", slug: "conference", icon: "users", count: 670 },
    { id: 6, name: "Sports", slug: "sports", icon: "trophy", count: 890 },
    { id: 7, name: "Cultural", slug: "cultural", icon: "globe", count: 340 },
    { id: 8, name: "Food & Drink", slug: "food_drink", icon: "utensils", count: 1560 },
    { id: 9, name: "Charity", slug: "charity", icon: "heart", count: 230 },
    { id: 10, name: "Other", slug: "other", icon: "more-horizontal", count: 890 }
  ],
  venues: [
    { id: 1, name: "Outdoor Arena", slug: "outdoor_arena", icon: "sun", count: 340 },
    { id: 2, name: "Indoor Hall", slug: "indoor_hall", icon: "home", count: 890 },
    { id: 3, name: "Conference Center", slug: "conference_center", icon: "building", count: 450 },
    { id: 4, name: "Restaurant", slug: "restaurant", icon: "coffee", count: 2340 },
    { id: 5, name: "Hotel", slug: "hotel", icon: "bed", count: 670 },
    { id: 6, name: "Club", slug: "club", icon: "music", count: 1230 },
    { id: 7, name: "Gallery", slug: "gallery", icon: "image", count: 180 },
    { id: 8, name: "Theater", slug: "theater", icon: "film", count: 290 },
    { id: 9, name: "Stadiums", slug: "stadiums", icon: "target", count: 120 },
    { id: 10, name: "Grounds", slug: "grounds", icon: "map", count: 95 },
    { id: 11, name: "Caravan Parks", slug: "caravan-parks", icon: "home", count: 210 },
    { id: 12, name: "Other", slug: "other", icon: "more-horizontal", count: 450 }
  ],
  services: [
    { id: 1, name: "Event Planning", slug: "event_planning", icon: "calendar", count: 890 },
    { id: 2, name: "Catering", slug: "catering", icon: "utensils", count: 1560 },
    { id: 3, name: "Photography", slug: "photography", icon: "camera", count: 670 },
    { id: 4, name: "Videography", slug: "videography", icon: "video", count: 340 },
    { id: 5, name: "Music", slug: "music", icon: "music", count: 1230 },
    { id: 6, name: "Decoration", slug: "decoration", icon: "palette", count: 450 },
    { id: 7, name: "Transportation", slug: "transportation", icon: "truck", count: 290 },
    { id: 8, name: "Security", slug: "security", icon: "shield", count: 180 },
    { id: 9, name: "Lighting", slug: "lighting", icon: "lightbulb", count: 120 },
    { id: 10, name: "Other", slug: "other", icon: "more-horizontal", count: 340 }
  ]
};

// Mock API Response Formats
export const mockAPIResponses = {
  events: {
    getAll: {
      status: "success",
      message: "Events retrieved successfully",
      data: {
        events: mockEvents,
        pagination: {
          current_page: 1,
          per_page: 12,
          total: 156,
          last_page: 13,
          has_more: true
        },
        filters: {
          categories: mockCategories.events,
          countries: ["USA", "UK", "Canada", "Australia"],
          price_ranges: ["free", "0-50", "50-100", "100-500", "500+"]
        }
      }
    },
    getById: {
      status: "success",
      message: "Event retrieved successfully",
      data: mockEvents[0]
    },
    create: {
      status: "success",
      message: "Event created successfully",
      data: mockEvents[0]
    }
  },
  venues: {
    getAll: {
      status: "success",
      message: "Venues retrieved successfully",
      data: {
        venues: mockVenues,
        pagination: {
          current_page: 1,
          per_page: 12,
          total: 89,
          last_page: 8,
          has_more: true
        },
        filters: {
          types: mockCategories.venues,
          countries: ["USA", "UK", "Canada", "Australia"],
          capacities: ["0-100", "100-500", "500-1000", "1000-5000", "5000+"]
        }
      }
    },
    getById: {
      status: "success",
      message: "Venue retrieved successfully",
      data: mockVenues[0]
    },
    create: {
      status: "success",
      message: "Venue created successfully",
      data: mockVenues[0]
    }
  },
  venueServices: {
    getAll: {
      status: "success",
      message: "Venue services retrieved successfully",
      data: {
        services: mockVenueServices,
        pagination: {
          current_page: 1,
          per_page: 12,
          total: 67,
          last_page: 6,
          has_more: true
        },
        filters: {
          categories: mockCategories.services,
          countries: ["USA", "UK", "Canada", "Australia"],
          service_areas: ["New York", "San Francisco", "Chicago", "Los Angeles"]
        }
      }
    },
    getById: {
      status: "success",
      message: "Venue service retrieved successfully",
      data: mockVenueServices[0]
    },
    create: {
      status: "success",
      message: "Venue service created successfully",
      data: mockVenueServices[0]
    }
  },
  upsells: {
    getPromotionTiers: {
      status: "success",
      message: "Promotion tiers retrieved successfully",
      data: mockPromotionTiers
    },
    createOrder: {
      status: "success",
      message: "Promotion order created successfully",
      data: {
        order_id: "ORD_123456",
        promotion_tier: "featured",
        content_type: "event",
        content_id: 1,
        price: 79.99,
        currency: "USD",
        duration_days: 30,
        status: "pending_payment",
        created_at: "2024-03-15T15:30:00Z"
      }
    }
  }
};

// Export as default for convenience
const mockEventsVenuesData = {
  mockEvents,
  mockVenues,
  mockVenueServices,
  mockPromotionTiers,
  mockLiveActivity,
  mockCategories,
  mockAPIResponses
};

export default mockEventsVenuesData;
