import api from "../api";

const jobService = {
  /**
   * Activate job upsell
   * @param {number} listingId - Job listing ID
   * @param {Object} upsellData - Upsell data containing upsell_type and duration_days
   * @returns {Promise} API response
   */
  activateJobUpsell: async (listingId, upsellData) => {
    try {
      const response = await api.post(`/v1/job-upsell`, {
        listing_id: listingId,
        ...upsellData
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get job listings
   * @param {Object} params - Query parameters
   * @returns {Promise} Job listings
   */
  getJobListings: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.location) queryParams.append("location", params.location);
      if (params?.category) queryParams.append("category", params.category);
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      
      const url = queryParams.toString() 
        ? `/v1/jobs?${queryParams.toString()}`
        : `/v1/jobs`;
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create job listing
   * @param {Object} jobData - Job data
   * @returns {Promise} Created job listing
   */
  createJobListing: async (jobData) => {
    try {
      const response = await api.post('/v1/jobs', jobData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update job listing
   * @param {number} jobId - Job ID
   * @param {Object} jobData - Updated job data
   * @returns {Promise} Updated job listing
   */
  updateJobListing: async (jobId, jobData) => {
    try {
      const response = await api.put(`/v1/jobs/${jobId}`, jobData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete job listing
   * @param {number} jobId - Job ID
   * @returns {Promise} API response
   */
  deleteJobListing: async (jobId) => {
    try {
      const response = await api.delete(`/v1/jobs/${jobId}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get job by ID
   * @param {number} jobId - Job ID
   * @returns {Promise} Job details
   */
  getJobById: async (jobId) => {
    try {
      const response = await api.get(`/v1/jobs/${jobId}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default jobService;
