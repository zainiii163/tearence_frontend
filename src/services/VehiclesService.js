import api from "../api";

const vehiclesService = {
  // 🚗 Get all vehicles with filtering and sorting
  getVehicles: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/vehicles?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Get single vehicle
  getVehicle: async (id) => {
    try {
      const response = await api.get(`/v1/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📝 Create new vehicle advert
  createVehicle: async (formData) => {
    try {
      const response = await api.post('/v1/vehicles', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ✏️ Update vehicle
  updateVehicle: async (id, formData) => {
    try {
      const response = await api.put(`/v1/vehicles/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🗑️ Delete vehicle
  deleteVehicle: async (id) => {
    try {
      const response = await api.delete(`/v1/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📂 Get vehicle categories
  getCategories: async () => {
    try {
      const response = await api.get('/v1/vehicles/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🏭 Get vehicle makes
  getMakes: async (category = null) => {
    try {
      const url = category ? `/v1/vehicles/makes?category=${category}` : '/v1/vehicles/makes';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📋 Get vehicle models by make
  getModels: async (make) => {
    try {
      const response = await api.get(`/v1/vehicles/models?make=${make}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🎯 Get featured vehicles
  getFeaturedVehicles: async () => {
    try {
      const response = await api.get('/v1/vehicles/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔥 Get trending vehicles
  getTrendingVehicles: async () => {
    try {
      const response = await api.get('/v1/vehicles/trending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🌍 Get countries
  getCountries: async () => {
    try {
      const response = await api.get('/v1/vehicles/countries');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🌆 Get cities by country
  getCities: async (countryCode) => {
    try {
      const response = await api.get(`/v1/vehicles/countries/${countryCode}/cities`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📊 Get platform statistics
  getPlatformStats: async () => {
    try {
      const response = await api.get('/v1/vehicles/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Search vehicles
  searchVehicles: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      // Add additional filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/vehicles/search?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 💰 Get upsell plans
  getUpsellPlans: async () => {
    try {
      const response = await api.get('/v1/vehicles/upsell-plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🚀 Purchase upsell for vehicle
  purchaseUpsell: async (vehicleId, planId) => {
    try {
      const response = await api.post(`/v1/vehicles/${vehicleId}/upsell`, { plan_id: planId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📈 Get vehicle statistics
  getVehicleStats: async (vehicleId) => {
    try {
      const response = await api.get(`/v1/vehicles/${vehicleId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🏷️ Get vehicle specifications
  getSpecifications: async (category) => {
    try {
      const response = await api.get(`/v1/vehicles/specifications?category=${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 💬 Contact seller
  contactSeller: async (vehicleId, messageData) => {
    try {
      const response = await api.post(`/v1/vehicles/${vehicleId}/contact`, messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ❤️ Save/unsave vehicle
  saveVehicle: async (vehicleId) => {
    try {
      const response = await api.post(`/v1/vehicles/${vehicleId}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ❌ Unsave vehicle
  unsaveVehicle: async (vehicleId) => {
    try {
      const response = await api.delete(`/v1/vehicles/${vehicleId}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📤 Share vehicle
  shareVehicle: async (vehicleId, shareData) => {
    try {
      const response = await api.post(`/v1/vehicles/${vehicleId}/share`, shareData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default vehiclesService;
