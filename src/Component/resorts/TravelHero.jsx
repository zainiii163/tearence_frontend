import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plane,
  Hotel,
  Car,
  Globe,
  Star,
  TrendingUp,
  Users,
  Award,
  ArrowRight
} from 'lucide-react';

const TravelHero = ({ onSearch }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [searchData, setSearchData] = useState({
    destination: '',
    category: '',
    priceRange: '',
    travelDates: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 380;
      setIsSticky(window.scrollY > heroHeight - 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const stats = [
    { icon: Hotel, label: '-', sublabel: 'Resorts & Hotels' },
    { icon: Car, label: '-', sublabel: 'Transport Services' },
    { icon: Globe, label: '-', sublabel: 'Countries' },
    { icon: Users, label: '-', sublabel: 'Satisfaction' }
  ];

  const categories = [
    { name: 'Loading...', icon: '⏳' }
  ];

  return (
    <>
      {/* Main Hero Section */}
      <div className="relative h-[380px] bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.1%27%3E%3Ccircle cx=%2730%27 cy=%2730%27 r=%272%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-10 text-white/20 text-4xl"
        >
          <Plane />
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-10 right-10 text-white/20 text-4xl"
        >
          <Hotel />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight"
            >
              Discover Resorts, Hotels & Travel Experiences
              <span className="block text-xl md:text-2xl mt-1 text-blue-200">Worldwide</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm text-blue-100 mb-4 max-w-2xl mx-auto"
            >
              Book your stay, plan your journey, or promote your travel business to a global audience.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-xl shadow-2xl p-3 max-w-3xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {/* Destination */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Destination"
                    value={searchData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={searchData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">All Categories</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="transport">Transport</option>
                    <option value="tours">Tours & Experiences</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={searchData.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Any Price</option>
                    <option value="0-50">$0 - $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100-200">$100 - $200</option>
                    <option value="200-500">$200 - $500</option>
                    <option value="500+">$500+</option>
                  </select>
                </div>

                {/* Travel Dates */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={searchData.travelDates}
                    onChange={(e) => handleInputChange('travelDates', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:from-blue-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Travel Services</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.form>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-wrap justify-center gap-6 text-white">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <stat.icon className="w-4 h-4" />
                  <span className="text-lg font-bold">{stat.label}</span>
                </div>
                <div className="text-xs text-blue-200">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Categories */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{category.icon}</div>
                <span className="text-xs text-gray-700 group-hover:text-blue-600 font-medium">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Where do you want to go?"
                    value={searchData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-3">
                  <select
                    value={searchData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="transport">Transport</option>
                    <option value="tours">Tours</option>
                  </select>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TravelHero;
