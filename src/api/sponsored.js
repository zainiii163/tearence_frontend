import api from './index';

/**
 * Sponsored Adverts API Service
 * Real API integration for sponsored adverts functionality
 */

// Get homepage statistics
export const getHomepageStats = async () => {
  try {
    const response = await api.get('/sponsored/stats');
    return response.data; // Return full response (success, data, meta)
  } catch (error) {
    console.error('Error fetching homepage stats:', error);
    throw error;
  }
};

// Get sponsored categories
export const getSponsoredCategories = async () => {
  try {
    const response = await api.get('/sponsored/categories');
    return response.data; // Return full response (success, data, meta)
  } catch (error) {
    console.error('Error fetching sponsored categories:', error);
    throw error;
  }
};

// Get live activity feed
export const getLiveActivity = async (limit = 20) => {
  try {
    const response = await api.get(`/sponsored/activity?limit=${limit}`);
    return response.data; // Return full response (success, data, meta)
  } catch (error) {
    console.error('Error fetching live activity:', error);
    throw error;
  }
};

// Get all sponsored adverts with pagination
export const getAllSponsoredAdverts = async (params = {}) => {
  try {
    const response = await api.get('/sponsored/adverts', { params });
    return response.data; // Return full response (success, data, meta)
  } catch (error) {
    console.error('Error fetching sponsored adverts:', error);
    throw error;
  }
};

// Search sponsored adverts
export const searchSponsoredAdverts = async (params = {}) => {
  try {
    const response = await api.get('/sponsored/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching sponsored adverts:', error);
    throw error;
  }
};

// Track sponsored events (views, clicks, saves)
export const trackSponsoredEvent = async (advertId, eventType, metadata = {}) => {
  try {
    const response = await api.post(`/sponsored/adverts/${advertId}/track`, {
      event_type: eventType,
      metadata
    });
    return response.data;
  } catch (error) {
    console.error('Error tracking sponsored event:', error);
    throw error;
  }
};

// Get single sponsored advert details
export const getSponsoredAdvert = async (advertId) => {
  try {
    const response = await api.get(`/sponsored/adverts/${advertId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sponsored advert:', error);
    throw error;
  }
};

// Create new sponsored advert
export const createSponsoredAdvert = async (advertData) => {
  try {
    const response = await api.post('/sponsored/adverts', advertData);
    return response.data;
  } catch (error) {
    console.error('Error creating sponsored advert:', error);
    throw error;
  }
};

// Update sponsored advert
export const updateSponsoredAdvert = async (advertId, advertData) => {
  try {
    const response = await api.put(`/sponsored/adverts/${advertId}`, advertData);
    return response.data;
  } catch (error) {
    console.error('Error updating sponsored advert:', error);
    throw error;
  }
};

// Delete sponsored advert
export const deleteSponsoredAdvert = async (advertId) => {
  try {
    const response = await api.delete(`/sponsored/adverts/${advertId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sponsored advert:', error);
    throw error;
  }
};

// Get seller profile
export const getSellerProfile = async (sellerId) => {
  try {
    const response = await api.get(`/v1/sponsored/sellers/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    throw error;
  }
};

// Save/unsave advert
export const saveAdvert = async (advertId) => {
  try {
    const response = await api.post(`/v1/sponsored/adverts/${advertId}/save`);
    return response.data;
  } catch (error) {
    console.error('Error saving advert:', error);
    throw error;
  }
};

// Get user's saved adverts
export const getSavedAdverts = async () => {
  try {
    const response = await api.get('/sponsored/adverts/saved');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved adverts:', error);
    throw error;
  }
};

// Get featured adverts
export const getFeaturedAdverts = async () => {
  try {
    const response = await api.get('/sponsored/adverts/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured adverts:', error);
    throw error;
  }
};

// Get user's sponsored adverts
export const getUserSponsoredAdverts = async (params = {}) => {
  try {
    const response = await api.get('/sponsored/adverts/my-adverts', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user sponsored adverts:', error);
    throw error;
  }
};

// Upgrade advert to premium
export const upgradeAdvert = async (advertId, planType) => {
  try {
    const response = await api.post(`/v1/sponsored/upgrade/${advertId}`, {
      plan_type: planType
    });
    return response.data;
  } catch (error) {
    console.error('Error upgrading advert:', error);
    throw error;
  }
};

// Get analytics for advert
export const getAdvertAnalytics = async (advertId) => {
  try {
    const response = await api.get(`/v1/sponsored/analytics/${advertId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching advert analytics:', error);
    throw error;
  }
};

// Contact seller
export const contactSeller = async (sellerId, contactData) => {
  try {
    const response = await api.post(`/v1/sponsored/contact/${sellerId}`, contactData);
    return response.data;
  } catch (error) {
    console.error('Error contacting seller:', error);
    throw error;
  }
};
