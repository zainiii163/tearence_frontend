import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaCompass, FaArrowRight } from 'react-icons/fa';

const SHORTCUTS = [
  {
    title: 'Groups & Clubs',
    body: 'Discover topic communities and local groups to join.',
    to: '/communities/my-communities',
    icon: FaUsers,
    tone: 'teal',
  },
  {
    title: 'Meets & Events',
    body: 'Community gatherings, launches and meetups near you.',
    to: '/events-venues',
    icon: FaCalendarAlt,
    tone: 'violet',
  },
  {
    title: 'Discover',
    body: 'Browse trending communities and people to follow.',
    to: '/communities/discover',
    icon: FaCompass,
    tone: 'sky',
  },
];

/**
 * Vehicle Hub–style discovery cards under the feed.
 */
const SocialHubShortcuts = () => (
  <section className="social-hub-shortcuts" aria-label="Explore Social Hub">
    {SHORTCUTS.map((item) => (
      <Link
        key={item.to}
        to={item.to}
        className={`social-hub-shortcut social-hub-shortcut--${item.tone}`}
      >
        <span className="social-hub-shortcut-icon">
          <item.icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
        <span className="social-hub-shortcut-go">
          Open <FaArrowRight className="h-3 w-3" />
        </span>
      </Link>
    ))}
  </section>
);

export default SocialHubShortcuts;
