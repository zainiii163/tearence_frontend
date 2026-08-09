// Promoted Adverts API Service — uses shared local/prod api client (api/v1 base)
import api from '../api';

const toPath = (endpoint = '') => {
  let path = String(endpoint);
  if (path.startsWith('/v1/')) path = path.slice(3);
  else if (path.startsWith('v1/')) path = `/${path.slice(2)}`;
  return path.startsWith('/') ? path : `/${path}`;
};

const apiRequest = async (endpoint, options = {}) => {
  const method = String(options.method || 'GET').toLowerCase();
  let data = options.body;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      /* keep string */
    }
  }

  try {
    const response = await api.request({
      url: toPath(endpoint),
      method,
      data: method === 'get' || method === 'head' ? undefined : data,
      headers: options.headers,
    });
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Request failed';
    console.error('API Request Error:', error);
    throw new Error(message);
  }
};

// Used by admin helpers below that still call fetch directly
const API_BASE_URL =
  (process.env.REACT_APP_API_URL || '').replace(/\/v1\/?$/, '') ||
  'http://127.0.0.1:8000/api';

// Promoted Adverts API
export const promotedAdvertsAPI = {
  // Get all promoted adverts with filtering
  getAdverts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/v1/promoted-adverts?${queryString}`);
  },

  // Get single promoted advert by slug
  getAdvert: async (slug) => {
    return apiRequest(`/v1/promoted-adverts/${slug}`);
  },

  // Create new promoted advert
  createAdvert: async (advertData) => {
    return apiRequest('/v1/promoted-adverts', {
      method: 'POST',
      body: JSON.stringify(advertData),
    });
  },

  // Update promoted advert
  updateAdvert: async (id, advertData) => {
    return apiRequest(`/v1/promoted-adverts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(advertData),
    });
  },

  // Delete promoted advert
  deleteAdvert: async (id) => {
    return apiRequest(`/v1/promoted-adverts/${id}`, {
      method: 'DELETE',
    });
  },

  // Get featured promoted adverts
  getFeatured: async () => {
    return apiRequest('/v1/promoted-adverts/featured');
  },

  // Cross-category promoted feed
  getSiteFeed: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/v1/promoted-adverts/site-feed?${queryString}`);
  },

  getTrendingTopics: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/v1/promoted-adverts/trending-topics?${queryString}`);
  },

  // Get most viewed promoted adverts
  getMostViewed: async () => {
    return apiRequest('/v1/promoted-adverts/most-viewed');
  },

  // Get most saved promoted adverts
  getMostSaved: async () => {
    return apiRequest('/v1/promoted-adverts/most-saved');
  },

  // Get recent promoted adverts
  getRecent: async () => {
    return apiRequest('/v1/promoted-adverts/recent');
  },

  // Track advert click
  trackClick: async (slug) => {
    return apiRequest(`/v1/promoted-adverts/${slug}/track-click`, {
      method: 'POST',
    });
  },

  // Get promotion options
  getPromotionOptions: async () => {
    return apiRequest('/v1/promoted-adverts/promotion-options');
  },

  // Get user's promoted adverts
  getMyAdverts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/v1/promoted-adverts/my-adverts?${queryString}`);
  },

  // Upload images
  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images[]', file);
    });
    const response = await api.post('/promoted-adverts/upload-images', formData);
    return response.data;
  },

  // Upload logo
  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await api.post('/promoted-adverts/upload-logo', formData);
    return response.data;
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    return apiRequest(`/v1/promoted-adverts/${id}/toggle-favorite`, {
      method: 'POST',
    });
  },

  // Get statistics
  getStatistics: async () => {
    return apiRequest('/v1/promoted-adverts/statistics');
  },

  // Get live activity
  getLiveActivity: async () => {
    return apiRequest('/v1/promoted-adverts/live-activity');
  },

  // Get trending countries
  getTrendingCountries: async () => {
    return apiRequest('/v1/promoted-adverts/trending-countries');
  },

  // Get trending categories
  getTrendingCategories: async () => {
    return apiRequest('/v1/promoted-adverts/trending-categories');
  },
};


// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    return apiRequest('/v1/promoted-advert-categories');
  },

  // Get popular categories
  getPopular: async () => {
    return apiRequest('/v1/promoted-advert-categories/popular');
  },

  // Get category details by slug
  getCategory: async (slug) => {
    return apiRequest(`/v1/promoted-advert-categories/${slug}`);
  },

  // Get category adverts
  getCategoryAdverts: async (slug, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/v1/promoted-advert-categories/${slug}/adverts?${queryString}`);
  },

  // Create category (admin only)
  createCategory: async (categoryData) => {
    return apiRequest('/v1/promoted-advert-categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Update category (admin only)
  updateCategory: async (id, categoryData) => {
    return apiRequest(`/v1/promoted-advert-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Delete category (admin only)
  deleteCategory: async (id) => {
    return apiRequest(`/v1/promoted-advert-categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminAPI = {
  // Get dashboard analytics
  getDashboard: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/v1/admin/promoted-adverts/dashboard`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get dashboard data');
    }

    return response.json();
  },

  // Get advert analytics
  getAdvertAnalytics: async (id) => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/v1/admin/promoted-adverts/${id}/analytics`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get advert analytics');
    }

    return response.json();
  },

  // Bulk approve adverts
  bulkApprove: async (advertIds) => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/v1/admin/promoted-adverts/bulk-approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ advert_ids: advertIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to bulk approve adverts');
    }

    return response.json();
  },

  // Bulk reject adverts
  bulkReject: async (advertIds, reason) => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/v1/admin/promoted-adverts/bulk-reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ advert_ids: advertIds, reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to bulk reject adverts');
    }

    return response.json();
  },

  // Bulk feature adverts
  bulkFeature: async (advertIds) => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/v1/admin/promoted-adverts/bulk-feature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ advert_ids: advertIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to bulk feature adverts');
    }

    return response.json();
  },

  // Export adverts data
  exportData: async (params = {}) => {
    const token = localStorage.getItem('admin_token');
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/v1/admin/promoted-adverts/export?${queryString}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export data');
    }

    return response.json();
  },

  // System health check
  systemHealth: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/v1/admin/promoted-adverts/system-health`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get system health');
    }

    return response.json();
  },

  // Promotion performance report
  promotionReport: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/v1/admin/promoted-adverts/promotion-report`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get promotion report');
    }

    return response.json();
  },
};

// Utility functions
export const promotedAdvertsUtils = {
  // Format price for display
  formatPrice: (price, currency = 'GBP') => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(price);
  },

  // Format date for display
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Get promotion tier display name
  getPromotionTierDisplay: (tier) => {
    const tierMap = {
      'promoted_basic': 'Promoted Basic',
      'promoted_plus': 'Promoted Plus',
      'promoted_premium': 'Promoted Premium',
      'network_wide_boost': 'Network-Wide Boost',
    };
    return tierMap[tier] || 'Standard';
  },

  // Get promotion tier color
  getPromotionTierColor: (tier) => {
    const colorMap = {
      'promoted_basic': 'gray',
      'promoted_plus': 'blue',
      'promoted_premium': 'purple',
      'network_wide_boost': 'gold',
    };
    return colorMap[tier] || 'gray';
  },

  // Validate advert data
  validateAdvertData: (data) => {
    const errors = {};

    if (!data.title?.trim()) {
      errors.title = 'Title is required';
    }

    // Check description fields (overview, keyFeatures, specialFeatures, additionalNotes)
    const hasDescriptionContent = 
      (data.overview?.trim() || '') ||
      (data.keyFeatures?.trim() || '') ||
      (data.specialFeatures?.trim() || '') ||
      (data.additionalNotes?.trim() || '');
    
    if (!hasDescriptionContent) {
      errors.description = 'Description is required';
    }

    if (!data.advertType) {
      errors.advert_type = 'Advert type is required';
    }

    if (!data.country?.trim()) {
      errors.country = 'Country is required';
    }

    if (!data.sellerName?.trim()) {
      errors.seller_name = 'Seller name is required';
    }

    if (!data.phone?.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!data.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email is invalid';
    }

    if (data.price && (isNaN(data.price) || parseFloat(data.price) < 0)) {
      errors.price = 'Price must be a valid positive number';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Generate slug from title
  generateSlug: (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },
};

export default promotedAdvertsAPI;
