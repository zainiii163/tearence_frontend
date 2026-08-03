import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, Eye, Heart, TrendingUp, MapPin, Clock, Globe, Star, Zap } from 'lucide-react';
import { getVehicleStatistics } from '../../services/vehiclesAPI';

const VehicleActivityFeed = ({ activities }) => {
  const [currentActivities, setCurrentActivities] = useState(activities || []);
  const [isLive, setIsLive] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load real statistics from API
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const stats = await getVehicleStatistics();
        setStatistics(stats.data || stats);
      } catch (error) {
        console.error('Error loading vehicle statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStatistics();
  }, []);

  // Use passed activities or empty array
  useEffect(() => {
    if (activities) {
      setCurrentActivities(activities);
    }
  }, [activities]);

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
            <p className="text-sm text-gray-600">Real-time vehicle updates</p>
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
              <span>{loading ? '-' : (statistics?.countries_count || statistics?.countries || 0)}</span>
            </div>
            <div className="text-xs text-gray-600">Countries</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-900 mb-1">
              <Users className="w-4 h-4 text-green-500" />
              <span>{loading ? '-' : (statistics?.active_users || statistics?.users || 0)}</span>
            </div>
            <div className="text-xs text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-900 mb-1">
              <Eye className="w-4 h-4 text-purple-500" />
              <span>{loading ? '-' : (statistics?.total_views || statistics?.views || 0)}</span>
            </div>
            <div className="text-xs text-gray-600">Total Views</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-900 mb-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>{loading ? '-' : (statistics?.total_vehicles || statistics?.listings || 0)}</span>
            </div>
            <div className="text-xs text-gray-600">Total Vehicles</div>
          </div>
        </div>
      </div>

      {/* Trending Topics - Only show if we have real data */}
      {statistics?.trending_searches && statistics.trending_searches.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Trending Searches</h4>
          <div className="flex flex-wrap gap-2">
            {statistics.trending_searches.slice(0, 6).map((topic, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleActivityFeed;
