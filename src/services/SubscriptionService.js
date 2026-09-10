import api from "../api";

const cacheBuster = () => `?_t=${Date.now()}`;

const subscriptionService = {
  getPlans: async () => {
    try {
      const response = await api.get('/subscriptions/plans' + cacheBuster());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getStatus: async () => {
    try {
      const response = await api.get('/subscriptions/status' + cacheBuster());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getEntitlements: async () => {
    try {
      const response = await api.get('/subscriptions/entitlements' + cacheBuster());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  purchase: async (planId, paymentId, paymentMethod) => {
    try {
      const response = await api.post('/subscriptions/purchase', {
        plan_id: planId,
        payment_id: paymentId,
        payment_method: paymentMethod,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  cancel: async () => {
    try {
      const response = await api.post('/subscriptions/cancel');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  checkEntitlement: async (type) => {
    try {
      const response = await api.post('/subscriptions/check-entitlement', { type });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  consumeEntitlement: async (type) => {
    try {
      const response = await api.post('/subscriptions/consume-entitlement', { type });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default subscriptionService;
