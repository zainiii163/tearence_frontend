import Api from "../api";

const campaignService = {
  /**
   * Get all campaigns
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @param {string} [params.search] - Search term
   * @param {number} [params.skip] - Skip records (legacy)
   * @param {number} [params.limit] - Limit records (legacy)
   * @returns {Promise} List of campaigns
   */
  getCampaigns: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.per_page) queryParams.append("per_page", params.per_page);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.skip) queryParams.append("skip", params.skip);
    if (params?.limit) queryParams.append("limit", params.limit);

    const url = queryParams.toString()
      ? `/campaign?${queryParams.toString()}`
      : `/campaign`;
    
    return await Api.get(url);
  },

  /**
   * Get campaign by slug
   * @param {string} slug - Campaign slug
   * @returns {Promise} Campaign data
   */
  getCampaignBySlug: async (slug) => {
    return await Api.get(`/campaign/${slug}`);
  },

  /**
   * Create new campaign
   * @param {Object} data - Campaign data
   * @returns {Promise} Created campaign
   */
  createCampaign: async (data) => {
    return await Api.post("/campaign", data);
  },

  /**
   * Update campaign
   * @param {number} id - Campaign ID
   * @param {Object} data - Updated campaign data
   * @returns {Promise} Updated campaign
   */
  updateCampaign: async (id, data) => {
    return await Api.put(`/campaign/${id}`, data);
  },

  /**
   * Delete campaign
   * @param {number} id - Campaign ID
   * @returns {Promise} Delete confirmation
   */
  deleteCampaign: async (id) => {
    return await Api.delete(`/campaign/${id}`);
  },
};

export default campaignService;
