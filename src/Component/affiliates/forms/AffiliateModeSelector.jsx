import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, ArrowRight, Check } from 'lucide-react';

const AffiliateModeSelector = ({ onSelect, selectedMode }) => {
  const [hoveredMode, setHoveredMode] = useState(null);

  const modes = [
    {
      id: 'business',
      title: 'I am a Business',
      subtitle: 'I need promoters',
      description: 'Create affiliate programs for your products and services',
      icon: Briefcase,
      features: [
        'Reach global promoters',
        'Performance-based marketing',
        'Brand protection',
        'Analytics & tracking'
      ],
      color: 'blue'
    },
    {
      id: 'user',
      title: 'I am a Promoter',
      subtitle: 'I want to post my affiliate link',
      description: 'Share affiliate links and earn commissions',
      icon: Users,
      features: [
        'High commission rates',
        'Quality products',
        'Marketing assets',
        'Flexible work'
      ],
      color: 'purple'
    }
  ];

  const getColorClasses = (color, isSelected, isHovered) => {
    const baseClasses = 'rounded-2xl p-8 transition-all duration-300 cursor-pointer border-2';
    
    if (isSelected) {
      return `${baseClasses} border-${color}-500 bg-${color}-50 shadow-2xl`;
    }
    
    if (isHovered) {
      return `${baseClasses} border-${color}-300 bg-${color}-50 shadow-xl transform scale-105`;
    }
    
    return `${baseClasses} border-gray-200 bg-white shadow-lg hover:shadow-xl`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Path</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select whether you're a business looking for promoters or a promoter looking to share affiliate links
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {modes.map((mode) => (
          <motion.div
            key={mode.id}
            className={getColorClasses(mode.color, selectedMode === mode.id, hoveredMode === mode.id)}
            onClick={() => onSelect(mode.id)}
            onMouseEnter={() => setHoveredMode(mode.id)}
            onMouseLeave={() => setHoveredMode(null)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Selection Indicator */}
            {selectedMode === mode.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-1"
              >
                <Check className="h-4 w-4" />
              </motion.div>
            )}

            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${mode.color}-100 mb-6`}>
              <mode.icon className={`h-8 w-8 text-${mode.color}-600`} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {mode.title}
            </h3>
            
            <p className={`text-${mode.color}-600 font-medium mb-3`}>
              {mode.subtitle}
            </p>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              {mode.description}
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {mode.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <div className={`w-1.5 h-1.5 rounded-full bg-${mode.color}-500 mr-2`} />
                  {feature}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className={`flex items-center text-${mode.color}-600 font-medium`}>
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Help Text */}
      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">
          Not sure? You can always switch between business and promoter accounts later
        </p>
      </div>
    </div>
  );
};

export default AffiliateModeSelector;
