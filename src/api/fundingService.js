import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // CORS configuration
  withCredentials: false, // Don't send credentials for cross-origin requests
  crossdomain: true, // Enable cross-domain requests
  mode: 'cors' // Explicitly set CORS mode
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funding API service
export const fundingService = {
  // Project Management
  projects: {
    // Get all projects with filtering
    getProjects: async (filters = {}) => {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await apiClient.get(`/projects?${params}`);
      return response.data;
    },

    // Get single project
    getProject: async (projectId) => {
      const response = await apiClient.get(`/projects/${projectId}`);
      return response.data;
    },

    // Create new project
    createProject: async (projectData) => {
      const response = await apiClient.post('/projects', projectData);
      return response.data;
    },

    // Update project
    updateProject: async (projectId, projectData) => {
      const response = await apiClient.put(`/projects/${projectId}`, projectData);
      return response.data;
    },

    // Delete project
    deleteProject: async (projectId) => {
      const response = await apiClient.delete(`/projects/${projectId}`);
      return response.data;
    },

    // Get current user's projects
    getMyProjects: async () => {
      const response = await apiClient.get('/projects/my');
      return response.data;
    },

    // Submit project for review
    submitProject: async (projectId) => {
      const response = await apiClient.post(`/projects/${projectId}/submit`);
      return response.data;
    },

    // Get featured projects
    getFeaturedProjects: async () => {
      const response = await apiClient.get('/projects/featured');
      return response.data;
    }
  },

  // Project Details Management
  fundingDetails: {
    // Get funding details
    getFundingDetails: async (projectId) => {
      const response = await apiClient.get(`/projects/${projectId}/funding-details`);
      return response.data;
    },

    // Update funding details
    updateFundingDetails: async (projectId, details) => {
      const response = await apiClient.put(`/projects/${projectId}/funding-details`, details);
      return response.data;
    }
  },

  verification: {
    // Get verification info
    getVerification: async (projectId) => {
      const response = await apiClient.get(`/projects/${projectId}/verification`);
      return response.data;
    },

    // Update verification
    updateVerification: async (projectId, verificationData) => {
      const response = await apiClient.put(`/projects/${projectId}/verification`, verificationData);
      return response.data;
    }
  },

  rewards: {
    // Get rewards
    getRewards: async (projectId) => {
      const response = await apiClient.get(`/projects/${projectId}/rewards`);
      return response.data;
    },

    // Update rewards
    updateRewards: async (projectId, rewards) => {
      const response = await apiClient.put(`/projects/${projectId}/rewards`, { rewards });
      return response.data;
    }
  },

  marketingAssets: {
    // Get marketing assets
    getMarketingAssets: async (projectId) => {
      const response = await apiClient.get(`/projects/${projectId}/marketing-assets`);
      return response.data;
    },

    // Update marketing assets
    updateMarketingAssets: async (projectId, assets) => {
      const response = await apiClient.put(`/projects/${projectId}/marketing-assets`, assets);
      return response.data;
    }
  },

  // File Management
  documents: {
    // Upload document
    uploadDocument: async (projectId, file, documentType, onUploadProgress) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);
      formData.append('project_id', projectId);

      const config = {
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgress(progress);
          }
        },
      };

      const response = await apiClient.post(`/projects/${projectId}/documents`, formData, config);
      return response.data;
    },

    // Get project documents
    getDocuments: async (projectId) => {
      const response = await apiClient.get(`/projects/${projectId}/documents`);
      return response.data;
    },

    // Delete document
    deleteDocument: async (projectId, documentId) => {
      const response = await apiClient.delete(`/projects/${projectId}/documents/${documentId}`);
      return response.data;
    },

    // General file upload
    uploadFile: async (file, onUploadProgress) => {
      const formData = new FormData();
      formData.append('file', file);

      const config = {
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgress(progress);
          }
        },
      };

      const response = await apiClient.post('/upload', formData, config);
      return response.data;
    },

    // Get file information
    getFileInfo: async (fileUrl) => {
      const response = await apiClient.get(`/file/info?url=${encodeURIComponent(fileUrl)}`);
      return response.data;
    },

    // Delete file
    deleteFile: async (fileUrl) => {
      const response = await apiClient.delete(`/file?url=${encodeURIComponent(fileUrl)}`);
      return response.data;
    }
  },

  // Promotion System
  upsells: {
    // Get promotion plans
    getPlans: async () => {
      const response = await apiClient.get('/metadata/promotion-plans');
      return response.data;
    },

    // Purchase promotion
    purchase: async (projectId, planId) => {
      const response = await apiClient.post('/upsells/purchase', {
        project_id: projectId,
        plan_id: planId
      });
      return response.data;
    },

    // Get user's promotions
    getMyUpsells: async () => {
      const response = await apiClient.get('/upsells/my-upsells');
      return response.data;
    },

    // Get project promotions
    getProjectUpsells: async (projectId) => {
      const response = await apiClient.get(`/upsells/project/${projectId}`);
      return response.data;
    },

    // Cancel promotion
    cancelUpsell: async (upsellId) => {
      const response = await apiClient.post(`/upsells/${upsellId}/cancel`);
      return response.data;
    },

    // Get promotion statistics
    getStats: async () => {
      const response = await apiClient.get('/upsells/stats');
      return response.data;
    }
  },

  // Metadata
  metadata: {
    // Get system metadata
    getMetadata: async () => {
      const response = await apiClient.get('/metadata');
      return response.data;
    },

    // Get project types
    getProjectTypes: async () => {
      const response = await apiClient.get('/metadata/project-types');
      return response.data;
    },

    // Get funding models
    getFundingModels: async () => {
      const response = await apiClient.get('/metadata/funding-models');
      return response.data;
    },

    // Get promotion plans
    getPromotionPlans: async () => {
      const response = await apiClient.get('/metadata/promotion-plans');
      return response.data;
    }
  }
};

export default fundingService;
