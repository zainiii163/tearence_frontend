import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import affiliateService from '../../services/AffiliateService';
import toast from 'react-hot-toast';
import { 
  X, 
  Briefcase, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  DollarSign,
  Target,
  Globe,
  Shield,
  Star,
  Crown,
  Zap,
  Check,
  ArrowRight,
  Eye,
  Heart,
  Share2,
  Flag,
  MapPin,
  Calendar,
  BarChart3,
  Mail,
  Phone,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { affiliatesAPI } from '../../api';
import AffiliateModeSelector from './forms/AffiliateModeSelector';
import BusinessAffiliateForm from './forms/BusinessAffiliateForm';
import PromoterAffiliateForm from './forms/PromoterAffiliateForm';
import AffiliatePromotionOptions from './forms/AffiliatePromotionOptions';
import AffiliateSubmitSection from './forms/AffiliateSubmitSection';

const AffiliatePostForm = ({ onClose, categories, upsellPlans, onSubmissionSuccess, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState(null); // 'business' or 'promoter'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    mode: 'business', // 'business' or 'promoter'
    
    // Business form fields
    businessName: '',
    productTitle: '',
    tagline: '',
    affiliateCategoryId: '',
    country: '',
    region: '',
    description: '',
    commissionType: 'percentage',
    commissionRate: '',
    cookieDuration: '',
    allowedTrafficTypes: [],
    restrictions: '',
    trackingLink: '',
    promotionalAssets: [],
    businessEmail: '',
    website: '',
    verificationDocument: null,
    
    // Promoter form fields
    title: '',
    description: '',
    affiliateCategoryId: '',
    country: '',
    region: '',
    affiliateLink: '',
    image: null,
    hashtags: [],
    targetAudience: '',
    
    // Common fields
    promotionTier: 'basic',
    agreeTerms: false,
    confirmAccuracy: false
  });

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setFormData(prev => ({ ...prev, mode: selectedMode }));
    setCurrentStep(2);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare data based on mode
      if (mode === 'business') {
        const businessData = {
          business_name: formData.businessName,
          product_service_title: formData.productTitle,
          tagline: formData.tagline,
          affiliate_category_id: parseInt(formData.affiliateCategoryId),
          country: formData.country,
          region: formData.region,
          description: formData.description,
          commission_type: formData.commissionType,
          commission_rate: parseFloat(formData.commissionRate),
          cookie_duration: parseInt(formData.cookieDuration),
          allowed_traffic_types: formData.allowedTrafficTypes,
          restrictions: formData.restrictions,
          tracking_link: formData.trackingLink,
          promotional_assets: formData.promotionalAssets || [],
          business_email: formData.businessEmail,
          website_url: formData.website,
          verification_document: formData.verificationDocument
        };

        await affiliateService.createBusinessOffer(businessData);
        const newOffer = { success: true, type: 'business', data: businessData };
        toast.success('Business offer created successfully!');
        return newOffer;
      } else {
        const promoterData = {
          title: formData.title || formData.postTitle,
          description: formData.description || formData.shortDescription,
          affiliate_category_id: parseInt(formData.promoterCategory),
          country: formData.country || formData.promoterCountry,
          region: formData.region || formData.promoterRegion,
          affiliate_link: formData.affiliateLink,
          image: formData.image,
          hashtags: formData.hashtags || [],
          target_audience: formData.targetAudience
        };

        await affiliateService.createUserPost(promoterData);
        const newPost = { success: true, type: 'user', data: promoterData };
        toast.success('Affiliate post created successfully!');
        return newPost;
      }

      // Handle promotion upgrade if selected
      if (formData.promotionTier !== 'basic' && upsellPlans) {
        const selectedPlan = upsellPlans.find(plan => plan.slug === formData.promotionTier);
        if (selectedPlan) {
          // Here you would typically redirect to payment
          console.log('Redirecting to payment for plan:', selectedPlan);
          toast.success(`Selected ${selectedPlan.name} plan! Redirecting to payment...`);
        }
      }

      // Success - call onSubmit callback if provided
      if (onSubmit) {
        onSubmit();
      } else {
        // Call the success callback to refresh parent data
        if (onSubmissionSuccess) {
          // Get the result from the successful submission
          const result = mode === 'business' 
            ? { success: true, type: 'business', data: formData }
            : { success: true, type: 'user', data: formData };
          onSubmissionSuccess(result);
        }
        onClose();
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to submit affiliate listing');
      toast.error(err.message || 'Failed to submit affiliate listing');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AffiliateModeSelector 
            onSelect={handleModeSelect}
            selectedMode={mode}
          />
        );
      case 2:
        return mode === 'business' ? (
          <BusinessAffiliateForm 
            formData={formData}
            updateFormData={updateFormData}
            categories={categories}
          />
        ) : (
          <PromoterAffiliateForm 
            formData={formData}
            updateFormData={updateFormData}
            categories={categories}
          />
        );
      case 3:
        return (
          <AffiliatePromotionOptions 
            formData={formData}
            updateFormData={updateFormData}
            mode={mode}
            upsellPlans={upsellPlans}
          />
        );
      case 4:
        return (
          <AffiliateSubmitSection 
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            mode={mode}
            loading={loading}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Choose Your Path';
      case 2:
        return mode === 'business' ? 'Business Information' : 'Promoter Information';
      case 3:
        return 'Promotion Options';
      case 4:
        return 'Review & Submit';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return 'Are you a business looking for promoters or a promoter looking to share affiliate links?';
      case 2:
        return mode === 'business' 
          ? 'Tell us about your business and the affiliate program you want to create.'
          : 'Share your affiliate link and details about what you\'re promoting.';
      case 3:
        return 'Choose how you want to promote your listing for maximum visibility.';
      case 4:
        return 'Review your information and submit your affiliate post.';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Post Affiliate Listing</h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  className="bg-white h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Step Info */}
            <div>
              <h3 className="text-xl font-semibold mb-1">{getStepTitle()}</h3>
              <p className="text-white/80">{getStepDescription()}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="border-t p-6 bg-gray-50 shrink-0">
            <div className="flex items-center justify-between">
              <button
                onClick={currentStep === 1 ? onClose : handlePrevious}
                className="flex items-center space-x-2 px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {currentStep === 1 ? (
                  <>
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </>
                )}
              </button>

              <div className="flex items-center space-x-2">
                {/* Step Indicators */}
                <div className="flex items-center space-x-2 mr-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {currentStep === totalSteps ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !formData.agreeTerms || !formData.confirmAccuracy}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Listing</span>
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={currentStep === 1 && !mode}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AffiliatePostForm;
