import api from '../api';

// Services API endpoints
export const servicesApi = {
  // Get all services with filtering and sorting
  getServices: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Pagination
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      
      // Filters
      if (params?.category) queryParams.append("category", params.category);
      if (params?.country) queryParams.append("country", params.country);
      if (params?.service_type) queryParams.append("service_type", params.service_type);
      if (params?.min_price) queryParams.append("min_price", params.min_price);
      if (params?.max_price) queryParams.append("max_price", params.max_price);
      if (params?.verified_only) queryParams.append("verified_only", params.verified_only);
      
      // Search
      if (params?.search) queryParams.append("search", params.search);
      
      // Sorting
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      
      const url = queryParams.toString() 
        ? `/services-adverts?${queryParams.toString()}`
        : `/services-adverts`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get service categories
  getCategories: async () => {
    try {
      const response = await api.get('/services-adverts/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get popular services
  getPopularServices: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.limit) queryParams.append("limit", params.limit);
      if (params?.category) queryParams.append("category", params.category);
      
      const url = queryParams.toString() 
        ? `/services/popular?${queryParams.toString()}`
        : `/services/popular`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured services
  getFeaturedServices: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.limit) queryParams.append("limit", params.limit);
      if (params?.category) queryParams.append("category", params.category);
      
      const url = queryParams.toString() 
        ? `/services-adverts/featured?${queryParams.toString()}`
        : `/services/featured`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single service
  getService: async (serviceId) => {
    try {
      const response = await api.get(`/services-adverts/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new service (requires authentication)
  createService: async (serviceData) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update service (requires authentication)
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await api.put(`/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete service (requires authentication)
  deleteService: async (serviceId) => {
    try {
      const response = await api.delete(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload media for service (requires authentication)
  uploadServiceMedia: async (serviceId, formData) => {
    try {
      const response = await api.post(`/services/${serviceId}/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Purchase promotion for service (requires authentication)
  purchasePromotion: async (serviceId, promotionData) => {
    try {
      const response = await api.post(`/services/${serviceId}/purchase-promotion`, promotionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get my services (requires authentication)
  getMyServices: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      if (params?.status) queryParams.append("status", params.status);
      
      const url = queryParams.toString() 
        ? `/services-adverts/my-services?${queryParams.toString()}`
        : `/services/my-services`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send service enquiry
  sendEnquiry: async (serviceId, enquiryData) => {
    try {
      const response = await api.post(`/services/${serviceId}/enquiries`, enquiryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get promotion options
  getPromotionOptions: async () => {
    try {
      const response = await api.get('/services-adverts/promotion-options');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Toggle service status (requires authentication)
  toggleServiceStatus: async (serviceId, statusData) => {
    try {
      const response = await api.post(`/services/${serviceId}/toggle-status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Save service as draft (requires authentication)
  saveDraft: async (serviceData) => {
    try {
      const response = await api.post('/services/draft', serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get service drafts (requires authentication)
  getDrafts: async () => {
    try {
      const response = await api.get('/services-adverts/drafts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Legacy methods for backward compatibility
  incrementEnquiries: async (serviceId) => {
    try {
      const response = await api.post(`/services/${serviceId}/enquiries`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getProviderServices: async (providerId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      
      const url = queryParams.toString() 
        ? `/services-adverts/provider/${providerId}?${queryParams.toString()}`
        : `/services/provider/${providerId}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  searchServices: async (query, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append("search", query);
      
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      if (params?.category) queryParams.append("category", params.category);
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      
      const url = queryParams.toString() 
        ? `/services-adverts/search?${queryParams.toString()}`
        : `/services/search`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getTrendingServices: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.limit) queryParams.append("limit", params.limit);
      if (params?.category) queryParams.append("category", params.category);
      
      const url = queryParams.toString() 
        ? `/services-adverts/trending?${queryParams.toString()}`
        : `/services/trending`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getServicesByLocation: async (location, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append("location", location);
      
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      if (params?.category) queryParams.append("category", params.category);
      
      const url = queryParams.toString() 
        ? `/services-adverts/location?${queryParams.toString()}`
        : `/services/location`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getServicesByCategory: async (categoryId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      
      const url = queryParams.toString() 
        ? `/services-adverts/category/${categoryId}?${queryParams.toString()}`
        : `/services/category/${categoryId}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default servicesApi;
