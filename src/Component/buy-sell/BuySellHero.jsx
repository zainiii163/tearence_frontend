import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiDollarSign, FiFilter, FiTrendingUp } from 'react-icons/fi';
import { buysellAPI } from '../../api/buysell';

const BuySellHero = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) => {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [location, setLocation] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Get featured categories from API
    const fetchCategories = async () => {
      try {
        const categoriesData = await buysellAPI.getCategories();
        setFeaturedCategories(categoriesData.slice(0, 6));
      } catch (error) {
        console.error('Error fetching categories:', error);
        setFeaturedCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Handle search suggestions
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length > 2) {
      try {
        const suggestions = await buysellAPI.getSearchSuggestions(value);
        setSearchSuggestions(suggestions.slice(0, 5)); // Show max 5 suggestions
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSearchSuggestions([]);
      }
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search functionality handled by parent component
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-white rounded-full blur-xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Buy, Sell, Swap & Give Away —
            <span className="block text-yellow-300">Globally</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Discover new and used items across categories or list your item instantly
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto mb-12"
          >
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-2">
              <div className="flex flex-col lg:flex-row gap-2">
                {/* Keyword Search */}
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                  />
                </div>

                {/* Category Select */}
                <div className="relative lg:w-64">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-4 pr-10 py-4 text-gray-900 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer text-lg"
                  >
                    <option value="all">All Categories</option>
                    {featuredCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <FiFilter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                </div>

                {/* Price Range */}
                <div className="flex gap-2 lg:w-64">
                  <div className="relative flex-1">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full pl-10 pr-3 py-4 text-gray-900 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                    />
                  </div>
                  <div className="relative flex-1">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full pl-10 pr-3 py-4 text-gray-900 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="relative lg:w-64">
                  <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>

          {/* Featured Categories Carousel */}
          <motion.div
            variants={itemVariants}
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FiTrendingUp className="h-6 w-6 text-yellow-300" />
                Featured Categories
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredCategories.map((category, index) => (
                <motion.button
                  key={category.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 group`}
                >
                  <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white text-xl">
                      {category.icon}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-green-100 text-xs">{(category.count || category.advert_count || 0).toLocaleString()} items</p>
                  <div className="mt-2 text-yellow-300 text-xs font-medium">View All →</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">2.5M+</div>
              <div className="text-green-100 text-sm md:text-base">Active Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">850K+</div>
              <div className="text-green-100 text-sm md:text-base">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">142</div>
              <div className="text-green-100 text-sm md:text-base">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">98%</div>
              <div className="text-green-100 text-sm md:text-base">Success Rate</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BuySellHero;
