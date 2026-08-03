import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';

const VenueFilters = ({ onFilterChange, filters }) => {
  const [expandedSections, setExpandedSections] = useState({
    venueType: true,
    capacity: true,
    price: true,
    features: false,
    accessibility: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleVenueTypeChange = (type) => {
    const newTypes = filters.venueTypes?.includes(type)
      ? filters.venueTypes.filter(t => t !== type)
      : [...(filters.venueTypes || []), type];
    
    onFilterChange({ ...filters, venueTypes: newTypes });
  };

  const handleCapacityChange = (capacity) => {
    onFilterChange({ ...filters, capacity });
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
      venueTypes: [],
      capacity: '',
      priceRange: { min: '', max: '' },
      features: [],
      accessibility: []
    });
  };

  const venueTypes = [
    "Wedding Venues",
    "Conference Centres",
    "Party Halls",
    "Outdoor Spaces",
    "Hotels & Banquet Rooms",
    "Bars & Restaurants",
    "Meeting Rooms",
    "Exhibition Spaces",
    "Sports Venues"
  ];

  const features = [
    "WiFi Available",
    "Parking Available",
    "Catering Service",
    "AV Equipment",
    "Air Conditioning",
    "Outdoor Space",
    "Indoor Space",
    "Wheelchair Accessible",
    "Public Transport",
    "Security"
  ];

  const hasActiveFilters = filters.venueTypes?.length > 0 || 
                         filters.capacity || 
                         filters.priceRange?.min || 
                         filters.priceRange?.max ||
                         filters.features?.length > 0 ||
                         filters.accessibility?.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900"></h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Venue Type Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('venueType')}
          className="flex items-center justify-between w-full text-left mb-3 group"
        >
          <h4 className="font-medium text-gray-900">Venue Type</h4>
          {expandedSections.venueType ? (
            <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          )}
        </button>
        
        {expandedSections.venueType && (
          <div className="space-y-2">
            {venueTypes.map((type) => (
              <label key={type} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.venueTypes?.includes(type) || false}
                  onChange={() => handleVenueTypeChange(type)}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {type}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Capacity Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('capacity')}
          className="flex items-center justify-between w-full text-left mb-3 group"
        >
          <h4 className="font-medium text-gray-900">Capacity</h4>
          {expandedSections.capacity ? (
            <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          )}
        </button>
        
        {expandedSections.capacity && (
          <div className="space-y-2">
            {[
              { value: 'small', label: 'Up to 50 people' },
              { value: 'medium', label: '50-200 people' },
              { value: 'large', label: '200-500 people' },
              { value: 'xlarge', label: '500+ people' }
            ].map((capacity) => (
              <label key={capacity.value} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  name="capacity"
                  value={capacity.value}
                  checked={filters.capacity === capacity.value}
                  onChange={() => handleCapacityChange(capacity.value)}
                  className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {capacity.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-3 group"
        >
          <h4 className="font-medium text-gray-900">Price Range</h4>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange?.max || ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="space-y-2">
              {['Under $500', '$500-$1000', '$1000-$2500', '$2500-$5000', '$5000+'].map((priceRange) => (
                <label key={priceRange} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="pricePreset"
                    className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
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
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {feature}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Accessibility Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('accessibility')}
          className="flex items-center justify-between w-full text-left mb-3 group"
        >
          <h4 className="font-medium text-gray-900">Accessibility</h4>
          {expandedSections.accessibility ? (
            <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          )}
        </button>
        
        {expandedSections.accessibility && (
          <div className="space-y-2">
            {['Wheelchair Accessible', 'Elevator Access', 'Accessible Restrooms', 'Parking Access', 'Assistance Available'].map((accessibility) => (
              <label key={accessibility} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.accessibility?.includes(accessibility) || false}
                  onChange={() => {
                    const newAccessibility = filters.accessibility?.includes(accessibility)
                      ? filters.accessibility.filter(a => a !== accessibility)
                      : [...(filters.accessibility || []), accessibility];
                    onFilterChange({ ...filters, accessibility: newAccessibility });
                  }}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {accessibility}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Active:</div>
          <div className="flex flex-wrap gap-2">
            {filters.venueTypes?.map((type) => (
              <span
                key={type}
                className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium"
              >
                {type}
              </span>
            ))}
            {filters.capacity && (
              <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                {filters.capacity}
              </span>
            )}
            {filters.priceRange?.min && (
              <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
                ${filters.priceRange.min}+
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueFilters;
