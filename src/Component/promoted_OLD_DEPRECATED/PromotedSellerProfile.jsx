import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Star, Shield, Calendar, Eye, Heart, ExternalLink, MessageCircle, CheckCircle } from 'lucide-react';
import PromotedCard from './PromotedCard';

const PromotedSellerProfile = ({ seller }) => {
  const [activeTab, setActiveTab] = useState('adverts');
  const [isContacting, setIsContacting] = useState(false);

  // Sample seller data
  const sellerData = seller || {
    id: 1,
    name: "Elite Properties International",
    username: "eliteproperties",
    email: "contact@eliteproperties.com",
    phone: "+1 (555) 123-4567",
    location: "Miami Beach, Florida",
    country: "United States",
    countryFlag: "🇺🇸",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=300&fit=crop",
    bio: "Leading luxury real estate agency specializing in premium properties across the globe. With over 15 years of experience, we provide exceptional service and exclusive access to the most sought-after properties.",
    rating: 4.9,
    totalReviews: 342,
    verified: true,
    memberSince: "January 2018",
    totalAdverts: 47,
    promotedAdverts: 12,
    responseRate: 98,
    responseTime: "Within 1 hour",
    languages: ["English", "Spanish", "French"],
    specialties: ["Luxury Property", "Investment Properties", "Vacation Homes"],
    achievements: [
      { icon: "🏆", title: "Top Seller 2023" },
      { icon: "⭐", title: "1000+ Sales" },
      { icon: "🤝", title: "Trusted Partner" }
    ]
  };

  // Sample seller adverts
  const sellerAdverts = [
    {
      id: 1,
      title: "Oceanfront Paradise Villa",
      category: "Property",
      price: "$4,500,000",
      location: "Miami Beach, FL",
      countryFlag: "🇺🇸",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
      seller: sellerData.name,
      rating: 4.9,
      verified: true,
      views: 45234,
      saves: 2341,
      postedTime: "2 days ago",
      promoted: true
    },
    {
      id: 2,
      title: "Luxury Penthouse Suite",
      category: "Property",
      price: "$2,800,000",
      location: "Manhattan, NY",
      countryFlag: "🇺🇸",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      seller: sellerData.name,
      rating: 4.8,
      verified: true,
      views: 28456,
      saves: 1876,
      postedTime: "1 week ago",
      promoted: true
    },
    {
      id: 3,
      title: "Beachfront Condo",
      category: "Property",
      price: "$1,200,000",
      location: "Malibu, CA",
      countryFlag: "🇺🇸",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
      seller: sellerData.name,
      rating: 4.7,
      verified: true,
      views: 19876,
      saves: 1234,
      postedTime: "2 weeks ago",
      promoted: false
    }
  ];

  const handleContact = () => {
    setIsContacting(true);
    // Implement contact functionality
    setTimeout(() => {
      setIsContacting(false);
      alert('Message sent successfully!');
    }, 1500);
  };

  const handleQuickView = (advert) => {
    console.log('Quick view:', advert);
  };

  const handleSave = (advertId, isSaved) => {
    console.log('Save advert:', advertId, isSaved);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-48 lg:h-64">
        <img
          src={sellerData.coverImage}
          alt={`${sellerData.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Verified Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
            <CheckCircle className="w-4 h-4" />
            Verified Seller
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-12 left-6">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <img
              src={sellerData.avatar}
              alt={sellerData.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="pt-16">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{sellerData.name}</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{sellerData.location}</span>
                  <span>{sellerData.countryFlag}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {sellerData.memberSince}</span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed max-w-3xl">
                {sellerData.bio}
              </p>
            </div>

            {/* Contact Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContact}
              disabled={isContacting}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isContacting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Contact Seller
                </>
              )}
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{sellerData.rating}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                Rating ({sellerData.totalReviews} reviews)
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{sellerData.totalAdverts}</div>
              <div className="text-sm text-gray-600">Total Adverts</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{sellerData.promotedAdverts}</div>
              <div className="text-sm text-gray-600">Promoted</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{sellerData.responseRate}%</div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
          </div>

          {/* Achievements */}
          <div className="flex flex-wrap gap-3 mt-6">
            {sellerData.achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <span>{achievement.icon}</span>
                {achievement.title}
              </div>
            ))}
          </div>

          {/* Languages */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {sellerData.languages.map((language, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {sellerData.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex gap-8 px-6">
          {['adverts', 'promoted', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'adverts' && (
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {sellerData.totalAdverts}
                </span>
              )}
              {tab === 'promoted' && (
                <span className="ml-2 bg-amber-100 text-amber-600 px-2 py-1 rounded-full text-xs">
                  {sellerData.promotedAdverts}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'adverts' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Adverts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerAdverts.map((advert) => (
                <PromotedCard
                  key={advert.id}
                  advert={advert}
                  onQuickView={handleQuickView}
                  onSave={handleSave}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'promoted' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Promoted Adverts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerAdverts.filter(advert => advert.promoted).map((advert) => (
                <PromotedCard
                  key={advert.id}
                  advert={advert}
                  onQuickView={handleQuickView}
                  onSave={handleSave}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {/* Sample reviews */}
              {[1, 2, 3].map((review) => (
                <div key={review} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">Customer {review}</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Excellent service! Very professional and helped me find the perfect property.
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotedSellerProfile;
