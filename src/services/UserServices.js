import api from "../api";

const userService = {
  /**
   * Get all customers (maps to /v1/customer endpoint)
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @param {string} [params.search] - Search term
   * @param {number} [params.skip] - Skip records (legacy)
   * @param {number} [params.limit] - Limit records (legacy)
   * @returns {Promise} List of customers
   */
  getUsersList: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.per_page) queryParams.append("per_page", params.per_page);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.skip) queryParams.append("skip", params.skip);
    if (params?.limit) queryParams.append("limit", params.limit);
    if (params?.role) queryParams.append("role", params.role);
    if (params?.status) queryParams.append("status", params.status);
    
    const url = queryParams.toString()
      ? `/customer?${queryParams.toString()}`
      : `/customer`;
    
    return await api.get(url);
  },

  /**
   * Get customer by ID
   * @param {number} userId - Customer ID
   * @returns {Promise} Customer data
   */
  getUserDetail: async (userId) => {
    return await api.get(`/customer/${userId}`);
  },

  /**
   * Create new customer
   * @param {Object} userData - Customer data
   * @returns {Promise} Created customer
   */
  createUser: async (userData) => {
    return await api.post("/customer", userData);
  },

  /**
   * Update customer
   * @param {number} userId - Customer ID
   * @param {Object} userData - Updated customer data
   * @returns {Promise} Updated customer
   */
  updateUser: async (userId, userData) => {
    return await api.put(`/customer/${userId}`, userData);
  },

  /**
   * Delete customer
   * @param {number} userId - Customer ID
   * @returns {Promise} Delete confirmation
   */
  deleteUser: async (userId) => {
    return await api.delete(`/customer/${userId}`);
  },

  // Legacy methods - keeping for backward compatibility
  updateUserRole: async (userId, role) => {
    return await api.put(`/customer/${userId}`, { role });
  },

  activateUser: async (userId) => {
    return await api.put(`/customer/${userId}`, { status: "active" });
  },

  deactivateUser: async (userId) => {
    return await api.put(`/customer/${userId}`, { status: "inactive" });
  },
};

export default userService;

