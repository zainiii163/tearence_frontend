import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal,
  BedDouble,
  Bath,
  Car,
  Wifi,
  Shield,
  TreePine,
  Waves,
  Dumbbell,
  Coffee,
  Home,
  Building,
  Factory,
  Trees,
  Hotel,
  Store,
  Briefcase,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Heart
} from 'lucide-react';
import { usePropertyData } from '../../hooks/usePropertyData';

const PropertyFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  showMobile, 
  setShowMobile 
}) => {
  const { propertyTypes, loading } = usePropertyData();
  
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    features: false,
    advanced: false,
    location: false
  });

  const ICON_BY_TYPE = {
    residential: Home,
    commercial: Building,
    industrial: Factory,
    land: Trees,
    agricultural: Trees,
    luxury: Star,
    short_term_rental: Calendar,
    investment: TrendingUp,
    new_development: Building,
  };

  const displayPropertyTypes = propertyTypes && propertyTypes.length > 0 
    ? propertyTypes.map(pt => ({ 
        id: pt.id, 
        label: pt.name || pt.label, 
        icon: ICON_BY_TYPE[pt.id] || Home 
      }))
    : [];

  const amenities = [
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'garden', label: 'Garden', icon: TreePine },
    { id: 'pool', label: 'Swimming Pool', icon: Waves },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'furnished', label: 'Furnished', icon: Home },
    { id: 'aircon', label: 'Air Conditioning', icon: Coffee },
    { id: 'elevator', label: 'Elevator', icon: Building },
    { id: 'pet-friendly', label: 'Pet Friendly', icon: Heart }
  ];

  const regions = [
    { id: 'europe', label: 'Europe', flag: '🇪🇺' },
    { id: 'asia', label: 'Asia', flag: '🌏' },
    { id: 'north-america', label: 'North America', flag: '🌎' },
    { id: 'south-america', label: 'South America', flag: '🌎' },
    { id: 'africa', label: 'Africa', flag: '🌍' },
    { id: 'middle-east', label: 'Middle East', flag: '🌍' },
    { id: 'oceania', label: 'Oceania', flag: '🌏' }
  ];

  const purposes = [
    { id: 'buy', label: 'Buy', color: 'blue' },
    { id: 'rent', label: 'Rent', color: 'green' },
    { id: 'lease', label: 'Lease', color: 'purple' },
    { id: 'invest', label: 'Invest', color: 'orange' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePropertyTypeToggle = (typeId) => {
    const currentTypes = filters.propertyType || [];
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter(id => id !== typeId)
      : [...currentTypes, typeId];
    onFilterChange({ propertyType: newTypes });
  };

  const handleAmenityToggle = (amenityId) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    onFilterChange({ amenities: newAmenities });
  };

  const handlePriceRangeChange = (field, value) => {
    onFilterChange({
      priceRange: {
        ...(filters.priceRange || {}),
        [field]: parseInt(value) || 0
      }
    });
  };

  const hasActiveFilters = (filters.propertyType?.length || 0) > 0 || 
    filters.bedrooms || 
    filters.bathrooms || 
    (filters.amenities?.length || 0) > 0 || 
    filters.region || 
    filters.purpose !== 'buy' ||
    (filters.priceRange?.min || 0) > 0 || 
    (filters.priceRange?.max || 10000000) < 10000000;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {(filters.propertyType?.length || 0) + (filters.amenities?.length || 0) + (filters.bedrooms ? 1 : 0) + (filters.bathrooms ? 1 : 0)} filters active
          </span>
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Basic Information */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection('basic')}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
          {expandedSections.basic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {expandedSections.basic && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <div className="grid grid-cols-2 gap-2">
                  {purposes.map((purpose) => (
                    <button
                      key={purpose.id}
                      onClick={() => onFilterChange({ purpose: purpose.id })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.purpose === purpose.id
                          ? `bg-${purpose.color}-500 text-white`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {purpose.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BedDouble className="w-4 h-4 inline mr-1" />
                  Bedrooms
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => onFilterChange({ bedrooms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bath className="w-4 h-4 inline mr-1" />
                  Bathrooms
                </label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => onFilterChange({ bathrooms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange?.min || ''}
                    onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange?.max || ''}
                    onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Property Type */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection('features')}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Property Type</h3>
          {expandedSections.features ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {expandedSections.features && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              {displayPropertyTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(filters.propertyType || []).includes(type.id)}
                    onChange={() => handlePropertyTypeToggle(type.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <type.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Amenities */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection('advanced')}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
          {expandedSections.advanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {expandedSections.advanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-2"
            >
              {amenities.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(filters.amenities || []).includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <amenity.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-700">{amenity.label}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Region */}
      <div>
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">Region</h3>
          {expandedSections.location ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {expandedSections.location && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              {regions.map((region) => (
                <label
                  key={region.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="region"
                    checked={filters.region === region.id}
                    onChange={() => onFilterChange({ region: region.id })}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-lg">{region.flag}</span>
                  <span className="text-sm text-gray-700">{region.label}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobile(!showMobile)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {(filters.propertyType?.length || 0) + (filters.amenities?.length || 0) + (filters.bedrooms ? 1 : 0) + (filters.bathrooms ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setShowMobile(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowMobile(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <FilterContent />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <FilterContent />
        </div>
      </div>
    </>
  );
};

export default PropertyFilters;
