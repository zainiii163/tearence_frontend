import Api from '../api';

class PaymentService {
  // Get pricing plans for different ad types
  async getBannerPricingPlans() {
    const response = await Api.get('/v1/banner/pricing-plans');
    return response.data;
  }

  async getAffiliatePricingPlans() {
    const response = await Api.get('/v1/affiliate/pricing-plans');
    return response.data;
  }

  async getAllAdPricingPlans() {
    const response = await Api.get('/v1/ad-pricing-plans');
    return response.data;
  }

  // Process payments for different ad types
  async processBannerPayment(paymentData) {
    const response = await Api.post('/v1/banner/payment', paymentData);
    return response.data;
  }

  async processAffiliatePayment(paymentData) {
    const response = await Api.post('/v1/affiliate/payment', paymentData);
    return response.data;
  }

  // Process job upsell payment
  async processJobUpsellPayment(paymentData) {
    const response = await Api.post('/v1/job-upsell/complete-payment', paymentData);
    return response.data;
  }

  // Process candidate upsell payment
  async processCandidateUpsellPayment(paymentData) {
    const response = await Api.post('/v1/candidate-upsell/complete-payment', paymentData);
    return response.data;
  }

  // Get payment history for user
  async getPaymentHistory() {
    const response = await Api.get('/v1/user/payments');
    return response.data;
  }

  // Get payment history by type
  async getPaymentHistoryByType(paymentType) {
    const response = await Api.get(`/v1/user/payments?type=${paymentType}`);
    return response.data;
  }

  // Validate payment transaction
  async validateTransaction(transactionId, adType) {
    const response = await Api.get(`/v1/payment/validate/${transactionId}`, {
      params: { ad_type: adType }
    });
    return response.data;
  }

  // Get payment details by ID
  async getPaymentDetails(paymentId) {
    const response = await Api.get(`/v1/payment/${paymentId}`);
    return response.data;
  }

  // Refund payment (admin)
  async refundPayment(paymentId, refundData) {
    const response = await Api.post(`/v1/payment/${paymentId}/refund`, refundData);
    return response.data;
  }

  // Get revenue analytics (for admin)
  async getRevenueAnalytics(params = {}) {
    const response = await Api.get('/v1/analytics/revenue', { params });
    return response.data;
  }

  // Get payment analytics (for admin)
  async getPaymentAnalytics(params = {}) {
    const response = await Api.get('/v1/analytics/payments', { params });
    return response.data;
  }

  // Create ad pricing plan (admin)
  async createAdPricingPlan(planData) {
    const response = await Api.post('/v1/ad-pricing-plans', planData);
    return response.data;
  }

  // Update ad pricing plan (admin)
  async updateAdPricingPlan(planId, planData) {
    const response = await Api.put(`/v1/ad-pricing-plans/${planId}`, planData);
    return response.data;
  }

  // Delete ad pricing plan (admin)
  async deleteAdPricingPlan(planId) {
    const response = await Api.delete(`/v1/ad-pricing-plans/${planId}`);
    return response.data;
  }

  // Get pricing plan by ID
  async getPricingPlanById(planId) {
    const response = await Api.get(`/v1/ad-pricing-plans/${planId}`);
    return response.data;
  }

  // Get pricing plans by category
  async getPricingPlansByCategory(category) {
    const response = await Api.get(`/v1/ad-pricing-plans?category=${category}`);
    return response.data;
  }
}

const paymentService = new PaymentService();

export default paymentService;
