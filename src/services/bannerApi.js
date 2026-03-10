import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Banner Categories API
export const bannerCategoriesApi = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/banner-categories');
    return response.data;
  },

  // Get trending categories
  getTrending: async (limit = 10) => {
    const response = await api.get(`/banner-categories/trending?limit=${limit}`);
    return response.data;
  },

  // Get category by slug
  getBySlug: async (slug) => {
    const response = await api.get(`/banner-categories/${slug}`);
    return response.data;
  },

  // Get category banner ads
  getCategoryBanners: async (slug, params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/banner-categories/${slug}/banner-ads?${queryParams}`);
    return response.data;
  },

  // Create category (admin only)
  create: async (categoryData) => {
    const response = await api.post('/banner-categories', categoryData);
    return response.data;
  },

  // Update category (admin only)
  update: async (id, categoryData) => {
    const response = await api.put(`/banner-categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category (admin only)
  delete: async (id) => {
    const response = await api.delete(`/banner-categories/${id}`);
    return response.data;
  },
};

// Banner Ads API
export const bannerAdsApi = {
  // Get all banner ads with filtering
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/banner-ads?${queryParams}`);
    return response.data;
  },

  // Get featured banner ads
  getFeatured: async (limit = 10) => {
    const response = await api.get(`/banner-ads/featured?limit=${limit}`);
    return response.data;
  },

  // Get most viewed banner ads
  getMostViewed: async (limit = 10) => {
    const response = await api.get(`/banner-ads/most-viewed?limit=${limit}`);
    return response.data;
  },

  // Get recent banner ads
  getRecent: async (limit = 10) => {
    const response = await api.get(`/banner-ads/recent?limit=${limit}`);
    return response.data;
  },

  // Get banner ad by slug
  getBySlug: async (slug) => {
    const response = await api.get(`/banner-ads/${slug}`);
    return response.data;
  },

  // Track banner click
  trackClick: async (slug) => {
    const response = await api.post(`/banner-ads/${slug}/track-click`);
    return response.data;
  },

  // Get promotion options
  getPromotionOptions: async () => {
    const response = await api.get('/banner-ads/promotion-options');
    return response.data;
  },

  // Create banner ad (auth required)
  create: async (bannerData) => {
    const response = await api.post('/banner-ads', bannerData);
    return response.data;
  },

  // Update banner ad (auth required)
  update: async (id, bannerData) => {
    const response = await api.put(`/banner-ads/${id}`, bannerData);
    return response.data;
  },

  // Delete banner ad (auth required)
  delete: async (id) => {
    const response = await api.delete(`/banner-ads/${id}`);
    return response.data;
  },

  // Get user's banner ads (auth required)
  getMyBanners: async (params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(`/banner-ads/my-banners?${queryParams}`);
    return response.data;
  },
};

// Banner Marketplace API
export const bannerMarketplaceApi = {
  // Get homepage data
  getHomepage: async () => {
    const response = await api.get('/banner-marketplace/homepage');
    return response.data;
  },

  // Get carousel data
  getCarousel: async () => {
    const response = await api.get('/banner-marketplace/carousel');
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/banner-marketplace/categories');
    return response.data;
  },

  // Get analytics
  getAnalytics: async () => {
    const response = await api.get('/banner-marketplace/analytics');
    return response.data;
  },
};

// Banner Upload API
export const bannerUploadApi = {
  // Upload banner image
  uploadBannerImage: async (file, bannerSize) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('banner_size', bannerSize);

    const response = await api.post('/banner-upload/banner-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload business logo
  uploadBusinessLogo: async (file) => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await api.post('/banner-upload/business-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload animated banner
  uploadAnimatedBanner: async (file, bannerSize) => {
    const formData = new FormData();
    formData.append('gif', file);
    formData.append('banner_size', bannerSize);

    const response = await api.post('/banner-upload/animated-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload HTML5 banner
  uploadHtml5Banner: async (file, bannerSize) => {
    const formData = new FormData();
    formData.append('zip', file);
    formData.append('banner_size', bannerSize);

    const response = await api.post('/banner-upload/html5-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload video banner
  uploadVideoBanner: async (file, bannerSize) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('banner_size', bannerSize);

    const response = await api.post('/banner-upload/video-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete uploaded file
  deleteFile: async (filename, type) => {
    const response = await api.delete('/banner-upload/file', {
      data: { filename, type }
    });
    return response.data;
  },
};

// Error handling wrapper
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        break;
      case 403:
        // Forbidden
        throw new Error('You do not have permission to perform this action');
      case 404:
        // Not found
        throw new Error('Resource not found');
      case 422:
        // Validation error
        const validationErrors = data.errors || {};
        const errorMessage = Object.values(validationErrors).flat().join(', ');
        throw new Error(errorMessage || 'Validation failed');
      case 500:
        // Server error
        throw new Error('Server error. Please try again later');
      default:
        throw new Error(data.message || 'An error occurred');
    }
  } else if (error.request) {
    // Network error
    throw new Error('Network error. Please check your connection');
  } else {
    // Other error
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// Export default API instance
export default api;
