import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, MapPin, DollarSign, Star, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

const PromotedHero = ({ onSearch, onFilterChange }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [searchData, setSearchData] = useState({
    keyword: '',
    category: '',
    country: '',
    priceMin: '',
    priceMax: ''
  });

  const categories = [
    'Property', 'Cars & Vehicles', 'Jobs & Services', 'Business Opportunities',
    'Electronics', 'Fashion & Beauty', 'Travel & Experiences', 'Events & Tickets',
    'Pets & Animals', 'Home & Garden', 'Health & Wellness', 'Education & Courses'
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Spain', 'Italy', 'Netherlands', 'Switzerland', 'UAE', 'Singapore'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData.keyword);
    onFilterChange({
      category: searchData.category,
      country: searchData.country,
      priceRange: {
        min: searchData.priceMin || 0,
        max: searchData.priceMax || 10000
      }
    });
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative bg-gradient-to-br from-amber-50 via-white to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.4%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Premium Promoted Listings
            <TrendingUp className="w-4 h-4" />
          </motion.div>

          {/* Headlines */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-amber-800 to-gray-900 bg-clip-text text-transparent mb-6"
          >
            Explore Promoted Adverts
            <br />
            <span className="text-3xl lg:text-4xl text-gray-600 font-normal">
              High-Visibility Listings from Around the World
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto mb-12"
          >
            These adverts are boosted for maximum exposure. Discover what's trending today.
          </motion.p>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Keyword Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Keyword..."
                    value={searchData.keyword}
                    onChange={(e) => handleInputChange('keyword', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Category */}
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={searchData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Country */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={searchData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Price Range..."
                    value={searchData.priceMin && searchData.priceMax ? `${searchData.priceMin}-${searchData.priceMax}` : ''}
                    onChange={(e) => {
                      const range = e.target.value.split('-');
                      handleInputChange('priceMin', range[0] || '');
                      handleInputChange('priceMax', range[1] || '');
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search Promoted Ads
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = '/promoted/post'}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Star className="w-5 h-5" />
                  Post Promoted Advert
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Keyword..."
                    value={searchData.keyword}
                    onChange={(e) => handleInputChange('keyword', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <select
                    value={searchData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select
                    value={searchData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Price..."
                    value={searchData.priceMin && searchData.priceMax ? `${searchData.priceMin}-${searchData.priceMax}` : ''}
                    onChange={(e) => {
                      const range = e.target.value.split('-');
                      handleInputChange('priceMin', range[0] || '');
                      handleInputChange('priceMax', range[1] || '');
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.href = '/promoted/post'}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    Post Ad
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromotedHero;
