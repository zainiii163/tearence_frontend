// Affiliates Hub API Integration
// Comprehensive API service for the Affiliates Hub marketplace system

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info';

class AffiliatesAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Helper method to get headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

  // Helper method to make API requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api/v1/affiliates${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    const response = await fetch(url, config);
    return this.handleResponse(response);
  }

  // ==================== CATEGORIES ====================

  // Get all affiliate categories
  async getCategories() {
    return this.request('/categories');
  }

  // ==================== BUSINESS OFFERS ====================

  // Browse business offers with filters
  async getBusinessOffers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/business-offers${queryString ? `?${queryString}` : ''}`);
  }

  // Get single business offer
  async getBusinessOffer(id) {
    return this.request(`/business-offers/${id}`);
  }

  // Create business offer (authenticated)
  async createBusinessOffer(offerData) {
    return this.request('/business-offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  }

  // Update business offer (authenticated)
  async updateBusinessOffer(id, offerData) {
    return this.request(`/business-offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(offerData),
    });
  }

  // Delete business offer (authenticated)
  async deleteBusinessOffer(id) {
    return this.request(`/business-offers/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== USER AFFILIATE POSTS ====================

  // Browse user affiliate posts with filters
  async getUserPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/user-posts${queryString ? `?${queryString}` : ''}`);
  }

  // Get single user post
  async getUserPost(id) {
    return this.request(`/user-posts/${id}`);
  }

  // Create user affiliate post (authenticated)
  async createUserPost(postData) {
    return this.request('/user-posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  // Update user affiliate post (authenticated)
  async updateUserPost(id, postData) {
    return this.request(`/user-posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  // Delete user affiliate post (authenticated)
  async deleteUserPost(id) {
    return this.request(`/user-posts/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== UPSELL PLANS ====================

  // Get all upsell plans
  async getUpsellPlans() {
    return this.request('/upsell-plans');
  }

  // ==================== APPLICATIONS ====================

  // Apply to promote business offer (authenticated)
  async applyToPromote(offerId, applicationData) {
    return this.request(`/business-offers/${offerId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  // Get current user's applications (authenticated)
  async getMyApplications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/my-applications${queryString ? `?${queryString}` : ''}`);
  }

  // ==================== USER CONTENT MANAGEMENT ====================

  // Get current user's business offers (authenticated)
  async getMyBusinessOffers() {
    return this.request('/my-business-offers');
  }

  // Get current user's affiliate posts (authenticated)
  async getMyUserPosts() {
    return this.request('/my-user-posts');
  }

  // ==================== SEARCH ====================

  // Search affiliate content
  async searchAffiliateContent(query, type = 'all') {
    return this.request(`/search?q=${encodeURIComponent(query)}&type=${type}`);
  }

  // ==================== ANALYTICS ====================

  // Track click on affiliate link
  async trackClick(type, id) {
    return this.request('/track-click', {
      method: 'POST',
      body: JSON.stringify({ type, id }),
    });
  }

  // ==================== FILE UPLOAD ====================

  // Upload promotional assets
  async uploadFile(file, type = 'promotional_assets') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const url = `${this.baseURL}/api/v1/affiliates/upload`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: formData,
    });

    return this.handleResponse(response);
  }

  // ==================== BULK OPERATIONS ====================

  // Bulk update posts (authenticated)
  async bulkUpdatePosts(postIds, updateData) {
    return this.request('/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ post_ids: postIds, update_data: updateData }),
    });
  }

  // ==================== ANALYTICS DASHBOARD ====================

  // Get analytics dashboard data (authenticated)
  async getAnalyticsDashboard() {
    return this.request('/analytics/dashboard');
  }

  // Get detailed analytics for a post (authenticated)
  async getPostAnalytics(postId, type) {
    return this.request(`/analytics/${type}/${postId}`);
  }

  // ==================== NOTIFICATIONS ====================

  // Get user notifications (authenticated)
  async getNotifications() {
    return this.request('/notifications');
  }

  // Mark notification as read (authenticated)
  async markNotificationRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }

  // ==================== UTILITIES ====================

  // Get platform statistics
  async getPlatformStats() {
    return this.request('/stats');
  }

  // Get trending content
  async getTrendingContent() {
    return this.request('/trending');
  }

  // Get featured content
  async getFeaturedContent() {
    return this.request('/featured');
  }

  // ==================== VALIDATION ====================

  // Validate affiliate link
  async validateAffiliateLink(link) {
    return this.request('/validate-link', {
      method: 'POST',
      body: JSON.stringify({ link }),
    });
  }

  // Check business name availability
  async checkBusinessNameAvailability(name) {
    return this.request('/check-business-name', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }
}

// Create and export a singleton instance
const affiliatesAPI = new AffiliatesAPI();

export default affiliatesAPI;

// Export individual methods for easier importing
export const {
  getCategories,
  getBusinessOffers,
  getBusinessOffer,
  createBusinessOffer,
  updateBusinessOffer,
  deleteBusinessOffer,
  getUserPosts,
  getUserPost,
  createUserPost,
  updateUserPost,
  deleteUserPost,
  getUpsellPlans,
  applyToPromote,
  getMyApplications,
  getMyBusinessOffers,
  getMyUserPosts,
  searchAffiliateContent,
  trackClick,
  uploadFile,
  bulkUpdatePosts,
  getAnalyticsDashboard,
  getPostAnalytics,
  getNotifications,
  markNotificationRead,
  getPlatformStats,
  getTrendingContent,
  getFeaturedContent,
  validateAffiliateLink,
  checkBusinessNameAvailability,
} = affiliatesAPI;
