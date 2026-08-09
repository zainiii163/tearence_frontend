// Vehicles API Service - Real API Integration Only
import api from '../api'; // Use the same authenticated API instance

// Vehicle Types
export const getVehicleTypes = async () => {
  try {
    const response = await api.get('/vehicles-adverts/vehicle-types');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vehicle types:', error.message);
    throw error;
  }
};

// Categories
export const getVehicleCategories = async () => {
  try {
    const response = await api.get('/vehicles-adverts/categories');
    return response.data;
  } catch (error) {
    // Browse stays usable without categories — avoid noisy console spam
    throw error;
  }
};

// Categories for filters (object format)
export const getVehicleCategoriesForFilters = async () => {
  try {
    const response = await api.get('/vehicles-adverts/categories-for-filters');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vehicle categories for filters:', error.message);
    throw error;
  }
};

// Vehicle Makes
export const getVehicleMakes = async () => {
  try {
    const response = await api.get('/vehicles-adverts/makes');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vehicle makes:', error.message);
    throw error;
  }
};

// Vehicle Models
export const getVehicleModels = async (makeId) => {
  try {
    const response = await api.get(`/vehicles-adverts/models/${makeId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vehicle models:', error.message);
    throw error;
  }
};

// Promotion Tiers
export const getPromotionTiers = async () => {
  try {
    const response = await api.get('/vehicles-adverts/promotion-tiers');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch promotion tiers:', error.message);
    throw error;
  }
};

// Statistics
export const getVehicleStatistics = async () => {
  try {
    const response = await api.get('/vehicles-adverts/statistics');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vehicle statistics:', error.message);
    throw error;
  }
};

// Vehicle Listings
export const getVehicles = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value);
      }
    });

    const response = await api.get(`/vehicles-adverts?${params}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch vehicles:', error.message);
    throw error;
  }
};

export const getFeaturedVehicles = async () => {
  try {
    const response = await api.get('/vehicles-adverts/featured');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch featured vehicles:', error.message);
    throw error;
  }
};

export const getMostViewedVehicles = async () => {
  try {
    const response = await api.get('/vehicles-adverts/most-viewed');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch most viewed vehicles:', error.message);
    throw error;
  }
};

export const getRecentVehicles = async () => {
  try {
    const response = await api.get('/vehicles-adverts/recent');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch recent vehicles:', error.message);
    throw error;
  }
};

export const getVehicle = async (id) => {
  try {
    const response = await api.get(`/vehicles-adverts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVehicleBySlug = async (slug) => {
  try {
    const response = await api.get(`/vehicles-adverts/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch vehicle ${slug}:`, error.message);
    throw error;
  }
};

export const getMyVehicles = async () => {
  try {
    const response = await api.get('/vehicles-adverts/my-vehicles');
    return response.data;
  } catch (error) {
    if (error?.status !== 404 && error?.response?.status !== 404 && !error?.silent) {
      console.error('Failed to fetch my vehicles:', error.message);
    }
    throw error;
  }
};

// Vehicle Management (Authenticated)
export const createVehicle = async (vehicleData) => {
  try {
    const response = await api.post('/vehicles-adverts', vehicleData);
    return response.data;
  } catch (error) {
    console.error('Vehicle creation error:', error);
    
    // Log detailed validation errors if available
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
      console.error('Full error response:', error.response.data);
    } else if (error.response?.data) {
      console.error('Error response data:', error.response.data);
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('customer_id');
      localStorage.removeItem('userDetail');
      window.location.href = '/Login';
      throw new Error('Authentication expired. Please log in again.');
    }
    
    throw error;
  }
};

export const updateVehicle = async (id, vehicleData) => {
  try {
    const response = await api.put(`/vehicles-adverts/${id}`, vehicleData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update vehicle ${id}:`, error.message);
    throw error;
  }
};

export const deleteVehicle = async (id) => {
  try {
    const response = await api.delete(`/vehicles-adverts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete vehicle ${id}:`, error.message);
    throw error;
  }
};

// Save/Bookmark
export const saveVehicle = async (id) => {
  try {
    const response = await api.post(`/vehicles-adverts/${id}/save`);
    return response.data;
  } catch (error) {
    console.error(`Failed to save vehicle ${id}:`, error.message);
    throw error;
  }
};

// Toggle Vehicle Favorite (alias for saveVehicle)
export const toggleVehicleFavourite = async (id) => {
  return saveVehicle(id);
};

// Views
export const trackViews = async (id) => {
  try {
    const response = await api.post(`/vehicles-adverts/${id}/views`);
    return response.data;
  } catch (error) {
    // Non-critical — never block UX
    return null;
  }
};

// Increment Vehicle Views (alias for trackViews)
export const incrementVehicleViews = async (id) => {
  return trackViews(id);
};

// Contact Seller
export const contactSeller = async (id, contactData) => {
  try {
    const response = await api.post(`/vehicles-adverts/${id}/contact`, contactData);
    return response.data;
  } catch (error) {
    console.error(`Failed to contact seller for vehicle ${id}:`, error.message);
    throw error;
  }
};

// Payment
export const processPayment = async (id, paymentData) => {
  try {
    const response = await api.post(`/vehicles-adverts/${id}/payment`, paymentData);
    return response.data;
  } catch (error) {
    console.error(`Failed to process payment for vehicle ${id}:`, error.message);
    throw error;
  }
};

// Upload Image
export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/vehicles-adverts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to upload image:', error.message);
    throw error;
  }
};

// Error handling helper
export const handleVehicleApiError = (error) => {
  if (error.response) {
    const errorData = error.response.data;
    
    switch (error.response.status) {
      case 400:
        throw new Error(errorData.message || 'Bad request. Please check your input.');
      case 401:
        // Clear authentication data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('customer_id');
        localStorage.removeItem('userDetail');
        window.location.href = '/login';
        throw new Error('Authentication expired. Please log in again.');
      case 403:
        throw new Error('You do not have permission to perform this action.');
      case 404:
        throw new Error('The requested resource was not found.');
      case 422:
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          throw new Error(`Validation failed:\n${errorMessages}`);
        }
        throw new Error(errorData.message || 'Validation failed. Please check your input.');
      case 429:
        throw new Error('Too many requests. Please wait a moment and try again.');
      case 500:
        throw new Error('Server error. Please try again later.');
      case 503:
        throw new Error('Service temporarily unavailable. Please try again later.');
      default:
        throw new Error(errorData.message || `Request failed with status ${error.response.status}`);
    }
  } else if (error.request) {
    // Network error
    throw new Error('Network error. Please check your connection and try again.');
  } else {
    // Other error
    throw new Error(error.message || 'An unexpected error occurred.');
  }
};

export default api;
