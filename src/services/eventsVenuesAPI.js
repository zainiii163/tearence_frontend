import axios from 'axios';
import { getAuthToken, removeAuthToken } from '../utils/auth';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || '/api/v1';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  crossdomain: true,
  mode: 'cors'
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class EventsVenuesAPI {
  // Public endpoints

  /**
   * Get all events and venues with filtering and pagination
   */
  static async getAdverts(params = {}) {
    try {
      const response = await api.get('/events-venues', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get single advert by slug
   */
  static async getAdvertBySlug(slug) {
    try {
      const response = await api.get(`/events-venues/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get featured adverts
   */
  static async getFeaturedAdverts() {
    try {
      const response = await api.get('/events-venues/featured');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get sponsored adverts
   */
  static async getSponsoredAdverts() {
    try {
      const response = await api.get('/events-venues/sponsored');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get categories
   */
  static async getCategories() {
    try {
      const response = await api.get('/events-venues/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get statistics
   */
  static async getStatistics() {
    try {
      const response = await api.get('/events-venues/statistics');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get live activity feed
   */
  static async getLiveActivity() {
    try {
      const response = await api.get('/events-venues/live-activity');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get promotion tiers
   */
  static async getPromotionTiers() {
    try {
      const response = await api.get('/events-venues/promotion-tiers');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload image
   */
  static async uploadImage(formData) {
    try {
      const response = await api.post('/events-venues/upload-image', formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Authenticated endpoints

  /**
   * Create new advert
   */
  static async createAdvert(data) {
    try {
      const response = await api.post('/events-venues', data, {
        timeout: data instanceof FormData ? 120000 : 30000,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update advert
   */
  static async updateAdvert(id, data) {
    try {
      const response = await api.put(`/events-venues/${id}`, data, {
        timeout: data instanceof FormData ? 120000 : 30000,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete advert
   */
  static async deleteAdvert(id) {
    try {
      const response = await api.delete(`/events-venues/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user's adverts
   */
  static async getMyAdverts(params = {}) {
    try {
      const response = await api.get('/events-venues/my-adverts', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save/unsave advert
   */
  static async saveAdvert(id) {
    try {
      const response = await api.post(`/events-venues/${id}/save`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get saved adverts
   */
  static async getSavedAdverts(params = {}) {
    try {
      const response = await api.get('/events-venues/saved', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default EventsVenuesAPI;
