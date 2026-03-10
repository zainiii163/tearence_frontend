import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid, 
  List, 
  Heart, 
  Eye, 
  Send, 
  Bookmark, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Users, 
  Star,
  Briefcase,
  ChevronRight,
  ExternalLink,
  User,
  Award,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const JobCard = ({ 
  job, 
  isSaved, 
  onSaveJob, 
  onViewJob, 
  onApplyJob, 
  showEmployerProfile, 
  setShowEmployerProfile,
  hasJobSeekerProfile 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    onViewJob(job);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSaveJob(job.id);
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    onApplyJob(job);
  };

  const handleCompanyClick = (e) => {
    e.stopPropagation();
    setShowEmployerProfile(job);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Urgent Hire':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Featured':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Sponsored':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Remote':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 ${
        isHovered ? 'shadow-lg border-blue-200' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Company Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Company Logo and Info */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={job.logo} 
                alt={job.company}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <button
                onClick={handleCompanyClick}
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-left"
              >
                {job.company}
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {job.companyVerified && (
                  <div className="flex items-center space-x-1">
                    <Award className="w-3 h-3 text-blue-500" />
                    <span className="text-blue-500">Verified</span>
                  </div>
                )}
                {job.countryFlag && (
                  <span>{job.countryFlag}</span>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-lg transition-colors ${
              isSaved 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Job Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {job.title}
        </h3>

        {/* Badges */}
        {job.badges && job.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {job.badges.map((badge) => (
              <span
                key={badge}
                className={`px-2 py-1 text-xs font-medium rounded-full border ${getBadgeColor(badge)}`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Job Details */}
        <div className="space-y-2 mb-4">
          {/* Location */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>

          {/* Salary */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>

          {/* Job Type */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span>{job.type}</span>
            {job.remote && (
              <span className="text-green-600 font-medium">• Remote</span>
            )}
          </div>

          {/* Posted Time */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Posted {job.posted}</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{job.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{job.applicants}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {!hasJobSeekerProfile ? (
              <button
                onClick={handleApplyClick}
                className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Create Profile to Apply
              </button>
            ) : (
              <button
                onClick={handleApplyClick}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Send className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Urgent Indicator */}
      {job.urgent && (
        <div className="absolute top-4 right-4">
          <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
            <AlertCircle className="w-3 h-3 inline mr-1" />
            Urgent
          </div>
        </div>
      )}
    </motion.div>
  );
};

const JobsGrid = ({ 
  jobs, 
  viewMode, 
  setViewMode, 
  savedJobs, 
  handleSaveJob, 
  handleViewJob, 
  handleApplyJob, 
  showEmployerProfile, 
  setShowEmployerProfile,
  hasJobSeekerProfile 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = viewMode === 'grid' ? 12 : 10;
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* View Toggle and Results Count */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {jobs.length} Jobs Found
          </h2>
          {jobs.length === 0 && (
            <p className="text-gray-600">No jobs match your criteria. Try adjusting your filters.</p>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Jobs Grid/List */}
      {jobs.length > 0 && (
        <>
          <motion.div
            layout
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            <AnimatePresence mode="popLayout">
              {currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobs.includes(job.id)}
                  onSaveJob={handleSaveJob}
                  onViewJob={handleViewJob}
                  onApplyJob={handleApplyJob}
                  showEmployerProfile={showEmployerProfile}
                  setShowEmployerProfile={setShowEmployerProfile}
                  hasJobSeekerProfile={hasJobSeekerProfile}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobsGrid;
