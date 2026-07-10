import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Eye, 
  Heart, 
  MessageCircle, 
  Star, 
  TrendingUp, 
  Globe, 
  Users, 
  Clock,
  MapPin,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { featuredAdvertsAPI } from '../../api/featuredAdverts';

const iconForType = (type) => {
  switch (type) {
    case 'view':    return Eye;
    case 'save':    return Heart;
    case 'contact': return MessageCircle;
    case 'new':     return Star;
    default:        return TrendingUp;
  }
};

const colorForType = (type) => {
  switch (type) {
    case 'view':    return 'text-blue-500';
    case 'save':    return 'text-red-500';
    case 'contact': return 'text-green-500';
    case 'new':     return 'text-yellow-500';
    default:        return 'text-purple-500';
  }
};

const FeaturedActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchActivityAndStats = useCallback(async () => {
    try {
      const [actRes, statsRes, trendRes] = await Promise.allSettled([
        featuredAdvertsAPI.getLiveActivity(),
        featuredAdvertsAPI.getStatistics(),
        featuredAdvertsAPI.getTrendingCategories({ limit: 5 }),
      ]);

      if (actRes.status === 'fulfilled' && actRes.value?.success) {
        const raw = actRes.value.data || [];
        setActivities(raw.map((item, idx) => ({
          id: item.id || idx,
          type: item.type || 'view',
          user: item.user || 'User',
          userLocation: item.user_location || '',
          action: item.action || 'interacted with',
          target: item.target || '',
          targetLocation: item.target_location || '',
          time: item.time || 'recently',
          icon: iconForType(item.type),
          color: colorForType(item.type),
          flag: item.flag || '�',
        })));
      }

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStatistics(statsRes.value.data);
      }

      if (trendRes.status === 'fulfilled' && trendRes.value?.success) {
        setTrendingCategories(trendRes.value.data || []);
      }
    } catch (err) {
      console.error('Failed to load activity feed data:', err);
    } finally {
      setLoadingStats(false);
      setLastUpdate(new Date());
    }
  }, []);

  useEffect(() => {
    fetchActivityAndStats();
  }, [fetchActivityAndStats]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      fetchActivityAndStats();
    }, 15000);
    return () => clearInterval(interval);
  }, [isPaused, fetchActivityAndStats]);

  const handlePauseResume = () => setIsPaused(prev => !prev);
  const handleRefresh = () => fetchActivityAndStats();

  const platformStats = [
    { label: 'Total Active', value: statistics ? statistics.total_active?.toLocaleString() : '—', icon: Users, color: 'text-blue-600' },
    { label: 'Total Views', value: statistics ? Number(statistics.total_views || 0).toLocaleString() : '—', icon: Eye, color: 'text-purple-600' },
    { label: 'Total Saves', value: statistics ? Number(statistics.total_saves || 0).toLocaleString() : '—', icon: Heart, color: 'text-red-600' },
    { label: 'Total Contacts', value: statistics ? Number(statistics.total_contacts || 0).toLocaleString() : '—', icon: MessageCircle, color: 'text-green-600' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Activity className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handlePauseResume}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platformStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity List */}
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${activity.color} bg-opacity-10`}>
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-gray-900">{activity.user}</span>
                    <span className="text-gray-400">{activity.flag}</span>
                    <span className="text-gray-500">{activity.userLocation}</span>
                  </div>
                  
                  <div className="text-sm text-gray-700 mt-1">
                    <span>{activity.action} </span>
                    <span className="font-medium text-purple-600">{activity.target}</span>
                    <div className="flex items-center space-x-1 text-gray-500 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{activity.targetLocation}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                    <Clock className="h-3 w-3" />
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Categories from API */}
      {trendingCategories.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
            Trending Categories
          </h4>
          <div className="space-y-2">
            {trendingCategories.map((cat, index) => (
              <div key={cat.id || index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                </div>
                <span className="text-sm font-medium text-green-600">
                  {cat.featured_adverts_count || cat.count || 0} ads
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          <span>Updates every 4 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedActivityFeed;
