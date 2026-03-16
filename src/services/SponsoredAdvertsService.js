import axios from 'axios';

// API base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info';

// Create axios instance with default configuration
const sponsoredApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // CORS configuration
  withCredentials: false, // Don't send credentials for cross-origin requests
  crossdomain: true, // Enable cross-domain requests
  mode: 'cors' // Explicitly set CORS mode
});

// Request interceptor to add auth token
sponsoredApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock data helper for missing API endpoints
const getMockData = (url) => {
  if (url?.includes('/homepage-stats')) {
    return {
      total_adverts: 1256,
      active_adverts: 892,
      total_views: 45678,
      featured_adverts: 45,
      new_this_week: 23,
      top_categories: [
        { category: 'Technology', count: 234 },
        { category: 'Business', count: 189 },
        { category: 'Real Estate', count: 156 },
        { category: 'Vehicles', count: 123 },
        { category: 'Fashion', count: 98 }
      ]
    };
  }
  
  if (url?.includes('/live-activity')) {
    return [
      {
        id: 1,
        type: 'new_advert',
        message: 'New sponsored advert posted: Premium Laptop for Sale',
        timestamp: new Date().toISOString(),
        user: 'John Doe',
        category: 'Technology'
      },
      {
        id: 2,
        type: 'view',
        message: 'Someone viewed your sponsored advert',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        user: 'Jane Smith',
        category: 'Business'
      },
      {
        id: 3,
        type: 'contact',
        message: 'New inquiry on your sponsored advert',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        user: 'Mike Johnson',
        category: 'Real Estate'
      }
    ];
  }
  
  if (url?.includes('/categories')) {
    return [
      { id: 1, name: 'Technology', icon: 'laptop', count: 234 },
      { id: 2, name: 'Business', icon: 'briefcase', count: 189 },
      { id: 3, name: 'Real Estate', icon: 'home', count: 156 },
      { id: 4, name: 'Vehicles', icon: 'car', count: 123 },
      { id: 5, name: 'Fashion', icon: 'shirt', count: 98 },
      { id: 6, name: 'Education', icon: 'book', count: 87 },
      { id: 7, name: 'Health', icon: 'heart', count: 76 },
      { id: 8, name: 'Travel', icon: 'plane', count: 65 }
    ];
  }
  
  if (url?.includes('/sponsored-adverts') && !url?.includes('/search')) {
    return [
      {
        id: 1,
        title: 'Premium Laptop for Sale',
        description: 'High-performance laptop with latest specs',
        price: 1299.99,
        category: 'Technology',
        location: 'New York, USA',
        images: ['/images/laptop1.jpg'],
        featured: true,
        views: 1234,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Business Consulting Services',
        description: 'Professional business consulting and advisory',
        price: 150.00,
        category: 'Business',
        location: 'London, UK',
        images: ['/images/consulting1.jpg'],
        featured: false,
        views: 567,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }
  
  return {};
};

// Response interceptor to handle common errors
sponsoredApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      console.error('Access denied: insufficient permissions');
    }
    return Promise.reject(error);
  }
);

// Homepage & Discovery Endpoints
export const getHomepageStats = async () => {
  try {
    const response = await sponsoredApi.get('/api/v1/sponsored-adverts/homepage-stats');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getSponsoredCategories = async () => {
  try {
    const response = await sponsoredApi.get('/api/v1/sponsored-adverts/categories');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getLiveActivity = async (limit = 20) => {
  try {
    const response = await sponsoredApi.get('/api/v1/sponsored-adverts/live-activity', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Search & Browse Endpoints
export const searchSponsoredAdverts = async (params = {}) => {
  try {
    const response = await sponsoredApi.get('/api/v1/sponsored-adverts/search', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAllSponsoredAdverts = async (params = {}) => {
  try {
    const response = await sponsoredApi.get('/api/v1/sponsored-adverts', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getFeaturedAdverts = async (limit = 10) => {
  try {
    const response = await sponsoredApi.get('/api/v1/sponsored-adverts/featured', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getTrendingAdverts = async (limit = 20) => {
  try {
    const response = await sponsoredApi.get('/api/v1/sponsored-adverts/trending', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Advert Details Endpoints
export const getAdvertBySlug = async (slug) => {
  try {
    const response = await sponsoredApi.get(`/api/v1/sponsored-adverts/${slug}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAdvertsByCategory = async (categoryId, params = {}) => {
  try {
    const response = await sponsoredApi.get(`/api/v1/sponsored-adverts/category/${categoryId}`, {
      params
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAdvertsByCountry = async (country, params = {}) => {
  try {
    const response = await sponsoredApi.get(`/api/v1/sponsored-adverts/country/${country}`, {
      params
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Interactions Endpoints
export const submitInquiry = async (advertId, inquiryData) => {
  try {
    const response = await sponsoredApi.post(`/api/v1/sponsored-adverts/${advertId}/inquiry`, inquiryData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const submitRating = async (advertId, ratingData) => {
  try {
    const response = await sponsoredApi.post(`/api/v1/sponsored-adverts/${advertId}/rating`, ratingData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Management Endpoints (Authentication Required)
export const createSponsoredAdvert = async (advertData) => {
  try {
    const response = await sponsoredApi.post('/api/v1/sponsored-adverts', advertData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateSponsoredAdvert = async (id, advertData) => {
  try {
    const response = await sponsoredApi.put(`/api/v1/sponsored-adverts/${id}`, advertData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteSponsoredAdvert = async (id) => {
  try {
    const response = await sponsoredApi.delete(`/api/v1/sponsored-adverts/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Statistics Endpoints
export const getDetailedStatistics = async () => {
  try {
    const response = await sponsoredApi.get('/api/v1/sponsored-adverts/statistics');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Utility functions
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new Error(data.message || 'Bad request');
      case 401:
        return new Error('Unauthorized - Please login again');
      case 403:
        return new Error('Access denied - insufficient permissions');
      case 404:
        // For development/testing, return mock data when API endpoints don't exist
        console.warn('API endpoint not found, returning mock data');
        return {
          success: true,
          data: getMockData(error.config?.url),
          message: 'Using mock data - API endpoint not available'
        };
      case 422:
        // Validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          return new Error(errorMessages.join(', '));
        }
        return new Error(data.message || 'Validation failed');
      case 429:
        return new Error('Too many requests - please try again later');
      case 500:
        return new Error('Server error - please try again later');
      default:
        return new Error(data.message || `Request failed with status ${status}`);
    }
  } else if (error.request) {
    // Network error
    return new Error('Network error - please check your connection');
  } else {
    // Other error
    return new Error(error.message || 'An unexpected error occurred');
  }
};

// File upload helper
export const uploadSponsoredFile = async (file, type = 'image') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  try {
    const response = await sponsoredApi.post('/api/v1/sponsored-adverts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Search helper with debouncing
export const createSponsoredSearchHelper = (searchFunction, delay = 300) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await searchFunction(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

// Analytics tracking
export const trackSponsoredEvent = async (advertId, eventType, metadata = {}) => {
  try {
    const response = await sponsoredApi.post('/api/v1/sponsored-adverts/analytics/track', {
      advert_id: advertId,
      event_type: eventType,
      ...metadata
    });
    return response.data;
  } catch (error) {
    // Silently fail for analytics to not disrupt user experience
    console.warn('Analytics tracking failed:', error);
    return null;
  }
};

// Export default API object
export default {
  // Homepage & Discovery
  homepage: {
    getStats: getHomepageStats,
    getCategories: getSponsoredCategories,
    getLiveActivity: getLiveActivity
  },
  
  // Search & Browse
  browse: {
    search: searchSponsoredAdverts,
    getAll: getAllSponsoredAdverts,
    getFeatured: getFeaturedAdverts,
    getTrending: getTrendingAdverts
  },
  
  // Advert Details
  details: {
    getBySlug: getAdvertBySlug,
    getByCategory: getAdvertsByCategory,
    getByCountry: getAdvertsByCountry
  },
  
  // Interactions
  interactions: {
    submitInquiry,
    submitRating
  },
  
  // Management
  manage: {
    create: createSponsoredAdvert,
    update: updateSponsoredAdvert,
    delete: deleteSponsoredAdvert
  },
  
  // Statistics
  stats: {
    getDetailed: getDetailedStatistics
  },
  
  // Utilities
  utils: {
    uploadFile: uploadSponsoredFile,
    createSearchHelper: createSponsoredSearchHelper,
    trackEvent: trackSponsoredEvent
  }
};
