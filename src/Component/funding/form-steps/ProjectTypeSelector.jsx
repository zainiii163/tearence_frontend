import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Heart, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

const ProjectTypeSelector = ({ formData, updateFormData, onNext }) => {
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

  const handleSelect = (typeId) => {
    updateFormData({ projectType: typeId });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
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
            className="group relative p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-left"
          >
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
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-6 h-6 text-blue-600" />
            </div>

            {/* Selection Indicator */}
            <div className="absolute inset-0 rounded-2xl border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.button>
        ))}
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">i</span>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Not sure which category to choose?</h4>
            <p className="text-sm text-blue-700">
              Don't worry - you can always update your project type later. The most important thing is to get started with the category that feels right for your project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTypeSelector;
