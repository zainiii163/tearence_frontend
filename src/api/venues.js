// Venues API Service
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Venues API endpoints
export const venuesAPI = {
  // Get all venues with filtering and pagination
  getAllVenues: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching venues:', error);
      throw error;
    }
  },

  // Get venue by ID
  getVenueById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching venue:', error);
      throw error;
    }
  },

  // Create new venue (requires authentication)
  createVenue: async (venueData, token) => {
    try {
      const formData = new FormData();
      
      // Add all venue fields
      Object.keys(venueData).forEach(key => {
        if (key === 'images' && Array.isArray(venueData[key])) {
          venueData[key].forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        } else if (key === 'amenities' && Array.isArray(venueData[key])) {
          venueData[key].forEach((amenity, index) => {
            formData.append(`amenities[${index}]`, amenity);
          });
        } else if (venueData[key] !== null && venueData[key] !== undefined) {
          formData.append(key, venueData[key]);
        }
      });

      const response = await axios.post(`${API_BASE_URL}/venues`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating venue:', error);
      throw error;
    }
  },

  // Update venue (requires authentication)
  updateVenue: async (id, venueData, token) => {
    try {
      const formData = new FormData();
      
      // Add all venue fields
      Object.keys(venueData).forEach(key => {
        if (key === 'images' && Array.isArray(venueData[key])) {
          venueData[key].forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        } else if (key === 'amenities' && Array.isArray(venueData[key])) {
          venueData[key].forEach((amenity, index) => {
            formData.append(`amenities[${index}]`, amenity);
          });
        } else if (venueData[key] !== null && venueData[key] !== undefined) {
          formData.append(key, venueData[key]);
        }
      });

      // Add _method for PUT request
      formData.append('_method', 'PUT');

      const response = await axios.post(`${API_BASE_URL}/venues/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating venue:', error);
      throw error;
    }
  },

  // Delete venue (requires authentication)
  deleteVenue: async (id, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/venues/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting venue:', error);
      throw error;
    }
  },

  // Get user's venues (requires authentication)
  getUserVenues: async (token, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues/my-venues`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user venues:', error);
      throw error;
    }
  },

  // Get featured venues
  getFeaturedVenues: async (limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues/featured`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured venues:', error);
      throw error;
    }
  },

  // Get venues by type
  getVenuesByType: async (type, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues/type/${type}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching venues by type:', error);
      throw error;
    }
  },

  // Search venues
  searchVenues: async (query, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues/search`, {
        params: { q: query, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching venues:', error);
      throw error;
    }
  },

  // Get nearby venues
  getNearbyVenues: async (latitude, longitude, radius = 50) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues/nearby`, {
        params: { lat: latitude, lng: longitude, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby venues:', error);
      throw error;
    }
  },

  // Get venue types
  getVenueTypes: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues/types`);
      return response.data;
    } catch (error) {
      console.error('Error fetching venue types:', error);
      throw error;
    }
  },

  // Get venue amenities
  getVenueAmenities: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues/amenities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching venue amenities:', error);
      throw error;
    }
  },

  // Check venue availability
  checkVenueAvailability: async (venueId, date, startTime, endTime) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues/${venueId}/availability`, {
        params: { date, start_time: startTime, end_time: endTime }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking venue availability:', error);
      throw error;
    }
  },

  // Get venue pricing
  getVenuePricing: async (venueId, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues/${venueId}/pricing`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching venue pricing:', error);
      throw error;
    }
  },

  // Promote venue (requires authentication)
  promoteVenue: async (venueId, promotionData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/venues/${venueId}/promote`, promotionData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error promoting venue:', error);
      throw error;
    }
  },

  // Get venue statistics (requires authentication)
  getVenueStats: async (venueId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues/${venueId}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching venue stats:', error);
      throw error;
    }
  },

  // Get venue reviews
  getVenueReviews: async (venueId, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venues/${venueId}/reviews`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching venue reviews:', error);
      throw error;
    }
  },

  // Add venue review (requires authentication)
  addVenueReview: async (venueId, reviewData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/venues/${venueId}/reviews`, reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding venue review:', error);
      throw error;
    }
  }
};

export default venuesAPI;
