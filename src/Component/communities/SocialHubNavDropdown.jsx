import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaChevronDown,
  FaUsers,
  FaCompass,
  FaBookmark,
  FaCalendarAlt,
  FaPlus,
  FaPoll,
  FaComments,
  FaHome,
  FaHeart,
} from 'react-icons/fa';

/**
 * Carservices-style explore menu: Communities, Groups, Events, Create… in one dropdown.
 */
const SocialHubNavDropdown = ({ onOpenCreate, onTabChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const create = (type) => {
    setOpen(false);
    onOpenCreate?.(type);
  };

  const tab = (id) => {
    setOpen(false);
    onTabChange?.(id);
  };

  return (
    <div className="social-hub-menu" ref={ref}>
      <button
        type="button"
        className="social-hub-menu-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        Explore
        <FaChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="social-hub-menu-panel" role="menu">
          <p className="social-hub-menu-label">Browse</p>
          <button type="button" role="menuitem" onClick={() => tab('feed')}>
            <FaHome className="h-3.5 w-3.5" /> Home feed
          </button>
          <button type="button" role="menuitem" onClick={() => tab('foryou')}>
            <FaHeart className="h-3.5 w-3.5" /> For You
          </button>
          <button type="button" role="menuitem" onClick={() => go('/communities/discover')}>
            <FaCompass className="h-3.5 w-3.5" /> Communities
          </button>
          <button type="button" role="menuitem" onClick={() => go('/communities/my-communities')}>
            <FaUsers className="h-3.5 w-3.5" /> Groups
          </button>
          <button type="button" role="menuitem" onClick={() => go('/communities/saved')}>
            <FaBookmark className="h-3.5 w-3.5" /> Saved
          </button>
          <button type="button" role="menuitem" onClick={() => go('/events-venues')}>
            <FaCalendarAlt className="h-3.5 w-3.5" /> Events
          </button>

          <p className="social-hub-menu-label">Create</p>
          <button type="button" role="menuitem" onClick={() => create('discussion')}>
            <FaComments className="h-3.5 w-3.5" /> New post
          </button>
          <button type="button" role="menuitem" onClick={() => create('poll')}>
            <FaPoll className="h-3.5 w-3.5" /> New poll
          </button>
          <button type="button" role="menuitem" onClick={() => create('community')}>
            <FaPlus className="h-3.5 w-3.5" /> Create a group
          </button>
          <Link
            to="/communities/discover"
            role="menuitem"
            className="social-hub-menu-link"
            onClick={() => setOpen(false)}
          >
            <FaUsers className="h-3.5 w-3.5" /> Join a community
          </Link>
        </div>
      )}
    </div>
  );
};

export default SocialHubNavDropdown;
