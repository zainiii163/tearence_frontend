import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Wifi, 
  Waves,
  Coffee,
  ParkingSquare,
  Wind,
  Dog,
  Car,
  Hotel,
  MapPin,
  DollarSign,
  Star,
  CheckCircle
} from 'lucide-react';

const TravelFilters = ({ 
  onFilterChange, 
  selectedCategory, 
  selectedRegion, 
  onSortChange, 
  sortBy 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    amenities: false,
    advanced: false
  });

  const [filters, setFilters] = useState({
    accommodationType: '',
    transportType: '',
    country: '',
    city: '',
    priceRange: '',
    amenities: [],
    distance: '',
    verified: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    handleFilterChange('amenities', newAmenities);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      accommodationType: '',
      transportType: '',
      country: '',
      city: '',
      priceRange: '',
      amenities: [],
      distance: '',
      verified: false
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const accommodationTypes = [
    { value: 'luxury-resorts', label: 'Luxury Resorts' },
    { value: 'boutique-hotels', label: 'Boutique Hotels' },
    { value: 'budget-hotels', label: 'Budget Hotels' },
    { value: 'bed-breakfast', label: 'Bed & Breakfasts' },
    { value: 'holiday-homes', label: 'Holiday Homes' },
    { value: 'beachfront-stays', label: 'Beachfront Stays' },
    { value: 'mountain-retreats', label: 'Mountain Retreats' },
    { value: 'city-breaks', label: 'City Breaks' }
  ];

  const transportTypes = [
    { value: 'airport-transfers', label: 'Airport Transfers' },
    { value: 'car-hire', label: 'Car Hire' },
    { value: 'chauffeur-services', label: 'Chauffeur Services' },
    { value: 'taxi-services', label: 'Taxi Services' },
    { value: 'shuttle-buses', label: 'Shuttle Buses' },
    { value: 'boat-ferry', label: 'Boat & Ferry Services' },
    { value: 'tour-buses', label: 'Tour Buses' },
    { value: 'motorbike-rentals', label: 'Motorbike Rentals' }
  ];

  const countries = [
    'United States', 'United Kingdom', 'France', 'Italy', 'Spain', 'Germany',
    'Thailand', 'Indonesia', 'Japan', 'China', 'India', 'Australia',
    'UAE', 'Qatar', 'Egypt', 'South Africa', 'Morocco', 'Kenya',
    'Brazil', 'Argentina', 'Mexico', 'Canada', 'Switzerland', 'Netherlands'
  ];

  const amenities = [
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'pool', label: 'Swimming Pool', icon: Waves },
    { id: 'breakfast', label: 'Breakfast', icon: Coffee },
    { id: 'parking', label: 'Parking', icon: ParkingSquare },
    { id: 'ac', label: 'Air Conditioning', icon: Wind },
    { id: 'pet-friendly', label: 'Pet Friendly', icon: Dog }
  ];

  const sortOptions = [
    { value: 'mostRecent', label: 'Most Recent', icon: '🕐' },
    { value: 'mostViewed', label: 'Most Viewed', icon: '👁️' },
    { value: 'highestRated', label: 'Highest Rated', icon: '⭐' },
    { value: 'trending', label: 'Trending', icon: '🔥' },
    { value: 'priceLowToHigh', label: 'Price Low to High', icon: '💰' },
    { value: 'priceHighToLow', label: 'Price High to Low', icon: '💸' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={clearAllFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Sort Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Sort By</label>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={sortBy === option.value}
                onChange={() => onSortChange(option.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{option.icon} {option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Basic Information */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => toggleSection('basic')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-gray-700">Basic Information</h4>
          {expandedSections.basic ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.basic && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-4 overflow-hidden"
            >
              {/* Accommodation Type */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Accommodation Type</label>
                <select
                  value={filters.accommodationType}
                  onChange={(e) => handleFilterChange('accommodationType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {accommodationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transport Type */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Transport Type</label>
                <select
                  value={filters.transportType}
                  onChange={(e) => handleFilterChange('transportType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {transportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Country</label>
                <select
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">City / Region</label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  placeholder="Enter city or region"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Price</option>
                  <option value="0-50">$0 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100-200">$100 - $200</option>
                  <option value="200-500">$200 - $500</option>
                  <option value="500+">$500+</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Amenities */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => toggleSection('amenities')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-gray-700">Amenities</h4>
          {expandedSections.amenities ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.amenities && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((amenity) => {
                  const Icon = amenity.icon;
                  const isSelected = filters.amenities.includes(amenity.id);
                  
                  return (
                    <label
                      key={amenity.id}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">{amenity.label}</span>
                    </label>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advanced Filters */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => toggleSection('advanced')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-medium text-gray-700">Advanced Filters</h4>
          {expandedSections.advanced ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <AnimatePresence>
          {expandedSections.advanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-4 overflow-hidden"
            >
              {/* Distance from City Centre */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Distance from City Centre</label>
                <select
                  value={filters.distance}
                  onChange={(e) => handleFilterChange('distance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Distance</option>
                  <option value="0-1">Within 1 km</option>
                  <option value="1-5">1-5 km</option>
                  <option value="5-10">5-10 km</option>
                  <option value="10+">10+ km</option>
                </select>
              </div>

              {/* Verified Businesses */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="verified"
                  checked={filters.verified}
                  onChange={(e) => handleFilterChange('verified', e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="verified" className="flex items-center space-x-2 cursor-pointer">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Verified Businesses Only</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters Summary */}
      {(selectedCategory || selectedRegion || Object.values(filters).some(v => v && v !== '' && (!Array.isArray(v) || v.length > 0))) && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                <Hotel className="w-3 h-3" />
                <span>{selectedCategory.name}</span>
              </span>
            )}
            {selectedRegion && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <MapPin className="w-3 h-3" />
                <span>{selectedRegion}</span>
              </span>
            )}
            {filters.country && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                <span>{filters.country}</span>
              </span>
            )}
            {filters.priceRange && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                <DollarSign className="w-3 h-3" />
                <span>{filters.priceRange}</span>
              </span>
            )}
            {filters.verified && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <CheckCircle className="w-3 h-3" />
                <span>Verified</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelFilters;
