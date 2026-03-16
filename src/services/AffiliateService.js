import api from "../api";

const affiliateService = {
  // 🏷️ Categories
  getCategories: async () => {
    try {
      const response = await api.get('/v1/affiliates/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 💼 Business Offers
  getBusinessOffers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/affiliates/business-offers?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getBusinessOffer: async (id) => {
    try {
      const response = await api.get(`/v1/affiliates/business-offers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createBusinessOffer: async (formData) => {
    try {
      const response = await api.post('/v1/affiliates/business-offers', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateBusinessOffer: async (id, formData) => {
    try {
      const response = await api.put(`/v1/affiliates/business-offers/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteBusinessOffer: async (id) => {
    try {
      const response = await api.delete(`/v1/affiliates/business-offers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 👤 User Affiliate Posts
  getUserPosts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/affiliates/user-posts?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserPost: async (id) => {
    try {
      const response = await api.get(`/v1/affiliates/user-posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createUserPost: async (formData) => {
    try {
      const response = await api.post('/v1/affiliates/user-posts', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUserPost: async (id, formData) => {
    try {
      const response = await api.put(`/v1/affiliates/user-posts/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteUserPost: async (id) => {
    try {
      const response = await api.delete(`/v1/affiliates/user-posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📊 Upsell Plans
  getUpsellPlans: async () => {
    try {
      const response = await api.get('/v1/affiliates/upsell-plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📝 Applications
  applyToBusinessOffer: async (offerId, applicationData) => {
    try {
      const response = await api.post(`/v1/affiliates/business-offers/${offerId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMyApplications: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/affiliates/my-applications?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 👤 User Content Management
  getMyBusinessOffers: async () => {
    try {
      const response = await api.get('/v1/affiliates/my-business-offers');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMyUserPosts: async () => {
    try {
      const response = await api.get('/v1/affiliates/my-user-posts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Search
  searchAffiliateContent: async (query, type = 'all') => {
    try {
      const response = await api.get(`/v1/affiliates/search?q=${encodeURIComponent(query)}&type=${type}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📈 Analytics Tracking
  trackClick: async (type, id) => {
    try {
      const response = await api.post('/v1/affiliates/track-click', { type, id });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📈 Analytics Data
  getAnalytics: async (type, id) => {
    try {
      const response = await api.get(`/v1/affiliates/analytics/${type}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔄 Upsell Management
  purchaseUpsell: async (postId, planId, paymentData) => {
    try {
      const response = await api.post('/v1/affiliates/purchase-upsell', {
        post_id: postId,
        plan_id: planId,
        ...paymentData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMyUpsells: async () => {
    try {
      const response = await api.get('/v1/affiliates/my-upsells');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // � File Upload
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/v1/affiliates/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadAsset: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/v1/affiliates/upload-asset', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // �📊 Statistics
  getPlatformStats: async () => {
    try {
      const response = await api.get('/v1/affiliates/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔄 Application Management
  updateApplication: async (id, status, notes = null) => {
    try {
      const response = await api.put(`/v1/affiliates/applications/${id}`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  respondToApplication: async (id, response) => {
    try {
      const apiResponse = await api.post(`/v1/affiliates/applications/${id}/respond`, {
        business_response: response
      });
      return apiResponse.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔐 Content Moderation
  moderateUserPost: async (id, status, notes = null) => {
    try {
      const response = await api.put(`/v1/affiliates/user-posts/${id}/moderate`, {
        status,
        moderation_notes: notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  moderateBusinessOffer: async (id, status, notes = null) => {
    try {
      const response = await api.put(`/v1/affiliates/business-offers/${id}/moderate`, {
        status,
        moderation_notes: notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📈 Advanced Analytics
  getAnalytics: async (type, id, filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/affiliates/analytics/${type}/${id}?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAnalyticsSummary: async (type = 'all', period = '30days') => {
    try {
      const response = await api.get(`/v1/affiliates/analytics-summary?type=${type}&period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 💳 Payment Processing
  processPayment: async (type, id, planId, paymentData) => {
    try {
      const response = await api.post('/v1/affiliates/payment', {
        type,
        id,
        plan_id: planId,
        ...paymentData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Advanced Search
  searchAffiliateContent: async (query, type = 'all', filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      params.append('type', type);
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/affiliates/search?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📋 Content Management
  duplicateBusinessOffer: async (id) => {
    try {
      const response = await api.post(`/v1/affiliates/business-offers/${id}/duplicate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  duplicateUserPost: async (id) => {
    try {
      const response = await api.post(`/v1/affiliates/user-posts/${id}/duplicate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📊 Export Data
  exportAnalytics: async (type, id, format = 'csv') => {
    try {
      const response = await api.get(`/v1/affiliates/analytics/${type}/${id}/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔔 Notifications
  getNotifications: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/affiliates/notifications?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  markNotificationRead: async (id) => {
    try {
      const response = await api.put(`/v1/affiliates/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🎯 Featured Content
  getFeaturedContent: async (type = 'all', limit = 10) => {
    try {
      const response = await api.get(`/v1/affiliates/featured?type=${type}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📍 Location-based Content
  getContentByLocation: async (country, region = null, filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('country', country);
      if (region) params.append('region', region);
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/affiliates/by-location?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📈 Trending Content
  getTrendingContent: async (type = 'all', period = '7days', limit = 20) => {
    try {
      const response = await api.get(`/v1/affiliates/trending?type=${type}&period=${period}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔄 Bulk Operations
  bulkUpdateStatus: async (type, ids, status) => {
    try {
      const response = await api.post('/v1/affiliates/bulk-update-status', {
        type,
        ids,
        status
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  bulkDelete: async (type, ids) => {
    try {
      const response = await api.post('/v1/affiliates/bulk-delete', {
        type,
        ids
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default affiliateService;
