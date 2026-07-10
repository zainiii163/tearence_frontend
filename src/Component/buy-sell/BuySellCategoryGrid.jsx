import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiChevronRight, FiTrendingUp, FiGrid, FiList, FiSettings } from 'react-icons/fi';
import { buysellAPI } from '../../api/buysell';

const BuySellCategoryGrid = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('compact-grid'); // 'large-grid', 'compact-grid', 'list'
  const [showDensityOptions, setShowDensityOptions] = useState(false);
  const [gridDensity, setGridDensity] = useState('medium'); // 'small', 'medium', 'large'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await buysellAPI.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getGridCols = () => {
    if (viewMode === 'list') return 'grid-cols-1';
    
    switch (gridDensity) {
      case 'small':
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8';
      case 'medium':
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
      case 'large':
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
      default:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
    }
  };

  const renderCompactCard = (category, index) => (
    <motion.div
      key={category.id}
      variants={itemVariants}
      whileHover={{ 
        scale: 1.05,
        y: -2,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectCategory(category.id)}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group p-4 relative overflow-hidden"
    >
      <div className="flex flex-col items-center text-center">
        <div className={`${category.color} w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-md`}>
          <div className="text-white text-lg">
            {category.icon}
          </div>
        </div>
        
        <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors line-clamp-1">
          {category.name}
        </h3>
        
        <p className="text-xs text-gray-500">
          {(category.count || category.advert_count || 0).toLocaleString()} items
        </p>
      </div>

      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <FiChevronRight className="h-4 w-4 text-green-600" />
      </div>
    </motion.div>
  );

  const renderLargeCard = (category, index) => (
    <motion.div
      key={category.id}
      variants={itemVariants}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectCategory(category.id)}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      <div className="p-6">
        <div className={`${category.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <div className="text-white text-2xl">
            {category.icon}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 text-center group-hover:text-green-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
          {category.description}
        </p>
        
        <div className="flex items-center justify-between text-center">
          <div className="flex-1">
            <div className="text-xl font-bold text-gray-900">
              {(category.count || category.advert_count || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Items</div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
          <span>View</span>
          <FiChevronRight className="h-3 w-3" />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
    </motion.div>
  );

  const renderListItem = (category, index) => (
    <motion.div
      key={category.id}
      variants={itemVariants}
      whileHover={{ 
        scale: 1.02,
        x: 5,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectCategory(category.id)}
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group p-4 flex items-center gap-4"
    >
      <div className={`${category.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-md`}>
        <div className="text-white text-lg">
          {category.icon}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors truncate">
          {category.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-1">
          {category.description}
        </p>
      </div>
      
      <div className="text-right flex-shrink-0">
        <div className="text-lg font-bold text-gray-900">
          {(category.count || category.advert_count || 0).toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">Items</div>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <FiChevronRight className="h-5 w-5 text-green-600" />
      </div>
    </motion.div>
  );

  const renderCategory = (category, index) => {
    if (viewMode === 'list') return renderListItem(category, index);
    if (viewMode === 'large-grid') return renderLargeCard(category, index);
    return renderCompactCard(category, index);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiTrendingUp className="h-6 w-6 text-green-600" />
            Browse Categories
          </h2>
          <p className="text-gray-600 text-sm">
            {loading ? 'Loading...' : `${categories.length} categories`}
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg bg-white">
            <button
              onClick={() => setViewMode('compact-grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'compact-grid' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Compact Grid"
            >
              <FiGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('large-grid')}
              className={`p-2 transition-colors ${
                viewMode === 'large-grid' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Large Grid"
            >
              <FiGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List View"
            >
              <FiList className="h-4 w-4" />
            </button>
          </div>

          {/* Density Control (only for grid views) */}
          {viewMode !== 'list' && (
            <div className="relative">
              <button
                onClick={() => setShowDensityOptions(!showDensityOptions)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:text-gray-900 transition-colors"
              >
                <FiSettings className="h-4 w-4" />
                <span className="text-sm capitalize">{gridDensity}</span>
              </button>
              
              {showDensityOptions && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => { setGridDensity('small'); setShowDensityOptions(false); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      gridDensity === 'small' ? 'bg-green-50 text-green-600' : 'text-gray-700'
                    }`}
                  >
                    Small
                  </button>
                  <button
                    onClick={() => { setGridDensity('medium'); setShowDensityOptions(false); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      gridDensity === 'medium' ? 'bg-green-50 text-green-600' : 'text-gray-700'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => { setGridDensity('large'); setShowDensityOptions(false); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      gridDensity === 'large' ? 'bg-green-50 text-green-600' : 'text-gray-700'
                    }`}
                  >
                    Large
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className={`grid ${getGridCols()} gap-4`}>
          {[...Array(12)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-20 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          className={`grid ${getGridCols()} gap-4`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            renderCategory(category, index)
          ))}
        </motion.div>
      )}

      {/* Quick Stats Bar */}
      <motion.div
        variants={itemVariants}
        className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-green-700">2.5M+</div>
            <div className="text-sm text-green-600">Total Items</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">850K+</div>
            <div className="text-sm text-green-600">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">142</div>
            <div className="text-sm text-green-600">Countries</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">24/7</div>
            <div className="text-sm text-green-600">Support</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BuySellCategoryGrid;
