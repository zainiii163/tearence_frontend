import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Eye, 
  TrendingUp, 
  Globe, 
  Clock,
  Flag,
  MousePointer,
  Sparkles,
  Users
} from 'lucide-react';

const BannerActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isLive, setIsLive] = useState(true);

  const generateRandomActivity = () => {
    const activities = [
      {
        id: Date.now(),
        type: 'view',
        message: 'A user from Germany viewed a banner from London',
        icon: Eye,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        timestamp: 'just now'
      },
      {
        id: Date.now() + 1,
        type: 'new',
        message: 'New banner added in Dubai',
        icon: Sparkles,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        timestamp: '2 min ago'
      },
      {
        id: Date.now() + 2,
        type: 'click',
        message: 'A travel banner just received 10 clicks',
        icon: MousePointer,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        timestamp: '5 min ago'
      },
      {
        id: Date.now() + 3,
        type: 'trending',
        message: 'Real Estate banners trending in USA',
        icon: TrendingUp,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        timestamp: '8 min ago'
      },
      {
        id: Date.now() + 4,
        type: 'global',
        message: 'Banner from Canada reached 1K views',
        icon: Globe,
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-50',
        timestamp: '12 min ago'
      },
      {
        id: Date.now() + 5,
        type: 'engagement',
        message: 'High engagement on Fashion banners',
        icon: Users,
        color: 'text-pink-500',
        bgColor: 'bg-pink-50',
        timestamp: '15 min ago'
      },
      {
        id: Date.now() + 6,
        type: 'new',
        message: 'Sponsored banner launched in Tokyo',
        icon: Sparkles,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        timestamp: '18 min ago'
      },
      {
        id: Date.now() + 7,
        type: 'view',
        message: 'Multiple views on Tech banners',
        icon: Eye,
        color: 'text-indigo-500',
        bgColor: 'bg-indigo-50',
        timestamp: '22 min ago'
      }
    ];

    return activities[Math.floor(Math.random() * activities.length)];
  };

  useEffect(() => {
    // Initialize with some activities
    const initialActivities = [
      generateRandomActivity(),
      generateRandomActivity(),
      generateRandomActivity()
    ];
    setActivities(initialActivities);

    // Add new activity every 4 seconds
    if (isLive) {
      const interval = setInterval(() => {
        const newActivity = generateRandomActivity();
        setActivities(prev => [newActivity, ...prev].slice(0, 6));
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const getLiveIndicator = () => (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
      </div>
      <span className="text-xs font-medium text-red-600">LIVE</span>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-gray-900">Live Activity Feed</h2>
          {getLiveIndicator()}
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            isLive 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isLive ? 'Live' : 'Paused'}
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  height: { duration: 0.2 }
                }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {activity.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">8.5M</div>
            <div className="text-xs text-gray-600">Monthly Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">142</div>
            <div className="text-xs text-gray-600">Active Countries</div>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Trending Topics</h3>
        <div className="flex flex-wrap gap-2">
          {['Real Estate', 'Travel', 'Tech', 'Fashion', 'Food'].map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-xs font-medium hover:from-blue-100 hover:to-purple-100 transition-colors cursor-pointer"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerActivityFeed;
