import React, { useState } from 'react';
import { 
  Filter, 
  SortAsc, 
  Grid, 
  List, 
  X, 
  ChevronDown, 
  ChevronUp,
  DollarSign,
  MapPin,
  Star,
  Shield,
  Calendar,
  TrendingUp,
  Eye
} from 'lucide-react';

const FeaturedFilters = ({
  categories,
  countries,
  selectedCategory,
  setSelectedCategory,
  selectedCountry,
  setSelectedCountry,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const sortOptions = [
    { value: 'recent', label: 'Most Recent', icon: Calendar },
    { value: 'views', label: 'Most Viewed', icon: Eye },
    { value: 'rating', label: 'Highest Rated', icon: Star },
    { value: 'trending', label: 'Trending', icon: TrendingUp },
    { value: 'price-low', label: 'Price Low → High', icon: SortAsc },
    { value: 'price-high', label: 'Price High → Low', icon: DollarSign }
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClearAll = () => {
    setSelectedCategory('all');
    setSelectedCountry('all');
    setPriceRange({ min: '', max: '' });
    setActiveFilters({});
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedCountry !== 'all' || priceRange.min || priceRange.max;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filters & Sorting</h3>
            </div>
            
            {/* Active Filters Count */}
            {hasActiveFilters && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                {Object.values({
                  category: selectedCategory !== 'all',
                  country: selectedCountry !== 'all',
                  priceMin: !!priceRange.min,
                  priceMax: !!priceRange.max
                }).filter(Boolean).length} active
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Clear All */}
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}

            {/* Expand/Collapse */}
            <button
              onClick={toggleExpanded}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Show More</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Basic Filters (Always Visible) */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country.value} value={country.value}>
                    {country.flag} {country.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

          {/* Price Range (Always Visible) */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="Any"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t border-gray-200 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Advert Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Advert Type</label>
                <div className="space-y-2">
                  {['Product', 'Service', 'Property', 'Job', 'Event', 'Vehicle'].map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Condition</label>
                <div className="space-y-2">
                  {['New', 'Used', 'Refurbished', 'Not Applicable'].map(condition => (
                    <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Additional Options</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Verified Sellers Only</span>
                    <Shield className="h-4 w-4 text-green-500" />
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">With Images Only</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Premium Listings</span>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </label>
                </div>
              </div>
            </div>

            {/* Location Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Search Radius</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 font-medium">50 km</span>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="border-t border-gray-200 p-6">
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                <div className="inline-flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  <span>Category: {categories.find(cat => cat.id === selectedCategory)?.name}</span>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-1 hover:text-purple-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {selectedCountry !== 'all' && (
                <div className="inline-flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  <span>Country: {countries.find(c => c.value === selectedCountry)?.label}</span>
                  <button
                    onClick={() => setSelectedCountry('all')}
                    className="ml-1 hover:text-purple-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {priceRange.min && (
                <div className="inline-flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  <span>Min: ${priceRange.min}</span>
                  <button
                    onClick={() => setPriceRange(prev => ({ ...prev, min: '' }))}
                    className="ml-1 hover:text-purple-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {priceRange.max && (
                <div className="inline-flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  <span>Max: ${priceRange.max}</span>
                  <button
                    onClick={() => setPriceRange(prev => ({ ...prev, max: '' }))}
                    className="ml-1 hover:text-purple-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedFilters;
