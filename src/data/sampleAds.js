// Sample ads data for various categories to ensure pages always have content
export const sampleAds = {
  electronics: [
    {
      listing_id: 'sample_elec_1',
      title: 'iPhone 14 Pro - Excellent Condition',
      head: 'Selling my iPhone 14 Pro 128GB in excellent condition. Used for 6 months, no scratches or issues.',
      price: 899,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-iphone.jpg' }],
      slug: 'iphone-14-pro-excellent-condition',
      category: { name: 'Electronics', slug: 'electronics' },
      location: { city: 'New York', name: 'New York' },
      customer_id: 'sample_user_1',
      created_at: new Date().toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_elec_2',
      title: 'Sony WH-1000XM4 Wireless Headphones',
      head: 'Premium noise-canceling headphones in like-new condition. Original box and accessories included.',
      price: 279,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-headphones.jpg' }],
      slug: 'sony-wh1000xm4-wireless-headphones',
      category: { name: 'Electronics', slug: 'electronics' },
      location: { city: 'Los Angeles', name: 'Los Angeles' },
      customer_id: 'sample_user_2',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_elec_3',
      title: 'MacBook Air M2 - 13-inch',
      head: '2022 MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Perfect for students and professionals.',
      price: 999,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-macbook.jpg' }],
      slug: 'macbook-air-m2-13-inch',
      category: { name: 'Electronics', slug: 'electronics' },
      location: { city: 'Chicago', name: 'Chicago' },
      customer_id: 'sample_user_3',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_elec_4',
      title: 'Samsung 65" 4K Smart TV',
      head: 'Samsung Crystal UHD 65" 4K Smart TV. Excellent picture quality, includes remote and stand.',
      price: 649,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-tv.jpg' }],
      slug: 'samsung-65-4k-smart-tv',
      category: { name: 'Electronics', slug: 'electronics' },
      location: { city: 'Houston', name: 'Houston' },
      customer_id: 'sample_user_4',
      created_at: new Date(Date.now() - 259200000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_elec_5',
      title: 'iPad Pro 11-inch with Magic Keyboard',
      head: '2021 iPad Pro 11" with Magic Keyboard and Apple Pencil. Great for creative work.',
      price: 799,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-ipad.jpg' }],
      slug: 'ipad-pro-11-inch-magic-keyboard',
      category: { name: 'Electronics', slug: 'electronics' },
      location: { city: 'Phoenix', name: 'Phoenix' },
      customer_id: 'sample_user_5',
      created_at: new Date(Date.now() - 345600000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    }
  ],
  vehicles: [
    {
      listing_id: 'sample_veh_1',
      title: '2020 Toyota Camry SE',
      head: 'Excellent condition, low mileage, regular maintenance records available.',
      price: 22999,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-camry.jpg' }],
      slug: '2020-toyota-camry-se',
      category: { name: 'Vehicles', slug: 'vehicles' },
      location: { city: 'Miami', name: 'Miami' },
      customer_id: 'sample_user_6',
      created_at: new Date().toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_veh_2',
      title: 'Honda CR-V 2019 AWD',
      head: 'Well-maintained SUV, perfect for families. All-wheel drive, great fuel economy.',
      price: 18999,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-crv.jpg' }],
      slug: 'honda-crv-2019-awd',
      category: { name: 'Vehicles', slug: 'vehicles' },
      location: { city: 'Seattle', name: 'Seattle' },
      customer_id: 'sample_user_7',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    }
  ],
  property: [
    {
      listing_id: 'sample_prop_1',
      title: 'Modern Downtown Apartment',
      head: '2BR/2BA luxury apartment in downtown area. Amazing city views, modern amenities.',
      price: 2500,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-apartment.jpg' }],
      slug: 'modern-downtown-apartment',
      category: { name: 'Property', slug: 'property' },
      location: { city: 'Boston', name: 'Boston' },
      customer_id: 'sample_user_8',
      created_at: new Date().toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_prop_2',
      title: 'Suburban Family Home',
      head: '4BR/3BA single-family home in quiet neighborhood. Great schools nearby.',
      price: 450000,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-house.jpg' }],
      slug: 'suburban-family-home',
      category: { name: 'Property', slug: 'property' },
      location: { city: 'Denver', name: 'Denver' },
      customer_id: 'sample_user_9',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    }
  ],
  jobs: [
    {
      listing_id: 'sample_job_1',
      title: 'Senior Frontend Developer',
      head: 'Looking for an experienced React developer to join our growing team.',
      price: 120000,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-job.jpg' }],
      slug: 'senior-frontend-developer',
      category: { name: 'Jobs', slug: 'jobs' },
      location: { city: 'San Francisco', name: 'San Francisco' },
      customer_id: 'sample_user_10',
      created_at: new Date().toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_job_2',
      title: 'Marketing Manager',
      head: 'Exciting opportunity for a creative marketing professional in the tech industry.',
      price: 85000,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-marketing.jpg' }],
      slug: 'marketing-manager',
      category: { name: 'Jobs', slug: 'jobs' },
      location: { city: 'Austin', name: 'Austin' },
      customer_id: 'sample_user_11',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    }
  ],
  services: [
    {
      listing_id: 'sample_serv_1',
      title: 'Professional Web Design',
      head: 'Custom website design and development for small businesses.',
      price: 1500,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-webdesign.jpg' }],
      slug: 'professional-web-design',
      category: { name: 'Services', slug: 'services' },
      location: { city: 'Portland', name: 'Portland' },
      customer_id: 'sample_user_12',
      created_at: new Date().toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_serv_2',
      title: 'Home Renovation Services',
      head: 'Professional home renovation and remodeling services. Licensed and insured.',
      price: 75,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-renovation.jpg' }],
      slug: 'home-renovation-services',
      category: { name: 'Services', slug: 'services' },
      location: { city: 'Philadelphia', name: 'Philadelphia' },
      customer_id: 'sample_user_13',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_serv_3',
      title: 'Digital Marketing Consulting',
      head: 'Expert digital marketing services including SEO, social media, and PPC campaigns.',
      price: 200,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-marketing-consulting.jpg' }],
      slug: 'digital-marketing-consulting',
      category: { name: 'Services', slug: 'services' },
      location: { city: 'San Francisco', name: 'San Francisco' },
      customer_id: 'sample_user_14',
      created_at: new Date(Date.now() - 345600000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_serv_4',
      title: 'Mobile App Development',
      head: 'iOS and Android app development for startups and businesses.',
      price: 5000,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-app-development.jpg' }],
      slug: 'mobile-app-development',
      category: { name: 'Services', slug: 'services' },
      location: { city: 'Austin', name: 'Austin' },
      customer_id: 'sample_user_15',
      created_at: new Date(Date.now() - 518400000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_serv_5',
      title: 'Content Writing Services',
      head: 'Professional content writing for blogs, websites, and marketing materials.',
      price: 50,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-content-writing.jpg' }],
      slug: 'content-writing-services',
      category: { name: 'Services', slug: 'services' },
      location: { city: 'New York', name: 'New York' },
      customer_id: 'sample_user_16',
      created_at: new Date(Date.now() - 691200000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    }
  ],
  events: [
    {
      listing_id: 'sample_event_1',
      title: 'Tech Conference 2024',
      head: 'Annual technology conference featuring industry leaders and innovators.',
      price: 299,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-conference.jpg' }],
      slug: 'tech-conference-2024',
      category: { name: 'Events', slug: 'events' },
      location: { city: 'Las Vegas', name: 'Las Vegas' },
      customer_id: 'sample_user_14',
      created_at: new Date().toISOString(),
      event_date: new Date(Date.now() + 2592000000).toISOString().split('T')[0], // 30 days from now
      event_time: '09:00 AM',
      venue: 'Convention Center',
      event_type: 'conference'
    },
    {
      listing_id: 'sample_event_2',
      title: 'Music Festival Weekend',
      head: 'Three-day music festival featuring top artists and bands.',
      price: 199,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-festival.jpg' }],
      slug: 'music-festival-weekend',
      category: { name: 'Events', slug: 'events' },
      location: { city: 'Atlanta', name: 'Atlanta' },
      customer_id: 'sample_user_15',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      event_date: new Date(Date.now() + 5184000000).toISOString().split('T')[0], // 60 days from now
      event_time: '12:00 PM',
      venue: 'Central Park',
      event_type: 'festival'
    },
    {
      listing_id: 'sample_event_3',
      title: 'Business Networking Summit',
      head: 'Connect with entrepreneurs and business leaders from various industries.',
      price: 149,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-networking.jpg' }],
      slug: 'business-networking-summit',
      category: { name: 'Events', slug: 'events' },
      location: { city: 'Chicago', name: 'Chicago' },
      customer_id: 'sample_user_16',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      event_date: new Date(Date.now() + 1296000000).toISOString().split('T')[0], // 15 days from now
      event_time: '06:00 PM',
      venue: 'Business Center',
      event_type: 'networking'
    }
  ],
  business: [
    {
      listing_id: 'sample_bus_1',
      title: 'Established Restaurant for Sale',
      head: 'Profitable restaurant in prime location with loyal customer base.',
      price: 250000,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-restaurant.jpg' }],
      slug: 'established-restaurant-sale',
      category: { name: 'Business', slug: 'business' },
      location: { city: 'Miami', name: 'Miami' },
      customer_id: 'sample_user_17',
      created_at: new Date().toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_bus_2',
      title: 'Tech Startup - SaaS Platform',
      head: 'Growing SaaS business with recurring revenue and expansion potential.',
      price: 500000,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-saas.jpg' }],
      slug: 'tech-startup-saas-platform',
      category: { name: 'Business', slug: 'business' },
      location: { city: 'San Francisco', name: 'San Francisco' },
      customer_id: 'sample_user_18',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    }
  ],
  technology: [
    {
      listing_id: 'sample_tech_1',
      title: 'Laptop Dell XPS 15 - High Performance',
      head: 'Powerful Dell XPS 15 laptop with Intel i7, 16GB RAM, 512GB SSD. Perfect for development work.',
      price: 1299,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-laptop.jpg' }],
      slug: 'laptop-dell-xps-15-high-performance',
      category: { name: 'Technology', slug: 'technology' },
      location: { city: 'San Francisco', name: 'San Francisco' },
      customer_id: 'sample_user_23',
      created_at: new Date().toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_tech_2',
      title: 'iPhone 15 Pro Max - 256GB',
      head: 'Latest iPhone 15 Pro Max in excellent condition. 256GB storage, includes original accessories.',
      price: 1199,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-iphone15.jpg' }],
      slug: 'iphone-15-pro-max-256gb',
      category: { name: 'Technology', slug: 'technology' },
      location: { city: 'New York', name: 'New York' },
      customer_id: 'sample_user_24',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_tech_3',
      title: 'Samsung Galaxy Watch 6 - Smartwatch',
      head: 'Advanced Samsung Galaxy Watch 6 with health tracking, GPS, and smartphone integration.',
      price: 399,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-watch.jpg' }],
      slug: 'samsung-galaxy-watch-6-smartwatch',
      category: { name: 'Technology', slug: 'technology' },
      location: { city: 'Los Angeles', name: 'Los Angeles' },
      customer_id: 'sample_user_25',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    }
  ],
  furniture: [
    {
      listing_id: 'sample_furn_1',
      title: 'Modern Living Room Set',
      head: 'Complete living room furniture set including sofa, chairs, and coffee table.',
      price: 1200,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-living-room.jpg' }],
      slug: 'modern-living-room-set',
      category: { name: 'Furniture', slug: 'furniture' },
      location: { city: 'Seattle', name: 'Seattle' },
      customer_id: 'sample_user_19',
      created_at: new Date().toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_furn_2',
      title: 'Office Desk and Chair',
      head: 'Ergonomic office furniture perfect for home office setup.',
      price: 450,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-office-desk.jpg' }],
      slug: 'office-desk-chair',
      category: { name: 'Furniture', slug: 'furniture' },
      location: { city: 'Boston', name: 'Boston' },
      customer_id: 'sample_user_20',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    }
  ],
  clothing: [
    {
      listing_id: 'sample_cloth_1',
      title: 'Designer Handbag Collection',
      head: 'Authentic designer handbags in excellent condition.',
      price: 350,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-handbag.jpg' }],
      slug: 'designer-handbag-collection',
      category: { name: 'Clothing', slug: 'clothing' },
      location: { city: 'Los Angeles', name: 'Los Angeles' },
      customer_id: 'sample_user_21',
      created_at: new Date().toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    },
    {
      listing_id: 'sample_cloth_2',
      title: 'Mens Business Suit Collection',
      head: 'Professional business suits in various sizes and styles.',
      price: 200,
      currency: { symbol: '$' },
      images: [{ image_path: '/img/sample-suits.jpg' }],
      slug: 'mens-business-suits',
      category: { name: 'Clothing', slug: 'clothing' },
      location: { city: 'New York', name: 'New York' },
      customer_id: 'sample_user_22',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      event_date: null,
      event_time: null,
      venue: null,
      event_type: null
    }
  ]
};

// Get sample ads for a specific category
export const getSampleAdsForCategory = (categorySlug) => {
  const normalizedSlug = categorySlug?.toLowerCase();
  
  // Direct matches
  if (sampleAds[normalizedSlug]) {
    return sampleAds[normalizedSlug];
  }
  
  // Fallback logic for related categories
  if (normalizedSlug?.includes('electronic') || normalizedSlug?.includes('technolog')) {
    return sampleAds.electronics;
  }
  if (normalizedSlug?.includes('technolog')) {
    return sampleAds.technology;
  }
  if (normalizedSlug?.includes('vehicle') || normalizedSlug?.includes('car')) {
    return sampleAds.vehicles;
  }
  if (normalizedSlug?.includes('propert') || normalizedSlug?.includes('real') || normalizedSlug?.includes('home')) {
    return sampleAds.property;
  }
  if (normalizedSlug?.includes('job')) {
    return sampleAds.jobs;
  }
  if (normalizedSlug?.includes('service')) {
    return sampleAds.services;
  }
  if (normalizedSlug?.includes('event')) {
    return sampleAds.events;
  }
  if (normalizedSlug?.includes('business')) {
    return sampleAds.business;
  }
  if (normalizedSlug?.includes('furnit')) {
    return sampleAds.furniture;
  }
  if (normalizedSlug?.includes('cloth') || normalizedSlug?.includes('fashion') || normalizedSlug?.includes('apparel')) {
    return sampleAds.clothing;
  }
  
  // Default fallback - return electronics sample
  return sampleAds.electronics;
};

// Get all sample ads (for homepage or general display)
export const getAllSampleAds = () => {
  return [
    ...sampleAds.electronics,
    ...sampleAds.vehicles,
    ...sampleAds.property,
    ...sampleAds.jobs,
    ...sampleAds.services,
    ...sampleAds.events,
    ...sampleAds.business,
    ...sampleAds.furniture,
    ...sampleAds.clothing,
    ...sampleAds.technology
  ];
};
