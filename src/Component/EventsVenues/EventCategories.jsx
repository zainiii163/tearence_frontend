import React, { useState, useEffect } from 'react';
import { Music, Briefcase, GraduationCap, PartyPopper, Trophy, Palette, Utensils, Heart, Calendar } from 'lucide-react';
import eventsApi from '../../services/eventsApi';

const EventCategories = ({ categories, onCategorySelect }) => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping for categories
  const iconMap = {
    'concert': Music,
    'conference': Briefcase,
    'workshop': GraduationCap,
    'festival': PartyPopper,
    'party': PartyPopper,
    'sports': Trophy,
    'cultural': Palette,
    'food_drink': Utensils,
    'charity': Heart,
    'other': Calendar
  };

  // Color mapping for categories
  const colorMap = {
    'concert': "from-purple-500 to-purple-600",
    'conference': "from-blue-500 to-blue-600",
    'workshop': "from-green-500 to-green-600",
    'festival': "from-pink-500 to-pink-600",
    'party': "from-indigo-500 to-indigo-600",
    'sports': "from-orange-500 to-orange-600",
    'cultural': "from-teal-500 to-teal-600",
    'food_drink': "from-red-500 to-red-600",
    'charity': "from-amber-500 to-amber-600",
    'other': "from-gray-500 to-gray-600"
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        
        if (categories && categories.data) {
          // Use passed categories data
          const categoriesList = Object.entries(categories.data).map(([key, value]) => ({
            id: key,
            key: key,
            name: value,
            icon: iconMap[key] || Calendar,
            color: colorMap[key] || "from-gray-500 to-gray-600",
            hoverColor: `hover:${colorMap[key] || "from-gray-600 to-gray-700"}`
          }));
          setCategoriesData(categoriesList);
        } else {
          // Fetch from API
          const response = await eventsApi.getEventCategories();
          const categoriesList = Object.entries(response.data || {}).map(([key, value]) => ({
            id: key,
            key: key,
            name: value,
            icon: iconMap[key] || Calendar,
            color: colorMap[key] || "from-gray-500 to-gray-600",
            hoverColor: `hover:${colorMap[key] || "from-gray-600 to-gray-700"}`
          }));
          setCategoriesData(categoriesList);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategoriesData([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [categories]);

  if (loading) {
    return (
      <div className="py-12 bg-white">
        <div className="page-container">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category.key);
    }
  };

  return (
    <div className="py-12 bg-white">
      <div className="page-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Event Categories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find events that match your interests from our diverse categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoriesData.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`group relative bg-gradient-to-br ${category.color} ${category.hoverColor} rounded-2xl p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 inline-block mb-4 group-hover:bg-white/30 transition-colors">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-white/80 text-sm">
                    Browse {category.name.toLowerCase()}
                  </p>
                </div>
                
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventCategories;
