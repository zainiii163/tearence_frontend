import axios from 'axios';
import { getAuthToken, removeAuthToken } from '../utils/auth';
import { buildBookFormData, getBookCoverUrl } from '../utils/bookFormHelpers';
import { extractListItems } from '../utils/apiResponseHelpers';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
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

// Request cache and rate limiting
const requestCache = new Map();
const pendingRequests = new Map();

// Exponential backoff utility
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getBackoffDelay = (attempt, maxDelay = 10000) => {
  const delay = Math.min(1000 * Math.pow(2, attempt), maxDelay);
  return delay + Math.random() * 1000; // Add jitter
};

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
  static enrichBook(book) {
    if (!book) return book;
    return {
      ...book,
      cover_image_url: getBookCoverUrl(book),
    };
  }

  static enrichBooks(books) {
    return (books || []).map((book) => BooksAPI.enrichBook(book));
  }

  static normalizePaginatedResponse(response) {
    const payload = response?.data ?? response;
    const page = payload?.data && !Array.isArray(payload) ? payload : null;
    const items = extractListItems(response);
    const currentPage = page?.current_page ?? 1;

    return {
      success: response?.success ?? true,
      data: {
        items: BooksAPI.enrichBooks(items),
        pagination: {
          currentPage,
          totalPages: page?.last_page ?? 1,
          totalItems: page?.total ?? items.length,
          itemsPerPage: page?.per_page ?? (items.length || 12),
          hasNextPage: currentPage < (page?.last_page ?? 1),
          hasPrevPage: currentPage > 1,
        },
      },
      filters: response?.filters,
    };
  }

  static normalizeListResponse(response) {
    const items = extractListItems(response);
    return {
      success: response?.success ?? true,
      data: BooksAPI.enrichBooks(items),
    };
  }

  // Public endpoints
  
  /**
   * Get all books with filtering and pagination
   */
  static async getBooks(params = {}, retryCount = 0) {
    const cacheKey = `books-${JSON.stringify(params)}`;
    
    // Check cache first
    if (requestCache.has(cacheKey)) {
      const cached = requestCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 30000) { // 30 seconds cache
        return cached.data;
      }
    }
    
    // Check if request is already pending
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey);
    }

    const requestPromise = this.makeRequest('/books-adverts', params, retryCount);
    pendingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      const normalized = BooksAPI.normalizePaginatedResponse(result);
      
      // Cache successful response
      requestCache.set(cacheKey, {
        data: normalized,
        timestamp: Date.now()
      });
      
      return normalized;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Make request with retry logic
   */
  static async makeRequest(endpoint, params = {}, retryCount = 0) {
    try {
      const response = await api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      // Handle 429 errors with exponential backoff
      if (error.response?.status === 429 && retryCount < 3) {
        const delay = getBackoffDelay(retryCount);
        console.log(`Rate limited. Retrying in ${Math.round(delay)}ms...`);
        await sleep(delay);
        return this.makeRequest(endpoint, params, retryCount + 1);
      }
      
      throw this.handleError(error);
    }
  }

  /**
   * Get single book by slug
   */
  static async getBookBySlug(slug) {
    try {
      const response = await api.get(`/books-adverts/${slug}`);
      const body = response.data;
      if (body?.data) {
        return {
          ...body,
          data: BooksAPI.enrichBook(body.data),
        };
      }
      return body;
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
      return BooksAPI.normalizeListResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Pricing plans for book upsell tiers
   */
  static async getPricingPlans() {
    try {
      const response = await api.get('/books-adverts/pricing-plans');
      const body = response.data;
      const plans = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
      return { success: body?.success ?? true, data: plans };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Books filtered by genre (display name as stored in DB)
   */
  static async getBooksByGenre(genre, params = {}) {
    try {
      const response = await api.get(`/books-adverts/genre/${encodeURIComponent(genre)}`, { params });
      return BooksAPI.normalizePaginatedResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Distinct genres from listings (+ counts when available)
   */
  static async getGenres() {
    try {
      const [listRes, trendingRes] = await Promise.allSettled([
        BooksAPI.getBooks({ per_page: 1, page: 1 }),
        BooksAPI.getTrendingGenres(),
      ]);

      const fromFilters =
        listRes.status === 'fulfilled'
          ? (listRes.value?.filters?.genres || []).map((g) => String(g)).filter(Boolean)
          : [];
      const fromTrending =
        trendingRes.status === 'fulfilled'
          ? (trendingRes.value?.data || []).map((g) => ({
              name: g.name || g.genre,
              count: Number(g.count || 0),
            }))
          : [];

      const countByName = new Map(fromTrending.map((g) => [g.name, g.count]));
      const names = [...new Set([...fromFilters, ...fromTrending.map((g) => g.name)].filter(Boolean))];

      return {
        success: true,
        data: names.map((name) => ({
          id: String(name)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
          name,
          count: countByName.get(name) || 0,
        })),
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get trending genres
   */
  static async getTrendingGenres() {
    try {
      const response = await api.get('/books-adverts/trending-genres');
      const items = extractListItems(response.data).map((genre) => ({
        ...genre,
        genre: genre.genre ?? genre.name,
        name: genre.name ?? genre.genre,
      }));
      return {
        success: response.data?.success ?? true,
        data: items,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static normalizeStatistics(raw) {
    const d = raw?.data ?? raw ?? {};
    const byCountry = d.books_by_country ?? d.booksByCountry ?? {};
    const countryCount = typeof byCountry === 'object' && !Array.isArray(byCountry)
      ? Object.keys(byCountry).filter(Boolean).length
      : 0;

    return {
      totalBooks: Number(d.total_books ?? d.totalBooks ?? 0),
      activeBooks: Number(d.active_books ?? d.activeBooks ?? 0),
      pendingBooks: Number(d.pending_books ?? d.pendingBooks ?? 0),
      totalAuthors: Number(d.total_authors ?? d.totalAuthors ?? 0),
      totalViews: Number(d.total_views ?? d.totalViews ?? 0),
      totalSaves: Number(d.total_saves ?? d.totalSaves ?? 0),
      activeCountries: countryCount || Number(d.active_countries ?? d.activeCountries ?? 0),
      totalGenres: Number(d.total_genres ?? d.totalGenres ?? 0),
      booksByGenre: d.books_by_genre ?? d.booksByGenre ?? {},
      recentBooks: d.recent_books ?? d.recentBooks ?? [],
    };
  }

  /**
   * Get platform statistics
   */
  static async getStatistics() {
    try {
      const response = await api.get('/books-adverts/statistics');
      const body = response.data;
      return {
        success: body?.success ?? true,
        data: BooksAPI.normalizeStatistics(body),
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Authenticated endpoints

  /**
   * Create new book advert
   */
  static async createBook(data) {
    try {
      const formData = data instanceof FormData ? data : buildBookFormData(data);
      const response = await api.post('/books-adverts', formData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update existing book advert
   */
  static async updateBook(id, data) {
    try {
      const formData = data instanceof FormData ? data : buildBookFormData(data);
      const response = await api.put(`/books-adverts/${id}`, formData);
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
  static async saveBook(id, save = true) {
    try {
      const response = await api.post(`/books-adverts/${id}/save`, { save });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Unsave a book (backend toggles via POST save)
   */
  static async unsaveBook(id) {
    return BooksAPI.saveBook(id, false);
  }

  /**
   * Increment book view count
   */
  static async incrementViews(id, viewData = {}) {
    try {
      const response = await api.post(`/books-adverts/${id}/views`, viewData);
      return response.data;
    } catch (error) {
      // Non-blocking: view tracking must not break book browsing
      if (process.env.NODE_ENV === 'development') {
        console.debug('[BooksAPI] View track failed:', error.response?.status, error.message);
      }
      return { success: false };
    }
  }

  /**
   * Start purchase of a book listing (PayPal after if paid)
   */
  static async purchaseBook(id, data = {}) {
    try {
      const response = await api.post(`/books-adverts/${id}/purchase`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Confirm PayPal payment for book purchase
   */
  static async confirmBookPurchase(purchaseId, paymentData = {}) {
    try {
      const response = await api.post(
        `/books-adverts/purchases/${purchaseId}/confirm-payment`,
        paymentData
      );
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
      const { status, data } = error.response;
      if (data?.errors && typeof data.errors === 'object') {
        const details = Object.entries(data.errors)
          .flatMap(([field, messages]) =>
            (Array.isArray(messages) ? messages : [messages]).map((m) => `${field}: ${m}`)
          )
          .join('. ');
        return new Error(details || data.message || `Validation failed (${status})`);
      }
      return new Error(data?.message || `HTTP Error: ${status}`);
    }
    if (error.request) {
      return new Error('Network error: No response received from server');
    }
    return new Error(error.message || 'An unexpected error occurred');
  }
}

export default BooksAPI;
