import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiDollarSign, FiMapPin, FiTag, FiChevronDown, FiCheck } from 'react-icons/fi';

const BuySellFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  showFilters, 
  setShowFilters, 
  activeFiltersCount,
  selectedCategory 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    condition: true,
    location: false,
    features: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const conditions = [
    { value: 'all', label: 'All Conditions' },
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const priceRanges = [
    { value: '0-50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-250', label: '$100 - $250' },
    { value: '250-500', label: '$250 - $500' },
    { value: '500-1000', label: '$500 - $1,000' },
    { value: '1000-2500', label: '$1,000 - $2,500' },
    { value: '2500-5000', label: '$2,500 - $5,000' },
    { value: '5000+', label: 'Over $5,000' }
  ];

  const itemTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'for_sale', label: 'For Sale' },
    { value: 'for_swap', label: 'For Swap' },
    { value: 'give_away', label: 'Give Away' }
  ];

  const FilterSection = ({ title, icon, children, sectionKey, isExpanded }) => (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? 'auto' : 'auto' }}
      className="border-b border-gray-200 last:border-b-0"
    >
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-green-600">
            {icon}
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className="h-4 w-4 text-gray-500" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FiFilter className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {/* Filter Content */}
      <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
        {/* Price Range */}
        <FilterSection
          title="Price Range"
          icon={<FiDollarSign className="h-5 w-5" />}
          sectionKey="price"
          isExpanded={expandedSections.price}
        >
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label
                key={range.value}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="priceRange"
                  value={range.value}
                  checked={filters.priceRange === range.value}
                  onChange={(e) => onFilterChange('priceRange', e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Condition */}
        <FilterSection
          title="Condition"
          icon={<FiTag className="h-5 w-5" />}
          sectionKey="condition"
          isExpanded={expandedSections.condition}
        >
          <div className="space-y-2">
            {conditions.map((condition) => (
              <label
                key={condition.value}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="condition"
                  value={condition.value}
                  checked={filters.condition === condition.value}
                  onChange={(e) => onFilterChange('condition', e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{condition.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Item Type */}
        <FilterSection
          title="Item Type"
          icon={<FiTag className="h-5 w-5" />}
          sectionKey="itemType"
          isExpanded={expandedSections.features}
        >
          <div className="space-y-2">
            {itemTypes.map((type) => (
              <label
                key={type.value}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="itemType"
                  value={type.value}
                  checked={filters.itemType === type.value}
                  onChange={(e) => onFilterChange('itemType', e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection
          title="Location"
          icon={<FiMapPin className="h-5 w-5" />}
          sectionKey="location"
          isExpanded={expandedSections.location}
        >
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter city or postal code"
              value={filters.location || ''}
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </FilterSection>

        {/* Clear Filters Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClearFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <FiX className="h-4 w-4" />
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuySellFilters;
