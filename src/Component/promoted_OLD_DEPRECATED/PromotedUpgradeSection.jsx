import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Crown, Zap, Check, ArrowRight, TrendingUp, Shield, Globe, Eye, Sparkles } from 'lucide-react';

const PromotedUpgradeSection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const upgradePlans = [
    {
      name: 'Promoted Basic',
      icon: Star,
      color: 'from-blue-500 to-indigo-500',
      price: { monthly: 29, yearly: 290 },
      originalPrice: { monthly: 49, yearly: 490 },
      badge: 'Popular',
      features: [
        'Highlighted listing in search results',
        'Appears above standard adverts',
        'Basic analytics dashboard',
        '7-day promotion duration',
        'Email support',
        '1 advert at a time'
      ],
      benefits: [
        '2x more visibility',
        '50% more views',
        'Basic seller badge'
      ],
      cta: 'Upgrade to Basic'
    },
    {
      name: 'Promoted Plus',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      price: { monthly: 79, yearly: 790 },
      originalPrice: { monthly: 129, yearly: 1290 },
      badge: 'Best Value',
      features: [
        'Higher placement in promoted pages',
        'Priority search ranking',
        'Advanced analytics & insights',
        '14-day promotion duration',
        'Priority email & chat support',
        '3 adverts at a time',
        'Social media promotion',
        'Featured in category pages'
      ],
      benefits: [
        '5x more visibility',
        '150% more views',
        'Premium seller badge',
        'Top category placement'
      ],
      cta: 'Upgrade to Plus'
    },
    {
      name: 'Promoted Premium',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      price: { monthly: 199, yearly: 1990 },
      originalPrice: { monthly: 349, yearly: 3490 },
      badge: 'Elite',
      features: [
        'Top of promoted listings',
        'Homepage promotion placement',
        'Maximum visibility guarantee',
        '30-day promotion duration',
        '24/7 dedicated support',
        'Unlimited adverts',
        'Full social media campaign',
        'Email newsletter inclusion',
        'Video advert support',
        'Performance optimization'
      ],
      benefits: [
        '10x more visibility',
        '500% more views',
        'Elite seller badge',
        'Homepage featured',
        'Video adverts'
      ],
      cta: 'Go Premium'
    }
  ];

  const handleUpgrade = (plan) => {
    // Navigate to upgrade page or open modal
    console.log('Upgrade to:', plan.name, 'Billing:', billingCycle);
    window.location.href = `/promoted/upgrade?plan=${plan.name.toLowerCase().replace(' ', '-')}&billing=${billingCycle}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-amber-200">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Limited Time Offer
            <TrendingUp className="w-4 h-4" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Want Your Advert Here?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upgrade to Promoted for instant visibility and reach thousands of potential buyers worldwide.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-amber-600' : 'text-gray-600'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-amber-500 transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-amber-600' : 'text-gray-600'}`}>
              Yearly
              <span className="ml-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                Save 20%
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {upgradePlans.map((plan, index) => {
            const Icon = plan.icon;
            const currentPrice = plan.price[billingCycle];
            const originalPriceValue = plan.originalPrice[billingCycle];
            
            return (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                }}
                className={`relative bg-white rounded-xl shadow-lg border-2 overflow-hidden ${
                  plan.badge === 'Best Value' ? 'border-amber-400' : 'border-gray-200'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white ${
                    plan.badge === 'Best Value' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                      : plan.badge === 'Elite'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                {/* Plan Header */}
                <div className={`p-6 bg-gradient-to-r ${plan.color} text-white`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">${currentPrice}</span>
                      <span className="text-white/80">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {originalPriceValue > currentPrice && (
                      <div className="text-white/80 line-through text-sm">
                        Was ${originalPriceValue}/{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {plan.benefits.slice(0, 2).map((benefit, idx) => (
                      <div
                        key={idx}
                        className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">What's Included:</h4>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUpgrade(plan)}
                    className={`w-full bg-gradient-to-r ${plan.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Benefits */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            Why Promoted Adverts Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Eye className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">10x More Visibility</h4>
              <p className="text-sm text-gray-600">
                Your adverts appear at the top of search results and category pages
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Global Reach</h4>
              <p className="text-sm text-gray-600">
                Connect with buyers from over 150 countries worldwide
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Trusted Platform</h4>
              <p className="text-sm text-gray-600">
                Join thousands of successful sellers who use promoted adverts
              </p>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
            <Shield className="w-4 h-4" />
            30-Day Money-Back Guarantee
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Not satisfied? Get a full refund within 30 days, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromotedUpgradeSection;
