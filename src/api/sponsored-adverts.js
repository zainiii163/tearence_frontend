import axios from 'axios';

// API base configuration - use same as main api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info/api/v1';

// Create axios instance with default configuration
const sponsoredApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // CORS configuration
  withCredentials: false, // Don't send credentials for cross-origin requests
  crossdomain: true, // Enable cross-domain requests
  mode: 'cors' // Explicitly set CORS mode
});

// Request interceptor to add auth token
sponsoredApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
sponsoredApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      console.error('Access denied: insufficient permissions');
    }
    return Promise.reject(error);
  }
);

// Public API endpoints
export const sponsoredAdvertsAPI = {
  // Browse sponsored adverts with filtering
  browse: async (params = {}) => {
    try {
      const response = await sponsoredApi.get('/sponsored-adverts', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get single sponsored advert by slug
  getSingle: async (slug) => {
    try {
      const response = await sponsoredApi.get(`/sponsored-adverts/${slug}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get featured sponsored adverts
  getFeatured: async (limit = 10) => {
    try {
      const response = await sponsoredApi.get('/sponsored-adverts/featured', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get trending sponsored adverts
  getTrending: async (limit = 20) => {
    try {
      const response = await sponsoredApi.get('/sponsored-adverts/trending', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get adverts by category
  getByCategory: async (category, params = {}) => {
    try {
      const response = await sponsoredApi.get(`/sponsored-adverts/category/${category}`, {
        params
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get adverts by country
  getByCountry: async (country, params = {}) => {
    try {
      const response = await sponsoredApi.get(`/sponsored-adverts/country/${country}`, {
        params
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Submit inquiry for sponsored advert
  submitInquiry: async (advertId, inquiryData) => {
    try {
      const response = await sponsoredApi.post(`/sponsored-adverts/${advertId}/inquiry`, inquiryData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get system statistics
  getStatistics: async () => {
    try {
      const response = await sponsoredApi.get('/sponsored-adverts/statistics');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Authenticated API endpoints
export const sponsoredAdvertsAuthAPI = {
  // Create sponsored advert
  create: async (advertData) => {
    try {
      const response = await sponsoredApi.post('/sponsored-adverts', advertData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update sponsored advert
  update: async (id, advertData) => {
    try {
      const response = await sponsoredApi.put(`/sponsored-adverts/${id}`, advertData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete sponsored advert
  delete: async (id) => {
    try {
      const response = await sponsoredApi.delete(`/sponsored-adverts/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Pricing plans API
export const pricingPlansAPI = {
  // Get all pricing plans
  getAll: async (params = {}) => {
    try {
      const response = await sponsoredApi.get('/sponsored-pricing-plans', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get plan comparison
  getComparison: async () => {
    try {
      const response = await sponsoredApi.get('/sponsored-pricing-plans/comparison');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get AI-powered recommendation
  getRecommendation: async (criteria) => {
    try {
      const response = await sponsoredApi.post('/sponsored-pricing-plans/recommendation', criteria);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get plan by tier
  getByTier: async (tier) => {
    try {
      const response = await sponsoredApi.get(`/sponsored-pricing-plans/tier/${tier}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get featured plans
  getFeatured: async () => {
    try {
      const response = await sponsoredApi.get('/sponsored-pricing-plans/featured');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Admin API endpoints
export const sponsoredAdvertsAdminAPI = {
  // Get admin dashboard
  getDashboard: async () => {
    try {
      const response = await sponsoredApi.get('/admin/sponsored-adverts/dashboard');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // List all adverts (admin view)
  listAll: async (params = {}) => {
    try {
      const response = await sponsoredApi.get('/admin/sponsored-adverts', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Approve advert
  approve: async (id) => {
    try {
      const response = await sponsoredApi.post(`/admin/sponsored-adverts/${id}/approve`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Reject advert
  reject: async (id, reason) => {
    try {
      const response = await sponsoredApi.post(`/admin/sponsored-adverts/${id}/reject`, {
        rejection_reason: reason
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Toggle active status
  toggleActive: async (id) => {
    try {
      const response = await sponsoredApi.post(`/admin/sponsored-adverts/${id}/toggle-active`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update sponsored tier
  updateTier: async (id, tier) => {
    try {
      const response = await sponsoredApi.post(`/admin/sponsored-adverts/${id}/update-tier`, {
        sponsored_tier: tier
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get advert analytics
  getAnalytics: async (id) => {
    try {
      const response = await sponsoredApi.get(`/admin/sponsored-adverts/${id}/analytics`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Bulk approve
  bulkApprove: async (advertIds) => {
    try {
      const response = await sponsoredApi.post('/admin/sponsored-adverts/bulk-approve', {
        advert_ids: advertIds
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Bulk reject
  bulkReject: async (advertIds, reason) => {
    try {
      const response = await sponsoredApi.post('/admin/sponsored-adverts/bulk-reject', {
        advert_ids: advertIds,
        rejection_reason: reason
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Export data
  export: async (params = {}) => {
    try {
      const response = await sponsoredApi.get('/admin/sponsored-adverts/export', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get promotion report
  getPromotionReport: async (startDate, endDate) => {
    try {
      const response = await sponsoredApi.get('/admin/sponsored-adverts/promotion-report', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // System health check
  getSystemHealth: async () => {
    try {
      const response = await sponsoredApi.get('/admin/sponsored-adverts/system-health');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

// Analytics tracking
export const analyticsAPI = {
  // Track event
  trackEvent: async (advertId, eventType, metadata = {}) => {
    try {
      const response = await sponsoredApi.post('/analytics/track-event', {
        advert_id: advertId,
        event_type: eventType,
        ...metadata
      });
      return response.data;
    } catch (error) {
      // Silently fail for analytics to not disrupt user experience
      console.warn('Analytics tracking failed:', error);
      return null;
    }
  },

  // Track view
  trackView: async (advertId) => {
    return analyticsAPI.trackEvent(advertId, 'view');
  },

  // Track click
  trackClick: async (advertId) => {
    return analyticsAPI.trackEvent(advertId, 'click');
  },

  // Track save
  trackSave: async (advertId) => {
    return analyticsAPI.trackEvent(advertId, 'save');
  },

  // Track inquiry
  trackInquiry: async (advertId) => {
    return analyticsAPI.trackEvent(advertId, 'inquiry');
  },

  // Track share
  trackShare: async (advertId) => {
    return analyticsAPI.trackEvent(advertId, 'share');
  }
};

// Utility functions
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new Error(data.message || 'Bad request');
      case 401:
        return new Error('Unauthorized - Please login again');
      case 403:
        return new Error('Access denied - insufficient permissions');
      case 404:
        return new Error('Resource not found');
      case 422:
        // Validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          return new Error(errorMessages.join(', '));
        }
        return new Error(data.message || 'Validation failed');
      case 429:
        return new Error('Too many requests - please try again later');
      case 500:
        return new Error('Server error - please try again later');
      default:
        return new Error(data.message || `Request failed with status ${status}`);
    }
  } else if (error.request) {
    // Network error
    return new Error('Network error - please check your connection');
  } else {
    // Other error
    return new Error(error.message || 'An unexpected error occurred');
  }
};

// File upload helper
export const uploadFile = async (file, type = 'image') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  try {
    const response = await sponsoredApi.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Multiple file upload helper
export const uploadMultipleFiles = async (files, type = 'image') => {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });
  formData.append('type', type);

  try {
    const response = await sponsoredApi.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Search helper with debouncing
export const createSearchHelper = (searchFunction, delay = 300) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await searchFunction(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

// Pagination helper
export const loadPage = async (currentPage, loadFunction, params = {}) => {
  try {
    const result = await loadFunction({
      ...params,
      page: currentPage,
      per_page: params.per_page || 12
    });
    return result;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Infinite scroll helper
export const loadMore = async (currentPage, loadFunction, params = {}) => {
  try {
    const result = await loadFunction({
      ...params,
      page: currentPage + 1,
      per_page: params.per_page || 12
    });
    return result;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Cache helper for API responses
class ApiCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

export const apiCache = new ApiCache();

// Cached API calls
export const cachedAPI = {
  // Cached pricing plans
  getPricingPlans: async () => {
    const cacheKey = 'pricing_plans';
    let data = apiCache.get(cacheKey);
    
    if (!data) {
      data = await pricingPlansAPI.getAll();
      apiCache.set(cacheKey, data);
    }
    
    return data;
  },

  // Cached statistics
  getStatistics: async () => {
    const cacheKey = 'sponsored_statistics';
    let data = apiCache.get(cacheKey);
    
    if (!data) {
      data = await sponsoredAdvertsAPI.getStatistics();
      apiCache.set(cacheKey, data);
    }
    
    return data;
  },

  // Clear cache
  clearCache: () => {
    apiCache.clear();
  }
};

// Export default API object
export default {
  public: sponsoredAdvertsAPI,
  auth: sponsoredAdvertsAuthAPI,
  pricing: pricingPlansAPI,
  admin: sponsoredAdvertsAdminAPI,
  analytics: analyticsAPI,
  utils: {
    uploadFile,
    uploadMultipleFiles,
    createSearchHelper,
    loadPage,
    loadMore,
    cache: cachedAPI
  }
};
