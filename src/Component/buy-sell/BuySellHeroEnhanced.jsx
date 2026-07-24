import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiFilter, FiTrendingUp, FiClock, FiDollarSign } from 'react-icons/fi';
import { buysellAPI } from '../../api/buysell';

const BuySellHeroEnhanced = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => {
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('buysell_recent_searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }

    // Load trending searches
    const loadTrendingSearches = async () => {
      try {
        const trending = await buysellAPI.getTrendingItems(5);
        setTrendingSearches(trending.map(item => item.title));
      } catch (error) {
        console.error('Error loading trending searches:', error);
        // Fallback trending searches
        setTrendingSearches([
          'iPhone 14 Pro',
          'MacBook Pro',
          'Nike Air Max',
          'Sony PlayStation 5',
          'Samsung Galaxy S24'
        ]);
      }
    };

    loadTrendingSearches();
  }, []);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 2) {
      try {
        const suggestions = await buysellAPI.getSearchSuggestions(value);
        setSearchSuggestions(suggestions.slice(0, 5));
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSearchSuggestions([]);
      }
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    
    // Save to recent searches
    if (searchTerm.trim().length > 0) {
      const newRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 9);
      setRecentSearches(newRecent);
      localStorage.setItem('buysell_recent_searches', JSON.stringify(newRecent));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    // Trigger search
    setTimeout(() => {
      const event = new Event('submit', { bubbles: true });
      document.querySelector('#buysell-search-form')?.dispatchEvent(event);
    }, 100);
  };

  const quickCategories = [
    { id: 'electronics', name: 'Electronics', icon: '📱', count: '12.5K' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗', count: '8.7K' },
    { id: 'property', name: 'Property', icon: '🏠', count: '5.2K' },
    { id: 'fashion', name: 'Fashion', icon: '👗', count: '9.8K' },
    { id: 'home', name: 'Home & Garden', icon: '🏡', count: '6.1K' }
  ];

  return (
    <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-64 h-64 bg-white/5 rounded-full blur-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 page-container py-8 sm:py-10">
        <div className="text-center">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
          >
            Buy & Sell Anything
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto"
          >
            Join millions of buyers and sellers in the world's largest marketplace
          </motion.p>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <form id="buysell-search-form" onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <div className="flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search for anything..."
                    className="w-full pl-12 pr-32 py-4 text-lg text-gray-900 placeholder-gray-500 focus:outline-none bg-transparent"
                  />
                  
                  {/* Quick Filters */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                      title="All Categories"
                    >
                      <FiFilter className="h-5 w-5" />
                    </button>
                    
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                      title="Price Range"
                    >
                      <FiDollarSign className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Search Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 w-full md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
                    >
                      <div className="p-4">
                        <div className="text-sm text-gray-500 mb-3">Suggestions</div>
                        <div className="space-y-2">
                            {searchSuggestions.map((suggestion, index) => (
                              <button
                                key={`suggestion-${index}`}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                              >
                                <FiSearch className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-700">{suggestion}</span>
                              </button>
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>

          {/* Quick Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto"
          >
            {quickCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all border border-white/20 hover:border-white/40 ${
                  selectedCategory === category.id ? 'ring-2 ring-white' : ''
                }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-white">{category.name}</div>
                <div className="text-xs text-green-200">{category.count} items</div>
              </motion.button>
            ))}
          </motion.div>

          {/* Trending Searches */}
          {trendingSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12"
            >
              <div className="flex items-center gap-2 mb-4">
                <FiTrendingUp className="h-5 w-5 text-green-200" />
                <span className="text-green-200 font-medium">Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {trendingSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white hover:bg-white/20 transition-all border border border-white/20 hover:border-white/40"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <FiClock className="h-5 w-5 text-green-200" />
                <span className="text-green-200 font-medium">Recent Searches</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-green-100 hover:bg-white/10 transition-all"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 text-green-100"
          >
            <div className="text-center">
              <div className="text-3xl font-bold">2.5M+</div>
              <div className="text-sm">Active Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">850K+</div>
              <div className="text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">142</div>
              <div className="text-sm">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-sm">Success Rate</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BuySellHeroEnhanced;
