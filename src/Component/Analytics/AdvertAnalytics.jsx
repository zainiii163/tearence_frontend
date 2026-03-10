import React, { useState, useEffect } from 'react';
import { FaChartLine, FaEye, FaHeart, FaShare, FaEnvelope, FaPhone, FaCalendarAlt, FaDollarSign, FaUsers, FaClock, FaDownload, FaFilter, FaTrendingUp, FaTrendingDown, FaChartBar, FaChartPie } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../api';
import toast from 'react-hot-toast';

const AdvertAnalytics = ({ userId, advertId, userType = 'user' }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30days');
  const [selectedAdvert, setSelectedAdvert] = useState(null);
  const [userAdverts, setUserAdverts] = useState([]);
  const [chartType, setChartType] = useState('views');

  useEffect(() => {
    if (userId) {
      fetchUserAdverts();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedAdvert) {
      fetchAnalytics();
    }
  }, [selectedAdvert, dateRange]);

  const fetchUserAdverts = async () => {
    try {
      const response = await api.get(`/users/${userId}/adverts`);
      setUserAdverts(response.data?.data || []);
      
      // Auto-select first advert if none selected
      if (!selectedAdvert && response.data?.data?.length > 0) {
        setSelectedAdvert(response.data.data[0]);
      }
    } catch (error) {
      console.error('Error fetching user adverts:', error);
    }
  };

  const fetchAnalytics = async () => {
    if (!selectedAdvert) return;

    setLoading(true);
    try {
      const response = await api.get(`/analytics/adverts/${selectedAdvert.id}`, {
        params: { date_range: dateRange }
      });
      setAnalytics(response.data?.data || null);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async () => {
    if (!selectedAdvert) return;

    try {
      const response = await api.get(`/analytics/adverts/${selectedAdvert.id}/export`, {
        params: { date_range: dateRange },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-${selectedAdvert.id}-${dateRange}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Analytics exported successfully!');
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast.error('Failed to export analytics');
    }
  };

  const getChartData = () => {
    if (!analytics?.daily_stats) return [];

    return analytics.daily_stats.map(stat => ({
      date: new Date(stat.date).toLocaleDateString(),
      views: stat.views || 0,
      clicks: stat.clicks || 0,
      shares: stat.shares || 0,
      favorites: stat.favorites || 0,
      inquiries: stat.inquiries || 0
    }));
  };

  const getEngagementData = () => {
    if (!analytics) return [];

    return [
      { name: 'Views', value: analytics.total_views || 0, color: '#3B82F6' },
      { name: 'Clicks', value: analytics.total_clicks || 0, color: '#10B981' },
      { name: 'Shares', value: analytics.total_shares || 0, color: '#F59E0B' },
      { name: 'Favorites', value: analytics.total_favorites || 0, color: '#EF4444' },
      { name: 'Inquiries', value: analytics.total_inquiries || 0, color: '#8B5CF6' }
    ];
  };

  const getPerformanceMetrics = () => {
    if (!analytics) return [];

    return [
      {
        title: 'Total Views',
        value: analytics.total_views || 0,
        change: analytics.views_change || 0,
        icon: <FaEye className="h-5 w-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      {
        title: 'Engagement Rate',
        value: `${(analytics.engagement_rate || 0).toFixed(1)}%`,
        change: analytics.engagement_change || 0,
        icon: <FaChartLine className="h-5 w-5" />,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      {
        title: 'Inquiries',
        value: analytics.total_inquiries || 0,
        change: analytics.inquiries_change || 0,
        icon: <FaEnvelope className="h-5 w-5" />,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      {
        title: 'Avg. Response Time',
        value: `${analytics.avg_response_time || 0}h`,
        change: analytics.response_time_change || 0,
        icon: <FaClock className="h-5 w-5" />,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      }
    ];
  };

  const getTopPerformingAdverts = () => {
    return userAdverts
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  };

  const chartData = getChartData();
  const engagementData = getEngagementData();
  const performanceMetrics = getPerformanceMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advert Analytics</h2>
          <p className="text-gray-600">Track performance and insights for your advertisements</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={exportAnalytics}
            disabled={!analytics || loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaDownload className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Advert Selection */}
      {userAdverts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Advert</label>
          <select
            value={selectedAdvert?.id || ''}
            onChange={(e) => {
              const advert = userAdverts.find(a => a.id === e.target.value);
              setSelectedAdvert(advert);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose an advert...</option>
            {userAdverts.map(advert => (
              <option key={advert.id} value={advert.id}>
                {advert.title} - {advert.category?.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <span className="ml-2">Loading analytics...</span>
        </div>
      ) : !selectedAdvert ? (
        <div className="text-center py-12">
          <FaChartLine className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Advert Selected</h3>
          <p className="text-gray-600">Select an advert to view its analytics</p>
        </div>
      ) : !analytics ? (
        <div className="text-center py-12">
          <FaChartBar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Available</h3>
          <p className="text-gray-600">Analytics data will appear once your advert starts getting views</p>
        </div>
      ) : (
        <>
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <div className={metric.color}>
                      {metric.icon}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change > 0 ? <FaTrendingUp className="h-3 w-3" /> : metric.change < 0 ? <FaTrendingDown className="h-3 w-3" /> : null}
                    <span>{Math.abs(metric.change).toFixed(1)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="views">Views</option>
                  <option value="clicks">Clicks</option>
                  <option value="shares">Shares</option>
                  <option value="favorites">Favorites</option>
                  <option value="inquiries">Inquiries</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey={chartType} 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Engagement Pie Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Stats Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Daily Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Favorites</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {chartData.slice(0, 10).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{row.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.views}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.clicks}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.shares}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.favorites}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.inquiries}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Performing Adverts */}
          {userAdverts.length > 1 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Top Performing Adverts</h3>
              <div className="space-y-3">
                {getTopPerformingAdverts().map((advert, index) => (
                  <div key={advert.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold text-gray-500">#{index + 1}</div>
                      <div>
                        <p className="font-medium text-gray-900">{advert.title}</p>
                        <p className="text-sm text-gray-600">{advert.category?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-semibold text-blue-600">
                        <FaEye className="h-4 w-4" />
                        {advert.views || 0}
                      </div>
                      <p className="text-xs text-gray-600">Total Views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdvertAnalytics;
