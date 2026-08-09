import api from "../api";

const jobService = {
  // Public endpoints (no authentication required)
  
  // Get all jobs with filtering and pagination
  getJobs: async (params = {}) => {
    try {
      const response = await api.get('/jobs/public', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Get job details by slug
  getJob: async (slug) => {
    try {
      const response = await api.get(`/jobs/public/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  },

  // Get featured jobs
  getFeaturedJobs: async (limit = 10) => {
    try {
      const response = await api.get('/jobs/public/featured', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
      throw error;
    }
  },

  // Get job categories
  getCategories: async () => {
    try {
      const response = await api.get('/jobs/public/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching job categories:', error);
      throw error;
    }
  },

  // Get jobs by category
  getJobsByCategory: async (categorySlug, params = {}) => {
    try {
      const response = await api.get(`/jobs/public/genre/${categorySlug}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs by category:', error);
      throw error;
    }
  },

  // Get job statistics
  getStats: async () => {
    try {
      const response = await api.get('/jobs/public/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching job stats:', error);
      throw error;
    }
  },

  // Get recent activities
  getActivities: async (params = {}) => {
    try {
      const response = await api.get('/jobs/public/activities', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  // Get job seekers (public)
  getJobSeekers: async (params = {}) => {
    try {
      const response = await api.get('/jobs/public/seekers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching job seekers:', error);
      throw error;
    }
  },

  // Get seeker details (public)
  getSeeker: async (seekerId) => {
    try {
      const response = await api.get(`/jobs/public/seekers/${seekerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seeker details:', error);
      throw error;
    }
  },

  // Get seeker statistics
  getSeekerStats: async () => {
    try {
      const response = await api.get('/jobs/public/seekers/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching seeker stats:', error);
      throw error;
    }
  },

  // Protected endpoints (authentication required)

  // Create new job posting
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  // Update job posting
  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  // Delete job posting
  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  // Get my job postings
  getMyJobs: async (params = {}) => {
    try {
      const response = await api.get('/jobs/my-jobs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching my jobs:', error);
      throw error;
    }
  },

  // Save/Unsave job
  saveJob: async (jobId) => {
    try {
      const response = await api.post(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  // Get saved jobs
  getSavedJobs: async (params = {}) => {
    try {
      const response = await api.get('/jobs/saved', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  },

  // Apply for job
  applyForJob: async (jobId, applicationData) => {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  },

  // Get job applications (employer)
  getJobApplications: async (params = {}) => {
    try {
      const response = await api.get('/jobs/applications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }
  },

  // Get single application
  getApplication: async (applicationId) => {
    try {
      const response = await api.get(`/jobs/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  // Update application status (employer)
  updateApplicationStatus: async (applicationId, statusData) => {
    try {
      const response = await api.put(`/jobs/applications/${applicationId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Get application statistics (employer)
  getApplicationStats: async () => {
    try {
      const response = await api.get('/jobs/applications/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching application stats:', error);
      throw error;
    }
  },

  // Get my applications (job seeker)
  getMyApplications: async (params = {}) => {
    try {
      const response = await api.get('/jobs/my-applications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching my applications:', error);
      throw error;
    }
  },

  // Withdraw application (job seeker)
  withdrawApplication: async (applicationId) => {
    try {
      const response = await api.post(`/jobs/applications/${applicationId}/withdraw`);
      return response.data;
    } catch (error) {
      console.error('Error withdrawing application:', error);
      throw error;
    }
  },

  // Job Seeker Profiles

  // Create job seeker profile
  createSeekerProfile: async (profileData) => {
    try {
      const response = await api.post('/jobs/seekers', profileData);
      return response.data;
    } catch (error) {
      console.error('Error creating seeker profile:', error);
      throw error;
    }
  },

  // Update job seeker profile
  updateSeekerProfile: async (seekerId, profileData) => {
    try {
      const response = await api.put(`/jobs/seekers/${seekerId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating seeker profile:', error);
      throw error;
    }
  },

  // Delete job seeker profile
  deleteSeekerProfile: async (seekerId) => {
    try {
      const response = await api.delete(`/jobs/seekers/${seekerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting seeker profile:', error);
      throw error;
    }
  },

  // Get my job seeker profile
  getMySeekerProfile: async () => {
    try {
      const response = await api.get('/jobs/seekers/my-profile');
      return response.data;
    } catch (primaryError) {
      try {
        const response = await api.get('/job-seekers/my-profile');
        return response.data;
      } catch (error) {
        console.error('Error fetching my seeker profile:', error);
        throw error;
      }
    }
  },

  // Job Alerts

  // Create job alert
  createJobAlert: async (alertData) => {
    try {
      const response = await api.post('/jobs/alerts', alertData);
      return response.data;
    } catch (error) {
      console.error('Error creating job alert:', error);
      throw error;
    }
  },

  // Get my job alerts
  getJobAlerts: async (params = {}) => {
    try {
      const response = await api.get('/jobs/alerts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching job alerts:', error);
      throw error;
    }
  },

  // Get single job alert
  getJobAlert: async (alertId) => {
    try {
      const response = await api.get(`/jobs/alerts/${alertId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job alert:', error);
      throw error;
    }
  },

  // Update job alert
  updateJobAlert: async (alertId, alertData) => {
    try {
      const response = await api.put(`/jobs/alerts/${alertId}`, alertData);
      return response.data;
    } catch (error) {
      console.error('Error updating job alert:', error);
      throw error;
    }
  },

  // Delete job alert
  deleteJobAlert: async (alertId) => {
    try {
      const response = await api.delete(`/jobs/alerts/${alertId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting job alert:', error);
      throw error;
    }
  },

  // Test job alert
  testJobAlert: async (alertId) => {
    try {
      const response = await api.post(`/jobs/alerts/${alertId}/test`);
      return response.data;
    } catch (error) {
      console.error('Error testing job alert:', error);
      throw error;
    }
  },

  // Get alert statistics
  getAlertStats: async () => {
    try {
      const response = await api.get('/jobs/alerts/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching alert stats:', error);
      throw error;
    }
  },

  // Get matching jobs for alert
  getAlertMatchingJobs: async (alertId, params = {}) => {
    try {
      const response = await api.get(`/jobs/alerts/${alertId}/matching-jobs`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching alert matching jobs:', error);
      throw error;
    }
  },

  // Premium Upsells

  // Get pricing plans
  getPricingPlans: async () => {
    try {
      const response = await api.get('/jobs/upsells/pricing');
      return response.data;
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      throw error;
    }
  },

  // Purchase promotion
  purchasePromotion: async (upsellData) => {
    try {
      const response = await api.post('/jobs/upsells', upsellData);
      return response.data;
    } catch (error) {
      console.error('Error purchasing promotion:', error);
      throw error;
    }
  },

  // Create upsell (alias for purchasePromotion for compatibility)
  createUpsell: async (upsellData) => {
    try {
      const response = await api.post('/jobs/upsells', upsellData);
      return response.data;
    } catch (error) {
      console.error('Error creating upsell:', error);
      throw error;
    }
  },

  // Get my upsells
  getMyUpsells: async (params = {}) => {
    try {
      const response = await api.get('/jobs/upsells', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching my upsells:', error);
      throw error;
    }
  },

  // Get single upsell
  getUpsell: async (upsellId) => {
    try {
      const response = await api.get(`/jobs/upsells/${upsellId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upsell:', error);
      throw error;
    }
  },

  // Process payment
  processPayment: async (upsellId, paymentData) => {
    try {
      const response = await api.post(`/jobs/upsells/${upsellId}/pay`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Activate promotion
  activatePromotion: async (upsellId) => {
    try {
      const response = await api.post(`/jobs/upsells/${upsellId}/activate`);
      return response.data;
    } catch (error) {
      console.error('Error activating promotion:', error);
      throw error;
    }
  },

  // Cancel promotion
  cancelPromotion: async (upsellId) => {
    try {
      const response = await api.post(`/jobs/upsells/${upsellId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling promotion:', error);
      throw error;
    }
  },

  // Get upsell statistics
  getUpsellStats: async () => {
    try {
      const response = await api.get('/jobs/upsells/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching upsell stats:', error);
      throw error;
    }
  },

  // Search functionality (maps to getJobs with search params)
  searchJobs: async (searchParams) => {
    try {
      const response = await api.get('/jobs/public', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  searchSeekers: async (searchParams) => {
    try {
      const response = await api.get('/jobs/public/seekers', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Error searching seekers:', error);
      throw error;
    }
  },

  getTrendingSearches: async () => {
    try {
      const response = await api.get('/jobs/public/trending-searches');
      return response.data;
    } catch (error) {
      console.error('Error fetching trending searches:', error);
      throw error;
    }
  },

  getJobListings: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append("page", params.page);
      if (params?.per_page) queryParams.append("per_page", params.per_page);
      if (params?.search) queryParams.append("search", params.search);
      if (params?.location) queryParams.append("location", params.location);
      if (params?.category) queryParams.append("category", params.category);
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      
      const url = queryParams.toString() 
        ? `/jobs?${queryParams.toString()}`
        : `/jobs`;
      
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createJobListing: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default jobService;
