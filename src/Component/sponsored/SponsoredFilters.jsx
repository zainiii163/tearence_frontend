import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X, Check } from 'lucide-react';

const SponsoredFilters = ({
  selectedCategory,
  setSelectedCategory,
  selectedCountry,
  setSelectedCountry,
  priceRange,
  setPriceRange
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    price: false,
    type: false,
    seller: false
  });

  const categories = [
    'Property', 'Cars & Vehicles', 'Jobs & Services', 'Business Opportunities',
    'Electronics', 'Fashion & Beauty', 'Travel & Experiences', 'Events & Tickets',
    'Pets & Animals', 'Home & Garden', 'Health & Wellness', 'Education & Courses'
  ];

  const countries = [
    'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Italy', 'Spain',
    'UAE', 'Singapore', 'Japan', 'China', 'India', 'Brazil', 'Mexico'
  ];

  const cities = {
    'USA': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
    'UK': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Glasgow'],
    'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes'],
    'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa'],
    'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao', 'Malaga'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah'],
    'Singapore': ['Singapore City', 'Orchard', 'Marina Bay', 'Sentosa', 'Chinatown', 'Little India'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Sapporo'],
    'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chongqing', 'Tianjin'],
    'India': ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad'],
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte'],
    'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León']
  };

  const advertTypes = [
    { id: 'buy', label: 'Buy', count: 4567 },
    { id: 'sell', label: 'Sell', count: 3234 },
    { id: 'rent', label: 'Rent', count: 1876 },
    { id: 'offer', label: 'Offer', count: 987 },
    { id: 'wanted', label: 'Wanted', count: 654 }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedCountry(null);
    setPriceRange([0, 1000000]);
  };

  const hasActiveFilters = selectedCategory || selectedCountry || (priceRange[0] > 0 || priceRange[1] < 1000000);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <h4 className="font-medium text-gray-900">Categories</h4>
          {expandedSections.categories ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.categories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-2"
            >
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">{category}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {Math.floor(Math.random() * 3000) + 100}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <h4 className="font-medium text-gray-900">Location</h4>
          {expandedSections.location ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.location && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-4"
            >
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={selectedCountry || ''}
                  onChange={(e) => setSelectedCountry(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Cities */}
              {selectedCountry && cities[selectedCountry] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {cities[selectedCountry].map((city) => (
                      <label key={city} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">{city}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <h4 className="font-medium text-gray-900">Price Range</h4>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Min: ${priceRange[0].toLocaleString()}</span>
                <span className="text-sm text-gray-600">Max: ${priceRange[1].toLocaleString()}</span>
              </div>
              
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Quick Price Ranges */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Under $100', min: 0, max: 100 },
                  { label: '$100 - $1K', min: 100, max: 1000 },
                  { label: '$1K - $10K', min: 1000, max: 10000 },
                  { label: '$10K+', min: 10000, max: 1000000 }
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => setPriceRange([range.min, range.max])}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advert Type */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('type')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <h4 className="font-medium text-gray-900">Advert Type</h4>
          {expandedSections.type ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.type && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-2"
            >
              {advertTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">{type.label}</span>
                  </div>
                  <span className="text-xs text-gray-500">{type.count}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Seller Type */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('seller')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <h4 className="font-medium text-gray-900">Seller Type</h4>
          {expandedSections.seller ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.seller && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-2"
            >
              <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">Verified Sellers Only</span>
              </label>
              <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">Premium Sellers</span>
              </label>
              <label className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">Local Sellers</span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {selectedCategory}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-2 hover:text-yellow-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {selectedCountry && (
              <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {selectedCountry}
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="ml-2 hover:text-yellow-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
              <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                <button
                  onClick={() => setPriceRange([0, 1000000])}
                  className="ml-2 hover:text-yellow-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsoredFilters;
