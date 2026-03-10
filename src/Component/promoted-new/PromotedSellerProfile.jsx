import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Mail, ExternalLink, Check, Crown, TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';

const PromotedSellerProfile = () => {
  const [selectedSeller, setSelectedSeller] = useState(null);

  const promotedSellers = [
    {
      id: 1,
      name: 'Miami Luxury Properties',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      country: 'United States',
      location: 'Miami, Florida',
      flag: '🇺🇸',
      verified: true,
      promotedAdverts: 23,
      rating: 4.9,
      reviews: 127,
      responseTime: '1 hour',
      memberSince: '2019',
      totalViews: '452K',
      totalSaves: '12.3K',
      categories: ['Property', 'Real Estate'],
      contact: {
        phone: '+1-305-555-0123',
        email: 'info@miamiluxury.com',
        website: 'https://miamiluxury.com'
      }
    },
    {
      id: 2,
      name: 'Digital Growth Agency',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face',
      country: 'United Kingdom',
      location: 'London, UK',
      flag: '🇬🇧',
      verified: true,
      promotedAdverts: 18,
      rating: 5.0,
      reviews: 234,
      responseTime: '30 minutes',
      memberSince: '2020',
      totalViews: '298K',
      totalSaves: '8.7K',
      categories: ['Jobs & Services', 'Digital Marketing'],
      contact: {
        email: 'hello@digitalgrowth.com',
        website: 'https://digitalgrowth.com'
      }
    },
    {
      id: 3,
      name: 'LA Auto Exchange',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      country: 'United States',
      location: 'Los Angeles, California',
      flag: '🇺🇸',
      verified: true,
      promotedAdverts: 31,
      rating: 4.8,
      reviews: 89,
      responseTime: '2 hours',
      memberSince: '2018',
      totalViews: '384K',
      totalSaves: '15.6K',
      categories: ['Cars & Vehicles', 'Automotive'],
      contact: {
        phone: '+1-310-555-0456',
        email: 'sales@laauto.com'
      }
    },
    {
      id: 4,
      name: 'Paris Fashion House',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face',
      country: 'France',
      location: 'Paris, France',
      flag: '🇫🇷',
      verified: true,
      promotedAdverts: 15,
      rating: 4.8,
      reviews: 78,
      responseTime: '4 hours',
      memberSince: '2021',
      totalViews: '345K',
      totalSaves: '9.2K',
      categories: ['Fashion & Beauty', 'Luxury Goods'],
      contact: {
        email: 'contact@parisfashion.fr',
        website: 'https://parisfashion.fr'
      }
    }
  ];

  const handleContact = (seller, type) => {
    switch (type) {
      case 'phone':
        if (seller.contact.phone) {
          window.open(`tel:${seller.contact.phone}`);
        }
        break;
      case 'email':
        if (seller.contact.email) {
          window.open(`mailto:${seller.contact.email}`);
        }
        break;
      case 'website':
        if (seller.contact.website) {
          window.open(seller.contact.website, '_blank');
        }
        break;
      default:
        break;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {promotedSellers.map((seller) => (
          <motion.div
            key={seller.id}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedSeller(seller)}
          >
            {/* Seller Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-1 rounded-full">
                  <Crown className="h-3 w-3" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm truncate">{seller.name}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{seller.location}</span>
                  <span>{seller.flag}</span>
                </div>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                <Check className="h-3 w-3" />
                Verified
              </div>
              <div className="text-xs text-gray-500">
                {seller.promotedAdverts} promoted
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-gray-900">{seller.rating}</span>
              </div>
              <span className="text-xs text-gray-500">({seller.reviews} reviews)</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{seller.totalViews}</div>
                <div className="text-xs text-gray-600">Views</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{seller.totalSaves}</div>
                <div className="text-xs text-gray-600">Saves</div>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1 mb-3">
              {seller.categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Contact Button */}
            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2 rounded-lg text-sm font-medium transition-all duration-200">
              Contact Seller
            </button>
          </motion.div>
        ))}
      </div>

      {/* Selected Seller Detail Modal */}
      {selectedSeller && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSeller(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Seller Cover */}
            <div className="relative h-32 bg-gradient-to-r from-orange-400 to-blue-500">
              <div className="absolute -bottom-12 left-6">
                <div className="relative">
                  <img
                    src={selectedSeller.avatar}
                    alt={selectedSeller.name}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-2 rounded-full">
                    <Crown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="px-6 pt-16 pb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedSeller.name}</h3>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedSeller.location}</span>
                      <span className="text-lg">{selectedSeller.flag}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      <Check className="h-3 w-3" />
                      Verified Seller
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSeller(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{selectedSeller.promotedAdverts}</div>
                  <div className="text-sm text-gray-600">Promoted Ads</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="text-2xl font-bold text-gray-900">{selectedSeller.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedSeller.totalViews}</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{selectedSeller.totalSaves}</div>
                  <div className="text-sm text-gray-600">Total Saves</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">Response Time</span>
                  </div>
                  <div className="font-semibold text-gray-900">{selectedSeller.responseTime}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">Member Since</span>
                  </div>
                  <div className="font-semibold text-gray-900">{selectedSeller.memberSince}</div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSeller.categories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Options */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Contact Options</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedSeller.contact.phone && (
                    <button
                      onClick={() => handleContact(selectedSeller, 'phone')}
                      className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-all duration-200"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call</span>
                    </button>
                  )}
                  {selectedSeller.contact.email && (
                    <button
                      onClick={() => handleContact(selectedSeller, 'email')}
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-all duration-200"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </button>
                  )}
                  {selectedSeller.contact.website && (
                    <button
                      onClick={() => handleContact(selectedSeller, 'website')}
                      className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition-all duration-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Website</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PromotedSellerProfile;
