import React, { useState } from 'react';
import fundingService from '../../../services/FundingService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  Gift,
  Package,
  AlertCircle,
  Info,
  DollarSign,
  Users,
  Calendar,
  Check,
  Star,
  Truck,
  Clock
} from 'lucide-react';

const RewardsSection = ({ formData, updateFormData, onNext, onPrev }) => {
  const [rewards, setRewards] = useState(formData.rewards || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const addReward = () => {
    const newReward = {
      id: Date.now(),
      title: '',
      description: '',
      minimumContribution: '',
      limit: '',
      estimatedDelivery: '',
      includesShipping: false,
      shippingCost: 0
    };
    const updatedRewards = [...rewards, newReward];
    setRewards(updatedRewards);
    updateFormData({ rewards: updatedRewards });
  };

  const updateReward = (id, field, value) => {
    const updatedRewards = rewards.map(reward =>
      reward.id === id ? { ...reward, [field]: value } : reward
    );
    setRewards(updatedRewards);
    updateFormData({ rewards: updatedRewards });
  };

  const removeReward = (id) => {
    const updatedRewards = rewards.filter(reward => reward.id !== id);
    setRewards(updatedRewards);
    updateFormData({ rewards: updatedRewards });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.fundingModel === 'reward' && rewards.length === 0) {
      newErrors.rewards = 'Please add at least one reward tier';
    }
    
    rewards.forEach((reward, index) => {
      if (!reward.title) {
        newErrors[`reward_${index}_title`] = 'Reward title is required';
      }
      if (!reward.minimumContribution || reward.minimumContribution <= 0) {
        newErrors[`reward_${index}_minContribution`] = 'Minimum contribution must be greater than 0';
      }
      if (reward.limit && reward.limit <= 0) {
        newErrors[`reward_${index}_limit`] = 'Limit must be greater than 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare rewards data
      const rewardsData = rewards.map(reward => ({
        title: reward.title,
        description: reward.description,
        minimum_contribution: parseFloat(reward.minimumContribution),
        limit: reward.limit ? parseInt(reward.limit) : null,
        estimated_delivery: reward.estimatedDelivery,
        includes_shipping: reward.includesShipping,
        shipping_cost: parseFloat(reward.shippingCost) || 0
      }));
      
      // Save rewards
      if (formData.projectId) {
        // Update existing project
        await fundingService.updateProject(formData.projectId, {
          rewards: rewardsData
        });
      } else {
        // Save to form data for new project
        updateFormData({ rewards: rewardsData });
      }
      
      onNext();
    } catch (err) {
      console.error('Error saving rewards:', err);
      setError('Failed to save rewards. Please try again.');
    } finally {
      setLoading(false);
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

  // Skip rewards if not reward-based funding
  if (formData.fundingModel !== 'reward') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                5
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Rewards</h2>
                <p className="text-sm text-gray-600">Optional for your funding model</p>
              </div>
            </div>
            
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

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rewards Not Required</h3>
              <p className="text-gray-600 mb-6">
                Since you selected {formData.fundingModel === 'donation' ? 'Donation' : 
                                formData.fundingModel === 'equity' ? 'Equity' : 'Loan'} funding,
                rewards are not required for your project.
              </p>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
              >
                Continue to Next Step
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Navigation */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              5
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Rewards</h2>
              <p className="text-sm text-gray-600">Create reward tiers for your backers</p>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Reward Tiers</h3>
            <p className="text-gray-600">
              Offer different reward levels to incentivize backers. Each tier should provide increasing value for higher contributions.
            </p>
          </div>

          {/* Add Reward Button */}
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Reward Tiers ({rewards.length})</h4>
            <button
              onClick={addReward}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Reward
            </button>
          </div>

          {errors.rewards && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.rewards}</p>
            </div>
          )}

          {/* Rewards List */}
          <div className="space-y-6">
            {rewards.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Rewards Yet</h4>
                <p className="text-gray-600 mb-4">
                  Add your first reward tier to get started
                </p>
                <button
                  onClick={addReward}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add First Reward
                </button>
              </div>
            ) : (
              rewards.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-xl p-6"
                >
                  {/* Reward Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={reward.title}
                          onChange={(e) => updateReward(reward.id, 'title', e.target.value)}
                          placeholder="Reward Title (e.g., Early Bird Supporter)"
                          className={`text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors ${
                            errors[`reward_${index}_title`] ? 'border-red-500' : ''
                          }`}
                        />
                        {errors[`reward_${index}_title`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`reward_${index}_title`]}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeReward(reward.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Reward Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={reward.description}
                          onChange={(e) => updateReward(reward.id, 'description', e.target.value)}
                          placeholder="Describe what backers will receive..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Minimum Contribution */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          Minimum Contribution <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={reward.minimumContribution}
                          onChange={(e) => updateReward(reward.id, 'minimumContribution', parseFloat(e.target.value) || '')}
                          placeholder="25"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`reward_${index}_minContribution`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`reward_${index}_minContribution`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`reward_${index}_minContribution`]}</p>
                        )}
                      </div>

                      {/* Limit */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Users className="w-4 h-4 inline mr-1" />
                          Backer Limit (optional)
                        </label>
                        <input
                          type="number"
                          value={reward.limit}
                          onChange={(e) => updateReward(reward.id, 'limit', e.target.value)}
                          placeholder="100"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[`reward_${index}_limit`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`reward_${index}_limit`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`reward_${index}_limit`]}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Estimated Delivery */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Estimated Delivery
                        </label>
                        <input
                          type="text"
                          value={reward.estimatedDelivery}
                          onChange={(e) => updateReward(reward.id, 'estimatedDelivery', e.target.value)}
                          placeholder="December 2024"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Shipping Options */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Truck className="w-4 h-4 inline mr-1" />
                          Shipping
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={reward.includesShipping}
                              onChange={(e) => updateReward(reward.id, 'includesShipping', e.target.checked)}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Includes shipping</span>
                          </label>
                          {reward.includesShipping && (
                            <input
                              type="number"
                              value={reward.shippingCost}
                              onChange={(e) => updateReward(reward.id, 'shippingCost', parseFloat(e.target.value) || 0)}
                              placeholder="10"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Tips */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="font-medium text-blue-900 mb-2">Reward Tips</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Start with a low-cost reward for early supporters</li>
                  <li>• Limited editions create urgency and exclusivity</li>
                  <li>• Be specific about what backers will receive</li>
                  <li>• Consider shipping costs for physical rewards</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </span>
              ) : (
                <span>Next Step</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsSection;
