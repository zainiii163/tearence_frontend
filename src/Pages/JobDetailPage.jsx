import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import Footer from '../Component/Footer';
import jobService from '../services/JobServices';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { formatCityCountry } from '../utils/apiResponseHelpers';
import { normalizeJobForCard, getJobLogoUrl } from '../utils/jobsHelpers';
import ChatButton from '../Component/Chat/ChatButton';
import JobApplyModal from '../Component/jobs/JobApplyModal';
import RelatedListingsSection from '../Component/shared/RelatedListingsSection';
import {
  buildListingChatContext,
  resolveSellerId,
  resolveSellerName,
} from '../utils/chatHelpers';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const { userDetail } = useSelector((store) => store.auth || {});
  const user = userDetail?.data || userDetail || {};
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [seekerProfile, setSeekerProfile] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await loadJobDetails();
      if (!cancelled && isAuthenticated) {
        checkJobSeekerProfile();
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getJob(id);
      const jobData = response?.data?.data ?? response?.data ?? (response?.success ? response : null);
      if (jobData && (jobData.id || jobData.title)) {
        const normalized = normalizeJobForCard(jobData);
        setJob(normalized);
        setHasApplied(Boolean(jobData.has_applied || jobData.user_has_applied));
        setIsSaved(Boolean(jobData.is_saved || jobData.user_has_saved));
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
      const profile = response?.data || (response?.success ? response?.data : null);
      setSeekerProfile(profile || null);
    } catch {
      try {
        const raw = localStorage.getItem('jobSeekerProfile');
        setSeekerProfile(raw ? JSON.parse(raw) : null);
      } catch {
        setSeekerProfile(null);
      }
    }
  };

  const jobKey = job?.id || job?.slug || id;

  const handleApply = () => {
    if (!isAuthenticated) {
      requireAuth('/jobs/' + id, 'You must be logged in to apply for jobs.');
      return;
    }

    // External apply only for website/link jobs; email & platform use in-app form
    const method = String(job?.application_method || 'platform').toLowerCase();
    const externalUrl =
      job?.application_url ||
      job?.application_website ||
      job?.apply_url ||
      job?.external_url;

    if ((method === 'link' || method === 'website') && externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    setShowApplyModal(true);
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      requireAuth('/jobs/' + id, 'You must be logged in to save jobs.');
      return;
    }

    try {
      const response = await jobService.saveJob(jobKey);
      if (response.success) {
        setIsSaved(Boolean(response.saved ?? true));
        alert(response.message || 'Job saved successfully!');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UnifiedNavbar showBackButton={true} backHref="/jobs" />
        <div className="flex flex-1 justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UnifiedNavbar showBackButton={true} backHref="/jobs" />
        <div className="page-container py-20 flex-1">
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UnifiedNavbar showBackButton={true} backHref="/jobs" />

      <div className="page-container py-8 max-w-4xl flex-1">
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
                  {(job.logo || getJobLogoUrl(job.company_logo || job.logo_url)) && (
                    <img 
                      src={job.logo || getJobLogoUrl(job.company_logo || job.logo_url)} 
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
                    {(job.companyVerified || job.verified_employer) && (
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
          <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-3">
            <button
              onClick={handleApply}
              disabled={hasApplied}
              className={`w-full px-8 py-4 font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                hasApplied
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>{hasApplied ? 'Application submitted' : 'Apply for this Job'}</span>
            </button>
            {resolveSellerId(job) && (
              <ChatButton
                sellerId={resolveSellerId(job)}
                sellerName={resolveSellerName(job, job.company_name || job.company || 'Employer')}
                listing={buildListingChatContext(job, 'Jobs')}
                label="Live Chat with Employer"
                className="w-full h-12 px-4 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg"
                variant="custom"
              />
            )}
            <p className="text-center text-sm text-gray-500">
              {hasApplied
                ? 'You have already applied for this role. You can still message the employer with questions.'
                : 'Fill in your details and cover letter, or message the employer in live chat with questions.'}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="page-container pb-10 max-w-4xl">
        <RelatedListingsSection
          source="jobs"
          currentId={job?.id || id}
          categoryKey={job?.category_slug || job?.category || ''}
          categoryName={job?.category_name || job?.category || ''}
          title="Related vacancies"
          subtitle="You may also like"
        />
      </div>

      <JobApplyModal
        open={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        job={job}
        user={user}
        seekerProfile={seekerProfile}
        onSuccess={() => setHasApplied(true)}
      />
      <Footer />
    </div>
  );
};

export default JobDetailPage;
