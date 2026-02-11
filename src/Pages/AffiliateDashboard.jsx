import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaDollarSign,
  FaUsers,
  FaEye,
  FaShoppingCart,
  FaLink,
  FaCalendarAlt,
  FaDownload,
  FaFilter,
  FaTrophy,
  FaGift,
  FaRocket,
  FaHandshake,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaExternalLinkAlt
} from "react-icons/fa";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getMyAffiliate } from "../slice/AffiliateSLice";

const AffiliateDashboard = () => {
  const dispatch = useDispatch();
  const { myAffiliateList, loading } = useSelector((state) => state.aff);
  
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [showReferralModal, setShowReferralModal] = useState(false);

  // Mock data for affiliate dashboard (replace with real API calls)
  const [dashboardData, setDashboardData] = useState({
    totalEarnings: 2456.78,
    pendingEarnings: 345.12,
    totalClicks: 12456,
    totalConversions: 89,
    conversionRate: 0.71,
    activeReferrals: 234,
    tierLevel: "Premium",
    nextTierProgress: 65,
    referralLink: "https://yourplatform.com?ref=USER123",
    recentEarnings: [],
    topPerformingLinks: [],
    monthlyStats: []
  });

  // Load user's affiliate data
  useEffect(() => {
    dispatch(getMyAffiliate({ skip: 0, limit: 100 }));
  }, [dispatch]);

  // Mock recent earnings data
  const mockRecentEarnings = [
    { id: 1, date: "2024-01-20", amount: 45.67, referral: "John Doe", type: "commission", status: "paid" },
    { id: 2, date: "2024-01-19", amount: 23.45, referral: "Jane Smith", type: "commission", status: "pending" },
    { id: 3, date: "2024-01-18", amount: 67.89, referral: "Bob Johnson", type: "bonus", status: "paid" },
    { id: 4, date: "2024-01-17", amount: 12.34, referral: "Alice Brown", type: "commission", status: "pending" },
    { id: 5, date: "2024-01-16", amount: 89.12, referral: "Charlie Wilson", type: "commission", status: "paid" }
  ];

  // Mock top performing links
  const mockTopLinks = [
    { id: 1, title: "Premium Membership", clicks: 3456, conversions: 45, earnings: 567.89 },
    { id: 2, title: "Basic Plan", clicks: 2345, conversions: 23, earnings: 234.56 },
    { id: 3, title: "Enterprise Solution", clicks: 1234, conversions: 12, earnings: 345.67 }
  ];

  const copyReferralLink = () => {
    navigator.clipboard.writeText(dashboardData.referralLink);
    // Show success message (you could use toast here)
    alert("Referral link copied to clipboard!");
  };

  const periodOptions = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 90 Days" },
    { value: "1year", label: "Last Year" }
  ];

  const getTierColor = (tier) => {
    switch (tier) {
      case "Standard": return "bg-gray-100 text-gray-600";
      case "Premium": return "bg-purple-100 text-purple-600";
      case "Elite": return "bg-gold-100 text-gold-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-600";
      case "pending": return "bg-blue-100 text-blue-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Affiliate Dashboard</h1>
              <p className="text-purple-100 text-lg">
                Track your earnings, referrals, and performance metrics
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getTierColor(dashboardData.tierLevel)}`}>
                <FaTrophy className="mr-2" />
                {dashboardData.tierLevel} Tier
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <FaCalendarAlt className="text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowReferralModal(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <FaLink />
            Get Referral Link
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <FaDollarSign className="h-6 w-6" />
              </div>
              <span className="text-sm text-green-600 font-medium">+12.5%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">${dashboardData.totalEarnings.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <FaClock className="h-6 w-6" />
              </div>
              <span className="text-sm text-blue-600 font-medium">Pending</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">${dashboardData.pendingEarnings.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Pending Earnings</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <FaEye className="h-6 w-6" />
              </div>
              <span className="text-sm text-blue-600 font-medium">+8.3%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{dashboardData.totalClicks.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <FaUsers className="h-6 w-6" />
              </div>
              <span className="text-sm text-purple-600 font-medium">+15.2%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{dashboardData.activeReferrals}</div>
            <div className="text-sm text-gray-600">Active Referrals</div>
          </div>
        </div>

        {/* Tier Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tier Progress</h3>
            <span className="text-sm text-gray-600">Next: Elite Tier (200+ referrals)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${dashboardData.nextTierProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{dashboardData.activeReferrals} referrals</span>
            <span>{dashboardData.nextTierProgress}% to next tier</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Earnings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Earnings</h3>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {mockRecentEarnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{earning.referral}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(earning.status)}`}>
                        {earning.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{earning.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">${earning.amount}</div>
                    <div className="text-sm text-gray-600">{earning.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Links */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Links</h3>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {mockTopLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{link.title}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{link.clicks} clicks</span>
                      <span>{link.conversions} conversions</span>
                      <span>{((link.conversions / link.clicks) * 100).toFixed(1)}% rate</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">${link.earnings}</div>
                    <div className="text-sm text-gray-600">earned</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Export</button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FaChartLine className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Performance chart will be displayed here</p>
              <p className="text-sm">Integrate with charting library like Chart.js or Recharts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <div className="text-center mb-6">
              <FaLink className="h-16 w-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Referral Link</h3>
              <p className="text-gray-600">Share this link to start earning commissions</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referral Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dashboardData.referralLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
                <button
                  onClick={copyReferralLink}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5" />
                  <span>Share your referral link with friends, family, or followers</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5" />
                  <span>They sign up using your unique link</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5" />
                  <span>You earn commissions when they become paying customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5" />
                  <span>Track everything in this dashboard</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowReferralModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <Link
                to="/affiliate"
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors text-center"
              >
                View Programs
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AffiliateDashboard;
