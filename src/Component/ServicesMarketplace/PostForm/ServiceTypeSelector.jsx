import React, { useState } from 'react';
import { Briefcase, MapPin, Building, CheckCircle } from 'lucide-react';

const ServiceTypeSelector = ({ selectedType, onTypeSelect }) => {
  const serviceTypes = [
    {
      id: 'freelance',
      name: 'Freelance Service',
      icon: Briefcase,
      description: 'Offer your skills and expertise remotely',
      examples: ['Web Development', 'Graphic Design', 'Content Writing', 'Digital Marketing'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'local',
      name: 'Local Service',
      icon: MapPin,
      description: 'Provide services in your local area',
      examples: ['Home Cleaning', 'Personal Training', 'Photography', 'Handyman Services'],
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'business',
      name: 'Business Service',
      icon: Building,
      description: 'B2B services for companies and organizations',
      examples: ['IT Consulting', 'Business Consulting', 'Legal Services', 'Accounting'],
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Service Type</h2>
        <p className="text-gray-600">Select the type of service you want to offer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;

          return (
            <div
              key={type.id}
              onClick={() => onTypeSelect(type.id)}
              className={`relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {type.name}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {type.description}
              </p>

              {/* Examples */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500">Examples:</p>
                <div className="flex flex-wrap gap-1">
                  {type.examples.map((example, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedType && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Selected:</span> {serviceTypes.find(t => t.id === selectedType)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceTypeSelector;
