import Api from '../api';

/**
 * Shared ratings/reviews API for marketplace pages.
 * Types: business | resort | book | store | property | vehicle | buy-sell |
 *        event | venue | sponsored | featured | image | job
 * Services still use /reviews/service/{id}.
 */
const siteReviewsAPI = {
  async list(type, id, params = {}) {
    const { data } = await Api.get(`/site-reviews/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, {
      params,
    });
    return data;
  },

  async create(type, id, payload) {
    const { data } = await Api.post(
      `/site-reviews/${encodeURIComponent(type)}/${encodeURIComponent(id)}`,
      payload
    );
    return data;
  },

  async listBusiness(businessId, params = {}) {
    const { data } = await Api.get(`/business/${encodeURIComponent(businessId)}/reviews`, { params });
    return data;
  },

  async createBusiness(businessId, payload) {
    const { data } = await Api.post(`/business/${encodeURIComponent(businessId)}/reviews`, payload);
    return data;
  },
};

export default siteReviewsAPI;
