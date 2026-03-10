// Upsells API Service
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Upsells API endpoints
export const upsellsAPI = {
  // Get all available promotion tiers
  getPromotionTiers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/promotion-tiers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion tiers:', error);
      throw error;
    }
  },

  // Get promotion tier by ID
  getPromotionTierById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/promotion-tiers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion tier:', error);
      throw error;
    }
  },

  // Create promotion order (requires authentication)
  createPromotionOrder: async (orderData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/upsells/orders`, orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating promotion order:', error);
      throw error;
    }
  },

  // Get user's promotion orders (requires authentication)
  getUserPromotionOrders: async (token, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/orders`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user promotion orders:', error);
      throw error;
    }
  },

  // Get promotion order by ID (requires authentication)
  getPromotionOrderById: async (id, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion order:', error);
      throw error;
    }
  },

  // Update promotion order (requires authentication)
  updatePromotionOrder: async (id, orderData, token) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/upsells/orders/${id}`, orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating promotion order:', error);
      throw error;
    }
  },

  // Cancel promotion order (requires authentication)
  cancelPromotionOrder: async (id, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/upsells/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error canceling promotion order:', error);
      throw error;
    }
  },

  // Process payment for promotion order (requires authentication)
  processPromotionPayment: async (orderId, paymentData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/upsells/orders/${orderId}/payment`, paymentData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error processing promotion payment:', error);
      throw error;
    }
  },

  // Get active promotions for a content type
  getActivePromotions: async (contentType, contentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/active-promotions`, {
        params: { content_type: contentType, content_id: contentId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching active promotions:', error);
      throw error;
    }
  },

  // Get promotion analytics (requires authentication)
  getPromotionAnalytics: async (orderId, token, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/orders/${orderId}/analytics`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion analytics:', error);
      throw error;
    }
  },

  // Get user's promotion history (requires authentication)
  getUserPromotionHistory: async (token, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/history`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user promotion history:', error);
      throw error;
    }
  },

  // Get promotion pricing calculator
  getPromotionPricing: async (tierId, duration, contentType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/pricing`, {
        params: { tier_id: tierId, duration, content_type: contentType }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion pricing:', error);
      throw error;
    }
  },

  // Validate promotion eligibility
  validatePromotionEligibility: async (contentType, contentId, tierId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/validate-eligibility`, {
        params: { content_type: contentType, content_id: contentId, tier_id: tierId },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error validating promotion eligibility:', error);
      throw error;
    }
  },

  // Get promotion benefits
  getPromotionBenefits: async (tierId, contentType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/benefits`, {
        params: { tier_id: tierId, content_type: contentType }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion benefits:', error);
      throw error;
    }
  },

  // Upgrade promotion (requires authentication)
  upgradePromotion: async (orderId, newTierId, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/upsells/orders/${orderId}/upgrade`, {
        tier_id: newTierId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error upgrading promotion:', error);
      throw error;
    }
  },

  // Extend promotion duration (requires authentication)
  extendPromotion: async (orderId, additionalDays, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/upsells/orders/${orderId}/extend`, {
        additional_days: additionalDays
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error extending promotion:', error);
      throw error;
    }
  },

  // Get promotion recommendations
  getPromotionRecommendations: async (contentType, contentId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/recommendations`, {
        params: { content_type: contentType, content_id: contentId },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion recommendations:', error);
      throw error;
    }
  },

  // Get featured promotions
  getFeaturedPromotions: async (contentType, limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/featured`, {
        params: { content_type: contentType, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured promotions:', error);
      throw error;
    }
  },

  // Get promotion statistics (requires authentication)
  getPromotionStatistics: async (token, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upsells/statistics`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching promotion statistics:', error);
      throw error;
    }
  }
};

export default upsellsAPI;
