import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Check,
  Globe,
  MapPin,
  Ruler,
  Palette,
  Shield,
  ArrowUpDown,
  Clock,
  Eye,
  TrendingUp,
  Star
} from 'lucide-react';

const BannerFilters = ({ 
  selectedCategory, 
  setSelectedCategory, 
  selectedCountry, 
  setSelectedCountry, 
  selectedSize, 
  setSelectedSize, 
  selectedBadge, 
  setSelectedBadge,
  verifiedOnly,
  setVerifiedOnly,
  sortBy,
  setSortBy
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    location: true,
    size: false,
    badge: false,
    other: false
  });

  const categories = [
    'Real Estate',
    'Vehicles', 
    'Travel & Resorts',
    'Jobs & Recruitment',
    'Books & Authors',
    'Services',
    'Events',
    'Food & Hospitality',
    'Fashion & Beauty',
    'Tech & Electronics',
    'Health & Wellness',
    'Business & Finance'
  ];

  const countries = [
    'USA', 'UK', 'UAE', 'Canada', 'Australia', 'Germany', 
    'France', 'Italy', 'Spain', 'Japan', 'China', 'India'
  ];

  const bannerSizes = [
    '728×90 (Leaderboard)',
    '300×250 (Medium Rectangle)', 
    '160×600 (Skyscraper)',
    '970×250 (Billboard)',
    '468×60 (Classic Banner)',
    '1080×1080 (Square Banner)'
  ];

  const badgeTypes = [
    { value: 'promoted', label: 'Promoted', color: 'bg-blue-500' },
    { value: 'featured', label: 'Featured', color: 'bg-purple-500' },
    { value: 'sponsored', label: 'Sponsored', color: 'bg-yellow-500' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent', icon: Clock },
    { value: 'views', label: 'Most Viewed', icon: Eye },
    { value: 'trending', label: 'Trending', icon: TrendingUp },
    { value: 'rating', label: 'Highest Rated', icon: Star }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedCountry('all');
    setSelectedSize('all');
    setSelectedBadge('all');
    setVerifiedOnly(false);
    setSortBy('recent');
  };

  const hasActiveFilters = selectedCategory !== 'all' || 
                          selectedCountry !== 'all' || 
                          selectedSize !== 'all' || 
                          selectedBadge !== 'all' || 
                          verifiedOnly;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('category')}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900">Category</span>
            {selectedCategory !== 'all' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                {selectedCategory}
              </span>
            )}
          </div>
          {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{category}</span>
                    {selectedCategory === category && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location Filter */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('location')}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-900">Country</span>
            {selectedCountry !== 'all' && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                {selectedCountry}
              </span>
            )}
          </div>
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
              <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                <button
                  onClick={() => setSelectedCountry('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCountry === 'all' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  All Countries
                </button>
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCountry === country 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{country}</span>
                    {selectedCountry === country && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Banner Size Filter */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('size')}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-purple-500" />
            <span className="font-medium text-gray-900">Banner Size</span>
            {selectedSize !== 'all' && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                {selectedSize}
              </span>
            )}
          </div>
          {expandedSections.size ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.size && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedSize === 'all' 
                      ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  All Sizes
                </button>
                {bannerSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedSize === size 
                        ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{size}</span>
                    {selectedSize === size && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Badge Filter */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('badge')}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-gray-900">Badge Type</span>
            {selectedBadge !== 'all' && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                {selectedBadge}
              </span>
            )}
          </div>
          {expandedSections.badge ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.badge && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setSelectedBadge('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedBadge === 'all' 
                      ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  All Badges
                </button>
                {badgeTypes.map((badge) => (
                  <button
                    key={badge.value}
                    onClick={() => setSelectedBadge(badge.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedBadge === badge.value 
                        ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${badge.color}`}></div>
                      <span>{badge.label}</span>
                    </div>
                    {selectedBadge === badge.value && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Other Filters */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection('other')}
          className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            <span className="font-medium text-gray-900">Additional Filters</span>
            {verifiedOnly && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                Verified Only
              </span>
            )}
          </div>
          {expandedSections.other ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expandedSections.other && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Verified Businesses Only</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sort Options */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-900">Sort By</span>
        </div>
        <div className="space-y-2">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                  sortBy === option.value 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{option.label}</span>
                {sortBy === option.value && <Check className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BannerFilters;
