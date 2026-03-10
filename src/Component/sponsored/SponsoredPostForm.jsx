import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Crown, Sparkles } from 'lucide-react';

// Import all step components
import SponsoredTypeSelector from './SponsoredTypeSelector';
import SponsoredBasicInfo from './SponsoredBasicInfo';
import SponsoredDescription from './SponsoredDescription';
import SponsoredSellerInfo from './SponsoredSellerInfo';
import SponsoredLocationMap from './SponsoredLocationMap';
import SponsoredPromotionTier from './SponsoredPromotionTier';
import SponsoredSummary from './SponsoredSummary';

const SponsoredPostForm = () => {
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    advertType: null,
    basicInfo: {},
    description: {},
    sellerInfo: {},
    location: {},
    sponsoredTier: null
  });

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Steps configuration
  const steps = [
    { id: 1, name: 'Advert Type', icon: '📋', component: 'type' },
    { id: 2, name: 'Basic Info', icon: '📝', component: 'basic' },
    { id: 3, name: 'Description', icon: '📄', component: 'description' },
    { id: 4, name: 'Seller Info', icon: '👤', component: 'seller' },
    { id: 5, name: 'Location', icon: '📍', component: 'location' },
    { id: 6, name: 'Promotion', icon: '👑', component: 'promotion' },
    { id: 7, name: 'Review', icon: '✅', component: 'review' }
  ];

  // Update form data
  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (stepId) => {
    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validation functions
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.advertType !== null;
      case 2:
        return (
          formData.basicInfo?.title &&
          formData.basicInfo?.tagline &&
          formData.basicInfo?.category &&
          formData.basicInfo?.country &&
          formData.basicInfo?.city &&
          formData.basicInfo?.condition &&
          formData.basicInfo?.images &&
          formData.basicInfo.images.length > 0
        );
      case 3:
        return true; // Description is optional but recommended
      case 4:
        return (
          formData.sellerInfo?.name &&
          formData.sellerInfo?.phone &&
          formData.sellerInfo?.email
        );
      case 5:
        return true; // Location is optional but recommended
      case 6:
        return formData.sponsoredTier !== null;
      case 7:
        return true; // Review step - always valid
      default:
        return false;
    }
  };

  // Form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Prepare submission payload
      const submissionPayload = {
        advertType: formData.advertType,
        basicInfo: formData.basicInfo,
        description: formData.description,
        sellerInfo: formData.sellerInfo,
        location: formData.location,
        sponsoredTier: formData.sponsoredTier,
        submittedAt: new Date().toISOString()
      };

      console.log('Sponsored Advert Submission:', submissionPayload);

      // Simulate successful submission
      setSubmissionSuccess(true);
      
      // In a real app, you would redirect to payment or success page
      setTimeout(() => {
        // Redirect to payment flow
        console.log('Redirecting to payment...');
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError('Failed to submit advert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render current step component
  const renderCurrentStep = () => {
    const commonProps = {
      advertType: formData.advertType,
      basicInfo: formData.basicInfo,
      description: formData.description,
      sellerInfo: formData.sellerInfo,
      location: formData.location,
      sponsoredTier: formData.sponsoredTier
    };

    switch (steps[currentStep - 1].component) {
      case 'type':
        return (
          <SponsoredTypeSelector
            advertType={formData.advertType}
            setAdvertType={(type) => updateFormData('advertType', type)}
          />
        );
      case 'basic':
        return (
          <SponsoredBasicInfo
            advertType={formData.advertType}
            basicInfo={formData.basicInfo}
            setBasicInfo={(info) => updateFormData('basicInfo', info)}
          />
        );
      case 'description':
        return (
          <SponsoredDescription
            description={formData.description}
            setDescription={(desc) => updateFormData('description', desc)}
          />
        );
      case 'seller':
        return (
          <SponsoredSellerInfo
            sellerInfo={formData.sellerInfo}
            setSellerInfo={(info) => updateFormData('sellerInfo', info)}
          />
        );
      case 'location':
        return (
          <SponsoredLocationMap
            location={formData.location}
            setLocation={(loc) => updateFormData('location', loc)}
          />
        );
      case 'promotion':
        return (
          <SponsoredPromotionTier
            sponsoredTier={formData.sponsoredTier}
            setSponsoredTier={(tier) => updateFormData('sponsoredTier', tier)}
          />
        );
      case 'review':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Final Review</h2>
                
                <div className="space-y-6">
                  {/* Terms and Conditions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input type="checkbox" className="mt-1" />
                        <span className="text-sm text-gray-700">
                          I confirm this advert is accurate and complies with all platform guidelines
                        </span>
                      </label>
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input type="checkbox" className="mt-1" />
                        <span className="text-sm text-gray-700">
                          I agree to the terms and conditions and understand the monthly billing
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Submission Error */}
                  {submissionError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800">Submission Error</p>
                          <p className="text-sm text-red-700">{submissionError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {submissionSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-lg font-bold text-green-800">Advert Submitted Successfully!</p>
                          <p className="text-sm text-green-700">Redirecting to payment...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <SponsoredSummary
                {...commonProps}
                onProceedToPayment={handleSubmit}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isStepValid = validateCurrentStep();
  const isLastStep = currentStep === steps.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sponsored Advert Posting</h1>
                <p className="text-sm text-gray-600">Create premium adverts with maximum visibility</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">VIP Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 overflow-x-auto">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                    ${currentStep === step.id
                      ? 'bg-blue-500 text-white'
                      : currentStep > step.id
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  <span className="text-lg">{step.icon}</span>
                  <span className="text-sm font-medium hidden sm:inline">{step.name}</span>
                  {currentStep > step.id && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-sm text-gray-600 hidden lg:block">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-3">
            {renderCurrentStep()}
            
            {/* Navigation Buttons */}
            {currentStep !== 7 && (
              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
                    ${currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={!isStepValid}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
                    ${isStepValid
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <span>{isLastStep ? 'Submit' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          {currentStep !== 7 && (
            <div className="lg:col-span-1">
              <SponsoredSummary
                advertType={formData.advertType}
                basicInfo={formData.basicInfo}
                description={formData.description}
                sellerInfo={formData.sellerInfo}
                location={formData.location}
                sponsoredTier={formData.sponsoredTier}
                onProceedToPayment={handleSubmit}
              />
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <div>
                <p className="font-medium text-gray-900">Submitting Your Advert</p>
                <p className="text-sm text-gray-600">Please wait a moment...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsoredPostForm;
