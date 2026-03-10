import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  Eye, 
  Heart, 
  MapPin, 
  Building, 
  Home, 
  Star, 
  Clock,
  Globe,
  Users,
  DollarSign,
  MessageSquare,
  Search,
  Zap,
  ArrowUp,
  ArrowDown,
  Pause,
  Play,
  RefreshCw
} from 'lucide-react';

const PropertyActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [trendingCities, setTrendingCities] = useState([]);
  const [platformStats, setPlatformStats] = useState({});
  const [isPaused, setIsPaused] = useState(false);

  const generateActivity = () => {
    const actions = [
      { type: 'view', icon: Eye, text: 'viewed', color: 'blue' },
      { type: 'save', icon: Heart, text: 'saved', color: 'red' },
      { type: 'contact', icon: MessageSquare, text: 'contacted agent about', color: 'green' },
      { type: 'search', icon: Search, text: 'searched for', color: 'purple' }
    ];

    const cities = ['London', 'New York', 'Tokyo', 'Paris', 'Dubai', 'Singapore', 'Sydney', 'Hong Kong'];
    const propertyTypes = ['apartment', 'villa', 'house', 'commercial space', 'land', 'office'];
    const countries = ['🇬🇧', '🇺🇸', '🇯🇵', '🇫🇷', '🇦🇪', '🇸🇬', '🇦🇺', '🇭🇰'];

    const action = actions[Math.floor(Math.random() * actions.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const userName = `User${Math.floor(Math.random() * 9000) + 1000}`;

    return {
      id: Date.now() + Math.random(),
      action,
      userName,
      city,
      country,
      propertyType,
      timestamp: new Date(),
      price: `$${Math.floor(Math.random() * 2000000) + 100000}`
    };
  };

  const generateTrendingCity = () => {
    const cities = [
      { name: 'Dubai', country: 'UAE', growth: '+18%', views: '125K', avgPrice: '$520K', flag: '🇦🇪' },
      { name: 'London', country: 'UK', growth: '+12%', views: '98K', avgPrice: '$850K', flag: '🇬🇧' },
      { name: 'Tokyo', country: 'Japan', growth: '+15%', views: '87K', avgPrice: '$420K', flag: '🇯🇵' },
      { name: 'New York', country: 'USA', growth: '+8%', views: '156K', avgPrice: '$780K', flag: '🇺🇸' },
      { name: 'Singapore', country: 'Singapore', growth: '+14%', views: '76K', avgPrice: '$650K', flag: '🇸🇬' },
      { name: 'Sydney', country: 'Australia', growth: '+9%', views: '65K', avgPrice: '$720K', flag: '🇦🇺' },
      { name: 'Paris', country: 'France', growth: '+10%', views: '82K', avgPrice: '$680K', flag: '🇫🇷' },
      { name: 'Hong Kong', country: 'Hong Kong', growth: '+11%', views: '94K', avgPrice: '$890K', flag: '🇭🇰' }
    ];

    return cities.sort(() => Math.random() - 0.5).slice(0, 5);
  };

  useEffect(() => {
    // Initialize with some activities
    const initialActivities = Array.from({ length: 5 }, generateActivity);
    setActivities(initialActivities);
    setTrendingCities(generateTrendingCity());

    // Set up interval for live updates
    if (!isPaused) {
      const interval = setInterval(() => {
        const newActivity = generateActivity();
        setActivities(prev => [newActivity, ...prev].slice(0, 10));
        
        // Update trending cities occasionally
        if (Math.random() > 0.7) {
          setTrendingCities(generateTrendingCity());
        }
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const stats = {
    totalProperties: '245,678',
    activeUsers: '45.2K',
    monthlyViews: '12.5M',
    countries: '142',
    avgResponseTime: '2.3h',
    satisfactionRate: '98%'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Live Activity Feed</h2>
            <p className="text-sm text-gray-600">Real-time property marketplace updates</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-gray-400' : 'bg-green-500 animate-pulse'}`} />
            <span className="text-xs text-gray-600">{isPaused ? 'Paused' : 'Live'}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className={`w-8 h-8 bg-${activity.action.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <activity.action.icon className={`w-4 h-4 text-${activity.action.color}-600`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.userName}</span>{' '}
                      {activity.action.text} a{' '}
                      <span className="font-medium">{activity.propertyType}</span> in{' '}
                      <span className="font-medium">{activity.city}</span>
                      <span className="ml-1">{activity.country}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs font-medium text-blue-600">{activity.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Trending & Stats */}
        <div className="space-y-6">
          {/* Trending Cities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Cities</h3>
            <div className="space-y-2">
              {trendingCities.map((city, index) => (
                <motion.div
                  key={city.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{city.flag}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{city.name}</div>
                      <div className="text-xs text-gray-500">{city.country}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <ArrowUp className="w-3 h-3" />
                      {city.growth}
                    </div>
                    <div className="text-xs text-gray-500">{city.views} views</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <Building className="w-5 h-5 text-blue-600 mb-1" />
                <div className="text-lg font-bold text-gray-900">{stats.totalProperties}</div>
                <div className="text-xs text-gray-600">Properties</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3">
                <Users className="w-5 h-5 text-green-600 mb-1" />
                <div className="text-lg font-bold text-gray-900">{stats.activeUsers}</div>
                <div className="text-xs text-gray-600">Active Users</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3">
                <Eye className="w-5 h-5 text-purple-600 mb-1" />
                <div className="text-lg font-bold text-gray-900">{stats.monthlyViews}</div>
                <div className="text-xs text-gray-600">Monthly Views</div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-3">
                <Globe className="w-5 h-5 text-orange-600 mb-1" />
                <div className="text-lg font-bold text-gray-900">{stats.countries}</div>
                <div className="text-xs text-gray-600">Countries</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Quick Metrics</h4>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <span className="text-sm font-medium text-gray-900">{stats.avgResponseTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Satisfaction Rate</span>
                <span className="text-sm font-medium text-green-600">{stats.satisfactionRate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyActivityFeed;
