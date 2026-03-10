import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  GraduationCap, 
  Award,
  Building,
  Globe,
  Users
} from 'lucide-react';

const JobsFilters = ({ 
  filters, 
  setFilters, 
  selectedCategory, 
  setSelectedCategory, 
  sortBy, 
  setSortBy 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    features: true,
    advanced: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      location: '',
      remote: false,
      salaryRange: '',
      jobType: '',
      experienceLevel: '',
      educationLevel: '',
      verifiedEmployers: false
    });
    setSelectedCategory('');
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false
  ) || selectedCategory;

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Temporary',
    'Internship',
    'Remote'
  ];

  const experienceLevels = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'Executive Level'
  ];

  const educationLevels = [
    'High School',
    'Associate Degree',
    "Bachelor's Degree",
    "Master's Degree",
    'PhD',
    'No Degree Required'
  ];

  const salaryRanges = [
    { label: 'Under $30,000', value: '0-30000' },
    { label: '$30,000 - $50,000', value: '30000-50000' },
    { label: '$50,000 - $75,000', value: '50000-75000' },
    { label: '$75,000 - $100,000', value: '75000-100000' },
    { label: '$100,000 - $150,000', value: '100000-150000' },
    { label: 'Over $150,000', value: '150000+' }
  ];

  const sortOptions = [
    'Most Recent',
    'Highest Salary',
    'Most Viewed',
    'Trending',
    'Closing Soon'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Sort Options */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Basic Information Section */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('basic')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">Basic Information</span>
          </div>
          {expandedSections.basic ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.basic && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="City or Country"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">All Types</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <select
                    value={filters.salaryRange}
                    onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Any Salary</option>
                    {salaryRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features Section */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('features')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">Features</span>
          </div>
          {expandedSections.features ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.features && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Remote Toggle */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.remote}
                    onChange={(e) => handleFilterChange('remote', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Remote only</span>
                  </div>
                </label>

                {/* Verified Employers */}
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.verifiedEmployers}
                    onChange={(e) => handleFilterChange('verifiedEmployers', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Verified employers only</span>
                  </div>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Section */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('advanced')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">Advanced</span>
          </div>
          {expandedSections.advanced ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.advanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">All Levels</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Education Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education Level
                  </label>
                  <select
                    value={filters.educationLevel}
                    onChange={(e) => handleFilterChange('educationLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">All Education</option>
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <div className="text-sm font-medium text-gray-700 mb-3">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <span>{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('')}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {filters.location && (
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <span>📍 {filters.location}</span>
                <button
                  onClick={() => handleFilterChange('location', '')}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {filters.remote && (
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <span>🏠 Remote</span>
                <button
                  onClick={() => handleFilterChange('remote', false)}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {filters.jobType && (
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <span>{filters.jobType}</span>
                <button
                  onClick={() => handleFilterChange('jobType', '')}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {filters.salaryRange && (
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <span>💰 {filters.salaryRange}</span>
                <button
                  onClick={() => handleFilterChange('salaryRange', '')}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {filters.verifiedEmployers && (
              <div className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <span>✅ Verified</span>
                <button
                  onClick={() => handleFilterChange('verifiedEmployers', false)}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default JobsFilters;
