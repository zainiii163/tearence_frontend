import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiTrendingUp, FiMapPin, FiHeart, FiEye, FiPause, FiPlay, FiUser, FiShoppingBag, FiClock } from 'react-icons/fi';
import { buysellAPI } from '../../api/buysell';

const BuySellActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    activeUsers: 0,
    countries: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  const generateActivity = () => {
    const activities = [
      { type: 'item_posted', user: 'John D.', item: 'iPhone 14 Pro', location: 'New York', action: 'posted a new item' },
      { type: 'item_sold', user: 'Sarah M.', item: 'Vintage Camera', location: 'London', action: 'sold an item' },
      { type: 'item_liked', user: 'Mike R.', item: 'Gaming Console', location: 'Tokyo', action: 'liked an item' },
      { type: 'user_joined', user: 'Emma L.', location: 'Paris', action: 'joined the marketplace' },
      { type: 'item_featured', user: 'Alex K.', item: 'Designer Jacket', location: 'Berlin', action: 'item got featured' },
      { type: 'deal_completed', user: 'Lisa W.', item: 'Mountain Bike', location: 'Sydney', action: 'completed a deal' },
      { type: 'review_left', user: 'David B.', item: 'Laptop Pro', location: 'Toronto', action: 'left a review' },
      { type: 'item_saved', user: 'Nina P.', item: 'Art Collection', location: 'Amsterdam', action: 'saved an item' }
    ];

    return activities[Math.floor(Math.random() * activities.length)];
  };

  useEffect(() => {
    // Fetch platform statistics
    const fetchStats = async () => {
      try {
        const platformStats = await buysellAPI.getPlatformStats();
        setStats(platformStats);
      } catch (error) {
        console.error('Error fetching platform stats:', error);
        // Fallback to default stats
        setStats({
          totalItems: 2500000,
          activeUsers: 850000,
          countries: 142,
          successRate: 98
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Initialize with some activities
    const initialActivities = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      ...generateActivity(),
      timestamp: new Date(Date.now() - Math.random() * 3600000) // Random time within last hour
    }));
    setActivities(initialActivities);

    // Set up interval for new activities
    if (!isPaused) {
      const interval = setInterval(() => {
        const newActivity = {
          id: Date.now(),
          ...generateActivity(),
          timestamp: new Date()
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
      }, 4000); // New activity every 4 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'item_posted': return <FiShoppingBag className="h-4 w-4 text-green-600" />;
      case 'item_sold': return <FiTrendingUp className="h-4 w-4 text-blue-600" />;
      case 'item_liked': return <FiHeart className="h-4 w-4 text-red-500" />;
      case 'user_joined': return <FiUser className="h-4 w-4 text-purple-600" />;
      case 'item_featured': return <FiEye className="h-4 w-4 text-orange-500" />;
      case 'deal_completed': return <FiTrendingUp className="h-4 w-4 text-green-600" />;
      case 'review_left': return <FiActivity className="h-4 w-4 text-indigo-600" />;
      case 'item_saved': return <FiHeart className="h-4 w-4 text-pink-500" />;
      default: return <FiActivity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'item_posted': return 'border-green-200 bg-green-50';
      case 'item_sold': return 'border-blue-200 bg-blue-50';
      case 'item_liked': return 'border-red-200 bg-red-50';
      case 'user_joined': return 'border-purple-200 bg-purple-50';
      case 'item_featured': return 'border-orange-200 bg-orange-50';
      case 'deal_completed': return 'border-green-200 bg-green-50';
      case 'review_left': return 'border-indigo-200 bg-indigo-50';
      case 'item_saved': return 'border-pink-200 bg-pink-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiActivity className="h-6 w-6 text-green-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-600 rounded-full">
              <div className="w-full h-full bg-green-600 rounded-full animate-ping" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          {isPaused ? <FiPlay className="h-4 w-4" /> : <FiPause className="h-4 w-4" />}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700">
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mx-auto"></div>
            ) : (
              `${(stats.totalItems / 1000000).toFixed(1)}M+`
            )}
          </div>
          <div className="text-sm text-green-600">Total Items</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700">
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mx-auto"></div>
            ) : (
              `${(stats.activeUsers / 1000).toFixed(0)}K+`
            )}
          </div>
          <div className="text-sm text-green-600">Active Users</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700">
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mx-auto"></div>
            ) : (
              stats.countries
            )}
          </div>
          <div className="text-sm text-green-600">Countries</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700">
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mx-auto"></div>
            ) : (
              `${stats.successRate}%`
            )}
          </div>
          <div className="text-sm text-green-600">Success Rate</div>
        </div>
      </div>

      {/* Activities List */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 p-4 border-b border-gray-100 last:border-b-0 ${getActivityColor(activity.type)} rounded-lg mx-4 mb-2`}
            >
              {/* Activity Icon */}
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{activity.user}</span>
                  <span className="text-gray-600 text-sm">{activity.action}</span>
                </div>
                
                {activity.item && (
                  <div className="text-green-600 font-medium text-sm mb-1">
                    "{activity.item}"
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FiMapPin className="h-3 w-3" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock className="h-3 w-3" />
                    <span>{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 text-center">
        <p className="text-sm text-gray-600">
          {isPaused ? 'Activity feed paused' : 'Live updates every 4 seconds'}
        </p>
      </div>
    </div>
  );
};

export default BuySellActivityFeed;
