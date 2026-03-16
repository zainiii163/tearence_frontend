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
      
      const response = await api.get(`/v1/funding/projects?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🎯 Get featured projects
  getFeaturedProjects: async () => {
    try {
      const response = await api.get('/v1/funding/projects/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📈 Get trending projects
  getTrendingProjects: async () => {
    try {
      const response = await api.get('/v1/funding/projects/trending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ⏰ Get projects ending soon
  getEndingSoonProjects: async () => {
    try {
      const response = await api.get('/v1/funding/projects/ending-soon');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Get single project details
  getProject: async (id) => {
    try {
      const response = await api.get(`/v1/funding/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📝 Create new project
  createProject: async (formData) => {
    try {
      const response = await api.post('/v1/funding/projects', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ✏️ Update project
  updateProject: async (id, formData) => {
    try {
      const response = await api.put(`/v1/funding/projects/${id}`, formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🗑️ Delete project
  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/v1/funding/projects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📂 Get project categories
  getCategories: async () => {
    try {
      const response = await api.get('/v1/funding/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 💰 Get upsell plans
  getUpsellPlans: async () => {
    try {
      const response = await api.get('/v1/funding/upsell-plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🚀 Purchase upsell for project
  purchaseUpsell: async (projectId, planId) => {
    try {
      const response = await api.post(`/v1/funding/projects/${projectId}/upsell`, { plan_id: planId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📊 Get project statistics
  getProjectStats: async (projectId) => {
    try {
      const response = await api.get(`/v1/funding/projects/${projectId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 💝 Get project rewards
  getRewards: async (projectId) => {
    try {
      const response = await api.get(`/v1/funding/projects/${projectId}/rewards`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🎁 Create project reward
  createReward: async (projectId, rewardData) => {
    try {
      const response = await api.post(`/v1/funding/projects/${projectId}/rewards`, rewardData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 📈 Get platform statistics
  getPlatformStats: async () => {
    try {
      const response = await api.get('/v1/funding/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // 🔍 Search projects
  searchProjects: async (query, filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      // Add additional filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await api.get(`/v1/funding/search?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default fundingService;
