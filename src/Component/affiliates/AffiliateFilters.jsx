import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Search,
  DollarSign,
  Globe,
  Shield,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

const AffiliateFilters = ({ filters, onFilterChange, onClearFilters, showFilters, setShowFilters }) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    advanced: false
  });

  const commissionRanges = [
    { label: 'Any', value: '' },
    { label: 'Under 10%', value: '0-10' },
    { label: '10-25%', value: '10-25' },
    { label: '25-50%', value: '25-50' },
    { label: 'Over 50%', value: '50+' }
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Spain', 'Italy', 'Netherlands', 'Japan', 'China', 'India',
    'Brazil', 'Mexico', 'Global'
  ];

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Most Views', value: 'views' },
    { label: 'Highest Commission', value: 'commission' },
    { label: 'Top Rated', value: 'rating' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false
  );

  return (
    <div className="lg:hidden">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full bg-white rounded-lg shadow-md p-4 flex items-center justify-between mb-4"
      >
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {Object.values(filters).filter(value => value !== '' && value !== false).length}
            </span>
          )}
        </div>
        {showFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-md p-4 mb-4"
          >
            {/* Basic Filters */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('basic')}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="font-semibold text-gray-900">Basic Filters</h3>
                {expandedSections.basic ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {expandedSections.basic && (
                <div className="space-y-4">
                  {/* Commission Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="inline h-4 w-4 mr-1" />
                      Commission Rate
                    </label>
                    <select
                      value={filters.commissionRate}
                      onChange={(e) => onFilterChange('commissionRate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {commissionRanges.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="inline h-4 w-4 mr-1" />
                      Country
                    </label>
                    <select
                      value={filters.country}
                      onChange={(e) => onFilterChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Countries</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Star className="inline h-4 w-4 mr-1" />
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => onFilterChange('sortBy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Filters */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('advanced')}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
                {expandedSections.advanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {expandedSections.advanced && (
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.verified}
                      onChange={(e) => onFilterChange('verified', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">Verified Businesses Only</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.trending}
                      onChange={(e) => onFilterChange('trending', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm text-gray-700">Trending Offers</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.newest}
                      onChange={(e) => onFilterChange('newest', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-700">New This Week</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.highEarning}
                      onChange={(e) => onFilterChange('highEarning', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">High Earning (25%+)</span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Clear All Filters</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AffiliateFilters;
