import axios from 'axios';
import toast from 'react-hot-toast';

// Create base axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info/api/v1',
  timeout: 30000, // Increased timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // CORS configuration
  withCredentials: false, // Don't send credentials for cross-origin requests
  crossdomain: true, // Enable cross-domain requests
  mode: 'cors', // Explicitly set CORS mode
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Remove custom headers that cause CORS issues
    // Only add standard headers that are universally accepted
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and caching
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
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          // Clear all cache on logout
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('api_cache_')) {
              localStorage.removeItem(key);
            }
          });
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
          break;
          
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
          toast.error(data.message || 'Server error. Please try again later.');
          break;
          
        case 503:
          // Service Unavailable
          toast.error('Service temporarily unavailable. Please try again later.');
          break;
          
        default:
          // Other errors
          toast.error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Other error
      toast.error('An unexpected error occurred');
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
      
      if (now - timestamp < (cacheTtl || ttl)) {
        return Promise.resolve({ data });
      } else {
        localStorage.removeItem(cacheKey);
      }
    }
    
    return null;
  },

  // Handle file uploads with progress tracking
  uploadFile: async (file, endpoint = '/upload', onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    };
    
    const response = await api.post(endpoint, formData, config);
    return response.data;
  },

  // Handle multiple file uploads with progress tracking
  uploadMultipleFiles: async (files, endpoint = '/upload-multiple', onProgress = null) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    };
    
    const response = await api.post(endpoint, formData, config);
    return response.data;
  },

  // Cancel request with token
  cancelRequest: (message) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    
    setTimeout(() => {
      source.cancel(message || 'Request cancelled');
    }, 100);
    
    return source.token;
  },

  // Retry failed requests with exponential backoff
  retryRequest: async (requestFn, maxRetries = 3, baseDelay = 1000) => {
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on 4xx errors (except 429)
        if (error.response && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 429) {
          throw error;
        }
        
        // Wait before retrying with exponential backoff
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  },

  // Download file from API
  downloadFile: async (url, filename, onProgress = null) => {
    const response = await api.get(url, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    
    // Create download link
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    return response.data;
  },

  // Validate API response structure
  validateResponse: (response, requiredFields = []) => {
    if (!response || !response.data) {
      throw new Error('Invalid API response structure');
    }
    
    for (const field of requiredFields) {
      if (!(field in response.data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    return response.data;
  },

  // Format API error messages
  formatError: (error) => {
    if (error.response?.data) {
      const { message, errors } = error.response.data;
      
      if (errors && Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).flat();
        return errorMessages.join(', ');
      }
      
      return message || 'API request failed';
    }
    
    return error.message || 'Network error';
  },
};

// Export the configured axios instance
export default api;
