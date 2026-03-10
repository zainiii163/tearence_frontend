import React from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Heart, 
  TrendingUp, 
  DollarSign, 
  Wrench, 
  Utensils, 
  ShoppingBag, 
  Truck, 
  GraduationCap, 
  Palette, 
  Home, 
  Clock,
  Briefcase,
  ChevronRight
} from 'lucide-react';

const JobsCategoryGrid = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    {
      name: 'Technology & IT',
      icon: Monitor,
      emoji: '💻',
      count: 12450,
      color: 'from-blue-500 to-blue-600',
      description: 'Software, Hardware, AI, Data Science',
      trending: true
    },
    {
      name: 'Healthcare & Medical',
      icon: Heart,
      emoji: '🏥',
      count: 8932,
      color: 'from-red-500 to-red-600',
      description: 'Doctors, Nurses, Medical Staff',
      trending: false
    },
    {
      name: 'Sales & Marketing',
      icon: TrendingUp,
      emoji: '📈',
      count: 6784,
      color: 'from-green-500 to-green-600',
      description: 'Sales, Marketing, Digital Marketing',
      trending: true
    },
    {
      name: 'Finance & Accounting',
      icon: DollarSign,
      emoji: '💰',
      count: 4567,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Banking, Accounting, Financial Analysis',
      trending: false
    },
    {
      name: 'Engineering & Construction',
      icon: Wrench,
      emoji: '🏗️',
      count: 3456,
      color: 'from-purple-500 to-purple-600',
      description: 'Engineering, Architecture, Construction',
      trending: false
    },
    {
      name: 'Hospitality & Tourism',
      icon: Utensils,
      emoji: '🏨',
      count: 2890,
      color: 'from-pink-500 to-pink-600',
      description: 'Hotels, Restaurants, Tourism',
      trending: true
    },
    {
      name: 'Retail & Customer Service',
      icon: ShoppingBag,
      emoji: '🛍️',
      count: 2345,
      color: 'from-indigo-500 to-indigo-600',
      description: 'Retail, Customer Support, Sales',
      trending: false
    },
    {
      name: 'Logistics & Transport',
      icon: Truck,
      emoji: '🚚',
      count: 1987,
      color: 'from-orange-500 to-orange-600',
      description: 'Transportation, Supply Chain, Logistics',
      trending: false
    },
    {
      name: 'Education & Training',
      icon: GraduationCap,
      emoji: '🎓',
      count: 1654,
      color: 'from-teal-500 to-teal-600',
      description: 'Teaching, Training, Education',
      trending: false
    },
    {
      name: 'Creative & Media',
      icon: Palette,
      emoji: '🎨',
      count: 1432,
      color: 'from-rose-500 to-rose-600',
      description: 'Design, Media, Content Creation',
      trending: true
    },
    {
      name: 'Remote Jobs',
      icon: Home,
      emoji: '🏠',
      count: 8765,
      color: 'from-cyan-500 to-cyan-600',
      description: 'Work from Home Opportunities',
      trending: true
    },
    {
      name: 'Part-Time & Freelance',
      icon: Clock,
      emoji: '⏰',
      count: 5432,
      color: 'from-amber-500 to-amber-600',
      description: 'Part-time, Freelance, Gig Work',
      trending: false
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Explore Job Categories
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover opportunities across various industries and find your perfect career match
        </p>
      </div>

      {/* Category Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.name;
          
          return (
            <motion.div
              key={category.name}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(isSelected ? '' : category.name)}
              className={`relative cursor-pointer group ${
                isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
              {/* Card Background */}
              <div className={`bg-gradient-to-br ${category.color} p-6 rounded-2xl text-white relative overflow-hidden transition-all duration-300 hover:shadow-xl`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px'
                  }} />
                </div>

                {/* Trending Badge */}
                {category.trending && (
                  <div className="absolute top-2 right-2 bg-white bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                    🔥 Trending
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon and Emoji */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl">{category.emoji}</div>
                  </div>

                  {/* Category Name */}
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white text-opacity-90 mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  {/* Job Count */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {category.count.toLocaleString()} jobs
                      </span>
                    </div>
                    
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>

              {/* Selection Indicator Bar */}
              {isSelected && (
                <motion.div
                  layoutId="selectedCategory"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-500 rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Clear Selection Button */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => setSelectedCategory('')}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            Clear Category Filter
          </button>
        </motion.div>
      )}

      {/* Category Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">
              {categories.reduce((sum, cat) => sum + cat.count, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Active Jobs</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">
              {categories.filter(cat => cat.trending).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Trending Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(categories.reduce((sum, cat) => sum + cat.count, 0) / categories.length).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Avg. Jobs per Category</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Categories</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JobsCategoryGrid;
