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

const JobsActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [trendingSearches, setTrendingSearches] = useState([]);

  // Sample activities data
  const sampleActivities = [
    {
      id: 1,
      type: 'application',
      message: 'A user from Germany applied for a job in Dubai',
      timestamp: '2 minutes ago',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 2,
      type: 'job_posted',
      message: 'New vacancy added in London: Senior Frontend Developer',
      timestamp: '5 minutes ago',
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 3,
      type: 'views',
      message: 'A job in Toronto just got 15 views',
      timestamp: '8 minutes ago',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 4,
      type: 'application',
      message: 'Someone from India applied for a Remote position',
      timestamp: '12 minutes ago',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 5,
      type: 'job_posted',
      message: 'Urgent hire posted in New York: Marketing Manager',
      timestamp: '15 minutes ago',
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 6,
      type: 'save',
      message: 'A user saved 3 jobs in Technology category',
      timestamp: '18 minutes ago',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 7,
      type: 'views',
      message: 'Featured job reached 100 views in 1 hour',
      timestamp: '22 minutes ago',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 8,
      type: 'application',
      message: 'Multiple applications received for Healthcare position',
      timestamp: '25 minutes ago',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  const sampleTrendingSearches = [
    { term: 'Remote Developer', count: 1234, trend: '+15%' },
    { term: 'Data Scientist', count: 892, trend: '+22%' },
    { term: 'Marketing Manager', count: 756, trend: '+8%' },
    { term: 'Frontend Developer', count: 645, trend: '+18%' },
    { term: 'UX Designer', count: 523, trend: '+12%' },
    { term: 'Product Manager', count: 445, trend: '+25%' }
  ];

  const platformStats = [
    { icon: Globe, label: 'Countries', value: '142', change: '+3%' },
    { icon: Building, label: 'Companies', value: '8,456', change: '+8%' },
    { icon: Users, label: 'Active Users', value: '45.2K', change: '+15%' },
    { icon: Eye, label: 'Daily Views', value: '2.5M', change: '+18%' },
    { icon: Briefcase, label: 'Active Jobs', value: '45,234', change: '+12%' },
    { icon: Star, label: 'Success Rate', value: '98%', change: '+2%' }
  ];

  useEffect(() => {
    setActivities(sampleActivities);
    setTrendingSearches(sampleTrendingSearches);

    // Simulate real-time updates
    if (!isPaused) {
      const interval = setInterval(() => {
        const randomActivity = sampleActivities[Math.floor(Math.random() * sampleActivities.length)];
        setActivities(prev => [randomActivity, ...prev.slice(0, 7)]);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const getActivityIcon = (activity) => {
    const Icon = activity.icon;
    return (
      <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${activity.color}`} />
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
                {activities.map((activity) => (
                  <motion.div
                    key={`${activity.id}-${Date.now()}`}
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
                <div key={search.term} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{search.term}</p>
                      <p className="text-xs text-gray-500">{search.count} searches</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <ArrowUpRight className="w-3 h-3" />
                    <span className="text-xs font-medium">{search.trend}</span>
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
