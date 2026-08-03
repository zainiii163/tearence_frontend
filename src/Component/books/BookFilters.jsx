import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X, Search } from 'lucide-react';

const BookFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    features: false,
    advanced: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterType, value) => {
    onFiltersChange(filterType, value);
  };

  const genres = [
    'Fiction', 'Non-Fiction', 'Romance', 'Thriller', 'Mystery', 
    'Fantasy', 'Sci-Fi', 'Self-Help', 'Business', "Children's Books", 
    'Poetry', 'Biographies', 'Spirituality', 'Academic'
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'India',
    'Nigeria', 'Germany', 'France', 'Japan', 'Brazil', 'Mexico', 'South Africa'
  ];

  const formats = [
    'Paperback', 'Hardcover', 'eBook', 'Audiobook'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 
    'Portuguese', 'Hindi', 'Arabic', 'Russian'
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent', emoji: '🕐' },
    { value: 'views', label: 'Most Viewed', emoji: '👁️' },
    { value: 'rating', label: 'Highest Rated', emoji: '⭐' },
    { value: 'trending', label: 'Trending', emoji: '🔥' },
    { value: 'price-low', label: 'Price Low to High', emoji: '💰' },
    { value: 'price-high', label: 'Price High to Low', emoji: '💸' }
  ];

  const hasActiveFilters = Object.values(filters).some(value => 
    value && (typeof value === 'string' ? value !== '' : value.length > 0)
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900 sr-only">Options</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Basic Filters */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('basic')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-900 mb-4 hover:text-yellow-600 transition-colors"
        >
          <span>Basics</span>
          {expandedSections.basic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expandedSections.basic && (
          <div className="space-y-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select
                value={filters.genre || ''}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={filters.country || ''}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${filters.minPrice || 0} - ${filters.maxPrice || 100}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.maxPrice || 100}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$100</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features Filters */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('features')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-900 mb-4 hover:text-yellow-600 transition-colors"
        >
          <span>Features</span>
          {expandedSections.features ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expandedSections.features && (
          <div className="space-y-4">
            {/* Format Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <div className="space-y-2">
                {formats.map(format => (
                  <label key={format} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.format?.includes(format) || false}
                      onChange={(e) => {
                        const currentFormats = filters.format || [];
                        const newFormats = e.target.checked
                          ? [...currentFormats, format]
                          : currentFormats.filter(f => f !== format);
                        handleFilterChange('format', newFormats);
                      }}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">{format}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={filters.language || ''}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Languages</option>
                {languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>

            {/* Verified Authors */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.verifiedAuthors || false}
                  onChange={(e) => handleFilterChange('verifiedAuthors', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-medium text-gray-700">Verified Authors Only</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('advanced')}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-900 mb-4 hover:text-yellow-600 transition-colors"
        >
          <span>Advanced</span>
          {expandedSections.advanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expandedSections.advanced && (
          <div className="space-y-4">
            {/* Badge Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Type</label>
              <div className="space-y-2">
                {['Promoted', 'Featured', 'Sponsored'].map(badge => (
                  <label key={badge} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.badge?.includes(badge) || false}
                      onChange={(e) => {
                        const currentBadges = filters.badge || [];
                        const newBadges = e.target.checked
                          ? [...currentBadges, badge]
                          : currentBadges.filter(b => b !== badge);
                        handleFilterChange('badge', newBadges);
                      }}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="text-sm text-gray-700">{badge}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating: {filters.minRating || 0} stars
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating || 0}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>5</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sort Options */}
      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <div className="grid grid-cols-1 gap-2">
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleFilterChange('sort', option.value)}
              className={`text-left px-3 py-2 rounded-lg transition-colors ${
                filters.sort === option.value
                  ? 'bg-yellow-100 text-yellow-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <span className="mr-2">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookFilters;
