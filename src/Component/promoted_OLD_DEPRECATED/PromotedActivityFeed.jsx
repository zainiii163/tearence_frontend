import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, MapPin, TrendingUp, Clock, User, Globe, Star, Activity } from 'lucide-react';

const PromotedActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isLive, setIsLive] = useState(true);

  // Sample live activities
  const sampleActivities = [
    {
      id: 1,
      type: 'view',
      message: 'A user from Spain viewed a promoted advert in London',
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      timestamp: 'Just now',
      location: 'Spain → London, UK',
      advertTitle: 'Luxury Apartment in Mayfair'
    },
    {
      id: 2,
      type: 'new',
      message: 'New promoted advert added in Dubai',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      timestamp: '2 minutes ago',
      location: 'Dubai, UAE',
      advertTitle: 'Beachfront Villa with Private Pool'
    },
    {
      id: 3,
      type: 'save',
      message: 'A car in Manchester just received 12 saves',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      timestamp: '5 minutes ago',
      location: 'Manchester, UK',
      advertTitle: '2023 Porsche 911 Turbo'
    },
    {
      id: 4,
      type: 'trending',
      message: 'Property listing trending in New York',
      icon: Star,
      color: 'text-amber-500',
      bgColor: 'bg-amber-100',
      timestamp: '8 minutes ago',
      location: 'New York, USA',
      advertTitle: 'Penthouse overlooking Central Park'
    },
    {
      id: 5,
      type: 'view',
      message: 'Multiple users viewing electronics from Tokyo',
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      timestamp: '12 minutes ago',
      location: 'Tokyo, Japan',
      advertTitle: 'Latest MacBook Pro 16"'
    },
    {
      id: 6,
      type: 'new',
      message: 'Business opportunity promoted in Singapore',
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      timestamp: '15 minutes ago',
      location: 'Singapore',
      advertTitle: 'Profitable Tech Startup'
    },
    {
      id: 7,
      type: 'save',
      message: 'Fashion collection getting popular in Paris',
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      timestamp: '18 minutes ago',
      location: 'Paris, France',
      advertTitle: 'Designer Handbag Collection'
    },
    {
      id: 8,
      type: 'trending',
      message: 'Travel package trending globally',
      icon: Star,
      color: 'text-amber-500',
      bgColor: 'bg-amber-100',
      timestamp: '22 minutes ago',
      location: 'Multiple Locations',
      advertTitle: 'Luxury Maldives Resort Package'
    }
  ];

  useEffect(() => {
    // Initialize with sample activities
    setActivities(sampleActivities);

    // Simulate live updates
    if (isLive) {
      const interval = setInterval(() => {
        const newActivity = {
          id: Date.now(),
          type: ['view', 'new', 'save', 'trending'][Math.floor(Math.random() * 4)],
          message: `New activity detected ${Math.floor(Math.random() * 60) + 1} minutes ago`,
          icon: [Eye, TrendingUp, Heart, Star][Math.floor(Math.random() * 4)],
          color: ['text-blue-500', 'text-green-500', 'text-red-500', 'text-amber-500'][Math.floor(Math.random() * 4)],
          bgColor: ['bg-blue-100', 'bg-green-100', 'bg-red-100', 'bg-amber-100'][Math.floor(Math.random() * 4)],
          timestamp: 'Just now',
          location: ['Global', 'Europe', 'Asia', 'Americas'][Math.floor(Math.random() * 4)],
          advertTitle: 'New promoted listing'
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 7)]);
      }, 10000); // Add new activity every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const getActivityIcon = (activity) => {
    const Icon = activity.icon;
    return <Icon className="w-4 h-4" />;
  };

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="w-5 h-5 text-amber-600" />
              {isLive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <h3 className="font-semibold text-gray-900">Live Activity Feed</h3>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isLive ? 'bg-amber-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isLive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Real-time updates from promoted adverts worldwide
        </p>
      </div>

      {/* Activity List */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-4 space-y-3"
          >
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  // Navigate to advert or location
                  console.log('Activity clicked:', activity);
                }}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center ${activity.color}`}>
                  {getActivityIcon(activity)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {activity.message}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{activity.timestamp}</span>
                    {activity.location && (
                      <>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span>{activity.location}</span>
                      </>
                    )}
                  </div>
                  {activity.advertTitle && (
                    <p className="text-xs text-amber-600 font-medium mt-1 truncate">
                      {activity.advertTitle}
                    </p>
                  )}
                </div>

                {/* New indicator */}
                {activity.timestamp === 'Just now' && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600">
            {activities.length} recent activities
          </div>
          <button
            onClick={() => setActivities([])}
            className="text-xs text-amber-600 hover:text-amber-700 font-medium"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-amber-600">
              {Math.floor(Math.random() * 1000) + 500}
            </div>
            <div className="text-xs text-gray-600">Active Views</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              {Math.floor(Math.random() * 100) + 50}
            </div>
            <div className="text-xs text-gray-600">New Saves</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotedActivityFeed;
