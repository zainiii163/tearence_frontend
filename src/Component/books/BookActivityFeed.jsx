import React, { useState, useEffect } from 'react';
import { Activity, Eye, Heart, BookOpen, Globe, TrendingUp, Users, Star } from 'lucide-react';

const BookActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isLive, setIsLive] = useState(true);

  const initialActivities = [
    {
      id: 1,
      type: 'view',
      user: { name: 'Emma Johnson', country: 'Canada', flag: '🇨🇦' },
      action: 'viewed a book from',
      target: { title: 'Midnight in Lagos', author: 'Amara Okonkwo', country: 'Nigeria', flag: '🇳🇬' },
      timestamp: '2 minutes ago',
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'add',
      user: { name: 'Carlos Rodriguez', country: 'Mexico', flag: '🇲🇽' },
      action: 'added a new',
      target: { title: 'Shadows of Mexico City', genre: 'Thriller', country: 'Mexico', flag: '🇲🇽' },
      timestamp: '5 minutes ago',
      icon: BookOpen,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'save',
      user: { name: 'Priya Sharma', country: 'India', flag: '🇮🇳' },
      action: 'saved',
      target: { title: 'Quantum Dragon Rising', author: 'Chen Wei', country: 'China', flag: '🇨🇳' },
      timestamp: '8 minutes ago',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      id: 4,
      type: 'review',
      user: { name: 'Jean-Luc Dubois', country: 'France', flag: '🇫🇷' },
      action: 'reviewed',
      target: { title: 'Hearts in London', author: 'Sarah Mitchell', rating: 5, country: 'UK', flag: '🇬🇧' },
      timestamp: '12 minutes ago',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      id: 5,
      type: 'trending',
      user: null,
      action: 'Trending in',
      target: { topic: 'Science Fiction', count: '2.3k views', country: 'Global', flag: '🌍' },
      timestamp: '15 minutes ago',
      icon: TrendingUp,
      color: 'text-purple-500'
    }
  ];

  const newActivities = [
    {
      type: 'view',
      user: { name: 'Michael Brown', country: 'Australia', flag: '🇦🇺' },
      action: 'viewed a book from',
      target: { title: 'Mindful Living', author: 'Priya Sharma', country: 'India', flag: '🇮🇳' },
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      type: 'add',
      user: { name: 'Lisa Wang', country: 'USA', flag: '🇺🇸' },
      action: 'added a new',
      target: { title: 'Digital Dreams', genre: 'Sci-Fi', country: 'USA', flag: '🇺🇸' },
      icon: BookOpen,
      color: 'text-green-500'
    },
    {
      type: 'save',
      user: { name: 'Ahmed Hassan', country: 'Egypt', flag: '🇪🇬' },
      action: 'saved',
      target: { title: 'Parisian Echoes', author: 'Jean-Luc Dubois', country: 'France', flag: '🇫🇷' },
      icon: Heart,
      color: 'text-red-500'
    },
    {
      type: 'review',
      user: { name: 'Sophie Martin', country: 'Germany', flag: '🇩🇪' },
      action: 'reviewed',
      target: { title: 'Daughters of the Sun', author: 'Amara Okonkwo', rating: 4, country: 'Nigeria', flag: '🇳🇬' },
      icon: Star,
      color: 'text-yellow-500'
    }
  ];

  useEffect(() => {
    setActivities(initialActivities);

    if (isLive) {
      const interval = setInterval(() => {
        const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
        const newActivityWithId = {
          ...randomActivity,
          id: Date.now(),
          timestamp: 'just now'
        };

        setActivities(prev => [newActivityWithId, ...prev.slice(0, 9)]);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const formatTimestamp = (timestamp) => {
    return timestamp;
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'view':
        return (
          <>
            <span className="font-medium text-gray-900">{activity.user.name}</span>
            <span className="text-gray-600"> {activity.action} </span>
            <span className="font-medium text-gray-900">{activity.target.title}</span>
            <span className="text-gray-600"> by {activity.target.author}</span>
            <span className="ml-1">{activity.target.flag}</span>
          </>
        );
      
      case 'add':
        return (
          <>
            <span className="font-medium text-gray-900">{activity.user.name}</span>
            <span className="text-gray-600"> {activity.action} </span>
            <span className="font-medium text-gray-900">{activity.target.title}</span>
            <span className="text-gray-600"> ({activity.target.genre})</span>
            <span className="ml-1">{activity.target.flag}</span>
          </>
        );
      
      case 'save':
        return (
          <>
            <span className="font-medium text-gray-900">{activity.user.name}</span>
            <span className="text-gray-600"> {activity.action} </span>
            <span className="font-medium text-gray-900">{activity.target.title}</span>
            <span className="text-gray-600"> by {activity.target.author}</span>
            <span className="ml-1">{activity.target.flag}</span>
          </>
        );
      
      case 'review':
        return (
          <>
            <span className="font-medium text-gray-900">{activity.user.name}</span>
            <span className="text-gray-600"> {activity.action} </span>
            <span className="font-medium text-gray-900">{activity.target.title}</span>
            <span className="text-gray-600"> by {activity.target.author}</span>
            <div className="flex items-center ml-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < activity.target.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1">{activity.target.flag}</span>
          </>
        );
      
      case 'trending':
        return (
          <>
            <span className="font-medium text-gray-900">{activity.action} {activity.target.topic}</span>
            <span className="text-gray-600"> - {activity.target.count}</span>
            <span className="ml-1">{activity.target.flag}</span>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
          {isLive && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            isLive
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Icon */}
              <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {getActivityText(activity)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                  
                  {/* User/Target Flags */}
                  <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                    {activity.user && (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">{activity.user.flag}</span>
                        <span className="text-xs text-gray-500">{activity.user.country}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">Active Readers</span>
            </div>
            <div className="text-lg font-bold text-gray-900">2,847</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Books Today</span>
            </div>
            <div className="text-lg font-bold text-gray-900">156</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Countries</span>
            </div>
            <div className="text-lg font-bold text-gray-900">89</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Trending</span>
            </div>
            <div className="text-lg font-bold text-gray-900">Sci-Fi</div>
          </div>
        </div>
      </div>

      {/* View More */}
      <div className="text-center mt-6">
        <button className="text-yellow-600 font-medium hover:text-yellow-700 transition-colors">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default BookActivityFeed;
