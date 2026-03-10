import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Globe, Star, ArrowRight } from 'lucide-react';

const PromotedHero = ({ onSearch, onFilterChange }) => {
  const [searchData, setSearchData] = useState({
    keyword: '',
    category: '',
    country: '',
    priceRange: { min: 0, max: 10000 }
  });
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
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
      priceRange: searchData.priceRange
    });
  };

  const categories = [
    'All Categories',
    'Property',
    'Cars & Vehicles',
    'Jobs & Services',
    'Business Opportunities',
    'Electronics',
    'Fashion & Beauty',
    'Travel & Experiences',
    'Events & Tickets',
    'Pets & Animals',
    'Home & Garden',
    'Health & Wellness',
    'Education & Courses'
  ];

  const countries = [
    'All Countries',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
    'Japan',
    'China',
    'India',
    'Brazil',
    'Mexico',
    'South Africa',
    'UAE',
    'Singapore',
    'Malaysia'
  ];

  return (
    <>
      {/* Main Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-blue-400"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Promoted Adverts</span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl text-gray-700">High-Visibility Listings from Around the World</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              These adverts are boosted for maximum exposure. Discover what's trending today.
            </motion.p>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Keyword Search */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Search className="inline h-4 w-4 mr-1" />
                      Keyword
                    </label>
                    <input
                      type="text"
                      value={searchData.keyword}
                      onChange={(e) => setSearchData(prev => ({ ...prev, keyword: e.target.value }))}
                      placeholder="Search promoted adverts..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Filter className="inline h-4 w-4 mr-1" />
                      Category
                    </label>
                    <select
                      value={searchData.category}
                      onChange={(e) => setSearchData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="inline h-4 w-4 mr-1" />
                      Country
                    </label>
                    <select
                      value={searchData.country}
                      onChange={(e) => setSearchData(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {countries.map(country => (
                        <option key={country} value={country === 'All Countries' ? '' : country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={searchData.priceRange.min}
                        onChange={(e) => setSearchData(prev => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, min: e.target.value }
                        }))}
                        placeholder="Min"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <span className="text-gray-500">to</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={searchData.priceRange.max}
                        onChange={(e) => setSearchData(prev => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, max: e.target.value }
                        }))}
                        placeholder="Max"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Search className="h-5 w-5" />
                  <span>Search Promoted Adverts</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">15,234</div>
                <div className="text-sm text-gray-600">Promoted Adverts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">142</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">8.5M</div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">98%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sticky Search Bar (appears on scroll) */}
      {isSticky && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchData.keyword}
                onChange={(e) => setSearchData(prev => ({ ...prev, keyword: e.target.value }))}
                placeholder="Quick search promoted adverts..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <select
                value={searchData.category}
                onChange={(e) => setSearchData(prev => ({ ...prev, category: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                value={searchData.country}
                onChange={(e) => setSearchData(prev => ({ ...prev, country: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {countries.map(country => (
                  <option key={country} value={country === 'All Countries' ? '' : country}>
                    {country}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default PromotedHero;
