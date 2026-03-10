import React, { useState, useEffect } from 'react';
import { Activity, Users, MapPin, Calendar, Eye, Heart, TrendingUp, Clock } from 'lucide-react';

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'event_view',
      message: 'A user from France viewed a concert in London',
      timestamp: '2 minutes ago',
      icon: Eye,
      color: 'text-purple-600'
    },
    {
      id: 2,
      type: 'new_event',
      message: 'New workshop added in Manchester',
      timestamp: '5 minutes ago',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'new_venue',
      message: 'A venue listed in Dubai',
      timestamp: '8 minutes ago',
      icon: MapPin,
      color: 'text-teal-600'
    },
    {
      id: 4,
      type: 'booking',
      message: 'Conference hall booked in New York',
      timestamp: '12 minutes ago',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: 5,
      type: 'trending',
      message: 'Music festival trending in Barcelona',
      timestamp: '15 minutes ago',
      icon: TrendingUp,
      color: 'text-amber-600'
    }
  ]);

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newActivities = [
        'A user from Germany viewed a wedding venue in Italy',
        'New business conference announced in Tokyo',
        'Restaurant venue listed in Paris',
        'Art exhibition trending in Amsterdam',
        'Sports event booking confirmed in Sydney',
        'User from Spain saved a concert in Madrid',
        'New festival added in Rio de Janeiro',
        'Conference center booked in Toronto',
        'User from Canada viewed a workshop in Vancouver',
        'Outdoor venue listed in Los Angeles'
      ];

      const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
      const icons = [Eye, Calendar, MapPin, Users, TrendingUp, Heart];
      const colors = ['text-purple-600', 'text-blue-600', 'text-teal-600', 'text-green-600', 'text-amber-600'];
      
      const newActivity = {
        id: Date.now(),
        type: 'random',
        message: randomActivity,
        timestamp: 'Just now',
        icon: icons[Math.floor(Math.random() * icons.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getIconComponent = (IconComponent) => {
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">{isLive ? 'Live' : 'Paused'}</span>
          <button
            onClick={() => setIsLive(!isLive)}
            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
              {getIconComponent(activity.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{activity.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default LiveActivityFeed;
