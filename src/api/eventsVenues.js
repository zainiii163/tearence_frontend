// Events & Venues API Service - Combined API
import axios from 'axios';
import { eventsAPI } from './events';
import { venuesAPI } from './venues';
import { venueServicesAPI } from './venueServices';
import { upsellsAPI } from './upsells';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

// Combined Events & Venues API
export const eventsVenuesAPI = {
  // Events API
  events: eventsAPI,

  // Venues API
  venues: venuesAPI,

  // Venue Services API
  venueServices: venueServicesAPI,

  // Upsells API
  upsells: upsellsAPI,

  // Combined search across all content types
  searchAll: async (query, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/search`, {
        params: { q: query, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching events and venues:', error);
      throw error;
    }
  },

  // Get featured content across all types
  getFeaturedContent: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/featured`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured content:', error);
      throw error;
    }
  },

  // Get nearby events and venues
  getNearbyContent: async (latitude, longitude, radius = 50, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/nearby`, {
        params: { lat: latitude, lng: longitude, radius, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby content:', error);
      throw error;
    }
  },

  // Get content by location
  getContentByLocation: async (country, city, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/location/${country}/${city}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching content by location:', error);
      throw error;
    }
  },

  // Get user's content (events, venues, services) - requires authentication
  getUserContent: async (token, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/my-content`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user content:', error);
      throw error;
    }
  },

  // Get dashboard statistics - requires authentication
  getDashboardStats: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get live activity feed
  getLiveActivity: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/activity`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching live activity:', error);
      throw error;
    }
  },

  // Get trending content
  getTrendingContent: async (contentType = 'all', params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/trending`, {
        params: { content_type: contentType, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending content:', error);
      throw error;
    }
  },

  // Get categories for all content types
  getAllCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all categories:', error);
      throw error;
    }
  },

  // Get popular tags
  getPopularTags: async (contentType = 'all', limit = 20) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/tags`, {
        params: { content_type: contentType, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular tags:', error);
      throw error;
    }
  },

  // Report content (requires authentication)
  reportContent: async (contentType, contentId, reportData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/events-venues/report`, {
        content_type: contentType,
        content_id: contentId,
        ...reportData
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error reporting content:', error);
      throw error;
    }
  },

  // Save/favorite content (requires authentication)
  saveContent: async (contentType, contentId, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/events-venues/save`, {
        content_type: contentType,
        content_id: contentId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error saving content:', error);
      throw error;
    }
  },

  // Unsave/unfavorite content (requires authentication)
  unsaveContent: async (contentType, contentId, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/events-venues/save`, {
        data: {
          content_type: contentType,
          content_id: contentId
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error unsaving content:', error);
      throw error;
    }
  },

  // Get saved/favorite content (requires authentication)
  getSavedContent: async (token, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/saved`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching saved content:', error);
      throw error;
    }
  },

  // Share content
  shareContent: async (contentType, contentId, shareData = {}) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/events-venues/share`, {
        content_type: contentType,
        content_id: contentId,
        ...shareData
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sharing content:', error);
      throw error;
    }
  },

  // Get content recommendations
  getContentRecommendations: async (contentType, contentId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/recommendations`, {
        params: { content_type: contentType, content_id: contentId },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting content recommendations:', error);
      throw error;
    }
  },

  // Contact content owner (requires authentication)
  contactOwner: async (contentType, contentId, messageData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/events-venues/contact`, {
        content_type: contentType,
        content_id: contentId,
        ...messageData
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error contacting content owner:', error);
      throw error;
    }
  },

  // Get analytics for content (requires authentication)
  getContentAnalytics: async (contentType, contentId, token, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events-venues/analytics`, {
        params: { content_type: contentType, content_id: contentId, ...params },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting content analytics:', error);
      throw error;
    }
  }
};

export default eventsVenuesAPI;
