import React, { useState } from 'react';
import { 
  Home, 
  Compass, 
  Bookmark, 
  Globe, 
  Users,
  TrendingUp,
  MapPin,
  Heart,
  Car,
  Building,
  Briefcase,
  Calendar,
  DollarSign,
  Book,
  Hotel,
  Store,
  Star,
  ChevronDown,
  ChevronRight,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LeftRail = ({ user }) => {
  const [expandedSection, setExpandedSection] = useState('profile');
  const navigate = useNavigate();

  const categories = [
    { id: 'buy-sell', name: 'Buy & Sell', icon: Store, color: 'blue' },
    { id: 'business', name: 'Business & Companies', icon: Building, color: 'indigo' },
    { id: 'services', name: 'Services & Solutions', icon: Users, color: 'gray' },
    { id: 'jobs', name: 'Jobs & Vacancies', icon: Briefcase, color: 'purple' },
    { id: 'property', name: 'Property & Real Estate', icon: Home, color: 'blue' },
    { id: 'events', name: 'Events & Entertainment', icon: Calendar, color: 'pink' },
    { id: 'vehicles', name: 'Vehicles & Transport', icon: Car, color: 'orange' },
    { id: 'funding', name: 'Funding & Investment', icon: DollarSign, color: 'green' },
    { id: 'charities', name: 'Charities & Donations', icon: Heart, color: 'red' },
    { id: 'books', name: 'Books & Literature', icon: Book, color: 'amber' },
    { id: 'travel', name: 'Resorts & Travel', icon: Hotel, color: 'cyan' },
    { id: 'investment', name: 'Investment Opportunities', icon: TrendingUp, color: 'emerald' },
    { id: 'stores', name: 'Online Stores', icon: Store, color: 'teal' },
    { id: 'classifieds', name: 'Classifieds', icon: Globe, color: 'slate' },
    { id: 'affiliate', name: 'Affiliate Hub / Advertising', icon: Star, color: 'yellow' }
  ];

  const primaryNavigation = [
    { id: 'feed', name: 'Feed', icon: Home, path: '/communities' },
    { id: 'for-you', name: 'For You', icon: Compass, path: '/communities?view=for-you' },
    { id: 'following', name: 'Following', icon: Users, path: '/communities?view=following' },
    { id: 'local', name: 'Local', icon: MapPin, path: '/communities?view=local' }
  ];

  const secondaryNavigation = [
    { id: 'my-communities', name: 'My Communities', icon: Users, path: '/communities/my-communities' },
    { id: 'discover', name: 'Discover Communities', icon: Compass, path: '/communities/discover' },
    { id: 'saved', name: 'Saved Ads & Threads', icon: Bookmark, path: '/communities/saved' }
  ];

  const handleLogout = () => {
    // Implement logout logic
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="w-70 space-y-6">
      {/* Profile Summary Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-primary" />
            )}
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-gray-900">{user?.name || 'John Doe'}</h3>
            <p className="text-sm text-gray-500">{user?.handle || '@johndoe'}</p>
            
            {/* Country Flag */}
            {user?.country && (
              <div className="flex items-center justify-center mt-1">
                <span className={`text-2xl fi fi-${user.country}`}></span>
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Posts</span>
              <span className="font-medium text-gray-900">{user?.stats?.posts || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Communities</span>
              <span className="font-medium text-gray-900">{user?.stats?.communities || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Reputation</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium text-gray-900">{user?.stats?.reputation?.toFixed(1) || '0.0'}</span>
              </div>
            </div>
          </div>
          
          <Link
            to="/account"
            className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium text-center"
          >
            View Profile
          </Link>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
          <div className="space-y-1">
            {primaryNavigation.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <item.icon className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Access</h3>
          <div className="space-y-1">
            {secondaryNavigation.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <item.icon className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Category Shortcuts */}
      <div className="bg-white rounded-lg border border-gray-200">
        <button
          onClick={() => toggleSection('categories')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-lg"
        >
          <h3 className="font-semibold text-gray-900">Categories</h3>
          <ChevronDown 
            className={`w-4 h-4 text-gray-600 transition-transform ${
              expandedSection === 'categories' ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        {expandedSection === 'categories' && (
          <div className="px-4 pb-4 space-y-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/${category.id}`}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <category.icon 
                  className={`w-4 h-4 text-${category.color}-600 group-hover:text-${category.color}-700`}
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{category.name}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Settings & Logout */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 space-y-1">
          <Link
            to="/account/settings"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <Settings className="w-4 h-4 text-gray-600 group-hover:text-primary" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Settings</span>
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors group"
          >
            <LogOut className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-red-900">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftRail;
