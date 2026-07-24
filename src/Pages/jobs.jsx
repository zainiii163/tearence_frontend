import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Briefcase, User } from 'lucide-react';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import jobService from '../services/JobServices';
import jobsAPI from '../api/jobsAPI';
import { extractJobsList, normalizeJobForCard } from '../utils/jobsHelpers';

import '../styles/jobs.css';

import UnifiedNavbar from '../Component/UnifiedNavbar';
import JobsHero from '../Component/jobs/JobsHero';
import JobsFilters from '../Component/jobs/JobsFilters';
import JobsGrid from '../Component/jobs/JobsGrid';
import JobsActivityFeed from '../Component/jobs/JobsActivityFeed';
import JobsModalForm from '../Component/jobs/JobsModalForm';
import JobSeekerCard from '../Component/jobs/JobSeekerCard';
import JobSeekerFilters from '../Component/jobs/JobSeekerFilters';
import Footer from '../Component/Footer';

const JobsPage = () => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPostForm, setShowPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [savedJobs, setSavedJobs] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [seekers, setSeekers] = useState([]);
  const [seekerFilters, setSeekerFilters] = useState({
    search: '',
    location: '',
    experience_level: '',
    education_level: '',
    is_remote_available: false,
    page: 1,
    limit: 12
  });
  const [seekersLoading, setSeekersLoading] = useState(false);
  const [seekersError, setSeekersError] = useState(null);

  const loadJobsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const jobsResponse = await jobService.getJobs({
        sort_by: sortBy,
        per_page: 12
      });
      const jobList = extractJobsList(jobsResponse).map(normalizeJobForCard);
      setJobs(jobList);
    } catch (err) {
      console.error('Error loading jobs data:', err);
      setError('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  const loadSeekersData = useCallback(async () => {
    try {
      setSeekersLoading(true);
      setSeekersError(null);
      const seekersResponse = await jobsAPI.getJobSeekers(seekerFilters);
      if (seekersResponse.success || seekersResponse.data) {
        setSeekers(seekersResponse.data || []);
      } else {
        setSeekers([]);
      }
    } catch (err) {
      console.error('Error loading seekers data:', err);
      setSeekersError('Failed to load job seekers');
      setSeekers([]);
    } finally {
      setSeekersLoading(false);
    }
  }, [seekerFilters]);

  useEffect(() => {
    const postFormParam = searchParams.get('postForm');
    if (postFormParam === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  useEffect(() => {
    loadJobsData();
  }, [loadJobsData]);

  useEffect(() => {
    if (activeTab === 'seekers') {
      loadSeekersData();
    }
  }, [activeTab, loadSeekersData]);

  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }

    const viewed = localStorage.getItem('recentlyViewedJobs');
    if (viewed) {
      setRecentlyViewed(JSON.parse(viewed));
    }
  }, []);

  const handleSaveJob = async (jobId) => {
    try {
      if (!isAuthenticated) {
        requireAuth('/jobs', 'You must be logged in to save jobs.');
        return;
      }

      const response = await jobService.saveJob(jobId);

      if (response.success) {
        setSavedJobs((prev) => {
          const updated = [...prev, jobId];
          localStorage.setItem('savedJobs', JSON.stringify(updated));
          return updated;
        });
        alert('Job saved successfully!');
      }
    } catch (err) {
      console.error('Error saving job:', err);
      alert('Failed to save job. Please try again.');
    }
  };

  const handleViewJob = (job) => {
    const newViewed = [job.id, ...recentlyViewed.filter(id => id !== job.id)].slice(0, 10);
    setRecentlyViewed(newViewed);
    localStorage.setItem('recentlyViewedJobs', JSON.stringify(newViewed));
    navigate(`/jobs/${job.id}`);
  };

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setSearchParams({});
    loadJobsData();
    loadSeekersData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton={true} />

      <JobsHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
      />

      <div className="page-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80">
            {activeTab === 'jobs' ? (
              <JobsFilters
                filters={filters}
                setFilters={setFilters}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            ) : (
              <JobSeekerFilters
                filters={seekerFilters}
                onFilterChange={setSeekerFilters}
              />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'jobs'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Jobs</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('seekers')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'seekers'
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    <span>Job Seekers</span>
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'jobs' ? 'Jobs' : 'Job Seekers'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeTab === 'jobs' ? 'Find your next opportunity' : 'Find the perfect candidates'}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                {activeTab === 'jobs' && (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {activeTab === 'jobs' ? (
              loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={loadJobsData}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <JobsGrid
                  jobs={jobs}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  savedJobs={savedJobs}
                  handleSaveJob={handleSaveJob}
                  handleViewJob={handleViewJob}
                />
              )
            ) : (
              seekersLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : seekersError ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{seekersError}</p>
                  <button
                    onClick={loadSeekersData}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : seekers.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Job Seekers Found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {seekers.map((seeker) => (
                    <JobSeekerCard
                      key={seeker.id}
                      seeker={seeker}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-12">
          <JobsActivityFeed />
        </div>
      </div>

      <AnimatePresence>
        {showPostForm && (
          <JobsModalForm
            onClose={handleClosePostForm}
            onSuccess={() => {
              loadJobsData();
              loadSeekersData();
            }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default JobsPage;
