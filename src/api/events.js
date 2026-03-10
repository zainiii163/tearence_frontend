// Events API Service
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Events API endpoints
export const eventsAPI = {
  // Get all events with filtering and pagination
  getAllEvents: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  // Create new event (requires authentication)
  createEvent: async (eventData, token) => {
    try {
      const formData = new FormData();
      
      // Add all event fields
      Object.keys(eventData).forEach(key => {
        if (key === 'images' && Array.isArray(eventData[key])) {
          eventData[key].forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        } else if (eventData[key] !== null && eventData[key] !== undefined) {
          formData.append(key, eventData[key]);
        }
      });

      const response = await axios.post(`${API_BASE_URL}/events`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update event (requires authentication)
  updateEvent: async (id, eventData, token) => {
    try {
      const formData = new FormData();
      
      // Add all event fields
      Object.keys(eventData).forEach(key => {
        if (key === 'images' && Array.isArray(eventData[key])) {
          eventData[key].forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        } else if (eventData[key] !== null && eventData[key] !== undefined) {
          formData.append(key, eventData[key]);
        }
      });

      // Add _method for PUT request
      formData.append('_method', 'PUT');

      const response = await axios.post(`${API_BASE_URL}/events/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete event (requires authentication)
  deleteEvent: async (id, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // Get user's events (requires authentication)
  getUserEvents: async (token, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/my-events`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  },

  // Get featured events
  getFeaturedEvents: async (limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/featured`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured events:', error);
      throw error;
    }
  },

  // Get events by category
  getEventsByCategory: async (category, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/category/${category}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching events by category:', error);
      throw error;
    }
  },

  // Search events
  searchEvents: async (query, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/search`, {
        params: { q: query, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching events:', error);
      throw error;
    }
  },

  // Get nearby events
  getNearbyEvents: async (latitude, longitude, radius = 50) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/nearby`, {
        params: { lat: latitude, lng: longitude, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby events:', error);
      throw error;
    }
  },

  // Get event categories
  getEventCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event categories:', error);
      throw error;
    }
  },

  // Promote event (requires authentication)
  promoteEvent: async (eventId, promotionData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/events/${eventId}/promote`, promotionData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error promoting event:', error);
      throw error;
    }
  },

  // Get event statistics (requires authentication)
  getEventStats: async (eventId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${eventId}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching event stats:', error);
      throw error;
    }
  }
};

export default eventsAPI;
