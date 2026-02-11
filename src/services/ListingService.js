import Api from '../api';
import { createListingWithPosterName } from '../utils/posterHelper';

/**
 * Listing Service
 * 
 * Provides methods to manage listings (ads, jobs, properties, etc.).
 * Matches the API collection endpoints for Listing operations.
 */

const listingService = {
  // Get all listings with pagination and filtering
  getAllListings: async (params = {}) => {
    const { page = 1, per_page = 10, category, status, search, sort } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
    });
    
    if (category) queryParams.append('category', category);
    if (status) queryParams.append('status', status);
    if (search) queryParams.append('search', search);
    if (sort) queryParams.append('sort', sort);
    
    const response = await Api.get(`/v1/listing?${queryParams.toString()}`);
    return response.data;
  },

  // Get listing by slug
  getListingBySlug: async (slug) => {
    const response = await Api.get(`/v1/listing/${slug}`);
    return response.data;
  },

  // Get my listings (authenticated user)
  getMyListings: async (params = {}) => {
    const { per_page = 100, status, category, page = 1 } = params;
    const queryParams = new URLSearchParams({
      per_page: per_page.toString(),
      page: page.toString(),
    });
    
    if (status) queryParams.append('status', status);
    if (category) queryParams.append('category', category);
    
    const response = await Api.get(`/v1/listing/my-listing?${queryParams.toString()}`);
    return response.data;
  },

  // Create a new listing
  createListing: async (listingData, user = null, businessStore = null, storeDetail = null, isAdmin = false) => {
    // Enhanced listing data with poster information
    const enhancedListingData = user ? 
      createListingWithPosterName(listingData, user, businessStore, storeDetail, isAdmin) : 
      listingData;
    
    const response = await Api.post('/v1/listing', enhancedListingData);
    return response.data;
  },

  // Update listing
  updateListing: async (id, listingData) => {
    const response = await Api.put(`/v1/listing/${id}`, listingData);
    return response.data;
  },

  // Delete listing
  deleteListing: async (id) => {
    const response = await Api.delete(`/v1/listing/${id}`);
    return response.data;
  },

  // Get listing by ID
  getListingById: async (id) => {
    const response = await Api.get(`/v1/listing/${id}`);
    return response.data;
  },

  // Get listing analytics
  getListingAnalytics: async (listingId, params = {}) => {
    const response = await Api.get(`/v1/listing/${listingId}/analytics`, { params });
    return response.data;
  },

  // Get listing reviews
  getListingReviews: async (listingId, params = {}) => {
    const response = await Api.get(`/v1/listing/${listingId}/reviews`, { params });
    return response.data;
  },

  // Add listing review
  addListingReview: async (listingId, reviewData) => {
    const response = await Api.post(`/v1/listing/${listingId}/reviews`, reviewData);
    return response.data;
  },

  // Update listing review
  updateListingReview: async (listingId, reviewId, reviewData) => {
    const response = await Api.put(`/v1/listing/${listingId}/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete listing review
  deleteListingReview: async (listingId, reviewId) => {
    const response = await Api.delete(`/v1/listing/${listingId}/reviews/${reviewId}`);
    return response.data;
  },

  // Get listing images
  getListingImages: async (listingId) => {
    const response = await Api.get(`/v1/listing/${listingId}/images`);
    return response.data;
  },

  // Upload listing images
  uploadListingImages: async (listingId, formData) => {
    const response = await Api.post(`/v1/listing/${listingId}/upload-images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete listing image
  deleteListingImage: async (listingId, imageId) => {
    const response = await Api.delete(`/v1/listing/${listingId}/images/${imageId}`);
    return response.data;
  },

  // Get listing categories
  getListingCategories: async () => {
    const response = await Api.get('/v1/listing/categories');
    return response.data;
  },

  // Get listings by category
  getListingsByCategory: async (categorySlug, params = {}) => {
    const { page = 1, per_page = 10, sort, search } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
    });
    
    if (sort) queryParams.append('sort', sort);
    if (search) queryParams.append('search', search);
    
    const response = await Api.get(`/v1/listing/category/${categorySlug}?${queryParams.toString()}`);
    return response.data;
  },

  // Get featured listings
  getFeaturedListings: async (params = {}) => {
    const { limit = 10, category } = params;
    const queryParams = new URLSearchParams({ limit: limit.toString() });
    if (category) queryParams.append('category', category);
    
    const response = await Api.get(`/v1/listing/featured?${queryParams.toString()}`);
    return response.data;
  },

  // Get similar listings
  getSimilarListings: async (listingId, params = {}) => {
    const { limit = 5 } = params;
    const response = await Api.get(`/v1/listing/${listingId}/similar?limit=${limit}`);
    return response.data;
  },

  // Save/unsave listing (bookmark)
  saveListing: async (listingId) => {
    const response = await Api.post(`/v1/listing/${listingId}/save`);
    return response.data;
  },

  unsaveListing: async (listingId) => {
    const response = await Api.delete(`/v1/listing/${listingId}/save`);
    return response.data;
  },

  // Get saved listings
  getSavedListings: async (params = {}) => {
    const { page = 1, per_page = 10 } = params;
    const response = await Api.get(`/v1/listing/saved?page=${page}&per_page=${per_page}`);
    return response.data;
  },

  // Report listing
  reportListing: async (listingId, reportData) => {
    const response = await Api.post(`/v1/listing/${listingId}/report`, reportData);
    return response.data;
  },

  // Contact listing owner
  contactListingOwner: async (listingId, contactData) => {
    const response = await Api.post(`/v1/listing/${listingId}/contact`, contactData);
    return response.data;
  },

  // Get listing statistics (for owner)
  getListingStats: async (listingId) => {
    const response = await Api.get(`/v1/listing/${listingId}/stats`);
    return response.data;
  },

  // Boost listing visibility
  boostListing: async (listingId, boostData) => {
    const response = await Api.post(`/v1/listing/${listingId}/boost`, boostData);
    return response.data;
  },

  // Get listing boost options
  getListingBoostOptions: async () => {
    const response = await Api.get('/v1/listing/boost-options');
    return response.data;
  },

  // Duplicate listing
  duplicateListing: async (listingId) => {
    const response = await Api.post(`/v1/listing/${listingId}/duplicate`);
    return response.data;
  },

  // Get listing status history
  getListingStatusHistory: async (listingId) => {
    const response = await Api.get(`/v1/listing/${listingId}/status-history`);
    return response.data;
  },

  // Archive listing
  archiveListing: async (listingId) => {
    const response = await Api.post(`/v1/listing/${listingId}/archive`);
    return response.data;
  },

  // Unarchive listing
  unarchiveListing: async (listingId) => {
    const response = await Api.post(`/v1/listing/${listingId}/unarchive`);
    return response.data;
  },

  // Get archived listings
  getArchivedListings: async (params = {}) => {
    const { page = 1, per_page = 10 } = params;
    const response = await Api.get(`/v1/listing/archived?page=${page}&per_page=${per_page}`);
    return response.data;
  },
};

export default listingService;
