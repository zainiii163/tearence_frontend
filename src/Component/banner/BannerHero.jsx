import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Search, Globe, MapPin, ArrowRight, Sparkles, TrendingUp, Lock } from 'lucide-react';

const BannerHero = ({ searchQuery, setSearchQuery, onPostBanner }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const [category, setCategory] = useState('');
  const [country, setCountry] = useState('');
  const { logIn, token } = useSelector((store) => store.auth);
  
  // Check if user is authenticated
  const isAuthenticated = logIn === true || token;

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
  };

  const categories = [
    'All Categories',
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
    'All Countries',
    'USA',
    'UK',
    'UAE',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Italy',
    'Spain',
    'Japan',
    'China',
    'India'
  ];

  return (
    <>
      {/* Main Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full backdrop-blur-sm"
          />
          <motion.div
            animate={{ 
              x: [0, 30, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 4 }}
            className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Showcase Your Brand With
              <span className="block text-yellow-300">High-Impact Banner Adverts</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto"
            >
              Post, promote, and discover banner ads from businesses worldwide.
            </motion.p>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {/* Keyword Search */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Search className="w-4 h-4 inline mr-2" />
                      Keyword
                    </label>
                    <input
                      type="text"
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                      placeholder="Search banners..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country Dropdown */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {countries.map((c) => (
                        <option key={c} value={c === 'All Countries' ? '' : c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search Button */}
                  <div className="md:col-span-1 flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap justify-center gap-8 text-center">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">15,234</span>
                    <span className="text-sm">Active Banners</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold">142</span>
                    <span className="text-sm">Countries</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="font-semibold">8.5M</span>
                    <span className="text-sm">Monthly Views</span>
                  </div>
                </div>
              </form>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Sticky Search Bar (appears on scroll) */}
      {isSticky && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Quick search banner adverts..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {countries.map((c) => (
                  <option key={c} value={c === 'All Countries' ? '' : c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default BannerHero;
