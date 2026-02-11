import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaUsers, 
  FaDollarSign, 
  FaLink, 
  FaEye, 
  FaShoppingCart,
  FaCalendarAlt,
  FaDownload,
  FaTrophy,
  FaGift,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaShareAlt,
  FaCopy,
  FaFilter,
  FaRefresh,
  FaInfoCircle,
  FaChartPie,
  FaChartBar
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import AffiliateServices from '../services/AffiliateServices';
import toast from 'react-hot-toast';

const AffiliateDashboard = ({ className = "" }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30days');
  const [dashboardData, setDashboardData] = useState({
    overview: {},
    referrals: [],
    earnings: [],
    clicks: [],
    conversions: [],
    payouts: []
  });

  const timeRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '1year', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  useEffect(() => {
    loadDashboardData();
  }, [timeRange, activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load different data based on active tab
      const promises = [];
      
      if (activeTab === 'overview' || activeTab === 'earnings') {
        promises.push(
          AffiliateServices.getReferralStats(timeRange),
          AffiliateServices.getEarnings(timeRange, 'all'),
          AffiliateServices.getTopPerformingLinks(timeRange)
        );
      }
      
      if (activeTab === 'referrals') {
        promises.push(AffiliateServices.getMyReferrals(0, 50));
      }
      
      const results = await Promise.all(promises);
      
      // Process and set data
      const newData = { ...dashboardData };
      
      if (activeTab === 'overview' || activeTab === 'earnings') {
        newData.overview = results[0]?.data || {};
        newData.earnings = results[1]?.data || [];
        newData.topLinks = results[2]?.data || [];
      }
      
      if (activeTab === 'referrals') {
        newData.referrals = results[0]?.data || [];
      }
      
      setDashboardData(newData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard!`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const exportReport = async (format = 'csv') => {
    try {
      const response = await AffiliateServices.exportEarningsReport(timeRange, format);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `affiliate-earnings-${timeRange}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  const renderOverview = () => {
    const { overview } = dashboardData;
    
    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{overview.totalClicks || 0}</p>
                <p className="text-xs text-green-600 mt-1">
                  {overview.clickGrowth || '+0%'} from last period
                </p>
              </div>
              <FaEye className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{overview.totalConversions || 0}</p>
                <p className="text-xs text-green-600 mt-1">
                  {overview.conversionGrowth || '+0%'} from last period
                </p>
              </div>
              <FaShoppingCart className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${overview.totalEarnings || '0.00'}</p>
                <p className="text-xs text-green-600 mt-1">
                  {overview.earningsGrowth || '+0%'} from last period
                </p>
              </div>
              <FaDollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{overview.conversionRate || '0.0%'}</p>
                <p className="text-xs text-green-600 mt-1">
                  {overview.conversionRateGrowth || '+0%'} from last period
                </p>
              </div>
              <FaChartLine className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <FaChartBar className="h-12 w-12 mx-auto mb-2" />
              <p>Performance chart will be displayed here</p>
              <p className="text-sm">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {overview.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${activity.type === 'click' ? 'bg-blue-100' : activity.type === 'conversion' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    {activity.type === 'click' ? <FaEye className="text-blue-600" /> : activity.type === 'conversion' ? <FaShoppingCart className="text-green-600" /> : <FaDollarSign className="text-yellow-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                {activity.amount && (
                  <span className="text-sm font-semibold text-green-600">+${activity.amount}</span>
                )}
              </div>
            )) || (
              <div className="text-center text-gray-500 py-8">
                <FaClock className="h-8 w-8 mx-auto mb-2" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEarnings = () => {
    const { earnings, topLinks } = dashboardData;
    
    return (
      <div className="space-y-6">
        {/* Earnings Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Earnings Breakdown</h3>
            <div className="flex gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              <button
                onClick={() => exportReport('csv')}
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center gap-2"
              >
                <FaDownload />
                Export
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600">Confirmed Earnings</p>
              <p className="text-2xl font-bold text-green-900">${earnings.confirmed || '0.00'}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600">Pending Earnings</p>
              <p className="text-2xl font-bold text-yellow-900">${earnings.pending || '0.00'}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">Total Paid</p>
              <p className="text-2xl font-bold text-blue-900">${earnings.totalPaid || '0.00'}</p>
            </div>
          </div>
          
          {/* Earnings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Commission</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {earnings.list?.map((earning, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">{new Date(earning.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {earning.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{earning.description}</td>
                    <td className="py-3 px-4 font-semibold">${earning.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        earning.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        earning.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {earning.status}
                      </span>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No earnings data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Links */}
        {topLinks?.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Links</h3>
            <div className="space-y-3">
              {topLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{link.name}</p>
                    <p className="text-sm text-gray-600">{link.clicks} clicks, {link.conversions} conversions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${link.earnings}</p>
                    <p className="text-xs text-gray-500">{link.conversionRate}% CR</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReferrals = () => {
    const { referrals } = dashboardData;
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referrals</h3>
          
          {/* Referral Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">Total Referrals</p>
              <p className="text-2xl font-bold text-blue-900">{referrals.length || 0}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600">Active Referrals</p>
              <p className="text-2xl font-bold text-green-900">{referrals.filter(r => r.status === 'active').length || 0}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600">Converted</p>
              <p className="text-2xl font-bold text-purple-900">{referrals.filter(r => r.converted).length || 0}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{referrals.filter(r => r.status === 'pending').length || 0}</p>
            </div>
          </div>
          
          {/* Referrals Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Referral Code</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Clicks</th>
                  <th className="text-left py-3 px-4">Conversions</th>
                  <th className="text-left py-3 px-4">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">{referral.referralCode}</code>
                        <button
                          onClick={() => copyToClipboard(referral.referralLink, 'Referral link')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">{new Date(referral.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        referral.status === 'active' ? 'bg-green-100 text-green-800' :
                        referral.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {referral.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{referral.clicks || 0}</td>
                    <td className="py-3 px-4">{referral.conversions || 0}</td>
                    <td className="py-3 px-4 font-semibold">${referral.earnings || '0.00'}</td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No referrals yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Affiliate Settings</h3>
          
          <div className="space-y-6">
            {/* Payout Settings */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Payout Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>PayPal</option>
                    <option>Bank Transfer</option>
                    <option>Stripe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payout Threshold</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>$25</option>
                    <option>$50</option>
                    <option>$100</option>
                    <option>$250</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Notification Settings</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                  <span className="text-sm">Email notifications for new conversions</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                  <span className="text-sm">Email notifications for payout confirmations</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span className="text-sm">Monthly performance reports</span>
                </label>
              </div>
            </div>

            {/* Tax Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Tax Information</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FaExclamationTriangle className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800">
                      Please ensure your tax information is up to date. You may be required to complete tax forms depending on your location and earnings.
                    </p>
                    <button className="mt-2 text-sm text-yellow-700 hover:text-yellow-800 underline">
                      Update Tax Information
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
    { id: 'earnings', label: 'Earnings', icon: <FaDollarSign /> },
    { id: 'referrals', label: 'Referrals', icon: <FaUsers /> },
    { id: 'settings', label: 'Settings', icon: <FaInfoCircle /> }
  ];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Affiliate Dashboard</h2>
            <p className="text-gray-600 mt-1">Track your affiliate performance and earnings</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <FaRefresh />
            Refresh
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FaRefresh className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'earnings' && renderEarnings()}
            {activeTab === 'referrals' && renderReferrals()}
            {activeTab === 'settings' && renderSettings()}
          </>
        )}
      </div>
    </div>
  );
};

export default AffiliateDashboard;
