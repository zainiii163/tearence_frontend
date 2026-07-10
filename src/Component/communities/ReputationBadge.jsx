import React, { useState, useEffect } from 'react';
import { FaTrophy, FaCheckCircle, FaShieldAlt, FaStar, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';

const ReputationBadge = ({ userId, showDetails = false, compact = false }) => {
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadReputation();
    }
  }, [userId]);

  const loadReputation = async () => {
    setLoading(true);
    try {
      const response = await communitiesAPI.getUserReputation(userId);
      setReputation(response.data);
    } catch (error) {
      console.error('Error loading reputation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      'New Member': 'bg-gray-100 text-gray-600',
      'Trusted Member': 'bg-blue-100 text-blue-600',
      'Established Member': 'bg-green-100 text-green-600',
      'Top Contributor': 'bg-purple-100 text-purple-600',
      'Community Leader': 'bg-yellow-100 text-yellow-600',
      'Expert': 'bg-red-100 text-red-600',
    };
    return colors[level] || 'bg-gray-100 text-gray-600';
  };

  const getScoreColor = (score) => {
    if (score >= 1000) return 'text-green-600';
    if (score >= 500) return 'text-blue-600';
    if (score >= 250) return 'text-purple-600';
    return 'text-gray-600';
  };

  if (loading) {
    return compact ? (
      <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
    ) : (
      <div className="rounded-lg border bg-card p-4 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>
        <div className="h-8 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  if (!reputation) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(reputation.level)}`}>
          {reputation.level}
        </div>
        <span className={`text-sm font-semibold ${getScoreColor(reputation.reputation_score)}`}>
          {reputation.reputation_score}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Reputation</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(reputation.level)}`}>
          {reputation.level}
        </div>
      </div>
      
      {/* Score */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
          <FaTrophy className="h-6 w-6" />
        </div>
        <div>
          <p className={`text-2xl font-bold ${getScoreColor(reputation.reputation_score)}`}>
            {reputation.reputation_score}
          </p>
          <p className="text-xs text-muted-foreground">Reputation Score</p>
        </div>
      </div>

      {/* Stats */}
      {showDetails && reputation.stats && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-accent">
            <p className="text-lg font-semibold">{reputation.stats.total_posts}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div className="p-3 rounded-lg bg-accent">
            <p className="text-lg font-semibold">{reputation.stats.total_comments}</p>
            <p className="text-xs text-muted-foreground">Comments</p>
          </div>
          <div className="p-3 rounded-lg bg-accent">
            <p className="text-lg font-semibold">{reputation.stats.helpful_votes}</p>
            <p className="text-xs text-muted-foreground">Helpful Votes</p>
          </div>
          <div className="p-3 rounded-lg bg-accent">
            <p className="text-lg font-semibold">{reputation.stats.reports_received}</p>
            <p className="text-xs text-muted-foreground">Reports</p>
          </div>
        </div>
      )}

      {/* Badges */}
      {showDetails && reputation.badges && reputation.badges.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Badges</h4>
          <div className="flex flex-wrap gap-2">
            {reputation.badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs"
              >
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member Since */}
      {reputation.joined_at && (
        <div className="text-xs text-muted-foreground">
          Member since {new Date(reputation.joined_at).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default ReputationBadge;
