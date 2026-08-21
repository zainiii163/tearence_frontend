import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  FaImage,
  FaCalendarAlt,
  FaPoll,
  FaUsers,
  FaVideo,
  FaPen,
  FaChevronDown,
} from 'react-icons/fa';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

const ACTIONS = [
  { id: 'media', label: 'Photos / videos', icon: FaImage, type: 'discussion' },
  { id: 'event', label: 'Event', icon: FaCalendarAlt, type: 'event' },
  { id: 'poll', label: 'Poll', icon: FaPoll, type: 'poll' },
  { id: 'group', label: 'Create a group', icon: FaUsers, type: 'community' },
];

/**
 * Compact composer — create actions in a dropdown (not a horizontal strip).
 */
const SocialComposerCard = ({ onOpenCreate }) => {
  const { requireAuthModal, isAuthenticated } = useAuthRedirect();
  const { userDetail, logIn } = useSelector((store) => store.auth || {});
  const user = userDetail?.data || userDetail || {};
  const displayName =
    user.name ||
    [user.first_name, user.last_name].filter(Boolean).join(' ') ||
    user.username ||
    'Member';
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const open = (type = 'discussion') => {
    if (!requireAuthModal('/communities', 'Log in to post photos, videos, and comments.')) {
      return;
    }
    setMenuOpen(false);
    onOpenCreate?.(type);
  };

  return (
    <section className="social-composer">
      <div className="social-composer-top">
        <div className="social-composer-avatar" aria-hidden="true">
          {logIn && user.avatar ? (
            <img src={user.avatar} alt="" />
          ) : (
            <span>{displayName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <button
          type="button"
          className="social-composer-input"
          onClick={() => open('discussion')}
        >
          {isAuthenticated
            ? `What's on your mind, ${displayName.split(' ')[0]}?`
            : 'Share a photo, video, or update…'}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="social-composer-post-btn"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <FaPen className="h-3 w-3" />
            <span>Create</span>
            <FaChevronDown className="h-2.5 w-2.5 opacity-80" />
          </button>
          {menuOpen && (
            <div className="social-composer-create-menu" role="menu">
              {ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  role="menuitem"
                  onClick={() => open(action.type)}
                >
                  <action.icon className="h-3.5 w-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        className="social-composer-media-chip"
        onClick={() => open('discussion')}
      >
        <FaVideo className="h-3 w-3 text-teal-600" />
        Photos &amp; videos
      </button>
    </section>
  );
};

export default SocialComposerCard;
