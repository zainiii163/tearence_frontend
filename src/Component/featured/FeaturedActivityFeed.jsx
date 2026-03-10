import React, { useState, useEffect } from 'react';
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
  Zap,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

const FeaturedActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const initialActivities = [
    {
      id: 1,
      type: 'view',
      user: 'Marie Dubois',
      userLocation: 'Paris, France',
      action: 'viewed a featured',
      target: 'Luxury Apartment in Monaco',
      targetLocation: 'Monaco',
      time: '2 minutes ago',
      icon: Eye,
      color: 'text-blue-500',
      flag: '🇫🇷'
    },
    {
      id: 2,
      type: 'save',
      user: 'John Smith',
      userLocation: 'New York, USA',
      action: 'saved a featured',
      target: 'Vintage Ferrari 250 GT',
      targetLocation: 'Milan, Italy',
      time: '5 minutes ago',
      icon: Heart,
      color: 'text-red-500',
      flag: '🇺🇸'
    },
    {
      id: 3,
      type: 'contact',
      user: 'Li Wei',
      userLocation: 'Shanghai, China',
      action: 'contacted seller of',
      target: 'Tech Startup Investment',
      targetLocation: 'London, UK',
      time: '8 minutes ago',
      icon: MessageCircle,
      color: 'text-green-500',
      flag: '🇨🇳'
    },
    {
      id: 4,
      type: 'new',
      user: 'Global Properties',
      userLocation: 'Dubai, UAE',
      action: 'posted a new featured',
      target: 'Penthouse with Ocean View',
      targetLocation: 'Dubai, UAE',
      time: '12 minutes ago',
      icon: Star,
      color: 'text-yellow-500',
      flag: '🇦🇪'
    },
    {
      id: 5,
      type: 'trending',
      user: 'System',
      userLocation: 'Global',
      action: 'trending now:',
      target: 'Properties in Singapore',
      targetLocation: 'Singapore',
      time: '15 minutes ago',
      icon: TrendingUp,
      color: 'text-purple-500',
      flag: '🌏'
    }
  ];

  const newActivities = [
    {
      id: 6,
      type: 'view',
      user: 'Emma Wilson',
      userLocation: 'Sydney, Australia',
      action: 'viewed a featured',
      target: 'Beach Resort Package',
      targetLocation: 'Maldives',
      time: 'just now',
      icon: Eye,
      color: 'text-blue-500',
      flag: '🇦🇺'
    },
    {
      id: 7,
      type: 'save',
      user: 'Carlos Rodriguez',
      userLocation: 'Madrid, Spain',
      action: 'saved a featured',
      target: 'Executive MBA Program',
      targetLocation: 'Singapore',
      time: '1 minute ago',
      icon: Heart,
      color: 'text-red-500',
      flag: '🇪🇸'
    },
    {
      id: 8,
      type: 'contact',
      user: 'Yuki Tanaka',
      userLocation: 'Tokyo, Japan',
      action: 'contacted seller of',
      target: 'Fashion Partnership',
      targetLocation: 'Paris, France',
      time: '3 minutes ago',
      icon: MessageCircle,
      color: 'text-green-500',
      flag: '🇯🇵'
    }
  ];

  useEffect(() => {
    setActivities(initialActivities);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActivities(prev => {
        const updated = [...prev];
        
        // Add new activity occasionally
        if (Math.random() > 0.7) {
          const newActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
          updated.unshift({ ...newActivity, id: Date.now() });
        }
        
        // Update times
        return updated.slice(0, 8).map((activity, index) => ({
          ...activity,
          time: index === 0 ? 'just now' : `${index * 2 + 1} minutes ago`
        }));
      });
      
      setLastUpdate(new Date());
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleRefresh = () => {
    setActivities(initialActivities);
    setLastUpdate(new Date());
  };

  const platformStats = [
    { label: 'Active Users', value: '45.2K', icon: Users, color: 'text-blue-600' },
    { label: 'Countries', value: '142', icon: Globe, color: 'text-green-600' },
    { label: 'Daily Views', value: '2.3M', icon: Eye, color: 'text-purple-600' },
    { label: 'Avg Response', value: '2.5h', icon: Clock, color: 'text-orange-600' }
  ];

  const trendingSearches = [
    { term: 'Luxury Properties', growth: '+23%', trend: 'up' },
    { term: 'Vintage Cars', growth: '+18%', trend: 'up' },
    { term: 'Investment Opportunities', growth: '+15%', trend: 'up' },
    { term: 'Executive Education', growth: '+12%', trend: 'up' },
    { term: 'Travel Packages', growth: '+8%', trend: 'down' }
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

      {/* Trending Searches */}
      <div className="border-t border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
          Trending Searches
        </h4>
        <div className="space-y-2">
          {trendingSearches.map((search, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{search.term}</span>
                {search.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                search.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {search.growth}
              </span>
            </div>
          ))}
        </div>
      </div>

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
