import api from "../api";

// Service for ad moderation and cleanup
class AdModerationService {
  // Delete ads older than 3 weeks
  static async deleteOldAds() {
    try {
      const response = await api.post('/ads/cleanup-old-ads', {
        days_old: 21 // 3 weeks
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting old ads:', error);
      throw error;
    }
  }

  // Get ads pending admin approval
  static async getPendingAds(page = 1, limit = 20) {
    try {
      const response = await api.get(`/ads/pending-approval?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending ads:', error);
      throw error;
    }
  }

  // Approve an ad
  static async approveAd(adId) {
    try {
      const response = await api.post(`/ads/${adId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving ad:', error);
      throw error;
    }
  }

  // Reject an ad
  static async rejectAd(adId, reason) {
    try {
      const response = await api.post(`/ads/${adId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting ad:', error);
      throw error;
    }
  }

  // Detect and flag potentially harmful ads
  static async detectHarmfulAds() {
    try {
      const response = await api.post('/ads/detect-harmful');
      return response.data;
    } catch (error) {
      console.error('Error detecting harmful ads:', error);
      throw error;
    }
  }

  // Delete harmful ads
  static async deleteHarmfulAds(adIds) {
    try {
      const response = await api.post('/ads/delete-harmful', { ad_ids: adIds });
      return response.data;
    } catch (error) {
      console.error('Error deleting harmful ads:', error);
      throw error;
    }
  }

  // Update ad with admin poster role
  static async updateAdPosterRole(adId, posterRole) {
    try {
      const response = await api.put(`/ads/${adId}/poster-role`, { poster_role: posterRole });
      return response.data;
    } catch (error) {
      console.error('Error updating ad poster role:', error);
      throw error;
    }
  }

  // Repost ad with updated date
  static async repostAd(adId) {
    try {
      const response = await api.post(`/ads/${adId}/repost`);
      return response.data;
    } catch (error) {
      console.error('Error reposting ad:', error);
      throw error;
    }
  }

  // Get moderation statistics
  static async getModerationStats() {
    try {
      const response = await api.get('/ads/moderation-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching moderation stats:', error);
      throw error;
    }
  }
}

export default AdModerationService;
