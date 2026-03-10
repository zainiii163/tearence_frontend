import React from 'react';
import { motion } from 'framer-motion';
import { Home, Car, BookOpen, Plane, ShoppingCart, Briefcase, Calendar, Zap, Heart, PawPrint, Flower, Gamepad2, ArrowRight } from 'lucide-react';

const PromotedCategoryGrid = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    {
      name: 'Property',
      icon: Home,
      count: 2341,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
    },
    {
      name: 'Cars & Vehicles',
      icon: Car,
      count: 1876,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop'
    },
    {
      name: 'Jobs & Services',
      icon: Briefcase,
      count: 3421,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop'
    },
    {
      name: 'Business Opportunities',
      icon: Zap,
      count: 892,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop'
    },
    {
      name: 'Electronics',
      icon: Gamepad2,
      count: 2156,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
    },
    {
      name: 'Fashion & Beauty',
      icon: Heart,
      count: 1923,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
    },
    {
      name: 'Travel & Experiences',
      icon: Plane,
      count: 1456,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      image: 'https://images.unsplash.com/photo-1507525428034-b723a9ce6890?w=400&h=300&fit=crop'
    },
    {
      name: 'Events & Tickets',
      icon: Calendar,
      count: 987,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop'
    },
    {
      name: 'Pets & Animals',
      icon: PawPrint,
      count: 756,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
    },
    {
      name: 'Home & Garden',
      icon: Flower,
      count: 1234,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    },
    {
      name: 'Health & Wellness',
      icon: Heart,
      count: 1567,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    {
      name: 'Education & Courses',
      icon: BookOpen,
      count: 834,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop'
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Explore Promoted Categories</h2>
        <div className="text-sm text-gray-500">
          <span className="font-semibold text-orange-600">15,234</span> promoted adverts across all categories
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
              onClick={() => onCategorySelect(category.name)}
              className={`relative group cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                isSelected ? 'ring-2 ring-orange-500 shadow-xl' : 'hover:shadow-xl'
              }`}
            >
              {/* Background Image with Overlay */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`}></div>
                
                {/* Category Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full">
                    <Icon className="h-8 w-8 text-gray-800" />
                  </div>
                </div>

                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Selected
                  </div>
                )}
              </div>

              {/* Category Info */}
              <div className="bg-white p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    <span className="font-semibold text-orange-600">{category.count}</span> promoted
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute bottom-4 left-4 right-4">
                  <button className={`w-full bg-white text-gray-900 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${category.color} text-white hover:shadow-lg`}>
                    Explore Promoted Ads
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Clear Selection Button */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <button
            onClick={() => onCategorySelect('')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-all duration-200"
          >
            Clear Category Selection
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PromotedCategoryGrid;
