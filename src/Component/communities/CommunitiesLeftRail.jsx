import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  FaCalendarAlt,
  FaIndustry,
  FaTags,
  FaBook,
  FaChartLine,
  FaHandHoldingHeart,
  FaPlane,
  FaStore,
  FaFlag,
  FaPlus,
  FaPoll,
  FaComments,
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

/** Primary feed tabs — Home first (what users land on). */
const NAV = [
  { id: 'feed', label: 'Home', icon: FaHome },
  { id: 'foryou', label: 'For You', icon: FaHeart },
  { id: 'following', label: 'Following', icon: FaUsers },
  { id: 'local', label: 'Local', icon: FaCompass },
];

/** Browse links merged from former Explore dropdown. */
const LINKS = [
  { id: 'discover', label: 'Communities', icon: FaCompass, to: '/communities/discover' },
  { id: 'my-communities', label: 'Groups', icon: FaUsers, to: '/communities/my-communities' },
  { id: 'saved', label: 'Saved', icon: FaBookmark, to: '/communities/saved' },
  { id: 'events', label: 'Events', icon: FaCalendarAlt, to: '/events-venues' },
];

const CREATE_ACTIONS = [
  { id: 'discussion', label: 'New post', icon: FaComments, type: 'discussion' },
  { id: 'poll', label: 'New poll', icon: FaPoll, type: 'poll' },
  { id: 'community', label: 'Create a group', icon: FaPlus, type: 'community' },
];

/**
 * Left rail — Home at top; Explore items live here; Join CTA at bottom.
 */
const CommunitiesLeftRail = ({
  activeTab,
  onTabChange,
  selectedCategory,
  onCategorySelect,
  onOpenCreate,
}) => {
  const location = useLocation();
  const { userDetail, logIn } = useSelector((store) => store.auth);
  const user = userDetail?.data || userDetail || {};

  const displayName =
    user.name ||
    [user.first_name, user.last_name].filter(Boolean).join(' ') ||
    user.username ||
    'Member';

  const path = location.pathname;

  return (
    <div className="communities-rail communities-rail--fit">
      {logIn ? (
        <div className="communities-rail-panel px-2.5 py-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-100 to-sky-100 overflow-hidden flex items-center justify-center text-sm font-semibold text-teal-800 shrink-0 communities-avatar-ring">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
              <p className="text-[11px] text-slate-500 truncate">
                @{user.username || user.email?.split('@')[0] || 'member'}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="communities-rail-panel p-1.5 shrink-0" aria-label="Feed">
        {NAV.map((item) => {
          const onHome = path === '/communities' || path === '/communities/';
          const isActive = onHome && activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`communities-nav-item communities-nav-item--compact ${
                isActive ? 'is-active' : ''
              }`}
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <nav className="communities-rail-panel p-1.5 shrink-0" aria-label="Browse">
        <p className="communities-rail-section-label">Browse</p>
        {LINKS.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className={`communities-nav-item communities-nav-item--compact ${
              path === item.to || path.startsWith(`${item.to}/`) ? 'is-active' : ''
            }`}
          >
            <item.icon className="h-3.5 w-3.5 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="communities-rail-panel p-1.5 shrink-0">
        <p className="communities-rail-section-label">Create</p>
        {CREATE_ACTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpenCreate?.(item.type)}
            className="communities-nav-item communities-nav-item--compact"
          >
            <item.icon className="h-3.5 w-3.5 shrink-0" />
            {item.label}
          </button>
        ))}
        <Link
          to="/communities/discover"
          className="communities-nav-item communities-nav-item--compact"
        >
          <FaUsers className="h-3.5 w-3.5 shrink-0" />
          Join a community
        </Link>
      </div>

      <div className="communities-rail-panel p-2">
        <h3 className="communities-rail-section-label mb-1.5">Categories</h3>
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

      {/* Guest join CTA — bottom of rail (Clive) */}
      {!logIn ? (
        <div className="communities-rail-panel communities-rail-join px-3 py-3 mt-auto">
          <p className="text-xs font-semibold text-slate-800 mb-0.5">Join the conversation</p>
          <p className="text-[11px] text-slate-500 mb-2 leading-snug">
            Sign in to post, follow groups, and comment.
          </p>
          <Link to="/Login" className="communities-rail-join-btn">
            Sign in
          </Link>
          <Link
            to="/Login?tab=signup"
            className="block text-center text-[11px] font-medium text-teal-700 hover:underline mt-1.5"
          >
            Create an account
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default CommunitiesLeftRail;
