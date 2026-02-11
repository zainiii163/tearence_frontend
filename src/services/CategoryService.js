import api from "../api";

/**
 * Category Service
 * 
 * Provides methods to fetch category data and posting forms.
 */

const categoryService = {
  /**
   * Get category-specific posting form configuration
   * @param {number} categoryId - Category ID
   * @returns {Promise} Posting form configuration
   * 
   * Response structure:
   * {
   *   data: {
   *     fields: Array, // Form fields configuration
   *     filters: Array, // Filter configuration
   *     ...
   *   }
   * }
   */
  getPostingForm: async (categoryId) => {
    return await api.get(`/v1/category/${categoryId}/posting-form`);
  },
};

export default categoryService;
