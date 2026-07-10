import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaStore, FaUtensils, FaBriefcase, FaStethoscope, FaGraduationCap, FaCar, FaHome, FaLaptop, FaDumbbell, FaPlane, FaHeart, FaDog, FaBuilding, FaIndustry, FaShoppingCart, FaHotel, FaCoffee, FaMusic, FaPalette, FaTools, FaTruck, FaSeedling, FaGamepad, FaBook, FaMobile, FaTv, FaHeadphones, FaFootballBall, FaChurch, FaLandmark, FaWarehouse, FaGavel, FaRing } from 'react-icons/fa';

const BusinessCategoryGrid = ({ selectedCategory, onCategoryClick, businesses = [] }) => {
  const navigate = useNavigate();

  // Calculate actual counts from businesses data
  const calculateCategoryCounts = () => {
    const categoryMap = {
      'retail': ['retail', 'shopping', 'store'],
      'restaurants': ['restaurant', 'food', 'cafe', 'dining'],
      'services': ['service', 'professional', 'consulting'],
      'healthcare': ['health', 'medical', 'wellness', 'doctor', 'clinic'],
      'education': ['education', 'training', 'school', 'university'],
      'automotive': ['auto', 'car', 'vehicle', 'automotive'],
      'real-estate': ['real estate', 'property', 'housing'],
      'entertainment': ['entertainment', 'leisure', 'fun'],
      'travel': ['travel', 'hospitality', 'hotel'],
      'beauty': ['beauty', 'salon', 'spa', 'personal care'],
      'pets': ['pet', 'animal', 'veterinary'],
      'home-garden': ['home', 'garden', 'furniture'],
      'technology': ['technology', 'tech', 'electronics', 'software'],
      'sports-fitness': ['sports', 'fitness', 'gym'],
      'industrial': ['industrial', 'manufacturing', 'factory'],
      'non-profit': ['non-profit', 'charity', 'religious', 'church'],
    };

    const counts = {};
    // Initialize counts to 0
    Object.keys(categoryMap).forEach(key => counts[key] = 0);

    // Count businesses by category
    businesses.forEach(business => {
      if (business.category) {
        const businessCategoryLower = business.category.toLowerCase();
        Object.keys(categoryMap).forEach(key => {
          const keywords = categoryMap[key];
          if (keywords.some(keyword => businessCategoryLower.includes(keyword))) {
            counts[key]++;
          }
        });
      }
    });

    return counts;
  };

  const actualCounts = calculateCategoryCounts();

  const categories = [
    { id: 'retail', name: 'Retail & Shopping', icon: <FaShoppingCart className="h-5 w-5" />, color: 'from-blue-500 to-blue-600', count: actualCounts.retail },
    { id: 'restaurants', name: 'Restaurants & Food', icon: <FaUtensils className="h-5 w-5" />, color: 'from-orange-500 to-orange-600', count: actualCounts.restaurants },
    { id: 'services', name: 'Professional Services', icon: <FaBriefcase className="h-5 w-5" />, color: 'from-green-500 to-green-600', count: actualCounts.services },
    { id: 'healthcare', name: 'Healthcare & Wellness', icon: <FaStethoscope className="h-5 w-5" />, color: 'from-red-500 to-red-600', count: actualCounts.healthcare },
    { id: 'education', name: 'Education & Training', icon: <FaGraduationCap className="h-5 w-5" />, color: 'from-purple-500 to-purple-600', count: actualCounts.education },
    { id: 'automotive', name: 'Automotive', icon: <FaCar className="h-5 w-5" />, color: 'from-gray-500 to-gray-600', count: actualCounts.automotive },
    { id: 'real-estate', name: 'Real Estate', icon: <FaHome className="h-5 w-5" />, color: 'from-teal-500 to-teal-600', count: actualCounts['real-estate'] },
    { id: 'entertainment', name: 'Entertainment & Leisure', icon: <FaGamepad className="h-5 w-5" />, color: 'from-pink-500 to-pink-600', count: actualCounts.entertainment },
    { id: 'travel', name: 'Travel & Hospitality', icon: <FaPlane className="h-5 w-5" />, color: 'from-indigo-500 to-indigo-600', count: actualCounts.travel },
    { id: 'beauty', name: 'Beauty & Personal Care', icon: <FaHeart className="h-5 w-5" />, color: 'from-rose-500 to-rose-600', count: actualCounts.beauty },
    { id: 'pets', name: 'Pet Services', icon: <FaDog className="h-5 w-5" />, color: 'from-yellow-500 to-yellow-600', count: actualCounts.pets },
    { id: 'home-garden', name: 'Home & Garden', icon: <FaSeedling className="h-5 w-5" />, color: 'from-emerald-500 to-emerald-600', count: actualCounts['home-garden'] },
    { id: 'technology', name: 'Technology & Electronics', icon: <FaLaptop className="h-5 w-5" />, color: 'from-cyan-500 to-cyan-600', count: actualCounts.technology },
    { id: 'sports-fitness', name: 'Sports & Fitness', icon: <FaDumbbell className="h-5 w-5" />, color: 'from-lime-500 to-lime-600', count: actualCounts['sports-fitness'] },
    { id: 'industrial', name: 'Industrial & Manufacturing', icon: <FaIndustry className="h-5 w-5" />, color: 'from-slate-500 to-slate-600', count: actualCounts.industrial },
    { id: 'non-profit', name: 'Non-Profit & Religious', icon: <FaChurch className="h-5 w-5" />, color: 'from-violet-500 to-violet-600', count: actualCounts['non-profit'] },
  ];

  return (
    <div className="mt-4 md:mt-8 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">Browse by Category</h2>
          <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-6">Explore businesses across various industries</p>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05 + (index * 0.02) }}
                whileHover={{ y: -4, scale: 1.05 }}
                onClick={() => {
                // Navigate to category-specific page
                navigate(`/business/category/${category.id}`);
                // Also call the provided callback if it exists
                if (onCategoryClick) {
                  onCategoryClick(category.name);
                }
              }}
                className="group"
              >
                <div className={`bg-white rounded-lg md:rounded-xl shadow-sm border p-2 md:p-3 hover:shadow-md transition-all duration-300 h-full cursor-pointer ${
                  selectedCategory === category.name ? 'border-purple-500 ring-1 md:ring-2 ring-purple-100' : 'border-gray-200'
                }`}>
                  <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${category.color} rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white text-sm md:text-base">
                      {category.icon}
                    </div>
                  </div>
                  <h3 className={`font-semibold text-[10px] md:text-xs mb-0.5 md:mb-1 transition-colors line-clamp-2 leading-tight ${
                    selectedCategory === category.name ? 'text-purple-600' : 'text-gray-900 group-hover:text-purple-600'
                  }`}>
                    {category.name}
                  </h3>
                  <p className="text-[9px] md:text-xs text-gray-500">
                    {category.count} businesses
                  </p>
                  {selectedCategory === category.name && (
                    <div className="mt-1 md:mt-2 flex items-center justify-center gap-1 text-purple-600 text-[9px] md:text-xs font-semibold">
                      <span className="hidden md:inline">✓</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessCategoryGrid;
