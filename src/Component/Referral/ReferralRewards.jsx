import React, { useState, useEffect } from 'react';
import { FaGift, FaTag, FaCheck, FaTimes, FaShoppingCart, FaPercent, FaCalendar, FaClock, FaStar, FaRocket } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ReferralRewards = () => {
  const [availableRewards, setAvailableRewards] = useState([]);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, this would come from API
      const mockAvailableRewards = [
        {
          id: 'discount-10',
          type: 'discount',
          title: '10% Discount',
          description: 'Get 10% off your next advert',
          value: 10,
          valueType: 'percentage',
          category: 'discount',
          icon: FaPercent,
          color: 'bg-blue-500',
          expiresAt: '2024-12-31',
          source: 'referral',
          sourceInfo: 'From referring John Doe',
          isExpiring: false
        },
        {
          id: 'discount-20',
          type: 'discount',
          title: '20% Discount',
          description: 'Get 20% off your next advert',
          value: 20,
          valueType: 'percentage',
          category: 'discount',
          icon: FaPercent,
          color: 'bg-green-500',
          expiresAt: '2024-12-31',
          source: 'referral',
          sourceInfo: 'From referring Jane Smith',
          isExpiring: false
        },
        {
          id: 'discount-15',
          type: 'discount',
          title: '15% Discount',
          description: 'Get 15% off your next advert',
          value: 15,
          valueType: 'percentage',
          category: 'discount',
          icon: FaPercent,
          color: 'bg-purple-500',
          expiresAt: '2024-11-30',
          source: 'referral',
          sourceInfo: 'From referring Mike Johnson',
          isExpiring: true
        },
        {
          id: 'free-boost',
          type: 'boost',
          title: 'Free Boost',
          description: '7 days of featured listing',
          value: 7,
          valueType: 'days',
          category: 'boost',
          icon: FaRocket,
          color: 'bg-orange-500',
          expiresAt: '2024-12-15',
          source: 'milestone',
          sourceInfo: '10 referrals milestone',
          isExpiring: false
        },
        {
          id: 'priority-listing',
          type: 'priority',
          title: 'Priority Listing',
          description: 'Top placement for 30 days',
          value: 30,
          valueType: 'days',
          category: 'priority',
          icon: FaStar,
          color: 'bg-yellow-500',
          expiresAt: '2024-12-20',
          source: 'milestone',
          sourceInfo: '25 referrals milestone',
          isExpiring: false
        }
      ];

      const mockRedeemedRewards = [
        {
          id: 'discount-5',
          title: '5% Discount',
          description: 'Used on 2024-10-15',
          redeemedAt: '2024-10-15',
          value: 5,
          valueType: 'percentage',
          icon: FaTag,
          color: 'bg-gray-400'
        },
        {
          id: 'free-boost-used',
          title: 'Free Boost',
          description: 'Used from Oct 1-7, 2024',
          redeemedAt: '2024-10-01',
          value: 7,
          valueType: 'days',
          icon: FaRocket,
          color: 'bg-gray-400'
        }
      ];

      setAvailableRewards(mockAvailableRewards);
      setRedeemedRewards(mockRedeemedRewards);
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = async () => {
    if (!selectedReward) return;

    try {
      // Mock API call - in real app, this would call the redemption endpoint
      console.log('Redeeming reward:', selectedReward);
      
      // Move reward from available to redeemed
      setAvailableRewards(prev => prev.filter(r => r.id !== selectedReward.id));
      setRedeemedRewards(prev => [
        {
          ...selectedReward,
          redeemedAt: new Date().toISOString(),
          icon: FaCheck,
          color: 'bg-green-500'
        },
        ...prev
      ]);

      toast.success(`${selectedReward.title} redeemed successfully!`);
      setShowRedeemModal(false);
      setSelectedReward(null);
    } catch (error) {
      toast.error('Failed to redeem reward');
    }
  };

  const getDaysUntilExpiry = (expiresAt) => {
    const expiryDate = new Date(expiresAt);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatExpiry = (expiresAt) => {
    const daysLeft = getDaysUntilExpiry(expiresAt);
    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Expires today';
    if (daysLeft === 1) return 'Expires tomorrow';
    return `Expires in ${daysLeft} days`;
  };

  const getRewardIcon = (reward) => {
    const IconComponent = reward.icon;
    return <IconComponent className="text-white" />;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Rewards</h2>
        <p className="text-gray-600">Redeem discounts and bonuses earned from referrals</p>
      </div>

      {/* Available Rewards */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Rewards ({availableRewards.length})</h3>
        
        {availableRewards.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FaGift className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No available rewards</p>
            <p className="text-sm text-gray-500">Invite friends to earn rewards!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${reward.color} rounded-lg flex items-center justify-center`}>
                      {getRewardIcon(reward)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{reward.title}</h4>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">
                      {reward.value}
                      <span className="text-sm text-gray-600 ml-1">
                        {reward.valueType === 'percentage' ? '%' : 
                         reward.valueType === 'days' ? ' days' : ''}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">From:</span>
                    <span className="text-gray-700 font-medium">{reward.sourceInfo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-gray-400" />
                    <span className={`text-xs ${reward.isExpiring ? 'text-red-600' : 'text-gray-600'}`}>
                      {formatExpiry(reward.expiresAt)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRedeem(reward)}
                  className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaShoppingCart />
                  Redeem Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Redeemed Rewards */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Redeemed Rewards ({redeemedRewards.length})</h3>
        
        {redeemedRewards.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FaTag className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No redeemed rewards yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {redeemedRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 opacity-75"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${reward.color} rounded-lg flex items-center justify-center`}>
                      {getRewardIcon(reward)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">{reward.title}</h4>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Redeemed on {new Date(reward.redeemedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <FaCheck />
                    <span className="text-sm font-medium">Redeemed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Confirm Redemption</h3>
              <button
                onClick={() => setShowRedeemModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${selectedReward.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {getRewardIcon(selectedReward)}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedReward.title}</h4>
              <p className="text-gray-600 mb-4">{selectedReward.description}</p>
              <div className="text-2xl font-bold text-blue-600">
                {selectedReward.value}
                <span className="text-sm text-gray-600 ml-1">
                  {selectedReward.valueType === 'percentage' ? '%' : 
                   selectedReward.valueType === 'days' ? ' days' : ''}
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ This reward will be applied to your next advert automatically.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedeem}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirm Redeem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralRewards;
