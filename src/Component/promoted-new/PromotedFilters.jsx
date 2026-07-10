import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ChevronUp, X, Check } from 'lucide-react';

const PromotedFilters = ({ filters, onFilterChange, sortBy, onSortChange, categories = [] }) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    features: false,
    location: false
  });

  const countries = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
    'Japan',
    'China',
    'India',
    'Brazil',
    'Mexico',
    'South Africa',
    'UAE',
    'Singapore',
    'Malaysia'
  ];

  const advertTypes = [
    { value: 'buy', label: 'Buy' },
    { value: 'sell', label: 'Sell' },
    { value: 'rent', label: 'Rent' },
    { value: 'offer', label: 'Offer' },
    { value: 'wanted', label: 'Wanted' }
  ];

  const sortOptions = [
    { value: 'most_recent', label: '🕒 Most Recent' },
    { value: 'most_viewed', label: '👁️ Most Viewed' },
    { value: 'trending', label: '🔥 Trending' },
    { value: 'price_low_high', label: '💰 Price Low to High' },
    { value: 'price_high_low', label: '💸 Price High to Low' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const handlePriceRangeChange = (type, value) => {
    onFilterChange({
      priceRange: {
        ...filters.priceRange,
        [type]: value
      }
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: '',
      country: '',
      city: '',
      priceRange: { min: 0, max: 10000 },
      advertType: '',
      verifiedOnly: false
    });
  };

  const hasActiveFilters = filters.category || filters.country || filters.city || 
    filters.advertType || filters.verifiedOnly || 
    (filters.priceRange.min > 0) || (filters.priceRange.max < 10000);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.country) count++;
    if (filters.city) count++;
    if (filters.advertType) count++;
    if (filters.verifiedOnly) count++;
    if (filters.priceRange.min > 0) count++;
    if (filters.priceRange.max < 10000) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort Options */}
      <div className="border-b border-gray-200 pb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort by
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Basic Filters */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('basic')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">Basic Information</span>
          {expandedSections.basic ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.basic && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-4"
            >
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id || cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Advert Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advert Type
                </label>
                <div className="space-y-2">
                  {advertTypes.map(type => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="radio"
                        name="advertType"
                        value={type.value}
                        checked={filters.advertType === type.value}
                        onChange={(e) => handleFilterChange('advertType', e.target.value)}
                        className="mr-2 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verified Sellers Only */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                    className="mr-2 text-orange-500 focus:ring-orange-500 rounded"
                  />
                  <span className="text-sm text-gray-700">Verified sellers only</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location Filters */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">Location</span>
          {expandedSections.location ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.location && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-4"
            >
              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City / Region
                </label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  placeholder="Enter city or region..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range Filter */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('features')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">Price Range</span>
          {expandedSections.features ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.features && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={filters.priceRange.min}
                      onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={filters.priceRange.max}
                      onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Price Ranges */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Select
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { min: 0, max: 100, label: 'Under $100' },
                    { min: 100, max: 500, label: '$100 - $500' },
                    { min: 500, max: 1000, label: '$500 - $1,000' },
                    { min: 1000, max: 5000, label: '$1,000 - $5,000' },
                    { min: 5000, max: 10000, label: '$5,000 - $10,000' },
                    { min: 10000, max: 100000, label: 'Over $10,000' }
                  ].map((range, index) => (
                    <button
                      key={index}
                      onClick={() => handleFilterChange('priceRange', { min: range.min, max: range.max })}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Active filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                Category: {filters.category}
                <button
                  onClick={() => handleFilterChange('category', '')}
                  className="hover:text-orange-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.country && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                Country: {filters.country}
                <button
                  onClick={() => handleFilterChange('country', '')}
                  className="hover:text-orange-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                City: {filters.city}
                <button
                  onClick={() => handleFilterChange('city', '')}
                  className="hover:text-orange-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.advertType && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                Type: {filters.advertType}
                <button
                  onClick={() => handleFilterChange('advertType', '')}
                  className="hover:text-orange-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.verifiedOnly && (
              <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                Verified only
                <button
                  onClick={() => handleFilterChange('verifiedOnly', false)}
                  className="hover:text-orange-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotedFilters;
