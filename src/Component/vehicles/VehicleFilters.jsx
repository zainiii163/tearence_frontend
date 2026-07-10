import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp, Search, MapPin, DollarSign, Calendar, Star, Check } from 'lucide-react';

const VehicleFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  categories = [],
  vehicleTypes = [],
  onSearch 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    features: false,
    location: false,
    price: true
  });
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // Custom styles to prevent scrollbars
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .vehicle-select select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 0.5rem center;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
      }
      .vehicle-select select::-webkit-scrollbar {
        display: none;
      }
      .vehicle-select select::-moz-scrollbar {
        display: none;
      }
      .vehicle-select select::-ms-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterUpdate = (field, value) => {
    onFilterChange(field, value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Immediate search for better UX
    onSearch(value);
  };

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'Hydrogen'];
  const transmissions = ['Manual', 'Automatic', 'Semi-Automatic', 'CVT'];
  const bodyTypes = ['Sedan', 'Hatchback', 'SUV', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Van', 'Truck', 'Bus', 'Motorbike'];
  const conditions = ['New', 'Used', 'Certified Pre-Owned', 'Refurbished'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
      {/* Search Bar */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search Vehicles</label>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by make, model, or keywords..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </form>
        <p className="text-xs text-gray-500 mt-1">
          Use search for specific models not listed in dropdown
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={onClearFilters}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Basic Filters Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('basic')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <h4 className="font-medium text-gray-900">Basic Information</h4>
          {expandedSections.basic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.basic && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Vehicle Type */}
                <div className="vehicle-select">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                  <select
                    value={filters.vehicle_type || ''}
                    onChange={(e) => handleFilterUpdate('vehicle_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Types</option>
                    {Object.entries(vehicleTypes).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="vehicle-select">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterUpdate('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Categories</option>
                    {Object.entries(categories).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div className="vehicle-select">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={filters.condition || ''}
                    onChange={(e) => handleFilterUpdate('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  >
                    <option value="">Any Condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition.toLowerCase().replace(' ', '_')}>{condition}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div className="vehicle-select">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={filters.min_year || ''}
                    onChange={(e) => handleFilterUpdate('min_year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  >
                    <option value="">Min Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Advert Type */}
                <div className="vehicle-select">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Advert Type</label>
                  <select
                    value={filters.advert_type || ''}
                    onChange={(e) => handleFilterUpdate('advert_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Types</option>
                    <option value="sale">For Sale</option>
                    <option value="hire">For Hire</option>
                    <option value="lease">For Lease</option>
                    <option value="transport_service">Transport Service</option>
                  </select>
                </div>

                {/* Condition */}
                <div className="vehicle-select">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={filters.condition || ''}
                    onChange={(e) => handleFilterUpdate('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Conditions</option>
                    <option value="new">New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('features')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <h4 className="font-medium text-gray-900">Features</h4>
          {expandedSections.features ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.features && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Fuel Type */}
                <div className="vehicle-select">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <select
                    value={filters.fuel_type || ''}
                    onChange={(e) => handleFilterUpdate('fuel_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Fuel Types</option>
                    {fuelTypes.map(type => (
                      <option key={type} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Transmission */}
                <div className="vehicle-select">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                  <select
                    value={filters.transmission || ''}
                    onChange={(e) => handleFilterUpdate('transmission', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Transmissions</option>
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                    <option value="cvt">CVT</option>
                    <option value="dct">DCT</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <h4 className="font-medium text-gray-900">Location</h4>
          {expandedSections.location ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.location && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    placeholder="Enter country name"
                    value={filters.country || ''}
                    onChange={(e) => handleFilterUpdate('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="Enter city name"
                    value={filters.city || ''}
                    onChange={(e) => handleFilterUpdate('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <h4 className="font-medium text-gray-900">Price Range</h4>
          {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.min_price || ''}
                      onChange={(e) => handleFilterUpdate('min_price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.max_price || ''}
                      onChange={(e) => handleFilterUpdate('max_price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Special Filters */}
      <div className="mb-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.featured || false}
            onChange={(e) => handleFilterUpdate('featured', e.target.checked)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <span className="text-sm font-medium text-gray-700">Featured Only</span>
        </label>
      </div>

      {/* Active Filters Display */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-wrap gap-2">
          {filters.vehicle_type && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Type: {vehicleTypes[filters.vehicle_type] || filters.vehicle_type}
              <button onClick={() => handleFilterUpdate('vehicle_type', '')} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Category: {categories[filters.category] || filters.category}
              <button onClick={() => handleFilterUpdate('category', '')} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.condition && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Condition: {filters.condition}
              <button onClick={() => handleFilterUpdate('condition', '')} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.fuel_type && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Fuel: {filters.fuel_type}
              <button onClick={() => handleFilterUpdate('fuel_type', '')} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.transmission && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Transmission: {filters.transmission}
              <button onClick={() => handleFilterUpdate('transmission', '')} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.body_type && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Body: {filters.body_type}
              <button onClick={() => handleFilterUpdate('body_type', '')} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;
