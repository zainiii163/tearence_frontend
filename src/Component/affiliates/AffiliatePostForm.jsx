import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ExternalLink
} from 'lucide-react';
import AffiliateModeSelector from './forms/AffiliateModeSelector';
import BusinessAffiliateForm from './forms/BusinessAffiliateForm';
import PromoterAffiliateForm from './forms/PromoterAffiliateForm';
import AffiliatePromotionOptions from './forms/AffiliatePromotionOptions';
import AffiliateSubmitSection from './forms/AffiliateSubmitSection';

const AffiliatePostForm = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState(null); // 'business' or 'promoter'
  const [formData, setFormData] = useState({
    // Business form fields
    businessName: '',
    productTitle: '',
    tagline: '',
    category: '',
    country: '',
    description: '',
    commissionRate: '',
    cookieDuration: '',
    allowedTraffic: [],
    restrictions: '',
    trackingLink: '',
    assets: [],
    businessEmail: '',
    website: '',
    verificationFile: null,
    
    // Promoter form fields
    postTitle: '',
    shortDescription: '',
    promoterCategory: '',
    image: null,
    affiliateLink: '',
    hashtags: [],
    targetAudience: '',
    promoterCountry: '',
    
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
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setCurrentStep(2);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    onClose();
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          />
        ) : (
          <PromoterAffiliateForm 
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <AffiliatePromotionOptions 
            formData={formData}
            updateFormData={updateFormData}
            mode={mode}
          />
        );
      case 4:
        return (
          <AffiliateSubmitSection 
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            mode={mode}
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
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
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
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
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
          <div className="border-t p-6 bg-gray-50">
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

                {currentStep < totalSteps && (
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
