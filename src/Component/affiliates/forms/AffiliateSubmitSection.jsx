import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, CreditCard, Shield, ArrowRight } from 'lucide-react';

const AffiliateSubmitSection = ({ formData, updateFormData, onSubmit, mode }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTier = formData.promotionTier;
  const tierPricing = {
    basic: { price: 0, name: 'Basic Listing' },
    promoted: { price: 29, name: 'Promoted Post' },
    featured: { price: 49, name: 'Featured Post' },
    sponsored: { price: 99, name: 'Sponsored Post' }
  };

  const currentTier = tierPricing[selectedTier] || tierPricing.basic;
  const totalPrice = currentTier.price;

  const handleSubmit = async () => {
    if (!formData.agreeTerms || !formData.confirmAccuracy) {
      alert('Please accept the terms and confirm accuracy before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSummaryData = () => {
    if (mode === 'business') {
      return {
        title: formData.productTitle,
        type: 'Business Affiliate Program',
        category: formData.category,
        commission: formData.commissionRate,
        email: formData.businessEmail,
        website: formData.website
      };
    } else {
      return {
        title: formData.postTitle,
        type: 'Promoter Affiliate Link',
        category: formData.promoterCategory,
        hashtags: formData.hashtags,
        link: formData.affiliateLink,
        audience: formData.targetAudience
      };
    }
  };

  const summaryData = getSummaryData();

  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Listing</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 mb-3">Basic Information</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Title</span>
                <span className="text-sm font-medium text-gray-900">{summaryData.title}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Type</span>
                <span className="text-sm font-medium text-gray-900">{summaryData.type}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Category</span>
                <span className="text-sm font-medium text-gray-900">{summaryData.category}</span>
              </div>
              
              {mode === 'business' && (
                <>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Commission Rate</span>
                    <span className="text-sm font-medium text-gray-900">{summaryData.commission}%</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">Business Email</span>
                    <span className="text-sm font-medium text-gray-900">{summaryData.email}</span>
                  </div>
                  
                  {summaryData.website && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Website</span>
                      <span className="text-sm font-medium text-gray-900 truncate ml-2">{summaryData.website}</span>
                    </div>
                  )}
                </>
              )}
              
              {mode === 'promoter' && (
                <>
                  {summaryData.hashtags.length > 0 && (
                    <div className="py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600 block mb-1">Hashtags</span>
                      <div className="flex flex-wrap gap-1">
                        {summaryData.hashtags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {summaryData.link && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Affiliate Link</span>
                      <span className="text-sm font-medium text-gray-900 truncate ml-2">{summaryData.link}</span>
                    </div>
                  )}
                  
                  {summaryData.audience && (
                    <div className="py-2 border-b border-gray-200">
                      <span className="text-sm text-gray-600 block mb-1">Target Audience</span>
                      <span className="text-sm text-gray-900">{summaryData.audience}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Promotion Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700 mb-3">Promotion Details</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Promotion Tier</span>
                <span className="text-sm font-medium text-gray-900">{currentTier.name}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Price</span>
                <span className="text-sm font-medium text-gray-900">
                  ${totalPrice}
                  {totalPrice > 0 && <span className="text-gray-500">/month</span>}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Visibility</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedTier === 'basic' ? 'Standard' : 
                   selectedTier === 'promoted' ? 'Enhanced' :
                   selectedTier === 'featured' ? 'Premium' : 'Maximum'}
                </span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Active Period</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedTier === 'basic' ? '30 days' : 
                   selectedTier === 'promoted' ? '60 days' :
                   selectedTier === 'featured' ? '90 days' : '120 days'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Pricing Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Base Listing</span>
            <span className="font-medium">$0</span>
          </div>
          
          {totalPrice > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-white/80">Promotion Upgrade</span>
              <span className="font-medium">${totalPrice}/month</span>
            </div>
          )}
          
          <div className="border-t border-white/20 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Total</span>
              <span className="text-2xl font-bold">${totalPrice}
                {totalPrice > 0 && <span className="text-lg font-normal">/month</span>}
              </span>
            </div>
          </div>
        </div>
        
        {totalPrice > 0 && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm">Secure payment processing</span>
            </div>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">Terms & Conditions</h3>
            
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.confirmAccuracy}
                  onChange={(e) => updateFormData('confirmAccuracy', e.target.checked)}
                  className="mt-1 rounded text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm text-yellow-800">
                  I confirm that all information provided is accurate and complete
                </span>
              </label>
              
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => updateFormData('agreeTerms', e.target.checked)}
                  className="mt-1 rounded text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm text-yellow-800">
                  I agree to the WorldwideAdverts Terms of Service and Affiliate Program Guidelines
                </span>
              </label>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-yellow-700">
                <Shield className="h-4 w-4" />
                <span>Your information is protected and will only be used for affiliate program purposes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSubmit}
          disabled={!formData.agreeTerms || !formData.confirmAccuracy || isSubmitting}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>{totalPrice > 0 ? 'Proceed to Payment' : 'Submit Listing'}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
        
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Edit
        </button>
      </div>

      {/* Important Notes */}
      <div className="text-center text-sm text-gray-500">
        <p>By submitting, you agree to our affiliate program terms and community guidelines.</p>
        <p className="mt-1">Your listing will be reviewed and typically approved within 24 hours.</p>
      </div>
    </div>
  );
};

export default AffiliateSubmitSection;
