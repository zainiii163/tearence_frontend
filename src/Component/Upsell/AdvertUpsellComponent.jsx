import React, { useState, useEffect } from 'react';
import { 
  FaStar, 
  FaCrown, 
  FaRocket, 
  FaCheck, 
  FaTimes, 
  FaArrowRight,
  FaFire,
  FaChartLine,
  FaBolt,
  FaGem,
  FaTrophy,
  FaShieldAlt,
  FaEnvelope,
  FaShareAlt,
  FaHome,
  FaSearch,
  FaTag
} from 'react-icons/fa';

const AdvertUpsellComponent = ({ 
  onTierSelect, 
  onSkip, 
  onProceedToPayment,
  selectedTier: initialSelectedTier = '',
  isVisible = true 
}) => {
  const [selectedTier, setSelectedTier] = useState(initialSelectedTier);
  const [showComparison, setShowComparison] = useState(false);

  // Enhanced three-tier structure as specified
  const upsellTiers = [
    {
      id: "promoted",
      name: "Promoted Advert",
      tier: "Tier 1 — Mid‑Tier",
      icon: FaStar,
      price: 29.99,
      priceDisplay: "£29.99",
      badge: "Promoted",
      badgeColor: "from-blue-500 to-cyan-500",
      cardBg: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-300",
      benefits: [
        "Highlighted card design",
        "Appears above standard listings",
        "Promoted badge on listing",
        "2× more visibility than standard",
        "Enhanced search ranking"
      ],
      features: {
        visibility: "2x Standard",
        placement: "Above Standard Listings",
        email: false,
        social: false,
        badge: "Promoted",
        cardSize: "Standard",
        searchPriority: "Enhanced"
      }
    },
    {
      id: "featured",
      name: "Featured Advert",
      tier: "Tier 2 — High‑Tier",
      icon: FaCrown,
      price: 59.99,
      priceDisplay: "£59.99",
      badge: "Featured",
      badgeColor: "from-purple-500 to-pink-500",
      cardBg: "from-purple-50 to-pink-50",
      borderColor: "border-purple-300",
      isPopular: true,
      benefits: [
        "Top placement in category pages",
        "Larger, premium advert card",
        "Priority in all search results",
        "Featured in weekly 'Top Featured Ads' email",
        "Featured badge with gold accent",
        "4× more visibility on average"
      ],
      features: {
        visibility: "4x Standard",
        placement: "Top of Category Pages",
        email: true,
        social: false,
        badge: "Featured",
        cardSize: "Large",
        searchPriority: "High Priority"
      }
    },
    {
      id: "sponsored",
      name: "Sponsored Advert",
      tier: "Tier 3 — Premium Tier",
      icon: FaRocket,
      price: 99.99,
      priceDisplay: "£99.99",
      badge: "Sponsored",
      badgeColor: "from-yellow-400 to-orange-500",
      cardBg: "from-yellow-50 to-orange-50",
      borderColor: "border-orange-300",
      isPremium: true,
      benefits: [
        "Premium homepage placement",
        "Featured in homepage slider carousel",
        "Top placement in all categories",
        "Included in social media promotion",
        "Sponsored badge with premium styling",
        "Maximum platform visibility (10x)",
        "Dedicated account support"
      ],
      features: {
        visibility: "10x Standard",
        placement: "Homepage & Premium",
        email: true,
        social: true,
        badge: "Sponsored",
        cardSize: "Extra Large",
        searchPriority: "Maximum Priority"
      }
    }
  ];

  const comparisonData = [
    {
      feature: "Visibility Boost",
      icon: FaChartLine,
      promoted: "2x Standard",
      featured: "4x Standard",
      sponsored: "10x Standard"
    },
    {
      feature: "Placement Priority",
      icon: FaSearch,
      promoted: "Above Standard",
      featured: "Top Category",
      sponsored: "Homepage & VIP"
    },
    {
      feature: "Card Size",
      icon: FaTag,
      promoted: "Standard",
      featured: "Large",
      sponsored: "Extra Large"
    },
    {
      feature: "Email Inclusion",
      icon: FaEnvelope,
      promoted: <FaTimes className="text-gray-400" />,
      featured: <FaCheck className="text-green-500" />,
      sponsored: <FaCheck className="text-green-500" />
    },
    {
      feature: "Social Promotion",
      icon: FaShareAlt,
      promoted: <FaTimes className="text-gray-400" />,
      featured: <FaTimes className="text-gray-400" />,
      sponsored: <FaCheck className="text-green-500" />
    },
    {
      feature: "Badge Type",
      icon: FaShieldAlt,
      promoted: "Promoted",
      featured: "Featured",
      sponsored: "Sponsored"
    }
  ];

  const smartRecommendations = [
    "Featured adverts get 4× more views on average",
    "Sponsored adverts typically sell 3x faster",
    "80% of premium sellers choose Featured tier",
    "Homepage placement reaches 100k+ daily visitors"
  ];

  const [currentRecommendation, setCurrentRecommendation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRecommendation((prev) => (prev + 1) % smartRecommendations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTierSelect = (tierId) => {
    setSelectedTier(tierId);
    if (onTierSelect) {
      onTierSelect(tierId);
    }
  };

  const handleProceedToPayment = () => {
    if (selectedTier && onProceedToPayment) {
      const selectedTierData = upsellTiers.find(tier => tier.id === selectedTier);
      onProceedToPayment(selectedTierData);
    }
  };

  const selectedTierData = upsellTiers.find(tier => tier.id === selectedTier);

  if (!isVisible) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="page-container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200 mb-6">
            <FaFire className="mr-2 h-5 w-5 text-orange-500" />
            Boost Your Advert's Visibility
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Choose Your Promotion Tier
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your advert seen by millions of potential buyers. Premium placement = faster sales.
          </p>
        </div>

        {/* Smart Recommendation Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 mb-12 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                <FaBolt className="h-6 w-6 text-yellow-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Smart Recommendation</h3>
                <p className="text-blue-100 transition-all duration-500">
                  {smartRecommendations[currentRecommendation]}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              {smartRecommendations.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentRecommendation ? 'bg-white w-8' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Three Selectable Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {upsellTiers.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedTier === tier.id;
            
            return (
              <div
                key={tier.id}
                onClick={() => handleTierSelect(tier.id)}
                className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  isSelected ? 'scale-[1.02]' : ''
                }`}
              >
                {/* Popular Badge */}
                {tier.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                      <FaTrophy className="h-4 w-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                {/* Premium Badge */}
                {tier.isPremium && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                      <FaGem className="h-4 w-4" />
                      <span>Premium Tier</span>
                    </div>
                  </div>
                )}

                {/* Main Card */}
                <div className={`relative bg-white rounded-3xl shadow-2xl border-2 overflow-hidden ${
                  isSelected ? tier.borderColor : 'border-gray-200'
                } transition-all duration-300`}>
                  {/* Gradient Header */}
                  <div className={`h-32 bg-gradient-to-br ${tier.badgeColor} relative`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute bottom-4 left-6 right-6">
                      <div className="flex items-center justify-between">
                        <div className="h-16 w-16 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg">
                          <Icon className={`h-8 w-8 text-transparent bg-clip-text bg-gradient-to-br ${tier.badgeColor}`} />
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">{tier.priceDisplay}</div>
                          <div className="text-white/80 text-sm">per listing</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${tier.cardBg} ${tier.borderColor} border`}>
                        {tier.tier}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3 mb-6">
                      {tier.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <FaCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Radio Button */}
                    <div className="flex items-center justify-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isSelected ? `border-purple-500 bg-purple-500` : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className={`absolute top-4 right-4 h-8 w-8 bg-gradient-to-r ${tier.badgeColor} rounded-full flex items-center justify-center shadow-lg`}>
                      <FaCheck className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Compare All Features</h2>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-2"
            >
              <span>{showComparison ? 'Hide' : 'Show'} Comparison</span>
              <FaArrowRight className={`transform transition-transform duration-300 ${showComparison ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {showComparison && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-blue-600">Promoted</th>
                    <th className="text-center py-4 px-4 font-semibold text-purple-600">Featured</th>
                    <th className="text-center py-4 px-4 font-semibold text-orange-600">Sponsored</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => {
                    const Icon = row.icon;
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-gray-400" />
                            <span className="font-medium text-gray-900">{row.feature}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-gray-700">{row.promoted}</td>
                        <td className="py-4 px-4 text-center text-gray-700">{row.featured}</td>
                        <td className="py-4 px-4 text-center text-gray-700">{row.sponsored}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sticky Summary Box */}
        <div className="sticky bottom-8 bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-6 max-w-md mx-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Order Summary</h3>
              {selectedTierData ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Selected Tier:</span>
                    <span className="font-semibold text-gray-900">{selectedTierData.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Cost:</span>
                    <span className="text-2xl font-bold text-purple-600">{selectedTierData.priceDisplay}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No tier selected</p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onSkip}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Skip for Now
              </button>
              <button
                onClick={handleProceedToPayment}
                disabled={!selectedTier}
                className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
                  selectedTier
                    ? 'bg-gradient-to-r from-purple-600 to-orange-600 text-white hover:from-purple-700 hover:to-orange-700 shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Proceed to Payment</span>
                <FaArrowRight className="h-4 w-4" />
              </button>
            </div>

            {!selectedTier && (
              <p className="text-xs text-gray-500 text-center">
                Select a tier above to proceed with payment
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertUpsellComponent;
