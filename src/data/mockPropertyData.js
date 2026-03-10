export const sampleProperties = [
  {
    id: 1,
    title: "Luxury Penthouse with Ocean View",
    description: "Stunning penthouse apartment with panoramic ocean views, modern amenities, and premium finishes throughout. Perfect for those seeking luxury living.",
    price: 2500000,
    category: "buy",
    type: "residential",
    location: "Miami Beach",
    country: "🇺🇸",
    specifications: {
      bedrooms: 4,
      bathrooms: 3,
      size: 3500,
      furnished: true,
      parking: 2
    },
    agent: {
      name: "Sarah Johnson",
      verified: true
    },
    badges: ["Featured", "Luxury"],
    views: 15420,
    rating: 4.8,
    images: ["penthouse1", "penthouse2", "penthouse3"],
    videoTour: "https://youtube.com/watch?v=example",
    amenities: ["parking", "wifi", "security", "pool", "gym", "furnished", "aircon", "elevator"],
    coordinates: { lat: 25.7907, lng: -80.1300 },
    postedDate: new Date("2024-01-15"),
    featured: true
  },
  {
    id: 2,
    title: "Modern Downtown Office Space",
    description: "Prime commercial office space in the heart of downtown business district. Excellent foot traffic and modern facilities.",
    price: 850000,
    category: "lease",
    type: "commercial",
    location: "New York",
    country: "🇺🇸",
    specifications: {
      bedrooms: 0,
      bathrooms: 2,
      size: 2500,
      furnished: false,
      parking: 10,
      floorArea: 2500,
      footfall: "high",
      accessibility: true
    },
    agent: {
      name: "Michael Chen",
      verified: true
    },
    badges: ["Promoted", "Commercial"],
    views: 8934,
    rating: 4.6,
    images: ["office1", "office2"],
    amenities: ["parking", "wifi", "security", "elevator", "aircon"],
    coordinates: { lat: 40.7128, lng: -74.0060 },
    postedDate: new Date("2024-02-01"),
    featured: false
  },
  {
    id: 3,
    title: "Cozy Family Home with Garden",
    description: "Perfect family home with spacious backyard, modern kitchen, and excellent schools nearby. Great for growing families.",
    price: 650000,
    category: "buy",
    type: "residential",
    location: "London",
    country: "🇬🇧",
    specifications: {
      bedrooms: 3,
      bathrooms: 2,
      size: 1800,
      furnished: false,
      parking: 2
    },
    agent: {
      name: "Emma Wilson",
      verified: false
    },
    badges: ["Family"],
    views: 6234,
    rating: 4.7,
    images: ["home1", "home2", "home3", "home4"],
    amenities: ["parking", "garden", "pet-friendly", "wifi", "security"],
    coordinates: { lat: 51.5074, lng: -0.1278 },
    postedDate: new Date("2024-01-20"),
    featured: false
  },
  {
    id: 4,
    title: "Industrial Warehouse Complex",
    description: "Large-scale industrial warehouse with loading bays, high ceilings, and excellent transport links. Perfect for logistics.",
    price: 1200000,
    category: "buy",
    type: "industrial",
    location: "Los Angeles",
    country: "🇺🇸",
    specifications: {
      bedrooms: 0,
      bathrooms: 2,
      size: 15000,
      furnished: false,
      parking: 50,
      zoning: "industrial",
      warehouseSize: 15000,
      loadingBays: 6,
      powerCapacity: "500kW",
      ceilingHeight: "12ft"
    },
    agent: {
      name: "Robert Davis",
      verified: true
    },
    badges: ["Industrial", "Investment"],
    views: 4567,
    rating: 4.5,
    images: ["warehouse1", "warehouse2"],
    amenities: ["parking", "security"],
    coordinates: { lat: 34.0522, lng: -118.2437 },
    postedDate: new Date("2024-02-10"),
    featured: false
  },
  {
    id: 5,
    title: "Beachfront Villa Paradise",
    description: "Luxurious beachfront villa with private beach access, infinity pool, and breathtaking sunset views. Ultimate tropical living.",
    price: 3200000,
    category: "buy",
    type: "luxury",
    location: "Dubai",
    country: "🇦🇪",
    specifications: {
      bedrooms: 6,
      bathrooms: 5,
      size: 5500,
      furnished: true,
      parking: 4
    },
    agent: {
      name: "Ahmed Hassan",
      verified: true
    },
    badges: ["Luxury", "Sponsored", "Beachfront"],
    views: 18934,
    rating: 4.9,
    images: ["villa1", "villa2", "villa3", "villa4", "villa5"],
    amenities: ["parking", "pool", "garden", "security", "gym", "wifi", "aircon", "furnished"],
    coordinates: { lat: 25.2048, lng: 55.2708 },
    postedDate: new Date("2024-01-10"),
    featured: true
  },
  {
    id: 6,
    title: "Development Land Opportunity",
    description: "Prime development land with planning permission for residential complex. Excellent investment opportunity in growing area.",
    price: 450000,
    category: "buy",
    type: "land",
    location: "Singapore",
    country: "🇸🇬",
    specifications: {
      bedrooms: 0,
      bathrooms: 0,
      size: 12000,
      furnished: false,
      parking: 0,
      landSize: 2.75,
      landType: "residential",
      planningPermission: true,
      soilQuality: "excellent"
    },
    agent: {
      name: "Lisa Wong",
      verified: true
    },
    badges: ["Investment", "Development"],
    views: 7823,
    rating: 4.4,
    images: ["land1", "land2"],
    amenities: [],
    coordinates: { lat: 1.3521, lng: 103.8198 },
    postedDate: new Date("2024-02-05"),
    featured: false
  },
  {
    id: 7,
    title: "Holiday Apartment in City Center",
    description: "Fully furnished short-term rental apartment in prime tourist location. High occupancy rates and excellent rental yield.",
    price: 280000,
    category: "invest",
    type: "rental",
    location: "Paris",
    country: "🇫🇷",
    specifications: {
      bedrooms: 2,
      bathrooms: 1,
      size: 750,
      furnished: true,
      parking: 0
    },
    agent: {
      name: "Pierre Dubois",
      verified: false
    },
    badges: ["Rental", "Investment"],
    views: 5678,
    rating: 4.6,
    images: ["apartment1", "apartment2", "apartment3"],
    amenities: ["furnished", "wifi", "aircon", "elevator"],
    coordinates: { lat: 48.8566, lng: 2.3522 },
    postedDate: new Date("2024-01-25"),
    featured: false
  },
  {
    id: 8,
    title: "Retail Space in Shopping Mall",
    description: "Prime retail location in busy shopping mall with high foot traffic. Perfect for flagship store or boutique.",
    price: 350000,
    category: "lease",
    type: "retail",
    location: "Tokyo",
    country: "🇯🇵",
    specifications: {
      bedrooms: 0,
      bathrooms: 1,
      size: 1200,
      furnished: false,
      parking: 20
    },
    agent: {
      name: "Yuki Tanaka",
      verified: true
    },
    badges: ["Retail", "Promoted"],
    views: 9234,
    rating: 4.7,
    images: ["retail1", "retail2"],
    amenities: ["parking", "security", "aircon"],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    postedDate: new Date("2024-02-08"),
    featured: false
  },
  {
    id: 9,
    title: "Modern Hotel for Sale",
    description: "Fully operational boutique hotel with 25 rooms, restaurant, and spa facilities. Excellent business opportunity.",
    price: 5500000,
    category: "buy",
    type: "hotels",
    location: "Sydney",
    country: "🇦🇺",
    specifications: {
      bedrooms: 25,
      bathrooms: 30,
      size: 8500,
      furnished: true,
      parking: 15
    },
    agent: {
      name: "James Miller",
      verified: true
    },
    badges: ["Hotels", "Business", "Featured"],
    views: 12345,
    rating: 4.8,
    images: ["hotel1", "hotel2", "hotel3", "hotel4"],
    amenities: ["parking", "pool", "security", "gym", "wifi", "aircon", "furnished", "restaurant"],
    coordinates: { lat: -33.8688, lng: 151.2093 },
    postedDate: new Date("2024-01-05"),
    featured: true
  },
  {
    id: 10,
    title: "Agricultural Farm Land",
    description: "Fertile agricultural land with irrigation systems and existing infrastructure. Perfect for farming or development.",
    price: 180000,
    category: "buy",
    type: "agricultural",
    location: "Cape Town",
    country: "🇿🇦",
    specifications: {
      bedrooms: 0,
      bathrooms: 0,
      size: 50000,
      furnished: false,
      parking: 5
    },
    agent: {
      name: "Thabo Mbeki",
      verified: false
    },
    badges: ["Agricultural"],
    views: 3456,
    rating: 4.3,
    images: ["farm1", "farm2", "farm3"],
    amenities: [],
    coordinates: { lat: -33.9249, lng: 18.4241 },
    postedDate: new Date("2024-02-12"),
    featured: false
  },
  {
    id: 11,
    title: "New Development Off-Plan",
    description: "Modern residential development under construction. Early bird pricing available for pre-launch bookings.",
    price: 420000,
    category: "buy",
    type: "new-development",
    location: "Barcelona",
    country: "🇪🇸",
    specifications: {
      bedrooms: 2,
      bathrooms: 2,
      size: 1100,
      furnished: false,
      parking: 1
    },
    agent: {
      name: "Carlos Rodriguez",
      verified: true
    },
    badges: ["New Development", "Pre-Launch"],
    views: 6789,
    rating: 4.5,
    images: ["development1", "development2"],
    amenities: ["parking", "elevator", "aircon"],
    coordinates: { lat: 41.3851, lng: 2.1734 },
    postedDate: new Date("2024-02-15"),
    featured: false
  },
  {
    id: 12,
    title: "Executive Office Suite",
    description: "Premium office suite with city views, modern facilities, and prestigious business address. Ideal for executive teams.",
    price: 650000,
    category: "lease",
    type: "offices",
    location: "Hong Kong",
    country: "🇭🇰",
    specifications: {
      bedrooms: 0,
      bathrooms: 2,
      size: 1800,
      furnished: true,
      parking: 5
    },
    agent: {
      name: "Wei Li",
      verified: true
    },
    badges: ["Offices", "Premium"],
    views: 8234,
    rating: 4.7,
    images: ["executive1", "executive2", "executive3"],
    amenities: ["parking", "wifi", "security", "elevator", "aircon", "furnished"],
    coordinates: { lat: 22.3193, lng: 114.1694 },
    postedDate: new Date("2024-01-18"),
    featured: false
  }
];

export const propertyCategories = [
  {
    id: 'residential',
    name: 'Residential',
    icon: 'Home',
    count: 45234,
    description: 'Homes, apartments, condos',
    color: 'blue',
    trend: '+12%'
  },
  {
    id: 'commercial',
    name: 'Commercial',
    icon: 'Building',
    count: 28456,
    description: 'Office spaces, retail units',
    color: 'purple',
    trend: '+8%'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    icon: 'Factory',
    count: 15678,
    description: 'Warehouses, factories',
    color: 'orange',
    trend: '+15%'
  },
  {
    id: 'land',
    name: 'Land & Plots',
    icon: 'Trees',
    count: 32145,
    description: 'Land for development',
    color: 'green',
    trend: '+10%'
  },
  {
    id: 'agricultural',
    name: 'Agricultural',
    icon: 'Trees',
    count: 8923,
    description: 'Farms, agricultural land',
    color: 'emerald',
    trend: '+6%'
  },
  {
    id: 'luxury',
    name: 'Luxury',
    icon: 'Star',
    count: 12456,
    description: 'Premium properties',
    color: 'yellow',
    trend: '+18%'
  },
  {
    id: 'rental',
    name: 'Short-term Rental',
    icon: 'Calendar',
    count: 28789,
    description: 'Holiday homes, vacation rentals',
    color: 'pink',
    trend: '+22%'
  },
  {
    id: 'investment',
    name: 'Investment',
    icon: 'TrendingUp',
    count: 19345,
    description: 'High-yield properties',
    color: 'indigo',
    trend: '+14%'
  },
  {
    id: 'new-development',
    name: 'New Development',
    icon: 'Building',
    count: 8234,
    description: 'Off-plan properties',
    color: 'teal',
    trend: '+9%'
  },
  {
    id: 'retail',
    name: 'Retail',
    icon: 'Store',
    count: 11234,
    description: 'Shops, showrooms',
    color: 'red',
    trend: '+7%'
  },
  {
    id: 'offices',
    name: 'Offices',
    icon: 'Briefcase',
    count: 16789,
    description: 'Business spaces',
    color: 'cyan',
    trend: '+11%'
  },
  {
    id: 'hotels',
    name: 'Hotels',
    icon: 'Hotel',
    count: 5678,
    description: 'Hospitality properties',
    color: 'amber',
    trend: '+13%'
  }
];

export const propertyRegions = [
  {
    id: 'europe',
    name: 'Europe',
    count: 45234,
    color: 'blue',
    countries: 44,
    avgPrice: '$350,000',
    growth: '+12%'
  },
  {
    id: 'asia',
    name: 'Asia',
    count: 92123,
    color: 'red',
    countries: 48,
    avgPrice: '$280,000',
    growth: '+15%'
  },
  {
    id: 'north-america',
    name: 'North America',
    count: 78456,
    color: 'green',
    countries: 23,
    avgPrice: '$425,000',
    growth: '+8%'
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    count: 28945,
    color: 'orange',
    countries: 17,
    avgPrice: '$520,000',
    growth: '+18%'
  },
  {
    id: 'africa',
    name: 'Africa',
    count: 15678,
    color: 'purple',
    countries: 54,
    avgPrice: '$180,000',
    growth: '+10%'
  },
  {
    id: 'south-america',
    name: 'South America',
    count: 22345,
    color: 'teal',
    countries: 12,
    avgPrice: '$195,000',
    growth: '+7%'
  },
  {
    id: 'oceania',
    name: 'Oceania',
    count: 18234,
    color: 'indigo',
    countries: 14,
    avgPrice: '$485,000',
    growth: '+6%'
  }
];

export const propertyPurposes = [
  {
    id: 'buy',
    name: 'Buy',
    icon: 'DollarSign',
    count: 156789,
    description: 'Purchase properties',
    color: 'blue'
  },
  {
    id: 'rent',
    name: 'Rent',
    icon: 'Calendar',
    count: 89456,
    description: 'Rental properties',
    color: 'green'
  },
  {
    id: 'lease',
    name: 'Lease',
    icon: 'Store',
    count: 45234,
    description: 'Long-term leases',
    color: 'purple'
  },
  {
    id: 'invest',
    name: 'Invest',
    icon: 'TrendingUp',
    count: 34567,
    description: 'Investment opportunities',
    color: 'orange'
  }
];
