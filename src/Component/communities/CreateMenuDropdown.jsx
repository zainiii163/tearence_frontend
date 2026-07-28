import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  FaPlus,
  FaTimes,
  FaTag,
  FaUsers,
  FaBriefcase,
  FaHome,
  FaCar,
  FaHeart,
  FaCalendar,
  FaStore,
  FaBuilding,
  FaChartLine,
} from 'react-icons/fa';
import CreatePostFlow from './CreatePostFlow';

const CreateMenuDropdown = ({ communityId = null, communityName = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: FaPlus, color: 'gray' },
    { id: 'property', name: 'Property & Real Estate', icon: FaHome, color: 'blue' },
    { id: 'business', name: 'Business & Companies', icon: FaBuilding, color: 'indigo' },
    { id: 'jobs', name: 'Jobs & Vacancies', icon: FaBriefcase, color: 'purple' },
    { id: 'vehicles', name: 'Vehicles & Transport', icon: FaCar, color: 'orange' },
    { id: 'charities', name: 'Charities & Donations', icon: FaHeart, color: 'red' },
    { id: 'events', name: 'Events & Entertainment', icon: FaCalendar, color: 'pink' },
    { id: 'services', name: 'Services & Solutions', icon: FaStore, color: 'green' },
    { id: 'funding', name: 'Funding & Investment', icon: FaChartLine, color: 'yellow' },
  ];

  const createOptions = {
    'post-ad': {
      title: 'Post Advertisement',
      description: 'Create a new listing to promote your product, service, or opportunity',
      icon: FaTag,
      color: 'blue',
      action: () => {
        setShowCreateFlow(true);
        setIsOpen(false);
      },
    },
    'start-discussion': {
      title: 'Start Discussion',
      description: 'Share your thoughts, ask questions, or start a conversation',
      icon: FaUsers,
      color: 'green',
      action: () => {
        setIsOpen(false);
        window.dispatchEvent(
          new CustomEvent('open-creation-modal', {
            detail: { type: 'discussion' },
          })
        );
      },
    },
    'create-community': {
      title: 'Create Community',
      description: 'Start a new community around a specific topic or interest',
      icon: FaUsers,
      color: 'purple',
      action: () => {
        window.dispatchEvent(
          new CustomEvent('open-creation-modal', {
            detail: { type: 'community' },
          })
        );
      },
    },
    'create-event': {
      title: 'Create Event',
      description: 'Organize and promote an event for your community',
      icon: FaCalendar,
      color: 'pink',
      action: () => {
        window.dispatchEvent(
          new CustomEvent('open-creation-modal', {
            detail: { type: 'event' },
          })
        );
      },
    },
  };

  const updateMenuPos = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 8,
      right: Math.max(8, window.innerWidth - rect.right),
    });
  };

  useLayoutEffect(() => {
    if (!isOpen) return undefined;
    updateMenuPos();
    window.addEventListener('resize', updateMenuPos);
    window.addEventListener('scroll', updateMenuPos, true);
    return () => {
      window.removeEventListener('resize', updateMenuPos);
      window.removeEventListener('scroll', updateMenuPos, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      const inTrigger = triggerRef.current?.contains(event.target);
      const inPanel = panelRef.current?.contains(event.target);
      if (!inTrigger && !inPanel) setIsOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleCreateAction = (actionId) => {
    const option = createOptions[actionId];
    if (option?.action) {
      option.action();
      setIsOpen(false);
    }
  };

  const filteredCreateOptions = Object.entries(createOptions);

  const menu = isOpen
    ? createPortal(
        <div
          ref={panelRef}
          className="fixed w-[min(24rem,calc(100vw-1.5rem))] bg-white border border-slate-200 rounded-lg shadow-2xl max-h-[min(80vh,32rem)] overflow-y-auto"
          style={{ top: menuPos.top, right: menuPos.right, zIndex: 300 }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Create Something New</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <FaTimes className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-slate-500 mb-2">Category:</p>
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <category.icon className="h-3 w-3" />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredCreateOptions.map(([id, option]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleCreateAction(id)}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <option.icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                        {option.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-2">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCreateAction('post-ad')}
                  className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Quick Ad Post
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateAction('start-discussion')}
                  className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Quick Discussion
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative z-50">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <FaPlus className="h-4 w-4" />
        <span className="hidden sm:inline">Create</span>
        <span className="inline-flex items-center gap-1" aria-hidden="true">
          <span className="w-1 h-1 rounded-full bg-current opacity-50" />
          <span className="w-1 h-1 rounded-full bg-current opacity-50" />
          <span className="w-1 h-1 rounded-full bg-current opacity-50" />
        </span>
      </button>

      {menu}

      <CreatePostFlow
        isOpen={showCreateFlow}
        onClose={() => setShowCreateFlow(false)}
        communityId={communityId}
        communityName={communityName}
      />
    </div>
  );
};

export default CreateMenuDropdown;
