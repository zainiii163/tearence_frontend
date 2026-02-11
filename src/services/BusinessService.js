import Api from '../api';

/**
 * Business Service
 * 
 * Provides methods to manage businesses and stores.
 * Matches the API collection endpoints for Business operations.
 */

const businessService = {
  // Get all businesses
  getAllBusinesses: async (params = {}) => {
    const response = await Api.get('/v1/business', { params });
    return response.data;
  },

  // Get business by ID
  getBusinessById: async (id) => {
    const response = await Api.get(`/v1/business/${id}`);
    return response.data;
  },

  // Get business by slug
  getBusinessBySlug: async (slug) => {
    const response = await Api.get(`/v1/business/${slug}`);
    return response.data;
  },

  // Get business detail by customer ID
  getBusinessDetailByCustomerId: async (customerId) => {
    const response = await Api.get(`/v1/business/${customerId}/detail`);
    return response.data;
  },

  // Create a new business (requires authentication)
  createBusiness: async (businessData) => {
    const response = await Api.post('/v1/business', businessData);
    return response.data;
  },

  // Update business (requires authentication)
  updateBusiness: async (id, businessData) => {
    const response = await Api.put(`/v1/business/${id}`, businessData);
    return response.data;
  },

  // Delete business (requires authentication)
  deleteBusiness: async (id) => {
    const response = await Api.delete(`/v1/business/${id}`);
    return response.data;
  },

  // Get my business (authenticated user's business)
  getMyBusiness: async () => {
    const response = await Api.get('/v1/business/my-business');
    return response.data;
  },

  // Update my business profile
  updateMyBusiness: async (businessData) => {
    const response = await Api.put('/v1/business/my-business', businessData);
    return response.data;
  },

  // Get business members
  getBusinessMembers: async (businessId) => {
    const response = await Api.get(`/v1/business/${businessId}/members`);
    return response.data;
  },

  // Add business member
  addBusinessMember: async (businessId, memberData) => {
    const response = await Api.post(`/v1/business/${businessId}/members`, memberData);
    return response.data;
  },

  // Update business member
  updateBusinessMember: async (businessId, memberId, memberData) => {
    const response = await Api.put(`/v1/business/${businessId}/members/${memberId}`, memberData);
    return response.data;
  },

  // Remove business member
  removeBusinessMember: async (businessId, memberId) => {
    const response = await Api.delete(`/v1/business/${businessId}/members/${memberId}`);
    return response.data;
  },

  // Get business analytics
  getBusinessAnalytics: async (businessId, params = {}) => {
    const response = await Api.get(`/v1/business/${businessId}/analytics`, { params });
    return response.data;
  },

  // Get business listings/ads
  getBusinessListings: async (businessId, params = {}) => {
    const response = await Api.get(`/v1/business/${businessId}/listings`, { params });
    return response.data;
  },

  // Upload business logo
  uploadBusinessLogo: async (businessId, formData) => {
    const response = await Api.post(`/v1/business/${businessId}/upload-logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload business cover image
  uploadBusinessCover: async (businessId, formData) => {
    const response = await Api.post(`/v1/business/${businessId}/upload-cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Verify business
  verifyBusiness: async (businessId, verificationData) => {
    const response = await Api.post(`/v1/business/${businessId}/verify`, verificationData);
    return response.data;
  },

  // Get business verification status
  getBusinessVerificationStatus: async (businessId) => {
    const response = await Api.get(`/v1/business/${businessId}/verification-status`);
    return response.data;
  },

  // Get business reviews
  getBusinessReviews: async (businessId, params = {}) => {
    const response = await Api.get(`/v1/business/${businessId}/reviews`, { params });
    return response.data;
  },

  // Add business review
  addBusinessReview: async (businessId, reviewData) => {
    const response = await Api.post(`/v1/business/${businessId}/reviews`, reviewData);
    return response.data;
  },

  // Update business review
  updateBusinessReview: async (businessId, reviewId, reviewData) => {
    const response = await Api.put(`/v1/business/${businessId}/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete business review
  deleteBusinessReview: async (businessId, reviewId) => {
    const response = await Api.delete(`/v1/business/${businessId}/reviews/${reviewId}`);
    return response.data;
  },

  // Get business settings
  getBusinessSettings: async (businessId) => {
    const response = await Api.get(`/v1/business/${businessId}/settings`);
    return response.data;
  },

  // Update business settings
  updateBusinessSettings: async (businessId, settingsData) => {
    const response = await Api.put(`/v1/business/${businessId}/settings`, settingsData);
    return response.data;
  },
};

export default businessService;
