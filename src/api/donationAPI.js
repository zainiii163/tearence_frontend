import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL ||
  'https://api.worldwideadverts.info/api/v1';

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

const donationAPI = {
  // Get all donations with filters
  getDonations: async (params = {}) => {
    try {
      const response = await apiClient.get('/donations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  },

  // Get featured donations
  getFeaturedDonations: async () => {
    try {
      const response = await apiClient.get('/donations/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured donations:', error);
      throw error;
    }
  },

  // Get urgent donations
  getUrgentDonations: async () => {
    try {
      const response = await apiClient.get('/donations/urgent');
      return response.data;
    } catch (error) {
      console.error('Error fetching urgent donations:', error);
      throw error;
    }
  },

  // Get donation statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get('/donations/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching donation statistics:', error);
      throw error;
    }
  },

  // Get single donation by ID
  getDonationById: async (id) => {
    try {
      const response = await apiClient.get(`/donations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching donation:', error);
      throw error;
    }
  },

  // Create new donation
  createDonation: async (donationData) => {
    try {
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(donationData).forEach(key => {
        if (key !== 'cover_image' && key !== 'images' && key !== 'beneficiaries' && key !== 'milestones') {
          formData.append(key, donationData[key]);
        }
      });

      // Handle cover image
      if (donationData.cover_image instanceof File) {
        formData.append('cover_image', donationData.cover_image);
      }

      // Handle additional images
      if (donationData.images && Array.isArray(donationData.images)) {
        donationData.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          }
        });
      }

      // Handle JSON fields - send as arrays
      if (donationData.beneficiaries && Array.isArray(donationData.beneficiaries)) {
        donationData.beneficiaries.forEach((beneficiary, index) => {
          Object.keys(beneficiary).forEach(key => {
            formData.append(`beneficiaries[${index}][${key}]`, beneficiary[key]);
          });
        });
      }
      if (donationData.milestones && Array.isArray(donationData.milestones)) {
        donationData.milestones.forEach((milestone, index) => {
          Object.keys(milestone).forEach(key => {
            formData.append(`milestones[${index}][${key}]`, milestone[key]);
          });
        });
      }

      const response = await apiClient.post('/donations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error;
    }
  },

  // Update donation
  updateDonation: async (id, donationData) => {
    try {
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(donationData).forEach(key => {
        if (key !== 'cover_image' && key !== 'images' && key !== 'beneficiaries' && key !== 'milestones') {
          formData.append(key, donationData[key]);
        }
      });

      // Handle cover image
      if (donationData.cover_image instanceof File) {
        formData.append('cover_image', donationData.cover_image);
      }

      // Handle additional images
      if (donationData.images && Array.isArray(donationData.images)) {
        donationData.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          }
        });
      }

      // Handle JSON fields - send as arrays
      if (donationData.beneficiaries && Array.isArray(donationData.beneficiaries)) {
        donationData.beneficiaries.forEach((beneficiary, index) => {
          Object.keys(beneficiary).forEach(key => {
            formData.append(`beneficiaries[${index}][${key}]`, beneficiary[key]);
          });
        });
      }
      if (donationData.milestones && Array.isArray(donationData.milestones)) {
        donationData.milestones.forEach((milestone, index) => {
          Object.keys(milestone).forEach(key => {
            formData.append(`milestones[${index}][${key}]`, milestone[key]);
          });
        });
      }

      const response = await apiClient.put(`/donations/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating donation:', error);
      throw error;
    }
  },

  // Delete donation
  deleteDonation: async (id) => {
    try {
      const response = await apiClient.delete(`/donations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting donation:', error);
      throw error;
    }
  },

  // Get user's donations
  getMyDonations: async (params = {}) => {
    try {
      const response = await apiClient.get('/donations/my-donations', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching my donations:', error);
      throw error;
    }
  },

  startDonate: async (id, payload) => {
    const response = await apiClient.post(`/donations/${id}/donate`, payload);
    return response.data;
  },

  confirmDonate: async (contributionId, paymentData) => {
    const response = await apiClient.post(
      `/donations/contributions/${contributionId}/confirm-payment`,
      paymentData
    );
    return response.data;
  },
};

export default donationAPI;
