import React from 'react';
import { motion } from 'framer-motion';
import { Car, Truck, Bike, Bus, Zap, Crown, Home, Ship, Tractor, HardHat, ArrowRight } from 'lucide-react';

const VehicleCategoryGrid = ({ categories, onCategorySelect, selectedCategory }) => {
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Cars': Car,
      'Vans': Truck,
      'Motorbikes': Bike,
      'Trucks & Lorries': Truck,
      'Buses & Coaches': Bus,
      'Electric Vehicles': Zap,
      'Classic Cars': Crown,
      'Luxury & Exotic Cars': Crown,
      'Caravans & Motorhomes': Home,
      'Boats & Jet Skis': Ship,
      'Agricultural Vehicles': Tractor,
      'Construction Vehicles': HardHat
    };
    return iconMap[categoryName] || Car;
  };

  const defaultCategories = [
    { name: 'Cars', count: 15432, icon: Car },
    { name: 'Vans', count: 8234, icon: Truck },
    { name: 'Motorbikes', count: 6789, icon: Bike },
    { name: 'Trucks & Lorries', count: 3456, icon: Truck },
    { name: 'Buses & Coaches', count: 1234, icon: Bus },
    { name: 'Electric Vehicles', count: 9876, icon: Zap },
    { name: 'Classic Cars', count: 2345, icon: Crown },
    { name: 'Luxury & Exotic Cars', count: 3456, icon: Crown },
    { name: 'Caravans & Motorhomes', count: 1567, icon: Home },
    { name: 'Boats & Jet Skis', count: 890, icon: Ship },
    { name: 'Agricultural Vehicles', count: 1234, icon: Tractor },
    { name: 'Construction Vehicles', count: 890, icon: HardHat }
  ];

  const categoriesToUse = categories || defaultCategories;

  const handleCategoryClick = (category) => {
    onCategorySelect(category.name === selectedCategory ? '' : category.name);
  };

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Vehicle Categories</h2>
        <p className="text-gray-600 text-lg">Find the perfect vehicle for your needs</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoriesToUse.map((category, index) => {
          const Icon = getCategoryIcon(category.name);
          const isSelected = category.name === selectedCategory;
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              <button
                onClick={() => handleCategoryClick(category)}
                className={`w-full p-6 rounded-xl border-2 transition-all duration-300 group ${
                  isSelected
                    ? 'border-red-500 bg-red-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-lg'
                }`}
              >
                {/* Icon */}
                <div className={`mb-4 flex justify-center ${
                  isSelected ? 'text-red-600' : 'text-gray-600 group-hover:text-red-600'
                }`}>
                  <div className={`p-3 rounded-full ${
                    isSelected ? 'bg-red-100' : 'bg-gray-100 group-hover:bg-red-100'
                  }`}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>

                {/* Category Name */}
                <h3 className={`text-lg font-semibold mb-2 ${
                  isSelected ? 'text-red-900' : 'text-gray-900 group-hover:text-red-900'
                }`}>
                  {category.name}
                </h3>

                {/* Count */}
                <p className={`text-sm mb-4 ${
                  isSelected ? 'text-red-700' : 'text-gray-600 group-hover:text-red-700'
                }`}>
                  {category.count.toLocaleString()} active adverts
                </p>

                {/* Explore Button */}
                <div className={`flex items-center justify-center space-x-1 text-sm font-medium ${
                  isSelected ? 'text-red-600' : 'text-gray-700 group-hover:text-red-600'
                }`}>
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Selected Badge */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  </motion.div>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Clear Selection Button */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => onCategorySelect('')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <span>Clear Selection</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default VehicleCategoryGrid;
