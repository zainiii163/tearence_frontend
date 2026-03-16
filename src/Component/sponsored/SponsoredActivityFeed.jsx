import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Eye, Globe, TrendingUp, Users, Crown, Zap, MapPin, ArrowRight, Pause, Play, Star, Heart } from 'lucide-react';
import SponsoredAdvertsService from '../../services/SponsoredAdvertsService';

const SponsoredActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
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
      targetCountry: apiActivity.advert_country ? `${apiActivity.advert_country}` : '� Global',
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
        const response = await SponsoredAdvertsService.homepage.getLiveActivity({ limit: 20 });
        
        if (response.success) {
          const transformedActivities = response.data.map(transformApiActivity);
          setActivities(transformedActivities);
          
          // Extract trending topics from activity data
          const topics = extractTrendingTopics(response.data);
          setTrendingTopics(topics);
        } else {
          setError('Failed to load activity data');
        }
      } catch (err) {
        console.error('Error loading activity data:', err);
        setError('Failed to load activity data');
      } finally {
        setLoading(false);
      }
    };

    loadActivityData();
  }, []);

  // Extract trending topics from activity data
  const extractTrendingTopics = (activityData) => {
    const topicCounts = {};
    
    activityData.forEach(activity => {
      if (activity.advert_title) {
        const words = activity.advert_title.split(' ');
        words.forEach(word => {
          if (word.length > 3) {
            topicCounts[word] = (topicCounts[word] || 0) + 1;
          }
        });
      }
    });
    
    // Convert to array and sort by count
    const topics = Object.entries(topicCounts)
      .map(([topic, count]) => ({
        topic,
        count,
        growth: `+${Math.floor(Math.random() * 30)}%`,
        icon: getTopicIcon(topic)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    
    return topics;
  };

  // Get icon for topic based on keywords
  const getTopicIcon = (topic) => {
    const icons = {
      'property': '🏠',
      'luxury': '�',
      'vehicle': '🚗',
      'car': '🚗',
      'job': '💼',
      'service': '💼',
      'travel': '✈️',
      'course': '🎓',
      'education': '🎓',
      'smart': '🏡',
      'home': '🏡',
      'electronic': '📱'
    };
    
    const lowerTopic = topic.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
      if (lowerTopic.includes(key)) {
        return icon;
      }
    }
    
    return '📋';
  };

  // Auto-update with real data
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(async () => {
      try {
        const response = await SponsoredAdvertsService.homepage.getLiveActivity({ limit: 5 });
        if (response.success) {
          const newActivities = response.data.map(transformApiActivity);
          setActivities(prev => [...newActivities, ...prev.slice(0, 7)]);
          
          // Update trending topics
          const topics = extractTrendingTopics(response.data);
          setTrendingTopics(topics);
        }
      } catch (err) {
        console.error('Error updating activity feed:', err);
      }
    }, 4000); // Update every 4 seconds

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
              <AnimatePresence mode="wait">
                {activities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={activity.id}
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

          {/* Trending Topics */}
          <div className="border-t border-gray-100 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Trending Topics</h4>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, index) => (
                <motion.div
                  key={topic.topic}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <span>{topic.icon}</span>
                  <span className="font-medium text-gray-900">{topic.topic}</span>
                  <span className="text-xs text-gray-600">{topic.count}</span>
                  <span className="text-xs text-green-600 font-medium">{topic.growth}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
            <h4 className="font-medium text-gray-900 mb-3">Platform Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Globe className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-lg font-bold text-gray-900">142</span>
                </div>
                <p className="text-xs text-gray-600">Countries</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-lg font-bold text-gray-900">45.2K</span>
                </div>
                <p className="text-xs text-gray-600">Active Users</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Eye className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-lg font-bold text-gray-900">12.5M</span>
                </div>
                <p className="text-xs text-gray-600">Total Views</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Crown className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-lg font-bold text-gray-900">12,456</span>
                </div>
                <p className="text-xs text-gray-600">Sponsored Ads</p>
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
