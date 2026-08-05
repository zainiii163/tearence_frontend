import React from 'react';
import { CreditCard, CheckCircle, Star, Crown, Zap, Package, MapPin, User, Calendar, ArrowRight, AlertCircle } from 'lucide-react';

const SponsoredSummary = ({ 
  advertType, 
  basicInfo, 
  description, 
  sellerInfo, 
  location, 
  sponsoredTier,
  onProceedToPayment 
}) => {
  const getTierInfo = (tierId) => {
    const tiers = {
      promoted: { name: 'Promoted', price: 50, icon: Star, color: 'text-blue-600' },
      featured: { name: 'Featured', price: 30, icon: Zap, color: 'text-purple-600' },
      sponsored: { name: 'Sponsored', price: 100, icon: Crown, color: 'text-yellow-600' }
    };
    return tiers[tierId] || null;
  };

  const getAdvertTypeLabel = (type) => {
    const types = {
      product: 'Product / Item for Sale',
      service: 'Service / Business Offer',
      property: 'Property / Real Estate',
      job: 'Job / Recruitment',
      event: 'Event / Experience',
      vehicle: 'Vehicle / Motors',
      business: 'Business Opportunity',
      other: 'Miscellaneous / Other'
    };
    return types[type] || 'Not Selected';
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Add sponsored tier cost
    const tierInfo = getTierInfo(sponsoredTier);
    if (tierInfo) {
      total += tierInfo.price;
    }
    
    // Add verified seller cost if selected
    if (sellerInfo?.verifiedSeller) {
      total += 19.99;
    }
    
    return total;
  };

  const tierInfo = getTierInfo(sponsoredTier);
  const totalCost = calculateTotal();

  const isFormValid = () => {
    return (
      advertType &&
      basicInfo?.title &&
      basicInfo?.tagline &&
      basicInfo?.category &&
      basicInfo?.country &&
      basicInfo?.city &&
      basicInfo?.condition &&
      basicInfo?.images &&
      basicInfo.images.length > 0 &&
      sellerInfo?.name &&
      sellerInfo?.phone &&
      sellerInfo?.email &&
      sponsoredTier
    );
  };

  const completionPercentage = () => {
    let completed = 0;
    let total = 7;
    
    if (advertType) completed++;
    if (basicInfo?.title && basicInfo?.tagline && basicInfo?.category) completed++;
    if (basicInfo?.images && basicInfo.images.length > 0) completed++;
    if (description && Object.values(description).some(val => val)) completed++;
    if (sellerInfo?.name && sellerInfo?.phone && sellerInfo?.email) completed++;
    if (location?.coordinates) completed++;
    if (sponsoredTier) completed++;
    
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="sticky top-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Order Summary</h3>
        <p className="text-blue-100 text-sm">Review your sponsored advert details</p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Form Completion</span>
          <span className="text-sm font-bold text-blue-600">{completionPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage()}%` }}
          />
        </div>
        {!isFormValid() && (
          <div className="mt-3 flex items-center space-x-2 text-amber-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Please complete all required fields</span>
          </div>
        )}
      </div>

      {/* Advert Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h4 className="font-semibold text-gray-900 mb-4">Advert Details</h4>
        
        {/* Advert Type */}
        <div className="flex items-start space-x-3">
          <Package className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-gray-500">Type</p>
            <p className="text-sm font-medium text-gray-900">{getAdvertTypeLabel(advertType)}</p>
          </div>
        </div>

        {/* Title */}
        {basicInfo?.title && (
          <div className="flex items-start space-x-3">
            <Star className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Title</p>
              <p className="text-sm font-medium text-gray-900 truncate">{basicInfo.title}</p>
            </div>
          </div>
        )}

        {/* Category */}
        {basicInfo?.category && (
          <div className="flex items-start space-x-3">
            <div className="w-4 h-4 bg-gray-200 rounded mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Category</p>
              <p className="text-sm font-medium text-gray-900">{basicInfo.category}</p>
            </div>
          </div>
        )}

        {/* Location */}
        {location?.address && (
          <div className="flex items-start space-x-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium text-gray-900 truncate">{location.address}</p>
              {location.privacyMode && (
                <p className="text-xs text-purple-600">Privacy Mode Active</p>
              )}
            </div>
          </div>
        )}

        {/* Seller */}
        {sellerInfo?.name && (
          <div className="flex items-start space-x-3">
            <User className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Seller</p>
              <p className="text-sm font-medium text-gray-900">{sellerInfo.name}</p>
              {sellerInfo.verifiedSeller && (
                <p className="text-xs text-green-600">✓ Verified Seller</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Promotion Tier */}
      {tierInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <tierInfo.icon className={`w-5 h-5 mr-2 ${tierInfo.color}`} />
            Promotion Tier
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{tierInfo.name}</span>
              <span className={`text-lg font-bold ${tierInfo.color}`}>${tierInfo.price}</span>
            </div>
            
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Enhanced visibility and placement</p>
              <p>• Premium badge and features</p>
              <p>• Priority support and analytics</p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Services */}
      {sellerInfo?.verifiedSeller && (
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Verified Seller Badge</span>
            </div>
            <span className="text-sm font-bold text-green-600">+$19.99</span>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Price Breakdown</h4>
        
        <div className="space-y-3">
          {tierInfo && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{tierInfo.name}</span>
              <span className="text-sm font-medium">${tierInfo.price}</span>
            </div>
          )}
          
          {sellerInfo?.verifiedSeller && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Verified Seller Badge</span>
              <span className="text-sm font-medium">$19.99</span>
            </div>
          )}
          
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">Total Cost</span>
              <span className="text-xl font-bold text-blue-600">${totalCost.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Billed monthly</p>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={onProceedToPayment}
        disabled={!isFormValid()}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-3
          ${isFormValid()
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        <CreditCard className="w-5 h-5" />
        <span>Proceed to Payment</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Security Badge */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Monthly Billing</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Instant Activation</span>
          </div>
        </div>
      </div>

      {/* Missing Fields Alert */}
      {!isFormValid() && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Complete Your Advert</p>
              <p className="text-xs text-amber-700 mt-1">
                Please fill in all required fields to proceed with payment
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsoredSummary;
