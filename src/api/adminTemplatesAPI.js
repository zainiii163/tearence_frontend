import api from './index';

/**
 * Admin business templates — /api/v1/admin/templates
 */
const adminTemplatesAPI = {
  stats: async () => {
    const response = await api.get('/admin/templates/stats');
    return response.data;
  },

  list: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const response = await api.get(`/admin/templates?${query}`);
    return response.data;
  },

  getSettings: async () => {
    const response = await api.get('/admin/templates/settings');
    return response.data;
  },

  updateSettings: async (payload) => {
    const response = await api.put('/admin/templates/settings', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/admin/templates/${id}`, payload);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/admin/templates/${id}`);
    return response.data;
  },

  setPremium: async (id, isPremium = true, days) => {
    const response = await api.post(`/admin/templates/${id}/premium`, {
      is_premium: isPremium,
      days,
    });
    return response.data;
  },

  purchases: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const response = await api.get(`/admin/templates/purchases?${query}`);
    return response.data;
  },
};

export default adminTemplatesAPI;
