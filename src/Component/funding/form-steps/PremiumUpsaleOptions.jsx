import React, { useState, useEffect } from 'react';
import fundingService from '../../../services/FundingService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star,
  Crown,
  Gem,
  Zap,
  Check,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

const PremiumUpsaleOptions = ({ formData, updateFormData, onNext, onPrev }) => {
  const [promotionTiers, setPromotionTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTier, setSelectedTier] = useState(formData.promotionTier || 'basic');

  // Load promotion tiers from API
  useEffect(() => {
    const loadPromotionTiers = async () => {
      try {
        const response = await fundingService.upsells.getPlans();
        if (response.data && response.data.length > 0) {
          setPromotionTiers(response.data);
        } else {
          // Fallback to static data
          setPromotionTiers([
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
          ]);
        }
      } catch (error) {
        console.error('Error loading promotion tiers:', error);
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    };
    loadPromotionTiers();
  }, []);

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
    setSelectedTier(tierId);
    updateFormData({ promotionTier: tierId });
  };

  const handleNext = () => {
    if (selectedTier) {
      onNext();
    }
  };

  const handlePrev = () => {
    if (onPrev) onPrev();
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved progress will be lost.')) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Navigation */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
              8
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Premium Options</h2>
              <p className="text-sm text-gray-600">Choose your promotion package</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrev}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Previous
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              <X className="w-4 h-4 inline-block mr-2" />
              Cancel
            </button>
          </div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-800 font-medium">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Promotion Packages</h3>
            <p className="text-gray-600">
              Boost your project's visibility and reach more funders with our premium promotion packages. Choose the package that best fits your goals and budget.
            </p>
          </div>

          {/* Promotion Tiers */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {promotionTiers.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 ${
                    selectedTier === tier.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                  }`}
                  onClick={() => handleSelectTier(tier.id)}
                >
                  {/* Ribbon for most popular */}
                  {tier.ribbon && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {tier.ribbon}
                      </div>
                    </div>
                  )}

                  {/* Tier Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r ${tier.color}`}>
                    {tier.icon}
                  </div>

                  {/* Tier Name */}
                  <h4 className="text-lg font-bold text-gray-900 text-center mb-2">{tier.name}</h4>

                  {/* Price */}
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ${tier.price}
                    </span>
                    <span className="text-gray-600 text-sm">/month</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Selection Indicator */}
                  <div className="flex justify-center">
                    {selectedTier === tier.id ? (
                      <div className="flex items-center gap-2 text-purple-600 font-medium">
                        <CheckCircle className="w-5 h-5" />
                        Selected
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">Click to select</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Comparison Table */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Feature Comparison</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Feature</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Basic</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Promoted</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Featured</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Sponsored</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-sm text-gray-700">Standard Visibility</td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-sm text-gray-700">Enhanced Badge</td>
                    <td className="text-center py-3 px-4"><span className="text-gray-400">-</span></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-sm text-gray-700">Priority Placement</td>
                    <td className="text-center py-3 px-4"><span className="text-gray-400">-</span></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-sm text-gray-700">Homepage Placement</td>
                    <td className="text-center py-3 px-4"><span className="text-gray-400">-</span></td>
                    <td className="text-center py-3 px-4"><span className="text-gray-400">-</span></td>
                    <td className="text-center py-3 px-4"><span className="text-gray-400">-</span></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 text-sm text-gray-700">Email Campaign</td>
                    <td className="text-center py-3 px-4"><span className="text-gray-400">-</span></td>
                    <td className="text-center py-3 px-4"><span className="text-gray-400">-</span></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-gray-700">Priority Support</td>
                    <td className="text-center py-3 px-4"><span className="text-gray-400">-</span></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="text-center py-3 px-4"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Success Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">3×</div>
                <div className="text-sm text-gray-700">More Views</div>
                <div className="text-xs text-gray-500">On average with promotion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">50%</div>
                <div className="text-sm text-gray-700">Faster Funding</div>
                <div className="text-xs text-gray-500">Time to goal completion</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
                <div className="text-sm text-gray-700">Success Rate</div>
                <div className="text-xs text-gray-500">For promoted projects</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
            >
              Continue to Final Step
              <ArrowRight className="w-4 h-4 inline-block ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpsaleOptions;
