import axios from 'axios';

// Stock Images & Media API service for WWA Images Marketplace System
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

class ImagesApiService {
  constructor() {
    // Create axios instance with default configuration
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // CORS configuration
      withCredentials: false,
      crossdomain: true,
      mode: 'cors'
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/Login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get all images with advanced filtering
   */
  async getImages(params = {}) {
    const {
      search,
      image_category,
      license_type,
      orientation,
      color_type,
      min_price,
      max_price,
      min_rating,
      verified_creator,
      promotion_tier,
      sort_by = 'created_at',
      sort_order = 'desc',
      per_page = 24,
      page = 1
    } = params;

    const queryParams = new URLSearchParams();
    
    if (search) queryParams.append('search', search);
    if (image_category) queryParams.append('image_category', image_category);
    if (license_type) queryParams.append('license_type', license_type);
    if (orientation) queryParams.append('orientation', orientation);
    if (color_type) queryParams.append('color_type', color_type);
    if (min_price) queryParams.append('min_price', min_price);
    if (max_price) queryParams.append('max_price', max_price);
    if (min_rating) queryParams.append('min_rating', min_rating);
    if (verified_creator) queryParams.append('verified_creator', verified_creator);
    if (promotion_tier) queryParams.append('promotion_tier', promotion_tier);
    if (sort_by) queryParams.append('sort', sort_by);
    if (sort_order) queryParams.append('order', sort_order);
    if (per_page) queryParams.append('per_page', per_page);
    if (page) queryParams.append('page', page);

    try {
      const response = await this.api.get(`/images-adverts?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get featured images
   */
  async getFeaturedImages() {
    try {
      const response = await this.api.get('/images-adverts/featured');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get trending images
   */
  async getTrendingImages() {
    try {
      const response = await this.api.get('/images-adverts/trending');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get popular images
   */
  async getPopularImages() {
    try {
      const response = await this.api.get('/images-adverts/popular');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get single image by slug
   */
  async getImageBySlug(slug) {
    try {
      const response = await this.api.get(`/images-adverts/${slug}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get image categories
   */
  async getCategories() {
    try {
      const response = await this.api.get('/images-adverts/categories');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get license types
   */
  async getLicenseTypes() {
    try {
      const response = await this.api.get('/images-adverts/license-types');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get promotion tiers
   */
  async getPromotionTiers() {
    try {
      const response = await this.api.get('/images-adverts/promotion-tiers');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get platform statistics
   */
  async getStatistics() {
    try {
      const response = await this.api.get('/images-adverts/statistics');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new image advert
   */
  async createImage(data) {
    try {
      const response = await this.api.post('/images-adverts', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update image advert
   */
  async updateImage(imageId, data) {
    try {
      const response = await this.api.put(`/images-adverts/${imageId}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete image advert
   */
  async deleteImage(imageId) {
    try {
      const response = await this.api.delete(`/images-adverts/${imageId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's images
   */
  async getMyImages(params = {}) {
    const { per_page = 24, page = 1 } = params;
    
    try {
      const response = await this.api.get(`/images-adverts/my-images?per_page=${per_page}&page=${page}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload single image
   */
  async uploadImage(formData) {
    try {
      const response = await this.api.post('/images-adverts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(formData) {
    try {
      const response = await this.api.post('/images-adverts/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Super admin: list all images including pending
   */
  async adminListImages(params = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') queryParams.append(k, v);
    });
    try {
      const response = await this.api.get(`/images-adverts/admin/all?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Admin verify image
   */
  async verifyImage(imageId) {
    try {
      const response = await this.api.post(`/images-adverts/${imageId}/verify`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Increment image views
   */
  async incrementViews(imageId) {
    try {
      const response = await this.api.post(`/images-adverts/${imageId}/views`);
      return response.data;
    } catch (error) {
      console.warn('Failed to increment views:', error);
    }
  }

  /**
   * Save/bookmark image
   */
  async saveImage(imageId) {
    try {
      const response = await this.api.post(`/images-adverts/${imageId}/save`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Unsave/unbookmark image
   */
  async unsaveImage(imageId) {
    try {
      const response = await this.api.delete(`/images-adverts/${imageId}/save`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Download image
   */
  async downloadImage(imageId) {
    try {
      const response = await this.api.post(`/images-adverts/${imageId}/download`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Process payment for image purchase
   */
  async processPayment(imageId, paymentData) {
    try {
      const response = await this.api.post(`/images-adverts/${imageId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error('Unauthorized. Please login again.');
        case 403:
          return new Error('Forbidden. You do not have permission to perform this action.');
        case 404:
          return new Error('Image not found.');
        case 422:
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat();
            return new Error(errorMessages.join(', '));
          }
          return new Error(data.message || 'Validation error.');
        case 500:
          return new Error('Server error. Please try again later.');
        default:
          return new Error(data.message || 'An error occurred.');
      }
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }
}

// Create singleton instance
const imagesApi = new ImagesApiService();

export default imagesApi;
