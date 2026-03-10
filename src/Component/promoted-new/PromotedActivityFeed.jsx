import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Eye, Heart, TrendingUp, Globe, Users, Star, Zap } from 'lucide-react';

const PromotedActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const initialActivities = [
    {
      id: 1,
      type: 'view',
      message: 'A user from Spain viewed a promoted advert in London',
      timestamp: '2 minutes ago',
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'new',
      message: 'New promoted advert added in Dubai',
      timestamp: '5 minutes ago',
      icon: Zap,
      color: 'text-orange-500'
    },
    {
      id: 3,
      type: 'save',
      message: 'A car in Manchester just got 12 saves',
      timestamp: '8 minutes ago',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      id: 4,
      type: 'trending',
      message: 'Property listings in Tokyo are trending',
      timestamp: '12 minutes ago',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      id: 5,
      type: 'view',
      message: 'Multiple users viewing electronics in New York',
      timestamp: '15 minutes ago',
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      id: 6,
      type: 'new',
      message: 'Luxury service promoted in Paris',
      timestamp: '18 minutes ago',
      icon: Zap,
      color: 'text-orange-500'
    },
    {
      id: 7,
      type: 'save',
      message: 'Fashion items getting high engagement in Milan',
      timestamp: '22 minutes ago',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      id: 8,
      type: 'trending',
      message: 'Business opportunities trending in Singapore',
      timestamp: '25 minutes ago',
      icon: TrendingUp,
      color: 'text-green-500'
    }
  ];

  const additionalActivities = [
    {
      type: 'view',
      message: 'A user from Germany viewed a promoted car in Berlin',
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      type: 'new',
      message: 'New education course promoted in Toronto',
      icon: Zap,
      color: 'text-orange-500'
    },
    {
      type: 'save',
      message: 'Travel package in Sydney got 8 saves',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      type: 'trending',
      message: 'Health services trending in Los Angeles',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      type: 'view',
      message: 'Users from Brazil viewing property listings',
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      type: 'new',
      message: 'Pet services promoted in Amsterdam',
      icon: Zap,
      color: 'text-orange-500'
    }
  ];

  useEffect(() => {
    setActivities(initialActivities);

    if (!isPaused) {
      const interval = setInterval(() => {
        setActivities(prev => {
          // Add new activity at the top
          const newActivity = additionalActivities[Math.floor(Math.random() * additionalActivities.length)];
          const activityWithId = {
            ...newActivity,
            id: Date.now(),
            timestamp: 'Just now'
          };
          
          // Update timestamps for existing activities
          const updatedActivities = prev.map((activity, index) => {
            if (index === 0) return { ...activity, timestamp: '1 minute ago' };
            if (index === 1) return { ...activity, timestamp: '2 minutes ago' };
            if (index === 2) return { ...activity, timestamp: '3 minutes ago' };
            return activity;
          });

          // Keep only the latest 8 activities
          return [activityWithId, ...updatedActivities.slice(0, 7)];
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const getPlatformStats = () => [
    { icon: Globe, label: 'Countries', value: '142', color: 'text-blue-500' },
    { icon: Users, label: 'Active Users', value: '45.2K', color: 'text-green-500' },
    { icon: Eye, label: 'Total Views', value: '12.5M', color: 'text-purple-500' },
    { icon: Star, label: 'Satisfaction', value: '98%', color: 'text-orange-500' }
  ];

  const getTrendingTopics = () => [
    'Luxury Property',
    'Electric Cars',
    'Web Development',
    'Travel Packages',
    'Fashion Items',
    'Business Sales'
  ];

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
                  <div className="text-sm font-semibold text-gray-900">{stat.value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
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
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`p-2 bg-white rounded-full ${activity.color}`}>
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
      </div>

      {/* Trending Topics */}
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
    </div>
  );
};

export default PromotedActivityFeed;
