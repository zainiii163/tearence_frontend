import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Eye, Heart, TrendingUp, Globe, Users, Star, Zap } from 'lucide-react';
import { promotedAdvertsAPI } from '../../services/promotedAdvertsAPI';

const PromotedActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    if (!isPaused) {
      const interval = setInterval(loadData, 15000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const loadData = async () => {
    try {
      const [activityData, statsData, trendingData] = await Promise.all([
        promotedAdvertsAPI.getLiveActivity(),
        promotedAdvertsAPI.getStatistics(),
        promotedAdvertsAPI.getTrendingCategories(),
      ]);

      if (activityData.success && activityData.data) {
        setActivities(activityData.data);
      }
      if (statsData.success && statsData.data) {
        setStatistics(statsData.data);
      }
      if (trendingData.success && trendingData.data) {
        setTrendingCategories(trendingData.data);
      }
    } catch (err) {
      console.error('Failed to load activity data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformStats = () => {
    if (!statistics) return [];
    return [
      { icon: Globe, label: 'Countries', value: statistics.total_countries || 0, color: 'text-blue-500' },
      { icon: Users, label: 'Active Users', value: statistics.active_users || 0, color: 'text-green-500' },
      { icon: Eye, label: 'Total Views', value: statistics.total_views || 0, color: 'text-purple-500' },
      { icon: Star, label: 'Total Saves', value: statistics.total_saves || 0, color: 'text-orange-500' }
    ];
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'view': return Eye;
      case 'new': return Zap;
      case 'save': return Heart;
      case 'trending': return TrendingUp;
      default: return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'view': return 'text-blue-500';
      case 'new': return 'text-orange-500';
      case 'save': return 'text-red-500';
      case 'trending': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendingTopics = () => {
    return trendingCategories.map(cat => cat.name).slice(0, 6);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {getPlatformStats().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${stat.color}`} />
                <div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                  <div className="text-sm font-semibold text-gray-900">{stat.value.toLocaleString()}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`p-2 bg-white rounded-full ${getActivityColor(activity.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {activities.length === 0 && (
          <div className="text-center text-gray-500 py-4">No recent activity</div>
        )}
      </div>

      {/* Trending Topics */}
      {trendingCategories.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Trending Topics</h4>
          <div className="flex flex-wrap gap-2">
            {getTrendingTopics().map((topic, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                <TrendingUp className="h-3 w-3" />
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotedActivityFeed;
