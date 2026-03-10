import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Globe, 
  Eye, 
  DollarSign,
  Clock,
  Pause,
  Play,
  ArrowUp,
  Hash,
  MapPin,
  Star
} from 'lucide-react';

const AffiliateActivityFeed = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'new_program',
      message: 'TechCorp Solutions launched a new affiliate program',
      user: 'TechCorp Solutions',
      category: 'Technology & Gadgets',
      commission: '40%',
      location: 'United States',
      timestamp: '2 minutes ago',
      trending: true
    },
    {
      id: 2,
      type: 'new_promoter',
      message: 'Fashion Expert joined as a promoter',
      user: 'Fashion Expert',
      category: 'Fashion & Beauty',
      followers: '15.2K',
      location: 'United Kingdom',
      timestamp: '5 minutes ago',
      trending: false
    },
    {
      id: 3,
      type: 'commission_earned',
      message: 'John Doe earned $250 from affiliate sales',
      user: 'John Doe',
      amount: '$250',
      program: 'SaaS Marketing Platform',
      timestamp: '8 minutes ago',
      trending: false
    },
    {
      id: 4,
      type: 'program_update',
      message: 'Global Travel Inc increased commission rates',
      user: 'Global Travel Inc',
      newRate: '20%',
      oldRate: '15%',
      location: 'Global',
      timestamp: '12 minutes ago',
      trending: true
    },
    {
      id: 5,
      type: 'milestone',
      message: 'Wellness Expert reached 1000 clicks',
      user: 'Wellness Expert',
      metric: '1000 clicks',
      program: 'Health Products',
      timestamp: '15 minutes ago',
      trending: false
    }
  ]);

  const [isPaused, setIsPaused] = useState(false);
  const [liveStats, setLiveStats] = useState({
    activeUsers: 15420,
    totalEarnings: '$2.4M',
    activePrograms: 2847,
    countries: 142
  });

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // Simulate new activity
      const newActivity = {
        id: Date.now(),
        type: ['new_program', 'new_promoter', 'commission_earned'][Math.floor(Math.random() * 3)],
        message: 'New activity occurred',
        user: `User ${Math.floor(Math.random() * 1000)}`,
        timestamp: 'Just now',
        trending: Math.random() > 0.7
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);

      // Update live stats
      setLiveStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        totalEarnings: `$${(parseFloat(prev.totalEarnings.replace('$', '').replace('M', '')) + Math.random() * 0.01).toFixed(2)}M`,
        activePrograms: prev.activePrograms + Math.floor(Math.random() * 3 - 1),
        countries: prev.countries
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_program': return TrendingUp;
      case 'new_promoter': return Users;
      case 'commission_earned': return DollarSign;
      case 'program_update': return ArrowUp;
      case 'milestone': return Star;
      default: return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'new_program': return 'text-blue-600 bg-blue-100';
      case 'new_promoter': return 'text-purple-600 bg-purple-100';
      case 'commission_earned': return 'text-green-600 bg-green-100';
      case 'program_update': return 'text-yellow-600 bg-yellow-100';
      case 'milestone': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold">LIVE ACTIVITY</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Real-Time Affiliate Activity
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            See what's happening in the affiliate community right now
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Live Activity Feed */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              {/* Feed Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Activity className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Live Activity Feed</h3>
                </div>
                
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4" />
                      <span className="text-sm">Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4" />
                      <span className="text-sm">Pause</span>
                    </>
                  )}
                </button>
              </div>

              {/* Activity List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {activities.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    const colorClasses = getActivityColor(activity.type);
                    
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-start space-x-3 p-4 rounded-lg border ${
                          activity.trending ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        {/* Icon */}
                        <div className={`p-2 rounded-full ${colorClasses}`}>
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 mb-1">
                                {activity.message}
                              </p>
                              
                              {/* Additional Details */}
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {activity.timestamp}
                                </span>
                                
                                {activity.category && (
                                  <span className="flex items-center">
                                    <Hash className="h-3 w-3 mr-1" />
                                    {activity.category}
                                  </span>
                                )}
                                
                                {activity.location && (
                                  <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {activity.location}
                                  </span>
                                )}
                                
                                {activity.commission && (
                                  <span className="flex items-center text-green-600 font-medium">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {activity.commission}
                                  </span>
                                )}
                                
                                {activity.amount && (
                                  <span className="flex items-center text-green-600 font-medium">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {activity.amount}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Trending Badge */}
                            {activity.trending && (
                              <div className="flex items-center text-red-600 text-xs font-medium">
                                <ArrowUp className="h-3 w-3 mr-1" />
                                Trending
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Live Stats */}
          <div className="space-y-6">
            {/* Platform Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">Active Users</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    {liveStats.activeUsers.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Total Earnings</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    {liveStats.totalEarnings}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-700">Active Programs</span>
                  </div>
                  <span className="text-xl font-bold text-purple-600">
                    {liveStats.activePrograms.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-yellow-600" />
                    <span className="text-gray-700">Countries</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-600">
                    {liveStats.countries}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Trending Topics</h3>
              
              <div className="space-y-3">
                {[
                  { tag: '#SaaS', count: '2.4K posts', growth: '+12%' },
                  { tag: '#Fashion', count: '1.8K posts', growth: '+8%' },
                  { tag: '#Travel', count: '1.2K posts', growth: '+15%' },
                  { tag: '#Health', count: '987 posts', growth: '+6%' },
                  { tag: '#Tech', count: '756 posts', growth: '+20%' }
                ].map((topic, index) => (
                  <motion.div
                    key={topic.tag}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="font-medium text-gray-900">{topic.tag}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">{topic.count}</span>
                      <span className="text-green-600 font-medium">{topic.growth}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffiliateActivityFeed;
