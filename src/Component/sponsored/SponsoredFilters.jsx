import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X, Check } from 'lucide-react';

const SponsoredFilters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedCountry,
  setSelectedCountry,
  selectedTier,
  setSelectedTier,
  searchQuery,
  setSearchQuery,
  onClearFilters
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    tier: false,
    price: false
  });

  const countries = [
    'United Kingdom', 'United States', 'Canada', 'Australia', 'Germany', 
    'France', 'Italy', 'Spain', 'UAE', 'Singapore', 'Japan', 'China'
  ];

  const tiers = [
    { id: 'basic', label: 'Basic', count: 0 },
    { id: 'plus', label: 'Plus', count: 0 },
    { id: 'premium', label: 'Premium', count: 0 }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = selectedCategory || selectedCountry || selectedTier || searchQuery;

  const clearAllFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    }
  };

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
              <label className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={selectedCategory === 'all' || selectedCategory === null}
                    onChange={() => setSelectedCategory(null)}
                    className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">All Categories</span>
                </div>
              </label>
              {categories && categories.map((category) => (
                <label
                  key={category.id || category.category_id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.id || category.category_id}
                      checked={selectedCategory === (category.id || category.category_id)}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">{category.name || category.category_name}</span>
                  </div>
                  {category.sponsored_adverts_count !== undefined && (
                    <span className="text-xs text-gray-500">
                      {category.sponsored_adverts_count}
                    </span>
                  )}
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="border-b border-gray-200 pb-4">
        <h4 className="font-medium text-gray-900 mb-3">Search</h4>
        <input
          type="text"
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search adverts..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
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
              className="mt-3 space-y-2"
            >
              <select
                value={selectedCountry || ''}
                onChange={(e) => setSelectedCountry(e.target.value || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sponsorship Tier */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('tier')}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <h4 className="font-medium text-gray-900">Sponsorship Tier</h4>
          {expandedSections.tier ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.tier && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-2"
            >
              {tiers.map((tier) => (
                <label
                  key={tier.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="tier"
                      value={tier.id}
                      checked={selectedTier === tier.id}
                      onChange={(e) => setSelectedTier(e.target.value)}
                      className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">{tier.label}</span>
                  </div>
                </label>
              ))}
              <button
                onClick={() => setSelectedTier(null)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear tier filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SponsoredFilters;
