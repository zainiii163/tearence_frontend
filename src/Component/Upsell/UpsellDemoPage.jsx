import React, { useState } from 'react';
import AdvertUpsellComponent from './AdvertUpsellComponent';
import { FaArrowLeft, FaRocket, FaStar } from 'react-icons/fa';

const UpsellDemoPage = () => {
  const [showUpsell, setShowUpsell] = useState(true);

  const handleTierSelect = (tierId) => {
    console.log('Selected tier:', tierId);
  };

  const handleSkip = () => {
    console.log('User skipped upsell');
    alert('You skipped the upsell. Your advert will be posted as a standard listing.');
  };

  const handleProceedToPayment = (tierData) => {
    console.log('Proceeding to payment with tier:', tierData);
    alert(`Proceeding to payment for ${tierData.name} at ${tierData.priceDisplay}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <div className="h-8 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">Upsell Component Demo</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Demo Mode
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUpsell(!showUpsell)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showUpsell
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {showUpsell ? 'Hide' : 'Show'} Upsell
              </button>
              <div className="text-sm text-gray-500">
                Toggle the upsell component visibility
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaStar className="h-4 w-4 text-yellow-500" />
              <span>Premium Demo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        {showUpsell ? (
          <AdvertUpsellComponent
            isVisible={showUpsell}
            selectedTier=""
            onTierSelect={handleTierSelect}
            onSkip={handleSkip}
            onProceedToPayment={handleProceedToPayment}
          />
        ) : (
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaRocket className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Upsell Component Hidden
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Click the "Show Upsell" button above to display the premium upsell component with three-tier structure.
              </p>
              <button
                onClick={() => setShowUpsell(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Show Upsell Component
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Highlights */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Key Features Implemented
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FaStar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Three-Tier Structure</h3>
              <p className="text-sm text-gray-600">
                Promoted, Featured, and Sponsored tiers with clear value propositions
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <FaRocket className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Smart Recommendations</h3>
              <p className="text-sm text-gray-600">
                Rotating conversion-focused messages to encourage upgrades
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <FaStar className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Premium Styling</h3>
              <p className="text-sm text-gray-600">
                Gold, blue, and black accents with smooth animations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpsellDemoPage;
