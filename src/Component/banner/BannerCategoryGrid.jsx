import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Globe, Loader2 } from 'lucide-react';

const BannerCategoryGrid = ({ categories, selectedCategory, setSelectedCategory, loading }) => {
  // Map API categories to display format with icons
  const getCategoryIcon = (name) => {
    const icons = {
      'Real Estate': '🏢',
      'Vehicles': '🚗',
      'Travel & Resorts': '✈️',
      'Jobs & Recruitment': '💼',
      'Books & Authors': '📚',
      'Services': '🔧',
      'Events': '📅',
      'Food & Hospitality': '🍽',
      'Fashion & Beauty': '👗',
      'Tech & Electronics': '💻',
      'Health & Wellness': '🏥',
      'Business & Finance': '💼'
    };
    return icons[name] || '📋';
  };

  const getCategoryColor = (name) => {
    const colors = {
      'Real Estate': 'from-blue-500 to-cyan-600',
      'Vehicles': 'from-red-500 to-orange-600',
      'Travel & Resorts': 'from-teal-500 to-green-600',
      'Jobs & Recruitment': 'from-purple-500 to-pink-600',
      'Books & Authors': 'from-indigo-500 to-blue-600',
      'Services': 'from-green-500 to-teal-600',
      'Events': 'from-yellow-500 to-orange-600',
      'Food & Hospitality': 'from-orange-500 to-red-600',
      'Fashion & Beauty': 'from-pink-500 to-purple-600',
      'Tech & Electronics': 'from-gray-600 to-blue-600',
      'Health & Wellness': 'from-green-500 to-blue-600',
      'Business & Finance': 'from-blue-600 to-indigo-600'
    };
    return colors[name] || 'from-gray-500 to-gray-600';
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? "all" : categoryName);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
          <p className="text-gray-600 mt-1">Discover banner adverts by category</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Globe className="w-4 h-4" />
          <span>{categories?.length || 0} Categories</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories?.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => handleCategoryClick(category.name)}
            className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
              selectedCategory === category.name 
                ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' 
                : 'hover:shadow-lg hover:scale-105'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(category.name)}`}></div>
            
            {/* Banner Preview */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={`https://picsum.photos/seed/${category.name}/400/200.jpg`}
                alt={category.name}
                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Category Icon */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-2xl">
                {getCategoryIcon(category.name)}
              </div>
              
              {/* Selected Indicator */}
              {selectedCategory === category.name && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-white rounded-full animate-pulse"></div>
              )}
            </div>

            {/* Category Info */}
            <div className="relative p-4 bg-white">
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description || 'Browse banner adverts in this category'}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    {category.active_banners_count || 0}
                  </span>
                  <span className="text-xs text-gray-500">banners</span>
                </div>
                
                <button className={`p-2 rounded-lg transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                }`}>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </motion.div>
        ))}
      </div>

      {/* Active Filter Display */}
      {selectedCategory !== "all" && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-900">Active Filter:</span>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                {selectedCategory}
              </span>
            </div>
            <button
              onClick={() => setSelectedCategory("all")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerCategoryGrid;
