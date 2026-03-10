import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp, Search, MapPin, DollarSign, Calendar, Star, Check } from 'lucide-react';

const VehicleFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    features: false,
    location: false,
    price: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterUpdate = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const makes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Nissan', 'Hyundai', 'Kia'];
  const models = ['Civic', 'Corolla', 'Focus', '3 Series', 'C-Class', 'A4', 'Golf', 'Altima', 'Elantra', 'Forte'];
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'Hydrogen'];
  const transmissions = ['Manual', 'Automatic', 'Semi-Automatic', 'CVT'];
  const bodyTypes = ['Sedan', 'Hatchback', 'SUV', 'Coupe', 'Convertible', 'Wagon', 'Pickup', 'Van'];
  const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'China'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
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
                {/* Make */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                  <select
                    value={filters.make}
                    onChange={(e) => handleFilterUpdate('make', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Makes</option>
                    {makes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <select
                    value={filters.model}
                    onChange={(e) => handleFilterUpdate('model', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Models</option>
                    {models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={filters.year}
                    onChange={(e) => handleFilterUpdate('year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Mileage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Mileage</label>
                  <select
                    value={filters.mileage}
                    onChange={(e) => handleFilterUpdate('mileage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Any Mileage</option>
                    <option value="10000">Under 10,000 miles</option>
                    <option value="25000">Under 25,000 miles</option>
                    <option value="50000">Under 50,000 miles</option>
                    <option value="75000">Under 75,000 miles</option>
                    <option value="100000">Under 100,000 miles</option>
                    <option value="150000">Under 150,000 miles</option>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => handleFilterUpdate('fuelType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Fuel Types</option>
                    {fuelTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => handleFilterUpdate('transmission', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Transmissions</option>
                    {transmissions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                  <select
                    value={filters.bodyType}
                    onChange={(e) => handleFilterUpdate('bodyType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Body Types</option>
                    {bodyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
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
                  <select
                    value={filters.country}
                    onChange={(e) => handleFilterUpdate('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="Enter city name"
                    value={filters.city}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.priceRange[0]}
                      onChange={(e) => handleFilterUpdate('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterUpdate('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Verified Sellers */}
      <div className="mb-6">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verifiedSellers}
            onChange={(e) => handleFilterUpdate('verifiedSellers', e.target.checked)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <span className="text-sm font-medium text-gray-700">Verified Sellers Only</span>
          <Star className="w-4 h-4 text-yellow-500" />
        </label>
      </div>

      {/* Active Filters Display */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-wrap gap-2">
          {filters.make && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Make: {filters.make}
              <button onClick={() => handleFilterUpdate('make', '')} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.model && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Model: {filters.model}
              <button onClick={() => handleFilterUpdate('model', '')} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.verifiedSellers && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Verified
              <button onClick={() => handleFilterUpdate('verifiedSellers', false)} className="ml-2">
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
