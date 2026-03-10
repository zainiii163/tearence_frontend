import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  X, 
  Gift,
  Star,
  Calendar,
  Users,
  Package
} from 'lucide-react';

const RewardsSection = ({ formData, updateFormData, onNext, onPrev }) => {
  const [rewards, setRewards] = useState(formData.rewards || []);

  const addReward = () => {
    const newReward = {
      id: Date.now(),
      title: '',
      description: '',
      minimumContribution: '',
      limit: '',
      estimatedDelivery: '',
      includesShipping: false
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

  // Skip rewards if not reward-based funding
  if (formData.fundingModel !== 'reward') {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Rewards Not Required</h3>
          <p className="text-gray-600 mb-6">
            Since you selected {formData.fundingModel === 'donation' ? 'Donation' : 
                            formData.fundingModel === 'equity' ? 'Equity' : 'Loan'} funding,
            rewards are not applicable for your project.
          </p>
        </div>

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
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Rewards</h3>
        <p className="text-gray-600">
          Create compelling rewards that incentivize backers to support your project. Rewards are what backers receive in return for their contribution.
        </p>
      </div>

      {/* Rewards List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            <Package className="w-4 h-4 inline mr-1" />
            Reward Tiers
          </label>
          <button
            onClick={addReward}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Reward
          </button>
        </div>

        {rewards.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No rewards added yet</p>
            <p className="text-sm text-gray-500">Create reward tiers to attract different levels of support</p>
          </div>
        ) : (
          <div className="space-y-6">
            {rewards.map((reward, index) => (
              <div key={reward.id} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <h4 className="font-medium text-gray-900">Reward Tier {index + 1}</h4>
                  </div>
                  <button
                    onClick={() => removeReward(reward.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Reward Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reward Title
                    </label>
                    <input
                      type="text"
                      value={reward.title || ''}
                      onChange={(e) => updateReward(reward.id, 'title', e.target.value)}
                      placeholder="e.g., Early Bird Special, VIP Package"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={reward.description || ''}
                      onChange={(e) => updateReward(reward.id, 'description', e.target.value)}
                      placeholder="Describe what backers will receive"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Minimum Contribution */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Star className="w-4 h-4 inline mr-1" />
                      Minimum Contribution
                    </label>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg">
                        {formData.currency || 'USD'}
                      </span>
                      <input
                        type="number"
                        value={reward.minimumContribution || ''}
                        onChange={(e) => updateReward(reward.id, 'minimumContribution', e.target.value)}
                        placeholder="0.00"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Limit (Optional)
                    </label>
                    <input
                      type="number"
                      value={reward.limit || ''}
                      onChange={(e) => updateReward(reward.id, 'limit', e.target.value)}
                      placeholder="Number available (leave empty for unlimited)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>

                  {/* Estimated Delivery */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Estimated Delivery
                    </label>
                    <input
                      type="date"
                      value={reward.estimatedDelivery || ''}
                      onChange={(e) => updateReward(reward.id, 'estimatedDelivery', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Shipping Option */}
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id={`shipping-${reward.id}`}
                      checked={reward.includesShipping || false}
                      onChange={(e) => updateReward(reward.id, 'includesShipping', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`shipping-${reward.id}`} className="text-sm text-gray-700">
                      Includes free shipping
                    </label>
                  </div>
                </div>

                {/* Preview */}
                {(reward.title || reward.description || reward.minimumContribution) && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="text-sm text-gray-600">
                      {reward.title && <p className="font-medium">{reward.title}</p>}
                      {reward.minimumContribution && (
                        <p className="text-blue-600 font-medium">
                          {formData.currency || 'USD'} {reward.minimumContribution}+
                        </p>
                      )}
                      {reward.description && <p className="mt-1">{reward.description}</p>}
                      {reward.limit && (
                        <p className="text-amber-600 text-xs mt-1">
                          Limited to {reward.limit} backers
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Star className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Reward Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Create 3-5 reward tiers at different price points</li>
              <li>• Make early bird rewards limited to create urgency</li>
              <li>• Include exclusive experiences or behind-the-scenes access</li>
              <li>• Be realistic about delivery dates</li>
              <li>• Factor in shipping costs for physical rewards</li>
            </ul>
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

export default RewardsSection;
