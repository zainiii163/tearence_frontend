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
   * A signed-in user requests deletion of their OWN account.
   * Deletion is not immediate — an admin reviews and approves it. The account
   * stays usable until then.
   * @param {number} userId - The current customer's ID
   * @returns {Promise} Request confirmation
   */
  requestAccountDeletion: async (userId) => {
    return await api.post(`/customer/${userId}/request-deletion`);
  },

  /**
   * Admin: delete (approve deletion of) a customer. Soft-deletes server-side —
   * the row is kept with a deleted flag, and the user can no longer sign in.
   * @param {number} userId - Customer ID
   * @returns {Promise} Delete confirmation
   */
  deleteUser: async (userId) => {
    return await api.delete(`/customer/${userId}`);
  },

  /**
   * Admin: list accounts awaiting deletion approval.
   * @returns {Promise} Pending deletion requests
   */
  getDeletionRequests: async () => {
    return await api.get(`/customer/deletion-requests`);
  },

  /**
   * Admin: reject a pending deletion request (the account stays active).
   * @param {number} userId - Customer ID
   * @returns {Promise} Reject confirmation
   */
  rejectDeletion: async (userId) => {
    return await api.post(`/customer/${userId}/reject-deletion`);
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

