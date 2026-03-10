import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Crown, Star, Shield, Rocket, ArrowRight, TrendingUp, Eye } from 'lucide-react';

const PromotedUpsellBanner = ({ onUpgrade }) => {
  const promotionTiers = [
    {
      id: 'basic',
      name: 'Promoted Basic',
      price: '$29',
      icon: Crown,
      color: 'from-blue-500 to-blue-600',
      description: 'Get your advert noticed with enhanced visibility'
    },
    {
      id: 'plus',
      name: 'Promoted Plus',
      price: '$49',
      icon: Star,
      color: 'from-orange-500 to-orange-600',
      popular: true,
      description: 'Maximum exposure with premium placement'
    },
    {
      id: 'premium',
      name: 'Promoted Premium',
      price: '$99',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      description: 'Ultimate visibility across the platform'
    },
    {
      id: 'network',
      name: 'Network-Wide Boost',
      price: '$199',
      icon: Rocket,
      color: 'from-red-500 to-red-600',
      description: 'Appear everywhere users are looking'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl p-8 border border-orange-200"
    >
      {/* Main Banner Content */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Zap className="h-8 w-8 text-orange-500" />
          <h2 className="text-3xl font-bold text-gray-900">
            Want Your Advert Here?
          </h2>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Upgrade to Promoted for instant visibility
        </p>
        <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold">
          <TrendingUp className="h-5 w-5" />
          <span>Promoted Plus adverts get 4× more views on average</span>
        </div>
      </div>

      {/* Promotion Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {promotionTiers.map((tier, index) => {
          const Icon = tier.icon;
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative bg-white rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                tier.popular 
                  ? 'border-orange-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => onUpgrade(tier.id)}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <div className={`w-12 h-12 bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center text-white mb-4 mx-auto`}>
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="font-semibold text-gray-900 text-center mb-2">{tier.name}</h3>
              <div className="text-2xl font-bold text-orange-600 text-center mb-3">{tier.price}</div>
              <p className="text-sm text-gray-600 text-center mb-4">{tier.description}</p>

              <button className={`w-full py-2 rounded-lg font-medium transition-all duration-200 ${
                tier.popular
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}>
                {tier.popular ? 'Get Started' : 'Choose Plan'}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Compare Promotion Features</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Features</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Basic</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-orange-600">Plus</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Premium</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Network</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-900">Highlighted Listing</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-900">Above Standard Adverts</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-900">Promoted Badge</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-900">Top Category Placement</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-900">Priority Search Placement</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-900">Weekly Email Inclusion</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-900">Homepage Placement</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-900">Homepage Slider</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm text-gray-900">Push Notifications</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-900">Multi-Page Visibility</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-gray-400">-</td>
                <td className="py-3 px-4 text-center text-green-500">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpgrade('plus')}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
        >
          <Zap className="h-5 w-5" />
          Upgrade Your Advert Now
          <ArrowRight className="h-5 w-5" />
        </motion.button>
        <p className="text-sm text-gray-600 mt-3">
          No hidden fees • Cancel anytime • 24/7 support
        </p>
      </div>
    </motion.div>
  );
};

export default PromotedUpsellBanner;
