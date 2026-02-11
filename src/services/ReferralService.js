/**
 * Referral Service
 * Handles all referral-related operations including tracking, discounts, and rewards
 * Matches the API endpoints specified in the documentation
 */

import Api from '../api';

const referralService = {
  // Public endpoints (no authentication required)

  // Validate referral code
  validateReferralCode: async (code) => {
    try {
      const response = await Api.post('/v1/referral/validate', {
        code: code
      });
      return response.data;
    } catch (error) {
      console.error('Error validating referral code:', error);
      throw error;
    }
  },

  // Get referral info for registration page
  getReferralInfo: async (code) => {
    try {
      const response = await Api.get(`/v1/referral/info?code=${code}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching referral info:', error);
      throw error;
    }
  },

  // Protected endpoints (authentication required)

  // Get user's referral
  getMyReferral: async () => {
    try {
      const response = await Api.get('/v1/referral/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching user referral:', error);
      throw error;
    }
  },

  // Create referral
  createReferral: async (referralData) => {
    try {
      const response = await Api.post('/v1/referral/create', referralData);
      return response.data;
    } catch (error) {
      console.error('Error creating referral:', error);
      throw error;
    }
  },

  // Update referral
  updateReferral: async (referralId, updateData) => {
    try {
      const response = await Api.put(`/v1/referral/${referralId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating referral:', error);
      throw error;
    }
  },

  // Get referral history
  getReferralHistory: async () => {
    try {
      const response = await Api.get('/v1/referral/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching referral history:', error);
      throw error;
    }
  },

  // Share referral (get shareable links)
  shareReferral: async (referralId) => {
    try {
      const response = await Api.get(`/v1/referral/${referralId}/share`);
      return response.data;
    } catch (error) {
      console.error('Error getting referral share links:', error);
      throw error;
    }
  },

  // Process registration with referral
  processRegistrationReferral: async (registrationData) => {
    try {
      const response = await Api.post('/v1/auth/register', registrationData);
      return response.data;
    } catch (error) {
      console.error('Error processing registration referral:', error);
      throw error;
    }
  },

  // Complete referral (when referred user posts first listing)
  completeReferral: async (listingData) => {
    try {
      const response = await Api.post('/v1/listing', listingData);
      return response.data;
    } catch (error) {
      console.error('Error completing referral:', error);
      throw error;
    }
  },

  // Apply referral discount to listing
  applyReferralDiscount: async (listingData) => {
    try {
      const response = await Api.post('/v1/listing', listingData);
      return response.data;
    } catch (error) {
      console.error('Error applying referral discount:', error);
      throw error;
    }
  },

  // Legacy methods for backward compatibility

  // Generate referral code (legacy - use getMyReferral instead)
  generateReferralCode: async (userId, userName) => {
    try {
      const response = await Api.post('/v1/referral/create', {
        message: "Join me on this amazing platform!",
        max_uses: 50
      });
      return response.data;
    } catch (error) {
      console.error('Error generating referral code:', error);
      throw error;
    }
  },

  // Get user's referral data (legacy - use getMyReferral instead)
  getReferralData: async (userId) => {
    try {
      const response = await Api.get('/v1/referral/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching referral data:', error);
      throw error;
    }
  },

  // Send email invitation (legacy - use shareReferral instead)
  sendEmailInvitation: async (invitationData) => {
    try {
      const response = await Api.post('/v1/referral/invite', invitationData);
      return response.data;
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }
  },

  // Track referral click (legacy)
  trackReferralClick: async (referralCode, userAgent, ipAddress) => {
    try {
      const response = await Api.post('/v1/referral/track-click', {
        referral_code: referralCode,
        user_agent: userAgent,
        ip_address: ipAddress
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking referral click:', error);
      throw error;
    }
  },

  // Convert referral (legacy - use completeReferral instead)
  convertReferral: async (referralCode, newUserId) => {
    try {
      const response = await Api.post('/v1/referral/convert', {
        referral_code: referralCode,
        new_user_id: newUserId
      });
      return response.data;
    } catch (error) {
      console.error('Error converting referral:', error);
      throw error;
    }
  },

  // Get referral statistics (legacy - use getReferralHistory instead)
  getReferralStats: async (userId) => {
    try {
      const response = await Api.get('/v1/referral/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      throw error;
    }
  },

  // Get available referral rewards (legacy - use getReferralHistory instead)
  getReferralRewards: async (userId) => {
    try {
      const response = await Api.get('/v1/referral/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching referral rewards:', error);
      throw error;
    }
  },

  // Redeem referral reward (legacy)
  redeemReferralReward: async (userId, rewardId) => {
    try {
      const response = await Api.post('/v1/referral/redeem', {
        user_id: userId,
        reward_id: rewardId
      });
      return response.data;
    } catch (error) {
      console.error('Error redeeming reward:', error);
      throw error;
    }
  }
};

export default referralService;
