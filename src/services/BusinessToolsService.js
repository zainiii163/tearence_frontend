import Api from '../api';

const businessToolsService = {
  list: async (params = {}) => {
    const response = await Api.get('/business-tools', { params });
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await Api.get(`/business-tools/${slug}`);
    return response.data;
  },

  purchase: async (payload) => {
    const response = await Api.post('/business-tools/purchase', payload);
    return response.data;
  },

  confirmPayment: async (purchaseId, payload = {}) => {
    const response = await Api.post(`/business-tools/purchases/${purchaseId}/confirm-payment`, payload);
    return response.data;
  },

  myPurchases: async () => {
    const response = await Api.get('/business-tools/my-purchases');
    return response.data;
  },
};

export default businessToolsService;
