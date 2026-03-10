import axios from 'axios';

// Resorts & Travel API service for WWA Travel Marketplace System
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api/v1';

class ResortsTravelApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
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
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          window.location.href = '/Login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get all travel adverts with advanced filtering
   */
  async getTravelAdverts(params = {}) {
    const {
      search,
      advert_type,
      accommodation_type,
      transport_type,
      experience_type,
      country,
      city,
      category_id,
      promotion_tier,
      verified_business,
      price_min,
      price_max,
      availability_start,
      availability_end,
      guest_capacity_min,
      guest_capacity_max,
      sort_by = 'created_at',
      sort_order = 'desc',
      per_page = 20,
      page = 1
    } = params;

    const queryParams = new URLSearchParams();
    
    if (search) queryParams.append('search', search);
    if (advert_type) queryParams.append('advert_type', advert_type);
    if (accommodation_type) queryParams.append('accommodation_type', accommodation_type);
    if (transport_type) queryParams.append('transport_type', transport_type);
    if (experience_type) queryParams.append('experience_type', experience_type);
    if (country) queryParams.append('country', country);
    if (city) queryParams.append('city', city);
    if (category_id) queryParams.append('category_id', category_id);
    if (promotion_tier) queryParams.append('promotion_tier', promotion_tier);
    if (verified_business) queryParams.append('verified_business', verified_business);
    if (price_min) queryParams.append('price_min', price_min);
    if (price_max) queryParams.append('price_max', price_max);
    if (availability_start) queryParams.append('availability_start', availability_start);
    if (availability_end) queryParams.append('availability_end', availability_end);
    if (guest_capacity_min) queryParams.append('guest_capacity_min', guest_capacity_min);
    if (guest_capacity_max) queryParams.append('guest_capacity_max', guest_capacity_max);
    if (sort_by) queryParams.append('sort_by', sort_by);
    if (sort_order) queryParams.append('sort_order', sort_order);
    if (per_page) queryParams.append('per_page', per_page);
    if (page) queryParams.append('page', page);

    try {
      const response = await this.api.get(`/resorts-travel?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get featured travel adverts
   */
  async getFeaturedAdverts(params = {}) {
    const { per_page = 12, page = 1 } = params;
    
    try {
      const response = await this.api.get(`/resorts-travel/featured?per_page=${per_page}&page=${page}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get single travel advert by slug
   */
  async getTravelAdvertBySlug(slug) {
    try {
      const response = await this.api.get(`/resorts-travel/${slug}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get advert types
   */
  async getAdvertTypes() {
    try {
      const response = await this.api.get('/resorts-travel/advert-types');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get amenities list
   */
  async getAmenities() {
    try {
      const response = await this.api.get('/resorts-travel/amenities');
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
      const response = await this.api.get('/resorts-travel/promotion-tiers');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new travel advert
   */
  async createTravelAdvert(formData) {
    try {
      const response = await this.api.post('/resorts-travel', formData, {
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
   * Update travel advert
   */
  async updateTravelAdvert(advertId, formData) {
    try {
      const response = await this.api.put(`/resorts-travel/${advertId}`, formData, {
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
   * Delete travel advert
   */
  async deleteTravelAdvert(advertId) {
    try {
      const response = await this.api.delete(`/resorts-travel/${advertId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's travel adverts
   */
  async getMyTravelAdverts(params = {}) {
    const { per_page = 12, page = 1 } = params;
    
    try {
      const response = await this.api.get(`/resorts-travel/my-adverts?per_page=${per_page}&page=${page}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload images for travel advert
   */
  async uploadImages(formData) {
    try {
      const response = await this.api.post('/resorts-travel/upload-images', formData, {
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
   * Upload logo for business
   */
  async uploadLogo(formData) {
    try {
      const response = await this.api.post('/resorts-travel/upload-logo', formData, {
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
   * Get all categories
   */
  async getCategories(params = {}) {
    const { type, per_page = 50, page = 1 } = params;
    
    const queryParams = new URLSearchParams();
    if (type) queryParams.append('type', type);
    if (per_page) queryParams.append('per_page', per_page);
    if (page) queryParams.append('page', page);

    try {
      const response = await this.api.get(`/resorts-travel-categories?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get category types
   */
  async getCategoryTypes() {
    try {
      const response = await this.api.get('/resorts-travel-categories/types');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get popular categories
   */
  async getPopularCategories() {
    try {
      const response = await this.api.get('/resorts-travel-categories/popular');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get single category by slug
   */
  async getCategoryBySlug(slug) {
    try {
      const response = await this.api.get(`/resorts-travel-categories/${slug}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get adverts by category
   */
  async getCategoryAdverts(slug, params = {}) {
    const {
      search,
      country,
      price_min,
      price_max,
      sort_by = 'created_at',
      sort_order = 'desc',
      per_page = 20,
      page = 1
    } = params;

    const queryParams = new URLSearchParams();
    
    if (search) queryParams.append('search', search);
    if (country) queryParams.append('country', country);
    if (price_min) queryParams.append('price_min', price_min);
    if (price_max) queryParams.append('price_max', price_max);
    if (sort_by) queryParams.append('sort_by', sort_by);
    if (sort_order) queryParams.append('sort_order', sort_order);
    if (per_page) queryParams.append('per_page', per_page);
    if (page) queryParams.append('page', page);

    try {
      const response = await this.api.get(`/resorts-travel-categories/${slug}/adverts?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create category (admin only)
   */
  async createCategory(formData) {
    try {
      const response = await this.api.post('/resorts-travel-categories', formData, {
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
   * Update category (admin only)
   */
  async updateCategory(categoryId, formData) {
    try {
      const response = await this.api.put(`/resorts-travel-categories/${categoryId}`, formData, {
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
   * Delete category (admin only)
   */
  async deleteCategory(categoryId) {
    try {
      const response = await this.api.delete(`/resorts-travel-categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Increment advert views
   */
  async incrementViews(advertId) {
    try {
      const response = await this.api.post(`/resorts-travel/${advertId}/views`);
      return response.data;
    } catch (error) {
      // Silently fail for view tracking
      console.warn('Failed to increment views:', error);
    }
  }

  /**
   * Save/bookmark travel advert
   */
  async saveTravelAdvert(advertId) {
    try {
      const response = await this.api.post(`/resorts-travel/${advertId}/save`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Contact travel provider
   */
  async contactProvider(advertId, contactData) {
    try {
      const response = await this.api.post(`/resorts-travel/${advertId}/contact`, contactData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get travel statistics (admin only)
   */
  async getStatistics() {
    try {
      const response = await this.api.get('/resorts-travel/statistics');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Process payment for promotion upgrade
   */
  async processPromotionPayment(advertId, paymentData) {
    try {
      const response = await this.api.post(`/resorts-travel/${advertId}/promotion-payment`, paymentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get travel statistics (admin only)
   */
  async getStatistics() {
    try {
      const response = await this.api.get('/resorts-travel/statistics');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get trending destinations
   */
  async getTrendingDestinations(params = {}) {
    const { per_page = 10, country } = params;
    
    const queryParams = new URLSearchParams();
    if (per_page) queryParams.append('per_page', per_page);
    if (country) queryParams.append('country', country);

    try {
      const response = await this.api.get(`/resorts-travel/trending?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get nearby travel adverts
   */
  async getNearbyAdverts(latitude, longitude, radius = 50, params = {}) {
    const { per_page = 10, advert_type } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('latitude', latitude);
    queryParams.append('longitude', longitude);
    queryParams.append('radius', radius);
    if (per_page) queryParams.append('per_page', per_page);
    if (advert_type) queryParams.append('advert_type', advert_type);

    try {
      const response = await this.api.get(`/resorts-travel/nearby?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get availability for accommodation
   */
  async getAvailability(advertId, params = {}) {
    const { start_date, end_date } = params;
    
    const queryParams = new URLSearchParams();
    if (start_date) queryParams.append('start_date', start_date);
    if (end_date) queryParams.append('end_date', end_date);

    try {
      const response = await this.api.get(`/resorts-travel/${advertId}/availability?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check availability and get pricing
   */
  async checkAvailabilityPricing(advertId, params = {}) {
    const { start_date, end_date, guests } = params;
    
    const queryParams = new URLSearchParams();
    if (start_date) queryParams.append('start_date', start_date);
    if (end_date) queryParams.append('end_date', end_date);
    if (guests) queryParams.append('guests', guests);

    try {
      const response = await this.api.get(`/resorts-travel/${advertId}/check-availability?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create booking request
   */
  async createBooking(advertId, bookingData) {
    try {
      const response = await this.api.post(`/resorts-travel/${advertId}/book`, bookingData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's bookings
   */
  async getMyBookings(params = {}) {
    const { per_page = 20, page = 1, status } = params;
    
    const queryParams = new URLSearchParams();
    if (per_page) queryParams.append('per_page', per_page);
    if (page) queryParams.append('page', page);
    if (status) queryParams.append('status', status);

    try {
      const response = await this.api.get(`/resorts-travel/my-bookings?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get reviews for travel advert
   */
  async getReviews(advertId, params = {}) {
    const { per_page = 10, page = 1, sort_by = 'created_at' } = params;
    
    const queryParams = new URLSearchParams();
    if (per_page) queryParams.append('per_page', per_page);
    if (page) queryParams.append('page', page);
    if (sort_by) queryParams.append('sort_by', sort_by);

    try {
      const response = await this.api.get(`/resorts-travel/${advertId}/reviews?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Add review for travel advert
   */
  async addReview(advertId, reviewData) {
    try {
      const response = await this.api.post(`/resorts-travel/${advertId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Report travel advert
   */
  async reportAdvert(advertId, reportData) {
    try {
      const response = await this.api.post(`/resorts-travel/${advertId}/report`, reportData);
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
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error('Unauthorized. Please login again.');
        case 403:
          return new Error('Forbidden. You do not have permission to perform this action.');
        case 404:
          return new Error('Travel advert not found.');
        case 422:
          // Validation errors
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
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred.');
    }
  }
}

// Create singleton instance
const resortsTravelApi = new ResortsTravelApiService();

export default resortsTravelApi;
