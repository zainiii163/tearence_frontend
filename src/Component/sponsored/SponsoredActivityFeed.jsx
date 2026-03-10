import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Eye, Globe, TrendingUp, Users, Crown, Zap, MapPin, Clock, Star, Heart, ArrowRight, Pause, Play } from 'lucide-react';

const SponsoredActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState([]);

  // Sample initial activities
  const initialActivities = [
    {
      id: 1,
      type: 'view',
      user: 'Alex Thompson',
      userCountry: '🇬🇧 UK',
      action: 'viewed a sponsored car',
      target: '2024 Tesla Model S Plaid',
      targetCountry: '🇺🇸 USA',
      targetCity: 'Los Angeles',
      time: '2 minutes ago',
      icon: Eye,
      color: 'blue'
    },
    {
      id: 2,
      type: 'new_advert',
      user: 'Elite Properties NYC',
      userCountry: '🇺🇸 USA',
      action: 'posted a new sponsored property',
      target: 'Luxury Penthouse Apartment',
      targetCountry: '🇺🇸 USA',
      targetCity: 'New York',
      time: '5 minutes ago',
      icon: Crown,
      color: 'yellow'
    },
    {
      id: 3,
      type: 'trending',
      user: 'System',
      userCountry: '🌍 Global',
      action: 'trending sponsored job',
      target: 'Senior Software Engineer - Remote',
      targetCountry: '🇬🇧 UK',
      targetCity: 'London',
      time: '8 minutes ago',
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 4,
      type: 'contact',
      user: 'Maria Garcia',
      userCountry: '🇪🇸 Spain',
      action: 'contacted seller about',
      target: 'Dubai Desert Safari Experience',
      targetCountry: '🇦🇪 UAE',
      targetCity: 'Dubai',
      time: '12 minutes ago',
      icon: Users,
      color: 'purple'
    },
    {
      id: 5,
      type: 'upgrade',
      user: 'Creative Digital Agency',
      userCountry: '🇨🇦 Canada',
      action: 'upgraded to sponsored premium',
      target: 'Professional Web Design Package',
      targetCountry: '🇨🇦 Canada',
      targetCity: 'Toronto',
      time: '15 minutes ago',
      icon: Zap,
      color: 'orange'
    },
    {
      id: 6,
      type: 'view',
      user: 'John Smith',
      userCountry: '🇦🇺 Australia',
      action: 'viewed sponsored fashion',
      target: 'Designer Fashion Collection - Milan',
      targetCountry: '🇮🇹 Italy',
      targetCity: 'Milan',
      time: '18 minutes ago',
      icon: Eye,
      color: 'blue'
    },
    {
      id: 7,
      type: 'sale',
      user: 'TechCorp International',
      userCountry: '🇬🇧 UK',
      action: 'reported sale from sponsored ad',
      target: 'Executive Health Check Package',
      targetCountry: '🇸🇬 Singapore',
      targetCity: 'Singapore',
      time: '22 minutes ago',
      icon: Star,
      color: 'green'
    },
    {
      id: 8,
      type: 'favorite',
      user: 'Emma Wilson',
      userCountry: '🇩🇪 Germany',
      action: 'saved sponsored advert',
      target: 'Purebred Golden Retriever Puppies',
      targetCountry: '🇦🇺 Australia',
      targetCity: 'Sydney',
      time: '25 minutes ago',
      icon: Heart,
      color: 'red'
    }
  ];

  const initialTrendingTopics = [
    { topic: 'Luxury Properties', count: 1234, growth: '+12%', icon: '🏠' },
    { topic: 'Electric Vehicles', count: 987, growth: '+18%', icon: '🚗' },
    { topic: 'Remote Jobs', count: 876, growth: '+25%', icon: '💼' },
    { topic: 'Travel Experiences', count: 654, growth: '+8%', icon: '✈️' },
    { topic: 'Online Courses', count: 543, growth: '+15%', icon: '🎓' },
    { topic: 'Smart Home', count: 432, growth: '+22%', icon: '🏡' }
  ];

  // Generate new random activity
  const generateRandomActivity = () => {
    const users = [
      { name: 'Alex Thompson', country: '🇬🇧 UK' },
      { name: 'Maria Garcia', country: '🇪🇸 Spain' },
      { name: 'John Smith', country: '🇦🇺 Australia' },
      { name: 'Emma Wilson', country: '🇩🇪 Germany' },
      { name: 'Pierre Dubois', country: '🇫🇷 France' },
      { name: 'Li Wei', country: '🇨🇳 China' },
      { name: 'Raj Patel', country: '🇮🇳 India' },
      { name: 'Carlos Silva', country: '🇧🇷 Brazil' }
    ];

    const actions = [
      { type: 'view', action: 'viewed a sponsored', icon: Eye, color: 'blue' },
      { type: 'contact', action: 'contacted seller about', icon: Users, color: 'purple' },
      { type: 'favorite', action: 'saved sponsored advert', icon: Heart, color: 'red' },
      { type: 'trending', action: 'trending sponsored', icon: TrendingUp, color: 'green' }
    ];

    const targets = [
      { name: 'Luxury Apartment', country: '🇺🇸 USA', city: 'New York' },
      { name: 'Sports Car', country: '🇩🇪 Germany', city: 'Berlin' },
      { name: 'Web Design Service', country: '🇨🇦 Canada', city: 'Toronto' },
      { name: 'Fashion Collection', country: '🇮🇹 Italy', city: 'Milan' },
      { name: 'Travel Package', country: '🇦🇪 UAE', city: 'Dubai' },
      { name: 'Online Course', country: '🇬🇧 UK', city: 'London' }
    ];

    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomTarget = targets[Math.floor(Math.random() * targets.length)];

    return {
      id: Date.now(),
      type: randomAction.type,
      user: randomUser.name,
      userCountry: randomUser.country,
      action: randomAction.action,
      target: randomTarget.name,
      targetCountry: randomTarget.country,
      targetCity: randomTarget.city,
      time: 'Just now',
      icon: randomAction.icon,
      color: randomAction.color
    };
  };

  // Update activities
  useEffect(() => {
    setActivities(initialActivities);
    setTrendingTopics(initialTrendingTopics);
  }, []);

  // Auto-update activities
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const newActivity = generateRandomActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 7)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Update trending topics
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTrendingTopics(prev => 
        prev.map(topic => ({
          ...topic,
          count: topic.count + Math.floor(Math.random() * 10),
          growth: `+${Math.floor(Math.random() * 30)}%`
        }))
      );
    }, 6000);

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

      {/* Activities */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence mode="wait">
          <div className="p-4 space-y-3">
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
          </div>
        </AnimatePresence>
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
    </div>
  );
};

export default SponsoredActivityFeed;
