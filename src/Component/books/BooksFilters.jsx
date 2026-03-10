import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Search,
  DollarSign,
  Globe,
  BookOpen,
  Star,
  Shield,
  Hash
} from 'lucide-react';

const BooksFilters = ({ 
  filters, 
  onFiltersChange, 
  onSearch,
  totalCount,
  loading = false 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    pricing: true,
    features: false,
    location: false
  });
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const genres = [
    'Action & Adventure', 'Biography', 'Business', 'Children\'s', 'Comics', 'Cooking',
    'Fantasy', 'Fiction', 'Health & Fitness', 'History', 'Horror', 'Mystery',
    'Non-Fiction', 'Poetry', 'Romance', 'Science Fiction', 'Self-Help', 'Thriller',
    'Travel', 'Young Adult', 'Academic', 'Religion', 'Science', 'Art & Design'
  ];

  const formats = [
    { id: 'paperback', name: 'Paperback' },
    { id: 'hardcover', name: 'Hardcover' },
    { id: 'ebook', name: 'E-book' },
    { id: 'audiobook', name: 'Audiobook' },
    { id: 'pdf', name: 'PDF' }
  ];

  const bookTypes = [
    { id: 'fiction', name: 'Fiction' },
    { id: 'non-fiction', name: 'Non-Fiction' },
    { id: 'children', name: 'Children\'s Books' },
    { id: 'academic', name: 'Academic' },
    { id: 'comics', name: 'Comics & Graphic Novels' },
    { id: 'poetry', name: 'Poetry' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
    'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
    'Japan', 'China', 'India', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'Peru',
    'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Morocco', 'Ghana'
  ];

  const sortOptions = [
    { value: 'created_at', label: 'Most Recent', icon: '🕐' },
    { value: 'title', label: 'Title A-Z', icon: '🔤' },
    { value: 'price', label: 'Price: Low to High', icon: '💰' },
    { value: 'price_desc', label: 'Price: High to Low', icon: '💎' },
    { value: 'views_count', label: 'Most Viewed', icon: '👁️' },
    { value: 'saves_count', label: 'Most Saved', icon: '❤️' },
    { value: 'rating', label: 'Highest Rated', icon: '⭐' }
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMultiSelect = (key, value) => {
    onFiltersChange(prev => {
      const currentValues = prev[key] || [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [key]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [key]: [...currentValues, value]
        };
      }
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setSearchTerm('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.keys(filters).forEach(key => {
      if (key === 'search') return;
      const value = filters[key];
      if (Array.isArray(value)) {
        count += value.length;
      } else if (value && value !== '') {
        count += 1;
      }
    });
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search books by title, author, or description..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-4 space-y-4">
        {/* Basic Filters */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('basic')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Basic Filters</span>
            </div>
            {expandedSections.basic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {expandedSections.basic && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4">
                  {/* Book Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Book Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {bookTypes.map(type => (
                        <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.book_types?.includes(type.id) || false}
                            onChange={() => handleMultiSelect('book_types', type.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{type.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Genres */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {genres.map(genre => (
                        <label key={genre} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.genres?.includes(genre) || false}
                            onChange={() => handleMultiSelect('genres', genre)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{genre}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {formats.map(format => (
                        <label key={format.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.formats?.includes(format.id) || false}
                            onChange={() => handleMultiSelect('formats', format.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{format.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pricing Filters */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('pricing')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Pricing</span>
            </div>
            {expandedSections.pricing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {expandedSections.pricing && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={filters.min_price || ''}
                          onChange={(e) => handleFilterChange('min_price', e.target.value)}
                          placeholder="0"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          value={filters.max_price || ''}
                          onChange={(e) => handleFilterChange('max_price', e.target.value)}
                          placeholder="1000"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={filters.currency || 'USD'}
                      onChange={(e) => handleFilterChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features Filters */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('features')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Features</span>
            </div>
            {expandedSections.features ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {expandedSections.features && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.verified_only || false}
                        onChange={(e) => handleFilterChange('verified_only', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">Verified Authors Only</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.promoted_only || false}
                        onChange={(e) => handleFilterChange('promoted_only', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-700">Promoted Books Only</span>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <div className="grid grid-cols-2 gap-2">
                      {languages.map(lang => (
                        <label key={lang.code} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.languages?.includes(lang.code) || false}
                            onChange={() => handleMultiSelect('languages', lang.code)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{lang.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Location Filters */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('location')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Location</span>
            </div>
            {expandedSections.location ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <AnimatePresence>
            {expandedSections.location && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {countries.map(country => (
                        <label key={country} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.countries?.includes(country) || false}
                            onChange={() => handleMultiSelect('countries', country)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{country}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Options */}
        <div className="border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={filters.sort_by || 'created_at'}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {totalCount !== undefined && (
              <span>{totalCount.toLocaleString()} books found</span>
            )}
            {activeFiltersCount > 0 && (
              <span className="ml-2 text-blue-600 font-medium">
                ({activeFiltersCount} filters active)
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              <Hash className="w-3 h-3" />
              {showAdvanced ? 'Simple' : 'Advanced'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (key === 'search' || !value) return null;
              
              if (Array.isArray(value)) {
                return value.map(item => (
                  <span
                    key={`${key}-${item}`}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {item}
                    <button
                      onClick={() => handleMultiSelect(key, item)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ));
              } else {
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {value}
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksFilters;
