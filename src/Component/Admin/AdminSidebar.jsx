import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  MapPin,
  Home,
  Settings,
  FileText,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Shield,
  Bell,
  Database,
  Tool,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    content: true,
    users: true,
    analytics: false,
    system: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    {
      section: 'dashboard',
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin/dashboard',
      exact: true
    },
    {
      section: 'content',
      title: 'Content Management',
      icon: <FileText className="w-5 h-5" />,
      children: [
        { title: 'Jobs', path: '/admin/jobs', icon: <Briefcase className="w-4 h-4" /> },
        { title: 'Candidates', path: '/admin/candidates', icon: <Users className="w-4 h-4" /> },
        { title: 'Events', path: '/admin/events', icon: <Calendar className="w-4 h-4" /> },
        { title: 'Venues', path: '/admin/venues', icon: <MapPin className="w-4 h-4" /> },
        { title: 'Properties', path: '/admin/properties', icon: <Home className="w-4 h-4" /> },
        { title: 'Services', path: '/admin/services', icon: <Settings className="w-4 h-4" /> },
        { title: 'Funding Projects', path: '/admin/funding', icon: <DollarSign className="w-4 h-4" /> },
      ]
    },
    {
      section: 'users',
      title: 'User Management',
      icon: <Users className="w-5 h-5" />,
      children: [
        { title: 'All Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
        { title: 'Roles & Permissions', path: '/admin/roles', icon: <Shield className="w-4 h-4" /> },
        { title: 'User Analytics', path: '/admin/user-analytics', icon: <TrendingUp className="w-4 h-4" /> },
      ]
    },
    {
      section: 'moderation',
      title: 'Moderation',
      icon: <Shield className="w-5 h-5" />,
      children: [
        { title: 'Post Moderation', path: '/admin/moderation', icon: <FileText className="w-4 h-4" /> },
        { title: 'Reported Content', path: '/admin/reports', icon: <MessageSquare className="w-4 h-4" /> },
        { title: 'Category Posts', path: '/admin/category-posts', icon: <FileText className="w-4 h-4" /> },
      ]
    },
    {
      section: 'analytics',
      title: 'Analytics',
      icon: <TrendingUp className="w-5 h-5" />,
      children: [
        { title: 'Overview', path: '/admin/analytics', icon: <LayoutDashboard className="w-4 h-4" /> },
        { title: 'Revenue Analytics', path: '/admin/revenue', icon: <DollarSign className="w-4 h-4" /> },
        { title: 'Listing Analytics', path: '/admin/listing-analytics', icon: <Database className="w-4 h-4" /> },
        { title: 'User Analytics', path: '/admin/user-analytics', icon: <Users className="w-4 h-4" /> },
      ]
    },
    {
      section: 'system',
      title: 'System',
      icon: <Settings className="w-5 h-5" />,
      children: [
        { title: 'System Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
        { title: 'Maintenance', path: '/admin/maintenance', icon: <Tool className="w-4 h-4" /> },
        { title: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-4 h-4" /> },
      ]
    }
  ];

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === path || location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const renderMenuItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections[item.section];
    const active = isActive(item.path);

    if (hasChildren) {
      return (
        <div key={item.section} className="mb-2">
          <button
            onClick={() => toggleSection(item.section)}
            className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
              active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium">{item.title}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive(child.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {child.icon}
                  <span className="text-sm">{child.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {item.icon}
        <span className="font-medium">{item.title}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-full">
          {menuItems.map(renderMenuItem)}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Administrator</p>
              <p className="text-xs text-gray-500">admin@wwa.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
