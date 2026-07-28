import api from '../api';
import { IT_SERVICE_CATEGORY_FALLBACK } from '../constants/itServiceCategories';
import { parseCategoriesResponse } from '../utils/serviceCategoryUtils';

// Services API endpoints for the Services & Solutions online marketplace
export const servicesApi = {
  // Get all services with filtering and sorting
  getServices: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Pagination
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      
      // Filters
      if (params?.category_id) queryParams.append("category_id", params.category_id);
      if (params?.group_slug) queryParams.append("group_slug", params.group_slug);
      if (params?.category_slug) queryParams.append("category_slug", params.category_slug);
      if (params?.country) queryParams.append("country", params.country);
      if (params?.city) queryParams.append("city", params.city);
      if (params?.service_type) queryParams.append("service_type", params.service_type);
      if (params?.min_price) queryParams.append("min_price", params.min_price);
      if (params?.max_price) queryParams.append("max_price", params.max_price);
      if (params?.verified_only) queryParams.append("verified_only", params.verified_only);
      if (params?.promotion_type) queryParams.append("promotion_type", params.promotion_type);
      
      // Search
      if (params?.search) queryParams.append("search", params.search);
      
      // Sorting
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params?.sort_order) queryParams.append("sort_order", params.sort_order);
      
      const url = queryParams.toString() 
        ? `/services?${queryParams.toString()}`
        : `/services`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get service categories (groups/mains + leaf subcategories)
  getCategories: async () => {
    try {
      const response = await api.get('/services/categories');
      const parsed = parseCategoriesResponse(response.data);
      return {
        success: true,
        data: parsed.flat,
        groups: parsed.groups,
        mains: parsed.mains,
      };
    } catch (error) {
      console.warn('services/categories failed, using fallback');
    }
    const parsed = parseCategoriesResponse({ data: IT_SERVICE_CATEGORY_FALLBACK });
    return {
      success: true,
      data: parsed.flat,
      groups: parsed.groups,
      mains: parsed.mains,
    };
  },

  // Get analytics data (under /service-analytics/ prefix)
  getAnalytics: async () => {
    const result = { recentActivity: [], trendingServices: [], trendingCountries: [], marketplaceStats: {} };
    try {
      const r = await api.get('/service-analytics/live-activity').catch(() => null);
      if (r?.data?.data) result.recentActivity = r.data.data;
    } catch (_) {}
    try {
      const r = await api.get('/service-analytics/trending').catch(() => null);
      if (r?.data?.data) result.trendingServices = r.data.data;
    } catch (_) {}
    try {
      const r = await api.get('/service-analytics/marketplace-stats').catch(() => null);
      if (r?.data?.data) {
        result.trendingCountries = r.data.data.top_countries || [];
        result.marketplaceStats = r.data.data;
      }
    } catch (_) {}
    return { success: true, data: result };
  },

  // Get single service
  getService: async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new service
  createService: async (serviceData) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update service
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await api.put(`/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete service
  deleteService: async (serviceId) => {
    try {
      const response = await api.delete(`/services/${serviceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload service media (single or multiple via files[])
  uploadMedia: async (serviceId, formData) => {
    try {
      const response = await api.post(`/services/${serviceId}/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadImages: async (serviceId, files, { markFirstAsThumbnail = true } = {}) => {
    const uploaded = [];
    for (let i = 0; i < files.length; i += 1) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('type', 'image');
      if (i === 0 && markFirstAsThumbnail) {
        formData.append('is_thumbnail', '1');
      }
      const result = await servicesApi.uploadMedia(serviceId, formData);
      uploaded.push(result);
    }
    return uploaded;
  },

  deleteMedia: async (serviceId, mediaId) => {
    try {
      const response = await api.delete(`/services/${serviceId}/media/${mediaId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured services
  getFeaturedServices: async () => {
    try {
      const response = await api.get('/services/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get popular services
  getPopularServices: async () => {
    try {
      const response = await api.get('/services/popular');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's services
  getMyServices: async () => {
    try {
      const response = await api.get('/services/my-services');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Toggle service status
  toggleServiceStatus: async (serviceId) => {
    try {
      const response = await api.post(`/services/${serviceId}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get promotion options
  getPromotionOptions: async () => {
    try {
      const response = await api.get('/services/promotion-options');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Purchase promotion
  purchasePromotion: async (serviceId, promotionType) => {
    try {
      const response = await api.post(`/services/${serviceId}/purchase-promotion`, {
        promotion_type: promotionType
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get trending services
  getTrendingServices: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.limit) queryParams.append("limit", params.limit);
      if (params?.category) queryParams.append("category", params.category);
      
      const url = queryParams.toString() 
        ? `/services-solutions/trending?${queryParams.toString()}`
        : `/services-solutions/trending`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search services (uses /services-solutions/search alias → ServiceController@index)
  searchServices: async (query, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('search', query);
      if (params?.page) queryParams.append('page', params.page);
      if (params?.per_page) queryParams.append('per_page', params.per_page);
      if (params?.category_id) queryParams.append('category_id', params.category_id);
      if (params?.group_slug) queryParams.append('group_slug', params.group_slug);
      if (params?.category_slug) queryParams.append('category_slug', params.category_slug);
      if (params?.sort_by) queryParams.append('sort_by', params.sort_by);

      const response = await api.get(`/services-solutions/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default servicesApi;
