// Events API Service
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // CORS configuration
  withCredentials: false, // Don't send credentials for cross-origin requests
  crossdomain: true, // Enable cross-domain requests
  mode: 'cors' // Explicitly set CORS mode
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Events API endpoints
export const eventsAPI = {
  // Get all events with filtering and pagination
  getAllEvents: async (params = {}) => {
    try {
      const response = await apiClient.get('/events', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Get single event by slug
  getEventBySlug: async (slug) => {
    const response = await apiClient.get(`/events/${slug}`);
    return response.data;
  },

  // Create new event with images
  createEventWithImages: async (eventData) => {
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

    const response = await apiClient.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get featured events
  getFeaturedEvents: async (params = {}) => {
    const response = await apiClient.get('/events/featured', { params });
    return response.data;
  },

  // Get event categories
  getEventCategories: async () => {
    const response = await apiClient.get('/events/categories');
    return response.data;
  },

  // Get single event by ID
  getEventById: async (id) => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  // Create new event
  createEvent: async (eventData) => {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id) => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },

  // Get user's events
  getMyEvents: async (params = {}) => {
    const response = await apiClient.get('/events/my-events', { params });
    return response.data;
  },

  // Upload event images
  uploadEventImages: async (formData) => {
    const response = await apiClient.post('/events/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Search events
  searchEvents: async (query, params = {}) => {
    const response = await apiClient.get('/events', {
      params: { search: query, ...params },
    });
    return response.data;
  },

  // Get events by category
  getEventsByCategory: async (category, params = {}) => {
    const response = await apiClient.get('/events', {
      params: { category, ...params },
    });
    return response.data;
  },

  // Get events by location
  getEventsByLocation: async (city, country, params = {}) => {
    const response = await apiClient.get('/events', {
      params: { city, country, ...params },
    });
    return response.data;
  },

  // Get events by date range
  getEventsByDateRange: async (dateFrom, dateTo, params = {}) => {
    const response = await apiClient.get('/events', {
      params: { date_from: dateFrom, date_to: dateTo, ...params },
    });
    return response.data;
  },

  // Get events by price range
  getEventsByPriceRange: async (minPrice, maxPrice, params = {}) => {
    const response = await apiClient.get('/events', {
      params: { min_price: minPrice, max_price: maxPrice, ...params },
    });
    return response.data;
  },

  // Promote event
  promoteEvent: async (id, promotionData) => {
    const response = await apiClient.post(`/events/${id}/promote`, promotionData);
    return response.data;
  },

  // Get event statistics
  getEventStats: async (id) => {
    const response = await apiClient.get(`/events/${id}/stats`);
    return response.data;
  },

  // Save/unsave event
  saveEvent: async (id) => {
    const response = await apiClient.post(`/events/${id}/save`);
    return response.data;
  },

  unsaveEvent: async (id) => {
    const response = await apiClient.delete(`/events/${id}/save`);
    return response.data;
  },

  // Get saved events
  getSavedEvents: async (params = {}) => {
    const response = await apiClient.get('/events/saved', { params });
    return response.data;
  },

  // Contact event organizer
  contactOrganizer: async (id, messageData) => {
    const response = await apiClient.post(`/events/${id}/contact`, messageData);
    return response.data;
  },

  // Report event
  reportEvent: async (id, reportData) => {
    const response = await apiClient.post(`/events/${id}/report`, reportData);
    return response.data;
  },

  // Share event
  shareEvent: async (id, shareData) => {
    const response = await apiClient.post(`/events/${id}/share`, shareData);
    return response.data;
  },
};

export default eventsAPI;
