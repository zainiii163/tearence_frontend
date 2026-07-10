import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaHeart, FaCompass, FaUsers, FaBookmark, FaBuilding, FaBriefcase, FaHome as FaHouse, FaCar, FaCalendar, FaIndustry, FaTags, FaBook, FaChartLine, FaHandHoldingHeart, FaPlane, FaStore, FaFlag, FaChevronRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const CommunitiesLeftRail = ({ activeTab, onTabChange, selectedCategory, onCategorySelect }) => {
  const location = useLocation();
  const { userDetail } = useSelector((store) => store.auth);
  const { logIn } = useSelector((store) => store.auth);

  const categories = [
    { id: 'buy-sell', name: 'Buy & Sell', icon: FaTags, slug: 'buy-sell' },
    { id: 'business', name: 'Business & Companies', icon: FaBuilding, slug: 'business' },
    { id: 'services', name: 'Services & Solutions', icon: FaIndustry, slug: 'services' },
    { id: 'jobs', name: 'Jobs & Vacancies', icon: FaBriefcase, slug: 'jobs' },
    { id: 'property', name: 'Property & Real Estate', icon: FaHouse, slug: 'property' },
    { id: 'events', name: 'Events & Entertainment', icon: FaCalendar, slug: 'events' },
    { id: 'vehicles', name: 'Vehicles & Transport', icon: FaCar, slug: 'vehicles' },
    { id: 'funding', name: 'Funding & Investment', icon: FaChartLine, slug: 'funding' },
    { id: 'charities', name: 'Charities & Donations', icon: FaHandHoldingHeart, slug: 'charities' },
    { id: 'books', name: 'Books & Literature', icon: FaBook, slug: 'books' },
    { id: 'travel', name: 'Resorts & Travel', icon: FaPlane, slug: 'travel' },
    { id: 'stores', name: 'Online Stores', icon: FaStore, slug: 'stores' },
    { id: 'classifieds', name: 'Classifieds', icon: FaFlag, slug: 'classifieds' },
    { id: 'affiliate', name: 'Affiliate Hub', icon: FaTags, slug: 'affiliate' },
  ];

  const navItems = [
    { id: 'feed', label: 'Feed', icon: FaHome },
    { id: 'foryou', label: 'For You', icon: FaHeart },
    { id: 'following', label: 'Following', icon: FaUsers },
    { id: 'local', label: 'Local', icon: FaCompass },
  ];

  const myCommunitiesItems = [
    { id: 'my-communities', label: 'My Communities', icon: FaUsers },
    { id: 'discover', label: 'Discover Communities', icon: FaCompass },
    { id: 'saved', label: 'Saved Ads & Threads', icon: FaBookmark },
  ];

  return (
    <div className="space-y-6 sticky top-20">
      
      {/* Profile Summary Card */}
      {logIn && userDetail?.data && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {userDetail.data.avatar ? (
                <img 
                  src={userDetail.data.avatar} 
                  alt={userDetail.data.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUsers className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{userDetail.data.name || 'User'}</p>
              <p className="text-sm text-muted-foreground truncate">
                @{userDetail.data.username || 'username'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="font-semibold">156</p>
              <p className="text-xs text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">12</p>
              <p className="text-xs text-muted-foreground">Communities</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">850</p>
              <p className="text-xs text-muted-foreground">Reputation</p>
            </div>
          </div>
          
          <Link
            to="/account"
            className="mt-4 w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
          >
            View Profile
          </Link>
        </div>
      )}

      {/* Primary Navigation */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* My Communities */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-2">
        <nav className="space-y-1">
          {myCommunitiesItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Trending Communities */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Trending Communities</h3>
          <Link
            to="/communities?tab=trending"
            className="text-xs text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="space-y-2">
          <Link
            to="/community/property-real-estate-uk"
            className="block p-3 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FaHouse className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">Property & Real Estate</h4>
                <p className="text-xs text-muted-foreground">1.2k members • UK</p>
              </div>
            </div>
          </Link>
          <Link
            to="/community/business-entrepreneurs"
            className="block p-3 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center flex-shrink-0">
                <FaBuilding className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">Business & Entrepreneurs</h4>
                <p className="text-xs text-muted-foreground">856 members • Global</p>
              </div>
            </div>
          </Link>
          <Link
            to="/community/tech-developers"
            className="block p-3 rounded-lg border hover:bg-accent transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center flex-shrink-0">
                <FaIndustry className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">Tech & Developers</h4>
                <p className="text-xs text-muted-foreground">643 members • Global</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Category Shortcuts */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <h3 className="font-semibold mb-3 text-sm">Categories</h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(selectedCategory === category.id ? null : category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <category.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{category.name}</span>
              {selectedCategory === category.id && (
                <FaChevronRight className="h-3 w-3" />
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CommunitiesLeftRail;
