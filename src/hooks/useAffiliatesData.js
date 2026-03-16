import { useState, useEffect, useCallback } from 'react';
import affiliateService from '../services/AffiliateService';
import toast from 'react-hot-toast';

// Custom hook for managing affiliates marketplace data
export const useAffiliatesData = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  
  // Business Offers
  const [businessOffers, setBusinessOffers] = useState([]);
  const [businessOffersLoading, setBusinessOffersLoading] = useState(false);
  const [businessOffersPagination, setBusinessOffersPagination] = useState(null);
  
  // User Posts
  const [userPosts, setUserPosts] = useState([]);
  const [userPostsLoading, setUserPostsLoading] = useState(false);
  const [userPostsPagination, setUserPostsPagination] = useState(null);
  
  // Upsell Plans
  const [upsellPlans, setUpsellPlans] = useState([]);
  const [upsellPlansLoading, setUpsellPlansLoading] = useState(false);
  
  // Applications
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsPagination, setApplicationsPagination] = useState(null);
  
  // User Content
  const [myBusinessOffers, setMyBusinessOffers] = useState([]);
  const [myUserPosts, setMyUserPosts] = useState([]);
  const [myContentLoading, setMyContentLoading] = useState(false);
  
  // Search Results
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Platform Stats
  const [platformStats, setPlatformStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Error handler
  const handleError = useCallback((error) => {
    setError(error.message || 'An error occurred');
    console.error('Affiliates API Error:', error);
  }, []);

  // ==================== CATEGORIES ====================
  
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      setError(null);
      const response = await affiliateService.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      handleError(error);
    } finally {
      setCategoriesLoading(false);
    }
  }, [handleError]);

  // ==================== BUSINESS OFFERS ====================
  
  const fetchBusinessOffers = useCallback(async (params = {}) => {
    try {
      setBusinessOffersLoading(true);
      setError(null);
      const response = await affiliateService.getBusinessOffers(params);
      setBusinessOffers(response.data || []);
      if (response.current_page) {
        setBusinessOffersPagination({
          currentPage: response.current_page,
          totalPages: response.last_page,
          total: response.total,
          perPage: response.per_page,
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setBusinessOffersLoading(false);
    }
  }, [handleError]);

  const createBusinessOffer = useCallback(async (offerData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await affiliateService.createBusinessOffer(offerData);
      await fetchBusinessOffers(); // Refresh the list
      toast.success('Business offer created successfully!');
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchBusinessOffers, handleError]);

  const updateBusinessOffer = useCallback(async (id, offerData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await affiliatesAPI.updateBusinessOffer(id, offerData);
      await fetchBusinessOffers(); // Refresh the list
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchBusinessOffers, handleError]);

  const deleteBusinessOffer = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await affiliatesAPI.deleteBusinessOffer(id);
      await fetchBusinessOffers(); // Refresh the list
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchBusinessOffers, handleError]);

  // ==================== USER POSTS ====================
  
  const fetchUserPosts = useCallback(async (params = {}) => {
    try {
      setUserPostsLoading(true);
      setError(null);
      const response = await affiliatesAPI.getUserPosts(params);
      setUserPosts(response.data.data);
      setUserPostsPagination({
        currentPage: response.data.current_page,
        totalPages: response.data.last_page,
        total: response.data.total,
        perPage: response.data.per_page,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setUserPostsLoading(false);
    }
  }, [handleError]);

  const createUserPost = useCallback(async (postData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await affiliatesAPI.createUserPost(postData);
      await fetchUserPosts(); // Refresh the list
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchUserPosts, handleError]);

  const updateUserPost = useCallback(async (id, postData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await affiliatesAPI.updateUserPost(id, postData);
      await fetchUserPosts(); // Refresh the list
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchUserPosts, handleError]);

  const deleteUserPost = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await affiliatesAPI.deleteUserPost(id);
      await fetchUserPosts(); // Refresh the list
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchUserPosts, handleError]);

  // ==================== UPSELL PLANS ====================
  
  const fetchUpsellPlans = useCallback(async () => {
    try {
      setUpsellPlansLoading(true);
      setError(null);
      const response = await affiliatesAPI.getUpsellPlans();
      setUpsellPlans(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setUpsellPlansLoading(false);
    }
  }, [handleError]);

  // ==================== APPLICATIONS ====================
  
  const fetchApplications = useCallback(async (params = {}) => {
    try {
      setApplicationsLoading(true);
      setError(null);
      const response = await affiliatesAPI.getMyApplications(params);
      setApplications(response.data.data);
      setApplicationsPagination({
        currentPage: response.data.current_page,
        totalPages: response.data.last_page,
        total: response.data.total,
        perPage: response.data.per_page,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setApplicationsLoading(false);
    }
  }, [handleError]);

  const applyToPromote = useCallback(async (offerId, applicationData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await affiliatesAPI.applyToPromote(offerId, applicationData);
      await fetchApplications(); // Refresh applications list
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchApplications, handleError]);

  // ==================== USER CONTENT ====================
  
  const fetchMyContent = useCallback(async () => {
    try {
      setMyContentLoading(true);
      setError(null);
      const [businessOffersResponse, userPostsResponse] = await Promise.all([
        affiliatesAPI.getMyBusinessOffers(),
        affiliatesAPI.getMyUserPosts(),
      ]);
      
      setMyBusinessOffers(businessOffersResponse.data);
      setMyUserPosts(userPostsResponse.data);
    } catch (error) {
      handleError(error);
    } finally {
      setMyContentLoading(false);
    }
  }, [handleError]);

  // ==================== SEARCH ====================
  
  const searchAffiliateContent = useCallback(async (query, type = 'all') => {
    try {
      setSearchLoading(true);
      setError(null);
      const response = await affiliatesAPI.searchAffiliateContent(query, type);
      setSearchResults(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setSearchLoading(false);
    }
  }, [handleError]);

  // ==================== ANALYTICS ====================
  
  const trackClick = useCallback(async (type, id) => {
    try {
      await affiliatesAPI.trackClick(type, id);
    } catch (error) {
      // Don't set error for tracking failures, just log
      console.error('Failed to track click:', error);
    }
  }, []);

  // ==================== PLATFORM STATS ====================
  
  const fetchPlatformStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      setError(null);
      const response = await affiliatesAPI.getPlatformStats();
      setPlatformStats(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setStatsLoading(false);
    }
  }, [handleError]);

  // ==================== INITIAL DATA LOAD ====================
  
  const loadInitialData = useCallback(async () => {
    await Promise.all([
      fetchCategories(),
      fetchUpsellPlans(),
      fetchPlatformStats(),
    ]);
  }, [fetchCategories, fetchUpsellPlans, fetchPlatformStats]);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Return state and methods
  return {
    // Loading states
    loading,
    error,
    categoriesLoading,
    businessOffersLoading,
    userPostsLoading,
    upsellPlansLoading,
    applicationsLoading,
    myContentLoading,
    searchLoading,
    statsLoading,
    
    // Data
    categories,
    businessOffers,
    businessOffersPagination,
    userPosts,
    userPostsPagination,
    upsellPlans,
    applications,
    applicationsPagination,
    myBusinessOffers,
    myUserPosts,
    searchResults,
    platformStats,
    
    // Methods
    fetchCategories,
    fetchBusinessOffers,
    createBusinessOffer,
    updateBusinessOffer,
    deleteBusinessOffer,
    fetchUserPosts,
    createUserPost,
    updateUserPost,
    deleteUserPost,
    fetchUpsellPlans,
    fetchApplications,
    applyToPromote,
    fetchMyContent,
    searchAffiliateContent,
    trackClick,
    fetchPlatformStats,
    loadInitialData,
    
    // Utility
    clearError: () => setError(null),
  };
};

export default useAffiliatesData;
