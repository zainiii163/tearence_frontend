import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ChevronUp, X, Globe, MapPin, DollarSign, Tag, Shield, TrendingUp, Clock, Eye, Heart, ArrowUpDown } from 'lucide-react';

const PromotedFilters = ({ filters, onFilterChange, sortBy, onSortChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const categories = [
    'Property', 'Cars & Vehicles', 'Jobs & Services', 'Business Opportunities',
    'Electronics', 'Fashion & Beauty', 'Travel & Experiences', 'Events & Tickets',
    'Pets & Animals', 'Home & Garden', 'Health & Wellness', 'Education & Courses'
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Spain', 'Italy', 'Netherlands', 'Switzerland', 'UAE', 'Singapore',
    'Japan', 'China', 'India', 'Brazil', 'Mexico', 'South Korea'
  ];

  const cities = [
    'New York', 'London', 'Paris', 'Tokyo', 'Dubai', 'Singapore', 'Hong Kong',
    'Los Angeles', 'San Francisco', 'Toronto', 'Sydney', 'Berlin', 'Amsterdam',
    'Barcelona', 'Rome', 'Madrid', 'Mumbai', 'Shanghai', 'Seoul', 'Mexico City'
  ];

  const advertTypes = [
    { value: 'buy', label: 'Buy', icon: '🛒' },
    { value: 'sell', label: 'Sell', icon: '💰' },
    { value: 'rent', label: 'Rent', icon: '🏠' },
    { value: 'offer', label: 'Offer', icon: '🎁' },
    { value: 'wanted', label: 'Wanted', icon: '🔍' }
  ];

  const sortOptions = [
    { value: 'most_recent', label: 'Most Recent', icon: Clock },
    { value: 'most_viewed', label: 'Most Viewed', icon: Eye },
    { value: 'trending', label: 'Trending', icon: TrendingUp },
    { value: 'price_low_high', label: 'Price Low → High', icon: ArrowUpDown },
    { value: 'price_high_low', label: 'Price High → Low', icon: ArrowUpDown }
  ];

  const handleCategoryChange = (category) => {
    onFilterChange({ category: filters.category === category ? '' : category });
  };

  const handleCountryChange = (country) => {
    onFilterChange({ country: filters.country === country ? '' : country });
  };

  const handleCityChange = (city) => {
    onFilterChange({ city: filters.city === city ? '' : city });
  };

  const handleAdvertTypeChange = (type) => {
    onFilterChange({ advertType: filters.advertType === type ? '' : type });
  };

  const handlePriceRangeChange = (min, max) => {
    onFilterChange({ 
      priceRange: { 
        min: min || 0, 
        max: max || 10000 
      } 
    });
  };

  const handleVerifiedToggle = () => {
    onFilterChange({ verifiedOnly: !filters.verifiedOnly });
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: '',
      country: '',
      city: '',
      priceRange: { min: 0, max: 10000 },
      advertType: '',
      verifiedOnly: false
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.country) count++;
    if (filters.city) count++;
    if (filters.advertType) count++;
    if (filters.verifiedOnly) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 10000) count++;
    return count;
  };

  const FilterSection = ({ title, icon: Icon, children, isActive, onClick }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {isActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-semibold">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-1"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div className={`${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Category Filter */}
        <FilterSection
          title="Category"
          icon={Tag}
          isActive={activeSection === 'category'}
          onClick={() => setActiveSection(activeSection === 'category' ? null : 'category')}
        >
          <div className="grid grid-cols-2 gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.category === category
                    ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Location Filters */}
        <FilterSection
          title="Location"
          icon={MapPin}
          isActive={activeSection === 'location'}
          onClick={() => setActiveSection(activeSection === 'location' ? null : 'location')}
        >
          <div className="space-y-3">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={filters.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
              <select
                value={filters.city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection
          title="Price Range"
          icon={DollarSign}
          isActive={activeSection === 'price'}
          onClick={() => setActiveSection(activeSection === 'price' ? null : 'price')}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceRangeChange(e.target.value, filters.priceRange.max)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max</label>
                <input
                  type="number"
                  placeholder="10000"
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange(filters.priceRange.min, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Advert Type */}
        <FilterSection
          title="Advert Type"
          icon={Globe}
          isActive={activeSection === 'type'}
          onClick={() => setActiveSection(activeSection === 'type' ? null : 'type')}
        >
          <div className="grid grid-cols-2 gap-2">
            {advertTypes.map(type => (
              <button
                key={type.value}
                onClick={() => handleAdvertTypeChange(type.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.advertType === type.value
                    ? 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <span>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Additional Options */}
        <FilterSection
          title="Options"
          icon={Shield}
          isActive={activeSection === 'options'}
          onClick={() => setActiveSection(activeSection === 'options' ? null : 'options')}
        >
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={handleVerifiedToggle}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm font-medium text-gray-700">Verified Sellers Only</span>
            </label>
          </div>
        </FilterSection>

        {/* Sort By */}
        <FilterSection
          title="Sort By"
          icon={ArrowUpDown}
          isActive={activeSection === 'sort'}
          onClick={() => setActiveSection(activeSection === 'sort' ? null : 'sort')}
        >
          <div className="space-y-2">
            {sortOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === option.value
                      ? 'bg-amber-100 text-amber-800'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default PromotedFilters;
