import React, { useState } from "react";
import { FaRocket, FaStar, FaGem, FaCheck, FaCrown, FaFire, FaChartLine } from "react-icons/fa";

const SponsoredUpsellOptions = ({ selectedTier, setSelectedTier, onProceedToPayment }) => {
  const [showComparison, setShowComparison] = useState(false);

  const sponsoredTiers = [
    {
      id: "basic",
      name: "Sponsored Basic",
      icon: <FaRocket className="h-6 w-6" />,
      price: 29.99,
      benefits: [
        "Listed on Sponsored Adverts Page",
        "Highlighted card",
        "Sponsored badge",
        "3× more visibility than standard ads"
      ],
      features: {
        visibility: "3x Standard",
        placement: "Sponsored Page",
        email: false,
        social: false,
        badge: "Sponsored"
      }
    },
    {
      id: "plus",
      name: "Sponsored Plus",
      icon: <FaStar className="h-6 w-6" />,
      price: 49.99,
      isPopular: true,
      benefits: [
        "All Basic features",
        "Top of category placement",
        "Larger advert card",
        "Priority in search results",
        "Included in weekly 'Sponsored Highlights' email"
      ],
      features: {
        visibility: "5x Standard",
        placement: "Top of Category",
        email: true,
        social: false,
        badge: "Sponsored Plus"
      }
    },
    {
      id: "premium",
      name: "Sponsored Premium",
      icon: <FaGem className="h-6 w-6" />,
      price: 99.99,
      isVip: true,
      benefits: [
        "Homepage placement",
        "Featured in homepage slider",
        "Category top placement",
        "Included in social media promotion",
        "Premium Sponsored badge",
        "Maximum visibility across the platform"
      ],
      features: {
        visibility: "10x Standard",
        placement: "Homepage & Top",
        email: true,
        social: true,
        badge: "Premium Sponsored"
      }
    }
  ];

  const handleTierSelect = (tierId) => {
    setSelectedTier(tierId);
  };

  const selectedTierData = sponsoredTiers.find(tier => tier.id === selectedTier);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-100 to-orange-100 text-purple-700 border-purple-200">
          <FaFire className="mr-2 h-4 w-4 text-orange-500" />
          Boost Your Ad's Performance
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-600">Sponsored Tier</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get maximum visibility and reach thousands of potential customers with our premium sponsorship packages
        </p>
      </div>

      {/* Smart Recommendation Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <FaChartLine className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              💡 Smart Recommendation
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Sponsored Plus adverts get <span className="font-bold">5× more views</span> on average. Most sellers choose this tier for optimal results.
            </p>
          </div>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sponsoredTiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          
          return (
            <div
              key={tier.id}
              onClick={() => handleTierSelect(tier.id)}
              className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                isSelected
                  ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg scale-[1.02]"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-md"
              }`}
            >
              {/* Popular/VIP Ribbons */}
              {tier.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    🔥 Most Popular
                  </div>
                </div>
              )}
              
              {tier.isVip && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <FaCrown className="h-3 w-3" />
                    VIP Tier
                  </div>
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <FaCheck className="h-4 w-4 text-white" />
                </div>
              )}

              {/* Content */}
              <div className="text-center space-y-4">
                {/* Icon */}
                <div
                  className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto ${
                    isSelected 
                      ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg" 
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tier.icon}
                </div>

                {/* Name & Price */}
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {tier.name}
                  </h3>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-primary">
                      £{tier.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per listing
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  {tier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2 text-left">
                      <FaCheck className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isSelected ? "text-primary" : "text-green-500"}`} />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Table Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <span>{showComparison ? 'Hide' : 'Show'} Detailed Comparison</span>
          <svg 
            className={`h-4 w-4 transition-transform ${showComparison ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Comparison Table */}
      {showComparison && (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4 font-medium text-foreground">Features</th>
                  <th className="text-center p-4 font-medium text-foreground">Basic</th>
                  <th className="text-center p-4 font-medium text-foreground">Plus</th>
                  <th className="text-center p-4 font-medium text-foreground">Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-4 text-sm font-medium text-foreground">Visibility Boost</td>
                  <td className="p-4 text-center text-sm text-muted-foreground">3x Standard</td>
                  <td className="p-4 text-center text-sm text-primary font-medium">5x Standard</td>
                  <td className="p-4 text-center text-sm text-primary font-bold">10x Standard</td>
                </tr>
                <tr className="border-t bg-muted/20">
                  <td className="p-4 text-sm font-medium text-foreground">Placement</td>
                  <td className="p-4 text-center text-sm text-muted-foreground">Sponsored Page</td>
                  <td className="p-4 text-center text-sm text-primary">Top of Category</td>
                  <td className="p-4 text-center text-sm text-primary font-medium">Homepage & Top</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 text-sm font-medium text-foreground">Email Inclusion</td>
                  <td className="p-4 text-center text-sm text-muted-foreground">❌</td>
                  <td className="p-4 text-center text-sm text-primary">✅ Weekly Highlights</td>
                  <td className="p-4 text-center text-sm text-primary">✅ Weekly Highlights</td>
                </tr>
                <tr className="border-t bg-muted/20">
                  <td className="p-4 text-sm font-medium text-foreground">Social Media</td>
                  <td className="p-4 text-center text-sm text-muted-foreground">❌</td>
                  <td className="p-4 text-center text-sm text-muted-foreground">❌</td>
                  <td className="p-4 text-center text-sm text-primary">✅ Full Promotion</td>
                </tr>
                <tr className="border-t">
                  <td className="p-4 text-sm font-medium text-foreground">Badge Type</td>
                  <td className="p-4 text-center text-sm text-muted-foreground">Sponsored</td>
                  <td className="p-4 text-center text-sm text-primary">Sponsored Plus</td>
                  <td className="p-4 text-center text-sm text-primary font-medium">Premium Sponsored</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sticky Summary Box */}
      {selectedTierData && (
        <div className="sticky bottom-6 bg-gradient-to-r from-purple-600 to-orange-600 rounded-2xl p-6 text-white shadow-2xl border border-purple-500/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold mb-1">Selected Tier</h4>
              <p className="text-2xl font-bold">{selectedTierData.name}</p>
              <p className="text-purple-100">Total Cost: £{selectedTierData.price}</p>
            </div>
            <button
              onClick={onProceedToPayment}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white text-purple-600 px-8 py-3 font-semibold hover:bg-purple-50 transition-colors shadow-lg"
            >
              <span>Proceed to Payment</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsoredUpsellOptions;
