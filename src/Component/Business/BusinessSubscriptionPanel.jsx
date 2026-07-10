import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaCheck, FaStar } from 'react-icons/fa';

const BusinessSubscriptionPanel = ({ businessId, currentSubscription, onSubscriptionChange }) => {
  const [selectedPlan, setSelectedPlan] = useState(currentSubscription?.plan || 'basic');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$0',
      features: ['Basic listing', 'Contact form', 'Up to 5 photos'],
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$29.99/month',
      features: ['Featured listing', 'Analytics dashboard', 'Unlimited photos', 'Priority support'],
      color: 'from-purple-500 to-indigo-500',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$99.99/month',
      features: ['Top placement', 'Advanced analytics', 'Social media promotion', 'Dedicated support', 'Custom branding'],
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    if (onSubscriptionChange) {
      onSubscriptionChange(planId);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscription Plans</h3>
      <p className="text-gray-600 mb-6">Choose the perfect plan for your business</p>

      <div className="space-y-4">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => handlePlanSelect(plan.id)}
            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedPlan === plan.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 right-4">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </span>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h4>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {plan.price}
                </p>
              </div>
              {selectedPlan === plan.id && (
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <FaCheck className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <FaCheck className="h-4 w-4 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
        {currentSubscription ? 'Update Subscription' : 'Subscribe Now'}
      </button>
    </div>
  );
};

export default BusinessSubscriptionPanel;
