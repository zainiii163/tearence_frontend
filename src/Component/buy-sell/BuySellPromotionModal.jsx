import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiStar, FiTrendingUp, FiZap, FiCrown } from 'react-icons/fi';
import { buysellAPI } from '../../api/buysell';
import { DEFAULT_LISTING_TIER_ID } from '../../constants/listingTierOptions';

const BuySellPromotionModal = ({ advertId, isOpen, onClose, currentPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan || DEFAULT_LISTING_TIER_ID);
  const [loading, setLoading] = useState(false);

  const promotionPlans = [
    {
      id: 'promoted',
      name: 'Promoted',
      price: 19.99,
      duration: 30,
      features: [
        'Promoted badge',
        'Higher search ranking',
        '30 days duration',
        'Image uploads (up to 10)',
        'Highlighted in search results',
        'Social media promotion'
      ],
      icon: <FiTrendingUp className="h-5 w-5" />,
      color: 'blue',
      popular: true
    },
    {
      id: 'featured',
      name: 'Featured',
      price: 49.99,
      duration: 30,
      features: [
        'Top placement in search',
        '3x visibility boost',
        'Featured badge',
        'Priority support',
        'Advanced analytics'
      ],
      icon: <FiStar className="h-5 w-5" />,
      color: 'purple',
      popular: false
    },
    {
      id: 'sponsored',
      name: 'Sponsored',
      price: 99.99,
      duration: 30,
      features: [
        'Homepage placement',
        '5x visibility boost',
        'Sponsored badge',
        'Dedicated support',
        'Premium analytics',
        'Email campaign included'
      ],
      icon: <FiZap className="h-5 w-5" />,
      color: 'orange',
      popular: false
    },
    {
      id: 'weekend_special',
      name: 'Weekend Special',
      price: 29.99,
      duration: 7,
      features: [
        'Weekend boost',
        'Special badge',
        'Enhanced visibility',
        'Quick approval'
      ],
      icon: <FiCrown className="h-5 w-5" />,
      color: 'yellow',
      popular: false
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await buysellAPI.purchasePromotion(advertId, selectedPlan, {
        payment_method: 'stripe'
      });
      
      // Success - close modal and refresh
      onClose();
      window.location.reload(); // Simple refresh to show updated promotion
    } catch (error) {
      console.error('Error purchasing promotion:', error);
      setLoading(false);
    }
  };

  const getPlanButtonStyle = (planId) => {
    const plan = promotionPlans.find(p => p.id === planId);
    return {
      backgroundColor: plan.color === 'gray' ? '#f3f4f6' : 
                     plan.color === 'blue' ? '#3b82f6' :
                     plan.color === 'purple' ? '#8b5cf6' :
                     plan.color === 'orange' ? '#f97316' : '#eab308',
      color: plan.color === 'gray' ? '#9ca3af' : 'white',
      border: plan.color === 'gray' ? '1px solid #d1d5db' : 'none'
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Boost Your Advert</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Get more visibility and sell your item faster
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Current Status */}
            {currentPlan && (
              <div className="p-6 bg-green-50 border-b border-green-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full flex items-center justify-center">
                    <FiCheck className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">
                      Currently Active: {promotionPlans.find(p => p.id === currentPlan)?.name} Plan
                    </p>
                    <p className="text-sm text-green-700">
                      Expires in {Math.ceil((new Date(currentPlan?.expires_at) - new Date()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Plans */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Choose Promotion Plan</h3>
              <div className="space-y-4">
                {promotionPlans.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  const buttonStyle = getPlanButtonStyle(plan.id);
                  
                  return (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: 1.02 }}
                      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          POPULAR
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          plan.color === 'gray' ? 'bg-gray-100 text-gray-600' :
                          plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          plan.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                          plan.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {plan.icon}
                        </div>

                        {/* Plan Details */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                ${plan.price}
                              </div>
                              <div className="text-sm text-gray-500">
                                for {plan.duration} days
                              </div>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <FiCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <FiCheck className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                <FiCheck className="h-4 w-4 inline mr-1" />
                30-day money-back guarantee
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePurchase}
                  disabled={loading}
                  className="px-6 py-2 rounded-lg font-medium transition-all bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
                  style={getPlanButtonStyle(selectedPlan)}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <FiZap className="h-4 w-4 inline mr-2" />
                      Boost Now - ${promotionPlans.find(p => p.id === selectedPlan)?.price}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuySellPromotionModal;
