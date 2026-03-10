import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check,
  AlertCircle,
  FileText,
  Shield,
  DollarSign,
  Send,
  ArrowRight
} from 'lucide-react';

const FinalSubmission = ({ formData, updateFormData, onSubmit, onPrev }) => {
  const getPromotionTierInfo = () => {
    const tiers = {
      basic: { name: 'Basic Listing', price: 0 },
      promoted: { name: 'Promoted Project', price: 29 },
      featured: { name: 'Featured Project', price: 49 },
      sponsored: { name: 'Sponsored Project', price: 99 }
    };
    return tiers[formData.promotionTier] || tiers.basic;
  };

  const promotionTier = getPromotionTierInfo();
  const totalCost = promotionTier.price;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.agreeTerms && formData.confirmAccuracy) {
      onSubmit();
    }
  };

  const isFormValid = formData.agreeTerms && formData.confirmAccuracy;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Final Submission</h3>
        <p className="text-gray-600">
          Review your project details and agree to the terms to submit your project for funding.
        </p>
      </div>

      {/* Project Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Basic Information</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Project Type:</span>
                <span className="font-medium text-gray-900 capitalize">{formData.projectType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-medium text-gray-900">{formData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-900">{formData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Country:</span>
                <span className="font-medium text-gray-900">{formData.country}</span>
              </div>
            </div>
          </div>

          {/* Funding Details */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Funding Details</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Funding Goal:</span>
                <span className="font-medium text-gray-900">
                  {formData.currency || 'USD'} {formData.fundingGoal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum Contribution:</span>
                <span className="font-medium text-gray-900">
                  {formData.currency || 'USD'} {formData.minimumContribution}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Funding Model:</span>
                <span className="font-medium text-gray-900 capitalize">{formData.fundingModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Team Members:</span>
                <span className="font-medium text-gray-900">{formData.teamMembers?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Promotion Tier */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-700">Promotion Tier</h5>
              <p className="text-sm text-gray-600">{promotionTier.name}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {totalCost === 0 ? 'Free' : `${formData.currency || 'USD'} ${totalCost}`}
              </div>
              {totalCost > 0 && (
                <p className="text-sm text-gray-600">One-time fee</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">What Happens Next?</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h5 className="font-medium text-blue-900 mb-1">Review</h5>
            <p className="text-sm text-blue-700">Our team reviews your project within 24 hours</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h5 className="font-medium text-blue-900 mb-1">Verification</h5>
            <p className="text-sm text-blue-700">Identity and project verification process</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <h5 className="font-medium text-blue-900 mb-1">Launch</h5>
            <p className="text-sm text-blue-700">Your project goes live and starts receiving funding</p>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h4>
          
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeTerms || false}
                onChange={(e) => updateFormData({ agreeTerms: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <div className="flex-1">
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                    Funding Guidelines
                  </a>
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.confirmAccuracy || false}
                onChange={(e) => updateFormData({ confirmAccuracy: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <div className="flex-1">
                <span className="text-sm text-gray-700">
                  I confirm that all information provided is accurate and truthful
                </span>
              </div>
            </label>
          </div>

          {/* Important Notes */}
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="space-y-1">
                  <li>• False or misleading information may result in project removal</li>
                  <li>• You must comply with all applicable laws and regulations</li>
                  <li>• Promotion fees are non-refundable after project approval</li>
                  <li>• We reserve the right to reject any project that violates our policies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information (if applicable) */}
        {totalCost > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h4>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">
                Payment of {formData.currency || 'USD'} {totalCost} will be processed after project approval
              </p>
              <p className="text-sm text-gray-500">
                You'll be redirected to secure payment gateway
              </p>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Previous
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
            Submit Project
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default FinalSubmission;
