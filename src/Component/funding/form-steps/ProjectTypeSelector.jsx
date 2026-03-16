import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Heart, 
  Sparkles,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import fundingService from '../../../services/FundingService';

const ProjectTypeSelector = ({ formData, updateFormData, onNext, onPrev }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(formData.projectType || '');
  const [isHovered, setIsHovered] = useState(null);

  const projectTypes = [
    {
      id: 'personal',
      title: 'Personal Project',
      description: 'Individual creative or personal endeavors',
      icon: <User className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      examples: ['Art projects', 'Music albums', 'Personal inventions', 'Creative writing']
    },
    {
      id: 'startup',
      title: 'Startup / Business Project',
      description: 'Early-stage companies and business ventures',
      icon: <Briefcase className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      examples: ['Tech startups', 'Product launches', 'Business expansion', 'Market entry']
    },
    {
      id: 'community',
      title: 'Community / Charity Project',
      description: 'Social impact and community benefit initiatives',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      examples: ['Non-profit initiatives', 'Community programs', 'Charity campaigns', 'Social causes']
    },
    {
      id: 'creative',
      title: 'Creative / Innovation Project',
      description: 'Artistic, innovative, and experimental projects',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-pink-500 to-pink-600',
      examples: ['Film production', 'Design projects', 'Innovation labs', 'Creative experiments']
    }
  ];

  const handleSelect = async (typeId) => {
    if (!typeId) {
      setError('Please select a project type to continue');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Validate project type with API if needed
      // const response = await fundingService.validateProjectType(typeId);
      
      updateFormData({ projectType: typeId });
      setSelectedType(typeId);
      
      // Small delay for better UX
      setTimeout(() => {
        onNext();
        setLoading(false);
      }, 300);
    } catch (err) {
      setError('Failed to validate project type. Please try again.');
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (onPrev) onPrev();
  };

  const handleCancel = () => {
    // Handle cancel/close functionality
    if (window.confirm('Are you sure you want to cancel? Any unsaved progress will be lost.')) {
      // Close the form or navigate away
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
              1
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Project Type</h2>
              <p className="text-sm text-gray-600">Choose your project category</p>
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
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">What type of project are you creating?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the category that best describes your project. This helps us match you with the right funders and provides relevant guidance.
            </p>
          </div>

          {/* Project Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectTypes.map((type, index) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleSelect(type.id)}
                onMouseEnter={() => setIsHovered(type.id)}
                onMouseLeave={() => setIsHovered(null)}
                disabled={loading}
                className={`group relative p-6 bg-white border-2 rounded-2xl transition-all duration-300 text-left ${
                  selectedType === type.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : isHovered === type.id
                    ? 'border-blue-300 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Loading Overlay */}
                {loading && selectedType === type.id && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 rounded-2xl flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Success Checkmark */}
                {selectedType === type.id && !loading && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${type.color} text-white mb-4`}>
                  {type.icon}
                </div>

                {/* Content */}
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.title}
                </h4>
                <p className="text-gray-600 mb-4">
                  {type.description}
                </p>

                {/* Examples */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className={`absolute top-6 right-6 transition-opacity duration-300 ${
                  isHovered === type.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <ChevronRight className="w-6 h-6 text-blue-600" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 rounded-xl p-6 mt-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">i</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 mb-2">Not sure which category to choose?</h4>
                <p className="text-sm text-blue-700">
                  Don't worry - you can always update your project type later. The most important thing is to get started with the category that feels right for your project.
                </p>
                <div className="mt-3">
                  <a href="/help/project-types" className="text-blue-600 hover:text-blue-800 text-sm font-medium underline">
                    Learn more about project types →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTypeSelector;
