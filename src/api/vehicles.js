import api from '../api';

// Vehicles API endpoints
export const vehiclesApi = {
  // Get all vehicles with filtering and sorting
  getVehicles: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Pagination
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      
      // Filters
      if (params?.category) queryParams.append("category", params.category);
      if (params?.make) queryParams.append("make", params.make);
      if (params?.model) queryParams.append("model", params.model);
      if (params?.year) queryParams.append("year", params.year);
      if (params?.fuel_type) queryParams.append("fuel_type", params.fuel_type);
      if (params?.transmission) queryParams.append("transmission", params.transmission);
      if (params?.body_type) queryParams.append("body_type", params.body_type);
      if (params?.country) queryParams.append("country", params.country);
      if (params?.city) queryParams.append("city", params.city);
      if (params?.min_price) queryParams.append("min_price", params.min_price);
      if (params?.max_price) queryParams.append("max_price", params.max_price);
      if (params?.min_mileage) queryParams.append("min_mileage", params.min_mileage);
      if (params?.max_mileage) queryParams.append("max_mileage", params.max_mileage);
      if (params?.verified_sellers) queryParams.append("verified_sellers", params.verified_sellers);
      
      // Search
      if (params?.search) queryParams.append("search", params.search);
      
      // Sorting
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      
      const url = queryParams.toString() 
        ? `/v1/vehicles?${queryParams.toString()}`
        : `/v1/vehicles`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get vehicle categories
  getCategories: async () => {
    try {
      const response = await api.get('/vehicle-categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get vehicle makes
  getMakes: async () => {
    try {
      const response = await api.get('/vehicles/makes');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get vehicle models by make
  getModels: async (make) => {
    try {
      const response = await api.get(`/vehicles/makes/${make}/models`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured vehicles
  getFeaturedVehicles: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.limit) queryParams.append("limit", params.limit);
      if (params?.category) queryParams.append("category", params.category);
      
      const url = queryParams.toString() 
        ? `/v1/vehicles/featured?${queryParams.toString()}`
        : `/v1/vehicles/featured`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get promoted vehicles
  getPromotedVehicles: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.limit) queryParams.append("limit", params.limit);
      if (params?.category) queryParams.append("category", params.category);
      
      const url = queryParams.toString() 
        ? `/v1/vehicles/promoted?${queryParams.toString()}`
        : `/v1/vehicles/promoted`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get sponsored vehicles
  getSponsoredVehicles: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.limit) queryParams.append("limit", params.limit);
      if (params?.category) queryParams.append("category", params.category);
      
      const url = queryParams.toString() 
        ? `/v1/vehicles/sponsored?${queryParams.toString()}`
        : `/v1/vehicles/sponsored`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single vehicle by ID
  getVehicle: async (vehicleId) => {
    try {
      const response = await api.get(`/v1/vehicles/${vehicleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new vehicle (requires authentication)
  createVehicle: async (vehicleData) => {
    try {
      const formData = new FormData();
      
      // Append all vehicle data
      Object.keys(vehicleData).forEach(key => {
        if (key === 'images' && Array.isArray(vehicleData[key])) {
          vehicleData[key].forEach(file => {
            formData.append('images[]', file);
          });
        } else if (key === 'features' && Array.isArray(vehicleData[key])) {
          formData.append('features', JSON.stringify(vehicleData[key]));
        } else if (key === 'specifications' && typeof vehicleData[key] === 'object') {
          formData.append('specifications', JSON.stringify(vehicleData[key]));
        } else if (key === 'seller' && typeof vehicleData[key] === 'object') {
          formData.append('seller', JSON.stringify(vehicleData[key]));
        } else if (vehicleData[key] !== null && vehicleData[key] !== undefined) {
          formData.append(key, vehicleData[key]);
        }
      });

      const response = await api.post('/vehicles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update vehicle (requires authentication)
  updateVehicle: async (vehicleId, vehicleData) => {
    try {
      const response = await api.put(`/v1/vehicles/${vehicleId}`, vehicleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete vehicle (requires authentication)
  deleteVehicle: async (vehicleId) => {
    try {
      const response = await api.delete(`/v1/vehicles/${vehicleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get my vehicles (requires authentication)
  getMyVehicles: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      if (params?.status) queryParams.append("status", params.status);
      
      const url = queryParams.toString() 
        ? `/v1/vehicles/my-vehicles?${queryParams.toString()}`
        : `/v1/vehicles/my-vehicles`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Save/unsave vehicle (requires authentication)
  toggleSaveVehicle: async (vehicleId) => {
    try {
      const response = await api.post(`/vehicles/${vehicleId}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get saved vehicles (requires authentication)
  getSavedVehicles: async () => {
    try {
      const response = await api.get('/vehicles/saved-vehicles');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Contact seller
  contactSeller: async (vehicleId, contactData) => {
    try {
      const response = await api.post(`/vehicles/${vehicleId}/contact-seller`, contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Track vehicle event
  trackVehicleEvent: async (vehicleId, eventType, metadata = {}) => {
    try {
      const response = await api.post(`/vehicles/${vehicleId}/track-event`, {
        event_type: eventType,
        metadata,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get vehicle statistics
  getStats: async () => {
    try {
      const response = await api.get('/v1/vehicles/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get trending vehicles
  getTrendingVehicles: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.limit) queryParams.append("limit", params.limit);
      if (params?.category) queryParams.append("category", params.category);
      
      const url = queryParams.toString() 
        ? `/v1/vehicles/trending?${queryParams.toString()}`
        : `/v1/vehicles/trending`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search vehicles
  searchVehicles: async (query, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append("search", query);
      
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      if (params?.category) queryParams.append("category", params.category);
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      
      const url = queryParams.toString() 
        ? `/v1/vehicles/search?${queryParams.toString()}`
        : `/v1/vehicles/search`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get vehicles by location
  getVehiclesByLocation: async (location, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append("location", location);
      
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      if (params?.category) queryParams.append("category", params.category);
      
      const url = queryParams.toString() 
        ? `/v1/vehicles/location?${queryParams.toString()}`
        : `/v1/vehicles/location`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Purchase promotion for vehicle (requires authentication)
  purchasePromotion: async (vehicleId, promotionData) => {
    try {
      const response = await api.post(`/vehicles/${vehicleId}/purchase-promotion`, promotionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get promotion options
  getPromotionOptions: async () => {
    try {
      const response = await api.get('/vehicles/promotion-options');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload additional images for vehicle (requires authentication)
  uploadVehicleImages: async (vehicleId, formData) => {
    try {
      const response = await api.post(`/vehicles/${vehicleId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get vehicle data endpoints
  getFuelTypes: async () => {
    try {
      const response = await api.get('/vehicles/data/fuel-types');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getTransmissions: async () => {
    try {
      const response = await api.get('/vehicles/data/transmissions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getBodyTypes: async () => {
    try {
      const response = await api.get('/vehicles/data/body-types');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getConditions: async () => {
    try {
      const response = await api.get('/vehicles/data/conditions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default vehiclesApi;
