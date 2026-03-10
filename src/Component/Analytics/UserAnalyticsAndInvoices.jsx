import React, { useState, useEffect } from 'react';
import { FaChartLine, FaEye, FaHeart, FaDownload, FaCalendarAlt, FaFilter, FaArrowUp, FaUsers, FaDollarSign, FaFileInvoice, FaChartBar, FaChartPie } from 'react-icons/fa';
import api from '../../api';
import toast from 'react-hot-toast';

const UserAnalyticsAndInvoices = ({ userId, businessId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30'); // days
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else {
      fetchInvoices();
    }
  }, [userId, businessId, dateRange, activeTab]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (userId) params.append('user_id', userId);
      if (businessId) params.append('business_id', businessId);
      params.append('days', dateRange);

      const response = await api.get(`/analytics/user?${params}`);
      setAnalytics(response.data?.data || null);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (userId) params.append('customer_id', userId);
      if (businessId) params.append('business_id', businessId);

      const response = await api.get(`/invoices?${params}`);
      setInvoices(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const downloadAnalyticsReport = async () => {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('user_id', userId);
      if (businessId) params.append('business_id', businessId);
      params.append('days', dateRange);

      const response = await api.get(`/analytics/user/export?${params}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-report-${dateRange}-days.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Analytics report downloaded');
    } catch (error) {
      console.error('Error downloading analytics report:', error);
      toast.error('Failed to download analytics report');
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPercentageChange = (current, previous) => {
    if (!previous) return 0;
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  const getChangeColor = (change) => {
    const num = parseFloat(change.replace('%', ''));
    return num > 0 ? 'text-green-600' : num < 0 ? 'text-red-600' : 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaChartLine className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Analytics & Invoices</h2>
              <p className="text-sm text-gray-600">Track your performance and manage invoices</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaChartLine className="inline mr-2 h-4 w-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'invoices'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FaFileInvoice className="inline mr-2 h-4 w-4" />
            Invoices
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'analytics' ? (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                <span className="ml-2">Loading analytics...</span>
              </div>
            ) : analytics ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <FaEye className="h-5 w-5 text-blue-600" />
                      <span className={`text-sm font-medium ${getChangeColor(analytics.views_change)}`}>
                        {getPercentageChange(analytics.views_current, analytics.views_previous)}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatNumber(analytics.views_current)}
                    </div>
                    <div className="text-sm text-blue-700">Total Views</div>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <FaHeart className="h-5 w-5 text-red-600" />
                      <span className={`text-sm font-medium ${getChangeColor(analytics.favorites_change)}`}>
                        {getPercentageChange(analytics.favorites_current, analytics.favorites_previous)}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-red-900">
                      {formatNumber(analytics.favorites_current)}
                    </div>
                    <div className="text-sm text-red-700">Total Favorites</div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <FaUsers className="h-5 w-5 text-green-600" />
                      <span className={`text-sm font-medium ${getChangeColor(analytics.contacts_change)}`}>
                        {getPercentageChange(analytics.contacts_current, analytics.contacts_previous)}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {formatNumber(analytics.contacts_current)}
                    </div>
                    <div className="text-sm text-green-700">Contact Requests</div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <FaDollarSign className="h-5 w-5 text-purple-600" />
                      <span className={`text-sm font-medium ${getChangeColor(analytics.revenue_change)}`}>
                        {getPercentageChange(analytics.revenue_current, analytics.revenue_previous)}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      {formatCurrency(analytics.revenue_current)}
                    </div>
                    <div className="text-sm text-purple-700">Total Revenue</div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Views Trend */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <FaArrowUp className="h-4 w-4" />
                      Views Trend
                    </h3>
                    <div className="h-48 flex items-center justify-center text-gray-500">
                      <FaChartBar className="h-12 w-12 opacity-50" />
                      <span className="ml-2">Chart visualization would go here</span>
                    </div>
                  </div>

                  {/* Category Distribution */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <FaChartPie className="h-4 w-4" />
                      Category Distribution
                    </h3>
                    <div className="space-y-2">
                      {analytics.category_breakdown?.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{category.category}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${category.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{category.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Performing Ads */}
                {analytics.top_ads && analytics.top_ads.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Top Performing Ads</h3>
                    <div className="space-y-2">
                      {analytics.top_ads.map((ad, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{ad.title}</div>
                            <div className="text-sm text-gray-600">{ad.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{formatNumber(ad.views)} views</div>
                            <div className="text-sm text-gray-600">{formatNumber(ad.contacts)} contacts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Download Report Button */}
                <div className="flex justify-center">
                  <button
                    onClick={downloadAnalyticsReport}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaDownload className="h-4 w-4" />
                    Download Full Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FaChartLine className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No analytics data available</p>
              </div>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                <span className="ml-2">Loading invoices...</span>
              </div>
            ) : invoices.length > 0 ? (
              <div className="space-y-4">
                {/* Invoice Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaFileInvoice className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Paid Invoices</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {invoices.filter(inv => inv.status === 'paid').length}
                    </div>
                    <div className="text-sm text-green-700">
                      {formatCurrency(
                        invoices
                          .filter(inv => inv.status === 'paid')
                          .reduce((sum, inv) => sum + inv.amount, 0)
                      )}
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCalendarAlt className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Pending Invoices</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-900">
                      {invoices.filter(inv => inv.status === 'pending').length}
                    </div>
                    <div className="text-sm text-yellow-700">
                      {formatCurrency(
                        invoices
                          .filter(inv => inv.status === 'pending')
                          .reduce((sum, inv) => sum + inv.amount, 0)
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaDollarSign className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Total Revenue</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(invoices.reduce((sum, inv) => sum + inv.amount, 0))}
                    </div>
                    <div className="text-sm text-blue-700">All time</div>
                  </div>
                </div>

                {/* Invoice List */}
                <div className="space-y-2">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <div className="font-medium text-gray-900">Invoice #{invoice.invoice_number}</div>
                        <div className="text-sm text-gray-600">{invoice.description}</div>
                        <div className="text-xs text-gray-500">Due: {new Date(invoice.due_date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{formatCurrency(invoice.amount)}</div>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.status}
                        </div>
                      </div>
                      <button
                        onClick={() => downloadInvoice(invoice.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <FaDownload className="h-3 w-3" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FaFileInvoice className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No invoices found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserAnalyticsAndInvoices;
