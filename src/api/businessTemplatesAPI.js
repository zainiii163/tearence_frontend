import api from './index';

/**
 * Business templates API — /api/v1/business-templates
 * Pitch decks, grant packs, business plans per category.
 */
const businessTemplatesAPI = {
  /** Category-page strip: headline + up to 3 packs */
  browse: async (vertical, categorySlug = 'default') => {
    const params = new URLSearchParams({
      vertical,
      category_slug: categorySlug || 'default',
    });
    const response = await api.get(`/business-templates/browse?${params}`);
    return response.data;
  },

  list: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const response = await api.get(`/business-templates?${query}`);
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await api.get(`/business-templates/${slug}`);
    return response.data;
  },

  myTemplates: async (params = {}) => {
    const query = new URLSearchParams(params);
    const response = await api.get(`/business-templates/my-templates?${query}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post('/business-templates', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/business-templates/${id}`, payload);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/business-templates/${id}`);
    return response.data;
  },

  /** Purchase template — returns download_token / download_url (auth required) */
  purchase: async (payload) => {
    const response = await api.post('/business-templates/purchase', payload);
    return response.data;
  },

  myPurchases: async (params = {}) => {
    const query = new URLSearchParams(params);
    const response = await api.get(`/business-templates/my-purchases?${query}`);
    return response.data;
  },

  /** Public premium fee / duration (admin-editable) */
  getSettings: async () => {
    const response = await api.get('/business-templates/settings');
    return response.data;
  },

  /** Promote own listing to premium for one period */
  promote: async (id) => {
    const response = await api.post(`/business-templates/${id}/promote`);
    return response.data;
  },
};

export default businessTemplatesAPI;
