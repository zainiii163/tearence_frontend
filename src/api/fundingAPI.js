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
  withCredentials: false,
  crossdomain: true,
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

// Funding API service - Real API data only, no mock data fallbacks
export const fundingAPI = {
  // Public endpoints
  getProjects: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await apiClient.get(`/funding?${params}`);
    return response.data;
  },

  getProject: async (projectId) => {
    const response = await apiClient.get(`/funding/${projectId}`);
    return response.data;
  },

  getFeaturedProjects: async () => {
    const response = await apiClient.get('/funding/featured');
    return response.data;
  },

  getTrendingProjects: async () => {
    const response = await apiClient.get('/funding/trending');
    return response.data;
  },

  getEndingSoonProjects: async () => {
    const response = await apiClient.get('/funding/ending-soon');
    return response.data;
  },

  getMetadata: async () => {
    const response = await apiClient.get('/funding/metadata');
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get('/funding/statistics');
    return response.data;
  },

  // Authenticated endpoints
  createProject: async (projectData) => {
    console.log('Creating project with data:', projectData);
    console.log('Cover image in projectData:', projectData.cover_image);
    console.log('Cover image type:', projectData.cover_image?.constructor?.name);
    
    const formData = new FormData();

    // Add all non-file, non-array fields
    Object.keys(projectData).forEach(key => {
      if (key !== 'cover_image' && key !== 'additional_images' && key !== 'documents' &&
          key !== 'identity_verification' && key !== 'business_registration_document' &&
          key !== 'team_members' && key !== 'rewards' &&
          key !== 'use_of_funds' && key !== 'milestones' && key !== 'social_links') {
        if (typeof projectData[key] === 'object' && projectData[key] !== null) {
          formData.append(key, JSON.stringify(projectData[key]));
        } else {
          formData.append(key, projectData[key]);
        }
      }
    });

    // Add file fields
    if (projectData.cover_image) {
      console.log('Appending cover_image to FormData:', projectData.cover_image);
      formData.append('cover_image', projectData.cover_image);
    } else {
      console.log('ERROR: cover_image is missing or null');
    }

    if (projectData.additional_images && projectData.additional_images.length > 0) {
      projectData.additional_images.forEach((image, index) => {
        formData.append(`additional_images[${index}]`, image);
      });
    }

    if (projectData.documents && projectData.documents.length > 0) {
      projectData.documents.forEach((doc, index) => {
        formData.append(`documents[${index}]`, doc);
      });
    }

    if (projectData.identity_verification) {
      formData.append('identity_verification', projectData.identity_verification);
    }

    if (projectData.business_registration_document) {
      formData.append('business_registration_document', projectData.business_registration_document);
    }

    // Handle array fields - always send as JSON, even if empty
    if (projectData.use_of_funds !== undefined) {
      formData.append('use_of_funds', JSON.stringify(projectData.use_of_funds || []));
    }

    if (projectData.milestones !== undefined) {
      formData.append('milestones', JSON.stringify(projectData.milestones || []));
    }

    if (projectData.social_links !== undefined) {
      formData.append('social_links', JSON.stringify(projectData.social_links || []));
    }

    // Handle team members with photos
    if (projectData.team_members && projectData.team_members.length > 0) {
      projectData.team_members.forEach((member, index) => {
        if (member.photo) {
          formData.append(`team_members[${index}][photo]`, member.photo);
        }
        formData.append(`team_members[${index}][name]`, member.name);
        formData.append(`team_members[${index}][role]`, member.role);
      });
    }

    if (projectData.rewards && projectData.rewards.length > 0) {
      projectData.rewards.forEach((reward, index) => {
        Object.keys(reward).forEach(key => {
          formData.append(`rewards[${index}][${key}]`, reward[key]);
        });
      });
    }

    const response = await apiClient.post('/funding', formData, {
      headers: {
        'Content-Type': undefined,
      },
    });
    return response.data;
  },

  updateProject: async (projectId, projectData) => {
    const formData = new FormData();

    // Add all non-file, non-array fields
    Object.keys(projectData).forEach(key => {
      if (key !== 'cover_image' && key !== 'additional_images' && key !== 'documents' &&
          key !== 'identity_verification' && key !== 'business_registration_document' &&
          key !== 'team_members' && key !== 'rewards' &&
          key !== 'use_of_funds' && key !== 'milestones' && key !== 'social_links') {
        if (typeof projectData[key] === 'object' && projectData[key] !== null) {
          formData.append(key, JSON.stringify(projectData[key]));
        } else {
          formData.append(key, projectData[key]);
        }
      }
    });

    if (projectData.cover_image) {
      formData.append('cover_image', projectData.cover_image);
    }

    if (projectData.additional_images && projectData.additional_images.length > 0) {
      projectData.additional_images.forEach((image, index) => {
        formData.append(`additional_images[${index}]`, image);
      });
    }

    if (projectData.documents && projectData.documents.length > 0) {
      projectData.documents.forEach((doc, index) => {
        formData.append(`documents[${index}]`, doc);
      });
    }

    if (projectData.identity_verification) {
      formData.append('identity_verification', projectData.identity_verification);
    }

    if (projectData.business_registration_document) {
      formData.append('business_registration_document', projectData.business_registration_document);
    }

    // Handle array fields - always send as JSON, even if empty
    if (projectData.use_of_funds !== undefined) {
      formData.append('use_of_funds', JSON.stringify(projectData.use_of_funds || []));
    }

    if (projectData.milestones !== undefined) {
      formData.append('milestones', JSON.stringify(projectData.milestones || []));
    }

    if (projectData.social_links !== undefined) {
      formData.append('social_links', JSON.stringify(projectData.social_links || []));
    }

    if (projectData.team_members && projectData.team_members.length > 0) {
      projectData.team_members.forEach((member, index) => {
        if (member.photo) {
          formData.append(`team_members[${index}][photo]`, member.photo);
        }
        formData.append(`team_members[${index}][name]`, member.name || '');
        formData.append(`team_members[${index}][role]`, member.role || '');
      });
    }

    if (projectData.rewards && projectData.rewards.length > 0) {
      projectData.rewards.forEach((reward, index) => {
        Object.keys(reward).forEach((key) => {
          if (reward[key] !== undefined && reward[key] !== null) {
            formData.append(`rewards[${index}][${key}]`, reward[key]);
          }
        });
      });
    }

    formData.append('_method', 'PUT');
    const response = await apiClient.post(`/funding/${projectId}`, formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },

  deleteProject: async (projectId) => {
    const response = await apiClient.delete(`/funding/${projectId}`);
    return response.data;
  },

  getMyProjects: async () => {
    const response = await apiClient.get('/funding/my-projects/list');
    return response.data;
  },

  addReward: async (projectId, rewardData) => {
    const response = await apiClient.post(`/funding/${projectId}/rewards`, rewardData);
    return response.data;
  },

  purchaseUpsell: async (projectId, upsellData) => {
    const response = await apiClient.post(`/funding/${projectId}/upsell`, upsellData);
    return response.data;
  },

  // Pledge endpoints
  makePledge: async (projectId, pledgeData) => {
    const response = await apiClient.post(`/funding-pledges/${projectId}`, pledgeData);
    return response.data;
  },

  getPledges: async (projectId) => {
    const response = await apiClient.get(`/funding-pledges/project/${projectId}/backers`);
    return response.data;
  },
};

export default fundingAPI;
