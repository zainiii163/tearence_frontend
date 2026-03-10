import React, { useState } from 'react';
import { 
  FaStar, 
  FaCheckCircle, 
  FaEnvelope, 
  FaPhone, 
  FaGlobe,
  FaCrown,
  FaGem,
  FaRocket,
  FaMapMarkerAlt,
  FaEye,
  FaHeart,
  FaArrowRight,
  FaTrophy,
  FaShieldAlt
} from 'react-icons/fa';

const FeaturedSellerProfiles = () => {
  const [selectedSeller, setSelectedSeller] = useState(null);

  // Sample featured sellers data
  const featuredSellers = [
    {
      id: 1,
      name: 'Elite Properties',
      photo: 'https://ui-avatars.com/api/?name=Elite+Properties&background=0D8ABC&color=fff',
      country: 'United States',
      flag: '🇺🇸',
      location: 'New York, USA',
      verified: true,
      rating: 4.9,
      reviews: 342,
      featuredAds: 47,
      totalSales: '$12.5M',
      memberSince: '2018',
      responseRate: '98%',
      languages: ['English', 'Spanish'],
      specialties: ['Luxury Property', 'Commercial Real Estate', 'Investment Properties'],
      badge: 'premium',
      contact: {
        email: 'contact@eliteproperties.com',
        phone: '+1 555-0123',
        website: 'https://eliteproperties.com'
      },
      stats: {
        views: 125000,
        saves: 892,
        responses: 1247
      }
    },
    {
      id: 2,
      name: 'Classic Motors',
      photo: 'https://ui-avatars.com/api/?name=Classic+Motors&background=FF6B6B&color=fff',
      country: 'Italy',
      flag: '🇮🇹',
      location: 'Milan, Italy',
      verified: true,
      rating: 4.8,
      reviews: 256,
      featuredAds: 23,
      totalSales: '€8.2M',
      memberSince: '2015',
      responseRate: '96%',
      languages: ['Italian', 'English', 'German'],
      specialties: ['Vintage Cars', 'Classic Motorcycles', 'Restoration Services'],
      badge: 'premium',
      contact: {
        email: 'info@classicmotors.it',
        phone: '+39 02 1234 5678',
        website: 'https://classicmotors.it'
      },
      stats: {
        views: 98000,
        saves: 654,
        responses: 892
      }
    },
    {
      id: 3,
      name: 'Venture Capital Ltd',
      photo: 'https://ui-avatars.com/api/?name=Venture+Capital&background=4ECDC4&color=fff',
      country: 'United Kingdom',
      flag: '🇬🇧',
      location: 'London, UK',
      verified: true,
      rating: 4.7,
      reviews: 189,
      featuredAds: 31,
      totalSales: '£45.3M',
      memberSince: '2019',
      responseRate: '92%',
      languages: ['English', 'French', 'Mandarin'],
      specialties: ['Tech Startups', 'AI Investments', 'Blockchain Ventures'],
      badge: 'vip',
      contact: {
        email: 'invest@venturecap.co.uk',
        phone: '+44 20 7123 4567',
        website: 'https://venturecap.co.uk'
      },
      stats: {
        views: 76000,
        saves: 523,
        responses: 678
      }
    },
    {
      id: 4,
      name: 'Luxury Travel Co',
      photo: 'https://ui-avatars.com/api/?name=Luxury+Travel&background=6C5CE7&color=fff',
      country: 'Maldives',
      flag: '🇲🇻',
      location: 'Malé, Maldives',
      verified: true,
      rating: 4.9,
      reviews: 412,
      featuredAds: 18,
      totalSales: '$6.8M',
      memberSince: '2016',
      responseRate: '97%',
      languages: ['English', 'Dhivehi', 'Hindi'],
      specialties: ['Luxury Resorts', 'Yacht Charters', 'Private Islands'],
      badge: 'premium',
      contact: {
        email: 'packages@luxurytravel.mv',
        phone: '+960 333 1234',
        website: 'https://luxurytravel.mv'
      },
      stats: {
        views: 89000,
        saves: 789,
        responses: 934
      }
    }
  ];

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'vip':
        return 'from-yellow-400 to-orange-500';
      case 'premium':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'vip':
        return FaCrown;
      case 'premium':
        return FaGem;
      default:
        return FaRocket;
    }
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) 
                ? 'text-yellow-400' 
                : i < rating 
                ? 'text-yellow-200' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  const handleContactSeller = (seller, method) => {
    console.log(`Contacting ${seller.name} via ${method}`);
    // Implementation would open contact modal or redirect
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <FaTrophy className="h-6 w-6 text-orange-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Featured Seller Profiles</h3>
            <p className="text-sm text-gray-600">Top sellers with premium listings</p>
          </div>
        </div>
      </div>

      {/* Sellers Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredSellers.map((seller) => {
            const BadgeIcon = getBadgeIcon(seller.badge);
            return (
              <div
                key={seller.id}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedSeller(seller)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={seller.photo}
                        alt={seller.name}
                        className="h-16 w-16 rounded-full border-3 border-white shadow-lg"
                      />
                      {seller.verified && (
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                          <FaCheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-lg font-bold text-gray-900">{seller.name}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getBadgeColor(seller.badge)} text-white`}>
                          <BadgeIcon className="h-3 w-3 inline mr-1" />
                          {seller.badge === 'vip' ? 'VIP' : seller.badge === 'premium' ? 'Premium' : 'Pro'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="text-lg">{seller.flag}</span>
                        <span>{seller.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    {renderRating(seller.rating)}
                    <span className="text-sm text-gray-600">{seller.reviews} reviews</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600">{seller.featuredAds}</div>
                    <div className="text-xs text-gray-600">Featured Ads</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">{seller.responseRate}</div>
                    <div className="text-xs text-gray-600">Response Rate</div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-1">
                    {seller.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Member Since */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <FaShieldAlt className="h-4 w-4" />
                  <span>Member since {seller.memberSince}</span>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <FaEye className="h-4 w-4" />
                    <span>{seller.stats.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaHeart className="h-4 w-4" />
                    <span>{seller.stats.saves}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{seller.stats.responses}</span>
                    <span>responses</span>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleContactSeller(seller, 'email')}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaEnvelope className="h-4 w-4" />
                    <span className="text-sm font-medium">Email</span>
                  </button>
                  <button
                    onClick={() => handleContactSeller(seller, 'phone')}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FaPhone className="h-4 w-4" />
                    <span className="text-sm font-medium">Call</span>
                  </button>
                  <button
                    onClick={() => window.open(seller.contact.website, '_blank')}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaGlobe className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaCrown className="h-4 w-4 text-orange-500" />
            <span>Verified sellers with premium listings</span>
          </div>
          <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center space-x-1">
            <span>View All Sellers</span>
            <FaArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Seller Detail Modal (if selected) */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedSeller(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedSeller.photo}
                    alt={selectedSeller.name}
                    className="h-20 w-20 rounded-full border-4 border-white/30"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedSeller.name}</h2>
                    <div className="flex items-center space-x-2 text-yellow-100">
                      <span className="text-xl">{selectedSeller.flag}</span>
                      <span>{selectedSeller.location}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSeller(null)}
                  className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Rating */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Rating & Reviews</h3>
                    <div className="flex items-center space-x-3">
                      {renderRating(selectedSeller.rating)}
                      <span className="text-sm text-gray-600">
                        {selectedSeller.reviews} reviews
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Performance</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-3xl font-bold text-purple-600">
                          {selectedSeller.featuredAds}
                        </div>
                        <div className="text-sm text-gray-600">Featured Ads</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-3xl font-bold text-green-600">
                          {selectedSeller.responseRate}
                        </div>
                        <div className="text-sm text-gray-600">Response Rate</div>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeller.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <a
                        href={`mailto:${selectedSeller.contact.email}`}
                        className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FaEnvelope className="h-5 w-5 text-blue-600" />
                        <span>{selectedSeller.contact.email}</span>
                      </a>
                      <a
                        href={`tel:${selectedSeller.contact.phone}`}
                        className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <FaPhone className="h-5 w-5 text-green-600" />
                        <span>{selectedSeller.contact.phone}</span>
                      </a>
                      <a
                        href={selectedSeller.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <FaGlobe className="h-5 w-5 text-purple-600" />
                        <span>Visit Website</span>
                      </a>
                    </div>
                  </div>

                  {/* Total Sales */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Total Sales</h3>
                    <div className="text-3xl font-bold text-orange-600">
                      {selectedSeller.totalSales}
                    </div>
                    <div className="text-sm text-gray-600">Since {selectedSeller.memberSince}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedSellerProfiles;
