import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FaImage,
  FaCalendarAlt,
  FaPoll,
  FaUsers,
  FaVideo,
  FaPen,
} from 'react-icons/fa';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

const ACTIONS = [
  { id: 'media', label: 'Media', icon: FaImage, type: 'discussion' },
  { id: 'event', label: 'Event', icon: FaCalendarAlt, type: 'event' },
  { id: 'poll', label: 'Poll', icon: FaPoll, type: 'poll' },
  { id: 'group', label: 'Create a group', icon: FaUsers, type: 'community' },
];

/**
 * Vehicle Hub–style composer (Instagram / Facebook feel).
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

  const open = (type = 'discussion') => {
    if (!requireAuthModal('/communities', 'Log in to post photos, videos, and comments.')) {
      return;
    }
    onOpenCreate?.(type);
  };

  return (
    <section className="social-composer">
      <div className="social-composer-label">
        <FaVideo className="h-3.5 w-3.5 text-teal-600" />
        <span>Photos / Videos</span>
        <span className="social-composer-label-muted">Post</span>
      </div>

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
            : 'Log in to post photos, videos, and comments.'}
        </button>
        <button
          type="button"
          className="social-composer-post-btn"
          onClick={() => open('discussion')}
        >
          <FaPen className="h-3 w-3" />
          Post
        </button>
      </div>

      <div className="social-composer-actions" role="toolbar" aria-label="Create content">
        {ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            className={`social-composer-action${
              action.id === 'media' ? ' social-composer-action--media' : ''
            }`}
            onClick={() => open(action.type)}
          >
            <action.icon className="h-3.5 w-3.5" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {!isAuthenticated && (
        <p className="social-composer-login-hint">
          <Link to="/Login" className="font-semibold text-teal-700 hover:underline">
            Log in
          </Link>{' '}
          to join the Social Hub community.
        </p>
      )}
    </section>
  );
};

export default SocialComposerCard;
