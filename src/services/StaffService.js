import api from "../api";

/**
 * Staff Management Service
 * 
 * Provides methods to manage staff members for business/store users.
 */

const staffService = {
  /**
   * Get staff members for a business/store
   * @param {Object} params - Query parameters
   * @param {number} [params.business_id] - Business ID
   * @param {number} [params.store_id] - Store ID
   * @returns {Promise} List of staff members
   */
  getStaff: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.business_id) queryParams.append("business_id", params.business_id);
    if (params.store_id) queryParams.append("store_id", params.store_id);
    
    const url = queryParams.toString()
      ? `/v1/staff?${queryParams.toString()}`
      : `/v1/staff`;
    
    return await api.get(url);
  },

  /**
   * Get user's staff memberships
   * @returns {Promise} List of staff memberships
   */
  getMyMemberships: async () => {
    return await api.get("/v1/staff/my-memberships");
  },

  /**
   * Add staff member
   * @param {Object} staffData - Staff member data
   * @param {string} staffData.email - Staff member email
   * @param {string} staffData.role - Role (admin, editor, viewer)
   * @param {number} [staffData.business_id] - Business ID
   * @param {number} [staffData.store_id] - Store ID
   * @param {Object} [staffData.permissions] - Permissions object
   * @returns {Promise} Created staff member
   */
  addStaff: async (staffData) => {
    return await api.post("/v1/staff", staffData);
  },

  /**
   * Update staff member
   * @param {number} staffId - Staff member ID
   * @param {Object} staffData - Updated staff member data
   * @returns {Promise} Updated staff member
   */
  updateStaff: async (staffId, staffData) => {
    return await api.put(`/v1/staff/${staffId}`, staffData);
  },

  /**
   * Remove staff member
   * @param {number} staffId - Staff member ID
   * @returns {Promise} Delete confirmation
   */
  removeStaff: async (staffId) => {
    return await api.delete(`/v1/staff/${staffId}`);
  },
};

export default staffService;
