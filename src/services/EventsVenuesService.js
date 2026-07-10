import api from "../api";

const eventsVenuesService = {
  // 🎪 Get all events
  getEvents: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/events-venues/events?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🏢 Get all venues
  getVenues: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/events-venues/venues?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Get single event
  getEvent: async (id) => {
    try {
      const response = await api.get(`/events-venues/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🏛️ Get single venue
  getVenue: async (id) => {
    try {
      const response = await api.get(`/events-venues/venues/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📝 Create new event
  createEvent: async (formData) => {
    try {
      const response = await api.post('/events-venues/events', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🏢 Create new venue
  createVenue: async (formData) => {
    try {
      const response = await api.post('/events-venues/venues', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ✏️ Update event
  updateEvent: async (id, formData) => {
    try {
      const response = await api.put(`/events-venues/events/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🏛️ Update venue
  updateVenue: async (id, formData) => {
    try {
      const response = await api.put(`/events-venues/venues/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🗑️ Delete event
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events-venues/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🗑️ Delete venue
  deleteVenue: async (id) => {
    try {
      const response = await api.delete(`/events-venues/venues/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📂 Get event categories
  getEventCategories: async () => {
    try {
      const response = await api.get('/events-venues/event-categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🏢 Get venue categories
  getVenueCategories: async () => {
    try {
      const response = await api.get('/events-venues/venue-categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🌍 Get countries
  getCountries: async () => {
    try {
      const response = await api.get('/events-venues/countries');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🌆 Get cities by country
  getCities: async (countryCode) => {
    try {
      const response = await api.get(`/events-venues/countries/${countryCode}/cities`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🎯 Get featured events
  getFeaturedEvents: async () => {
    try {
      const response = await api.get('/events-venues/events/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🏛️ Get featured venues
  getFeaturedVenues: async () => {
    try {
      const response = await api.get('/events-venues/venues/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔥 Get trending events
  getTrendingEvents: async () => {
    try {
      const response = await api.get('/events-venues/events/trending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🏢 Get trending venues
  getTrendingVenues: async () => {
    try {
      const response = await api.get('/events-venues/venues/trending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📊 Get platform statistics
  getPlatformStats: async () => {
    try {
      const response = await api.get('/events-venues/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Search events and venues
  search: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      // Add additional filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/events-venues/search?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 💰 Get upsell plans
  getUpsellPlans: async () => {
    try {
      const response = await api.get('/events-venues/upsell-plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🚀 Purchase upsell for event
  purchaseEventUpsell: async (eventId, planId) => {
    try {
      const response = await api.post(`/events-venues/events/${eventId}/upsell`, { plan_id: planId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🚀 Purchase upsell for venue
  purchaseVenueUpsell: async (venueId, planId) => {
    try {
      const response = await api.post(`/events-venues/venues/${venueId}/upsell`, { plan_id: planId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default eventsVenuesService;
