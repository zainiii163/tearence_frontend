import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  Briefcase,
  X
} from 'lucide-react';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import jobService from '../services/JobServices';

// Import styles
import '../styles/jobs.css';

// Import Components
import UnifiedNavbar from '../Component/UnifiedNavbar';
import JobsHero from '../Component/jobs/JobsHero';
import JobsCategoryGrid from '../Component/jobs/JobsCategoryGrid';
import JobsFilters from '../Component/jobs/JobsFilters';
import JobsGrid from '../Component/jobs/JobsGrid';
import JobsActivityFeed from '../Component/jobs/JobsActivityFeed';
import JobsPostForm from '../Component/jobs/JobsPostForm';
import Footer from '../Component/Footer';

const JobsPage = () => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams] = useSearchParams();
  const [showPostForm, setShowPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [savedJobs, setSavedJobs] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [showEmployerProfile, setShowEmployerProfile] = useState(null);
  const [showJobSeekerProfile, setShowJobSeekerProfile] = useState(false);
  const [jobSeekerProfile, setJobSeekerProfile] = useState(null);
  const [recentlyPostedJobs, setRecentlyPostedJobs] = useState([]);

  // Handle job posted callback
  const handleJobPosted = (postedItem) => {
    if (postedItem.title) {
      // It's a job posting
      setRecentlyPostedJobs(prev => [postedItem, ...prev.slice(0, 4)]);
      // Refresh jobs list to include new job
      loadJobsData();
    } else if (postedItem.full_name) {
      // It's a seeker profile
      // Could add to a separate state for profiles if needed
      console.log('Seeker profile created:', postedItem);
    }
  };

  // Load jobs data function
  const loadJobsData = useCallback(async () => {
    try {
      const jobsResponse = await jobService.getJobs({
        sort_by: sortBy,
        per_page: 12
      });
      if (jobsResponse.success) {
        // Jobs loaded successfully
      }
    } catch (error) {
      console.error('Error loading jobs data:', error);
    }
  }, [sortBy]);

  // Load recently posted jobs from localStorage
  const loadRecentlyPostedJobs = () => {
    try {
      const postedJobs = JSON.parse(localStorage.getItem('myPostedJobs') || '[]');
      setRecentlyPostedJobs(postedJobs.slice(0, 5)); // Show last 5 posted jobs
    } catch (error) {
      console.error('Error loading recently posted jobs:', error);
      setRecentlyPostedJobs([]);
    }
  };
  const handlePostClick = () => {
    if (requireAuth('/jobs?postForm=true', 'You must be logged in to post a job vacancy.')) {
      setShowPostForm(true);
    }
  };

  // Handle URL parameter for post form (only if authenticated)
  useEffect(() => {
    const postFormParam = searchParams.get('postForm');
    if (postFormParam === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  // Load initial data from API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load jobs data
        const jobsResponse = await jobService.getJobs({
          sort_by: sortBy,
          per_page: 12
        });
        
        // Load categories
        const categoriesResponse = await jobService.getCategories();
        
      } catch (err) {
        console.error('Error loading jobs data:', err);
      }
    };
    
    loadInitialData();
  }, []);

  // Handle filter changes
  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
  };

  // Handle sort changes
  const handleSortChange = async (sortOption) => {
    setSortBy(sortOption);
    try {
      const response = await jobService.getJobs({ ...filters, sort_by: sortOption });
      const jobData = response.data || response.data.data || [];
    } catch (error) {
      console.error('Error sorting jobs:', error);
    }
  };

  // Handle job application
  const handleApplyForJob = async (jobId, applicationData) => {
    try {
      if (!isAuthenticated) {
        requireAuth('/jobs', 'You must be logged in to apply for jobs.');
        return;
      }
      
      const response = await jobService.applyForJob(jobId, applicationData);
      
      if (response.success) {
        // Show success message
        alert('Application submitted successfully!');
        
        // Refresh jobs to update applicant count
        const jobsResponse = await jobService.getJobs({ per_page: 50 });
        if (jobsResponse.success) {
        }
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  // Handle save job
  const handleSaveJob = async (jobId) => {
    try {
      if (!isAuthenticated) {
        requireAuth('/jobs', 'You must be logged in to save jobs.');
        return;
      }
      
      const response = await jobService.saveJob(jobId);
      
      if (response.success) {
        // Update saved jobs state
        setSavedJobs(prev => [...prev, jobId]);
        localStorage.setItem('savedJobs', JSON.stringify([...savedJobs, jobId]));
        alert('Job saved successfully!');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job. Please try again.');
    }
  };

  // Handle unsave job
  const handleUnsaveJob = async (jobId) => {
    try {
      const response = await jobService.unsaveJob(jobId);
      
      if (response.success) {
        // Update saved jobs state
        setSavedJobs(prev => prev.filter(id => id !== jobId));
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs.filter(id => id !== jobId)));
        alert('Job removed from saved jobs!');
      }
    } catch (error) {
      console.error('Error unsaving job:', error);
      alert('Failed to remove job. Please try again.');
    }
  };

  // Load saved jobs from localStorage
  useEffect(() => {
    const viewed = localStorage.getItem('recentlyViewedJobs');
    if (viewed) {
      setRecentlyViewed(JSON.parse(viewed));
    }

    const profile = localStorage.getItem('jobSeekerProfile');
    if (profile) {
      setJobSeekerProfile(JSON.parse(profile));
    }
  }, []);

  const handleViewJob = (job) => {
    const newViewed = [job.id, ...recentlyViewed.filter(id => id !== job.id)].slice(0, 10);
    setRecentlyViewed(newViewed);
    localStorage.setItem('recentlyViewedJobs', JSON.stringify(newViewed));
  };

  const handleApplyJob = async (job) => {
    if (!isAuthenticated) {
      requireAuth('/jobs', 'You must be logged in to apply for jobs.');
      return;
    }

    if (!jobSeekerProfile) {
      setShowJobSeekerProfile(true);
      return;
    }

    // Use the API-based apply function
    const applicationData = {
      full_name: jobSeekerProfile.fullName || jobSeekerProfile.name,
      email: jobSeekerProfile.email,
      phone: jobSeekerProfile.phone,
      cover_letter: `Interested in the ${job.title} position at ${job.company}.`,
      cv_file: jobSeekerProfile.resume
    };

    await handleApplyForJob(job.id, applicationData);
  };

  const handleCreateJobSeekerProfile = (profile) => {
    setJobSeekerProfile(profile);
    localStorage.setItem('jobSeekerProfile', JSON.stringify(profile));
    setShowJobSeekerProfile(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <UnifiedNavbar showBackButton={true} />

      {/* Hero Section */}
      <JobsHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <JobsFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={() => setFilters({})}
            />
          </div>

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
                <p className="text-gray-600 mt-1">Find your next opportunity</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="salary_high">Salary: High to Low</option>
                  <option value="salary_low">Salary: Low to High</option>
                  <option value="popular">Most Popular</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : ''}`}
                  >
                    <Briefcase className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : ''}`}
                  >
                    <Briefcase className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Jobs Grid */}
            <JobsGrid
              viewMode={viewMode}
              filters={filters}
              sortBy={sortBy}
            />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-12">
          <JobsActivityFeed />
        </div>
      </div>

      {/* Floating Post Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        onClick={handlePostClick}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors group"
      >
        <Briefcase className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Post Job
        </span>
      </motion.button>

      {/* Post Form Modal */}
      <AnimatePresence>
        {showPostForm && (
          <JobsPostForm onClose={handleClosePostForm} onSuccess={loadJobsData} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobsPage;
          <JobsPostForm onClose={() => setShowPostForm(false)} onJobPosted={handleJobPosted} />
        )}
      </AnimatePresence>

      {/* Job Seeker Profile Modal */}
      <AnimatePresence>
        {showJobSeekerProfile && (
          <JobSeekerProfileForm
            onClose={() => setShowJobSeekerProfile(false)}
            onSave={handleCreateJobSeekerProfile}
            existingProfile={jobSeekerProfile}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Job Seeker Profile Form Component
const JobSeekerProfileForm = ({ onClose, onSave, existingProfile }) => {
  const [formData, setFormData] = useState(existingProfile || {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    workExperience: '',
    education: '',
    portfolio: '',
    linkedIn: '',
    resume: null,
    coverLetter: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {existingProfile ? 'Edit Your Profile' : 'Create Your Job Seeker Profile'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Complete your profile once to apply to any job with one click!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New York, USA"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills (comma separated) *
            </label>
            <input
              type="text"
              required
              value={formData.skills.join(', ')}
              onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="React, JavaScript, CSS, Node.js"
            />
          </div>

          {/* Work Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Experience *
            </label>
            <textarea
              required
              value={formData.workExperience}
              onChange={(e) => setFormData({...formData, workExperience: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your work experience, years of experience, key achievements..."
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education *
            </label>
            <textarea
              required
              value={formData.education}
              onChange={(e) => setFormData({...formData, education: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your educational background, degrees, certifications..."
            />
          </div>

          {/* Portfolio & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Website
              </label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={formData.linkedIn}
                onChange={(e) => setFormData({...formData, linkedIn: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="A brief introduction about yourself..."
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume (PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {existingProfile ? 'Update Profile' : 'Create Profile'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default JobsPage;
