import React from 'react';
import { motion } from 'framer-motion';
import { Home, Car, Briefcase, Building, Laptop, ShoppingBag, Plane, Ticket, Heart, TreePine, HeartHandshake, GraduationCap, ArrowRight, Globe } from 'lucide-react';

const PromotedCategoryGrid = () => {
  const categories = [
    {
      name: 'Property',
      icon: Home,
      count: 1247,
      gradient: 'from-blue-500 to-cyan-500',
      bgImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      description: 'Homes, apartments & land'
    },
    {
      name: 'Cars & Vehicles',
      icon: Car,
      count: 892,
      gradient: 'from-red-500 to-orange-500',
      bgImage: 'https://images.unsplash.com/photo-1493238792000-8113a7f57128?w=800&h=600&fit=crop',
      description: 'Cars, motorcycles & more'
    },
    {
      name: 'Jobs & Services',
      icon: Briefcase,
      count: 2156,
      gradient: 'from-green-500 to-emerald-500',
      bgImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      description: 'Employment & professional services'
    },
    {
      name: 'Business Opportunities',
      icon: Building,
      count: 634,
      gradient: 'from-purple-500 to-pink-500',
      bgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop',
      description: 'Franchises & investments'
    },
    {
      name: 'Electronics',
      icon: Laptop,
      count: 3421,
      gradient: 'from-indigo-500 to-blue-500',
      bgImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop',
      description: 'Gadgets & tech devices'
    },
    {
      name: 'Fashion & Beauty',
      icon: ShoppingBag,
      count: 1876,
      gradient: 'from-pink-500 to-rose-500',
      bgImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      description: 'Clothing & accessories'
    },
    {
      name: 'Travel & Experiences',
      icon: Plane,
      count: 567,
      gradient: 'from-amber-500 to-yellow-500',
      bgImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
      description: 'Vacations & activities'
    },
    {
      name: 'Events & Tickets',
      icon: Ticket,
      count: 892,
      gradient: 'from-orange-500 to-red-500',
      bgImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop',
      description: 'Concerts & events'
    },
    {
      name: 'Pets & Animals',
      icon: Heart,
      count: 423,
      gradient: 'from-teal-500 to-green-500',
      bgImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop',
      description: 'Pets & pet supplies'
    },
    {
      name: 'Home & Garden',
      icon: TreePine,
      count: 1534,
      gradient: 'from-green-600 to-teal-600',
      bgImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      description: 'Furniture & garden items'
    },
    {
      name: 'Health & Wellness',
      icon: HeartHandshake,
      count: 712,
      gradient: 'from-red-500 to-pink-500',
      bgImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
      description: 'Health products & services'
    },
    {
      name: 'Education & Courses',
      icon: GraduationCap,
      count: 445,
      gradient: 'from-blue-600 to-indigo-600',
      bgImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
      description: 'Learning & development'
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4"
        >
          <Globe className="w-4 h-4" />
          Global Categories
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Explore Promoted Categories
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover promoted listings across all major categories. Each category features boosted adverts for maximum visibility.
        </p>
      </div>

      {/* Category Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {categories.map((category, index) => {
          const Icon = React.isValidElement(category.icon) ? category.icon : null;
          return (
            <motion.div
              key={category.name}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => {
                // Navigate to category page
                window.location.href = `/promoted?category=${encodeURIComponent(category.name)}`;
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={category.bgImage}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                {/* Icon and Name */}
                <div>
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${category.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-3">
                    {category.description}
                  </p>
                </div>

                {/* Count and Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {category.count.toLocaleString()} Promoted
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-white/90 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* View All Categories */}
      <div className="text-center mt-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/promoted'}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
        >
          View All Promoted Ads
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default PromotedCategoryGrid;
