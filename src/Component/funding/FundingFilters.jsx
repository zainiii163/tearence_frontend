import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Globe,
  DollarSign,
  Shield,
  Clock,
  TrendingUp,
  Target
} from 'lucide-react';
import fundingService from '../../services/FundingService';

const FundingFilters = ({ filters, onFilterChange, onClearFilters, categories }) => {
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

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Netherlands', 'Japan', 'South Korea', 'Singapore', 'Other'
  ];

  const fundingRanges = [
    { label: 'Under $1,000', value: '1000' },
    { label: 'Under $5,000', value: '5000' },
    { label: 'Under $10,000', value: '10000' },
    { label: 'Under $25,000', value: '25000' },
    { label: 'Under $50,000', value: '50000' },
    { label: 'Under $100,000', value: '100000' },
    { label: 'Any Amount', value: '' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: <Clock className="w-4 h-4" /> },
    { value: 'mostFunded', label: 'Most Funded', icon: <Target className="w-4 h-4" /> },
    { value: 'trending', label: 'Trending', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'endingSoon', label: 'Ending Soon', icon: <Clock className="w-4 h-4" /> }
  ];

  const hasActiveFilters = filters.category || filters.country || filters.fundingGoal || filters.verifiedOnly;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900 sr-only">Options</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Basic Information */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('basic')}
          className="flex items-center justify-between w-full mb-4 text-left"
        >
          <span className="font-medium text-gray-900">Basic Information</span>
          {expandedSections.basic ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.basic && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => onFilterChange({ category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Country/Region
                </label>
                <select
                  value={filters.country}
                  onChange={(e) => onFilterChange({ country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Funding Goal Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Maximum Funding Goal
                </label>
                <select
                  value={filters.fundingGoal}
                  onChange={(e) => onFilterChange({ fundingGoal: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {fundingRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('features')}
          className="flex items-center justify-between w-full mb-4 text-left"
        >
          <span className="font-medium text-gray-900">Features</span>
          {expandedSections.features ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.features && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 overflow-hidden"
            >
              {/* Verified Creators Only */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => onFilterChange({ verifiedOnly: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Verified Creators Only</span>
                </div>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('advanced')}
          className="flex items-center justify-between w-full mb-4 text-left"
        >
          <span className="font-medium text-gray-900">Advanced</span>
          {expandedSections.advanced ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.advanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="space-y-2">
                  {sortOptions.map(option => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={(e) => onFilterChange({ sortBy: e.target.value })}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t border-gray-200"
        >
          <div className="text-sm text-gray-600 mb-2">Active:</div>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Category: {filters.category}
                <button
                  onClick={() => onFilterChange({ category: '' })}
                  className="hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.country && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Country: {filters.country}
                <button
                  onClick={() => onFilterChange({ country: '' })}
                  className="hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.fundingGoal && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Max: ${filters.fundingGoal}
                <button
                  onClick={() => onFilterChange({ fundingGoal: '' })}
                  className="hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.verifiedOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Verified Only
                <button
                  onClick={() => onFilterChange({ verifiedOnly: false })}
                  className="hover:text-green-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FundingFilters;
