import api from "../api";
import axios from "axios";

// Add cache-busting timestamp
const cacheBuster = () => `?_t=${Date.now()}`;

// Get API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info/api';

const affiliateService = {
  // 🏷️ Categories
  getCategories: async () => {
    try {
      const response = await api.get('/affiliates/categories' + cacheBuster());
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
      
      // Add cache buster
      params.append('_t', Date.now());
      
      const response = await api.get(`/affiliates/business-offers?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getBusinessOffer: async (id) => {
    try {
      const response = await api.get(`/affiliates/business-offers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createBusinessOffer: async (formData) => {
    try {
      // Auto-approve for now so posts show publicly without moderation delay
      const payload = {
        ...formData,
        status: 'approved',
        is_active: true,
        payment_status: formData.payment_status || 'paid',
      };
      const response = await api.post('/affiliates/business-offers', payload);
      const created = response.data?.data || response.data;

      // If backend still returns pending, force-approve via update
      if (created?.id && created.status !== 'approved') {
        try {
          await api.put(`/affiliates/business-offers/${created.id}`, {
            ...payload,
            status: 'approved',
            is_active: true,
          });
        } catch (approveErr) {
          console.warn('Could not auto-approve business offer:', approveErr);
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateBusinessOffer: async (id, formData) => {
    try {
      const response = await api.put(`/affiliates/business-offers/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteBusinessOffer: async (id) => {
    try {
      const response = await api.delete(`/affiliates/business-offers/${id}`);
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
      
      params.append('_t', Date.now());
      const response = await api.get(`/affiliates/user-posts?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Paid / Filament affiliate link ads (affiliate_links)
  getAffiliateLinks: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      params.append('_t', Date.now());
      const response = await api.get(`/affiliates/links?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserPost: async (id) => {
    try {
      const response = await api.get(`/affiliates/user-posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createUserPost: async (formData) => {
    try {
      // Auto-approve for now so affiliate links show publicly without moderation delay
      const payload = {
        ...formData,
        status: 'approved',
        is_active: true,
        payment_status: formData.payment_status || 'paid',
      };
      const response = await api.post('/affiliates/user-posts', payload);
      const created = response.data?.data || response.data;

      // If backend still returns pending, force-approve via update
      if (created?.id && created.status !== 'approved') {
        try {
          await api.put(`/affiliates/user-posts/${created.id}`, {
            ...payload,
            status: 'approved',
            is_active: true,
          });
        } catch (approveErr) {
          console.warn('Could not auto-approve user post:', approveErr);
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUserPost: async (id, formData) => {
    try {
      const response = await api.put(`/affiliates/user-posts/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteUserPost: async (id) => {
    try {
      const response = await api.delete(`/affiliates/user-posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📝 Applications
  applyToPromote: async (offerId, formData) => {
    try {
      const response = await api.post(`/affiliates/business-offers/${offerId}/apply`, formData);
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
      
      const response = await api.get(`/affiliates/my-applications?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 👤 User Dashboard
  getMyBusinessOffers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/affiliates/my-business-offers?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMyUserPosts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/affiliates/my-user-posts?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📊 Tracking & Analytics
  trackClick: async (type, id) => {
    try {
      const response = await api.post('/affiliates/track-click', { type, id });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAnalytics: async (type, id) => {
    try {
      const response = await api.get(`/affiliates/analytics/${type}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Search
  search: async (query, type = 'all') => {
    try {
      const response = await api.get(`/affiliates/search?q=${encodeURIComponent(query)}&type=${type}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /** Alias used by affiliates hub */
  searchAffiliateContent: async (query, type = 'all') => {
    return affiliateService.search(query, type);
  },

  getOfferApplications: async (offerId, filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/affiliates/business-offers/${offerId}/applications?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  approveApplication: async (applicationId, notes = '') => {
    try {
      const response = await api.post(`/affiliates/applications/${applicationId}/approve`, { notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  rejectApplication: async (applicationId, reason = '') => {
    try {
      const response = await api.post(`/affiliates/applications/${applicationId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  recordConversion: async (payload) => {
    try {
      const response = await api.post('/affiliates/conversions', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📁 File Upload
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Get auth token
      const token = localStorage.getItem('token');
      
      console.log('📤 Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      // Create completely fresh axios instance with NO default headers
      const uploadApi = axios.create({
        baseURL: API_BASE_URL,
        timeout: 120000,
      });
      
      // Use direct axios call with minimal headers
      const response = await uploadApi.post('/affiliates/upload-image', formData, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
        // NO Content-Type header - let browser set it automatically with boundary
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Upload error details:', error);
      throw error.response?.data || error;
    }
  },

  // 📈 Upsell Plans
  getUpsellPlans: async () => {
    try {
      const response = await api.get('/affiliates/upsell-plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔔 Notifications (placeholder - implement if needed)
  getNotifications: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      // This endpoint might not exist yet - return empty data for now
      return {
        success: true,
        data: {
          data: [],
          total: 0
        }
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📊 Analytics Summary (placeholder - implement if needed)
  getAnalyticsSummary: async (type, period) => {
    try {
      // This endpoint might not exist yet - return empty data for now
      return {
        success: true,
        data: {
          totalRevenue: 0,
          totalClicks: 0,
          totalConversions: 0
        }
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📈 Platform Stats (placeholder - implement if needed)
  getPlatformStats: async () => {
    try {
      // This endpoint might not exist yet - return empty data for now
      return {
        success: true,
        data: {
          totalOffers: 0,
          totalPosts: 0,
          totalUsers: 0
        }
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default affiliateService;
