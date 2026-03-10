import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Crown, Zap, Check, ArrowRight, TrendingUp, Eye, Globe, BarChart3 } from 'lucide-react';

const AffiliatePromotionOptions = ({ formData, updateFormData, mode }) => {
  const [showComparison, setShowComparison] = useState(false);

  const promotionTiers = [
    {
      id: 'basic',
      name: 'Basic Listing',
      price: 0,
      description: 'Standard visibility',
      icon: Star,
      color: 'gray',
      features: [
        'Standard listing placement',
        'Basic visibility in category',
        '30-day active period',
        'Basic analytics',
        'Customer support'
      ],
      badge: null,
      recommended: false
    },
    {
      id: 'promoted',
      name: 'Promoted Post',
      price: 29,
      description: 'Enhanced visibility',
      icon: TrendingUp,
      color: 'blue',
      features: [
        'Highlighted card appearance',
        '2x visibility boost',
        'Promoted badge',
        'Priority in search results',
        'Extended 60-day active period',
        'Advanced analytics',
        'Email support'
      ],
      badge: 'Popular',
      recommended: false
    },
    {
      id: 'featured',
      name: 'Featured Post',
      price: 49,
      description: 'Premium placement',
      icon: Crown,
      color: 'purple',
      features: [
        'Top of category pages',
        'Larger card display',
        '3x visibility boost',
        'Priority search ranking',
        'Featured badge',
        'Weekly email inclusion',
        '90-day active period',
        'Premium analytics',
        'Priority support'
      ],
      badge: 'Most Popular',
      recommended: true
    },
    {
      id: 'sponsored',
      name: 'Sponsored Post',
      price: 99,
      description: 'Maximum exposure',
      icon: Zap,
      color: 'yellow',
      features: [
        'Homepage placement',
        'Category top placement',
        'Homepage slider inclusion',
        'Social media promotion',
        '5x visibility boost',
        'Sponsored badge',
        '120-day active period',
        'Enterprise analytics',
        'Dedicated support',
        'Performance guarantee'
      ],
      badge: 'Premium',
      recommended: false
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      gray: 'border-gray-300 bg-white hover:border-gray-400',
      blue: 'border-blue-300 bg-blue-50 hover:border-blue-400',
      purple: 'border-purple-300 bg-purple-50 hover:border-purple-400',
      yellow: 'border-yellow-300 bg-yellow-50 hover:border-yellow-400'
    };
    return colorMap[color] || colorMap.gray;
  };

  const getIconColor = (color) => {
    const colorMap = {
      gray: 'text-gray-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      yellow: 'text-yellow-600'
    };
    return colorMap[color] || colorMap.gray;
  };

  const handleSelectTier = (tierId) => {
    updateFormData('promotionTier', tierId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Promotion Level</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Boost your visibility and reach more promoters or customers with our premium promotion options
        </p>
      </div>

      {/* Smart Recommendation */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold mb-2">Smart Recommendation</h4>
            <p className="text-white/90">Most users choose Featured for the best results</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">$49</div>
            <div className="text-sm text-white/80">per month</div>
          </div>
        </div>
      </div>

      {/* Promotion Tiers */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {promotionTiers.map((tier) => (
          <motion.div
            key={tier.id}
            className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${getColorClasses(tier.color)} ${
              formData.promotionTier === tier.id ? 'ring-2 ring-blue-500 shadow-2xl' : ''
            } ${tier.recommended ? 'transform scale-105' : ''}`}
            onClick={() => handleSelectTier(tier.id)}
            whileHover={{ scale: tier.recommended ? 1.02 : 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Recommended Badge */}
            {tier.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>
            )}

            {/* Selection Indicator */}
            {formData.promotionTier === tier.id && (
              <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}

            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${tier.color}-100 mb-4`}>
              <tier.icon className={`h-6 w-6 ${getIconColor(tier.color)}`} />
            </div>

            {/* Name & Price */}
            <h4 className="text-lg font-bold text-gray-900 mb-2">{tier.name}</h4>
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-900">
                ${tier.price}
                {tier.price > 0 && <span className="text-sm text-gray-500 font-normal">/month</span>}
              </div>
              <p className="text-sm text-gray-600">{tier.description}</p>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {tier.features.map((feature, index) => (
                <div key={index} className="flex items-start text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                formData.promotionTier === tier.id
                  ? 'bg-blue-600 text-white'
                  : `bg-${tier.color}-100 text-${tier.color}-700 hover:bg-${tier.color}-200`
              }`}
            >
              {formData.promotionTier === tier.id ? 'Selected' : 'Select'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <span>{showComparison ? 'Hide' : 'Show'} Comparison Table</span>
          <ArrowRight className={`h-4 w-4 transform transition-transform ${showComparison ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Comparison Table */}
      {showComparison && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  {promotionTiers.map((tier) => (
                    <th key={tier.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Price
                  </td>
                  {promotionTiers.map((tier) => (
                    <td key={tier.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      ${tier.price}
                      {tier.price > 0 && <span className="text-gray-500">/mo</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Visibility Boost
                  </td>
                  {promotionTiers.map((tier) => (
                    <td key={tier.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {tier.id === 'basic' ? '1x' : tier.id === 'promoted' ? '2x' : tier.id === 'featured' ? '3x' : '5x'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Active Period
                  </td>
                  {promotionTiers.map((tier) => (
                    <td key={tier.id} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                      {tier.id === 'basic' ? '30 days' : tier.id === 'promoted' ? '60 days' : tier.id === 'featured' ? '90 days' : '120 days'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Badge
                  </td>
                  {promotionTiers.map((tier) => (
                    <td key={tier.id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {tier.badge ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tier.id === 'featured' ? 'bg-purple-100 text-purple-800' : 
                          tier.id === 'promoted' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tier.badge}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Analytics
                  </td>
                  {promotionTiers.map((tier) => (
                    <td key={tier.id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {tier.id === 'basic' || tier.id === 'promoted' ? (
                        <span className="text-gray-900">Basic</span>
                      ) : tier.id === 'featured' ? (
                        <span className="text-gray-900">Premium</span>
                      ) : (
                        <span className="text-gray-900">Enterprise</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Support
                  </td>
                  {promotionTiers.map((tier) => (
                    <td key={tier.id} className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {tier.id === 'basic' ? (
                        <span className="text-gray-900">Standard</span>
                      ) : tier.id === 'promoted' ? (
                        <span className="text-gray-900">Email</span>
                      ) : tier.id === 'featured' ? (
                        <span className="text-gray-900">Priority</span>
                      ) : (
                        <span className="text-gray-900">Dedicated</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Selected Tier Summary */}
      {formData.promotionTier && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-1">Selected: {promotionTiers.find(t => t.id === formData.promotionTier)?.name}</h4>
              <p className="text-blue-700">
                {promotionTiers.find(t => t.id === formData.promotionTier)?.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                ${promotionTiers.find(t => t.id === formData.promotionTier)?.price}
              </div>
              <div className="text-sm text-blue-700">
                {promotionTiers.find(t => t.id === formData.promotionTier)?.price > 0 ? 'per month' : 'one-time'}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AffiliatePromotionOptions;
