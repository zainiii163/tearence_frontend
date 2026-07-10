import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

// Get auth token
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Services API
export const servicesAPI = {
  // Get all services with filters
  getServices: async (params = {}) => {
    try {
      const config = getAuthConfig();
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_BASE_URL}/services?${queryParams}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single service
  getService: async (serviceId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/services/${serviceId}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new service
  createService: async (serviceData) => {
    try {
      const config = getAuthConfig();
      const response = await axios.post(`${API_BASE_URL}/services`, serviceData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update service
  updateService: async (serviceId, serviceData) => {
    try {
      const config = getAuthConfig();
      const response = await axios.put(`${API_BASE_URL}/services/${serviceId}`, serviceData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete service
  deleteService: async (serviceId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.delete(`${API_BASE_URL}/services/${serviceId}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's services
  getMyServices: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/services/my-services`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Toggle service status
  toggleServiceStatus: async (serviceId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.post(`${API_BASE_URL}/services/${serviceId}/toggle-status`, {}, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Increment enquiries
  incrementEnquiries: async (serviceId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.post(`${API_BASE_URL}/services/${serviceId}/enquiries`, {}, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured services
  getFeaturedServices: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/services/featured`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get popular services
  getPopularServices: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/services/popular`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getCategories: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/categories`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single category
  getCategory: async (categoryId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get category services
  getCategoryServices: async (categorySlug) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/categories/${categorySlug}/services`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Reviews API
export const reviewsAPI = {
  // Get service reviews
  getServiceReviews: async (serviceId, params = {}) => {
    try {
      const config = getAuthConfig();
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_BASE_URL}/reviews/service/${serviceId}?${queryParams}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create review
  createReview: async (serviceId, reviewData) => {
    try {
      const config = getAuthConfig();
      const response = await axios.post(`${API_BASE_URL}/reviews/service/${serviceId}`, reviewData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    try {
      const config = getAuthConfig();
      const response = await axios.put(`${API_BASE_URL}/reviews/${reviewId}`, reviewData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Promotions API
export const promotionsAPI = {
  // Get promotion tiers
  getPromotionTiers: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/promotions/tiers`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Calculate promotion total
  calculateTotal: async (promotionData) => {
    try {
      const config = getAuthConfig();
      const response = await axios.post(`${API_BASE_URL}/promotions/calculate-total`, promotionData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Purchase promotion
  purchasePromotion: async (promotionData) => {
    try {
      const config = getAuthConfig();
      const response = await axios.post(`${API_BASE_URL}/promotions/purchase`, promotionData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user promotions
  getMyPromotions: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/promotions/my-promotions`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel promotion
  cancelPromotion: async (promotionId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.post(`${API_BASE_URL}/promotions/${promotionId}/cancel`, {}, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Search API
export const searchAPI = {
  // Search services
  searchServices: async (params = {}) => {
    try {
      const config = getAuthConfig();
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`${API_BASE_URL}/search/services?${queryParams}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get search suggestions
  getSuggestions: async (query) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/search/suggestions?q=${encodeURIComponent(query)}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get popular services
  getPopularServices: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/search/popular`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get trending services
  getTrendingServices: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/search/trending`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Analytics API
export const analyticsAPI = {
  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get provider analytics
  getProviderAnalytics: async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/analytics/provider`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get service analytics
  getServiceAnalytics: async (serviceId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/analytics/service/${serviceId}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// File Upload API
export const uploadAPI = {
  // Upload service media
  uploadServiceMedia: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      const response = await axios.post(`${API_BASE_URL}/upload/service-media`, formData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload avatar
  uploadAvatar: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      const response = await axios.post(`${API_BASE_URL}/upload/avatar`, formData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get file info
  getFileInfo: async (fileId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/upload/${fileId}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete file
  deleteFile: async (fileId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.delete(`${API_BASE_URL}/upload/${fileId}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Provider API
export const providerAPI = {
  // Get provider details
  getProvider: async (providerId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/providers/${providerId}`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get provider services
  getProviderServices: async (providerId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/providers/${providerId}/services`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get provider reviews
  getProviderReviews: async (providerId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/providers/${providerId}/reviews`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Follow provider
  followProvider: async (providerId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.post(`${API_BASE_URL}/providers/${providerId}/follow`, {}, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Unfollow provider
  unfollowProvider: async (providerId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.delete(`${API_BASE_URL}/providers/${providerId}/follow`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get provider followers
  getProviderFollowers: async (providerId) => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${API_BASE_URL}/providers/${providerId}/followers`, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default {
  servicesAPI,
  categoriesAPI,
  reviewsAPI,
  promotionsAPI,
  searchAPI,
  analyticsAPI,
  uploadAPI,
  providerAPI
};
