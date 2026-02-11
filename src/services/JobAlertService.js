import api from "../api";

/**
 * Job Alert Service
 * 
 * Provides methods to manage job alerts for authenticated users.
 * Base URL: https://api.worldwideadverts.info/api/v1
 */

const jobAlertService = {
  /**
   * Get all job alerts for authenticated user
   * @param {Object} [params] - Query parameters
   * @param {boolean} [params.is_active] - Filter by active status
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.per_page] - Items per page
   * @returns {Promise} Array of job alerts
   */
  getJobAlerts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.is_active !== undefined) queryParams.append("is_active", params.is_active);
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);

      const url = queryParams.toString() 
        ? `/v1/job-alert?${queryParams.toString()}`
        : `/v1/job-alert`;
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      // Enhanced error handling for job alerts
      if (error.status === 401) {
        console.warn('Job Alerts: User not authenticated');
        throw new Error('Authentication required for job alerts');
      } else if (error.status === 404) {
        console.info('Job Alerts: Endpoint not available - using mock data');
        // Let API interceptor handle 404 with mock data
        throw error;
      } else {
        console.error('Job Alerts: Unexpected error:', error);
        throw error.response?.data || error;
      }
    }
  },

  /**
   * Get single job alert by ID
   * @param {number} id - Job alert ID
   * @returns {Promise} Job alert data
   */
  getJobAlert: async (id) => {
    try {
      const response = await api.get(`/v1/job-alert/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create new job alert
   * @param {Object} data - Job alert data
   * @param {string} data.name - Alert name (required)
   * @param {Array<string>} data.keywords - Keywords array (required)
   * @param {number} [data.location_id] - Location ID
   * @param {number} [data.category_id] - Category ID
   * @param {Array<string>} [data.job_type] - Job types array (e.g., ['full-time', 'part-time'])
   * @param {number} [data.salary_min] - Minimum salary
   * @param {number} [data.salary_max] - Maximum salary
   * @param {string} [data.frequency] - Alert frequency ('daily' or 'weekly')
   * @param {boolean} [data.is_active] - Active status (default: true)
   * @param {string} [data.notification_email] - Email for notifications
   * @returns {Promise} Created job alert
   */
  createJobAlert: async (data) => {
    try {
      const response = await api.post("/v1/job-alert", data);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update job alert
   * @param {number} id - Job alert ID
   * @param {Object} data - Updated data (same structure as createJobAlert)
   * @returns {Promise} Updated job alert
   */
  updateJobAlert: async (id, data) => {
    try {
      const response = await api.put(`/v1/job-alert/${id}`, data);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete job alert
   * @param {number} id - Job alert ID
   * @returns {Promise} Delete confirmation
   */
  deleteJobAlert: async (id) => {
    try {
      const response = await api.delete(`/v1/job-alert/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get matching jobs for an alert
   * @param {number} id - Job alert ID
   * @param {Object} [params] - Pagination params
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @returns {Promise} Matching jobs
   */
  getMatchingJobs: async (id, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);

      const url = queryParams.toString()
        ? `/v1/job-alert/${id}/matching-jobs?${queryParams.toString()}`
        : `/v1/job-alert/${id}/matching-jobs`;
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Toggle job alert active status
   * @param {number} id - Job alert ID
   * @returns {Promise} Updated job alert
   */
  toggleJobAlertActive: async (id) => {
    try {
      const response = await api.post(`/v1/job-alert/${id}/toggle-active`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get alerts ready for notification
   * @param {Object} [params] - Query parameters
   * @returns {Promise} Alerts ready for notification
   */
  getAlertsReadyForNotification: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);

      const url = queryParams.toString()
        ? `/v1/job-alert-notifications/ready?${queryParams.toString()}`
        : `/v1/job-alert-notifications/ready`;
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Mark alert as notified
   * @param {number} id - Alert notification ID
   * @returns {Promise} Success response
   */
  markAlertAsNotified: async (id) => {
    try {
      const response = await api.post(`/v1/job-alert-notifications/${id}/notified`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default jobAlertService;


