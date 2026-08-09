import { publicApi, api } from './index';

/**
 * Banner Ads API Service
 * Complete integration for banner advertisements system
 * Updated to match WWA API documentation
 */

// Get all banner ads with filtering (Public)
export const getBannerAds = async (params = {}) => {
  try {
    const response = await publicApi.get('/banner-ads', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching banner ads:', error);
    throw error;
  }
};

// Get featured banner ads (Public)
export const getFeaturedBannerAds = async (params = {}) => {
  try {
    const response = await publicApi.get('/banner-ads/featured', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured banner ads:', error);
    throw error;
  }
};

// Get most viewed banner ads (Public)
export const getMostViewedBannerAds = async (params = {}) => {
  try {
    const response = await publicApi.get('/banner-ads/most-viewed', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching most viewed banner ads:', error);
    throw error;
  }
};

// Get recent banner ads (Public)
export const getRecentBannerAds = async (params = {}) => {
  try {
    const response = await publicApi.get('/banner-ads/recent', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent banner ads:', error);
    throw error;
  }
};

// Get banner ad by slug (Public)
export const getBannerAdBySlug = async (slug) => {
  try {
    const response = await publicApi.get(`/banner-ads/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching banner ad by slug:', error);
    throw error;
  }
};

// Track banner click (Public) — catalog packs are FE-only and have no API row
export const trackBannerClick = async (slug, options = {}) => {
  if (!slug || options.isCatalog) {
    return { success: true, skipped: true };
  }
  try {
    const response = await publicApi.post(`/banner-ads/${slug}/track-click`);
    return response.data;
  } catch (error) {
    console.error('Error tracking banner click:', error);
    throw error;
  }
};

// Create new banner ad (Authenticated)
export const createBannerAd = async (bannerData) => {
  try {
    const response = await api.post('/banner-ads', bannerData);
    return response.data;
  } catch (error) {
    console.error('Error creating banner ad:', error);
    throw error;
  }
};

/** Start paid banner purchase (auth) — download unlocks after confirmBannerPayment */
export const purchaseBannerAd = async (bannerId) => {
  const response = await api.post(`/banner-ads/${bannerId}/purchase`);
  return response.data;
};

/** Confirm PayPal capture and unlock attachment download */
export const confirmBannerPayment = async (purchaseId, payload) => {
  const response = await api.post(
    `/banner-ads/purchases/${purchaseId}/confirm-payment`,
    payload
  );
  return response.data;
};

// Update banner ad (Authenticated)
export const updateBannerAd = async (id, bannerData) => {
  try {
    const response = await api.put(`/banner-ads/${id}`, bannerData);
    return response.data;
  } catch (error) {
    console.error('Error updating banner ad:', error);
    throw error;
  }
};

// Delete banner ad (Authenticated)
export const deleteBannerAd = async (id) => {
  try {
    const response = await api.delete(`/banner-ads/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting banner ad:', error);
    throw error;
  }
};

// Get user's banner ads (Authenticated)
export const getMyBannerAds = async (params = {}) => {
  try {
    const response = await api.get('/banner-ads/my-banners', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching user banner ads:', error);
    throw error;
  }
};

// Alias for getMyBannerAds for compatibility
export const getMyBanners = getMyBannerAds;

// Get promotion options and pricing (Public)
export const getPromotionOptions = async () => {
  try {
    const response = await publicApi.get('/banner-ads/promotion-options');
    return response.data;
  } catch (error) {
    console.error('Error fetching promotion options:', error);
    throw error;
  }
};

// Banner Categories API (Public)
export const getBannerCategories = async (params = {}) => {
  try {
    const response = await publicApi.get('/banner-categories', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching banner categories:', error);
    throw error;
  }
};

// Get trending banner categories (Public)
export const getTrendingBannerCategories = async (params = {}) => {
  try {
    const response = await publicApi.get('/banner-categories', { 
      params: { ...params, trending: true }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending banner categories:', error);
    throw error;
  }
};

// Get banner category by slug (Public)
export const getBannerCategoryBySlug = async (slug) => {
  try {
    const response = await publicApi.get(`/banner-categories/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching banner category by slug:', error);
    throw error;
  }
};

// Get ads in specific category (Public)
export const getBannerAdsByCategory = async (slug, params = {}) => {
  try {
    const response = await publicApi.get(`/banner-categories/${slug}/banner-ads`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching banner ads by category:', error);
    throw error;
  }
};

// Create banner category (Authenticated)
export const createBannerCategory = async (categoryData) => {
  try {
    const response = await api.post('/banner-categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating banner category:', error);
    throw error;
  }
};

// Update banner category (Authenticated)
export const updateBannerCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`/banner-categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating banner category:', error);
    throw error;
  }
};

// Delete banner category (Authenticated)
export const deleteBannerCategory = async (id) => {
  try {
    const response = await api.delete(`/banner-categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting banner category:', error);
    throw error;
  }
};

// Banner Analytics API (Public)
export const getBannerAnalytics = async (params = {}) => {
  try {
    const response = await publicApi.get('/analytics', { 
      params: { ...params, type: 'banner' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching banner analytics:', error);
    throw error;
  }
};

export const getBannerStats = async (params = {}) => {
  try {
    const response = await publicApi.get('/banner-marketplace/analytics', {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching banner stats:', error);
    throw error;
  }
};

// Banner Upload System API (Authenticated)
export const uploadBannerImage = async (file, bannerSize = '728x90') => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('banner_size', bannerSize);

    const response = await api.post('/banner-upload/banner-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading banner image:', error);
    throw error;
  }
};

export const uploadBusinessLogo = async (file) => {
  try {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await api.post('/banner-upload/business-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading business logo:', error);
    throw error;
  }
};

export const uploadAnimatedBanner = async (file, bannerSize = '728x90') => {
  try {
    const formData = new FormData();
    formData.append('gif', file);
    formData.append('banner_size', bannerSize);

    const response = await api.post('/banner-upload/animated-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading animated banner:', error);
    throw error;
  }
};

export const uploadHTML5Banner = async (file, bannerSize = '728x90') => {
  try {
    const formData = new FormData();
    formData.append('zip', file);
    formData.append('banner_size', bannerSize);

    const response = await api.post('/banner-upload/html5-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading HTML5 banner:', error);
    throw error;
  }
};

export const uploadVideoBanner = async (file, bannerSize = '728x90') => {
  try {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('banner_size', bannerSize);

    const response = await api.post('/banner-upload/video-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading video banner:', error);
    throw error;
  }
};

export const deleteUploadedFile = async (fileId) => {
  try {
    const response = await api.delete(`/upload/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting uploaded file:', error);
    throw error;
  }
};

// Banner Management Utilities
export const getBannerStatusOptions = () => [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'expired', label: 'Expired' }
];

export const getBannerTypeOptions = () => [
  { value: 'image', label: 'Image Banner' },
  { value: 'animated', label: 'Animated Banner' },
  { value: 'html5', label: 'HTML5 Banner' },
  { value: 'video', label: 'Video Banner' }
];

export const getBannerSizeOptions = () => [
  { value: 'leaderboard', label: 'Leaderboard (728x90)', width: 728, height: 90 },
  { value: 'medium_rectangle', label: 'Medium Rectangle (300x250)', width: 300, height: 250 },
  { value: 'large_rectangle', label: 'Large Rectangle (336x280)', width: 336, height: 280 },
  { value: 'skyscraper', label: 'Skyscraper (120x600)', width: 120, height: 600 },
  { value: 'wide_skyscraper', label: 'Wide Skyscraper (160x600)', width: 160, height: 600 },
  { value: 'square', label: 'Square (250x250)', width: 250, height: 250 },
  { value: 'large_mobile_banner', label: 'Large Mobile Banner (320x100)', width: 320, height: 100 },
  { value: 'mobile_leaderboard', label: 'Mobile Leaderboard (320x50)', width: 320, height: 50 }
];

const bannerApi = {
  // Banner Ads
  getBannerAds,
  getFeaturedBannerAds,
  getMostViewedBannerAds,
  getRecentBannerAds,
  getBannerAdBySlug,
  createBannerAd,
  purchaseBannerAd,
  confirmBannerPayment,
  updateBannerAd,
  deleteBannerAd,
  trackBannerClick,
  getMyBannerAds,
  getMyBanners: getMyBannerAds,
  getPromotionOptions,
  
  // Banner Categories
  getBannerCategories,
  getTrendingBannerCategories,
  getBannerCategoryBySlug,
  getBannerAdsByCategory,
  createBannerCategory,
  updateBannerCategory,
  deleteBannerCategory,
  
  // Banner Upload
  uploadBannerImage,
  uploadBusinessLogo,
  uploadAnimatedBanner,
  uploadHTML5Banner,
  uploadVideoBanner,
  deleteUploadedFile,
  
  // Analytics
  getBannerAnalytics,
  getBannerStats,
  
  // Utilities
  getBannerStatusOptions,
  getBannerTypeOptions,
  getBannerSizeOptions
};

export default bannerApi;
