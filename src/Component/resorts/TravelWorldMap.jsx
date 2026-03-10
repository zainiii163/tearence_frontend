import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TrendingUp, Hotel, Car, Users, DollarSign } from 'lucide-react';

const TravelWorldMap = ({ onRegionSelect, selectedRegion }) => {
  const regions = [
    {
      id: 'europe',
      name: 'Europe',
      position: { top: '30%', left: '45%' },
      resorts: 3421,
      avgPrice: 120,
      popularDestinations: ['Paris', 'Rome', 'Barcelona', 'Amsterdam'],
      transportServices: 892,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'north-america',
      name: 'North America',
      position: { top: '35%', left: '20%' },
      resorts: 2847,
      avgPrice: 150,
      popularDestinations: ['New York', 'Los Angeles', 'Miami', 'Las Vegas'],
      transportServices: 1234,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'south-america',
      name: 'South America',
      position: { top: '65%', left: '30%' },
      resorts: 1523,
      avgPrice: 80,
      popularDestinations: ['Rio de Janeiro', 'Buenos Aires', 'Lima', 'Medellin'],
      transportServices: 567,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'asia',
      name: 'Asia',
      position: { top: '40%', left: '70%' },
      resorts: 4567,
      avgPrice: 60,
      popularDestinations: ['Tokyo', 'Bangkok', 'Singapore', 'Dubai'],
      transportServices: 1892,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'africa',
      name: 'Africa',
      position: { top: '55%', left: '50%' },
      resorts: 892,
      avgPrice: 70,
      popularDestinations: ['Cape Town', 'Marrakech', 'Cairo', 'Nairobi'],
      transportServices: 234,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'middle-east',
      name: 'Middle East',
      position: { top: '45%', left: '60%' },
      resorts: 1234,
      avgPrice: 140,
      popularDestinations: ['Dubai', 'Abu Dhabi', 'Doha', 'Tel Aviv'],
      transportServices: 456,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'oceania',
      name: 'Oceania',
      position: { top: '75%', left: '80%' },
      resorts: 678,
      avgPrice: 130,
      popularDestinations: ['Sydney', 'Melbourne', 'Auckland', 'Bali'],
      transportServices: 189,
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const [hoveredRegion, setHoveredRegion] = useState(null);

  const handleRegionClick = (region) => {
    onRegionSelect(region.id);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Travel Destinations Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on any region to discover resorts, hotels, and transport services in that area
          </p>
        </motion.div>

        {/* World Map Container */}
        <div className="relative bg-gradient-to-b from-blue-100 to-blue-50 rounded-2xl p-8 shadow-xl">
          {/* Simple World Map Background */}
          <div className="relative h-96 bg-gradient-to-b from-blue-200/30 to-blue-100/30 rounded-xl overflow-hidden">
            {/* Map Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full bg-[url('data:image/svg+xml,%3Csvg width=%2740%27 height=%2740%27 viewBox=%270 0 40 40%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27%236366f1%27 fill-opacity=%270.3%27%3E%3Cpath d=%27M0 0h40v40H0z%27 fill=%27none%27/%3E%3Cpath d=%27M0 0h40v1H0zM0 39h40v1H0zM0 0h1v40H0zM39 0h1v40H39z%27/%3E%3C/g%3E%3C/svg%3E')]"></div>
            </div>

            {/* Region Markers */}
            {regions.map((region) => (
              <motion.div
                key={region.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ top: region.position.top, left: region.position.left }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * regions.indexOf(region) }}
                viewport={{ once: true }}
              >
                <motion.button
                  onClick={() => handleRegionClick(region)}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${region.color} shadow-lg flex items-center justify-center text-white font-bold text-xs transition-all duration-300 ${
                    selectedRegion === region.id ? 'ring-4 ring-offset-2 ring-blue-400' : ''
                  }`}
                >
                  <MapPin className="w-6 h-6" />
                  
                  {/* Pulse Animation for Selected Region */}
                  {selectedRegion === region.id && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-blue-400 opacity-30"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>

                {/* Region Name */}
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded shadow">
                    {region.name}
                  </span>
                </div>

                {/* Hover Tooltip */}
                {hoveredRegion === region.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 z-10 min-w-max"
                  >
                    <div className="text-sm space-y-2">
                      <div className="font-semibold text-gray-900">{region.name}</div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Hotel className="w-4 h-4" />
                        <span>{region.resorts.toLocaleString()} resorts</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Car className="w-4 h-4" />
                        <span>{region.transportServices} transport services</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>Avg ${region.avgPrice}/night</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Popular destinations:</div>
                        <div className="flex flex-wrap gap-1">
                          {region.popularDestinations.slice(0, 3).map((dest, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {dest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow">
              <div className="text-xs font-semibold text-gray-700 mb-2">Quick Stats</div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <div className="w-3 h-3 rounded bg-blue-500"></div>
                  <span>Click regions to explore</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <div className="w-3 h-3 rounded bg-green-500"></div>
                  <span>View resorts & services</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Region Details */}
        {selectedRegion && (() => {
          const region = regions.find(r => r.id === selectedRegion);
          if (!region) return null;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{region.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{region.resorts.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Resorts & Hotels</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{region.transportServices}</div>
                      <div className="text-sm text-gray-600">Transport Services</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">${region.avgPrice}</div>
                      <div className="text-sm text-gray-600">Avg/Night</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{region.popularDestinations.length}</div>
                      <div className="text-sm text-gray-600">Top Destinations</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-semibold text-gray-700">Popular Destinations:</div>
                  <div className="flex flex-wrap gap-2">
                    {region.popularDestinations.map((dest, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {dest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Global Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <Hotel className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">15,234</div>
            <div className="text-sm text-gray-600">Total Resorts</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <Car className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">5,464</div>
            <div className="text-sm text-gray-600">Transport Services</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">142</div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-lg">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">$105</div>
            <div className="text-sm text-gray-600">Avg Price/Night</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TravelWorldMap;
