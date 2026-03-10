import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiTrendingUp } from 'react-icons/fi';
import { categories } from '../../data/mockBuySellData';

const BuySellCategoryGrid = ({ onSelectCategory }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiTrendingUp className="h-6 w-6 text-green-600" />
          Browse Categories
        </h2>
        <p className="text-gray-600">
          Choose from 15+ categories
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {categories.map((category, index) => (
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
            {/* Category Icon */}
            <div className="p-6">
              <div className={`${category.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <div className="text-white text-2xl">
                  {category.icon}
                </div>
              </div>
              
              {/* Category Info */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center group-hover:text-green-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
                {category.description}
              </p>
              
              {/* Stats */}
              <div className="flex items-center justify-between text-center">
                <div className="flex-1">
                  <div className="text-xl font-bold text-gray-900">
                    {category.count.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Items</div>
                </div>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            {/* View All Indicator */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                <span>View</span>
                <FiChevronRight className="h-3 w-3" />
              </div>
            </div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          </motion.div>
        ))}
      </div>

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
