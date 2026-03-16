import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check,
  AlertCircle,
  FileText,
  Shield,
  DollarSign,
  Send,
  ArrowRight,
  X,
  CheckCircle,
  Info,
  Clock,
  User,
  MapPin,
  Calendar,
  Star
} from 'lucide-react';
import fundingService from '../../../services/FundingService';

const FinalSubmission = ({ formData, updateFormData, onNext, onPrev }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [promotionTiers, setPromotionTiers] = useState([]);

  // Load promotion tiers from API
  useEffect(() => {
    const loadPromotionTiers = async () => {
      try {
        const response = await fundingService.upsells.getPlans();
        if (response.data && response.data.length > 0) {
          setPromotionTiers(response.data);
        }
      } catch (err) {
        console.error('Error loading promotion tiers:', err);
      }
    };
    loadPromotionTiers();
  }, []);

  const getPromotionTierInfo = () => {
    // Use real API data if available, otherwise fallback to basic info
    if (promotionTiers.length > 0) {
      return promotionTiers.find(tier => tier.id === formData.promotionTier) || promotionTiers[0];
    }
    
    // Fallback to basic info
    const tiers = {
      basic: { name: 'Basic Listing', price: 0, features: ['Standard visibility', 'Basic project page'] },
      promoted: { name: 'Promoted Project', price: 29, features: ['Enhanced visibility', '2× exposure', 'Priority placement'] },
      featured: { name: 'Featured Project', price: 49, features: ['Top placement', '3× exposure', 'Featured badge'] },
      sponsored: { name: 'Sponsored Project', price: 99, features: ['Homepage placement', '5× exposure', 'Sponsored badge'] }
    };
    return tiers[formData.promotionTier] || tiers.basic;
  };

  const promotionTier = getPromotionTierInfo();
  const totalCost = promotionTier.price;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    if (!formData.confirmAccuracy) {
      newErrors.confirmAccuracy = 'You must confirm the accuracy of your information';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Submit project via API
      const projectData = {
        ...formData,
        promotionTier: formData.promotionTier || 'basic',
        totalCost,
        submittedAt: new Date().toISOString()
      };
      
      const response = await fundingService.createProject(projectData);
      
      if (response.success) {
        setSubmitSuccess(true);
        
        // If promotion was purchased, handle payment
        if (totalCost > 0) {
          // In a real app, this would redirect to payment
          console.log('Redirecting to payment for:', totalCost);
        }
        
        setTimeout(() => {
          onNext(response.projectId);
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to submit project');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit project. Please try again.');
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
              9
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Final Submission</h2>
              <p className="text-sm text-gray-600">Review and submit your project</p>
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

        {/* Success Message */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-800 mb-1">Project Submitted Successfully!</h3>
                  <p className="text-green-600">
                    Your project "{formData.title}" has been submitted for review. You'll receive a confirmation email shortly.
                  </p>
                  {totalCost > 0 && (
                    <p className="text-green-600 text-sm mt-2">
                      Redirecting to payment for your promotion package...
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Review Your Project</h3>
            <p className="text-gray-600">
              Please review all your project details before submitting. Make sure everything is accurate and complete.
            </p>
          </div>

          {/* Project Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Project Summary
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Basic Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-sm text-gray-500 w-20">Title:</span>
                      <span className="text-sm text-gray-900 font-medium">{formData.title || 'Not provided'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm text-gray-500 w-20">Tagline:</span>
                      <span className="text-sm text-gray-900">{formData.tagline || 'Not provided'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm text-gray-500 w-20">Category:</span>
                      <span className="text-sm text-gray-900">{formData.category || 'Not selected'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm text-gray-500 w-20">Location:</span>
                      <span className="text-sm text-gray-900">{formData.country || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Funding Details */}
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Funding Details</h5>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-sm text-gray-500 w-20">Goal:</span>
                      <span className="text-sm text-gray-900 font-medium">
                        ${formData.fundingGoal ? formData.fundingGoal.toLocaleString() : 'Not set'}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm text-gray-500 w-20">Min.:</span>
                      <span className="text-sm text-gray-900">
                        ${formData.minimumContribution || 'Not set'}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-sm text-gray-500 w-20">Model:</span>
                      <span className="text-sm text-gray-900">
                        {formData.fundingModel ? formData.fundingModel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not selected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promotion Details */}
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Promotion Package</h5>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <h6 className="font-semibold text-gray-900">{promotionTier.name}</h6>
                        <p className="text-sm text-gray-600 mt-1">{promotionTier.features.join(' • ')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ${totalCost}
                        </div>
                        <div className="text-xs text-gray-500">one-time</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Project Timeline</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Submitted: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Expected review: 3-5 business days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="border-t pt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Terms and Conditions</h4>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Terms Agreement */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms || false}
                    onChange={(e) => updateFormData({ agreeTerms: e.target.checked })}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      I agree to the Terms of Service and Community Guidelines
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      By submitting this project, you agree to our terms of service, community guidelines, and privacy policy.
                    </p>
                    {errors.agreeTerms && (
                      <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>
                    )}
                  </div>
                </label>
              </div>

              {/* Accuracy Confirmation */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.confirmAccuracy || false}
                    onChange={(e) => updateFormData({ confirmAccuracy: e.target.checked })}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">
                      I confirm that all information provided is accurate
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      You certify that all project details, funding goals, and supporting information are truthful and complete.
                    </p>
                    {errors.confirmAccuracy && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmAccuracy}</p>
                    )}
                  </div>
                </label>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h5 className="font-medium text-blue-900 mb-2">Important Information</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Your project will be reviewed within 3-5 business days</li>
                      <li>• You'll receive email notifications about your project status</li>
                      <li>• You can edit your project details after submission</li>
                      <li>• Promotion features will be activated upon approval</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading || submitSuccess}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </span>
                  ) : submitSuccess ? (
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submitted
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="w-4 h-4 mr-2" />
                      Submit Project
                      {totalCost > 0 && (
                        <span className="ml-2 text-sm">(${totalCost})</span>
                      )}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalSubmission;
