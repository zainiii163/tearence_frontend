// Venue Services API Service
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

// Venue Services API endpoints
export const venueServicesAPI = {
  // Get all venue services with filtering and pagination
  getAllVenueServices: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching venue services:', error);
      throw error;
    }
  },

  // Get venue service by ID
  getVenueServiceById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching venue service:', error);
      throw error;
    }
  },

  // Create new venue service (requires authentication)
  createVenueService: async (serviceData, token) => {
    try {
      const formData = new FormData();
      
      // Add all service fields
      Object.keys(serviceData).forEach(key => {
        if (key === 'images' && Array.isArray(serviceData[key])) {
          serviceData[key].forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        } else if (key === 'service_areas' && Array.isArray(serviceData[key])) {
          serviceData[key].forEach((area, index) => {
            formData.append(`service_areas[${index}]`, area);
          });
        } else if (key === 'packages' && Array.isArray(serviceData[key])) {
          serviceData[key].forEach((pkg, index) => {
            Object.keys(pkg).forEach(pkgKey => {
              formData.append(`packages[${index}][${pkgKey}]`, pkg[pkgKey]);
            });
          });
        } else if (serviceData[key] !== null && serviceData[key] !== undefined) {
          formData.append(key, serviceData[key]);
        }
      });

      const response = await axios.post(`${API_BASE_URL}/venue-services`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating venue service:', error);
      throw error;
    }
  },

  // Update venue service (requires authentication)
  updateVenueService: async (id, serviceData, token) => {
    try {
      const formData = new FormData();
      
      // Add all service fields
      Object.keys(serviceData).forEach(key => {
        if (key === 'images' && Array.isArray(serviceData[key])) {
          serviceData[key].forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        } else if (key === 'service_areas' && Array.isArray(serviceData[key])) {
          serviceData[key].forEach((area, index) => {
            formData.append(`service_areas[${index}]`, area);
          });
        } else if (key === 'packages' && Array.isArray(serviceData[key])) {
          serviceData[key].forEach((pkg, index) => {
            Object.keys(pkg).forEach(pkgKey => {
              formData.append(`packages[${index}][${pkgKey}]`, pkg[pkgKey]);
            });
          });
        } else if (serviceData[key] !== null && serviceData[key] !== undefined) {
          formData.append(key, serviceData[key]);
        }
      });

      // Add _method for PUT request
      formData.append('_method', 'PUT');

      const response = await axios.post(`${API_BASE_URL}/venue-services/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating venue service:', error);
      throw error;
    }
  },

  // Delete venue service (requires authentication)
  deleteVenueService: async (id, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/venue-services/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting venue service:', error);
      throw error;
    }
  },

  // Get user's venue services (requires authentication)
  getUserVenueServices: async (token, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services/my-services`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user venue services:', error);
      throw error;
    }
  },

  // Get featured venue services
  getFeaturedVenueServices: async (limit = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services/featured`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured venue services:', error);
      throw error;
    }
  },

  // Get venue services by category
  getVenueServicesByCategory: async (category, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services/category/${category}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching venue services by category:', error);
      throw error;
    }
  },

  // Search venue services
  searchVenueServices: async (query, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services/search`, {
        params: { q: query, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching venue services:', error);
      throw error;
    }
  },

  // Get venue services by location
  getVenueServicesByLocation: async (country, city, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services/location/${country}/${city}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching venue services by location:', error);
      throw error;
    }
  },

  // Get venue service categories
  getVenueServiceCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching venue service categories:', error);
      throw error;
    }
  },

  // Get venue service packages
  getVenueServicePackages: async (serviceId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services/${serviceId}/packages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching venue service packages:', error);
      throw error;
    }
  },

  // Check venue service availability
  checkVenueServiceAvailability: async (serviceId, date, startTime, endTime) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services/${serviceId}/availability`, {
        params: { date, start_time: startTime, end_time: endTime }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking venue service availability:', error);
      throw error;
    }
  },

  // Promote venue service (requires authentication)
  promoteVenueService: async (serviceId, promotionData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/venue-services/${serviceId}/promote`, promotionData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error promoting venue service:', error);
      throw error;
    }
  },

  // Get venue service statistics (requires authentication)
  getVenueServiceStats: async (serviceId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services/${serviceId}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching venue service stats:', error);
      throw error;
    }
  },

  // Get venue service reviews
  getVenueServiceReviews: async (serviceId, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services/${serviceId}/reviews`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching venue service reviews:', error);
      throw error;
    }
  },

  // Add venue service review (requires authentication)
  addVenueServiceReview: async (serviceId, reviewData, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/venue-services/${serviceId}/reviews`, reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding venue service review:', error);
      throw error;
    }
  },

  // Get venue service events
  getVenueServiceEvents: async (serviceId, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/venue-services/${serviceId}/events`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching venue service events:', error);
      throw error;
    }
  },

  // Link venue service to event (requires authentication)
  linkVenueServiceToEvent: async (serviceId, eventId, token) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/venue-services/${serviceId}/events/${eventId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error linking venue service to event:', error);
      throw error;
    }
  },

  // Unlink venue service from event (requires authentication)
  unlinkVenueServiceFromEvent: async (serviceId, eventId, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/venue-services/${serviceId}/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error unlinking venue service from event:', error);
      throw error;
    }
  }
};

export default venueServicesAPI;
