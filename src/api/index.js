import axios from 'axios';
import toast from 'react-hot-toast';

// Create base axios instance (authenticated)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info/api/v1',
  timeout: 15000, // Fail fast — long hangs make every page feel broken when API is down
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // CORS configuration
  withCredentials: false, // Don't send credentials for cross-origin requests
  crossdomain: true, // Enable cross-domain requests
  mode: 'cors', // Explicitly set CORS mode
});

// Create public API instance (no authentication required)
const publicApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  crossdomain: true,
  mode: 'cors',
});

// Request interceptor to add auth token (only for authenticated API)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const debug = process.env.REACT_APP_API_DEBUG === 'true';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (debug) {
        console.log(`🔐 Adding token to ${config.method?.toUpperCase()} ${config.url}`);
      }
    } else if (debug) {
      // Public browse endpoints are fine without auth — only log when explicitly debugging
      console.warn(`⚠️ No token available for ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    // Don't override Content-Type for FormData - let browser set it with boundary
    // Check multiple ways to detect FormData (more robust across contexts)
    const data = config.data;
    let isFormData = false;
    
    if (data) {
      // Check using instanceof
      if (data instanceof FormData) {
        isFormData = true;
      }
      // Check constructor name
      else if (typeof data === 'object' && data.constructor && data.constructor.name === 'FormData') {
        isFormData = true;
      }
      // Check toString
      else if (Object.prototype.toString.call(data) === '[object FormData]') {
        isFormData = true;
      }
      // Check for FormData-specific method (entries)
      else if (typeof data === 'object' && typeof data.entries === 'function' && typeof data.append === 'function') {
        isFormData = true;
      }
    }
    
    // Debug: Log FormData detection (only for POST/PUT/PATCH with data)
    if (debug && data && ['post', 'put', 'patch'].includes(config.method?.toLowerCase())) {
      console.log('🔍 FormData detection:', {
        method: config.method,
        url: config.url,
        hasData: !!data,
        dataType: typeof data,
        isFormData: isFormData,
        constructorName: data?.constructor?.name,
        toString: Object.prototype.toString.call(data),
        hasEntries: typeof data?.entries === 'function',
        hasAppend: typeof data?.append === 'function'
      });
    }
    
    if (isFormData) {
      // Remove Content-Type to let browser set it automatically with boundary
      if (debug) console.log('📤 FormData detected - removing Content-Type header');
      delete config.headers['Content-Type'];
    } else if (config.method && ['post', 'put', 'patch'].includes(config.method.toLowerCase())) {
      // Only set Content-Type for POST/PUT/PATCH requests that are not FormData
      config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Clear invalid tokens on app load (handles JWT secret changes)
const clearInvalidTokens = () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // Try to decode the token to check if it's valid
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        const now = Date.now() / 1000;
        
        // If token is expired or very old, clear it
        if (payload.exp && payload.exp < now) {
          console.log('🗑️ Clearing expired token');
          localStorage.removeItem('token');
        }
      }
    }
  } catch (error) {
    // If token is invalid, clear it
    console.log('🗑️ Clearing invalid token');
    localStorage.removeItem('token');
  }
};

// Run on load
clearInvalidTokens();

// Response interceptor to handle common errors and caching (only for authenticated API)
api.interceptors.response.use(
  (response) => {
    // Cache successful GET requests
    if (response.config.method === 'get' && response.status === 200) {
      const cacheKey = `api_cache_${response.config.url}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        data: response.data,
        timestamp: Date.now(),
        ttl: 300000 // 5 minutes cache
      }));
    }
    
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401: {
          // Unauthorized - enhanced debugging
          console.error('🚫 401 Unauthorized Error Details:', {
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            hasToken: !!localStorage.getItem('token'),
            tokenPreview: localStorage.getItem('token')?.substring(0, 20) + '...',
            responseData: data
          });

          const method = String(error.config?.method || 'get').toLowerCase();
          const url = String(error.config?.url || '');
          // Public browse GETs must not force login (view categories without signing in).
          const isPublicBrowseGet =
            method === 'get' &&
            !/(saved|my-|dashboard|account|profile|upload|wishlist|favorites)/i.test(url);

          if (!isPublicBrowseGet) {
            localStorage.removeItem('token');
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('api_cache_')) {
                localStorage.removeItem(key);
              }
            });
            const path = window.location.pathname || '';
            if (!/\/(Login|login|register)/i.test(path)) {
              toast.error('Session expired. Please login again.');
              window.location.href = '/Login';
            }
          }
          break;
        }
          
        case 403:
          // Forbidden
          toast.error(data.message || 'You do not have permission to perform this action.');
          break;
          
        case 404:
          // Not Found
          toast.error(data.message || 'The requested resource was not found.');
          break;
          
        case 422:
          // Validation Error
          if (data.errors) {
            const errorMessages = Object.values(data.errors).flat();
            errorMessages.forEach(message => toast.error(message));
          } else {
            toast.error(data.message || 'Validation failed');
          }
          break;
          
        case 429:
          // Too Many Requests
          const retryAfter = error.response.headers['retry-after'];
          const message = retryAfter 
            ? `Too many requests. Please try again in ${retryAfter} seconds.`
            : 'Too many requests. Please try again later.';
          toast.error(message);
          break;
          
        case 500:
          // Server Error
          toast.error(data.message || 'Internal server error. Please try again later.');
          break;
          
        case 503:
          // Service Unavailable
          toast.error(data.message || 'Service is temporarily unavailable. Please try again later.');
          break;
          
        default:
          // Generic error
          toast.error(data.message || 'An error occurred. Please try again.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection and try again.');
    } else {
      // Other error
      toast.error('An error occurred. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

// Response interceptor for public API (no auth redirects)
publicApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors without auth redirects
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 404:
          console.warn('Public API endpoint not found:', error.config.url);
          break;
        case 500:
          console.error('Public API server error:', data.message);
          break;
        default:
          console.warn('Public API error:', status, data.message);
      }
    }
    
    return Promise.reject(error);
  }
);

// Utility functions for common API patterns
export const apiUtils = {
  // Handle paginated responses
  handlePaginatedResponse: (response) => {
    const { data, current_page, last_page, total, per_page } = response.data;
    return {
      items: data,
      currentPage: current_page,
      totalPages: last_page,
      totalItems: total,
      itemsPerPage: per_page,
      hasNextPage: current_page < last_page,
      hasPrevPage: current_page > 1,
    };
  },

  // Check cache before making request
  checkCache: (url, ttl = 300000) => {
    const cacheKey = `api_cache_${url}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const { data, timestamp, ttl: cacheTtl } = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp < cacheTtl) {
        return data;
      } else {
        localStorage.removeItem(cacheKey);
      }
    }

    return null;
  },

  // Clear all cache
  clearCache: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('api_cache_')) {
        localStorage.removeItem(key);
      }
    });
  },

  // Upload single file
  uploadFile: async (file, endpoint, onProgress = null) => {
    const formData = new FormData();
    formData.append('image', file);

    if (onProgress) {
      return api.post(endpoint, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        },
      });
    } else {
      return api.post(endpoint, formData);
    }
  },

  // Upload multiple files
  uploadMultipleFiles: async (files, endpoint, onProgress = null) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images[]', file);
    });

    if (onProgress) {
      return api.post(endpoint, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        },
      });
    } else {
      return api.post(endpoint, formData);
    }
  },

  // Handle file upload progress (legacy)
  uploadWithProgress: (url, formData, onProgress) => {
    return api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(progress);
      },
    });
  },

  // Retry failed requests
  retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }

    throw lastError;
  },
};

export { api, publicApi };
export default api;
