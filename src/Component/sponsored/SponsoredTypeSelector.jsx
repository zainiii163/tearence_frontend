import React, { useState } from 'react';
import { Package, Briefcase, Home, Users, Calendar, Car, TrendingUp, MoreHorizontal } from 'lucide-react';

const SponsoredTypeSelector = ({ advertType, setAdvertType }) => {
  const advertTypes = [
    {
      id: 'product',
      icon: Package,
      title: 'Product / Item for Sale',
      description: 'Sell physical products, electronics, furniture, or any tangible items',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'service',
      icon: Briefcase,
      title: 'Service / Business Offer',
      description: 'Offer professional services, consulting, repairs, or business solutions',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'property',
      icon: Home,
      title: 'Property / Real Estate',
      description: 'List properties for sale, rent, or real estate opportunities',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'job',
      icon: Users,
      title: 'Job / Recruitment',
      description: 'Post job openings, career opportunities, or recruitment drives',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'event',
      icon: Calendar,
      title: 'Event / Experience',
      description: 'Promote events, workshops, concerts, or special experiences',
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'vehicle',
      icon: Car,
      title: 'Vehicle / Motors',
      description: 'Sell cars, motorcycles, boats, or any motorized vehicles',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'business',
      icon: TrendingUp,
      title: 'Business Opportunity',
      description: 'Offer franchise opportunities, partnerships, or business investments',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'other',
      icon: MoreHorizontal,
      title: 'Miscellaneous / Other',
      description: 'For any other type of advertisement that doesn\'t fit above categories',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Advert Type</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the category that best describes your sponsored advertisement. This helps us optimize your placement and targeting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {advertTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = advertType === type.id;
          
          return (
            <div
              key={type.id}
              onClick={() => setAdvertType(type.id)}
              className={`
                relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 hover:scale-105
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }
              `}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{type.description}</p>
              
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <span className="text-sm font-medium text-blue-600">Selected</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {advertType && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Great choice!</h4>
              <p className="text-sm text-gray-600">
                Your advert will be optimized for maximum visibility in the {advertTypes.find(t => t.id === advertType)?.title} category.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsoredTypeSelector;
