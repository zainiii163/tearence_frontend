import Api from '../api';

class PaymentService {
  // Get pricing plans for different ad types
  async getBannerPricingPlans() {
    const response = await Api.get('/banner/pricing-plans');
    return response.data;
  }

  async getAffiliatePricingPlans() {
    try {
      const response = await Api.get('/affiliate-programs/affiliates/upsell-plans');
      return response;
    } catch (error) {
      console.error('Error fetching affiliate pricing plans:', error);
      throw error;
    }
  }

  async getAllAdPricingPlans() {
    const response = await Api.get('/ad-pricing-plans');
    return response.data;
  }

  // Process payments for different ad types
  async processBannerPayment(paymentData) {
    const response = await Api.post('/banner/payment', paymentData);
    return response.data;
  }

  async processAffiliatePayment(paymentData) {
    const response = await Api.post('/affiliate-programs/affiliates/purchase', paymentData);
    return response.data;
  }

  // Process job upsell payment
  async processJobUpsellPayment(paymentData) {
    const response = await Api.post('/job-upsell/complete-payment', paymentData);
    return response.data;
  }

  // Process candidate upsell payment
  async processCandidateUpsellPayment(paymentData) {
    const response = await Api.post('/candidate-upsell/complete-payment', paymentData);
    return response.data;
  }

  // Get payment history for user
  async getPaymentHistory() {
    const response = await Api.get('/user/payments');
    return response.data;
  }

  // Get payment history by type
  async getPaymentHistoryByType(paymentType) {
    const response = await Api.get(`/user/payments?type=${paymentType}`);
    return response.data;
  }

  // Validate payment transaction
  async validateTransaction(transactionId, adType) {
    const response = await Api.get(`/payment/validate/${transactionId}`, {
      params: { ad_type: adType }
    });
    return response.data;
  }

  // Get payment details by ID
  async getPaymentDetails(paymentId) {
    const response = await Api.get(`/payment/${paymentId}`);
    return response.data;
  }

  // Refund payment (admin)
  async refundPayment(paymentId, refundData) {
    const response = await Api.post(`/payment/${paymentId}/refund`, refundData);
    return response.data;
  }

  // Get revenue analytics (for admin)
  async getRevenueAnalytics(params = {}) {
    const response = await Api.get('/analytics/revenue', { params });
    return response.data;
  }

  // Get payment analytics (for admin)
  async getPaymentAnalytics(params = {}) {
    const response = await Api.get('/analytics/payments', { params });
    return response.data;
  }

  // Create ad pricing plan (admin)
  async createAdPricingPlan(planData) {
    const response = await Api.post('/ad-pricing-plans', planData);
    return response.data;
  }

  // Update ad pricing plan (admin)
  async updateAdPricingPlan(planId, planData) {
    const response = await Api.put(`/ad-pricing-plans/${planId}`, planData);
    return response.data;
  }

  // Delete ad pricing plan (admin)
  async deleteAdPricingPlan(planId) {
    const response = await Api.delete(`/ad-pricing-plans/${planId}`);
    return response.data;
  }

  // Get pricing plan by ID
  async getPricingPlanById(planId) {
    const response = await Api.get(`/ad-pricing-plans/${planId}`);
    return response.data;
  }

  // Get pricing plans by category
  async getPricingPlansByCategory(category) {
    const response = await Api.get(`/ad-pricing-plans?category=${category}`);
    return response.data;
  }
}

const paymentService = new PaymentService();

export default paymentService;
