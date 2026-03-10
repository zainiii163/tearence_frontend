import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star,
  Crown,
  Gem,
  Zap,
  Check,
  TrendingUp,
  Eye,
  Calendar,
  Mail,
  Share2,
  DollarSign
} from 'lucide-react';

const PremiumUpsaleOptions = ({ formData, updateFormData, onNext, onPrev }) => {
  const promotionTiers = [
    {
      id: 'basic',
      name: 'Basic Listing',
      price: 0,
      currency: 'USD',
      icon: <Star className="w-6 h-6" />,
      color: 'from-gray-500 to-gray-600',
      badgeColor: 'bg-gray-100 text-gray-700',
      features: [
        'Standard visibility in project listings',
        'Basic project page',
        'Appear in search results',
        'Standard support',
        'Project analytics dashboard'
      ],
      highlighted: false
    },
    {
      id: 'promoted',
      name: 'Promoted Project',
      price: 29,
      currency: 'USD',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      badgeColor: 'bg-blue-100 text-blue-700',
      features: [
        'Enhanced visibility with "Promoted" badge',
        '2× visibility in project listings',
        'Priority placement in category pages',
        'Appears above standard listings',
        'Advanced analytics dashboard',
        'Email support within 24 hours'
      ],
      highlighted: false
    },
    {
      id: 'featured',
      name: 'Featured Project',
      price: 49,
      currency: 'USD',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      badgeColor: 'bg-purple-100 text-purple-700',
      features: [
        'Top placement in category pages',
        'Larger project card display',
        'Priority in search results',
        'Featured badge with special styling',
        'Weekly email inclusion to subscribers',
        'Social media promotion',
        'Priority support within 12 hours'
      ],
      highlighted: true,
      ribbon: 'Most Popular'
    },
    {
      id: 'sponsored',
      name: 'Sponsored Project',
      price: 99,
      currency: 'USD',
      icon: <Gem className="w-6 h-6" />,
      color: 'from-amber-500 to-amber-600',
      badgeColor: 'bg-amber-100 text-amber-700',
      features: [
        'Homepage placement for maximum exposure',
        'Category top placement',
        'Homepage slider rotation',
        'Social media promotion across platforms',
        'Sponsored badge with premium styling',
        'Dedicated email campaign',
        'Priority support within 6 hours',
        'Advanced marketing insights',
        'A/B testing for project page'
      ],
      highlighted: false
    }
  ];

  const comparisonData = [
    {
      feature: 'Standard Visibility',
      basic: true,
      promoted: true,
      featured: true,
      sponsored: true
    },
    {
      feature: 'Enhanced Badge',
      basic: false,
      promoted: true,
      featured: true,
      sponsored: true
    },
    {
      feature: 'Priority Placement',
      basic: false,
      promoted: true,
      featured: true,
      sponsored: true
    },
    {
      feature: 'Homepage Placement',
      basic: false,
      promoted: false,
      featured: false,
      sponsored: true
    },
    {
      feature: 'Email Campaign',
      basic: false,
      promoted: false,
      featured: true,
      sponsored: true
    },
    {
      feature: 'Social Media Promotion',
      basic: false,
      promoted: false,
      featured: true,
      sponsored: true
    },
    {
      feature: 'Priority Support',
      basic: false,
      promoted: true,
      featured: true,
      sponsored: true
    },
    {
      feature: 'Advanced Analytics',
      basic: false,
      promoted: true,
      featured: true,
      sponsored: true
    }
  ];

  const handleSelectTier = (tierId) => {
    updateFormData({ promotionTier: tierId });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Promotion Options</h3>
        <p className="text-gray-600">
          Boost your project's visibility and reach more funders with our premium promotion packages.
        </p>
      </div>

      {/* Promotion Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {promotionTiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
          >
            {/* Ribbon for highlighted tier */}
            {tier.ribbon && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  {tier.ribbon}
                </div>
              </div>
            )}

            <button
              onClick={() => handleSelectTier(tier.id)}
              className={`relative w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
                formData.promotionTier === tier.id
                  ? 'border-blue-500 shadow-xl bg-blue-50'
                  : tier.highlighted
                  ? 'border-purple-300 hover:border-purple-400 shadow-lg hover:shadow-xl'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Selection Indicator */}
              {formData.promotionTier === tier.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${tier.color} text-white mb-4`}>
                {tier.icon}
              </div>

              {/* Name and Price */}
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{tier.name}</h4>
              <div className="mb-4">
                {tier.price === 0 ? (
                  <span className="text-2xl font-bold text-gray-900">Free</span>
                ) : (
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${tier.price}</span>
                    <span className="text-gray-600">/{tier.currency}</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2 text-left">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Feature Comparison</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Basic
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promoted
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sponsored
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisonData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{row.feature}</td>
                  <td className="px-6 py-4 text-center">
                    {row.basic ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.promoted ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.featured ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.sponsored ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Success Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">2-5x</div>
            <div className="text-sm text-gray-600">More Views</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">3-7x</div>
            <div className="text-sm text-gray-600">Higher Funding</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">50%</div>
            <div className="text-sm text-gray-600">Faster Success</div>
          </div>
        </div>
      </div>

      {/* Money Back Guarantee */}
      <div className="bg-green-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900 mb-2">30-Day Money Back Guarantee</h4>
            <p className="text-sm text-green-700">
              If you're not satisfied with the promotion results within 30 days, we'll refund your promotion fee. No questions asked.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PremiumUpsaleOptions;
