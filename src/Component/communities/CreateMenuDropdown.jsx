import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaTimes, FaTag, FaUsers, FaBriefcase, FaHome, FaCar, FaHeart, FaCalendar, FaStore, FaBuilding, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CreatePostFlow from './CreatePostFlow';

const CreateMenuDropdown = ({ communityId = null, communityName = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Define categories to display in create menu
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
        // Open the CreatePostFlow for ad creation
        setShowCreateFlow(true);
        setIsOpen(false);
      }
    },
    'start-discussion': {
      title: 'Start Discussion',
      description: 'Share your thoughts, ask questions, or start a conversation',
      icon: FaUsers,
      color: 'green',
      action: () => {
        // Open the CreatePostFlow for discussion creation
        setShowCreateFlow(true);
        setIsOpen(false);
      }
    },
    'create-community': {
      title: 'Create Community',
      description: 'Start a new community around a specific topic or interest',
      icon: FaUsers,
      color: 'purple',
      action: () => {
        console.log('Create Community clicked');
        // This will be handled by the parent component with modal
        // The modal integration is handled in the parent component
        window.dispatchEvent(new CustomEvent('open-creation-modal', { 
          detail: { type: 'community' } 
        }));
      }
    },
    'create-event': {
      title: 'Create Event',
      description: 'Organize and promote an event for your community',
      icon: FaCalendar,
      color: 'pink',
      action: () => {
        console.log('Create Event clicked');
        // This will be handled by the parent component with modal
        // The modal integration is handled in the parent component
        window.dispatchEvent(new CustomEvent('open-creation-modal', { 
          detail: { type: 'event' } 
        }));
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleCreateAction = (actionId) => {
    const option = createOptions[actionId];
    if (option && option.action) {
      option.action();
      setIsOpen(false); // Close dropdown after action
    }
  };

  const filteredCreateOptions = activeCategory === 'all' 
    ? Object.entries(createOptions)
    : Object.entries(createOptions).filter(([id, option]) => {
        // Filter options based on category - this is simplified
        // In a real implementation, you'd have more sophisticated filtering
        return true;
      });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors relative z-10"
      >
        <FaPlus className="h-4 w-4" />
        <span className="hidden sm:inline">Create</span>
        <span className="inline-flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
          <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
          <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-background border rounded-lg shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Create Something New</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-accent rounded"
              >
                <FaTimes className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Category:</p>
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === category.id
                        ? `bg-${category.color}-100 text-${category.color}-700`
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <category.icon className="h-3 w-3" />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Options */}
            <div className="space-y-2">
              {filteredCreateOptions.map(([id, option]) => (
                <button
                  key={id}
                  onClick={() => handleCreateAction(id)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${option.color}-100 flex items-center justify-center flex-shrink-0`}>
                      <option.icon className={`h-5 w-5 text-${option.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {option.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCreateAction('post-ad')}
                  className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Quick Ad Post
                </button>
                <button
                  onClick={() => handleCreateAction('start-discussion')}
                  className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Quick Discussion
                </button>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-4 pt-4 border-t">
              <div className="text-xs text-muted-foreground">
                <p>Need help? Check our <a href="/help/creating" className="text-primary hover:underline">creation guides</a></p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Post Flow Modal */}
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
