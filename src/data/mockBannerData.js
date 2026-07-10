/**
 * Mock Banner Data for fallback when API endpoints are not available
 */

// Mock banner ads data - matching backend BannerAd model structure
export const mockBannerAds = {
  data: [
    {
      id: 1,
      title: "Summer Sale Banner",
      slug: "summer-sale-banner",
      description: "Amazing summer sale with up to 50% off on selected items",
      banner_image: "https://via.placeholder.com/728x90/4CAF50/FFFFFF?text=Summer+Sale",
      banner_type: "image",
      banner_size: "728x90",
      destination_link: "https://example.com/summer-sale",
      business_name: "Fashion Store",
      contact_person: "John Smith",
      email: "contact@fashionstore.com",
      phone: "+1-555-123-4567",
      country: "USA",
      city: "New York",
      banner_category_id: 1,
      promotion_tier: "featured",
      status: "active",
      is_active: true,
      views_count: 15234,
      clicks_count: 892,
      ctr: 5.86,
      created_at: "2024-05-15T10:30:00Z",
      updated_at: "2024-05-15T10:30:00Z"
    },
    {
      id: 2,
      title: "New Product Launch",
      slug: "new-product-launch",
      description: "Introducing our latest product collection",
      banner_image: "https://via.placeholder.com/300x250/2196F3/FFFFFF?text=New+Product",
      banner_type: "image",
      banner_size: "300x250",
      destination_link: "https://example.com/new-products",
      business_name: "Tech Company",
      contact_person: "Jane Doe",
      email: "info@techcompany.com",
      phone: "+1-555-987-6543",
      country: "UK",
      city: "London",
      banner_category_id: 2,
      promotion_tier: "promoted",
      status: "active",
      is_active: true,
      views_count: 8921,
      clicks_count: 445,
      ctr: 4.99,
      created_at: "2024-06-20T14:15:00Z",
      updated_at: "2024-06-20T14:15:00Z"
    },
    {
      id: 3,
      title: "Weekend Special",
      slug: "weekend-special",
      description: "Special weekend discounts and offers",
      banner_image: "https://via.placeholder.com/336x280/FF9800/FFFFFF?text=Weekend+Special",
      banner_type: "image",
      banner_size: "300x250",
      destination_link: "https://example.com/weekend",
      business_name: "Restaurant Chain",
      contact_person: "Mike Johnson",
      email: "mike@restaurant.com",
      phone: "+1-555-456-7890",
      country: "USA",
      city: "Los Angeles",
      banner_category_id: 3,
      promotion_tier: "standard",
      status: "active",
      is_active: true,
      views_count: 5678,
      clicks_count: 234,
      ctr: 4.12,
      created_at: "2024-07-20T09:00:00Z",
      updated_at: "2024-07-20T09:00:00Z"
    },
    {
      id: 4,
      title: "Flash Sale",
      slug: "flash-sale",
      description: "Limited time flash sale - hurry up!",
      banner_image: "https://via.placeholder.com/160x600/9C27B0/FFFFFF?text=Flash+Sale",
      banner_type: "animated",
      banner_size: "160x600",
      destination_link: "https://example.com/flash-sale",
      business_name: "Electronics Store",
      contact_person: "Sarah Williams",
      email: "sales@electronics.com",
      phone: "+1-555-321-0987",
      country: "Canada",
      city: "Toronto",
      banner_category_id: 2,
      promotion_tier: "sponsored",
      status: "active",
      is_active: true,
      views_count: 3456,
      clicks_count: 189,
      ctr: 5.47,
      created_at: "2024-07-21T16:45:00Z",
      updated_at: "2024-07-21T16:45:00Z"
    },
    {
      id: 5,
      title: "Holiday Deals",
      slug: "holiday-deals",
      description: "Exclusive holiday season deals and offers",
      banner_image: "https://via.placeholder.com/160x600/E91E63/FFFFFF?text=Holiday+Deals",
      banner_type: "image",
      banner_size: "160x600",
      destination_link: "https://example.com/holiday",
      business_name: "Gift Shop",
      contact_person: "Emily Brown",
      email: "hello@giftshop.com",
      phone: "+1-555-654-3210",
      country: "USA",
      city: "Chicago",
      banner_category_id: 5,
      promotion_tier: "standard",
      status: "pending",
      is_active: false,
      views_count: 1234,
      clicks_count: 67,
      ctr: 5.43,
      created_at: "2024-07-18T11:30:00Z",
      updated_at: "2024-07-18T11:30:00Z"
    },
    {
      id: 6,
      title: "Back to School",
      slug: "back-to-school",
      description: "Everything you need for back to school",
      banner_image: "https://via.placeholder.com/300x250/00BCD4/FFFFFF?text=Back+to+School",
      banner_type: "image",
      banner_size: "300x250",
      destination_link: "https://example.com/back-to-school",
      business_name: "Book Store",
      contact_person: "David Lee",
      email: "david@bookstore.com",
      phone: "+1-555-789-0123",
      country: "UK",
      city: "Manchester",
      banner_category_id: 6,
      promotion_tier: "promoted",
      status: "active",
      is_active: true,
      views_count: 7890,
      clicks_count: 345,
      ctr: 4.37,
      created_at: "2024-07-10T13:20:00Z",
      updated_at: "2024-07-10T13:20:00Z"
    }
  ],
  meta: {
    total: 6,
    per_page: 12,
    current_page: 1,
    last_page: 1
  }
};

// Mock featured banner ads
export const mockFeaturedBannerAds = {
  data: mockBannerAds.data.slice(0, 3),
  meta: {
    total: 3,
    per_page: 6,
    current_page: 1,
    last_page: 1
  }
};

// Mock most viewed banner ads
export const mockMostViewedBannerAds = {
  data: mockBannerAds.data.sort((a, b) => b.views - a.views).slice(0, 4),
  meta: {
    total: 4,
    per_page: 10,
    current_page: 1,
    last_page: 1
  }
};

// Mock recent banner ads
export const mockRecentBannerAds = {
  data: mockBannerAds.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
  meta: {
    total: 5,
    per_page: 10,
    current_page: 1,
    last_page: 1
  }
};

// Mock banner categories
export const mockBannerCategories = {
  data: [
    {
      id: 1,
      name: "Fashion & Apparel",
      slug: "fashion-apparel",
      description: "Clothing, shoes, and accessories",
      icon: "shirt",
      banner_count: 45
    },
    {
      id: 2,
      name: "Electronics",
      slug: "electronics",
      description: "Electronic devices and gadgets",
      icon: "laptop",
      banner_count: 32
    },
    {
      id: 3,
      name: "Food & Dining",
      slug: "food-dining",
      description: "Restaurants, cafes, and food delivery",
      icon: "utensils",
      banner_count: 28
    },
    {
      id: 4,
      name: "Home & Garden",
      slug: "home-garden",
      description: "Home improvement and garden supplies",
      icon: "home",
      banner_count: 19
    },
    {
      id: 5,
      name: "Health & Beauty",
      slug: "health-beauty",
      description: "Health products and beauty services",
      icon: "heart",
      banner_count: 24
    },
    {
      id: 6,
      name: "Travel & Tourism",
      slug: "travel-tourism",
      description: "Travel agencies and tourism services",
      icon: "plane",
      banner_count: 15
    }
  ],
  meta: {
    total: 6,
    per_page: 20,
    current_page: 1,
    last_page: 1
  }
};

// Mock banner analytics
export const mockBannerAnalytics = {
  data: {
    total_views: 45678,
    total_clicks: 2345,
    average_ctr: 5.13,
    total_revenue: 12345.67,
    period: "24h",
    breakdown: [
      { date: "2024-07-22", views: 5234, clicks: 267, ctr: 5.10 },
      { date: "2024-07-23", views: 5890, clicks: 302, ctr: 5.13 },
      { date: "2024-07-24", views: 6123, clicks: 315, ctr: 5.14 },
      { date: "2024-07-25", views: 5789, clicks: 298, ctr: 5.15 },
      { date: "2024-07-26", views: 6456, clicks: 334, ctr: 5.17 },
      { date: "2024-07-27", views: 6987, clicks: 361, ctr: 5.16 },
      { date: "2024-07-28", views: 7199, clicks: 368, ctr: 5.11 }
    ]
  }
};

// Mock banner stats overview
export const mockBannerStats = {
  data: {
    total_banners: 156,
    active_banners: 89,
    pending_banners: 23,
    expired_banners: 44,
    total_views: 234567,
    total_clicks: 12345,
    average_ctr: 5.26,
    top_performing_categories: [
      { category: "Fashion & Apparel", views: 45678, clicks: 2345 },
      { category: "Electronics", views: 34567, clicks: 1789 },
      { category: "Food & Dining", views: 28901, clicks: 1456 }
    ],
    recent_activity: [
      { action: "banner_created", count: 12, date: "2024-07-28" },
      { action: "banner_updated", count: 8, date: "2024-07-28" },
      { action: "banner_deleted", count: 3, date: "2024-07-28" },
      { action: "banner_viewed", count: 5678, date: "2024-07-28" },
      { action: "banner_clicked", count: 234, date: "2024-07-28" }
    ]
  }
};

// Mock promotion options
export const mockPromotionOptions = {
  data: [
    {
      id: 1,
      name: "Basic Banner",
      description: "Standard banner placement for 30 days",
      price: 29.99,
      duration_days: 30,
      features: ["Standard placement", "Basic analytics", "Email support"]
    },
    {
      id: 2,
      name: "Premium Banner",
      description: "Enhanced banner placement with priority positioning",
      price: 59.99,
      duration_days: 30,
      features: ["Priority placement", "Advanced analytics", "Phone support", "A/B testing"]
    },
    {
      id: 3,
      name: "Featured Banner",
      description: "Top placement with maximum visibility",
      price: 99.99,
      duration_days: 30,
      features: ["Top placement", "Real-time analytics", "Priority support", "Custom design", "Guaranteed clicks"]
    }
  ]
};

// Helper function to get mock data by type
export const getMockBannerData = (type, params = {}) => {
  switch (type) {
    case 'banner-ads':
      return mockBannerAds;
    case 'featured':
      return mockFeaturedBannerAds;
    case 'most-viewed':
      return mockMostViewedBannerAds;
    case 'recent':
      return mockRecentBannerAds;
    case 'categories':
      return mockBannerCategories;
    case 'analytics':
      return mockBannerAnalytics;
    case 'stats':
      return mockBannerStats;
    case 'promotion-options':
      return mockPromotionOptions;
    default:
      return { data: [], meta: { total: 0, per_page: 10, current_page: 1, last_page: 1 } };
  }
};
