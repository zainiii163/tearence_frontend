import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Calendar, ChevronDown, Car, Truck, Bike } from 'lucide-react';

const VehicleHero = ({ onSearch, onCategorySelect }) => {
  const [searchForm, setSearchForm] = useState({
    vehicleType: '',
    location: '',
    category: 'sale',
    priceRange: [0, 100000]
  });

  const vehicleTypes = [
    { value: 'car', label: 'Cars', icon: Car },
    { value: 'van', label: 'Vans', icon: Truck },
    { value: 'motorbike', label: 'Motorbikes', icon: Bike },
    { value: 'truck', label: 'Trucks', icon: Truck },
    { value: 'bus', label: 'Buses', icon: Truck },
    { value: 'electric', label: 'Electric', icon: Car },
    { value: 'classic', label: 'Classic Cars', icon: Car },
    { value: 'luxury', label: 'Luxury', icon: Car },
    { value: 'caravan', label: 'Caravans', icon: Truck },
    { value: 'boat', label: 'Boats', icon: Truck },
    { value: 'agricultural', label: 'Agricultural', icon: Truck },
    { value: 'construction', label: 'Construction', icon: Truck }
  ];

  const categories = [
    { value: 'sale', label: 'For Sale' },
    { value: 'hire', label: 'For Hire' },
    { value: 'lease', label: 'For Lease' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = `${searchForm.vehicleType} ${searchForm.location}`.trim();
    onSearch(searchQuery);
    
    // Set category filter if selected
    if (searchForm.category) {
      onCategorySelect(searchForm.category === 'sale' ? '' : searchForm.category);
    }
  };

  const handleInputChange = (field, value) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-red-500 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500 rounded-full opacity-20 blur-xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Discover Vehicles for Sale, Hire & Lease — Worldwide
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto"
          >
            Cars, vans, bikes, trucks, luxury vehicles, and transport services from trusted sellers.
          </motion.p>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <div className="relative">
                    <select
                      value={searchForm.vehicleType}
                      onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                    >
                      <option value="">All Types</option>
                      {vehicleTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="City or Country"
                      value={searchForm.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={searchForm.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="relative">
                    <select
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Any Price</option>
                      <option value="0-5000">Under $5,000</option>
                      <option value="5000-10000">$5,000 - $10,000</option>
                      <option value="10000-25000">$10,000 - $25,000</option>
                      <option value="25000-50000">$25,000 - $50,000</option>
                      <option value="50000-100000">$50,000 - $100,000</option>
                      <option value="100000+">$100,000+</option>
                    </select>
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Vehicles</span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">45,234</div>
              <div className="text-gray-400">Active Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">142</div>
              <div className="text-gray-400">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">12.5M</div>
              <div className="text-gray-400">Monthly Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">98%</div>
              <div className="text-gray-400">Satisfaction</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VehicleHero;
