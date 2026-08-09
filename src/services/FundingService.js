import api from "../api";

const fundingService = {
  // 📊 Get all projects with filtering and sorting
  getProjects: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/funding?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🎯 Get featured projects
  getFeaturedProjects: async () => {
    try {
      const response = await api.get('/funding/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📈 Get trending projects
  getTrendingProjects: async () => {
    try {
      const response = await api.get('/funding/trending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ⏰ Get projects ending soon
  getEndingSoonProjects: async () => {
    try {
      const response = await api.get('/funding/ending-soon');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Get single project details
  getProject: async (id) => {
    try {
      const response = await api.get(`/funding/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📝 Create new project
  createProject: async (formData) => {
    try {
      const response = await api.post('/funding', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ✏️ Update project
  updateProject: async (id, formData) => {
    try {
      const response = await api.put(`/funding/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🗑️ Delete project
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/funding/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📂 Get project metadata (categories, types, etc.)
  getMetadata: async () => {
    try {
      const response = await api.get('/funding/metadata');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // � Purchase upsell for project
  purchaseUpsell: async (projectId, upsellData) => {
    try {
      const response = await api.post(`/funding/${projectId}/upsell`, upsellData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // � Get my projects
  getMyProjects: async () => {
    try {
      const response = await api.get('/funding/my-projects/list');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // � Add reward to project
  addReward: async (projectId, rewardData) => {
    try {
      const response = await api.post(`/funding/${projectId}/rewards`, rewardData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 💝 Make a pledge to a project
  makePledge: async (projectId, pledgeData) => {
    try {
      const response = await api.post(`/funding-pledges/${projectId}`, pledgeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ✅ Confirm PayPal payment for a pending pledge
  confirmPledgePayment: async (pledgeId, paymentData) => {
    try {
      const response = await api.post(`/funding-pledges/${pledgeId}/confirm-payment`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Get my pledges
  getMyPledges: async () => {
    try {
      const response = await api.get('/funding-pledges/my/pledges');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // � Get project backers/pledges
  getProjectPledges: async (projectId, includeAnonymous = false) => {
    try {
      const params = includeAnonymous ? '?include_anonymous=true' : '';
      const response = await api.get(`/funding-pledges/project/${projectId}/backers${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Search projects
  searchProjects: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add search query as category filter for now since no search endpoint exists
      if (query) {
        // For now, we'll use the main projects endpoint with filters
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== '') {
            params.append(key, filters[key]);
          }
        });
      }
      
      const response = await api.get(`/funding?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default fundingService;
