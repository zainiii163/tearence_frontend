import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  MapPin, 
  Eye, 
  Heart, 
  Star, 
  TrendingUp, 
  Globe, 
  Users,
  Hotel,
  Car,
  Calendar,
  Pause,
  Play,
  RefreshCw
} from 'lucide-react';

const TravelActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const generateActivity = () => {
    const activities = [
      {
        id: Date.now() + Math.random(),
        type: 'view',
        user: {
          name: 'Sarah Johnson',
          country: 'Germany',
          flag: '🇩🇪'
        },
        action: 'viewed',
        target: {
          name: 'Luxury Beach Resort Paradise',
          location: 'Maldives',
          type: 'resort'
        },
        timestamp: new Date()
      },
      {
        id: Date.now() + Math.random(),
        type: 'listing',
        user: {
          name: 'Paradise Resorts Group',
          country: 'Maldives',
          flag: '🇲🇻'
        },
        action: 'added a new listing',
        target: {
          name: 'Overwater Villa Suite',
          location: 'Maldives',
          type: 'villa'
        },
        timestamp: new Date()
      },
      {
        id: Date.now() + Math.random(),
        type: 'booking',
        user: {
          name: 'Michael Chen',
          country: 'United States',
          flag: '🇺🇸'
        },
        action: 'booked',
        target: {
          name: 'Airport Transfer Service',
          location: 'London Heathrow',
          type: 'transport'
        },
        timestamp: new Date()
      },
      {
        id: Date.now() + Math.random(),
        type: 'review',
        user: {
          name: 'Emma Wilson',
          country: 'United Kingdom',
          flag: '🇬🇧'
        },
        action: 'reviewed',
        target: {
          name: 'Boutique Hotel in Historic Center',
          location: 'Rome, Italy',
          type: 'hotel',
          rating: 5
        },
        timestamp: new Date()
      },
      {
        id: Date.now() + Math.random(),
        type: 'save',
        user: {
          name: 'Carlos Rodriguez',
          country: 'Spain',
          flag: '🇪🇸'
        },
        action: 'saved',
        target: {
          name: 'Mountain Retreat Lodge',
          location: 'Swiss Alps',
          type: 'lodge'
        },
        timestamp: new Date()
      },
      {
        id: Date.now() + Math.random(),
        type: 'promotion',
        user: {
          name: 'Dubai Luxury Car Hire',
          country: 'UAE',
          flag: '🇦🇪'
        },
        action: 'upgraded to sponsored',
        target: {
          name: 'Car Hire - Luxury Vehicles',
          location: 'Dubai, UAE',
          type: 'transport'
        },
        timestamp: new Date()
      }
    ];

    return activities[Math.floor(Math.random() * activities.length)];
  };

  const getActivityIcon = (type) => {
    const icons = {
      view: <Eye className="w-4 h-4" />,
      listing: <Hotel className="w-4 h-4" />,
      booking: <Calendar className="w-4 h-4" />,
      review: <Star className="w-4 h-4" />,
      save: <Heart className="w-4 h-4" />,
      promotion: <TrendingUp className="w-4 h-4" />
    };
    return icons[type] || <Activity className="w-4 h-4" />;
  };

  const getActivityColor = (type) => {
    const colors = {
      view: 'text-blue-600 bg-blue-100',
      listing: 'text-green-600 bg-green-100',
      booking: 'text-purple-600 bg-purple-100',
      review: 'text-yellow-600 bg-yellow-100',
      save: 'text-red-600 bg-red-100',
      promotion: 'text-orange-600 bg-orange-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000); // seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // Initialize with some activities
  useEffect(() => {
    const initialActivities = Array.from({ length: 5 }, () => generateActivity());
    setActivities(initialActivities);
  }, []);

  // Add new activities periodically
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivity = generateActivity();
        return [newActivity, ...prev.slice(0, 9)]; // Keep max 10 activities
      });
      setLastUpdate(new Date());
    }, 4000); // Add new activity every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleRefresh = () => {
    const newActivities = Array.from({ length: 3 }, () => generateActivity());
    setActivities([...newActivities, ...activities.slice(0, 7)]);
    setLastUpdate(new Date());
  };

  const trendingDestinations = [
    { name: 'Bali, Indonesia', change: '+12%', hot: true },
    { name: 'Dubai, UAE', change: '+8%', hot: true },
    { name: 'Paris, France', change: '+5%', hot: false },
    { name: 'Tokyo, Japan', change: '+15%', hot: true },
    { name: 'New York, USA', change: '+3%', hot: false }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-teal-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Live Travel Activity
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what's happening across the WorldwideAdverts travel community in real-time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Activity Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Activity className="w-6 h-6 text-blue-600" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white">
                      <div className="w-full h-full bg-green-500 rounded-full animate-ping" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
                  <span className="text-sm text-gray-500">Updated {formatTimestamp(lastUpdate)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>
                  
                  <button
                    onClick={handleRefresh}
                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user.name}</span>
                          <span className="mx-1">{activity.user.flag}</span>
                          <span className="text-gray-600">{activity.action}</span>
                          <span className="font-medium text-blue-600">{activity.target.name}</span>
                          {activity.target.rating && (
                            <div className="inline-flex items-center ml-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs ml-1">{activity.target.rating}</span>
                            </div>
                          )}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{activity.target.location}</span>
                          <span>•</span>
                          <span>{formatTimestamp(activity.timestamp)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Stats & Trending */}
          <div className="space-y-6">
            {/* Platform Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Countries</span>
                  </div>
                  <span className="font-semibold text-gray-900">142</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Active Users</span>
                  </div>
                  <span className="font-semibold text-gray-900">45.2K</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Total Views</span>
                  </div>
                  <span className="font-semibold text-gray-900">12.5M</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hotel className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">Listings</span>
                  </div>
                  <span className="font-semibold text-gray-900">15,234</span>
                </div>
              </div>
            </div>

            {/* Trending Destinations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Destinations</h3>
              <div className="space-y-3">
                {trendingDestinations.map((destination, index) => (
                  <div key={destination.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-bold text-gray-400 w-4">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            {destination.name}
                          </span>
                          {destination.hot && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                              🔥 Hot
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{destination.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Join the Community</h3>
              <p className="text-sm text-blue-100 mb-4">
                Start listing your travel services and connect with millions of travelers worldwide.
              </p>
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Post Travel Advert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelActivityFeed;
