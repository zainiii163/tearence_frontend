import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward, FaStar, FaCrown, FaGem, FaFire, FaBolt, FaRocket, FaHeart, FaChartLine } from 'react-icons/fa';

const ReferralLeaderboard = ({ period = 'all-time' }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  useEffect(() => {
    loadLeaderboardData(selectedPeriod);
  }, [selectedPeriod]);

  const loadLeaderboardData = async (period) => {
    setLoading(true);
    try {
      // Mock data - in real app, this would come from API
      const mockData = [
        {
          rank: 1,
          userName: 'Sarah Johnson',
          avatar: '/img/avatar-1.jpg',
          totalReferrals: 45,
          successfulReferrals: 38,
          conversionRate: 84.4,
          totalEarned: 380.00,
          badges: ['crown', 'fire', 'rocket'],
          joinDate: '2024-01-15'
        },
        {
          rank: 2,
          userName: 'Mike Chen',
          avatar: '/img/avatar-2.jpg',
          totalReferrals: 42,
          successfulReferrals: 35,
          conversionRate: 83.3,
          totalEarned: 350.00,
          badges: ['medal', 'fire'],
          joinDate: '2024-02-20'
        },
        {
          rank: 3,
          userName: 'Emily Davis',
          avatar: '/img/avatar-3.jpg',
          totalReferrals: 38,
          successfulReferrals: 32,
          conversionRate: 84.2,
          totalEarned: 320.00,
          badges: ['award', 'bolt'],
          joinDate: '2024-03-10'
        },
        {
          rank: 4,
          userName: 'Alex Thompson',
          avatar: '/img/avatar-4.jpg',
          totalReferrals: 35,
          successfulReferrals: 28,
          conversionRate: 80.0,
          totalEarned: 280.00,
          badges: ['star', 'gem'],
          joinDate: '2024-01-20'
        },
        {
          rank: 5,
          userName: 'Lisa Wong',
          avatar: '/img/avatar-5.jpg',
          totalReferrals: 32,
          successfulReferrals: 26,
          conversionRate: 81.3,
          totalEarned: 260.00,
          badges: ['heart', 'fire'],
          joinDate: '2024-04-05'
        },
        {
          rank: 6,
          userName: 'James Wilson',
          avatar: '/img/avatar-6.jpg',
          totalReferrals: 28,
          successfulReferrals: 22,
          conversionRate: 78.6,
          totalEarned: 220.00,
          badges: ['bolt'],
          joinDate: '2024-05-12'
        },
        {
          rank: 7,
          userName: 'Maria Garcia',
          avatar: '/img/avatar-7.jpg',
          totalReferrals: 25,
          successfulReferrals: 20,
          conversionRate: 80.0,
          totalEarned: 200.00,
          badges: ['star'],
          joinDate: '2024-06-18'
        },
        {
          rank: 8,
          userName: 'David Lee',
          avatar: '/img/avatar-8.jpg',
          totalReferrals: 22,
          successfulReferrals: 17,
          conversionRate: 77.3,
          totalEarned: 170.00,
          badges: ['gem'],
          joinDate: '2024-07-22'
        },
        {
          rank: 9,
          userName: 'Sophie Martin',
          avatar: '/img/avatar-9.jpg',
          totalReferrals: 20,
          successfulReferrals: 15,
          conversionRate: 75.0,
          totalEarned: 150.00,
          badges: ['heart'],
          joinDate: '2024-08-30'
        },
        {
          rank: 10,
          userName: 'Tom Anderson',
          avatar: '/img/avatar-10.jpg',
          totalReferrals: 18,
          successfulReferrals: 13,
          conversionRate: 72.2,
          totalEarned: 130.00,
          badges: ['bolt'],
          joinDate: '2024-09-15'
        }
      ];
      
      setLeaderboardData(mockData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badge) => {
    const icons = {
      crown: <FaCrown className="text-yellow-500" />,
      fire: <FaFire className="text-red-500" />,
      rocket: <FaRocket className="text-blue-500" />,
      medal: <FaMedal className="text-orange-500" />,
      award: <FaAward className="text-purple-500" />,
      bolt: <FaBolt className="text-yellow-400" />,
      star: <FaStar className="text-yellow-400" />,
      gem: <FaGem className="text-purple-400" />,
      heart: <FaHeart className="text-red-400" />
    };
    return icons[badge] || <FaStar className="text-gray-400" />;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-500 text-2xl" />;
    if (rank === 2) return <FaMedal className="text-gray-400 text-2xl" />;
    if (rank === 3) return <FaAward className="text-orange-600 text-2xl" />;
    return <span className="text-gray-600 font-bold text-lg">{rank}</span>;
  };

  const getRankBackground = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
    if (rank === 3) return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300';
    return 'bg-white border-gray-200';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded mb-3"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Referral Leaderboard</h2>
        <p className="text-gray-600">Top referrers this month</p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white">
          {['all-time', 'this-month', 'this-week'].map((periodOption) => (
            <button
              key={periodOption}
              onClick={() => setSelectedPeriod(periodOption)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedPeriod === periodOption
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              } ${periodOption === 'all-time' ? 'rounded-l-lg' : ''} ${
                periodOption === 'this-week' ? 'rounded-r-lg' : ''
              }`}
            >
              {periodOption === 'all-time' ? 'All Time' : 
               periodOption === 'this-month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center p-4 rounded-lg border ${getRankBackground(user.rank)} transition-all hover:shadow-md`}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-12 text-center">
              {getRankIcon(user.rank)}
            </div>

            {/* Avatar */}
            <div className="flex-shrink-0 ml-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 ml-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{user.userName}</h3>
                <div className="flex gap-1">
                  {user.badges.map((badge, index) => (
                    <span key={index} title={badge}>
                      {getBadgeIcon(badge)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Joined {new Date(user.joinDate).toLocaleDateString()}
              </div>
            </div>

            {/* Stats */}
            <div className="flex-shrink-0 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{user.totalReferrals}</div>
                <div className="text-xs text-gray-600">Invites</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{user.successfulReferrals}</div>
                <div className="text-xs text-gray-600">Success</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">${user.totalEarned}</div>
                <div className="text-xs text-gray-600">Earned</div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="flex-shrink-0 text-center">
              <div className="flex items-center gap-1">
                <FaChartLine className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {user.conversionRate}%
                </span>
              </div>
              <div className="text-xs text-gray-500">Rate</div>
            </div>
          </div>
        ))}
      </div>

      {/* Your Position */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              25
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Your Position</h4>
              <p className="text-sm text-gray-600">Keep going to reach the top!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">15</div>
            <div className="text-sm text-gray-600">Invites</div>
            <div className="text-lg font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">Success</div>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          🏆 Top 3 referrers get special badges and rewards! 
          <span className="ml-2 text-blue-600 font-medium">Keep inviting friends to climb the leaderboard!</span>
        </p>
      </div>
    </div>
  );
};

export default ReferralLeaderboard;
