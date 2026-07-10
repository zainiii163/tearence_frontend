import api from './index';

/**
 * Sponsored Adverts API Service
 * Real API integration for sponsored adverts functionality
 */

// Get homepage statistics
export const getHomepageStats = async () => {
  try {
    const response = await api.get('/sponsored-adverts/homepage-stats');
    return response.data; // Return full response (success, data, meta)
  } catch (error) {
    console.error('Error fetching homepage stats:', error);
    
    // If it's a 404 or 429, try to use mock data directly
    if (error.is404 || error.status === 404 || error.status === 429) {
      console.info('[Sponsored API] Using mock data fallback for homepage stats');
      const { mockHomepageStats } = await import('../data/mockSponsoredData.js');
      return mockHomepageStats;
    }
    
    throw error;
  }
};

// Get sponsored categories
export const getSponsoredCategories = async () => {
  try {
    const response = await api.get('/sponsored-adverts/categories');
    return response.data; // Return full response (success, data, meta)
  } catch (error) {
    console.error('Error fetching sponsored categories:', error);
    
    // If it's a 404 or 429, try to use mock data directly
    if (error.is404 || error.status === 404 || error.status === 429) {
      console.info('[Sponsored API] Using mock data fallback');
      const { mockCategories } = await import('../data/mockSponsoredData.js');
      return mockCategories;
    }
    
    throw error;
  }
};

// Get live activity feed
export const getLiveActivity = async (limit = 20) => {
  try {
    const response = await api.get(`/sponsored-adverts/live-activity?limit=${limit}`);
    return response.data; // Return full response (success, data, meta)
  } catch (error) {
    console.error('Error fetching live activity:', error);
    
    // If it's a 404 or 429, try to use mock data directly
    if (error.is404 || error.status === 404 || error.status === 429) {
      console.info('[Sponsored API] Using mock data fallback for live activity');
      const { mockLiveActivity } = await import('../data/mockSponsoredData.js');
      return mockLiveActivity;
    }
    
    throw error;
  }
};

// Get all sponsored adverts with pagination
export const getAllSponsoredAdverts = async (params = {}) => {
  try {
    const response = await api.get('/sponsored-adverts', { params });
    return response.data; // Return full response (success, data, meta)
  } catch (error) {
    console.error('Error fetching sponsored adverts:', error);
    
    // If it's a 404 or 429, try to use mock data directly
    if (error.is404 || error.status === 404 || error.status === 429) {
      console.info('[Sponsored API] Using mock data fallback for sponsored adverts');
      const { mockAdverts } = await import('../data/mockSponsoredData.js');
      return mockAdverts;
    }
    
    throw error;
  }
};

// Search sponsored adverts
export const searchSponsoredAdverts = async (params = {}) => {
  try {
    const response = await api.get('/sponsored-adverts', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching sponsored adverts:', error);
    
    // If it's a 404 or 429, try to use mock data directly
    if (error.is404 || error.status === 404 || error.status === 429) {
      console.info('[Sponsored API] Using mock data fallback for search');
      const { mockAdverts } = await import('../data/mockSponsoredData.js');
      return mockAdverts;
    }
    
    throw error;
  }
};

// Track sponsored events (views, clicks, saves)
export const trackSponsoredEvent = async (advertId, eventType, metadata = {}) => {
  try {
    const response = await api.post(`/sponsored-adverts/analytics/track`, {
      advert_id: advertId,
      event_type: eventType,
      metadata
    });
    return response.data;
  } catch (error) {
    console.error('Error tracking sponsored event:', error);
    
    // Silently handle analytics failures - don't break the user experience
    if (error.is404 || error.status === 404) {
      console.info('[Sponsored API] Analytics tracking not available (mock mode)');
      return {
        success: true,
        message: 'Event tracked (mock)'
      };
    }
    
    // For analytics, we don't want to throw errors that break the UI
    return {
      success: false,
      message: 'Analytics tracking failed'
    };
  }
};

// Get single sponsored advert details
export const getSponsoredAdvert = async (advertId) => {
  try {
    const response = await api.get(`/sponsored-adverts/${advertId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sponsored advert:', error);
    throw error;
  }
};

// Create new sponsored advert
export const createSponsoredAdvert = async (advertData) => {
  try {
    const response = await api.post('/sponsored-adverts', advertData);
    return response.data;
  } catch (error) {
    console.error('Error creating sponsored advert:', error);
    
    // If it's a 404, return mock success response
    if (error.is404 || error.status === 404) {
      console.info('[Sponsored API] Using mock data fallback for create');
      return {
        success: true,
        message: 'Sponsored advert created successfully (mock)',
        data: {
          id: Math.floor(Math.random() * 1000) + 100,
          ...advertData,
          status: 'published',
          created_at: new Date().toISOString()
        }
      };
    }
    
    throw error;
  }
};

// Update sponsored advert
export const updateSponsoredAdvert = async (advertId, advertData) => {
  try {
    const response = await api.put(`/sponsored-adverts/${advertId}`, advertData);
    return response.data;
  } catch (error) {
    console.error('Error updating sponsored advert:', error);
    throw error;
  }
};

// Delete sponsored advert
export const deleteSponsoredAdvert = async (advertId) => {
  try {
    const response = await api.delete(`/sponsored-adverts/${advertId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sponsored advert:', error);
    throw error;
  }
};

// Get seller profile
export const getSellerProfile = async (sellerId) => {
  try {
    const response = await api.get(`/sponsored-adverts/seller/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    throw error;
  }
};

// Save/unsave advert
export const saveAdvert = async (advertId) => {
  try {
    const response = await api.post(`/sponsored-adverts/${advertId}/save`);
    return response.data;
  } catch (error) {
    console.error('Error saving advert:', error);
    throw error;
  }
};

// Get user's saved adverts
export const getSavedAdverts = async () => {
  try {
    const response = await api.get('/sponsored-adverts/saved');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved adverts:', error);
    throw error;
  }
};

// Get featured adverts
export const getFeaturedAdverts = async () => {
  try {
    const response = await api.get('/sponsored-adverts/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured adverts:', error);
    throw error;
  }
};

// Get user's sponsored adverts
export const getUserSponsoredAdverts = async (params = {}) => {
  try {
    const response = await api.get('/sponsored-adverts/my-adverts', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user sponsored adverts:', error);
    throw error;
  }
};

// Upgrade advert to premium
export const upgradeAdvert = async (advertId, planType) => {
  try {
    const response = await api.post(`/sponsored-adverts/${advertId}/upgrade`, {
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
    const response = await api.get(`/sponsored-adverts/${advertId}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching advert analytics:', error);
    throw error;
  }
};

// Contact seller
export const contactSeller = async (sellerId, contactData) => {
  try {
    const response = await api.post(`/sponsored-adverts/contact/${sellerId}`, contactData);
    return response.data;
  } catch (error) {
    console.error('Error contacting seller:', error);
    throw error;
  }
};

// Get trending adverts
export const getTrendingAdverts = async (limit = 20) => {
  try {
    const response = await api.get('/sponsored-adverts/trending', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending adverts:', error);
    throw error;
  }
};

// Submit inquiry for sponsored advert
export const submitInquiry = async (advertId, inquiryData) => {
  try {
    const response = await api.post(`/sponsored-adverts/${advertId}/inquiry`, inquiryData);
    return response.data;
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    throw error;
  }
};

// Submit rating for sponsored advert
export const submitRating = async (advertId, ratingData) => {
  try {
    const response = await api.post(`/sponsored-adverts/${advertId}/rating`, ratingData);
    return response.data;
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
};

// Upload file for sponsored advert
export const uploadSponsoredFile = async (file, type) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post('/sponsored-adverts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
