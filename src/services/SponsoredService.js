import api from "../api";

const sponsoredService = {
  // 🎯 Get all sponsored adverts
  getSponsoredAdverts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/sponsored/adverts?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Get single sponsored advert
  getSponsoredAdvert: async (id) => {
    try {
      const response = await api.get(`/v1/sponsored/adverts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📝 Create new sponsored advert
  createSponsoredAdvert: async (formData) => {
    try {
      const response = await api.post('/v1/sponsored/adverts', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ✏️ Update sponsored advert
  updateSponsoredAdvert: async (id, formData) => {
    try {
      const response = await api.put(`/v1/sponsored/adverts/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🗑️ Delete sponsored advert
  deleteSponsoredAdvert: async (id) => {
    try {
      const response = await api.delete(`/v1/sponsored/adverts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📂 Get sponsored categories
  getSponsoredCategories: async () => {
    try {
      const response = await api.get('/v1/sponsored/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🏢 Get seller profile
  getSellerProfile: async (sellerId) => {
    try {
      const response = await api.get(`/v1/sponsored/sellers/${sellerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 💬 Contact seller
  contactSeller: async (sellerId, messageData) => {
    try {
      const response = await api.post(`/v1/sponsored/sellers/${sellerId}/contact`, messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🎯 Get featured sponsored adverts
  getFeaturedSponsored: async () => {
    try {
      const response = await api.get('/v1/sponsored/adverts/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔥 Get trending sponsored adverts
  getTrendingSponsored: async () => {
    try {
      const response = await api.get('/v1/sponsored/adverts/trending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📊 Get platform statistics
  getPlatformStats: async () => {
    try {
      const response = await api.get('/v1/sponsored/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Search sponsored adverts
  searchSponsoredAdverts: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      // Add additional filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/sponsored/search?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 💰 Get upsell plans
  getUpsellPlans: async () => {
    try {
      const response = await api.get('/v1/sponsored/upsell-plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🚀 Purchase upsell for sponsored advert
  purchaseUpsell: async (advertId, planId) => {
    try {
      const response = await api.post(`/v1/sponsored/adverts/${advertId}/upsell`, { plan_id: planId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📈 Get advert statistics
  getAdvertStats: async (advertId) => {
    try {
      const response = await api.get(`/v1/sponsored/adverts/${advertId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🌍 Get countries
  getCountries: async () => {
    try {
      const response = await api.get('/v1/sponsored/countries');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🌆 Get cities by country
  getCities: async (countryCode) => {
    try {
      const response = await api.get(`/v1/sponsored/countries/${countryCode}/cities`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ❤️ Save/unsave sponsored advert
  saveSponsoredAdvert: async (advertId) => {
    try {
      const response = await api.post(`/v1/sponsored/adverts/${advertId}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ❌ Unsave sponsored advert
  unsaveSponsoredAdvert: async (advertId) => {
    try {
      const response = await api.delete(`/v1/sponsored/adverts/${advertId}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📤 Share sponsored advert
  shareSponsoredAdvert: async (advertId, shareData) => {
    try {
      const response = await api.post(`/v1/sponsored/adverts/${advertId}/share`, shareData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📊 Get live activity feed
  getLiveActivity: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/sponsored/activity?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🏆 Get top sellers
  getTopSellers: async () => {
    try {
      const response = await api.get('/v1/sponsored/sellers/top');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default sponsoredService;
