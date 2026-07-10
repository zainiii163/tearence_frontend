import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Briefcase, 
  MapPin, 
  Eye, 
  TrendingUp, 
  Clock, 
  Globe,
  Building,
  Search,
  Heart,
  Star,
  ArrowUpRight,
  Pause,
  Play
} from 'lucide-react';
import jobService from '../../services/JobServices';

const JobsActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [platformStats, setPlatformStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        setLoading(true);
        
        // Load platform stats
        const statsResponse = await jobService.getStats();
        if (statsResponse.success) {
          const stats = statsResponse.data;
          setPlatformStats([
            { icon: Globe, label: 'Countries', value: stats.total_countries || '142', change: '+3%' },
            { icon: Building, label: 'Companies', value: stats.active_companies || '8,456', change: '+8%' },
            { icon: Users, label: 'Active Users', value: stats.active_users || '45.2K', change: '+15%' },
            { icon: Eye, label: 'Daily Views', value: stats.daily_views || '2.5M', change: '+18%' },
            { icon: Briefcase, label: 'Active Jobs', value: stats.total_jobs || '45,234', change: '+12%' },
            { icon: Star, label: 'Success Rate', value: `${stats.success_rate || 98}%`, change: '+2%' }
          ]);
        }
        
        // Load trending searches from API
        const trendingSearchesResponse = await jobService.getTrendingSearches();
        if (trendingSearchesResponse.success) {
          setTrendingSearches(trendingSearchesResponse.data);
        }
        
        // Load recent activities from API
        const activitiesResponse = await jobService.getActivities();
        if (activitiesResponse.success) {
          setActivities(activitiesResponse.data);
        }
        
      } catch (error) {
        console.error('Error loading activity data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadActivityData();
  }, []);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(async () => {
        try {
          // In production, this would be replaced with real WebSocket data
          // For now, we'll fetch the latest activities periodically
          const activitiesResponse = await jobService.getActivities();
          if (activitiesResponse.success && activitiesResponse.data.length > 0) {
            // Add the latest activity to the top
            const latestActivity = activitiesResponse.data[0];
            setActivities(prev => {
              // Avoid duplicates by checking if this activity already exists
              if (!prev.some(activity => activity.id === latestActivity.id)) {
                return [latestActivity, ...prev.slice(0, 7)];
              }
              return prev;
            });
          }
        } catch (error) {
          console.error('Error fetching latest activities:', error);
        }
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const getActivityIcon = (activity) => {
    const Icon = activity.icon || Activity;
    return (
      <div className={`w-10 h-10 ${activity.bgColor || 'bg-purple-100'} rounded-full flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${activity.color || 'text-purple-600'}`} />
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Activity Feed */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
                  <p className="text-sm text-gray-600">Real-time job market activity</p>
                </div>
              </div>
              
              {/* Pause/Play Button */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isPaused ? (
                  <Play className="w-5 h-5" />
                ) : (
                  <Pause className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-sm text-green-600 font-medium">LIVE</span>
              {!isPaused && (
                <span className="text-sm text-gray-500">• Updates every 4 seconds</span>
              )}
            </div>

            {/* Activities List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id || `activity-${index}-${activity.message?.slice(0, 20)}`}
                    variants={itemVariants}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {getActivityIcon(activity)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>

        {/* Sidebar Stats and Trending */}
        <div className="space-y-6">
          {/* Platform Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Stats</h3>
            <div className="space-y-4">
              {platformStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700">{stat.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-green-600">{stat.change}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Trending Searches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Trending Searches</h3>
            </div>
            <div className="space-y-3">
              {trendingSearches.map((search, index) => (
                <div key={typeof search === 'string' ? search : search.term} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{typeof search === 'string' ? search : search.term}</p>
                      <p className="text-xs text-gray-500">{typeof search === 'string' ? 'Popular search' : `${search.count} searches`}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    <span className="text-xs font-medium">{typeof search === 'string' ? '+' : search.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white"
          >
            <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
            <p className="text-sm text-white text-opacity-90 mb-4">
              Get notified about new jobs that match your preferences
            </p>
            <button className="w-full px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
              Set Job Alerts
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JobsActivityFeed;
