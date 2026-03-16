import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  DollarSign,
  Calendar,
  Target,
  TrendingUp,
  PiggyBank,
  HandCoins,
  Building,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import fundingService from '../../../services/FundingService';

const FundingDetails = ({ formData, updateFormData, onNext, onPrev }) => {
  const [useOfFunds, setUseOfFunds] = useState(formData.useOfFunds || []);
  const [milestones, setMilestones] = useState(formData.milestones || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const fundingModels = [
    { id: 'all_or_nothing', name: 'All or Nothing', description: 'Only receive funds if goal is met' },
    { id: 'keep_it_all', name: 'Keep It All', description: 'Receive all funds regardless of goal' },
    { id: 'flexible', name: 'Flexible Funding', description: 'Custom funding terms and conditions' }
  ];

  const addUseOfFunds = () => {
    const newItem = {
      id: Date.now(),
      category: '',
      amount: '',
      description: ''
    };
    const updatedItems = [...useOfFunds, newItem];
    setUseOfFunds(updatedItems);
    updateFormData({ useOfFunds: updatedItems });
  };

  const updateUseOfFunds = (id, field, value) => {
    const updatedItems = useOfFunds.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setUseOfFunds(updatedItems);
    updateFormData({ useOfFunds: updatedItems });
  };

  const removeUseOfFunds = (id) => {
    const updatedItems = useOfFunds.filter(item => item.id !== id);
    setUseOfFunds(updatedItems);
    updateFormData({ useOfFunds: updatedItems });
  };

  const addMilestone = () => {
    const newMilestone = {
      id: Date.now(),
      title: '',
      description: '',
      expectedDate: ''
    };
    const updatedMilestones = [...milestones, newMilestone];
    setMilestones(updatedMilestones);
    updateFormData({ milestones: updatedMilestones });
  };

  const updateMilestone = (id, field, value) => {
    const updatedMilestones = milestones.map(milestone =>
      milestone.id === id ? { ...milestone, [field]: value } : milestone
    );
    setMilestones(updatedMilestones);
    updateFormData({ milestones: updatedMilestones });
  };

  const removeMilestone = (id) => {
    const updatedMilestones = milestones.filter(milestone => milestone.id !== id);
    setMilestones(updatedMilestones);
    updateFormData({ milestones: updatedMilestones });
  };

  const getTotalUseOfFunds = () => {
    return useOfFunds.reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);
  };

  const fundingGoals = [
    { value: 'donation', label: 'Donation', icon: <HandCoins className="w-4 h-4" />, description: 'Supporters contribute without expecting returns' },
    { value: 'reward', label: 'Reward-Based', icon: <Target className="w-4 h-4" />, description: 'Backers receive rewards for their support' },
    { value: 'equity', label: 'Equity', icon: <Building className="w-4 h-4" />, description: 'Investors receive equity in your project' },
    { value: 'loan', label: 'Loan', icon: <PiggyBank className="w-4 h-4" />, description: 'Borrowed funds that will be repaid with interest' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fundingGoal || formData.fundingGoal <= 0) {
      newErrors.fundingGoal = 'Please enter a valid funding goal';
    }
    
    if (!formData.minimumContribution || formData.minimumContribution <= 0) {
      newErrors.minimumContribution = 'Please enter a valid minimum contribution';
    }
    
    if (!formData.fundingModel) {
      newErrors.fundingModel = 'Please select a funding model';
    }
    
    if (useOfFunds.length === 0) {
      newErrors.useOfFunds = 'Please add at least one use of funds';
    }
    
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update form data
      updateFormData({
        useOfFunds,
        milestones,
        fundingGoal: formData.fundingGoal,
        minimumContribution: formData.minimumContribution,
        fundingModel: formData.fundingModel
      });
      
      onNext();
    } catch (err) {
      setError('Failed to save funding details. Please try again.');
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Navigation */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              4
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Funding Details</h2>
              <p className="text-sm text-gray-600">Set your funding goals and timeline</p>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Funding Details</h3>
            <p className="text-gray-600">
              Set your funding goals and explain how you'll use the funds. Be transparent and specific to build trust with funders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Basic Details */}
            <div className="space-y-6">
              {/* Funding Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Funding Goal <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.fundingGoal || ''}
                    onChange={(e) => updateFormData({ fundingGoal: parseFloat(e.target.value) || '' })}
                    className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.fundingGoal ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10000"
                  />
                  <select
                    value={formData.fundingCurrency || 'USD'}
                    onChange={(e) => updateFormData({ fundingCurrency: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
                {errors.fundingGoal && (
                  <p className="text-red-500 text-sm mt-1">{errors.fundingGoal}</p>
                )}
              </div>

              {/* Minimum Contribution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Minimum Contribution <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.minimumContribution || ''}
                  onChange={(e) => updateFormData({ minimumContribution: parseFloat(e.target.value) || '' })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.minimumContribution ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="10"
                />
                {errors.minimumContribution && (
                  <p className="text-red-500 text-sm mt-1">{errors.minimumContribution}</p>
                )}
              </div>

              {/* Funding Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Funding Model <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {fundingModels.map((model) => (
                    <label
                      key={model.id}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="fundingModel"
                        value={model.id}
                        checked={formData.fundingModel === model.id}
                        onChange={(e) => updateFormData({ fundingModel: e.target.value })}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{model.name}</div>
                        <div className="text-sm text-gray-600">{model.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.fundingModel && (
                  <p className="text-red-500 text-sm mt-1">{errors.fundingModel}</p>
                )}
              </div>
            </div>

            {/* Right Column - Use of Funds */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Use of Funds <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={addUseOfFunds}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add Item
                  </button>
                </div>
                
                {errors.useOfFunds && (
                  <p className="text-red-500 text-sm mb-2">{errors.useOfFunds}</p>
                )}

                <div className="space-y-3">
                  {useOfFunds.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updateUseOfFunds(item.id, 'category', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Category (e.g., Marketing)"
                        />
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateUseOfFunds(item.id, 'amount', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Amount"
                        />
                      </div>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateUseOfFunds(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Description of how funds will be used"
                        rows={2}
                      />
                      <button
                        onClick={() => removeUseOfFunds(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Use of Funds:</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${getTotalUseOfFunds().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Milestones Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                <Calendar className="w-5 h-5 inline mr-2" />
                Project Milestones
              </h4>
              <button
                onClick={addMilestone}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Add Milestone
              </button>
            </div>

            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Milestone title"
                    />
                    <input
                      type="date"
                      value={milestone.expectedDate}
                      onChange={(e) => updateMilestone(milestone.id, 'expectedDate', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      <X className="w-4 h-4 inline mr-1" />
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={milestone.description}
                    onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Milestone description"
                    rows={2}
                  />
                </div>
              ))}
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

export default FundingDetails;
