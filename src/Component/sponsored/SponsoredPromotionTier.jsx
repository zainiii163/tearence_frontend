import React, { useState } from 'react';
import { Star, Crown, Zap, CheckCircle, TrendingUp, Users, Mail, Share2, Trophy, Home, ArrowRight } from 'lucide-react';

const SponsoredPromotionTier = ({ sponsoredTier, setSponsoredTier }) => {
  const [hoveredTier, setHoveredTier] = useState(null);

  const tiers = [
    {
      id: 'basic',
      name: 'Sponsored Basic',
      price: 29.99,
      icon: Star,
      color: 'from-blue-500 to-blue-600',
      badgeColor: 'bg-blue-500',
      benefits: [
        'Listed on Sponsored Adverts Page',
        'Highlighted advert card',
        'Sponsored badge',
        '3× more visibility than standard ads',
        'Basic analytics dashboard'
      ],
      features: {
        visibility: '3x Standard',
        placement: 'Sponsored Page Only',
        emailInclusion: 'No',
        socialPromotion: 'No',
        badgeType: 'Sponsored Badge',
        analytics: 'Basic',
        support: 'Email Only'
      }
    },
    {
      id: 'plus',
      name: 'Sponsored Plus',
      price: 59.99,
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      badgeColor: 'bg-purple-500',
      popular: true,
      benefits: [
        'All Basic features',
        'Top of category placement',
        'Larger advert card',
        'Priority search ranking',
        'Included in weekly Sponsored Highlights email',
        'Advanced analytics'
      ],
      features: {
        visibility: '5x Standard',
        placement: 'Top of Category',
        emailInclusion: 'Weekly Highlights',
        socialPromotion: 'No',
        badgeType: 'Plus Badge',
        analytics: 'Advanced',
        support: 'Priority Email'
      }
    },
    {
      id: 'premium',
      name: 'Sponsored Premium',
      price: 99.99,
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      badgeColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      vip: true,
      benefits: [
        'Homepage placement',
        'Homepage slider inclusion',
        'Category top placement',
        'Social media promotion',
        'Premium Sponsored badge',
        'Maximum visibility',
        'Dedicated account manager'
      ],
      features: {
        visibility: '10x Standard',
        placement: 'Homepage & Top of Category',
        emailInclusion: 'Daily & Weekly',
        socialPromotion: 'All Platforms',
        badgeType: 'Premium VIP Badge',
        analytics: 'Real-time + Insights',
        support: 'Dedicated Manager'
      }
    }
  ];

  const comparisonRows = [
    { key: 'visibility', label: 'Visibility Boost', icon: TrendingUp },
    { key: 'placement', label: 'Ad Placement', icon: Home },
    { key: 'emailInclusion', label: 'Email Inclusion', icon: Mail },
    { key: 'socialPromotion', label: 'Social Promotion', icon: Share2 },
    { key: 'badgeType', label: 'Badge Type', icon: Trophy },
    { key: 'analytics', label: 'Analytics', icon: TrendingUp },
    { key: 'support', label: 'Support Level', icon: Users }
  ];

  const selectTier = (tierId) => {
    setSponsoredTier(tierId);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Promotion Tier</h2>
        <p className="text-gray-600">Select the perfect visibility package for your sponsored advert</p>
      </div>

      {/* Smart Recommendation Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Smart Recommendation</h3>
              <p className="text-purple-100">Sponsored Plus adverts get 5× more views on average</p>
            </div>
          </div>
          <button
            onClick={() => selectTier('plus')}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center space-x-2"
          >
            <span>Choose Plus</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const isSelected = sponsoredTier === tier.id;
          const isHovered = hoveredTier === tier.id;
          
          return (
            <div
              key={tier.id}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
              onClick={() => selectTier(tier.id)}
              className={`
                relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300
                ${isSelected 
                  ? 'border-blue-500 shadow-xl transform scale-105' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }
                ${tier.popular && !isSelected ? 'ring-2 ring-purple-200' : ''}
              `}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              {/* VIP Badge */}
              {tier.vip && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span>VIP TIER</span>
                  </div>
                </div>
              )}
              
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
              
              {/* Header */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4 ${isHovered ? 'scale-110' : ''} transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-3xl font-bold text-gray-900">${tier.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="space-y-3 mb-6">
                {tier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              {/* Select Button */}
              <button
                className={`
                  w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
                  ${isSelected 
                    ? 'bg-blue-500 text-white' 
                    : `bg-gradient-to-r ${tier.color} text-white hover:shadow-lg`
                  }
                `}
              >
                {isSelected ? 'Selected' : `Select ${tier.name.split(' ')[1]}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 text-center">Feature Comparison</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                {tiers.map((tier) => (
                  <th key={tier.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    {tier.name.split(' ')[1]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comparisonRows.map((row, index) => {
                const Icon = row.icon;
                return (
                  <tr key={row.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{row.label}</span>
                      </div>
                    </td>
                    {tiers.map((tier) => (
                      <td key={tier.id} className="px-6 py-4 text-sm text-center">
                        <span className={`
                          ${tier.id === 'premium' ? 'font-semibold text-yellow-600' : 
                            tier.id === 'plus' ? 'font-medium text-purple-600' : 
                            'text-gray-700'}
                        `}>
                          {tier.features[row.key]}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Reach More Buyers</h4>
          <p className="text-sm text-gray-700">
            Sponsored adverts reach up to 10x more qualified buyers compared to standard listings
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Sell Faster</h4>
          <p className="text-sm text-gray-700">
            Premium placement helps your advert sell 3x faster with better conversion rates
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Build Trust</h4>
          <p className="text-sm text-gray-700">
            Sponsored badges and premium placement establish credibility and trust with buyers
          </p>
        </div>
      </div>

      {/* Selected Tier Summary */}
      {sponsoredTier && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  {tiers.find(t => t.id === sponsoredTier)?.name} Selected
                </h4>
                <p className="text-sm text-gray-600">
                  Your advert will receive premium placement and enhanced visibility
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ${tiers.find(t => t.id === sponsoredTier)?.price}
              </p>
              <p className="text-sm text-gray-500">per month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsoredPromotionTier;
