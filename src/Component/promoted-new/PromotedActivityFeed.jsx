import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Eye, Heart, TrendingUp, Zap } from 'lucide-react';
import { promotedAdvertsAPI } from '../../services/promotedAdvertsAPI';

/**
 * Clive: keep live activity + trending topics; remove platform counters from public UI.
 */
const PromotedActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [trendingAdverts, setTrendingAdverts] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    if (!isPaused) {
      const interval = setInterval(loadData, 20000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const loadData = async () => {
    try {
      const [activityData, trendingData, topicsData, feedData] = await Promise.all([
        promotedAdvertsAPI.getLiveActivity?.() || Promise.resolve({ success: false }),
        promotedAdvertsAPI.getTrendingCategories?.() || Promise.resolve({ success: false }),
        promotedAdvertsAPI.getTrendingTopics?.() || Promise.resolve({ success: false }),
        promotedAdvertsAPI.getSiteFeed?.({ per_page: 6, page: 1 }) || Promise.resolve({ success: false }),
      ]);

      if (activityData?.success && activityData.data) {
        setActivities(Array.isArray(activityData.data) ? activityData.data : []);
      }
      if (topicsData?.success && Array.isArray(topicsData.data) && topicsData.data.length) {
        setTrendingCategories(topicsData.data);
      } else if (trendingData?.success && trendingData.data) {
        setTrendingCategories(trendingData.data);
      }
      if (feedData?.success) {
        const rows = feedData.data?.data || feedData.data || [];
        setTrendingAdverts(Array.isArray(rows) ? rows.slice(0, 5) : []);
      }
    } catch (err) {
      console.error('Failed to load activity data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'view':
        return Eye;
      case 'new':
        return Zap;
      case 'save':
        return Heart;
      case 'trending':
        return TrendingUp;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'view':
        return 'text-blue-500';
      case 'new':
        return 'text-orange-500';
      case 'save':
        return 'text-red-500';
      case 'trending':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <h3 className="text-base font-semibold text-gray-900">Trending Topics</h3>
          </div>
        </div>
        {trendingCategories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {trendingCategories.slice(0, 8).map((topic, index) => {
              const name = typeof topic === 'string' ? topic : topic.name;
              return (
                <span
                  key={`${name}-${index}`}
                  className="inline-flex items-center gap-1 bg-orange-50 text-orange-800 border border-orange-100 px-2.5 py-1 rounded-full text-xs font-medium"
                >
                  <TrendingUp className="h-3 w-3" />
                  {name}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Trending topics will appear as promoted ads go live.</p>
        )}

        {trendingAdverts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Trending Adverts</h4>
            <ul className="space-y-2">
              {trendingAdverts.map((ad) => (
                <li key={ad.id}>
                  <a
                    href={ad.href || `/promoted-adverts/${ad.slug || ad.id}`}
                    className="block text-sm text-gray-800 hover:text-orange-600 truncate"
                  >
                    {ad.title}
                    {ad.source_label ? (
                      <span className="ml-1 text-xs text-gray-400">· {ad.source_label}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            <h3 className="text-base font-semibold text-gray-900">Live Activity</h3>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <motion.div
                  key={activity.id || index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
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
            <div className="text-center text-gray-500 py-4 text-sm">No recent activity yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotedActivityFeed;
