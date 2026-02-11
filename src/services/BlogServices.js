import Api from "../api";

const blogService = {
  /**
   * Get all blogs
   * @param {Object} [params] - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.per_page] - Items per page
   * @param {number} [params.skip] - Skip records (legacy)
   * @param {number} [params.limit] - Limit records (legacy)
   * @param {string} [params.search] - Search term
   * @returns {Promise} List of blogs
   */
  getBlogs: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.per_page) queryParams.append("per_page", params.per_page);
    if (params?.skip) queryParams.append("skip", params.skip);
    if (params?.limit) queryParams.append("limit", params.limit);
    if (params?.search) queryParams.append("search", params.search);

    const url = queryParams.toString()
      ? `/v1/blog?${queryParams.toString()}`
      : `/v1/blog`;
    
    return await Api.get(url);
  },

  /**
   * Get blog by slug
   * @param {string} slug - Blog slug or ID
   * @returns {Promise} Blog data
   */
  getBlogBySlug: async (slug) => {
    return await Api.get(`/v1/blog/${slug}`);
  },

  /**
   * Create new blog
   * @param {Object} data - Blog data
   * @returns {Promise} Created blog
   */
  createBlog: async (data) => {
    return await Api.post("/v1/blog", data);
  },

  /**
   * Update blog
   * @param {number} id - Blog ID
   * @param {Object} data - Updated blog data
   * @returns {Promise} Updated blog
   */
  updateBlog: async (id, data) => {
    return await Api.put(`/v1/blog/${id}`, data);
  },

  /**
   * Delete blog
   * @param {number} id - Blog ID
   * @returns {Promise} Delete confirmation
   */
  deleteBlog: async (id) => {
    return await Api.delete(`/v1/blog/${id}`);
  },
};

export default blogService;
