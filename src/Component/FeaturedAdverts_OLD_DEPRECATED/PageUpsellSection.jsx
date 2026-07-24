import React, { useState } from 'react';
import { 
  FaStar, 
  FaCrown, 
  FaRocket, 
  FaCheck, 
  FaArrowRight,
  FaFire,
  FaArrowUp,
  FaEye,
  FaGem,
  FaShieldAlt,
  FaTrophy
} from 'react-icons/fa';

const PageUpsellSection = () => {
  const [selectedTier, setSelectedTier] = useState('');

  const upsellTiers = [
    {
      id: 'promoted',
      name: 'Promoted',
      tier: 'Basic',
      price: 29.99,
      priceDisplay: '$29.99',
      icon: FaStar,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      benefits: [
        'Highlighted card design',
        'Appears above standard listings',
        'Promoted badge on listing',
        '2× more visibility than standard',
        'Enhanced search ranking'
      ],
      features: {
        visibility: '2x Standard',
        placement: 'Above Standard Listings',
        email: false,
        social: false,
        badge: 'Promoted'
      }
    },
    {
      id: 'featured',
      name: 'Featured',
      tier: 'Popular',
      price: 59.99,
      priceDisplay: '$59.99',
      icon: FaGem,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-300',
      isPopular: true,
      benefits: [
        'Top placement in category pages',
        'Larger, premium advert card',
        'Priority in all search results',
        'Featured in weekly "Top Featured Ads" email',
        'Featured badge with gold accent',
        '4× more visibility on average'
      ],
      features: {
        visibility: '4x Standard',
        placement: 'Top of Category Pages',
        email: true,
        social: false,
        badge: 'Featured'
      }
    },
    {
      id: 'sponsored',
      name: 'Sponsored',
      tier: 'Premium',
      price: 99.99,
      priceDisplay: '$99.99',
      icon: FaRocket,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-orange-300',
      isPremium: true,
      benefits: [
        'Premium homepage placement',
        'Featured in homepage slider carousel',
        'Top placement in all categories',
        'Included in social media promotion',
        'Sponsored badge with premium styling',
        'Maximum platform visibility (10x)',
        'Dedicated account support'
      ],
      features: {
        visibility: '10x Standard',
        placement: 'Homepage & Premium',
        email: true,
        social: true,
        badge: 'Sponsored'
      }
    }
  ];

  const handleUpgradeNow = (tier) => {
    setSelectedTier(tier.id);
    // Navigate to posting form with pre-selected tier
    console.log('Upgrading to:', tier);
    // Implementation would navigate to posting form
    alert(`Redirecting to ${tier.name} upgrade form...`);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-16">
      <div className="page-container">
        {/* Main Banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200 mb-6">
            <FaFire className="mr-2 h-5 w-5 text-orange-500" />
            Limited Time Offer
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Want Your Advert Here?
          </h2>
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-4xl mx-auto">
            Upgrade to Featured or Sponsored for maximum visibility and reach millions of potential buyers
          </p>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center space-x-2">
              <FaEye className="h-5 w-5 text-yellow-400" />
              <span>10x More Views</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaArrowUp className="h-5 w-5 text-green-400" />
              <span>5x Faster Sales</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaShieldAlt className="h-5 w-5 text-blue-400" />
              <span>Premium Support</span>
            </div>
          </div>
        </div>

        {/* Upsell Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {upsellTiers.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedTier === tier.id;
            
            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] ${
                  isSelected ? 'ring-4 ring-purple-400 scale-[1.02]' : ''
                }`}
              >
                {/* Popular Badge */}
                {tier.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                
                {/* Premium Badge */}
                {tier.isPremium && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                      <FaTrophy className="h-4 w-4" />
                      <span>PREMIUM</span>
                    </div>
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg z-10">
                    <FaCheck className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Header */}
                <div className={`h-32 bg-gradient-to-br ${tier.color} relative`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="flex items-center justify-between">
                      <div className="h-16 w-16 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg">
                        <Icon className={`h-8 w-8 text-transparent bg-clip-text bg-gradient-to-br ${tier.color}`} />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">{tier.priceDisplay}</div>
                        <div className="text-white/80 text-sm">one-time</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${tier.bgColor} ${tier.borderColor} border`}>
                      {tier.tier} Tier
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <FaCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Upgrade Button */}
                  <button
                    onClick={() => handleUpgradeNow(tier)}
                    className={`w-full py-4 font-bold rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2 ${
                      tier.isPremium
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 shadow-lg'
                        : tier.isPopular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg'
                    }`}
                  >
                    <span>Upgrade Now</span>
                    <FaArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Compare All Features</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6 font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-blue-300">Promoted</th>
                  <th className="text-center py-4 px-6 font-semibold text-purple-300">Featured</th>
                  <th className="text-center py-4 px-6 font-semibold text-yellow-300">Sponsored</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">Visibility Boost</td>
                  <td className="text-center py-4 px-4">2x Standard</td>
                  <td className="text-center py-4 px-4 font-bold text-purple-300">4x Standard</td>
                  <td className="text-center py-4 px-4 font-bold text-yellow-300">10x Standard</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">Placement Priority</td>
                  <td className="text-center py-4 px-4">Above Standard</td>
                  <td className="text-center py-4 px-4 font-bold text-purple-300">Top Category</td>
                  <td className="text-center py-4 px-4 font-bold text-yellow-300">Homepage & VIP</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">Email Promotion</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 text-green-400">✅</td>
                  <td className="text-center py-4 px-4 text-green-400">✅</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-4 px-6">Social Media</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 text-green-400">✅</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">Dedicated Support</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 text-green-400">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center space-x-2">
              <FaShieldAlt className="h-5 w-5 text-green-400" />
              <span>30-Day Money Back</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaTrophy className="h-5 w-5 text-yellow-400" />
              <span>Trusted by 50K+ Sellers</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCrown className="h-5 w-5 text-purple-400" />
              <span>Premium Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageUpsellSection;
