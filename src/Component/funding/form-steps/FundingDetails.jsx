import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  X, 
  DollarSign,
  Calendar,
  Target,
  TrendingUp,
  PiggyBank,
  HandCoins,
  Building
} from 'lucide-react';

const FundingDetails = ({ formData, updateFormData, onNext, onPrev }) => {
  const [useOfFunds, setUseOfFunds] = useState(formData.useOfFunds || []);
  const [milestones, setMilestones] = useState(formData.milestones || []);

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

  const fundingModels = [
    { value: 'donation', label: 'Donation', icon: <HandCoins className="w-4 h-4" />, description: 'Supporters contribute without expecting returns' },
    { value: 'reward', label: 'Reward-Based', icon: <Target className="w-4 h-4" />, description: 'Backers receive rewards for their support' },
    { value: 'equity', label: 'Equity', icon: <Building className="w-4 h-4" />, description: 'Investors receive equity in your project' },
    { value: 'loan', label: 'Loan', icon: <PiggyBank className="w-4 h-4" />, description: 'Borrowed funds that will be repaid with interest' }
  ];

  const isFormValid = formData.fundingGoal && formData.minimumContribution && formData.fundingModel;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Funding Details</h3>
        <p className="text-gray-600">
          Set your funding goals and explain how you'll use the funds. Be transparent and specific to build trust with funders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Funding Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Funding Goal <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <select
              value={formData.currency || 'USD'}
              onChange={(e) => updateFormData({ currency: e.target.value })}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <input
              type="number"
              value={formData.fundingGoal || ''}
              onChange={(e) => updateFormData({ fundingGoal: e.target.value })}
              placeholder="0.00"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>
        </div>

        {/* Minimum Contribution */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Contribution Amount <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <select
              value={formData.currency || 'USD'}
              onChange={(e) => updateFormData({ currency: e.target.value })}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            <input
              type="number"
              value={formData.minimumContribution || ''}
              onChange={(e) => updateFormData({ minimumContribution: e.target.value })}
              placeholder="0.00"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Funding Model */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Funding Model <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fundingModels.map((model) => (
            <label
              key={model.value}
              className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                formData.fundingModel === model.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="fundingModel"
                value={model.value}
                checked={formData.fundingModel === model.value}
                onChange={(e) => updateFormData({ fundingModel: e.target.value })}
                className="sr-only"
              />
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                  {model.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{model.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                </div>
              </div>
              {formData.fundingModel === model.value && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Use of Funds Breakdown */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Use of Funds Breakdown
          </label>
          <button
            onClick={addUseOfFunds}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {useOfFunds.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No fund allocations added yet</p>
            <p className="text-sm text-gray-500">Show funders exactly how you'll use their money</p>
          </div>
        ) : (
          <div className="space-y-4">
            {useOfFunds.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <input
                      type="text"
                      value={item.category || ''}
                      onChange={(e) => updateUseOfFunds(item.id, 'category', e.target.value)}
                      placeholder="Category (e.g., Marketing)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={item.amount || ''}
                      onChange={(e) => updateUseOfFunds(item.id, 'amount', e.target.value)}
                      placeholder="Amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => updateUseOfFunds(item.id, 'description', e.target.value)}
                      placeholder="Description of what this covers"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeUseOfFunds(item.id)}
                  className="mt-3 text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
            
            {/* Total */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Allocated:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formData.currency || 'USD'} {getTotalUseOfFunds().toLocaleString()}
                </span>
              </div>
              {getTotalUseOfFunds() !== parseFloat(formData.fundingGoal || 0) && (
                <p className="text-sm text-amber-600 mt-2">
                  Note: Total allocated should match your funding goal
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Timeline/Milestones */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 inline mr-1" />
            Timeline / Milestones
          </label>
          <button
            onClick={addMilestone}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Milestone
          </button>
        </div>

        {milestones.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No milestones added yet</p>
            <p className="text-sm text-gray-500">Set key milestones to show your project roadmap</p>
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="border border-gray-200 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      value={milestone.title || ''}
                      onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                      placeholder="Milestone title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      value={milestone.expectedDate || ''}
                      onChange={(e) => updateMilestone(milestone.id, 'expectedDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={milestone.description || ''}
                      onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                      placeholder="What will be achieved"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeMilestone(milestone.id)}
                  className="mt-3 text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
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
          disabled={!isFormValid}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FundingDetails;
