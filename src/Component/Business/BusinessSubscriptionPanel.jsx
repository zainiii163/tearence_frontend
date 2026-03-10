import React, { useState, useEffect } from 'react';
import { FaCrown, FaStar, FaBolt, FaGem, FaCheck, FaArrowRight, FaCreditCard } from 'react-icons/fa';
import api from '../../api';
import toast from 'react-hot-toast';

const BusinessSubscriptionPanel = ({ businessId, currentSubscription, onSubscriptionChange }) => {
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      duration: 'lifetime',
      features: [
        'Business profile creation',
        'Up to 5 permanent posts',
        'Basic analytics',
        'Standard support'
      ],
      icon: <FaGem className="h-6 w-6" />,
      color: 'from-gray-500 to-gray-600',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 29.99,
      duration: 'monthly',
      features: [
        'Everything in Free',
        'Unlimited permanent posts',
        'Advanced analytics',
        'Priority support',
        'Promoted post credits (5/month)',
        'Featured post credits (3/month)',
        'Sponsored post credits (2/month)'
      ],
      icon: <FaStar className="h-6 w-6" />,
      color: 'from-purple-500 to-indigo-600',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 99.99,
      duration: 'monthly',
      features: [
        'Everything in Premium',
        'Unlimited everything',
        'Dedicated account manager',
        'Custom branding',
        'API access',
        'White-label options',
        'Unlimited promoted/featured/sponsored posts'
      ],
      icon: <FaCrown className="h-6 w-6" />,
      color: 'from-amber-500 to-orange-600',
      popular: false
    }
  ];

  const handleSubscribe = async (planId) => {
    setLoading(true);
    try {
      const response = await api.post('/business/subscribe', {
        business_id: businessId,
        plan_id: planId
      });
      
      if (response.data.success) {
        toast.success('Subscription updated successfully!');
        onSubscriptionChange(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to update subscription');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  const getPostCredits = (planId) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return { permanent: 0, promoted: 0, featured: 0, sponsored: 0 };
    
    switch(planId) {
      case 'free':
        return { permanent: 5, promoted: 0, featured: 0, sponsored: 0 };
      case 'premium':
        return { permanent: -1, promoted: 5, featured: 3, sponsored: 2 }; // -1 means unlimited
      case 'enterprise':
        return { permanent: -1, promoted: -1, featured: -1, sponsored: -1 };
      default:
        return { permanent: 0, promoted: 0, featured: 0, sponsored: 0 };
    }
  };

  const currentPlan = subscriptionPlans.find(p => p.id === currentSubscription?.plan) || subscriptionPlans[0];
  const credits = getPostCredits(currentSubscription?.plan || 'free');

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              {currentPlan.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold">{currentPlan.name}</h3>
              <p className="text-white/80">
                {currentPlan.price === 0 ? 'Free forever' : `$${currentPlan.price}/${currentPlan.duration}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80">Status</div>
            <div className="text-lg font-semibold capitalize">
              {currentSubscription?.status || 'Active'}
            </div>
          </div>
        </div>
        
        {/* Post Credits Display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">
              {credits.permanent === -1 ? '∞' : credits.permanent}
            </div>
            <div className="text-xs text-white/80">Permanent Posts</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">
              {credits.promoted === -1 ? '∞' : credits.promoted}
            </div>
            <div className="text-xs text-white/80">Promoted Credits</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">
              {credits.featured === -1 ? '∞' : credits.featured}
            </div>
            <div className="text-xs text-white/80">Featured Credits</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">
              {credits.sponsored === -1 ? '∞' : credits.sponsored}
            </div>
            <div className="text-xs text-white/80">Sponsored Credits</div>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upgrade Your Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border-2 ${
                plan.popular 
                  ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                  : 'border-gray-200'
              } bg-white overflow-hidden hover:shadow-lg transition-shadow`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              
              <div className={`p-6 bg-gradient-to-br ${plan.color} text-white`}>
                <div className="flex items-center justify-between mb-4">
                  {plan.icon}
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ${plan.price}
                    </div>
                    <div className="text-sm text-white/80">
                      /{plan.duration}
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-bold">{plan.name}</h4>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <FaCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading || plan.id === currentSubscription?.plan}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    plan.id === currentSubscription?.plan
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : plan.id === currentSubscription?.plan ? (
                    'Current Plan'
                  ) : (
                    <>
                      <FaCreditCard className="h-4 w-4" />
                      {plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
                      <FaArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Usage This Month</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Permanent Posts Used</span>
              <span className="text-sm font-medium text-gray-900">
                {currentSubscription?.usage?.permanent_posts || 0} / {credits.permanent === -1 ? '∞' : credits.permanent}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: credits.permanent === -1 
                    ? '0%' 
                    : `${Math.min((currentSubscription?.usage?.permanent_posts || 0) / credits.permanent * 100, 100)}%` 
                }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Promoted Posts Used</span>
              <span className="text-sm font-medium text-gray-900">
                {currentSubscription?.usage?.promoted_posts || 0} / {credits.promoted === -1 ? '∞' : credits.promoted}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: credits.promoted === -1 
                    ? '0%' 
                    : `${Math.min((currentSubscription?.usage?.promoted_posts || 0) / credits.promoted * 100, 100)}%` 
                }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Featured Posts Used</span>
              <span className="text-sm font-medium text-gray-900">
                {currentSubscription?.usage?.featured_posts || 0} / {credits.featured === -1 ? '∞' : credits.featured}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: credits.featured === -1 
                    ? '0%' 
                    : `${Math.min((currentSubscription?.usage?.featured_posts || 0) / credits.featured * 100, 100)}%` 
                }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Sponsored Posts Used</span>
              <span className="text-sm font-medium text-gray-900">
                {currentSubscription?.usage?.sponsored_posts || 0} / {credits.sponsored === -1 ? '∞' : credits.sponsored}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: credits.sponsored === -1 
                    ? '0%' 
                    : `${Math.min((currentSubscription?.usage?.sponsored_posts || 0) / credits.sponsored * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSubscriptionPanel;
