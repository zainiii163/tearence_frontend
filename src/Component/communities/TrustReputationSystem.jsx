import React from 'react';
import { FaTrophy, FaShieldAlt, FaStar, FaCheckCircle, FaExclamationTriangle, FaChartLine, FaAward, FaMedal } from 'react-icons/fa';

const TrustReputationSystem = ({ user, showFull = false }) => {
  const calculateReputationScore = () => {
    if (!user) return 0;
    
    let score = 0;
    
    // Base score from completed deals (mock data)
    score += (user.completed_deals || 0) * 10;
    
    // Positive reviews
    score += (user.positive_reviews || 0) * 5;
    
    // Negative reviews (subtraction)
    score -= (user.negative_reviews || 0) * 3;
    
    // Rule compliance bonus
    score += (user.rule_compliance_score || 0) * 2;
    
    // Account age bonus
    const accountAge = user.account_age_days || 0;
    if (accountAge > 365) score += 20;
    if (accountAge > 730) score += 30;
    
    // Verification status bonus
    if (user.is_verified) score += 50;
    if (user.is_business_verified) score += 100;
    
    return Math.max(0, score);
  };

  const getReputationLevel = (score) => {
    if (score >= 1000) return { level: 'Elite', color: 'purple', icon: FaTrophy, description: 'Top 1% - Exceptional reputation' };
    if (score >= 500) return { level: 'Expert', color: 'blue', icon: FaAward, description: 'Top 5% - Highly trusted' };
    if (score >= 250) return { level: 'Trusted', color: 'green', icon: FaShieldAlt, description: 'Well-established member' };
    if (score >= 100) return { level: 'Established', color: 'yellow', icon: FaStar, description: 'Good track record' };
    if (score >= 50) return { level: 'Rising', color: 'orange', icon: FaChartLine, description: 'Building reputation' };
    return { level: 'New', color: 'gray', icon: FaMedal, description: 'Getting started' };
  };

  const reputationScore = calculateReputationScore();
  const reputationLevel = getReputationLevel(reputationScore);
  const ReputationIcon = reputationLevel.icon;

  const TrustIndicators = () => (
    <div className="flex items-center gap-2">
      {user?.is_verified && (
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
          <FaCheckCircle className="h-3 w-3" />
          Verified
        </div>
      )}
      
      {user?.is_business_verified && (
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          <FaShieldAlt className="h-3 w-3" />
          Business Verified
        </div>
      )}
      
      {user?.has_background_check && (
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
          <FaCheckCircle className="h-3 w-3" />
          Background Checked
        </div>
      )}
      
      {user?.strict_moderation && (
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
          <FaExclamationTriangle className="h-3 w-3" />
          Strict Moderation
        </div>
      )}
    </div>
  );

  const ReputationStats = () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
      <div>
        <div className="text-lg font-semibold text-primary">{user?.completed_deals || 0}</div>
        <div className="text-xs text-muted-foreground">Completed Deals</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-green-600">{user?.positive_reviews || 0}</div>
        <div className="text-xs text-muted-foreground">Positive Reviews</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-red-600">{user?.negative_reviews || 0}</div>
        <div className="text-xs text-muted-foreground">Negative Reviews</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-blue-600">{user?.response_rate || 0}%</div>
        <div className="text-xs text-muted-foreground">Response Rate</div>
      </div>
    </div>
  );

  const ReputationProgress = () => {
    const nextLevelThreshold = {
      'New': 50,
      'Rising': 100,
      'Established': 250,
      'Trusted': 500,
      'Expert': 1000,
      'Elite': Infinity
    };
    
    const currentThreshold = nextLevelThreshold[reputationLevel.level] || 0;
    const progress = reputationLevel.level === 'Elite' ? 100 : (reputationScore / currentThreshold) * 100;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Reputation Score</span>
          <span className="text-muted-foreground">{reputationScore} pts</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`bg-gradient-to-r from-${reputationLevel.color}-500 to-${reputationLevel.color}-600 h-2 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {reputationLevel.level === 'Elite' 
            ? 'Maximum reputation achieved!' 
            : `${currentThreshold - reputationScore} points to next level`
          }
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <FaTrophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">User information not available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${showFull ? 'p-4 bg-card rounded-lg border' : ''}`}>
      {/* Reputation Header */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full bg-${reputationLevel.color}-100 flex items-center justify-center`}>
          <ReputationIcon className={`h-6 w-6 text-${reputationLevel.color}-600`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-${reputationLevel.color}-700`}>
              {reputationLevel.level} Member
            </h3>
            <span className={`px-2 py-1 rounded-full bg-${reputationLevel.color}-100 text-${reputationLevel.color}-700 text-xs font-medium`}>
              {reputationScore} pts
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{reputationLevel.description}</p>
        </div>
      </div>

      {/* Trust Indicators */}
      <TrustIndicators />

      {showFull && (
        <>
          {/* Reputation Progress */}
          <ReputationProgress />

          {/* Statistics */}
          <ReputationStats />

          {/* Reputation Breakdown */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-3">Reputation Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed Deals</span>
                <span className="font-medium">+{user?.completed_deals || 0} × 10 = {(user?.completed_deals || 0) * 10} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Positive Reviews</span>
                <span className="font-medium text-green-600">+{user?.positive_reviews || 0} × 5 = {(user?.positive_reviews || 0) * 5} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Negative Reviews</span>
                <span className="font-medium text-red-600">-{user?.negative_reviews || 0} × 3 = -{(user?.negative_reviews || 0) * 3} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Age</span>
                <span className="font-medium">+{user?.account_age_days > 365 ? (user?.account_age_days > 730 ? 50 : 20) : 0} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Verification Status</span>
                <span className="font-medium text-blue-600">+{(user?.is_verified ? 50 : 0) + (user?.is_business_verified ? 100 : 0)} pts</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrustReputationSystem;
