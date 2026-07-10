import Api from '../api';

class ClassifiedService {
  // Get all classified ads
  async getAllClassifieds(params = {}) {
    const response = await Api.get('/api/classified', { params });
    return response.data;
  }

  // Get classified by slug
  async getClassifiedBySlug(slug) {
    const response = await Api.get(`/api/classified/${slug}`);
    return response.data;
  }

  // Get my classified ads
  async getMyClassifieds(params = {}) {
    const response = await Api.get('/api/classified/my-classifieds', { params });
    return response.data;
  }

  // Create new classified ad
  async createClassified(formData) {
    const response = await Api.post('/api/classified', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Update classified ad
  async updateClassified(id, formData) {
    const response = await Api.put(`/api/classified/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Delete classified ad
  async deleteClassified(id) {
    const response = await Api.delete(`/api/classified/${id}`);
    return response.data;
  }

  // Mark classified as sold
  async markAsSold(id) {
    const response = await Api.put(`/api/classified/${id}/mark-sold`);
    return response.data;
  }

  // Get classified categories
  async getClassifiedCategories() {
    const response = await Api.get('/api/classified/categories');
    return response.data;
  }

  // Search classified ads
  async searchClassifieds(searchParams) {
    const response = await Api.post('/api/classified/search', searchParams);
    return response.data;
  }

  // Get classified analytics
  async getClassifiedAnalytics(id) {
    const response = await Api.get(`/api/classified/${id}/analytics`);
    return response.data;
  }

  // Upload classified images
  async uploadImages(id, formData) {
    const response = await Api.post(`/api/classified/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Get pricing plans for classified ads
  async getClassifiedPricingPlans() {
    const response = await Api.get('/api/classified/pricing-plans');
    return response.data;
  }

  // Process payment for classified ad
  async processClassifiedPayment(paymentData) {
    const response = await Api.post('/api/classified/payment', paymentData);
    return response.data;
  }

  // Renew classified ad
  async renewClassified(id, paymentData) {
    const response = await Api.post(`/api/classified/${id}/renew`, paymentData);
    return response.data;
  }

  // Get featured classified ads
  async getFeaturedClassifieds(params = {}) {
    const response = await Api.get('/api/classified/featured', { params });
    return response.data;
  }

  // Get classified ads by category
  async getClassifiedsByCategory(categoryId, params = {}) {
    const response = await Api.get(`/api/classified/category/${categoryId}`, { params });
    return response.data;
  }

  // Get classified ads by location
  async getClassifiedsByLocation(locationId, params = {}) {
    const response = await Api.get(`/api/classified/location/${locationId}`, { params });
    return response.data;
  }

  // Get classified ads by user
  async getClassifiedsByUser(userId, params = {}) {
    const response = await Api.get(`/api/classified/user/${userId}`, { params });
    return response.data;
  }

  // Validate classified ad data
  async validateClassifiedData(data) {
    const response = await Api.post('/api/classified/validate', data);
    return response.data;
  }

  // Get classified ad statistics
  async getClassifiedStats(id) {
    const response = await Api.get(`/api/classified/${id}/stats`);
    return response.data;
  }

  // Report classified ad
  async reportClassified(id, reportData) {
    const response = await Api.post(`/api/classified/${id}/report`, reportData);
    return response.data;
  }

  // Contact classified ad owner
  async contactOwner(id, contactData) {
    const response = await Api.post(`/api/classified/${id}/contact`, contactData);
    return response.data;
  }

  // Add classified to favorites
  async addToFavorites(id) {
    const response = await Api.post(`/api/classified/${id}/favorite`);
    return response.data;
  }

  // Remove classified from favorites
  async removeFromFavorites(id) {
    const response = await Api.delete(`/api/classified/${id}/favorite`);
    return response.data;
  }

  // Get favorite classified ads
  async getFavoriteClassifieds(params = {}) {
    const response = await Api.get('/api/classified/favorites', { params });
    return response.data;
  }

  // Boost classified ad
  async boostClassified(id, boostData) {
    const response = await Api.post(`/api/classified/${id}/boost`, boostData);
    return response.data;
  }

  // Get classified ad boost options
  async getBoostOptions() {
    const response = await Api.get('/api/classified/boost-options');
    return response.data;
  }
}

const classifiedService = new ClassifiedService();

export default classifiedService;
