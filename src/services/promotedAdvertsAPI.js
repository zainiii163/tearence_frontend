// Promoted Adverts API Service
// Handles all API calls for the Promoted Adverts system

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Promoted Adverts API
export const promotedAdvertsAPI = {
  // Get all promoted adverts with filtering
  getAdverts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/promoted-adverts?${queryString}`);
  },

  // Get single promoted advert by slug
  getAdvert: async (slug) => {
    return apiRequest(`/promoted-adverts/${slug}`);
  },

  // Create new promoted advert
  createAdvert: async (advertData) => {
    return apiRequest('/promoted-adverts', {
      method: 'POST',
      body: JSON.stringify(advertData),
    });
  },

  // Update promoted advert
  updateAdvert: async (id, advertData) => {
    return apiRequest(`/promoted-adverts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(advertData),
    });
  },

  // Delete promoted advert
  deleteAdvert: async (id) => {
    return apiRequest(`/promoted-adverts/${id}`, {
      method: 'DELETE',
    });
  },

  // Get featured promoted adverts
  getFeatured: async () => {
    return apiRequest('/promoted-adverts/featured');
  },

  // Get most viewed promoted adverts
  getMostViewed: async () => {
    return apiRequest('/promoted-adverts/most-viewed');
  },

  // Get most saved promoted adverts
  getMostSaved: async () => {
    return apiRequest('/promoted-adverts/most-saved');
  },

  // Get recent promoted adverts
  getRecent: async () => {
    return apiRequest('/promoted-adverts/recent');
  },

  // Track advert click
  trackClick: async (slug) => {
    return apiRequest(`/promoted-adverts/${slug}/track-click`, {
      method: 'POST',
    });
  },

  // Get promotion options
  getPromotionOptions: async () => {
    return apiRequest('/promoted-adverts/promotion-options');
  },

  // Get user's promoted adverts
  getMyAdverts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/promoted-adverts/my-adverts?${queryString}`);
  },

  // Upload images
  uploadImages: async (files) => {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('images[]', file);
    });

    const response = await fetch(`${API_BASE_URL}/promoted-adverts/upload-images`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload images');
    }

    return response.json();
  },

  // Upload logo
  uploadLogo: async (file) => {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('logo', file);

    const response = await fetch(`${API_BASE_URL}/promoted-adverts/upload-logo`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload logo');
    }

    return response.json();
  },

  // Toggle favorite
  toggleFavorite: async (id) => {
    return apiRequest(`/promoted-adverts/${id}/toggle-favorite`, {
      method: 'POST',
    });
  },
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    return apiRequest('/promoted-advert-categories');
  },

  // Get popular categories
  getPopular: async () => {
    return apiRequest('/promoted-advert-categories/popular');
  },

  // Get category details by slug
  getCategory: async (slug) => {
    return apiRequest(`/promoted-advert-categories/${slug}`);
  },

  // Get category adverts
  getCategoryAdverts: async (slug, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/promoted-advert-categories/${slug}/adverts?${queryString}`);
  },

  // Create category (admin only)
  createCategory: async (categoryData) => {
    return apiRequest('/promoted-advert-categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Update category (admin only)
  updateCategory: async (id, categoryData) => {
    return apiRequest(`/promoted-advert-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Delete category (admin only)
  deleteCategory: async (id) => {
    return apiRequest(`/promoted-advert-categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminAPI = {
  // Get dashboard analytics
  getDashboard: async () => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/promoted-adverts/dashboard`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/promoted-adverts/${id}/analytics`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/promoted-adverts/bulk-approve`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/promoted-adverts/bulk-reject`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/promoted-adverts/bulk-feature`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/promoted-adverts/export?${queryString}`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/promoted-adverts/system-health`, {
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
    const response = await fetch(`${API_BASE_URL}/admin/promoted-adverts/promotion-report`, {
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

    if (!data.description?.trim()) {
      errors.description = 'Description is required';
    }

    if (!data.advert_type) {
      errors.advert_type = 'Advert type is required';
    }

    if (!data.country?.trim()) {
      errors.country = 'Country is required';
    }

    if (!data.seller_name?.trim()) {
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
