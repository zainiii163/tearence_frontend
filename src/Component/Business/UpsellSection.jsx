import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaStar, FaFire, FaGlobe, FaCheck, FaArrowRight, FaGem, FaUsers, FaChartLine, FaLightbulb } from 'react-icons/fa';

const UpsellSection = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'promoted',
      name: 'Promoted',
      icon: <FaStar className="h-6 w-6" />,
      price: '$29.99',
      period: '/month',
      description: 'Get your business noticed with promoted listings',
      features: [
        'Appear at top of search results',
        'Promoted badge on your listing',
        '2x more visibility',
        'Priority in category pages',
        'Analytics dashboard',
        '24/7 support'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      id: 'featured',
      name: 'Featured',
      icon: <FaFire className="h-6 w-6" />,
      price: '$59.99',
      period: '/month',
      description: 'Stand out with featured placement across the platform',
      features: [
        'All Promoted features',
        'Featured carousel placement',
        '5x more visibility',
        'Social media promotion',
        'Advanced analytics',
        'Priority support',
        'Custom branding'
      ],
      color: 'from-purple-500 to-indigo-600',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: <FaGem className="h-6 w-6" />,
      price: '$99.99',
      period: '/month',
      description: 'Maximum exposure with premium benefits',
      features: [
        'All Featured features',
        'Homepage banner placement',
        '10x more visibility',
        'Dedicated account manager',
        'Unlimited analytics reports',
        'API access',
        'White-label options',
        'Exclusive events'
      ],
      color: 'from-yellow-500 to-orange-600',
      popular: false
    }
  ];

  const benefits = [
    { icon: <FaUsers className="h-8 w-8" />, title: 'Reach More Customers', description: 'Get discovered by thousands of potential customers daily' },
    { icon: <FaChartLine className="h-8 w-8" />, title: 'Track Performance', description: 'Detailed analytics to measure your success' },
    { icon: <FaLightbulb className="h-8 w-8" />, title: 'Expert Tips', description: 'Get personalized recommendations to grow your business' },
    { icon: <FaGlobe className="h-8 w-8" />, title: 'Global Reach', description: 'Expand your business visibility worldwide' }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Boost Your Business</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan to increase your visibility and reach more customers
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + (index * 0.1) }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-purple-600">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                whileHover={{ y: -8 }}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border-2 ${
                  plan.popular ? 'border-purple-500' : 'border-gray-200'
                } hover:shadow-2xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 text-sm font-bold rounded-bl-xl">
                    MOST POPULAR
                  </div>
                )}
                
                <div className={`p-6 bg-gradient-to-br ${plan.color}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white">
                      {plan.icon}
                    </div>
                    <div className="text-white/90 text-sm font-semibold">
                      {plan.period}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-white mb-2">{plan.price}</div>
                  <p className="text-white/90 text-sm">{plan.description}</p>
                </div>

                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                        <FaCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center">
                    Get Started
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <FaCrown className="h-12 w-12 text-yellow-300 mr-4" />
              <h3 className="text-3xl font-bold text-white">Not sure which plan is right for you?</h3>
            </div>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Our team is here to help you choose the perfect plan for your business needs
            </p>
            <button className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
              Contact Sales
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UpsellSection;
