import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaHeart,
  FaCompass,
  FaUsers,
  FaBookmark,
  FaBuilding,
  FaBriefcase,
  FaHome as FaHouse,
  FaCar,
  FaCalendar,
  FaIndustry,
  FaTags,
  FaBook,
  FaChartLine,
  FaHandHoldingHeart,
  FaPlane,
  FaStore,
  FaFlag,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

const CATEGORIES = [
  { id: 'buy-sell', name: 'Buy & Sell', icon: FaTags },
  { id: 'business', name: 'Business', icon: FaBuilding },
  { id: 'services', name: 'Services', icon: FaIndustry },
  { id: 'jobs', name: 'Jobs', icon: FaBriefcase },
  { id: 'property', name: 'Property', icon: FaHouse },
  { id: 'events', name: 'Events', icon: FaCalendar },
  { id: 'vehicles', name: 'Vehicles', icon: FaCar },
  { id: 'funding', name: 'Funding', icon: FaChartLine },
  { id: 'charities', name: 'Charities', icon: FaHandHoldingHeart },
  { id: 'books', name: 'Books', icon: FaBook },
  { id: 'travel', name: 'Travel', icon: FaPlane },
  { id: 'stores', name: 'Stores', icon: FaStore },
  { id: 'classifieds', name: 'Classifieds', icon: FaFlag },
];

const NAV = [
  { id: 'feed', label: 'Home Feed', icon: FaHome },
  { id: 'foryou', label: 'For You', icon: FaHeart },
  { id: 'following', label: 'Following', icon: FaUsers },
  { id: 'local', label: 'Stories / Local', icon: FaCompass },
];

const LINKS = [
  { id: 'my-communities', label: 'Groups', icon: FaUsers, to: '/communities/my-communities' },
  { id: 'discover', label: 'Marketplace / Ads', icon: FaCompass, to: '/communities/discover' },
  { id: 'saved', label: 'Saved', icon: FaBookmark, to: '/communities/saved' },
];

/**
 * Left rail — fits fully on screen (no internal scroll).
 */
const CommunitiesLeftRail = ({ activeTab, onTabChange, selectedCategory, onCategorySelect }) => {
  const { userDetail, logIn } = useSelector((store) => store.auth);
  const user = userDetail?.data || userDetail || {};

  const displayName =
    user.name ||
    [user.first_name, user.last_name].filter(Boolean).join(' ') ||
    user.username ||
    'Member';

  return (
    <div className="communities-rail communities-rail--fit">
      {logIn && (
        <div className="communities-rail-panel px-2.5 py-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{displayName}</p>
              <p className="text-[10px] text-slate-500 truncate">
                @{user.username || user.email?.split('@')[0] || 'member'}
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="communities-rail-panel p-1 shrink-0">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`communities-nav-item communities-nav-item--compact ${
              activeTab === item.id ? 'is-active' : ''
            }`}
          >
            <item.icon className="h-3 w-3 shrink-0" />
            {item.label}
          </button>
        ))}
        <div className="my-0.5 mx-1 border-t border-slate-100/80" />
        {LINKS.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className="communities-nav-item communities-nav-item--compact"
          >
            <item.icon className="h-3 w-3 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="communities-rail-panel p-2 flex-1 min-h-0 overflow-hidden">
        <h3 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5 px-0.5 text-center">
          Trending tags
        </h3>
        <div className="communities-cat-grid">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              title={category.name}
              onClick={() =>
                onCategorySelect(selectedCategory === category.id ? null : category.id)
              }
              className={`communities-cat-chip ${
                selectedCategory === category.id ? 'is-active' : ''
              }`}
            >
              <category.icon className="h-3 w-3 shrink-0" />
              <span className="truncate">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunitiesLeftRail;
