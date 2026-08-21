import React from 'react';
import {
  FaHome,
  FaFire,
  FaPlus,
  FaCompass,
  FaUserFriends,
} from 'react-icons/fa';

const ITEMS = [
  { id: 'feed', label: 'Home', icon: FaHome },
  { id: 'foryou', label: 'For You', icon: FaFire },
  { id: 'create', label: 'Create', icon: FaPlus, create: true },
  { id: 'following', label: 'Following', icon: FaUserFriends },
  { id: 'discover', label: 'Explore', icon: FaCompass, path: '/communities/discover' },
];

/**
 * TikTok / Instagram-style bottom nav for Social Hub (mobile).
 */
const SocialHubMobileNav = ({ activeTab, onTabChange, onCreate, onExplore }) => (
  <nav className="social-hub-mobile-nav" aria-label="Social Hub">
    {ITEMS.map((item) => {
      const active =
        !item.create &&
        !item.path &&
        activeTab === item.id;
      return (
        <button
          key={item.id}
          type="button"
          className={`social-hub-mobile-nav-item${active ? ' is-active' : ''}${
            item.create ? ' is-create' : ''
          }`}
          onClick={() => {
            if (item.create) {
              onCreate?.('discussion');
              return;
            }
            if (item.path) {
              onExplore?.(item.path);
              return;
            }
            onTabChange?.(item.id);
          }}
        >
          <span className="social-hub-mobile-nav-icon">
            <item.icon />
          </span>
          <span className="social-hub-mobile-nav-label">{item.label}</span>
        </button>
      );
    })}
  </nav>
);

export default SocialHubMobileNav;
