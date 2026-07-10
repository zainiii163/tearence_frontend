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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch real activity data from API
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        // Note: This endpoint should be added to backend to return real activity data
        // For now, this component shows no data until backend endpoint is available
        setActivities([]);
      } catch (err) {
        setError(err.message);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

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

  // Add new activities periodically (disabled until backend endpoint is available)
  useEffect(() => {
    if (isPaused) return;
    // TODO: Replace with real API call when backend endpoint is available
    return () => {};
  }, [isPaused]);

  const handleRefresh = () => {
    // TODO: Replace with real API call when backend endpoint is available
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
    <div className="bg-gradient-to-r from-blue-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Live Travel Activity
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            See what's happening across the WorldwideAdverts travel community in real-time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Live Activity Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
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
          <div className="space-y-4">
            {/* Platform Stats */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Platform Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Countries</span>
                  </div>
                  <span className="font-semibold text-gray-900">-</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Active Users</span>
                  </div>
                  <span className="font-semibold text-gray-900">-</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Total Views</span>
                  </div>
                  <span className="font-semibold text-gray-900">-</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hotel className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">Listings</span>
                  </div>
                  <span className="font-semibold text-gray-900">-</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Statistics endpoint to be implemented</p>
            </div>

            {/* Trending Destinations */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Trending Destinations</h3>
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

          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelActivityFeed;
