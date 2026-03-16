import axios from 'axios';
import { getAuthToken, removeAuthToken } from '../utils/auth';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info/api/v1/books-adverts';

// Create axios instance with default configuration
const api = axios.create({
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

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Token expired or invalid
      removeAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class BooksAPI {
  // Public endpoints
  
  /**
   * Get all books with filtering and pagination
   */
  static async getBooks(params = {}) {
    try {
      const response = await api.get('/books-adverts', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get single book by slug
   */
  static async getBookBySlug(slug) {
    try {
      const response = await api.get(`/books-adverts/${slug}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get featured/promoted books
   */
  static async getFeaturedBooks(params = {}) {
    try {
      const response = await api.get('/books-adverts/featured', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get books by genre
   */
  static async getBooksByGenre(genre, params = {}) {
    try {
      const response = await api.get(`/books-adverts/genre/${genre}`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get pricing plans
   */
  static async getPricingPlans() {
    try {
      const response = await api.get('/books-adverts/pricing-plans');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get platform statistics
   */
  static async getStatistics() {
    try {
      const response = await api.get('/books-adverts/statistics');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Authenticated endpoints

  /**
   * Create new book advert
   */
  static async createBook(formData) {
    try {
      const response = await api.post('/books-adverts', formData, {
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
   * Update existing book advert
   */
  static async updateBook(id, formData) {
    try {
      const response = await api.put(`/books-adverts/${id}`, formData, {
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
   * Delete book advert
   */
  static async deleteBook(id) {
    try {
      const response = await api.delete(`/books-adverts/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current user's books
   */
  static async getMyBooks(params = {}) {
    try {
      const response = await api.get('/books-adverts/my-books', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Save/bookmark a book
   */
  static async saveBook(id) {
    try {
      const response = await api.post(`/books-adverts/${id}/save`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Unsave a book
   */
  static async unsaveBook(id) {
    try {
      const response = await api.delete(`/books-adverts/${id}/save`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Increment book view count
   */
  static async incrementViews(id) {
    try {
      const response = await api.post(`/books-adverts/${id}/views`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Process payment for book promotion
   */
  static async processPayment(id, paymentData) {
    try {
      const response = await api.post(`/books-adverts/${id}/payment`, paymentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Error handler
   */
  static handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.message || `HTTP Error: ${status}`;
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error: No response received from server');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default BooksAPI;
