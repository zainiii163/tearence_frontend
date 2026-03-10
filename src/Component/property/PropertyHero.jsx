import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Home, 
  Building, 
  Factory, 
  Trees, 
  Hotel, 
  Store, 
  Globe,
  TrendingUp,
  Eye,
  Users,
  Star,
  ArrowRight,
  DollarSign,
  BedDouble,
  Bath,
  Square
} from 'lucide-react';

const PropertyHero = ({ onSearch, searchParams }) => {
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    category: 'buy',
    priceRange: '',
    keyword: ''
  });
  const [activeTab, setActiveTab] = useState('buy');

  const categories = [
    { id: 'buy', label: 'Buy', icon: Home, color: 'blue' },
    { id: 'rent', label: 'Rent', icon: Building, color: 'green' },
    { id: 'lease', label: 'Lease', icon: Store, color: 'purple' },
    { id: 'invest', label: 'Invest', icon: TrendingUp, color: 'orange' }
  ];

  const propertyTypes = [
    { id: 'residential', label: 'Residential', icon: Home },
    { id: 'commercial', label: 'Commercial', icon: Building },
    { id: 'industrial', label: 'Industrial', icon: Factory },
    { id: 'land', label: 'Land & Plots', icon: Trees },
    { id: 'agricultural', label: 'Agricultural', icon: Trees },
    { id: 'luxury', label: 'Luxury', icon: Star },
    { id: 'rental', label: 'Short-term Rental', icon: Hotel },
    { id: 'investment', label: 'Investment', icon: TrendingUp },
    { id: 'new-development', label: 'New Development', icon: Building }
  ];

  const stats = [
    { value: '245,678', label: 'Properties', icon: Building },
    { value: '142', label: 'Countries', icon: Globe },
    { value: '12.5M', label: 'Monthly Views', icon: Eye },
    { value: '98%', label: 'Satisfaction', icon: Users }
  ];

  const handleSearch = () => {
    onSearch({ ...searchData, category: activeTab });
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full opacity-20"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 0.9, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-200 rounded-full opacity-20"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        
        {/* Main Content */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Discover Property Worldwide
            <span className="block text-2xl lg:text-3xl font-normal text-gray-600 mt-4">
              Buy, Rent, Invest — All in One Global Marketplace
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Real estate, land, commercial, industrial, and more — connect with property opportunities across 142 countries
          </motion.p>
        </div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === category.id
                    ? `bg-${category.color}-500 text-white`
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              
              {/* Location Search */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location, City, Country"
                  value={searchData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Property Type */}
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={searchData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Property Types</option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={searchData.priceRange}
                  onChange={(e) => handleInputChange('priceRange', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Any Price</option>
                  <option value="0-100000">Under $100K</option>
                  <option value="100000-500000">$100K - $500K</option>
                  <option value="500000-1000000">$500K - $1M</option>
                  <option value="1000000-5000000">$1M - $5M</option>
                  <option value="5000000+">$5M+</option>
                </select>
              </div>

              {/* Keyword Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Keywords..."
                  value={searchData.keyword}
                  onChange={(e) => handleInputChange('keyword', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
            >
              <Search className="w-4 h-4" />
              Search Properties
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <stat.icon className="w-5 h-5 text-blue-600" />
                <span className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyHero;
