import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Building, 
  Factory, 
  Trees, 
  Store, 
  Hotel, 
  Briefcase, 
  Star, 
  TrendingUp, 
  Calendar,
  DollarSign,
  MapPin,
  ChevronRight
} from 'lucide-react';

const PropertyCategoryGrid = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    // Property Types
    {
      id: 'residential',
      name: 'Residential',
      icon: Home,
      count: 45234,
      description: 'Homes, apartments, condos',
      color: 'blue',
      trend: '+12%'
    },
    {
      id: 'commercial',
      name: 'Commercial',
      icon: Building,
      count: 28456,
      description: 'Office spaces, retail units',
      color: 'purple',
      trend: '+8%'
    },
    {
      id: 'industrial',
      name: 'Industrial',
      icon: Factory,
      count: 15678,
      description: 'Warehouses, factories',
      color: 'orange',
      trend: '+15%'
    },
    {
      id: 'land',
      name: 'Land & Plots',
      icon: Trees,
      count: 32145,
      description: 'Land for development',
      color: 'green',
      trend: '+10%'
    },
    {
      id: 'agricultural',
      name: 'Agricultural',
      icon: Trees,
      count: 8923,
      description: 'Farms, agricultural land',
      color: 'emerald',
      trend: '+6%'
    },
    {
      id: 'luxury',
      name: 'Luxury',
      icon: Star,
      count: 12456,
      description: 'Premium properties',
      color: 'yellow',
      trend: '+18%'
    },
    {
      id: 'rental',
      name: 'Short-term Rental',
      icon: Calendar,
      count: 28789,
      description: 'Holiday homes, vacation rentals',
      color: 'pink',
      trend: '+22%'
    },
    {
      id: 'investment',
      name: 'Investment',
      icon: TrendingUp,
      count: 19345,
      description: 'High-yield properties',
      color: 'indigo',
      trend: '+14%'
    },
    {
      id: 'new-development',
      name: 'New Development',
      icon: Building,
      count: 8234,
      description: 'Off-plan properties',
      color: 'teal',
      trend: '+9%'
    },
    {
      id: 'retail',
      name: 'Retail',
      icon: Store,
      count: 11234,
      description: 'Shops, showrooms',
      color: 'red',
      trend: '+7%'
    },
    {
      id: 'offices',
      name: 'Offices',
      icon: Briefcase,
      count: 16789,
      description: 'Business spaces',
      color: 'cyan',
      trend: '+11%'
    },
    {
      id: 'hotels',
      name: 'Hotels',
      icon: Hotel,
      count: 5678,
      description: 'Hospitality properties',
      color: 'amber',
      trend: '+13%'
    }
  ];

  const regions = [
    {
      id: 'europe',
      name: 'Europe',
      count: 45234,
      color: 'blue',
      countries: 44
    },
    {
      id: 'asia',
      name: 'Asia',
      count: 92123,
      color: 'red',
      countries: 48
    },
    {
      id: 'north-america',
      name: 'North America',
      count: 78456,
      color: 'green',
      countries: 23
    },
    {
      id: 'middle-east',
      name: 'Middle East',
      count: 28945,
      color: 'orange',
      countries: 17
    },
    {
      id: 'africa',
      name: 'Africa',
      count: 15678,
      color: 'purple',
      countries: 54
    },
    {
      id: 'south-america',
      name: 'South America',
      count: 22345,
      color: 'teal',
      countries: 12
    },
    {
      id: 'oceania',
      name: 'Oceania',
      count: 18234,
      color: 'indigo',
      countries: 14
    }
  ];

  const purposes = [
    {
      id: 'buy',
      name: 'Buy',
      icon: DollarSign,
      count: 156789,
      description: 'Purchase properties',
      color: 'blue'
    },
    {
      id: 'rent',
      name: 'Rent',
      icon: Calendar,
      count: 89456,
      description: 'Rental properties',
      color: 'green'
    },
    {
      id: 'lease',
      name: 'Lease',
      icon: Store,
      count: 45234,
      description: 'Long-term leases',
      color: 'purple'
    },
    {
      id: 'invest',
      name: 'Invest',
      icon: TrendingUp,
      count: 34567,
      description: 'Investment opportunities',
      color: 'orange'
    }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
    onCategorySelect(category.id);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Property Types Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Property Types
            </h2>
            <p className="text-lg text-gray-600">
              Explore our comprehensive range of property categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category)}
                className={`relative bg-white rounded-xl p-6 cursor-pointer border-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Trend Badge */}
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {category.trend}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                
                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {category.count.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">properties</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Regions Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Browse by Region
            </h2>
            <p className="text-lg text-gray-600">
              Find properties in your preferred location
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {regions.map((region, index) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategorySelect(region.id)}
                className="bg-white rounded-xl p-6 cursor-pointer border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <MapPin className={`w-6 h-6 text-${region.color}-600`} />
                  <span className="text-xs font-medium text-gray-500">
                    {region.countries} countries
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{region.name}</h3>
                
                <div className="text-2xl font-bold text-gray-900">
                  {region.count.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">properties</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Purpose Section */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What are you looking for?
            </h2>
            <p className="text-lg text-gray-600">
              Choose your property purpose to find the perfect match
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {purposes.map((purpose, index) => (
              <motion.div
                key={purpose.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategorySelect(purpose.id)}
                className={`bg-gradient-to-br from-${purpose.color}-50 to-${purpose.color}-100 rounded-xl p-6 cursor-pointer border-2 border-${purpose.color}-200 hover:border-${purpose.color}-300 hover:shadow-lg transition-all duration-300`}
              >
                <div className={`w-12 h-12 bg-${purpose.color}-600 rounded-lg flex items-center justify-center mb-4`}>
                  <purpose.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{purpose.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{purpose.description}</p>
                
                <div className="text-2xl font-bold text-gray-900">
                  {purpose.count.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">properties</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCategoryGrid;
