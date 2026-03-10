import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Eye, 
  Heart, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Globe,
  Star,
  Award,
  Clock,
  Pause,
  Play,
  RefreshCw,
  MapPin,
  DollarSign,
  Hash
} from 'lucide-react';

const BooksActivityFeed = ({ compact = false }) => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalAuthors: 0,
    totalViews: 0,
    totalSaves: 0,
    activeCountries: 0,
    topGenres: [],
    trendingBooks: []
  });
  const [isPaused, setIsPaused] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const intervalRef = useRef(null);

  // Generate mock activities
  const generateActivity = () => {
    const activities = [
      {
        id: Date.now(),
        type: 'view',
        user: getRandomUser(),
        book: getRandomBook(),
        location: getRandomLocation(),
        timestamp: new Date(),
        icon: Eye,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        id: Date.now() + 1,
        type: 'save',
        user: getRandomUser(),
        book: getRandomBook(),
        location: getRandomLocation(),
        timestamp: new Date(),
        icon: Heart,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      },
      {
        id: Date.now() + 2,
        type: 'new_book',
        user: getRandomUser(),
        book: getRandomBook(),
        location: getRandomLocation(),
        timestamp: new Date(),
        icon: BookOpen,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        id: Date.now() + 3,
        type: 'review',
        user: getRandomUser(),
        book: getRandomBook(),
        location: getRandomLocation(),
        rating: Math.floor(Math.random() * 3) + 3,
        timestamp: new Date(),
        icon: Star,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      },
      {
        id: Date.now() + 4,
        type: 'purchase',
        user: getRandomUser(),
        book: getRandomBook(),
        location: getRandomLocation(),
        timestamp: new Date(),
        icon: DollarSign,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      }
    ];

    return activities[Math.floor(Math.random() * activities.length)];
  };

  const getRandomUser = () => {
    const users = [
      'Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Brown', 'Lisa Anderson',
      'James Taylor', 'Maria Garcia', 'Robert Smith', 'Jennifer Davis', 'William Miller'
    ];
    return users[Math.floor(Math.random() * users.length)];
  };

  const getRandomBook = () => {
    const books = [
      'The Great Adventure', 'Mystery of the Lost City', 'Cooking Masterclass',
      'JavaScript Guide', 'Digital Marketing 101', 'The Art of Photography',
      'Science Fiction Stories', 'Historical Chronicles', 'Business Success Secrets',
      'Travel Around the World', 'Poetry Collection', 'Children\'s Fairy Tales'
    ];
    return books[Math.floor(Math.random() * books.length)];
  };

  const getRandomLocation = () => {
    const locations = [
      'New York, USA', 'London, UK', 'Tokyo, Japan', 'Paris, France',
      'Sydney, Australia', 'Toronto, Canada', 'Berlin, Germany', 'Mumbai, India',
      'São Paulo, Brazil', 'Dubai, UAE', 'Singapore', 'Amsterdam, Netherlands'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'view':
        return `viewed "${activity.book}"`;
      case 'save':
        return `saved "${activity.book}" to favorites`;
      case 'new_book':
        return `published "${activity.book}"`;
      case 'review':
        return `reviewed "${activity.book}" - ${activity.rating}⭐`;
      case 'purchase':
        return `purchased "${activity.book}"`;
      default:
        return 'interacted with a book';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  const addNewActivity = () => {
    if (isPaused) return;
    
    const newActivity = generateActivity();
    setActivities(prev => [newActivity, ...prev].slice(0, compact ? 5 : 10));
    setLastUpdate(new Date());
  };

  const refreshFeed = () => {
    setActivities([]);
    // Add multiple activities to simulate refresh
    for (let i = 0; i < 3; i++) {
      setTimeout(() => addNewActivity(), i * 100);
    }
  };

  useEffect(() => {
    // Initial activities
    for (let i = 0; i < 5; i++) {
      setTimeout(() => addNewActivity(), i * 200);
    }

    // Set up interval for live updates
    intervalRef.current = setInterval(() => {
      addNewActivity();
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  useEffect(() => {
    // Generate stats
    setStats({
      totalBooks: Math.floor(Math.random() * 50000) + 10000,
      totalAuthors: Math.floor(Math.random() * 10000) + 2000,
      totalViews: Math.floor(Math.random() * 1000000) + 500000,
      totalSaves: Math.floor(Math.random() * 100000) + 50000,
      activeCountries: Math.floor(Math.random() * 50) + 100,
      topGenres: [
        { name: 'Fiction', count: Math.floor(Math.random() * 10000) + 5000 },
        { name: 'Non-Fiction', count: Math.floor(Math.random() * 8000) + 4000 },
        { name: 'Mystery', count: Math.floor(Math.random() * 6000) + 3000 },
        { name: 'Romance', count: Math.floor(Math.random() * 5000) + 2500 },
        { name: 'Science Fiction', count: Math.floor(Math.random() * 4000) + 2000 }
      ],
      trendingBooks: [
        { title: 'The Great Adventure', views: Math.floor(Math.random() * 10000) + 5000 },
        { title: 'Mystery of the Lost City', views: Math.floor(Math.random() * 8000) + 4000 },
        { title: 'Cooking Masterclass', views: Math.floor(Math.random() * 6000) + 3000 },
        { title: 'JavaScript Guide', views: Math.floor(Math.random() * 5000) + 2500 },
        { title: 'Digital Marketing 101', views: Math.floor(Math.random() * 4000) + 2000 }
      ]
    });
  }, []);

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Live Activity</h3>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-600">Live</span>
            </div>
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {activities.slice(0, 3).map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-start gap-3"
              >
                <div className={`p-1.5 rounded-lg ${activity.bgColor}`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-gray-600">{getActivityText(activity)}</span>
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {activity.location} • {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {stats.totalBooks.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Total Books</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {stats.totalAuthors.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Authors</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Live Activity Feed</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Live updates</span>
                <span>•</span>
                <span>Last updated: {formatTimestamp(lastUpdate)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={refreshFeed}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`p-2 rounded-lg transition-colors ${
                isPaused ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'
              }`}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalBooks.toLocaleString()}
              </div>
            </div>
            <div className="text-sm text-gray-600">Total Books</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalAuthors.toLocaleString()}
              </div>
            </div>
            <div className="text-sm text-gray-600">Authors</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900">
                {(stats.totalViews / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-orange-600" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.activeCountries}
              </div>
            </div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <h4 className="font-medium text-gray-900 mb-4">Recent Activity</h4>
            <div className="space-y-4">
              <AnimatePresence>
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-gray-600">{getActivityText(activity)}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {activity.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Genres */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Top Genres
              </h4>
              <div className="space-y-2">
                {stats.topGenres.map((genre, index) => (
                  <div key={genre.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        #{index + 1}
                      </span>
                      <span className="text-sm text-gray-900">{genre.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {genre.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Books */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending Books
              </h4>
              <div className="space-y-2">
                {stats.trendingBooks.map((book, index) => (
                  <div key={book.title} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        #{index + 1}
                      </span>
                      <span className="text-sm text-gray-900 truncate max-w-[120px]">
                        {book.title}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {book.views.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksActivityFeed;
