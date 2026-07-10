import React, { useState, useEffect } from 'react';
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
import resortsTravelApi from '../../services/resortsTravelAPI';

const TIER_META = {
  promoted: { icon: <Zap className="w-5 h-5" />, color: 'from-blue-500 to-blue-600', popular: false },
  featured: { icon: <Star className="w-5 h-5" />, color: 'from-purple-500 to-purple-600', popular: true },
  sponsored: { icon: <Crown className="w-5 h-5" />, color: 'from-orange-500 to-orange-600', popular: false },
  network_wide: { icon: <Rocket className="w-5 h-5" />, color: 'from-red-500 to-red-600', popular: false },
  standard: { icon: <Globe className="w-5 h-5" />, color: 'from-gray-500 to-gray-600', popular: false },
};

const TravelUpsellBanner = ({ onUpgrade }) => {
  const [selectedTier, setSelectedTier] = useState('featured');
  const [promotionTiers, setPromotionTiers] = useState([]);

  useEffect(() => {
    resortsTravelApi.getPromotionTiers()
      .then((response) => {
        const tiers = Array.isArray(response.data) ? response.data : [];
        const mapped = tiers
          .filter(t => t.id !== 'standard')
          .map(t => ({
            id: t.id,
            name: t.name,
            price: t.price ?? 0,
            period: 'per month',
            features: Array.isArray(t.features) ? t.features : [],
            ...(TIER_META[t.id] || TIER_META.standard),
          }));
        if (mapped.length > 0) setPromotionTiers(mapped);
      })
      .catch(() => {});
  }, []);

  const handleTierSelect = (tierId) => {
    setSelectedTier(tierId);
  };

  const handleUpgrade = () => {
    onUpgrade(selectedTier);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Get Your Travel Business Noticed
          </h2>
          <p className="text-sm text-purple-200 max-w-2xl mx-auto">
            Upgrade your listing to reach millions of travelers worldwide and boost your bookings
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-1">15.2M+</div>
            <div className="text-xs text-purple-200">Monthly Visitors</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-1">142</div>
            <div className="text-xs text-purple-200">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-1">89%</div>
            <div className="text-xs text-purple-200">Booking Increase</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white mb-1">4.8★</div>
            <div className="text-xs text-purple-200">Average Rating</div>
          </div>
        </motion.div>

        {/* Promotion Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {promotionTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ${
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
              <div className={`bg-gradient-to-r ${tier.color} p-4 text-white`}>
                <div className="flex items-center justify-center mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                    {tier.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-center mb-1">{tier.name}</h3>
                <div className="text-center">
                  <span className="text-xl font-bold">${tier.price}</span>
                  <span className="text-xs text-purple-200">/{tier.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="p-4">
                <ul className="space-y-2">
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
          className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6"
        >
          <h3 className="text-lg font-bold text-white text-center mb-4">Compare All Features</h3>
          
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
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-2">
              Ready to Boost Your Travel Business?
            </h3>
            <p className="text-sm text-purple-200 mb-4 max-w-2xl mx-auto">
              Join thousands of successful travel businesses who have increased their bookings and expanded their reach with our premium promotion packages.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpgrade}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Upgrade to {promotionTiers.find(t => t.id === selectedTier)?.name}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <button className="px-6 py-2.5 bg-white/20 backdrop-blur text-white rounded-lg font-semibold text-sm hover:bg-white/30 transition-all duration-300">
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
