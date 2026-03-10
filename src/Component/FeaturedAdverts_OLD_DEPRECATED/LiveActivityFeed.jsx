import React, { useState, useEffect } from 'react';
import { 
  FaEye, 
  FaStar, 
  FaPlus, 
  FaHeart, 
  FaGlobe, 
  FaFlag,
  FaCar,
  FaHome,
  FaBriefcase,
  FaUser,
  FaClock,
  FaArrowUp
} from 'react-icons/fa';

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isLive, setIsLive] = useState(true);

  // Sample live activities
  const sampleActivities = [
    {
      id: 1,
      type: 'view',
      user: { name: 'Marie Dubois', country: 'France', flag: '🇫🇷' },
      action: 'viewed a featured car',
      target: { title: 'Vintage Ferrari 250 GT', location: 'London, UK', flag: '🇬🇧' },
      timestamp: '2 minutes ago',
      icon: FaEye,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'new',
      user: { name: 'System', country: 'Global', flag: '🌍' },
      action: 'New featured advert added in',
      target: { title: 'Luxury Villa', location: 'Dubai, UAE', flag: '🇦🇪' },
      timestamp: '5 minutes ago',
      icon: FaPlus,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'save',
      user: { name: 'Ahmed Hassan', country: 'Nigeria', flag: '🇳🇬' },
      action: 'saved a property',
      target: { title: 'Befront Apartment', location: 'Lagos', flag: '🇳🇬' },
      timestamp: '8 minutes ago',
      icon: FaHeart,
      color: 'text-red-500'
    },
    {
      id: 4,
      type: 'rating',
      user: { name: 'John Smith', country: 'USA', flag: '🇺🇸' },
      action: 'rated a seller',
      target: { title: 'Elite Properties', rating: 5, flag: '🇺🇸' },
      timestamp: '12 minutes ago',
      icon: FaStar,
      color: 'text-yellow-500'
    },
    {
      id: 5,
      type: 'view',
      user: { name: 'Yuki Tanaka', country: 'Japan', flag: '🇯🇵' },
      action: 'viewed a business opportunity',
      target: { title: 'Tech Startup Investment', location: 'Singapore', flag: '🇸🇬' },
      timestamp: '15 minutes ago',
      icon: FaEye,
      color: 'text-blue-500'
    },
    {
      id: 6,
      type: 'new',
      user: { name: 'System', country: 'Global', flag: '🌍' },
      action: 'New featured advert added in',
      target: { title: 'Designer Handbag Collection', location: 'Milan', flag: '🇮🇹' },
      timestamp: '18 minutes ago',
      icon: FaPlus,
      color: 'text-green-500'
    },
    {
      id: 7,
      type: 'save',
      user: { name: 'Priya Sharma', country: 'India', flag: '🇮🇳' },
      action: 'saved an education course',
      target: { title: 'Executive MBA Program', location: 'Online', flag: '🌐' },
      timestamp: '22 minutes ago',
      icon: FaHeart,
      color: 'text-red-500'
    },
    {
      id: 8,
      type: 'view',
      user: { name: 'Carlos Rodriguez', country: 'Spain', flag: '🇪🇸' },
      action: 'viewed a travel package',
      target: { title: 'Caribbean Resort', location: 'Maldives', flag: '🇲🇻' },
      timestamp: '25 minutes ago',
      icon: FaEye,
      color: 'text-blue-500'
    }
  ];

  useEffect(() => {
    setActivities(sampleActivities);

    // Simulate live updates
    if (!isLive) return;

    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: ['view', 'new', 'save', 'rating'][Math.floor(Math.random() * 4)],
        user: {
          name: ['Emma Wilson', 'Liu Wei', 'Mohammed Ali', 'Sophie Martin'][Math.floor(Math.random() * 4)],
          country: ['UK', 'China', 'Egypt', 'France'][Math.floor(Math.random() * 4)],
          flag: ['🇬🇧', '🇨🇳', '🇪🇬', '🇫🇷'][Math.floor(Math.random() * 4)]
        },
        action: ['viewed a featured property', 'saved a car', 'rated a seller'][Math.floor(Math.random() * 3)],
        target: {
          title: ['Luxury Apartment', 'Vintage Car', 'Premium Service'][Math.floor(Math.random() * 3)],
          location: ['Paris', 'Tokyo', 'New York'][Math.floor(Math.random() * 3)],
          flag: ['🇫🇷', '🇯🇵', '🇺🇸'][Math.floor(Math.random() * 3)]
        },
        timestamp: 'Just now',
        icon: [FaEye, FaHeart, FaStar][Math.floor(Math.random() * 3)],
        color: ['text-blue-500', 'text-red-500', 'text-yellow-500'][Math.floor(Math.random() * 3)]
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 7)]);
    }, 8000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'view':
        return FaEye;
      case 'new':
        return FaPlus;
      case 'save':
        return FaHeart;
      case 'rating':
        return FaStar;
      default:
        return FaGlobe;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'view':
        return 'text-blue-500';
      case 'new':
        return 'text-green-500';
      case 'save':
        return 'text-red-500';
      case 'rating':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FaGlobe className="h-6 w-6 text-purple-600" />
              {isLive && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Live Activity Feed</h3>
              <p className="text-sm text-gray-600">Real-time global activity</p>
            </div>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLive 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="max-h-96 overflow-y-auto">
        <div className="p-4 space-y-3">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            const isNew = index === 0 && activity.timestamp === 'Just now';
            
            return (
              <div
                key={activity.id}
                className={`flex items-start space-x-3 p-3 rounded-xl transition-all duration-300 ${
                  isNew ? 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200' : 'hover:bg-gray-50'
                }`}
              >
                {/* Activity Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {activity.user.name}
                    </span>
                    <span className="text-lg">{activity.user.flag}</span>
                    {isNew && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{activity.action}</span>
                    {activity.target.title && (
                      <span className="font-semibold text-purple-600 ml-1">
                        "{activity.target.title}"
                      </span>
                    )}
                    {activity.target.location && (
                      <span className="text-gray-600 ml-1">
                        in {activity.target.location} {activity.target.flag}
                      </span>
                    )}
                    {activity.target.rating && (
                      <span className="text-yellow-500 ml-1">
                        {'⭐'.repeat(activity.target.rating)}
                      </span>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                    <FaClock className="h-3 w-3" />
                    <span>{activity.timestamp}</span>
                  </div>
                </div>

                {/* Activity Type Indicator */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  activity.type === 'view' ? 'bg-blue-500' :
                  activity.type === 'new' ? 'bg-green-500' :
                  activity.type === 'save' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaArrowUp className="h-4 w-4 text-green-500" />
            <span>High activity detected</span>
          </div>
          <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveActivityFeed;
