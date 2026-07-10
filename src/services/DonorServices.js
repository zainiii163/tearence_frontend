import Api from "../api";

const donorService = {
  /**
   * Get all donors
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @param {string} [params.search] - Search term
   * @param {number} [params.skip] - Skip records (legacy)
   * @param {number} [params.limit] - Limit records (legacy)
   * @returns {Promise} List of donors
   */
  getDonors: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.per_page) queryParams.append("per_page", params.per_page);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.skip) queryParams.append("skip", params.skip);
    if (params?.limit) queryParams.append("limit", params.limit);

    const url = queryParams.toString()
      ? `/donor?${queryParams.toString()}`
      : `/donor`;
    
    return await Api.get(url);
  },

  /**
   * Get donor by ID
   * @param {number} id - Donor ID
   * @returns {Promise} Donor data
   */
  getDonorById: async (id) => {
    return await Api.get(`/donor/${id}`);
  },

  /**
   * Create new donor
   * @param {Object} data - Donor data
   * @returns {Promise} Created donor
   */
  createDonor: async (data) => {
    return await Api.post("/donor", data);
  },

  /**
   * Update donor
   * @param {number} id - Donor ID
   * @param {Object} data - Updated donor data
   * @returns {Promise} Updated donor
   */
  updateDonor: async (id, data) => {
    return await Api.put(`/donor/${id}`, data);
  },

  /**
   * Delete donor
   * @param {number} id - Donor ID
   * @returns {Promise} Delete confirmation
   */
  deleteDonor: async (id) => {
    return await Api.delete(`/donor/${id}`);
  },
};

export default donorService;
