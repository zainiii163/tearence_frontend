import api from "../api";

const jobsAPI = {
  // ==================== PUBLIC ENDPOINTS (No Auth Required) ====================
  
  // Get all jobs with advanced filtering and pagination
  getJobs: async (params = {}) => {
    try {
      const response = await api.get('/public/jobs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Get job details by ID with full information
  getJob: async (jobId) => {
    try {
      const response = await api.get(`/public/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  },

  // Get job categories with counts and icons
  getCategories: async () => {
    try {
      const response = await api.get('/public/jobs/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching job categories:', error);
      throw error;
    }
  },

  // Get comprehensive job statistics
  getStats: async () => {
    try {
      const response = await api.get('/public/jobs/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching job stats:', error);
      throw error;
    }
  },

  // Search jobs with advanced filters
  searchJobs: async (searchParams) => {
    try {
      const response = await api.get('/public/jobs', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  // ==================== JOB SEEKERS PUBLIC API ====================
  
  // Get job seekers with filtering
  getJobSeekers: async (params = {}) => {
    try {
      const response = await api.get('/public/jobs/seekers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching job seekers:', error);
      throw error;
    }
  },

  // Get seeker details by ID
  getSeeker: async (seekerId) => {
    try {
      const response = await api.get(`/public/jobs/seekers/${seekerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seeker details:', error);
      throw error;
    }
  },

  // Get seeker statistics
  getSeekerStats: async () => {
    try {
      const response = await api.get('/public/jobs/seekers/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching seeker stats:', error);
      throw error;
    }
  },

  // Search job seekers
  searchSeekers: async (searchParams) => {
    try {
      const response = await api.get('/public/jobs/seekers', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Error searching seekers:', error);
      throw error;
    }
  },

  // ==================== PROTECTED ENDPOINTS (Auth Required) ====================
  
  // ==================== JOB MANAGEMENT ====================
  
  // Create new job posting with comprehensive data
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
  getMyJobs: async () => {
    try {
      const response = await api.get('/jobs/my-jobs');
      return response.data;
    } catch (error) {
      console.error('Error fetching my jobs:', error);
      throw error;
    }
  },

  // ==================== APPLICATION MANAGEMENT ====================
  
  // Apply for a job with comprehensive application data
  applyForJob: async (jobId, applicationData) => {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  },

  // Get applications with filtering options
  getApplications: async (params = {}) => {
    try {
      const response = await api.get('/jobs/applications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  // Get application details
  getApplication: async (applicationId) => {
    try {
      const response = await api.get(`/jobs/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application details:', error);
      throw error;
    }
  },

  // Update application status with employer notes
  updateApplicationStatus: async (applicationId, statusData) => {
    try {
      const response = await api.put(`/jobs/applications/${applicationId}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Get application statistics
  getApplicationStats: async () => {
    try {
      const response = await api.get('/jobs/applications/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching application stats:', error);
      throw error;
    }
  },

  // ==================== JOB SEEKER PROFILE MANAGEMENT ====================
  
  // Create comprehensive seeker profile
  createSeekerProfile: async (profileData) => {
    try {
      const response = await api.post('/jobs/seekers', profileData);
      return response.data;
    } catch (error) {
      console.error('Error creating seeker profile:', error);
      throw error;
    }
  },

  // Update seeker profile
  updateSeekerProfile: async (seekerId, profileData) => {
    try {
      const response = await api.put(`/jobs/seekers/${seekerId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating seeker profile:', error);
      throw error;
    }
  },

  // Delete seeker profile
  deleteSeekerProfile: async (seekerId) => {
    try {
      const response = await api.delete(`/jobs/seekers/${seekerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting seeker profile:', error);
      throw error;
    }
  },

  // Get my seeker profile
  getMySeekerProfile: async () => {
    try {
      const response = await api.get('/jobs/seekers/my-profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching my seeker profile:', error);
      throw error;
    }
  },

  // ==================== PREMIUM UPSELLS ====================
  
  // Get upsell pricing with all tiers
  getUpsellPricing: async () => {
    try {
      const response = await api.get('/jobs/upsells/pricing');
      return response.data;
    } catch (error) {
      console.error('Error fetching upsell pricing:', error);
      throw error;
    }
  },

  // Create upsell for job or seeker profile
  createUpsell: async (upsellData) => {
    try {
      const response = await api.post('/jobs/upsells', upsellData);
      return response.data;
    } catch (error) {
      console.error('Error creating upsell:', error);
      throw error;
    }
  },

  // Activate upsell after payment
  activateUpsell: async (upsellId) => {
    try {
      const response = await api.post(`/jobs/upsells/${upsellId}/activate`);
      return response.data;
    } catch (error) {
      console.error('Error activating upsell:', error);
      throw error;
    }
  },

  // Cancel upsell
  cancelUpsell: async (upsellId) => {
    try {
      const response = await api.post(`/jobs/upsells/${upsellId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error canceling upsell:', error);
      throw error;
    }
  },

  // Get my upsells
  getMyUpsells: async () => {
    try {
      const response = await api.get('/jobs/upsells?my_upsells=true');
      return response.data;
    } catch (error) {
      console.error('Error fetching my upsells:', error);
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

  // ==================== JOB ALERTS ====================
  
  // Create comprehensive job alert
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
  getMyJobAlerts: async () => {
    try {
      const response = await api.get('/jobs/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching job alerts:', error);
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

  // Test job alert (send test email)
  testJobAlert: async (alertId) => {
    try {
      const response = await api.post(`/jobs/alerts/${alertId}/test`);
      return response.data;
    } catch (error) {
      console.error('Error testing job alert:', error);
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

  // ==================== SAVED JOBS ====================
  
  // Save a job
  saveJob: async (jobId) => {
    try {
      const response = await api.post(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  // Unsave a job
  unsaveJob: async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  },

  // Get saved jobs
  getSavedJobs: async () => {
    try {
      const response = await api.get('/jobs/saved');
      return response.data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  },

  // ==================== BATCH OPERATIONS ====================
  
  // Bulk save jobs
  bulkSaveJobs: async (jobIds) => {
    try {
      const response = await api.post('/jobs/bulk-save', { job_ids: jobIds });
      return response.data;
    } catch (error) {
      console.error('Error bulk saving jobs:', error);
      throw error;
    }
  },

  // Bulk apply to jobs
  bulkApplyToJobs: async (applications) => {
    try {
      const response = await api.post('/jobs/bulk-apply', { applications });
      return response.data;
    } catch (error) {
      console.error('Error bulk applying to jobs:', error);
      throw error;
    }
  },

  // ==================== ANALYTICS & REPORTING ====================
  
  // Get job views analytics
  getJobViews: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}/views`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job views:', error);
      throw error;
    }
  },

  // Get seeker profile views
  getSeekerViews: async (seekerId) => {
    try {
      const response = await api.get(`/jobs/seekers/${seekerId}/views`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seeker views:', error);
      throw error;
    }
  },

  // Get application funnel analytics
  getApplicationFunnel: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}/application-funnel`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application funnel:', error);
      throw error;
    }
  },

  // ==================== NOTIFICATIONS ====================
  
  // Mark notifications as read
  markNotificationsRead: async (notificationIds) => {
    try {
      const response = await api.post('/jobs/notifications/mark-read', { 
        notification_ids: notificationIds 
      });
      return response.data;
    } catch (error) {
      console.error('Error marking notifications read:', error);
      throw error;
    }
  },

  // Get notifications
  getNotifications: async (params = {}) => {
    try {
      const response = await api.get('/jobs/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // ==================== RECOMMENDATIONS ====================
  
  // Get recommended jobs
  getRecommendedJobs: async () => {
    try {
      const response = await api.get('/jobs/recommendations');
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended jobs:', error);
      throw error;
    }
  },

  // Get recommended seekers
  getRecommendedSeekers: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}/recommended-seekers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended seekers:', error);
      throw error;
    }
  },

  // ==================== UTILITIES ====================
  
  // Validate job data before submission
  validateJobData: async (jobData) => {
    try {
      const response = await api.post('/jobs/validate', jobData);
      return response.data;
    } catch (error) {
      console.error('Error validating job data:', error);
      throw error;
    }
  },

  // Validate seeker profile data
  validateSeekerData: async (profileData) => {
    try {
      const response = await api.post('/jobs/seekers/validate', profileData);
      return response.data;
    } catch (error) {
      console.error('Error validating seeker data:', error);
      throw error;
    }
  },

  // Export jobs data
  exportJobs: async (params = {}) => {
    try {
      const response = await api.get('/jobs/export', { 
        params,
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error exporting jobs:', error);
      throw error;
    }
  },

  // Export applications data
  exportApplications: async (params = {}) => {
    try {
      const response = await api.get('/jobs/applications/export', { 
        params,
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error exporting applications:', error);
      throw error;
    }
  }
};

export default jobsAPI;
