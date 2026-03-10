import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ArrowRight, 
  ExternalLink,
  Eye
} from 'lucide-react';

const AffiliateCategoryGrid = ({ categories, selectedCategory, onSelectCategory }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'from-blue-400 to-blue-600',
      pink: 'from-pink-400 to-pink-600',
      green: 'from-green-400 to-green-600',
      yellow: 'from-yellow-400 to-yellow-600',
      red: 'from-red-400 to-red-600',
      purple: 'from-purple-400 to-purple-600',
      orange: 'from-orange-400 to-orange-600',
      indigo: 'from-indigo-400 to-indigo-600',
      teal: 'from-teal-400 to-teal-600',
      cyan: 'from-cyan-400 to-cyan-600',
      amber: 'from-amber-400 to-amber-600',
      gray: 'from-gray-400 to-gray-600',
      rose: 'from-rose-400 to-rose-600'
    };
    return colorMap[color] || 'from-gray-400 to-gray-600';
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Explore Affiliate Categories
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover affiliate opportunities across 13 popular categories
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCategory(selectedCategory === category.name ? null : category.name)}
              className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                selectedCategory === category.name 
                  ? 'ring-4 ring-blue-500 shadow-2xl' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(category.color)} opacity-90`} />
              
              {/* Content */}
              <div className="relative p-6 text-white">
                {/* Icon */}
                <motion.div
                  animate={{
                    scale: hoveredCategory === category.id ? 1.2 : 1,
                    rotate: hoveredCategory === category.id ? 10 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl mb-4"
                >
                  {category.icon}
                </motion.div>

                {/* Category Name */}
                <h3 className="text-lg font-bold mb-2 line-clamp-2">
                  {category.name}
                </h3>

                {/* Offer Count */}
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">
                    {category.count} offers
                  </span>
                  
                  {/* Hover Actions */}
                  <motion.div
                    animate={{
                      opacity: hoveredCategory === category.id ? 1 : 0,
                      x: hoveredCategory === category.id ? 0 : 10
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-1"
                  >
                    {selectedCategory === category.name ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <>
                        <span className="text-xs">Explore</span>
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </motion.div>
                </div>

                {/* Selection Indicator */}
                {selectedCategory === category.name && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-white text-gray-900 rounded-full p-1"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </div>

              {/* Shimmer Effect */}
              {hoveredCategory === category.id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                x: ['-100%', '100%']
              }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Active Filter Display */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex items-center justify-center"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center space-x-2">
              <span className="text-blue-700">Filtered by:</span>
              <span className="font-semibold text-blue-900">{selectedCategory}</span>
              <button
                onClick={() => onSelectCategory(null)}
                className="text-blue-500 hover:text-blue-700"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}

        {/* Trending Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gray-50 rounded-2xl p-8"
          >
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">Trending Categories</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories
                .sort((a, b) => b.count - a.count)
                .slice(0, 4)
                .map((category, index) => (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h4 className="font-semibold text-gray-900 text-sm">{category.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{category.count} offers</p>
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      ↑ {Math.floor(Math.random() * 20 + 5)}% this week
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AffiliateCategoryGrid;
