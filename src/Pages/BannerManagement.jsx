import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign,
  Eye,
  MousePointer,
  Calendar,
  Target,
  Globe,
  Settings,
  Plus,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import BannerDisplay from '../Component/Banner/BannerDisplay';
import { getBannerStats } from '../api/banner';

const BannerManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'banners', label: 'All Banners', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await getBannerStats();
      if (response?.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'overview') {
      loadStats();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} loading={loading} />;
      case 'banners':
        return <BannerDisplay showCreateButton={true} />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-2">Manage your banner advertisements and track performance</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

const OverviewTab = ({ stats, loading }) => {
  const overviewCards = [
    {
      title: 'Total Banners',
      value: stats?.total_banners || 0,
      change: stats?.total_banners_change || '+12%',
      changeType: 'positive',
      icon: Eye,
      color: 'blue'
    },
    {
      title: 'Active Campaigns',
      value: stats?.active_campaigns || 0,
      change: stats?.active_campaigns_change || '+8%',
      changeType: 'positive',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Total Impressions',
      value: stats?.total_impressions ? stats.total_impressions.toLocaleString() : '0',
      change: stats?.impressions_change || '+23%',
      changeType: 'positive',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Total Clicks',
      value: stats?.total_clicks ? stats.total_clicks.toLocaleString() : '0',
      change: stats?.clicks_change || '+15%',
      changeType: 'positive',
      icon: MousePointer,
      color: 'orange'
    },
    {
      title: 'Avg. CTR',
      value: stats?.avg_ctr ? `${stats.avg_ctr}%` : '0%',
      change: stats?.ctr_change || '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'pink'
    },
    {
      title: 'Revenue',
      value: stats?.revenue ? `$${stats.revenue.toLocaleString()}` : '$0',
      change: stats?.revenue_change || '+18%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {overviewCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-${card.color}-100 p-3 rounded-full`}>
                  <Icon className={`w-6 h-6 text-${card.color}-600`} />
                </div>
                <div className={`flex items-center text-sm ${
                  card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {card.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              <p className="text-gray-600">{card.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Create New Banner</p>
              <p className="text-sm text-gray-600">Start a new banner campaign</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Bulk Upload</p>
              <p className="text-sm text-gray-600">Upload multiple banners</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Export Report</p>
              <p className="text-sm text-gray-600">Download performance data</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {stats?.recent_activity?.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          )) || (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalyticsTab = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Click-Through Rate</h3>
            <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart placeholder</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Impressions Over Time</h3>
            <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart placeholder</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Banners</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div>
                  <p className="font-medium text-gray-900">Banner {i}</p>
                  <p className="text-sm text-gray-600">Campaign {i}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{(Math.random() * 10).toFixed(2)}% CTR</p>
                <p className="text-sm text-gray-600">{Math.floor(Math.random() * 10000)} impressions</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SettingsTab = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Banner Settings</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Banner Size
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>728x90 - Leaderboard</option>
              <option>300x250 - Medium Rectangle</option>
              <option>160x600 - Skyscraper</option>
              <option>970x250 - Billboard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-approve Banners
            </label>
            <div className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-600">Automatically approve new banner submissions</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum File Size
            </label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="5MB" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supported Formats
            </label>
            <div className="space-y-2">
              {['JPEG', 'PNG', 'GIF', 'HTML5', 'MP4'].map(format => (
                <label key={format} className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">{format}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing Settings</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standard Banner Price
            </label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="$0.00" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promoted Banner Price
            </label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="$25.00" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Banner Price
            </label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="$50.00" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerManagement;
