// Featured Adverts API Integration
// This file handles all API calls for the Featured Adverts system

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Public API endpoints
export const featuredAdvertsAPI = {
  // Get all featured adverts with filtering
  getFeaturedAdverts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/featured-adverts?${queryParams}`);
  },

  // Cross-category featured feed (vehicles, property, dedicated featured, etc.)
  getSiteFeed: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/featured-adverts/site-feed?${queryParams}`);
  },

  getTrendingTopics: async (limit = 8) => {
    return apiRequest(`/featured-adverts/trending-topics?limit=${limit}`);
  },

  // Get homepage slider (sponsored adverts)
  getCarouselAdverts: async (limit = 8) => {
    return apiRequest(`/featured-adverts/carousel?limit=${limit}`);
  },

  // Get category grid with counts
  getCategoryGrid: async () => {
    return apiRequest('/featured-adverts/category-grid');
  },

  // Get trending countries
  getTrendingCountries: async (limit = 10) => {
    return apiRequest(`/featured-adverts/trending-countries?limit=${limit}`);
  },

  // Get trending categories
  getTrendingCategories: async (params = {}) => {
    const limit = typeof params === 'object' ? (params.limit || 10) : params;
    return apiRequest(`/featured-adverts/trending-categories?limit=${limit}`);
  },

  // Get pricing information
  getPricing: async () => {
    return apiRequest('/featured-adverts/pricing');
  },

  // Get homepage featured adverts
  getHomepageAdverts: async (limit = 12) => {
    return apiRequest(`/featured-adverts/home?limit=${limit}`);
  },

  // Get featured adverts by category
  getAdvertsByCategory: async (categoryId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/featured-adverts/category/${categoryId}?${queryParams}`);
  },

  // Get featured adverts by country
  getAdvertsByCountry: async (country, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/featured-adverts/country/${encodeURIComponent(country)}?${queryParams}`);
  },

  // Get featured adverts by type
  getAdvertsByType: async (type, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/featured-adverts/type/${type}?${queryParams}`);
  },

  // Get related featured adverts
  getRelatedAdverts: async (advertId, limit = 8) => {
    return apiRequest(`/featured-adverts/${advertId}/related?limit=${limit}`);
  },

  // Advanced search
  searchAdverts: async (searchParams) => {
    const queryParams = new URLSearchParams(searchParams).toString();
    return apiRequest(`/featured-adverts/search?${queryParams}`);
  },

  // Get system statistics
  getStatistics: async () => {
    return apiRequest('/featured-adverts/statistics');
  },

  // Get live activity feed
  getLiveActivity: async (limit = 20) => {
    return apiRequest(`/featured-adverts/live-activity?limit=${limit}`);
  },

  // Get analytics data
  getAnalytics: async (timeframe = '30days') => {
    return apiRequest(`/featured-adverts/analytics?timeframe=${timeframe}`);
  },

  // Get single featured advert
  getFeaturedAdvert: async (advertId) => {
    return apiRequest(`/featured-adverts/${advertId}`);
  },

  // Save/favorite featured advert
  saveAdvert: async (advertId) => {
    return apiRequest(`/featured-adverts/${advertId}/save`, {
      method: 'POST',
    });
  },

  // Contact seller
  contactSeller: async (advertId, contactData) => {
    return apiRequest(`/featured-adverts/${advertId}/contact`, {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  // Customer endpoints (require authentication)
  createFeaturedAdvert: async (advertData) => {
    return apiRequest('/featured-adverts', {
      method: 'POST',
      body: JSON.stringify(advertData),
    });
  },

  // Upload image for featured advert
  uploadImage: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API_BASE_URL}/featured-adverts/upload-image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },

  updateFeaturedAdvert: async (advertId, advertData) => {
    return apiRequest(`/featured-adverts/${advertId}`, {
      method: 'PUT',
      body: JSON.stringify(advertData),
    });
  },

  deleteFeaturedAdvert: async (advertId) => {
    return apiRequest(`/featured-adverts/${advertId}`, {
      method: 'DELETE',
    });
  },

  getMyFeaturedAdverts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/featured-adverts/my-adverts?${queryParams}`);
  },

  // Banner integration endpoints
  getBannerAdverts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/featured-adverts/banners?${queryParams}`);
  },

  getHomepageSliderBanners: async (limit = 8) => {
    return apiRequest(`/featured-adverts/banners/homepage-slider?limit=${limit}`);
  },

  getCategoryBanners: async (categoryId, limit = 6) => {
    return apiRequest(`/featured-adverts/banners/category/${categoryId}?limit=${limit}`);
  },

  getCountryBanners: async (country, limit = 6) => {
    return apiRequest(`/featured-adverts/banners/country/${encodeURIComponent(country)}?limit=${limit}`);
  },

  getBannerAdvertsWithData: async () => {
    return apiRequest('/featured-adverts/banners/with-banner-data');
  },

  getBannerAnalytics: async (timeframe = '30days') => {
    return apiRequest(`/featured-adverts/banners/analytics?timeframe=${timeframe}`);
  },

  createBannerFromAdvert: async (advertId, bannerData) => {
    return apiRequest(`/featured-adverts/banners/from-featured/${advertId}`, {
      method: 'POST',
      body: JSON.stringify(bannerData),
    });
  },
};

// Admin API endpoints
export const adminFeaturedAdvertsAPI = {
  // List all featured adverts (admin)
  listAllAdverts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/featured-adverts?${queryParams}`);
  },

  // Create featured advert (admin)
  createAdvert: async (advertData) => {
    return apiRequest('/admin/featured-adverts', {
      method: 'POST',
      body: JSON.stringify(advertData),
    });
  },

  // Get advert details (admin)
  getAdvertDetails: async (advertId) => {
    return apiRequest(`/admin/featured-adverts/${advertId}`);
  },

  // Update advert (admin)
  updateAdvert: async (advertId, advertData) => {
    return apiRequest(`/admin/featured-adverts/${advertId}`, {
      method: 'PUT',
      body: JSON.stringify(advertData),
    });
  },

  // Delete advert (admin)
  deleteAdvert: async (advertId) => {
    return apiRequest(`/admin/featured-adverts/${advertId}`, {
      method: 'DELETE',
    });
  },

  // Bulk update adverts
  bulkUpdateAdverts: async (ids, updates) => {
    return apiRequest('/admin/featured-adverts/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ ids, updates }),
    });
  },

  // Approve advert
  approveAdvert: async (advertId) => {
    return apiRequest(`/admin/featured-adverts/${advertId}/approve`, {
      method: 'POST',
    });
  },

  // Reject advert
  rejectAdvert: async (advertId, reason) => {
    return apiRequest(`/admin/featured-adverts/${advertId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Get admin statistics
  getAdminStatistics: async () => {
    return apiRequest('/admin/featured-adverts/statistics');
  },

  // Export data
  exportData: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/admin/featured-adverts/export?${queryParams}`);
  },
};

export default featuredAdvertsAPI;
