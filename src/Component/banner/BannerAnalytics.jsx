import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Users,
  DollarSign,
  Clock
} from 'lucide-react';
import { 
  getBannerAnalytics,
  getBannerStats,
  getBannerAds,
  getBannerCategories
} from '../../api/banner';

const BannerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedBanner, setSelectedBanner] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const periods = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod, selectedBanner, selectedCategory]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsResponse, statsResponse, bannersResponse, categoriesResponse] = await Promise.all([
        getBannerAnalytics({ period: selectedPeriod, banner: selectedBanner, category: selectedCategory }),
        getBannerStats({ period: selectedPeriod, banner: selectedBanner, category: selectedCategory }),
        getBannerAds({ per_page: 100 }),
        getBannerCategories()
      ]);

      // Handle analytics response
      if (analyticsResponse && analyticsResponse.success) {
        setAnalytics(analyticsResponse.data || null);
      } else {
        setAnalytics(null);
      }

      // Handle stats response
      if (statsResponse && statsResponse.success) {
        setStats(statsResponse.data || null);
      } else {
        setStats(null);
      }

      // Handle banners response
      if (bannersResponse && bannersResponse.success) {
        setBanners(Array.isArray(bannersResponse.data) ? bannersResponse.data : []);
      } else {
        setBanners([]);
      }

      // Handle categories response
      if (categoriesResponse && categoriesResponse.success) {
        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError(err.message || 'Failed to load analytics data');
      // Reset data on error
      setAnalytics(null);
      setStats(null);
      setBanners([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Export analytics data
  const exportAnalytics = () => {
    const data = {
      period: selectedPeriod,
      generated_at: new Date().toISOString(),
      analytics: analytics || {},
      stats: stats || {},
      banners: banners || [],
      categories: categories || []
    };

    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `banner-analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting analytics:', error);
      setError('Failed to export analytics data');
    }
  };

  // Calculate performance metrics
  const calculateCTR = (clicks, views) => {
    if (!views || views === 0) return 0;
    return ((clicks / views) * 100).toFixed(2);
  };

  const calculateCPC = (cost, clicks) => {
    if (!clicks || clicks === 0) return 0;
    return (cost / clicks).toFixed(2);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Banner Analytics</h2>
          <p className="text-gray-600">Track performance and engagement metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAnalyticsData}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <select
              value={selectedBanner}
              onChange={(e) => setSelectedBanner(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Banners</option>
              {banners.map(banner => (
                <option key={banner.id} value={banner.id}>
                  {banner.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Impressions</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.total_views?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                {stats?.views_growth || '+0%'} from last period
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.total_clicks?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-green-600 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                {stats?.clicks_growth || '+0%'} from last period
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <MousePointer className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Click-Through Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {calculateCTR(stats?.total_clicks, stats?.total_views)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.ctr_change || '+0%'} from last period
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats?.total_revenue?.toLocaleString() || '0'}
              </p>
              <p className="text-xs text-green-600 mt-1">
                <DollarSign className="inline w-3 h-3 mr-1" />
                {stats?.revenue_growth || '+0%'} from last period
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Chart visualization would go here</p>
              <p className="text-sm">Integration with Chart.js or similar library needed</p>
            </div>
          </div>
        </motion.div>

        {/* Top Performing Banners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Banners</h3>
          <div className="space-y-3">
            {analytics?.top_banners?.map((banner, index) => (
              <div key={banner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{banner.title}</p>
                    <p className="text-xs text-gray-500">{banner.views} views</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{calculateCTR(banner.clicks, banner.views)}%</p>
                  <p className="text-xs text-gray-500">CTR</p>
                </div>
              </div>
            )) || (
              <div className="text-center text-gray-500 py-8">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>No banner data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Category Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banners
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics?.category_performance?.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.banner_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.views?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.clicks?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateCTR(category.clicks, category.views)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${category.revenue?.toLocaleString() || '0'}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No category data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerAnalytics;
