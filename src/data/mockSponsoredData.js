// Mock data for Sponsored Adverts page
export const mockHomepageStats = {
  data: {
    sponsored_ads: "12,456",
    countries: 142,
    total_views: "45.2M",
    satisfaction: "98%"
  }
};

export const mockCategories = {
  data: [
    {
      id: 1,
      name: "Real Estate",
      slug: "real-estate",
      icon: "🏠",
      count: 2341,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      name: "Vehicles",
      slug: "vehicles",
      icon: "🚗",
      count: 1876,
      color: "from-red-500 to-red-600"
    },
    {
      id: 3,
      name: "Services",
      slug: "services",
      icon: "💼",
      count: 3421,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 4,
      name: "Buy & Sell",
      slug: "buy-sell",
      icon: "🛍️",
      count: 2890,
      color: "from-green-500 to-green-600"
    },
    {
      id: 5,
      name: "Jobs",
      slug: "jobs",
      icon: "💼",
      count: 1234,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      id: 6,
      name: "Travel",
      slug: "travel",
      icon: "✈️",
      count: 987,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      id: 7,
      name: "Books",
      slug: "books",
      icon: "📚",
      count: 654,
      color: "from-pink-500 to-pink-600"
    },
    {
      id: 8,
      name: "Events",
      slug: "events",
      icon: "🎪",
      count: 432,
      color: "from-orange-500 to-orange-600"
    }
  ]
};

export const mockLiveActivity = {
  data: [
    {
      id: 1,
      type: "view",
      message: "Someone viewed a Premium Property in Dubai",
      timestamp: "2 minutes ago",
      icon: "👁️"
    },
    {
      id: 2,
      type: "post",
      message: "New Luxury Car listed in London",
      timestamp: "5 minutes ago",
      icon: "🚗"
    },
    {
      id: 3,
      type: "inquiry",
      message: "Inquiry sent for Web Development Service",
      timestamp: "8 minutes ago",
      icon: "💬"
    },
    {
      id: 4,
      type: "featured",
      message: "Restaurant in New York became Featured",
      timestamp: "12 minutes ago",
      icon: "⭐"
    },
    {
      id: 5,
      type: "trending",
      message: "Vintage Collection is trending in Paris",
      timestamp: "15 minutes ago",
      icon: "🔥"
    }
  ]
};

export const mockAdverts = {
  data: [
    {
      id: 1,
      title: "Luxury Villa with Ocean View",
      description: "Stunning 5-bedroom villa with panoramic ocean views, private pool, and modern amenities",
      price: "$2,500,000",
      category: "Real Estate",
      country: "United Arab Emirates",
      city: "Dubai",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400",
      seller: {
        id: 1,
        name: "Premium Properties",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        verified: true,
        rating: 4.8,
        reviews: 127
      },
      views: 15420,
      rating: 4.9,
      featured: true,
      promoted: true,
      sponsored: true,
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      title: "Professional Web Development Services",
      description: "Custom web development, React, Node.js, and modern web technologies",
      price: "$75/hour",
      category: "Services",
      country: "United States",
      city: "New York",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400",
      seller: {
        id: 2,
        name: "Tech Solutions Pro",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
        verified: true,
        rating: 4.7,
        reviews: 89
      },
      views: 8934,
      rating: 4.6,
      featured: false,
      promoted: true,
      sponsored: false,
      created_at: "2024-01-14T15:45:00Z"
    },
    {
      id: 3,
      title: "Vintage Sports Car Collection",
      description: "Rare 1965 Ferrari convertible, fully restored, excellent condition",
      price: "$1,200,000",
      category: "Vehicles",
      country: "Italy",
      city: "Milan",
      image: "https://images.unsplash.com/photo-1583121274602-3e092e40acbf?w=400",
      seller: {
        id: 3,
        name: "Classic Motors",
        avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100",
        verified: true,
        rating: 4.9,
        reviews: 203
      },
      views: 22156,
      rating: 4.8,
      featured: true,
      promoted: false,
      sponsored: true,
      created_at: "2024-01-13T09:20:00Z"
    },
    {
      id: 4,
      title: "Complete Marketing Package",
      description: "Full-service digital marketing including SEO, social media, and content creation",
      price: "$2,500/month",
      category: "Services",
      country: "United Kingdom",
      city: "London",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      seller: {
        id: 4,
        name: "Growth Agency",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
        verified: false,
        rating: 4.5,
        reviews: 67
      },
      views: 6789,
      rating: 4.4,
      featured: false,
      promoted: false,
      sponsored: true,
      created_at: "2024-01-12T14:30:00Z"
    },
    {
      id: 5,
      title: "Beachfront Resort Property",
      description: "Prime beachfront location, 20 rooms, restaurant, and pool in tropical paradise",
      price: "$5,800,000",
      category: "Real Estate",
      country: "Maldives",
      city: "Male",
      image: "https://images.unsplash.com/photo-1520250498154-502d484c1e9c?w=400",
      seller: {
        id: 5,
        name: "Island Properties",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
        verified: true,
        rating: 5.0,
        reviews: 45
      },
      views: 31245,
      rating: 4.9,
      featured: true,
      promoted: true,
      sponsored: true,
      created_at: "2024-01-11T11:15:00Z"
    },
    {
      id: 6,
      title: "Handmade Designer Furniture",
      description: "Custom-designed furniture pieces made from sustainable materials",
      price: "$3,200",
      category: "Buy & Sell",
      country: "Denmark",
      city: "Copenhagen",
      image: "https://images.unsplash.com/photo-1556228720-195a0244164f?w=400",
      seller: {
        id: 6,
        name: "Nordic Designs",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100",
        verified: true,
        rating: 4.7,
        reviews: 156
      },
      views: 9876,
      rating: 4.6,
      featured: false,
      promoted: true,
      sponsored: false,
      created_at: "2024-01-10T16:45:00Z"
    }
  ],
  meta: {
    current_page: 1,
    last_page: 3,
    per_page: 12,
    total: 36
  }
};

// Mock API functions that return promises
export const getHomepageStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockHomepageStats), 500);
  });
};

export const getSponsoredCategories = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCategories), 300);
  });
};

export const getLiveActivity = async (limit = 20) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockLiveActivity), 400);
  });
};

export const getAllSponsoredAdverts = async (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAdverts), 600);
  });
};

export const searchSponsoredAdverts = async (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockAdverts), 600);
  });
};

export const trackSponsoredEvent = async (advertId, eventType, metadata = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 100);
  });
};
