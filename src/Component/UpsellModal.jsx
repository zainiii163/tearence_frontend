import React, { useState, useEffect } from 'react';
import { FaCrown, FaMedal, FaTrophy, FaFire, FaTimes, FaSpinner } from 'react-icons/fa';
import upsellService from '../services/UpsellService';

const UpsellModal = ({ isOpen, onClose, listing, onSuccess }) => {
  const [upsellOptions, setUpsellOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedUpsell, setSelectedUpsell] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUpsellOptions();
    }
  }, [isOpen]);

  const fetchUpsellOptions = async () => {
    try {
      setLoading(true);
      const response = await upsellService.getUpsellOptions();
      if (response.data?.success) {
        setUpsellOptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching upsell options:', error);
      setError('Failed to load upsell options. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (upsellType) => {
    if (!listing?.listing_id) {
      setError('Listing ID is required for purchase');
      return;
    }

    try {
      setPurchasing(true);
      setError('');
      setSelectedUpsell(upsellType);

      const upsellData = {
        listing_id: listing.listing_id,
        upsell_type: upsellType,
        duration_days: getDurationForType(upsellType),
        payment_method: 'stripe' // Default payment method
      };

      const response = await upsellService.purchaseUpsell(upsellData);
      
      if (response.data?.success) {
        onSuccess && onSuccess(response.data);
        onClose();
      } else {
        setError('Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Error purchasing upsell:', error);
      setError(error.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
      setSelectedUpsell(null);
    }
  };

  const getDurationForType = (upsellType) => {
    const durations = {
      priority: 7,
      featured: 14,
      sponsored: 21,
      premium: 30
    };
    return durations[upsellType] || 7;
  };

  const getIconForType = (upsellType) => {
    const icons = {
      premium: FaCrown,
      sponsored: FaMedal,
      featured: FaTrophy,
      priority: FaFire
    };
    return icons[upsellType] || FaCrown;
  };

  const getBadgeConfig = (upsellType) => {
    const configs = {
      premium: {
        icon: FaCrown,
        label: "Premium",
        className: "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border border-yellow-500",
      },
      sponsored: {
        icon: FaMedal,
        label: "Sponsored",
        className: "bg-gradient-to-r from-blue-400 to-blue-600 text-white border border-blue-500",
      },
      featured: {
        icon: FaTrophy,
        label: "Featured",
        className: "bg-gradient-to-r from-purple-400 to-purple-600 text-white border border-purple-500",
      },
      priority: {
        icon: FaFire,
        label: "Priority",
        className: "bg-gradient-to-r from-red-400 to-red-600 text-white border border-red-500",
      },
    };
    
    return configs[upsellType];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Promote Your Listing</h2>
            <p className="text-sm text-gray-600 mt-1">Choose how you want to promote "{listing?.title || 'Your Listing'}"</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading upsell options...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={fetchUpsellOptions}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upsellOptions.map((option) => {
                const Icon = getIconForType(option.type);
                const badgeConfig = getBadgeConfig(option.type);
                const isPurchasing = purchasing && selectedUpsell === option.type;

                return (
                  <div
                    key={option.type}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${badgeConfig.className}`}>
                            <badgeConfig.icon className="mr-1 h-3 w-3" />
                            {badgeConfig.label}
                          </span>
                          <span className="text-sm text-gray-500">Priority Score: {option.priority_score}</span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-1">{option.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-semibold text-lg text-primary">
                            ${option.price}
                          </span>
                          <span className="text-gray-500">
                            {option.duration_days} days
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchase(option.type)}
                        disabled={isPurchasing}
                        className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                          isPurchasing
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                      >
                        {isPurchasing ? (
                          <div className="flex items-center gap-2">
                            <FaSpinner className="h-4 w-4 animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          'Purchase'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Info Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-blue-900 mb-2">How Upselling Works</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Higher priority scores appear first in search results</li>
                  <li>• Multiple upsells can be purchased for cumulative priority</li>
                  <li>• Upsells automatically expire after the specified duration</li>
                  <li>• Payment is processed securely through our payment gateway</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpsellModal;
