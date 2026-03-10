import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Globe, 
  Eye, 
  Users,
  CheckCircle,
  Crown,
  Zap,
  Rocket
} from 'lucide-react';

const TravelUpsellBanner = ({ onUpgrade }) => {
  const [selectedTier, setSelectedTier] = useState('featured');

  const promotionTiers = [
    {
      id: 'promoted',
      name: 'Promoted',
      price: 29,
      period: 'per month',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Highlighted listing',
        'Appears above standard adverts',
        'Promoted badge',
        '2x visibility increase',
        'Basic analytics'
      ],
      popular: false
    },
    {
      id: 'featured',
      name: 'Featured',
      price: 49,
      period: 'per month',
      icon: <Star className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Top of category placement',
        'Larger advert card',
        'Priority search placement',
        'Featured badge',
        'Advanced analytics',
        '3x visibility increase'
      ],
      popular: true
    },
    {
      id: 'sponsored',
      name: 'Sponsored',
      price: 99,
      period: 'per month',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      features: [
        'Homepage placement',
        'Category top placement',
        'Included in homepage slider',
        'Social media promotion',
        'Sponsored badge',
        'Premium analytics',
        '5x visibility increase'
      ],
      popular: false
    },
    {
      id: 'network',
      name: 'Network-Wide Boost',
      price: 199,
      period: 'per month',
      icon: <Rocket className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      features: [
        'Appears across all platform sections',
        'Email newsletter inclusion',
        'Push notifications',
        'Top Spotlight badge',
        'Dedicated support',
        'Enterprise analytics',
        'Custom branding options',
        '10x visibility increase'
      ],
      popular: false
    }
  ];

  const handleTierSelect = (tierId) => {
    setSelectedTier(tierId);
  };

  const handleUpgrade = () => {
    onUpgrade(selectedTier);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Your Travel Business Noticed
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Upgrade your listing to reach millions of travelers worldwide and boost your bookings
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">15.2M+</div>
            <div className="text-purple-200">Monthly Visitors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">142</div>
            <div className="text-purple-200">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">89%</div>
            <div className="text-purple-200">Booking Increase</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">4.8★</div>
            <div className="text-purple-200">Average Rating</div>
          </div>
        </motion.div>

        {/* Promotion Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {promotionTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                selectedTier === tier.id ? 'ring-4 ring-purple-400' : ''
              }`}
              onClick={() => handleTierSelect(tier.id)}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <div className={`bg-gradient-to-r ${tier.color} p-6 text-white`}>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                    {tier.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">{tier.name}</h3>
                <div className="text-center">
                  <span className="text-3xl font-bold">${tier.price}</span>
                  <span className="text-sm text-purple-200">/{tier.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="p-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Selection Indicator */}
              {selectedTier === tier.id && (
                <div className="absolute top-4 left-4 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">Compare All Features</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4">Features</th>
                  <th className="text-center py-3 px-4">Basic</th>
                  <th className="text-center py-3 px-4">Promoted</th>
                  <th className="text-center py-3 px-4">Featured</th>
                  <th className="text-center py-3 px-4">Sponsored</th>
                  <th className="text-center py-3 px-4">Network</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4">Listing Visibility</td>
                  <td className="text-center py-3 px-4">Standard</td>
                  <td className="text-center py-3 px-4">2x</td>
                  <td className="text-center py-3 px-4">3x</td>
                  <td className="text-center py-3 px-4">5x</td>
                  <td className="text-center py-3 px-4">10x</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4">Homepage Placement</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4">Social Media Promotion</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4">Email Newsletter</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4">Analytics</td>
                  <td className="text-center py-3 px-4">Basic</td>
                  <td className="text-center py-3 px-4">Basic</td>
                  <td className="text-center py-3 px-4">Advanced</td>
                  <td className="text-center py-3 px-4">Premium</td>
                  <td className="text-center py-3 px-4">Enterprise</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Support</td>
                  <td className="text-center py-3 px-4">Standard</td>
                  <td className="text-center py-3 px-4">Standard</td>
                  <td className="text-center py-3 px-4">Priority</td>
                  <td className="text-center py-3 px-4">Priority</td>
                  <td className="text-center py-3 px-4">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Boost Your Travel Business?
            </h3>
            <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
              Join thousands of successful travel businesses who have increased their bookings and expanded their reach with our premium promotion packages.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpgrade}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Upgrade to {promotionTiers.find(t => t.id === selectedTier)?.name}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <button className="px-8 py-4 bg-white/20 backdrop-blur text-white rounded-lg font-semibold hover:bg-white/30 transition-all duration-300">
                Learn More
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center space-x-6 text-purple-200 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>30-day guarantee</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TravelUpsellBanner;
