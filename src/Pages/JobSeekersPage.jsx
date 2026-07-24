import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search } from 'lucide-react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import JobSeekerCard from '../Component/jobs/JobSeekerCard';
import JobSeekerFilters from '../Component/jobs/JobSeekerFilters';
import jobsAPI from '../api/jobsAPI';
import { getStorageAssetUrl } from '../utils/jobsHelpers';

const JobSeekersPage = () => {
  const [seekers, setSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedSeeker, setSelectedSeeker] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    experience_level: '',
    education_level: '',
    is_remote_available: false,
    page: 1,
    limit: 12
  });

  useEffect(() => {
    loadSeekers();
    loadStats();
  }, [filters]);

  const loadSeekers = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getJobSeekers(filters);
      if (response.success || response.data) {
        setSeekers(response.data || []);
      } else {
        setSeekers([]);
      }
    } catch (error) {
      console.error('Error loading job seekers:', error);
      setError('Failed to load job seekers');
      setSeekers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await jobsAPI.getSeekerStats();
      if (response.success || response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading seeker stats:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleSeekerClick = (seeker) => {
    setSelectedSeeker(seeker);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="page-container">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Job Seekers Marketplace</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Find the perfect candidates for your job openings
          </p>
          
          {stats && (
            <div className="flex items-center space-x-8 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total_seekers || 0}</div>
                <div className="text-sm text-blue-200">Total Seekers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.active_seekers || 0}</div>
                <div className="text-sm text-blue-200">Active Profiles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.new_this_week || 0}</div>
                <div className="text-sm text-blue-200">New This Week</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <JobSeekerFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Seekers Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={loadSeekers}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            ) : seekers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
                    onClick={handleSeekerClick}
                  />
                ))}
              </div>
            )}

            {/* Pagination (simplified) */}
            {seekers.length > 0 && !loading && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  disabled={filters.page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Page {filters.page}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seeker Detail Modal */}
      {showModal && selectedSeeker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSeeker.desired_role || 'Job Seeker'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Profile Photo */}
              {getStorageAssetUrl(selectedSeeker.profile_photo) && (
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden">
                  <img
                    src={getStorageAssetUrl(selectedSeeker.profile_photo)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Bio */}
              {selectedSeeker.bio && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600">{selectedSeeker.bio}</p>
                </div>
              )}

              {/* Skills */}
              {selectedSeeker.key_skills && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeeker.key_skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">
                  {selectedSeeker.city && selectedSeeker.country
                    ? `${selectedSeeker.city}, ${selectedSeeker.country}`
                    : selectedSeeker.country || 'Not specified'}
                </p>
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
                <div className="space-y-2">
                  {selectedSeeker.portfolio_link && (
                    <a
                      href={selectedSeeker.portfolio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline"
                    >
                      View Portfolio
                    </a>
                  )}
                  {selectedSeeker.linkedin_url && (
                    <a
                      href={selectedSeeker.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  )}
                  {selectedSeeker.github_url && (
                    <a
                      href={selectedSeeker.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline"
                    >
                      GitHub Profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSeekersPage;
