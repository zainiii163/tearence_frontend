import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  TrendingUp, 
  Building, 
  Eye, 
  Star,
  ExternalLink,
  Globe,
  Navigation,
  Search
} from 'lucide-react';

const PropertyWorldMap = ({ onLocationSelect }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const regions = [
    {
      id: 'europe',
      name: 'Europe',
      position: { top: '30%', left: '45%' },
      stats: { properties: 45234, avgPrice: '$350,000', growth: '+12%' },
      trendingCities: ['London', 'Paris', 'Berlin', 'Madrid', 'Rome'],
      featuredListings: [
        { id: 1, title: 'Luxury Apartment Paris', price: '$850,000', image: 'paris' },
        { id: 2, title: 'Modern Villa Barcelona', price: '$1.2M', image: 'barcelona' }
      ]
    },
    {
      id: 'north-america',
      name: 'North America',
      position: { top: '35%', left: '20%' },
      stats: { properties: 78456, avgPrice: '$425,000', growth: '+8%' },
      trendingCities: ['New York', 'Los Angeles', 'Toronto', 'Miami', 'Vancouver'],
      featuredListings: [
        { id: 3, title: 'Manhattan Penthouse', price: '$2.5M', image: 'newyork' },
        { id: 4, title: 'Beach House Malibu', price: '$3.8M', image: 'malibu' }
      ]
    },
    {
      id: 'asia',
      name: 'Asia',
      position: { top: '40%', left: '70%' },
      stats: { properties: 92123, avgPrice: '$280,000', growth: '+15%' },
      trendingCities: ['Tokyo', 'Singapore', 'Dubai', 'Hong Kong', 'Shanghai'],
      featuredListings: [
        { id: 5, title: 'Tokyo Apartment', price: '$650,000', image: 'tokyo' },
        { id: 6, title: 'Dubai Marina Villa', price: '$1.8M', image: 'dubai' }
      ]
    },
    {
      id: 'middle-east',
      name: 'Middle East',
      position: { top: '45%', left: '55%' },
      stats: { properties: 28945, avgPrice: '$520,000', growth: '+18%' },
      trendingCities: ['Dubai', 'Abu Dhabi', 'Riyadh', 'Doha', 'Tel Aviv'],
      featuredListings: [
        { id: 7, title: 'Dubai Skyline Tower', price: '$2.1M', image: 'dubai2' },
        { id: 8, title: 'Abu Dhabi Mansion', price: '$3.2M', image: 'abudhabi' }
      ]
    },
    {
      id: 'africa',
      name: 'Africa',
      position: { top: '55%', left: '48%' },
      stats: { properties: 15678, avgPrice: '$180,000', growth: '+10%' },
      trendingCities: ['Cape Town', 'Nairobi', 'Lagos', 'Cairo', 'Marrakech'],
      featuredListings: [
        { id: 9, title: 'Cape Town Villa', price: '$450,000', image: 'capetown' },
        { id: 10, title: 'Nairobi Modern Home', price: '$280,000', image: 'nairobi' }
      ]
    },
    {
      id: 'south-america',
      name: 'South America',
      position: { top: '65%', left: '30%' },
      stats: { properties: 22345, avgPrice: '$195,000', growth: '+7%' },
      trendingCities: ['São Paulo', 'Buenos Aires', 'Rio', 'Lima', 'Bogotá'],
      featuredListings: [
        { id: 11, title: 'São Paulo Penthouse', price: '$380,000', image: 'saopaulo' },
        { id: 12, title: 'Rio Beach Apartment', price: '$320,000', image: 'rio' }
      ]
    },
    {
      id: 'oceania',
      name: 'Oceania',
      position: { top: '75%', left: '75%' },
      stats: { properties: 18234, avgPrice: '$485,000', growth: '+6%' },
      trendingCities: ['Sydney', 'Melbourne', 'Auckland', 'Brisbane', 'Perth'],
      featuredListings: [
        { id: 13, title: 'Sydney Harbour View', price: '$1.5M', image: 'sydney' },
        { id: 14, title: 'Melbourne Townhouse', price: '$680,000', image: 'melbourne' }
      ]
    }
  ];

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    onLocationSelect(region.name);
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Explore Properties Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on any region to discover trending cities, average prices, and featured properties
          </p>
        </div>

        {/* World Map Container */}
        <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl p-8 mb-12 overflow-hidden">
          
          {/* Simple World Map Background */}
          <div className="relative h-96 bg-blue-200/20 rounded-xl border-2 border-blue-300/30">
            
            {/* Region Hotspots */}
            {regions.map((region) => (
              <motion.div
                key={region.id}
                style={{
                  position: 'absolute',
                  top: region.position.top,
                  left: region.position.left,
                  transform: 'translate(-50%, -50%)'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRegionClick(region)}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                className="relative cursor-pointer"
              >
                {/* Pulse Animation */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0.3, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full"
                />
                
                {/* Main Pin */}
                <div className="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg" />
                
                {/* Tooltip */}
                {hoveredRegion === region.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10 whitespace-nowrap"
                  >
                    <div className="text-sm font-semibold text-gray-900">{region.name}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {region.stats.properties.toLocaleString()} properties
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      {region.stats.growth} growth
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
            
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <span className="text-gray-700">Click region to explore</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-gray-700">Growth markets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Region Details */}
        {selectedRegion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedRegion.name}</h3>
                <div className="flex items-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {selectedRegion.stats.properties.toLocaleString()} properties
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      {selectedRegion.stats.growth} growth
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Avg price:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedRegion.stats.avgPrice}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onLocationSelect(selectedRegion.name)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                View All Properties
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Trending Cities */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Trending Cities</h4>
                <div className="space-y-2">
                  {selectedRegion.trendingCities.map((city, index) => (
                    <div
                      key={city}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => onLocationSelect(city)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">{city}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Hot
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Listings */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Featured Listings</h4>
                <div className="space-y-3">
                  {selectedRegion.featuredListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{listing.title}</div>
                        <div className="text-sm font-semibold text-blue-600">{listing.price}</div>
                      </div>
                      <Eye className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">142</div>
                <div className="text-sm text-gray-600">Countries Covered</div>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              Connect with property opportunities across every continent
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">+12%</div>
                <div className="text-sm text-gray-600">Average Growth</div>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              Strong market performance across emerging economies
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.8</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              Trusted by millions of property seekers worldwide
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyWorldMap;
