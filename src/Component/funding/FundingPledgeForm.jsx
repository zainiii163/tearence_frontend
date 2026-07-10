import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  DollarSign, 
  Gift, 
  Shield, 
  Check,
  AlertCircle,
  Loader2,
  User,
  Calendar,
  Award,
  Star
} from 'lucide-react';
import fundingService from '../../services/FundingService';

const FundingPledgeForm = ({ project, rewards, onClose, onSuccess }) => {
  const [selectedReward, setSelectedReward] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [pledgeData, setPledgeData] = useState({
    amount: '',
    funding_reward_id: null,
    notes: '',
    is_anonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleRewardSelect = (reward) => {
    setSelectedReward(reward);
    setPledgeData(prev => ({
      ...prev,
      amount: reward.minimum_contribution.toString(),
      funding_reward_id: reward.id
    }));
    setCustomAmount('');
  };

  const handleCustomAmountChange = (amount) => {
    setCustomAmount(amount);
    setPledgeData(prev => ({
      ...prev,
      amount: amount,
      funding_reward_id: null
    }));
    setSelectedReward(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate amount
      const amount = parseFloat(pledgeData.amount);
      if (amount < (project.minimum_contribution || 1)) {
        throw new Error(`Minimum contribution is $${project.minimum_contribution || 1}`);
      }

      // Validate reward if selected
      if (selectedReward && amount < selectedReward.minimum_contribution) {
        throw new Error(`Minimum contribution for this reward is $${selectedReward.minimum_contribution}`);
      }

      const response = await fundingService.makePledge(project.id, pledgeData);
      onSuccess(response.data);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create pledge. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Back This Project</h2>
                    <p className="text-sm text-gray-600">{project.title}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Error Display */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-red-800 font-medium">Pledge Error</p>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={project.cover_image} 
                      alt={project.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.tagline}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>${project.amount_raised} raised</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{project.backer_count} backers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{project.days_remaining} days left</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rewards Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Reward</h3>
                  <div className="space-y-3">
                    {/* No Reward Option */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        !selectedReward && !customAmount
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleCustomAmountChange(project.minimum_contribution || 1)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">No reward</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Support this project without a reward
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">
                            ${project.minimum_contribution || 1}+
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Available Rewards */}
                    {rewards?.filter(reward => !reward.is_limit_reached).map(reward => (
                      <div
                        key={reward.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedReward?.id === reward.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleRewardSelect(reward)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Gift className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{reward.title}</span>
                              {reward.limit && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                  {reward.available_count} left
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                            {reward.estimated_delivery_date && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                <span>Estimated delivery: {new Date(reward.estimated_delivery_date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              ${reward.minimum_contribution}+
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pledge Amount (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min={project.minimum_contribution || 1}
                      step="0.01"
                      value={pledgeData.amount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum contribution: ${project.minimum_contribution || 1}
                  </p>
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to Creator (Optional)
                  </label>
                  <textarea
                    value={pledgeData.notes}
                    onChange={(e) => setPledgeData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a message of support or ask a question..."
                  />
                </div>

                {/* Anonymous Option */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={pledgeData.is_anonymous}
                    onChange={(e) => setPledgeData(prev => ({ ...prev, is_anonymous: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                    Back this project anonymously
                  </label>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !pledgeData.amount}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      Pledge ${pledgeData.amount || '0'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FundingPledgeForm;
