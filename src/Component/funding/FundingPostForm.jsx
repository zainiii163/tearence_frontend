import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  Plus, 
  Minus,
  Check,
  Star,
  Shield,
  Zap,
  Crown,
  Gem,
  DollarSign,
  Calendar,
  Globe,
  Users,
  Target,
  FileText,
  Video,
  Link,
  Heart,
  TrendingUp
} from 'lucide-react';

// Import form step components
import ProjectTypeSelector from './form-steps/ProjectTypeSelector';
import BasicProjectInformation from './form-steps/BasicProjectInformation';
import ProjectStoryVision from './form-steps/ProjectStoryVision';
import FundingDetails from './form-steps/FundingDetails';
import RewardsSection from './form-steps/RewardsSection';
import VerificationTrust from './form-steps/VerificationTrust';
import PromotionMarketingAssets from './form-steps/PromotionMarketingAssets';
import PremiumUpsaleOptions from './form-steps/PremiumUpsaleOptions';
import FinalSubmission from './form-steps/FinalSubmission';

const FundingPostForm = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    title: '',
    tagline: '',
    category: '',
    country: '',
    coverImage: null,
    additionalImages: [],
    description: '',
    problem: '',
    vision: '',
    whyNow: '',
    teamMembers: [],
    fundingGoal: '',
    currency: 'USD',
    minimumContribution: '',
    fundingModel: 'donation',
    useOfFunds: [],
    milestones: [],
    rewards: [],
    identityDocument: null,
    businessRegistration: '',
    website: '',
    socialLinks: [],
    pitchVideo: '',
    documents: [],
    promotionTier: 'basic',
    agreeTerms: false,
    confirmAccuracy: false
  });

  const steps = [
    { id: 1, title: 'Project Type', icon: <Target className="w-4 h-4" /> },
    { id: 2, title: 'Basic Info', icon: <FileText className="w-4 h-4" /> },
    { id: 3, title: 'Story & Vision', icon: <Heart className="w-4 h-4" /> },
    { id: 4, title: 'Funding Details', icon: <DollarSign className="w-4 h-4" /> },
    { id: 5, title: 'Rewards', icon: <Star className="w-4 h-4" /> },
    { id: 6, title: 'Verification', icon: <Shield className="w-4 h-4" /> },
    { id: 7, title: 'Marketing', icon: <Video className="w-4 h-4" /> },
    { id: 8, title: 'Promotion', icon: <Zap className="w-4 h-4" /> },
    { id: 9, title: 'Submit', icon: <Check className="w-4 h-4" /> }
  ];

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectTypeSelector
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <BasicProjectInformation
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <ProjectStoryVision
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <FundingDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <RewardsSection
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <VerificationTrust
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 7:
        return (
          <PromotionMarketingAssets
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 8:
        return (
          <PremiumUpsaleOptions
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 9:
        return (
          <FinalSubmission
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
          />
        );
      default:
        return null;
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
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                    {currentStepData.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Post Your Project</h2>
                    <p className="text-sm text-gray-600">Step {currentStep} of {steps.length}: {currentStepData.title}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center ${
                        index < steps.length - 1 ? 'flex-1' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          step.id === currentStep
                            ? 'bg-blue-600 text-white'
                            : step.id < currentStep
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {step.id < currentStep ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          step.id
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 transition-colors ${
                            step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  {steps.map((step) => (
                    <div key={step.id} className="flex-1 text-center">
                      {step.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderStepContent()}
            </div>

            {/* Footer Navigation (for steps that don't have their own navigation) */}
            {currentStep <= 7 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FundingPostForm;
