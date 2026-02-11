import api from "../api";

/**
 * Dashboard Service
 * 
 * Provides methods to fetch dashboard data for users and admins.
 * Base URL: https://api.worldwideadverts.info/api/v1
 */

const dashboardService = {
  /**
   * Get user dashboard data
   * @returns {Promise} Dashboard data with listings, profile, alerts, stats
   * 
   * Response structure:
   * {
   *   data: {
   *     my_listings: Array,
   *     candidate_profile: Object,
   *     job_alerts: Array,
   *     stats: Object,
   *     featured_jobs: Array,
   *     recommended_jobs: Array,
   *     ...
   *   }
   * }
   */
  getUserDashboard: async () => {
    try {
      const response = await api.get("/v1/dashboard/user");
      return response;
    } catch (error) {
      // Enhanced error handling for specific scenarios
      if (error.status === 401) {
        console.warn('Dashboard: User not authenticated');
        throw new Error('Authentication required for dashboard access');
      } else if (error.status === 500) {
        console.error('Dashboard: Server error - using fallback data');
        // Let API interceptor handle 500 with mock data
        throw error;
      } else {
        console.error('Dashboard: Unexpected error:', error);
        throw error.response?.data || error;
      }
    }
  },

  /**
   * Get admin dashboard data
   * @returns {Promise} Admin dashboard data
   * 
   * Response structure:
   * {
   *   data: {
   *     statistics: Object,
   *     recent_activities: Array,
   *     ...
   *   }
   * }
   */
  getAdminDashboard: async () => {
    try {
      const response = await api.get("/v1/dashboard/admin");
      return response;
    } catch (error) {
      // Note: 404s are now handled by API interceptor to return mock success response
      // This catch block is for any other errors
      throw error.response?.data || error;
    }
  },
};

export default dashboardService;


