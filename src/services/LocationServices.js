import Api from "../api";

const locationService = {
  /**
   * Get all locations
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @param {string} [params.search] - Search term
   * @returns {Promise} List of locations
   */
  getLocations: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.per_page) queryParams.append("per_page", params.per_page);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.skip) queryParams.append("skip", params.skip);
    if (params?.limit) queryParams.append("limit", params.limit);

    const url = queryParams.toString()
      ? `/v1/location?${queryParams.toString()}`
      : `/v1/location`;
    
    return await Api.get(url);
  },

  /**
   * Get location by ID
   * @param {number} id - Location ID
   * @returns {Promise} Location data
   */
  getLocationById: async (id) => {
    return await Api.get(`/v1/location/${id}`);
  },

  /**
   * Create new location
   * @param {Object} data - Location data
   * @returns {Promise} Created location
   */
  createLocation: async (data) => {
    return await Api.post("/v1/location", data);
  },

  /**
   * Update location
   * @param {number} id - Location ID
   * @param {Object} data - Updated location data
   * @returns {Promise} Updated location
   */
  updateLocation: async (id, data) => {
    return await Api.put(`/v1/location/${id}`, data);
  },

  /**
   * Delete location
   * @param {number} id - Location ID
   * @returns {Promise} Delete confirmation
   */
  deleteLocation: async (id) => {
    return await Api.delete(`/v1/location/${id}`);
  },
};

export default locationService;
