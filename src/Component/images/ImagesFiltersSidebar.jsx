import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import imagesApi from '../../services/imagesAPI';

const ImagesFiltersSidebar = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState({});
  const [licenseTypes, setLicenseTypes] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    orientation: true,
    color: true,
    price: true,
    license: true,
    rating: true,
  });

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [categoriesRes, licenseTypesRes] = await Promise.all([
        imagesApi.getCategories(),
        imagesApi.getLicenseTypes(),
      ]);
      setCategories(categoriesRes.data || {});
      setLicenseTypes(licenseTypesRes.data || {});
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange(filterType, newValues);
  };

  const handleRadioChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const clearFilter = (filterType) => {
    onFilterChange(filterType, null);
  };

  const clearAllFilters = () => {
    Object.keys(filters).forEach(key => {
      onFilterChange(key, null);
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== null && v !== undefined && v !== '');

  return (
    <div className="w-64 bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder="Search images..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">Category</span>
          {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.category && (
          <div className="mt-2 space-y-2">
            {Object.entries(categories).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.image_category === key}
                  onChange={() => handleRadioChange('image_category', filters.image_category === key ? null : key)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{value.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Orientation */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('orientation')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">Orientation</span>
          {expandedSections.orientation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.orientation && (
          <div className="mt-2 space-y-2">
            {['landscape', 'portrait', 'square'].map(orientation => (
              <label key={orientation} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="orientation"
                  checked={filters.orientation === orientation}
                  onChange={() => handleRadioChange('orientation', orientation)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">{orientation}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color Type */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">Color</span>
          {expandedSections.color ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.color && (
          <div className="mt-2 space-y-2">
            {['color', 'black_white'].map(colorType => (
              <label key={colorType} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="colorType"
                  checked={filters.color_type === colorType}
                  onChange={() => handleRadioChange('color_type', colorType)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{colorType === 'black_white' ? 'Black & White' : 'Color'}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">Price Range</span>
          {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.price && (
          <div className="mt-2 space-y-2">
            <div>
              <label className="text-xs text-gray-600">Min Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.min_price || ''}
                onChange={(e) => onFilterChange('min_price', e.target.value || null)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Max Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.max_price || ''}
                onChange={(e) => onFilterChange('max_price', e.target.value || null)}
                placeholder="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* License Type */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('license')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">License Type</span>
          {expandedSections.license ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.license && (
          <div className="mt-2 space-y-2">
            {Object.entries(licenseTypes).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="licenseType"
                  checked={filters.license_type === key}
                  onChange={() => handleRadioChange('license_type', key)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{value.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Verified Only */}
      <div className="border-t pt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verified_creator || false}
            onChange={(e) => onFilterChange('verified_creator', e.target.checked ? true : null)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Verified Creators Only</span>
        </label>
      </div>

      {/* Minimum Rating */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-gray-900">Minimum Rating</span>
          {expandedSections.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.rating && (
          <div className="mt-2 space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="minRating"
                  checked={filters.min_rating === rating}
                  onChange={() => handleRadioChange('min_rating', rating)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{rating}★ & up</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesFiltersSidebar;
