import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Users, 
  Star,
  Send,
  ArrowLeft,
  Heart,
  Calendar
} from 'lucide-react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import jobService from '../services/JobServices';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { formatCityCountry } from '../utils/apiResponseHelpers';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasJobSeekerProfile, setHasJobSeekerProfile] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await loadJobDetails();
      if (!cancelled) {
        checkJobSeekerProfile();
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getJob(id);
      const jobData = response?.data?.data ?? response?.data ?? (response?.success ? response : null);
      if (jobData && (jobData.id || jobData.title)) {
        setJob(jobData);
      } else {
        setError('Job not found');
      }
    } catch (err) {
      console.error('Error loading job details:', err);
      if (err?.status === 404 || err?.is404) {
        setError('Job not found');
      } else {
        setError(err.message || 'Failed to load job details. Is the backend running?');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkJobSeekerProfile = async () => {
    try {
      const response = await jobService.getMySeekerProfile();
      setHasJobSeekerProfile(response.success && response.data);
    } catch (error) {
      // Fallback to localStorage if API fails
      const profile = localStorage.getItem('jobSeekerProfile');
      setHasJobSeekerProfile(!!profile);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      requireAuth('/jobs/' + id, 'You must be logged in to apply for jobs.');
      return;
    }

    if (!hasJobSeekerProfile) {
      alert('Please create a job seeker profile first to apply for jobs.');
      navigate('/jobs/post?mode=seeker');
      return;
    }

    try {
      const applicationData = {
        contact_email: 'user@example.com'
      };
      
      const response = await jobService.applyForJob(id, applicationData);
      if (response.success) {
        alert('Application submitted successfully!');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      requireAuth('/jobs/' + id, 'You must be logged in to save jobs.');
      return;
    }

    try {
      const response = await jobService.saveJob(id);
      if (response.success) {
        setIsSaved(true);
        alert('Job saved successfully!');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton={true} />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton={true} />
        <div className="page-container py-20">
          <div className="text-center">
            <p className="text-red-600 text-xl">{error || 'Job not found'}</p>
            <button
              onClick={() => navigate('/jobs')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton={true} />

      <div className="page-container py-8 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Jobs</span>
        </button>

        {/* Job Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header with Company Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {job.logo && (
                    <img 
                      src={job.logo} 
                      alt={job.company_name || job.company}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    <span className="font-medium">{job.company_name || job.company}</span>
                    {job.companyVerified && (
                      <Star className="w-4 h-4 text-blue-500 fill-current" />
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Job Details */}
          <div className="p-6 space-y-6">
            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">
                    {job.location || formatCityCountry(job.city, job.country) || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Salary</p>
                  <p className="font-medium text-gray-900">{job.salary_range || job.salary}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Job Type</p>
                  <p className="font-medium text-gray-900">{job.work_type || job.type}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Job Description</h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>{job.description || 'No description provided.'}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Requirements</h2>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>{job.requirements}</p>
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Responsibilities</h2>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>{job.responsibilities}</p>
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Benefits</h2>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>{job.benefits}</p>
                </div>
              </div>
            )}

            {/* Posted Date */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 pt-4 border-t border-gray-100">
              <Calendar className="w-4 h-4" />
              <span>Posted {job.posted || 'recently'}</span>
            </div>
          </div>

          {/* Apply Button - Fixed at bottom */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <button
              onClick={handleApply}
              className="w-full px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Apply for this Job</span>
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
              Click to apply - you'll be redirected if you need to create a profile
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetailPage;
