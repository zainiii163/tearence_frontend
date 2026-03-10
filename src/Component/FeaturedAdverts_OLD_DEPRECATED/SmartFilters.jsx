import React, { useState } from 'react';
import { 
  FaFilter, 
  FaSearch, 
  FaMapMarkerAlt, 
  FaTag, 
  FaDollarSign, 
  FaStar,
  FaCheckCircle,
  FaSortAmountDown,
  FaSortAmountUp,
  FaClock,
  FaEye,
  FaArrowUp,
  FaTimes
} from 'react-icons/fa';

const SmartFilters = ({ 
  filters, 
  onFiltersChange, 
  sortBy, 
  onSortChange,
  totalCount = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'property', label: 'Property' },
    { value: 'vehicles', label: 'Cars & Vehicles' },
    { value: 'jobs', label: 'Jobs & Services' },
    { value: 'business', label: 'Business Opportunities' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion & Beauty' },
    { value: 'travel', label: 'Travel & Experiences' },
    { value: 'events', label: 'Events & Tickets' },
    { value: 'pets', label: 'Pets & Animals' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'education', label: 'Education & Courses' }
  ];

  const countries = [
    { value: 'all', label: 'All Countries', flag: '🌍' },
    { value: 'us', label: 'United States', flag: '🇺🇸' },
    { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'france', label: 'France', flag: '🇫🇷' },
    { value: 'germany', label: 'Germany', flag: '🇩🇪' },
    { value: 'italy', label: 'Italy', flag: '🇮🇹' },
    { value: 'spain', label: 'Spain', flag: '🇪🇸' },
    { value: 'japan', label: 'Japan', flag: '🇯🇵' },
    { value: 'china', label: 'China', flag: '🇨🇳' },
    { value: 'singapore', label: 'Singapore', flag: '🇸🇬' },
    { value: 'australia', label: 'Australia', flag: '🇦🇺' },
    { value: 'canada', label: 'Canada', flag: '🇨🇦' }
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'buy', label: 'Buy' },
    { value: 'sell', label: 'Sell' },
    { value: 'rent', label: 'Rent' },
    { value: 'offer', label: 'Offer' },
    { value: 'wanted', label: 'Wanted' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent', icon: FaClock },
    { value: 'viewed', label: 'Most Viewed', icon: FaEye },
    { value: 'rated', label: 'Highest Rated', icon: FaStar },
    { value: 'trending', label: 'Trending', icon: FaArrowUp },
    { value: 'price-low', label: 'Price (Low → High)', icon: FaSortAmountUp },
    { value: 'price-high', label: 'Price (High → Low)', icon: FaSortAmountDown }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: 'all',
      country: 'all',
      city: '',
      priceMin: '',
      priceMax: '',
      type: 'all',
      verifiedOnly: false
    });
  };

  const hasActiveFilters = filters && (
    filters.search ||
    filters.category !== 'all' ||
    filters.country !== 'all' ||
    filters.city ||
    filters.priceMin ||
    filters.priceMax ||
    filters.type !== 'all' ||
    filters.verifiedOnly
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaFilter className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Smart Filters & Sorting</h3>
            {totalCount > 0 && (
              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                {totalCount.toLocaleString()} results
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
              >
                <FaTimes className="h-3 w-3" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Filters (Always Visible) */}
      <div className="p-6 space-y-4">
        {/* Search and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filters?.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search featured adverts..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filters?.category || 'all'}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={sortBy || 'recent'}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
            >
              {sortOptions.map(option => {
                const Icon = option.icon;
                return (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Country */}
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filters?.country || 'all'}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                >
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>
                      {country.flag} {country.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={filters?.city || ''}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  placeholder="City..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Type */}
              <div className="relative">
                <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filters?.type || 'all'}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
                >
                  {types.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verified Only */}
              <div className="flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={filters?.verifiedOnly || false}
                    onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                    className="h-5 w-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div className="flex items-center space-x-2">
                    <FaCheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Verified Sellers Only</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={filters?.priceMin || ''}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  placeholder="Min Price"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={filters?.priceMax || ''}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  placeholder="Max Price"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            {filters?.search && (
              <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <FaSearch className="h-3 w-3" />
                <span>{filters.search}</span>
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 hover:text-purple-900"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters?.category !== 'all' && (
              <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <FaTag className="h-3 w-3" />
                <span>{categories.find(c => c.value === filters.category)?.label}</span>
                <button
                  onClick={() => handleFilterChange('category', 'all')}
                  className="ml-1 hover:text-purple-900"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters?.country !== 'all' && (
              <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                <span>{countries.find(c => c.value === filters.country)?.flag}</span>
                <span>{countries.find(c => c.value === filters.country)?.label}</span>
                <button
                  onClick={() => handleFilterChange('country', 'all')}
                  className="ml-1 hover:text-purple-900"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters?.verifiedOnly && (
              <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                <FaCheckCircle className="h-3 w-3" />
                <span>Verified Only</span>
                <button
                  onClick={() => handleFilterChange('verifiedOnly', false)}
                  className="ml-1 hover:text-green-900"
                >
                  <FaTimes className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartFilters;
