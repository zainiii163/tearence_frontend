import React, { useState } from 'react';
import { Search, Filter, X, MapPin, Briefcase, GraduationCap } from 'lucide-react';

const JobSeekerFilters = ({ onFilterChange, filters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleLocationChange = (e) => {
    onFilterChange({ ...filters, location: e.target.value });
  };

  const handleExperienceChange = (e) => {
    onFilterChange({ ...filters, experience_level: e.target.value });
  };

  const handleEducationChange = (e) => {
    onFilterChange({ ...filters, education_level: e.target.value });
  };

  const handleRemoteChange = (e) => {
    onFilterChange({ ...filters, is_remote_available: e.target.checked });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      location: '',
      experience_level: '',
      education_level: '',
      is_remote_available: false
    });
  };

  const hasActiveFilters = filters.search || filters.location || filters.experience_level || filters.education_level || filters.is_remote_available;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by skills, role, or keywords..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        <Filter className="w-4 h-4 mr-2" />
        {isExpanded ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
          {/* Location Filter */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </label>
            <input
              type="text"
              placeholder="City or country..."
              value={filters.location || ''}
              onChange={handleLocationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Experience Level Filter */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 mr-2" />
              Experience Level
            </label>
            <select
              value={filters.experience_level || ''}
              onChange={handleExperienceChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="entry">Entry Level</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          {/* Education Level Filter */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <GraduationCap className="w-4 h-4 mr-2" />
              Education Level
            </label>
            <select
              value={filters.education_level || ''}
              onChange={handleEducationChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="high_school">High School</option>
              <option value="diploma">Diploma</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="phd">PhD</option>
              <option value="none">None</option>
            </select>
          </div>

          {/* Remote Availability Filter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remote"
              checked={filters.is_remote_available || false}
              onChange={handleRemoteChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="remote" className="ml-2 text-sm text-gray-700">
              Remote Available
            </label>
          </div>

          {/* Clear all Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center w-full py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobSeekerFilters;
