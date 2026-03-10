import React from 'react';
import { motion } from 'framer-motion';
import { Home, Car, Briefcase, Cpu, ShoppingBag, Plane, Calendar, Heart, TreePine, HeartPulse, GraduationCap, ArrowRight } from 'lucide-react';

const SponsoredCategoryGrid = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    {
      name: 'Property',
      icon: Home,
      image: '/img/banner/property-category.jpg',
      count: 2341,
      color: 'from-blue-500 to-blue-600',
      description: 'Real estate & properties'
    },
    {
      name: 'Cars & Vehicles',
      icon: Car,
      image: '/img/banner/vehicles-category.jpg',
      count: 1876,
      color: 'from-red-500 to-red-600',
      description: 'Automobiles & transport'
    },
    {
      name: 'Jobs & Services',
      icon: Briefcase,
      image: '/img/banner/jobs-category.jpg',
      count: 3456,
      color: 'from-green-500 to-green-600',
      description: 'Employment & services'
    },
    {
      name: 'Business Opportunities',
      icon: Cpu,
      image: '/img/banner/business-category.jpg',
      count: 1234,
      color: 'from-purple-500 to-purple-600',
      description: 'Business & investments'
    },
    {
      name: 'Electronics',
      icon: Cpu,
      image: '/img/banner/electronics-category.jpg',
      count: 2987,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Tech & gadgets'
    },
    {
      name: 'Fashion & Beauty',
      icon: ShoppingBag,
      image: '/img/banner/fashion-category.jpg',
      count: 1654,
      color: 'from-pink-500 to-pink-600',
      description: 'Style & cosmetics'
    },
    {
      name: 'Travel & Experiences',
      icon: Plane,
      image: '/img/banner/travel-category.jpg',
      count: 987,
      color: 'from-cyan-500 to-cyan-600',
      description: 'Travel & activities'
    },
    {
      name: 'Events & Tickets',
      icon: Calendar,
      image: '/img/banner/events-category.jpg',
      count: 756,
      color: 'from-orange-500 to-orange-600',
      description: 'Events & entertainment'
    },
    {
      name: 'Pets & Animals',
      icon: Heart,
      image: '/img/banner/pets-category.jpg',
      count: 543,
      color: 'from-amber-500 to-amber-600',
      description: 'Pets & pet supplies'
    },
    {
      name: 'Home & Garden',
      icon: TreePine,
      image: '/img/banner/home-category.jpg',
      count: 1432,
      color: 'from-emerald-500 to-emerald-600',
      description: 'Home & garden items'
    },
    {
      name: 'Health & Wellness',
      icon: HeartPulse,
      image: '/img/banner/health-category.jpg',
      count: 876,
      color: 'from-teal-500 to-teal-600',
      description: 'Health & wellness'
    },
    {
      name: 'Education & Courses',
      icon: GraduationCap,
      image: '/img/banner/education-category.jpg',
      count: 654,
      color: 'from-violet-500 to-violet-600',
      description: 'Learning & courses'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Sponsored Categories</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover premium sponsored listings across all categories. Each category features verified businesses and high-quality advertisements.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.name;
          
          return (
            <motion.div
              key={category.name}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(isSelected ? null : category.name)}
              className={`relative cursor-pointer group ${
                isSelected ? 'ring-2 ring-yellow-500 ring-offset-2' : ''
              }`}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative h-32 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`}></div>
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover mix-blend-overlay"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  
                  {/* Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <Icon className="w-8 h-8 text-gray-800" />
                    </div>
                  </div>

                  {/* Sponsored Badge */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                      <span className="w-1 h-1 bg-white rounded-full mr-1 animate-pulse"></span>
                      Sponsored
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ArrowRight className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {category.count.toLocaleString()} Ads
                    </span>
                    <div className="flex items-center text-xs text-yellow-600">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                      Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Clear Selection */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear Category Filter
          </button>
        </motion.div>
      )}

      {/* Category Stats */}
      <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Sponsored Ads?</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Verified Sellers</h4>
              <p className="text-xs text-gray-600">All sponsored ads are from verified businesses</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Premium Placement</h4>
              <p className="text-xs text-gray-600">Enhanced visibility in search results</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Global Reach</h4>
              <p className="text-xs text-gray-600">Connect with customers worldwide</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">24/7 Support</h4>
              <p className="text-xs text-gray-600">Dedicated support for sponsored advertisers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsoredCategoryGrid;
