import { useState, useEffect, useCallback } from 'react';
import affiliateService from '../services/AffiliateService';
import toast from 'react-hot-toast';

export const useAffiliateAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Generic API call wrapper
  const apiCall = useCallback(async (apiFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Categories
  const getCategories = useCallback(() => {
    return apiCall(affiliateService.getCategories);
  }, [apiCall]);

  // Business Offers
  const getBusinessOffers = useCallback((filters = {}) => {
    return apiCall(affiliateService.getBusinessOffers, filters);
  }, [apiCall]);

  const getBusinessOffer = useCallback((id) => {
    return apiCall(affiliateService.getBusinessOffer, id);
  }, [apiCall]);

  const createBusinessOffer = useCallback((data) => {
    return apiCall(affiliateService.createBusinessOffer, data);
  }, [apiCall]);

  const updateBusinessOffer = useCallback((id, data) => {
    return apiCall(affiliateService.updateBusinessOffer, id, data);
  }, [apiCall]);

  const deleteBusinessOffer = useCallback((id) => {
    return apiCall(affiliateService.deleteBusinessOffer, id);
  }, [apiCall]);

  // User Posts
  const getUserPosts = useCallback((filters = {}) => {
    return apiCall(affiliateService.getUserPosts, filters);
  }, [apiCall]);

  const getUserPost = useCallback((id) => {
    return apiCall(affiliateService.getUserPost, id);
  }, [apiCall]);

  const createUserPost = useCallback((data) => {
    return apiCall(affiliateService.createUserPost, data);
  }, [apiCall]);

  const updateUserPost = useCallback((id, data) => {
    return apiCall(affiliateService.updateUserPost, id, data);
  }, [apiCall]);

  const deleteUserPost = useCallback((id) => {
    return apiCall(affiliateService.deleteUserPost, id);
  }, [apiCall]);

  // Upsell Plans
  const getUpsellPlans = useCallback(() => {
    return apiCall(affiliateService.getUpsellPlans);
  }, [apiCall]);

  // Applications
  const applyToBusinessOffer = useCallback((offerId, data) => {
    return apiCall(affiliateService.applyToBusinessOffer, offerId, data);
  }, [apiCall]);

  const getMyApplications = useCallback((filters = {}) => {
    return apiCall(affiliateService.getMyApplications, filters);
  }, [apiCall]);

  // User Content Management
  const getMyBusinessOffers = useCallback(() => {
    return apiCall(affiliateService.getMyBusinessOffers);
  }, [apiCall]);

  const getMyUserPosts = useCallback(() => {
    return apiCall(affiliateService.getMyUserPosts);
  }, [apiCall]);

  // Search
  const searchAffiliateContent = useCallback((query, type = 'all') => {
    return apiCall(affiliateService.searchAffiliateContent, query, type);
  }, [apiCall]);

  // Analytics
  const trackClick = useCallback(async (type, id) => {
    try {
      await affiliateService.trackClick(type, id);
    } catch (err) {
      // Don't show error toast for tracking failures
      console.error('Click tracking failed:', err);
    }
  }, []);

  const getAnalytics = useCallback((type, id) => {
    return apiCall(affiliateService.getAnalytics, type, id);
  }, [apiCall]);

  // Upsell Management
  const purchaseUpsell = useCallback((postId, planId, paymentData) => {
    return apiCall(affiliateService.purchaseUpsell, postId, planId, paymentData);
  }, [apiCall]);

  const getMyUpsells = useCallback(() => {
    return apiCall(affiliateService.getMyUpsells);
  }, [apiCall]);

  // Platform Stats
  const getPlatformStats = useCallback(() => {
    return apiCall(affiliateService.getPlatformStats);
  }, [apiCall]);

  return {
    // State
    loading,
    error,
    
    // Utilities
    clearError,
    
    // Categories
    getCategories,
    
    // Business Offers
    getBusinessOffers,
    getBusinessOffer,
    createBusinessOffer,
    updateBusinessOffer,
    deleteBusinessOffer,
    
    // User Posts
    getUserPosts,
    getUserPost,
    createUserPost,
    updateUserPost,
    deleteUserPost,
    
    // Upsell Plans
    getUpsellPlans,
    
    // Applications
    applyToBusinessOffer,
    getMyApplications,
    
    // User Content Management
    getMyBusinessOffers,
    getMyUserPosts,
    
    // Search
    searchAffiliateContent,
    
    // Analytics
    trackClick,
    getAnalytics,
    
    // Upsell Management
    purchaseUpsell,
    getMyUpsells,
    
    // Platform Stats
    getPlatformStats,
  };
};

export default useAffiliateAPI;
