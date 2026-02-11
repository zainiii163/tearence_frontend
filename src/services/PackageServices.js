import Api from "../api";

const packageService = {
  /**
   * Get all listing packages
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @param {number} [params.skip] - Skip records (legacy)
   * @param {number} [params.limit] - Limit records (legacy)
   * @returns {Promise} List of packages
   */
  getPackageList: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.per_page) queryParams.append("per_page", params.per_page);
    if (params?.skip) queryParams.append("skip", params.skip);
    if (params?.limit) queryParams.append("limit", params.limit);

    const url = queryParams.toString()
      ? `/v1/listing-package?${queryParams.toString()}`
      : `/v1/listing-package`;
    
    return await Api.get(url);
  },

  /**
   * Get package by ID
   * @param {number} id - Package ID
   * @returns {Promise} Package data
   */
  getPackageById: async (id) => {
    return await Api.get(`/v1/listing-package/${id}`);
  },

  /**
   * Create new package
   * @param {Object} data - Package data
   * @returns {Promise} Created package
   */
  createPackage: async (data) => {
    return await Api.post("/v1/listing-package", data);
  },

  /**
   * Update package
   * @param {number} id - Package ID
   * @param {Object} data - Updated package data
   * @returns {Promise} Updated package
   */
  updatePackage: async (id, data) => {
    return await Api.put(`/v1/listing-package/${id}`, data);
  },

  /**
   * Delete package
   * @param {number} id - Package ID
   * @returns {Promise} Delete confirmation
   */
  deletePackage: async (id) => {
    return await Api.delete(`/v1/listing-package/${id}`);
  },
};

export default packageService;