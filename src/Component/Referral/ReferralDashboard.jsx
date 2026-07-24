import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FaUsers, FaChartLine, FaGift, FaCalendar, FaEye, FaCheck, FaTimes, FaClock, FaPercentage, FaDollarSign } from 'react-icons/fa';
import referralService from '../../services/ReferralService';
import { generateReferralStats } from '../../utils/referralHelper';

const ReferralDashboard = () => {
  const { userDetail } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    totalInvitations: 0,
    successfulInvitations: 0,
    pendingInvitations: 0,
    conversionRate: 0,
    totalEarned: 0,
    averageEarningsPerReferral: 0,
    nextRewardThreshold: 5,
    remainingUses: 50,
    totalUses: 0,
    // Additional stats from documentation
    activationRate: 0,
    discountUsageRate: 0,
    referralROI: 0,
    viralCoefficient: 0
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadReferralData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load referral stats
      const statsResponse = await referralService.getReferralStats(userDetail.customer_id);
      const formattedStats = generateReferralStats(statsResponse.data);
      setStats(formattedStats);

      // Load referral history
      const historyResponse = await referralService.getReferralHistory(
        userDetail.customer_id, 
        currentPage, 
        10
      );
      setHistory(historyResponse.data.invitations || []);
      setTotalPages(historyResponse.data.totalPages || 1);
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  }, [userDetail, currentPage]);

  useEffect(() => {
    if (userDetail) {
      loadReferralData();
    }
  }, [userDetail, currentPage, loadReferralData]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'successful':
        return <FaCheck className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'expired':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaEye className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="page-container p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Referral Dashboard</h2>
        <p className="text-gray-600">Track your invitations and earnings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FaUsers className="text-blue-600 text-2xl" />
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalInvitations}</div>
          <div className="text-sm text-gray-600">Invitations Sent</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FaChartLine className="text-green-600 text-2xl" />
            <span className="text-sm text-gray-500">Success</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.successfulInvitations}</div>
          <div className="text-sm text-gray-600">Successful Referrals</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FaGift className="text-purple-600 text-2xl" />
            <span className="text-sm text-gray-500">Earnings</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">${stats.totalEarned}</div>
          <div className="text-sm text-gray-600">Total Earned</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FaChartLine className="text-orange-600 text-2xl" />
            <span className="text-sm text-gray-500">Rate</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Conversion Rate</div>
        </div>
      </div>

      {/* Progress to Next Reward */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Progress to Next Reward</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Next milestone: {stats.nextRewardThreshold} referrals</span>
          <span className="text-sm font-semibold">
            {stats.successfulInvitations} / {stats.nextRewardThreshold}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((stats.successfulInvitations / stats.nextRewardThreshold) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {stats.nextRewardThreshold - stats.successfulInvitations} more referrals to unlock bonus rewards!
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Referral History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invitee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reward
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No referral history yet. Start inviting friends to earn rewards!
                  </td>
                </tr>
              ) : (
                history.map((invitation) => (
                  <tr key={invitation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <FaUsers className="text-gray-500 text-sm" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {invitation.invitee_name || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invitation.invitee_email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaCalendar className="mr-2" />
                        {formatDate(invitation.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                        {getStatusIcon(invitation.status)}
                        <span className="ml-1">{invitation.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invitation.reward_earned ? `$${invitation.reward_earned}` : 'Pending'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average Earnings per Referral</span>
              <span className="text-sm font-semibold">${stats.averageEarningsPerReferral.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending Invitations</span>
              <span className="text-sm font-semibold">{stats.pendingInvitations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm font-semibold">{stats.conversionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Activation Rate</span>
              <span className="text-sm font-semibold">{stats.activationRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Discount Usage Rate</span>
              <span className="text-sm font-semibold">{stats.discountUsageRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Referral ROI</span>
              <span className="text-sm font-semibold">{stats.referralROI.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Viral Coefficient</span>
              <span className="text-sm font-semibold">{stats.viralCoefficient.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Referral Code Usage</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Uses</span>
              <span className="text-sm font-semibold">{stats.totalUses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Remaining Uses</span>
              <span className="text-sm font-semibold">{stats.remainingUses}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Usage Rate</span>
              <span className="text-sm font-semibold">
                {stats.totalUses > 0 ? ((stats.totalUses / (stats.totalUses + stats.remainingUses)) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Usage Progress</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${stats.totalUses > 0 ? Math.min((stats.totalUses / (stats.totalUses + stats.remainingUses)) * 100, 100) : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">Success Metrics Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <FaPercentage className="text-green-600 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.conversionRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
          <div className="text-center">
            <FaChartLine className="text-blue-600 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.activationRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Activation Rate</div>
          </div>
          <div className="text-center">
            <FaGift className="text-purple-600 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{stats.discountUsageRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Discount Usage</div>
          </div>
          <div className="text-center">
            <FaDollarSign className="text-orange-600 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{stats.referralROI.toFixed(2)}x</div>
            <div className="text-sm text-gray-600">ROI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
