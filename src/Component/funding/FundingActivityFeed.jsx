import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Target,
  Eye,
  Heart,
  DollarSign,
  Clock,
  Activity,
  Pause,
  Play
} from 'lucide-react';

const FundingActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const initialActivities = [
    {
      id: 1,
      type: 'funding',
      message: 'Sarah Johnson funded "AI Learning Platform"',
      amount: '$250',
      project: 'AI Learning Platform',
      time: '2 minutes ago',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 2,
      type: 'project',
      message: 'New project launched: "Sustainable Urban Farming"',
      project: 'Sustainable Urban Farming',
      time: '5 minutes ago',
      icon: <Target className="w-4 h-4" />,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 3,
      type: 'milestone',
      message: '"Community Art Center" reached 50% funding goal',
      project: 'Community Art Center',
      time: '8 minutes ago',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 4,
      type: 'backer',
      message: 'Michael Chen backed "Healthcare Access App"',
      project: 'Healthcare Access App',
      time: '12 minutes ago',
      icon: <Users className="w-4 h-4" />,
      color: 'text-amber-600 bg-amber-100'
    },
    {
      id: 5,
      type: 'view',
      message: '"Startup Incubator" hit 1,000 views',
      project: 'Startup Incubator',
      time: '15 minutes ago',
      icon: <Eye className="w-4 h-4" />,
      color: 'text-indigo-600 bg-indigo-100'
    }
  ];

  const trendingTopics = [
    { topic: 'AI & Machine Learning', count: 234, growth: '+12%' },
    { topic: 'Sustainable Technology', count: 189, growth: '+18%' },
    { topic: 'Healthcare Innovation', count: 156, growth: '+8%' },
    { topic: 'Creative Arts', count: 145, growth: '+15%' },
    { topic: 'Education Tech', count: 134, growth: '+22%' }
  ];

  const platformStats = [
    { label: 'Active Funders', value: '15,234', icon: <Users className="w-5 h-5" />, color: 'text-blue-600' },
    { label: 'Countries', value: '142', icon: <Globe className="w-5 h-5" />, color: 'text-green-600' },
    { label: 'Total Views', value: '2.5M', icon: <Eye className="w-5 h-5" />, color: 'text-purple-600' },
    { label: 'Success Rate', value: '89%', icon: <Target className="w-5 h-5" />, color: 'text-amber-600' }
  ];

  useEffect(() => {
    setActivities(initialActivities);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const newActivities = [
        {
          id: Date.now(),
          type: ['funding', 'project', 'milestone', 'backer', 'view'][Math.floor(Math.random() * 5)],
          message: generateRandomMessage(),
          project: generateRandomProject(),
          time: 'Just now',
          icon: getActivityIcon(),
          color: getActivityColor()
        },
        ...activities.slice(0, 4)
      ];
      
      setActivities(newActivities);
      setLastUpdate(new Date());
    }, 4000);

    return () => clearInterval(interval);
  }, [activities, isPaused]);

  const generateRandomMessage = () => {
    const messages = [
      'funded a project',
      'launched a new project',
      'reached a milestone',
      'backed a project',
      'viewed a project'
    ];
    const names = ['Alex Thompson', 'Emma Wilson', 'David Lee', 'Sophia Chen', 'James Brown'];
    const projects = ['Tech Innovation', 'Green Energy', 'Art Project', 'Health Solution', 'Education Platform'];
    
    const action = messages[Math.floor(Math.random() * messages.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const project = projects[Math.floor(Math.random() * projects.length)];
    
    return `${name} ${action} "${project}"`;
  };

  const generateRandomProject = () => {
    const projects = ['Tech Innovation', 'Green Energy', 'Art Project', 'Health Solution', 'Education Platform'];
    return projects[Math.floor(Math.random() * projects.length)];
  };

  const getActivityIcon = () => {
    const icons = [
      <DollarSign className="w-4 h-4" />,
      <Target className="w-4 h-4" />,
      <TrendingUp className="w-4 h-4" />,
      <Users className="w-4 h-4" />,
      <Eye className="w-4 h-4" />
    ];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  const getActivityColor = () => {
    const colors = [
      'text-green-600 bg-green-100',
      'text-blue-600 bg-blue-100',
      'text-purple-600 bg-purple-100',
      'text-amber-600 bg-amber-100',
      'text-indigo-600 bg-indigo-100'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-gray-400' : 'bg-green-500 animate-pulse'}`} />
              <span>{isPaused ? 'Paused' : 'Live'}</span>
              <span>•</span>
              <span>Updated {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {platformStats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-lg font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity List */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
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
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activity.color}`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Trending Topics */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Trending Topics</h4>
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">{topic.topic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{topic.count}</span>
                  <span className="text-xs text-green-600 font-medium">{topic.growth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingActivityFeed;
