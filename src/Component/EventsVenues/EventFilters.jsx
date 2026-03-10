import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';

const EventFilters = ({ onFilterChange, filters }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    date: true,
    location: true,
    price: false,
    features: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories?.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...(filters.categories || []), category];
    
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (type, value) => {
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value
      }
    });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      dateRange: '',
      location: '',
      priceRange: { min: '', max: '' },
      features: []
    });
  };

  const categories = [
    "Concerts & Music",
    "Business Conferences",
    "Workshops",
    "Festivals",
    "Parties & Nightlife",
    "Sports Events",
    "Cultural Events",
    "Food & Drink",
    "Charity Events"
  ];

  const features = [
    "Indoor",
    "Outdoor",
    "Family Friendly",
    "21+ Only",
    "Virtual Available",
    "Accessible",
    "Parking Available",
    "Public Transport"
  ];

  const hasActiveFilters = filters.categories?.length > 0 || 
                         filters.dateRange || 
                         filters.location || 
                         filters.priceRange?.min || 
                         filters.priceRange?.max ||
                         filters.features?.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left mb-3 group"
        >
          <h4 className="font-medium text-gray-900">Category</h4>
          {expandedSections.category ? (
            <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          )}
        </button>
        
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category) || false}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Date Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('date')}
          className="flex items-center justify-between w-full text-left mb-3 group"
        >
          <h4 className="font-medium text-gray-900">Date</h4>
          {expandedSections.date ? (
            <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          )}
        </button>
        
        {expandedSections.date && (
          <div className="space-y-3">
            <select
              value={filters.dateRange || ''}
              onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="">Any date</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
              <option value="this-weekend">This Weekend</option>
              <option value="next-week">Next Week</option>
              <option value="this-month">This Month</option>
              <option value="next-month">Next Month</option>
            </select>
            
            <input
              type="date"
              value={filters.specificDate || ''}
              onChange={(e) => onFilterChange({ ...filters, specificDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              placeholder="Specific date"
            />
          </div>
        )}
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full text-left mb-3 group"
        >
          <h4 className="font-medium text-gray-900">Location</h4>
          {expandedSections.location ? (
            <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          )}
        </button>
        
        {expandedSections.location && (
          <div className="space-y-3">
            <input
              type="text"
              value={filters.location || ''}
              onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
              placeholder="City, country..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
              <option value="">Distance</option>
              <option value="5">Within 5 miles</option>
              <option value="10">Within 10 miles</option>
              <option value="25">Within 25 miles</option>
              <option value="50">Within 50 miles</option>
              <option value="100">Within 100 miles</option>
            </select>
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-3 group"
        >
          <h4 className="font-medium text-gray-900">Price</h4>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          )}
        </button>
        
        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange?.min || ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange?.max || ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="space-y-2">
              {['Free', 'Under $25', '$25-$50', '$50-$100', '$100+'].map((priceRange) => (
                <label key={priceRange} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="pricePreset"
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                    {priceRange}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('features')}
          className="flex items-center justify-between w-full text-left mb-3 group"
        >
          <h4 className="font-medium text-gray-900">Features</h4>
          {expandedSections.features ? (
            <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          )}
        </button>
        
        {expandedSections.features && (
          <div className="space-y-2">
            {features.map((feature) => (
              <label key={feature} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.features?.includes(feature) || false}
                  onChange={() => {
                    const newFeatures = filters.features?.includes(feature)
                      ? filters.features.filter(f => f !== feature)
                      : [...(filters.features || []), feature];
                    onFilterChange({ ...filters, features: newFeatures });
                  }}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {feature}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Active filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.categories?.map((cat) => (
              <span
                key={cat}
                className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
              >
                {cat}
              </span>
            ))}
            {filters.dateRange && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {filters.dateRange}
              </span>
            )}
            {filters.location && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {filters.location}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters;
