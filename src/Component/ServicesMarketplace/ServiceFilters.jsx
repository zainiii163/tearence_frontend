import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, Search, X, Grid3X3, List, SlidersHorizontal } from 'lucide-react';

const ServiceFilters = ({ 
  filters = {}, 
  onFilterChange, 
  onSortChange, 
  sortBy = 'most_recent',
  categories = [],
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    features: false,
    advanced: false
  });
  const [viewMode, setViewMode] = useState('grid');

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterUpdate = (key, value) => {
    if (onFilterChange) {
      onFilterChange({ [key]: value });
    }
  };

  const handleSortUpdate = (value) => {
    if (onSortChange) {
      onSortChange(value);
    }
  };

  const clearFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        category: '',
        country: '',
        priceRange: '',
        deliveryTime: '',
        rating: '',
        verifiedOnly: false
      });
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== false && value !== null
  );

  const sortOptions = [
    { value: 'most_recent', label: 'Most Recent', emoji: '🕐' },
    { value: 'most_viewed', label: 'Most Viewed', emoji: '👁️' },
    { value: 'trending', label: 'Trending', emoji: '🔥' },
    { value: 'highest_rated', label: 'Highest Rated', emoji: '⭐' },
    { value: 'price_low_high', label: 'Price Low → High', emoji: '📈' },
    { value: 'price_high_low', label: 'Price High → Low', emoji: '📉' }
  ];

  const deliveryTimes = [
    { value: '1', label: '1 day' },
    { value: '3', label: '3 days' },
    { value: '7', label: '1 week' },
    { value: '14', label: '2 weeks' },
    { value: '30', label: '1 month' }
  ];

  const priceRanges = [
    { value: '0-50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-500', label: '$100 - $500' },
    { value: '500-1000', label: '$500 - $1,000' },
    { value: '1000+', label: '$1,000+' }
  ];

  const countries = [
    { value: 'US', label: '🇺🇸 United States' },
    { value: 'UK', label: '🇬🇧 United Kingdom' },
    { value: 'CA', label: '🇨🇦 Canada' },
    { value: 'AU', label: '🇦🇺 Australia' },
    { value: 'DE', label: '🇩🇪 Germany' },
    { value: 'FR', label: '🇫🇷 France' },
    { value: 'IN', label: '🇮🇳 India' },
    { value: 'PK', label: '🇵🇰 Pakistan' },
    { value: 'AE', label: '🇦🇪 UAE' },
    { value: 'SA', label: '🇸🇦 Saudi Arabia' }
  ];

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => handleSortUpdate(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Grid3X3 className="w-4 h-4 mx-auto" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <List className="w-4 h-4 mx-auto" />
          </button>
        </div>
      </div>

      {/* Basic Filters Section */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('basic')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="text-sm font-medium text-gray-700">Basic Filters</span>
          {expandedSections.basic ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expandedSections.basic && (
          <div className="space-y-4 mt-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="relative">
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterUpdate('category', e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <div className="relative">
                <select
                  value={filters.country || ''}
                  onChange={(e) => handleFilterUpdate('country', e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="relative">
                <select
                  value={filters.priceRange || ''}
                  onChange={(e) => handleFilterUpdate('priceRange', e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Any Price</option>
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Delivery Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
              <div className="relative">
                <select
                  value={filters.deliveryTime || ''}
                  onChange={(e) => handleFilterUpdate('deliveryTime', e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Any Time</option>
                  {deliveryTimes.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('features')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="text-sm font-medium text-gray-700">Provider Level</span>
          {expandedSections.features ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expandedSections.features && (
          <div className="space-y-3 mt-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <div className="relative">
                <select
                  value={filters.rating || ''}
                  onChange={(e) => handleFilterUpdate('rating', e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ ⭐</option>
                  <option value="4">4.0+ ⭐</option>
                  <option value="3.5">3.5+ ⭐</option>
                  <option value="3">3.0+ ⭐</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Verified Providers */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="verified-only"
                checked={filters.verifiedOnly || false}
                onChange={(e) => handleFilterUpdate('verifiedOnly', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="verified-only" className="text-sm font-medium text-gray-700">
                Verified providers only
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters Section */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('advanced')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="text-sm font-medium text-gray-700">Advanced Options</span>
          {expandedSections.advanced ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {expandedSections.advanced && (
          <div className="space-y-3 mt-4">
            <div className="text-sm text-gray-500">
              More advanced filters coming soon...
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="text-sm font-medium text-gray-700 mb-2">Active filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Category: {categories.find(c => c.id === filters.category)?.name || filters.category}
                <button
                  onClick={() => handleFilterUpdate('category', '')}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {filters.country && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Country: {countries.find(c => c.value === filters.country)?.label || filters.country}
                <button
                  onClick={() => handleFilterUpdate('country', '')}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {filters.priceRange && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Price: {priceRanges.find(r => r.value === filters.priceRange)?.label || filters.priceRange}
                <button
                  onClick={() => handleFilterUpdate('priceRange', '')}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {filters.deliveryTime && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Delivery: {deliveryTimes.find(t => t.value === filters.deliveryTime)?.label || filters.deliveryTime}
                <button
                  onClick={() => handleFilterUpdate('deliveryTime', '')}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {filters.rating && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Rating: {filters.rating}+ ⭐
                <button
                  onClick={() => handleFilterUpdate('rating', '')}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {filters.verifiedOnly && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Verified only
                <button
                  onClick={() => handleFilterUpdate('verifiedOnly', false)}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceFilters;
