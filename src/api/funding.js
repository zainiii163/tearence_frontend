import api from './index';

// Funding Projects API
export const fundingAPI = {
  // Get all projects with filtering and sorting
  getProjects: async (params = {}) => {
    const response = await api.get('/funding-projects', { params });
    return response.data;
  },

  // Get form metadata (categories, project types, funding models)
  getMetadata: async () => {
    const response = await api.get('/funding-projects/metadata');
    return response.data;
  },

  // Get featured projects
  getFeaturedProjects: async () => {
    const response = await api.get('/funding-projects/featured');
    return response.data;
  },

  // Get trending projects
  getTrendingProjects: async () => {
    const response = await api.get('/funding-projects/trending');
    return response.data;
  },

  // Get projects ending soon
  getEndingSoonProjects: async () => {
    const response = await api.get('/funding-projects/ending-soon');
    return response.data;
  },

  // Get single project details
  getProject: async (id) => {
    const response = await api.get(`/funding-projects/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData) => {
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(projectData).forEach(key => {
      if (key !== 'cover_image' && key !== 'additional_images' && key !== 'identity_document' && key !== 'documents') {
        formData.append(key, projectData[key]);
      }
    });

    // Add cover image
    if (projectData.cover_image) {
      formData.append('cover_image', projectData.cover_image);
    }

    // Add identity document
    if (projectData.identity_document) {
      formData.append('identity_document', projectData.identity_document);
    }

    if (projectData.documents && projectData.documents.length > 0) {
      projectData.documents.forEach((doc, index) => {
        formData.append(`documents[${index}]`, doc);
      });
    }

    const response = await api.post('/funding-projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update project
  updateProject: async (id, projectData) => {
    const response = await api.put(`/funding-projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await api.delete(`/funding-projects/${id}`);
    return response.data;
  },

  // Get my projects
  getMyProjects: async () => {
    const response = await api.get('/funding-projects/my-projects');
    return response.data;
  },

  // Add reward to project
  addReward: async (projectId, rewardData) => {
    const response = await api.post(`/funding-projects/${projectId}/rewards`, rewardData);
    return response.data;
  },

  // Purchase upsell for project
  purchaseUpsell: async (projectId, upsellData) => {
    const response = await api.post(`/funding-projects/${projectId}/purchase-upsell`, upsellData);
    return response.data;
  }
};

// Funding Pledges API
export const fundingPledgesAPI = {
  // Make a pledge
  makePledge: async (projectId, pledgeData) => {
    const response = await api.post(`/funding-pledges`, pledgeData);
    return response.data;
  },

  // Get pledge details
  getPledge: async (pledgeId) => {
    const response = await api.get(`/funding-pledges/${pledgeId}`);
    return response.data;
  },

  // Get my pledges
  getMyPledges: async () => {
    const response = await api.get('/funding-pledges/my-pledges');
    return response.data;
  },

  // Update pledge status
  updatePledgeStatus: async (pledgeId, statusData) => {
    const response = await api.put(`/funding-pledges/${pledgeId}/status`, statusData);
    return response.data;
  },

  // Cancel pledge
  cancelPledge: async (pledgeId) => {
    const response = await api.delete(`/funding-pledges/${pledgeId}`);
    return response.data;
  },

  // Get project backers
  getProjectBackers: async (projectId) => {
    const response = await api.get(`/funding-pledges/project/${projectId}/backers`);
    return response.data;
  }
};

// Funding Upsells API
export const fundingUpsellsAPI = {
  // Get available upsell plans
  getPlans: async () => {
    const response = await api.get('/funding-upsells');
    return response.data;
  },

  // Get plan comparison
  getComparison: async () => {
    const response = await api.get('/funding-upsells/comparison');
    return response.data;
  },

  // Get personalized recommendation
  getRecommendation: async (projectId) => {
    const response = await api.get('/funding-upsells/recommendation', {
      params: { project_id: projectId }
    });
    return response.data;
  },

  // Purchase upsell
  purchaseUpsell: async (upsellData) => {
    const response = await api.post('/funding-upsells', upsellData);
    return response.data;
  },

  // Get my upsells
  getMyUpsells: async () => {
    const response = await api.get('/funding-upsells/my-upsells');
    return response.data;
  },

  // Get upsell statistics
  getStats: async () => {
    const response = await api.get('/funding-upsells/stats');
    return response.data;
  },

  // Cancel upsell
  cancelUpsell: async (upsellId) => {
    const response = await api.post(`/funding-upsells/${upsellId}/cancel`);
    return response.data;
  }
};

// Combined funding service for easy access
export const fundingService = {
  ...fundingAPI,
  ...fundingPledgesAPI,
  ...fundingUpsellsAPI
};

export default fundingService;
