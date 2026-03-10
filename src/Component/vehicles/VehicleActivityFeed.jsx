import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, Eye, Heart, TrendingUp, MapPin, Clock, Globe, Star, Zap } from 'lucide-react';

const VehicleActivityFeed = ({ activities }) => {
  const [currentActivities, setCurrentActivities] = useState(activities);
  const [isLive, setIsLive] = useState(true);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newActivities = [
        {
          id: Date.now(),
          type: 'view',
          message: `A user from ${getRandomCountry()} viewed a ${getRandomVehicleMake()} in ${getRandomCity()}`,
          timestamp: new Date(),
          icon: Eye,
          color: 'text-blue-500'
        },
        {
          id: Date.now() + 1,
          type: 'save',
          message: `New ${getRandomVehicleType()} added in ${getRandomCity()}`,
          timestamp: new Date(),
          icon: Heart,
          color: 'text-red-500'
        },
        {
          id: Date.now() + 2,
          type: 'trending',
          message: `A ${getRandomVehicleMake()} in ${getRandomCity()} just got ${getRandomNumber()} saves`,
          timestamp: new Date(),
          icon: TrendingUp,
          color: 'text-green-500'
        },
        {
          id: Date.now() + 3,
          type: 'contact',
          message: `Someone contacted a seller about a ${getRandomVehicleMake()}`,
          timestamp: new Date(),
          icon: Users,
          color: 'text-purple-500'
        }
      ];

      const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
      
      setCurrentActivities(prev => {
        const updated = [randomActivity, ...prev].slice(0, 8);
        return updated;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getRandomCountry = () => {
    const countries = ['France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Sweden', 'Poland'];
    return countries[Math.floor(Math.random() * countries.length)];
  };

  const getRandomCity = () => {
    const cities = ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Bristol', 'Leeds', 'Glasgow', 'Edinburgh'];
    return cities[Math.floor(Math.random() * cities.length)];
  };

  const getRandomVehicleMake = () => {
    const makes = ['BMW', 'Mercedes', 'Audi', 'Toyota', 'Honda', 'Ford', 'Volkswagen', 'Nissan'];
    return makes[Math.floor(Math.random() * makes.length)];
  };

  const getRandomVehicleType = () => {
    const types = ['SUV', 'Sedan', 'Hatchback', 'Convertible', 'Van', 'Truck'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 20) + 1;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const getActivityIcon = (activity) => {
    const Icon = activity.icon;
    return <Icon className={`w-4 h-4 ${activity.color}`} />;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Activity className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
            <p className="text-sm text-gray-600">Real-time vehicle marketplace updates</p>
          </div>
        </div>
        
        {/* Live Indicator */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'} ${isLive ? 'animate-pulse' : ''}`}></div>
            <span className={`text-sm font-medium ${isLive ? 'text-green-600' : 'text-gray-500'}`}>
              {isLive ? 'Live' : 'Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        <AnimatePresence>
          {currentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 line-clamp-2">
                  {activity.message}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Platform Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-900 mb-1">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>142</span>
            </div>
            <div className="text-xs text-gray-600">Countries</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-900 mb-1">
              <Users className="w-4 h-4 text-green-500" />
              <span>45.2K</span>
            </div>
            <div className="text-xs text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-900 mb-1">
              <Eye className="w-4 h-4 text-purple-500" />
              <span>12.5M</span>
            </div>
            <div className="text-xs text-gray-600">Monthly Views</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-900 mb-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>8,234</span>
            </div>
            <div className="text-xs text-gray-600">New Today</div>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Trending Searches</h4>
        <div className="flex flex-wrap gap-2">
          {['Electric SUV', 'Luxury Cars', 'Van Hire', 'Classic Cars', 'Family Vehicles', 'Commercial Trucks'].map((topic, index) => (
            <span
              key={topic}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleActivityFeed;
