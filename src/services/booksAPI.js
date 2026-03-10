import axios from 'axios';

// Books API service for WWA Books Adverts System
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class BooksApiService {
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
   * Get books list with advanced filtering
   */
  async getBooks(params = {}) {
    const {
      search,
      genre,
      country,
      format,
      book_type,
      language,
      min_price,
      max_price,
      verified_only,
      promoted_only,
      sort_by = 'created_at',
      sort_order = 'desc',
      per_page = 12,
      page = 1
    } = params;

    const queryParams = new URLSearchParams();
    
    if (search) queryParams.append('search', search);
    if (genre) queryParams.append('genre', genre);
    if (country) queryParams.append('country', country);
    if (format) queryParams.append('format', format);
    if (book_type) queryParams.append('book_type', book_type);
    if (language) queryParams.append('language', language);
    if (min_price) queryParams.append('min_price', min_price);
    if (max_price) queryParams.append('max_price', max_price);
    if (verified_only) queryParams.append('verified_only', verified_only);
    if (promoted_only) queryParams.append('promoted_only', promoted_only);
    if (sort_by) queryParams.append('sort_by', sort_by);
    if (sort_order) queryParams.append('sort_order', sort_order);
    if (per_page) queryParams.append('per_page', per_page);
    if (page) queryParams.append('page', page);

    try {
      const response = await this.api.get(`/books-adverts?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get book details by slug
   */
  async getBookBySlug(slug) {
    try {
      const response = await this.api.get(`/books-adverts/${slug}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new book advert
   */
  async createBook(formData) {
    try {
      const response = await this.api.post('/books-adverts', formData, {
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
   * Update book advert
   */
  async updateBook(bookId, formData) {
    try {
      const response = await this.api.put(`/books-adverts/${bookId}`, formData, {
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
  async deleteBook(bookId) {
    try {
      const response = await this.api.delete(`/books-adverts/${bookId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Save/bookmark book
   */
  async saveBook(bookId) {
    try {
      const response = await this.api.post(`/books-adverts/${bookId}/save`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user's books
   */
  async getMyBooks(params = {}) {
    const { per_page = 12, page = 1 } = params;
    
    try {
      const response = await this.api.get(`/books-adverts/my-books?per_page=${per_page}&page=${page}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get featured books
   */
  async getFeaturedBooks(params = {}) {
    const { per_page = 12, page = 1 } = params;
    
    try {
      const response = await this.api.get(`/books-adverts/featured?per_page=${per_page}&page=${page}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get books by genre
   */
  async getBooksByGenre(genre, params = {}) {
    const { per_page = 12, page = 1 } = params;
    
    try {
      const response = await this.api.get(`/books-adverts/genre/${genre}?per_page=${per_page}&page=${page}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get pricing plans
   */
  async getPricingPlans() {
    try {
      const response = await this.api.get('/books-adverts/pricing-plans');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Process payment for upsell
   */
  async processPayment(bookId, paymentData) {
    try {
      const response = await this.api.post(`/books-adverts/${bookId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get books statistics (admin only)
   */
  async getStatistics() {
    try {
      const response = await this.api.get('/books-adverts/statistics');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Increment book views
   */
  async incrementViews(bookId) {
    try {
      const response = await this.api.post(`/books-adverts/${bookId}/views`);
      return response.data;
    } catch (error) {
      // Silently fail for view tracking
      console.warn('Failed to increment views:', error);
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
          return new Error('Book not found.');
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
const booksApi = new BooksApiService();

export default booksApi;
