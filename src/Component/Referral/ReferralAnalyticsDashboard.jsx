import React, { useState, useEffect } from 'react';
import { FaChartLine, FaUsers, FaGift, FaCalendar, FaEye, FaClick, FaShare, FaTrophy, FaRocket, FaFire, FaBolt, FaStar, FaMedal, FaAward } from 'react-icons/fa';

const ReferralAnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    trends: [],
    topPerformers: [],
    channelAnalytics: {},
    conversionFunnel: {},
    timeSeriesData: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('conversions');

  useEffect(() => {
    loadAnalyticsData(selectedPeriod);
  }, [selectedPeriod]);

  const loadAnalyticsData = async (period) => {
    setLoading(true);
    try {
      // Mock data - in real app, this would come from API
      const mockData = {
        overview: {
          totalInvitations: 156,
          successfulReferrals: 89,
          pendingInvitations: 67,
          conversionRate: 57.1,
          totalEarned: 890.00,
          averageEarningsPerReferral: 10.00,
          viralCoefficient: 1.8,
          roi: 3.2
        },
        trends: [
          { date: '2024-10-01', invitations: 12, conversions: 7, earnings: 70 },
          { date: '2024-10-02', invitations: 8, conversions: 5, earnings: 50 },
          { date: '2024-10-03', invitations: 15, conversions: 9, earnings: 90 },
          { date: '2024-10-04', invitations: 10, conversions: 6, earnings: 60 },
          { date: '2024-10-05', invitations: 18, conversions: 11, earnings: 110 },
          { date: '2024-10-06', invitations: 14, conversions: 8, earnings: 80 },
          { date: '2024-10-07', invitations: 20, conversions: 12, earnings: 120 }
        ],
        topPerformers: [
          { userName: 'Sarah Johnson', referrals: 45, earnings: 450, conversionRate: 84.4, badge: 'crown' },
          { userName: 'Mike Chen', referrals: 38, earnings: 380, conversionRate: 83.3, badge: 'medal' },
          { userName: 'Emily Davis', referrals: 32, earnings: 320, conversionRate: 84.2, badge: 'award' },
          { userName: 'Alex Thompson', referrals: 28, earnings: 280, conversionRate: 80.0, badge: 'star' },
          { userName: 'Lisa Wong', referrals: 25, earnings: 250, conversionRate: 81.3, badge: 'bolt' }
        ],
        channelAnalytics: {
          email: { invitations: 45, conversions: 28, conversionRate: 62.2, earnings: 280 },
          social: { invitations: 67, conversions: 41, conversionRate: 61.2, earnings: 410 },
          qr: { invitations: 23, conversions: 15, conversionRate: 65.2, earnings: 150 },
          direct: { invitations: 21, conversions: 12, conversionRate: 57.1, earnings: 120 }
        },
        conversionFunnel: {
          impressions: 1250,
          clicks: 380,
          signups: 156,
          firstAdverts: 89,
          earnings: 890
        },
        timeSeriesData: [
          { month: 'Jan', invitations: 120, conversions: 68, earnings: 680 },
          { month: 'Feb', invitations: 135, conversions: 78, earnings: 780 },
          { month: 'Mar', invitations: 142, conversions: 82, earnings: 820 },
          { month: 'Apr', invitations: 156, conversions: 89, earnings: 890 },
          { month: 'May', invitations: 168, conversions: 95, earnings: 950 },
          { month: 'Jun', invitations: 175, conversions: 102, earnings: 1020 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badge) => {
    const icons = {
      crown: <FaTrophy className="text-yellow-500" />,
      medal: <FaMedal className="text-gray-400" />,
      award: <FaAward className="text-orange-600" />,
      star: <FaStar className="text-yellow-400" />,
      bolt: <FaBolt className="text-blue-500" />
    };
    return icons[badge] || <FaStar className="text-gray-400" />;
  };

  const getMetricIcon = (metric) => {
    const icons = {
      invitations: <FaUsers className="text-blue-600" />,
      conversions: <FaGift className="text-green-600" />,
      earnings: <FaTrophy className="text-purple-600" />,
      rate: <FaChartLine className="text-orange-600" />
    };
    return icons[metric] || <FaChartLine className="text-gray-600" />;
  };

  const calculateFunnelPercentage = (current, previous) => {
    return previous > 0 ? ((current / previous) * 100).toFixed(1) : 0;
  };

  if (loading) {
    return (
      <div className="page-container p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Referral Analytics</h2>
        <p className="text-gray-600">Comprehensive insights into your referral program performance</p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white">
          {['7d', '30d', '90d', '1y'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              } ${period === '7d' ? 'rounded-l-lg' : ''} ${
                period === '1y' ? 'rounded-r-lg' : ''
              }`}
            >
              {period === '7d' ? 'Last 7 days' : 
               period === '30d' ? 'Last 30 days' : 
               period === '90d' ? 'Last 90 days' : 'Last year'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FaUsers className="text-blue-600 text-2xl" />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analyticsData.overview.totalInvitations}</div>
          <div className="text-sm text-gray-600">Total Invitations</div>
          <div className="mt-2 text-xs text-green-600">+12% from last period</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FaGift className="text-green-600 text-2xl" />
            <span className="text-sm text-gray-500">Success</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analyticsData.overview.successfulReferrals}</div>
          <div className="text-sm text-gray-600">Successful Referrals</div>
          <div className="mt-2 text-xs text-green-600">+8% from last period</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FaTrophy className="text-purple-600 text-2xl" />
            <span className="text-sm text-gray-500">Earnings</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">${analyticsData.overview.totalEarned}</div>
          <div className="text-sm text-gray-600">Total Earned</div>
          <div className="mt-2 text-xs text-green-600">+15% from last period</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <FaChartLine className="text-orange-600 text-2xl" />
            <span className="text-sm text-gray-500">Rate</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{analyticsData.overview.conversionRate}%</div>
          <div className="text-sm text-gray-600">Conversion Rate</div>
          <div className="mt-2 text-xs text-green-600">+2.1% from last period</div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="space-y-4">
          {[
            { label: 'Impressions', value: analyticsData.conversionFunnel.impressions, color: 'bg-blue-500' },
            { label: 'Clicks', value: analyticsData.conversionFunnel.clicks, color: 'bg-green-500' },
            { label: 'Signups', value: analyticsData.conversionFunnel.signups, color: 'bg-yellow-500' },
            { label: 'First Adverts', value: analyticsData.conversionFunnel.firstAdverts, color: 'bg-purple-500' },
            { label: 'Earnings', value: `$${analyticsData.conversionFunnel.earnings}`, color: 'bg-orange-500' }
          ].map((step, index) => {
            const previousValue = index === 0 ? analyticsData.conversionFunnel.impressions : 
              index === 1 ? analyticsData.conversionFunnel.clicks :
              index === 2 ? analyticsData.conversionFunnel.signups :
              index === 3 ? analyticsData.conversionFunnel.firstAdverts : 0;
            const percentage = calculateFunnelPercentage(step.value, previousValue);
            
            return (
              <div key={step.label} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700">{step.label}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className={`${step.color} h-6 rounded-full flex items-center justify-center text-xs text-white font-medium`}
                      style={{ width: `${Math.min((step.value / analyticsData.conversionFunnel.impressions) * 100, 100)}%` }}
                    >
                      {step.value}
                    </div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <div className="text-sm font-medium text-gray-900">{step.value}</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Channel Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.channelAnalytics).map(([channel, data]) => (
              <div key={channel} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 capitalize">{channel}</div>
                  <div className="text-sm text-gray-600">{data.invitations} invitations</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{data.conversions} conversions</div>
                  <div className="text-sm text-green-600">{data.conversionRate}% rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {analyticsData.topPerformers.map((performer, index) => (
              <div key={performer.userName} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{performer.userName}</div>
                    <div className="text-sm text-gray-600">{performer.referrals} referrals</div>
                  </div>
                  <div className="text-lg">
                    {getBadgeIcon(performer.badge)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">${performer.earnings}</div>
                  <div className="text-sm text-green-600">{performer.conversionRate}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Invitations Trend</h4>
            <div className="h-32 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-end justify-around p-4">
              {analyticsData.trends.slice(-7).map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-blue-500 rounded-t"
                    style={{ height: `${(day.invitations / 20) * 100}px` }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date(day.date).getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Conversions Trend</h4>
            <div className="h-32 bg-gradient-to-r from-green-50 to-green-100 rounded-lg flex items-end justify-around p-4">
              {analyticsData.trends.slice(-7).map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-green-500 rounded-t"
                    style={{ height: `${(day.conversions / 12) * 100}px` }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date(day.date).getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Earnings Trend</h4>
            <div className="h-32 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg flex items-end justify-around p-4">
              {analyticsData.trends.slice(-7).map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-purple-500 rounded-t"
                    style={{ height: `${(day.earnings / 120) * 100}px` }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date(day.date).getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaRocket className="text-blue-600" />
            <span className="font-medium text-blue-900">Viral Coefficient</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{analyticsData.overview.viralCoefficient}</div>
          <div className="text-sm text-blue-700">Avg referrals per user</div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaFire className="text-green-600" />
            <span className="font-medium text-green-900">ROI</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{analyticsData.overview.roi}x</div>
          <div className="text-sm text-green-700">Return on investment</div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaGift className="text-purple-600" />
            <span className="font-medium text-purple-900">Avg Earnings</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">${analyticsData.overview.averageEarningsPerReferral}</div>
          <div className="text-sm text-purple-700">Per referral</div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaEye className="text-orange-600" />
            <span className="font-medium text-orange-900">Pending</span>
          </div>
          <div className="text-2xl font-bold text-orange-900">{analyticsData.overview.pendingInvitations}</div>
          <div className="text-sm text-orange-700">Awaiting conversion</div>
        </div>
      </div>
    </div>
  );
};

export default ReferralAnalyticsDashboard;
