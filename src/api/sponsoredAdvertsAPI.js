import api from "../api";

const sponsoredAdvertsAPI = {
  // ==================== PUBLIC ENDPOINTS (No Auth Required) ====================
  
  // Get all sponsored adverts with filtering and pagination
  getSponsoredAdverts: async (params = {}) => {
    try {
      const response = await api.get('/sponsored-adverts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sponsored adverts:', error);
      throw error;
    }
  },

  // Get sponsored advert details by slug
  getSponsoredAdvert: async (slug) => {
    try {
      const response = await api.get(`/sponsored-adverts/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sponsored advert details:', error);
      throw error;
    }
  },

  // Get featured sponsored adverts
  getFeaturedAdverts: async () => {
    try {
      const response = await api.get('/sponsored-adverts/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured sponsored adverts:', error);
      throw error;
    }
  },

  // Cross-category sponsored feed (vehicles, property, events, etc.)
  getSiteFeed: async (params = {}) => {
    try {
      const response = await api.get('/sponsored-adverts/site-feed', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sponsored site feed:', error);
      throw error;
    }
  },

  getTrendingTopics: async (params = {}) => {
    try {
      const response = await api.get('/sponsored-adverts/trending-topics', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      throw error;
    }
  },

  // Get platform statistics
  getStatistics: async () => {
    try {
      const response = await api.get('/sponsored-adverts/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Get categories with counts
  getCategories: async () => {
    try {
      const response = await api.get('/sponsored-adverts/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get trending categories
  getTrendingCategories: async () => {
    try {
      const response = await api.get('/sponsored-adverts/trending-categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching trending categories:', error);
      throw error;
    }
  },

  // Get pricing plans
  getPricingPlans: async () => {
    try {
      const response = await api.get('/sponsored-adverts/pricing-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      throw error;
    }
  },

  // Track view for sponsored advert
  trackView: async (id) => {
    try {
      if (!id) {
        console.warn('No ID provided for trackView');
        return null;
      }
      const response = await api.post(`/sponsored-adverts/${id}/track-view`);
      return response.data;
    } catch (error) {
      console.error('Error tracking view:', error);
      // Silently fail for analytics tracking
      return null;
    }
  },

  // ==================== AUTHENTICATED ENDPOINTS (Auth Required) ====================
  
  // Create new sponsored advert
  createSponsoredAdvert: async (formData) => {
    try {
      // Don't set Content-Type - let browser set it automatically with boundary
      const response = await api.post('/sponsored-adverts', formData);
      return response.data;
    } catch (error) {
      console.error('Error creating sponsored advert:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Update sponsored advert
  updateSponsoredAdvert: async (id, formData) => {
    try {
      const advertId = id?.sponsored_advert_id ?? id?.id ?? id;
      if (!advertId) {
        throw new Error('Invalid sponsored advert ID');
      }
      const response = await api.put(`/sponsored-adverts/${advertId}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating sponsored advert:', error);
      throw error;
    }
  },

  // Delete sponsored advert
  deleteSponsoredAdvert: async (id) => {
    try {
      const advertId = id?.sponsored_advert_id ?? id?.id ?? id;
      if (!advertId) {
        throw new Error('Invalid sponsored advert ID');
      }
      const response = await api.delete(`/sponsored-adverts/${advertId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting sponsored advert:', error);
      throw error;
    }
  },

  // Update sponsored advert status (active / paused)
  updateStatus: async (id, status) => {
    try {
      const advertId = id?.sponsored_advert_id ?? id?.id ?? id;
      if (!advertId) {
        throw new Error('Invalid sponsored advert ID');
      }
      const isActive = status === 'active';
      const response = await api.patch(`/sponsored-adverts/${advertId}/status`, {
        status,
        is_active: isActive,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating sponsored advert status:', error);
      throw error;
    }
  },

  // Get user's sponsored adverts
  getMyAdverts: async () => {
    try {
      const response = await api.get('/sponsored-adverts/my-adverts');
      return response.data;
    } catch (error) {
      if (error?.status !== 404 && error?.response?.status !== 404 && !error?.silent) {
        console.error('Error fetching my adverts:', error);
      }
      throw error;
    }
  },

  // Save/Unsave sponsored advert
  saveAdvert: async (id) => {
    try {
      const response = await api.post(`/sponsored-adverts/${id}/save`);
      return response.data;
    } catch (error) {
      console.error('Error saving advert:', error);
      throw error;
    }
  },

  // Upload image
  uploadImage: async (formData) => {
    try {
      const response = await api.post('/sponsored-adverts/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Process payment for sponsored advert
  processPayment: async (id, paymentData) => {
    try {
      const response = await api.post(`/sponsored-adverts/${id}/payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },
};

export default sponsoredAdvertsAPI;
