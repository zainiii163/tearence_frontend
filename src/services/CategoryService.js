import api from "../api";

/**
 * Category / marketplace hub service
 */
const categoryService = {
  getPostingForm: async (categoryId) => {
    return await api.get(`/category/${categoryId}/posting-form`);
  },

  /** Homepage marketplace hub tiles with images + listing counts */
  getMarketplaceHubs: async () => {
    const response = await api.get("/marketplace-hubs");
    return response.data;
  },
};

export default categoryService;
