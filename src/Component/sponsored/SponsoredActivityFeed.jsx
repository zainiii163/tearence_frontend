import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Eye, Globe, TrendingUp, Users, Crown, Zap, MapPin, ArrowRight, Pause, Play, Star, Heart } from 'lucide-react';
import sponsoredAdvertsAPI from '../../api/sponsoredAdvertsAPI';

const SponsoredActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  // Map API activity types to icons and colors
  const getActivityMapping = (type) => {
    const mappings = {
      'inquiry': { icon: Users, color: 'purple', action: 'contacted seller about' },
      'view': { icon: Eye, color: 'blue', action: 'viewed' },
      'new_advert': { icon: Crown, color: 'yellow', action: 'posted new sponsored' },
      'trending': { icon: TrendingUp, color: 'green', action: 'trending sponsored' },
      'contact': { icon: Users, color: 'purple', action: 'contacted seller about' },
      'upgrade': { icon: Zap, color: 'orange', action: 'upgraded to sponsored' },
      'sale': { icon: Star, color: 'green', action: 'reported sale from' },
      'favorite': { icon: Heart, color: 'red', action: 'saved sponsored' }
    };
    return mappings[type] || { icon: Activity, color: 'gray', action: 'activity on' };
  };

  // Generate unique key for activity
  const getActivityKey = (activity, index) => {
    const uniqueParts = [
      activity.id || `idx-${index}`,
      activity.type || 'unknown',
      activity.user || 'anonymous',
      activity.target || 'no-target',
      activity.time || Date.now(),
      Math.random().toString(36).substr(2, 9) // Add random component for uniqueness
    ];
    return `activity-${uniqueParts.join('-')}`;
  };

  // Transform API data to component format
  const transformApiActivity = (apiActivity) => {
    const mapping = getActivityMapping(apiActivity.type);
    return {
      id: apiActivity.id,
      type: apiActivity.type,
      user: apiActivity.user_name || 'Anonymous User',
      userCountry: apiActivity.user_location ? `${apiActivity.user_location}` : '🌍 Global',
      action: mapping.action,
      target: apiActivity.advert_title || 'Sponsored Advert',
      targetCountry: apiActivity.advert_country ? `${apiActivity.advert_country}` : '🌍 Global',
      targetCity: apiActivity.advert_city || 'Worldwide',
      time: apiActivity.created_at || 'Just now',
      icon: mapping.icon,
      color: mapping.color
    };
  };

  // Load real activity data from API
  useEffect(() => {
    const loadActivityData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [activityRes, statsRes] = await Promise.allSettled([
          sponsoredAdvertsAPI.getSponsoredAdverts({ per_page: 10, sort_by: 'created_at', sort_order: 'desc' }),
          sponsoredAdvertsAPI.getStatistics()
        ]);
        
        if (activityRes.status === 'fulfilled' && activityRes.value?.success) {
          // Transform sponsored adverts to activity format
          const transformedActivities = activityRes.value.data?.data?.map(advert => ({
            id: advert.id,
            type: 'new_advert',
            user: advert.business_name || advert.seller_name || 'Anonymous',
            user_location: advert.country,
            action: 'posted new sponsored',
            advert_title: advert.title,
            advert_country: advert.country,
            advert_city: advert.city,
            created_at: advert.created_at
          })) || [];
          
          const formattedActivities = transformedActivities.map(transformApiActivity);
          setActivities(formattedActivities);
        }
        
        if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
          setStatistics(statsRes.value.data);
        }
      } catch (err) {
        console.error('Error loading activity data:', err);
        setError('Failed to load activity data');
      } finally {
        setLoading(false);
      }
    };

    loadActivityData();

    // Poll for new activity every 30 seconds
    const interval = setInterval(loadActivityData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-update with real data
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(async () => {
      try {
        const response = await sponsoredAdvertsAPI.getSponsoredAdverts({ per_page: 5, sort_by: 'created_at', sort_order: 'desc' });
        if (response?.success) {
          const transformedActivities = response.data?.data?.map(advert => ({
            id: advert.id,
            type: 'new_advert',
            user: advert.business_name || advert.seller_name || 'Anonymous',
            user_location: advert.country,
            action: 'posted new sponsored',
            advert_title: advert.title,
            advert_country: advert.country,
            advert_city: advert.city,
            created_at: advert.created_at
          })) || [];
          
          const formattedActivities = transformedActivities.map(transformApiActivity);
          setActivities(prev => [...formattedActivities, ...prev.slice(0, 7)]);
        }
      } catch (err) {
        console.error('Error updating activity feed:', err);
      }
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const getActivityColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      red: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[color] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
              <p className="text-sm text-gray-600">Real-time sponsored advert activity</p>
            </div>
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2 rounded-lg transition-colors ${
              isPaused 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-gray-400' : 'bg-green-500 animate-pulse'}`}></div>
          <span className="text-sm text-gray-600">
            {isPaused ? 'Feed paused' : 'Live updates'}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading activity data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Activity List */}
      {!loading && !error && (
        <>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {/* Activities */}
            <div className="max-h-96 overflow-y-auto">
              <AnimatePresence>
                {activities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={getActivityKey(activity, index)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-3 rounded-lg border ${getActivityColor(activity.color)} hover:shadow-sm transition-all`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.color)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{activity.user}</span>
                            <span className="text-xs">{activity.userCountry}</span>
                            <span className="text-xs opacity-75">•</span>
                            <span className="text-xs opacity-75">{activity.time}</span>
                          </div>
                          <p className="text-sm">
                            {activity.action} <span className="font-medium">{activity.target}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                            <MapPin className="w-3 h-3" />
                            <span>{activity.targetCountry} {activity.targetCity}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
            <h4 className="font-medium text-gray-900 mb-3">Platform Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Globe className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-lg font-bold text-gray-900">
                    {statistics?.top_countries?.length || '—'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Countries</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-lg font-bold text-gray-900">
                    {statistics ? Number(statistics.total_active || 0).toLocaleString() : '—'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Active Ads</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Eye className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-lg font-bold text-gray-900">
                    {statistics ? Number(statistics.total_views || 0).toLocaleString() : '—'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Total Views</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Crown className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-lg font-bold text-gray-900">
                    {statistics ? Number(statistics.total_saves || 0).toLocaleString() : '—'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Total Saves</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-4">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              View All Activity
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SponsoredActivityFeed;
