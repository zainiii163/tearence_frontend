import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star, Phone, MessageCircle, Mail, Globe, CheckCircle, Shield, Crown, Calendar, TrendingUp, Users, Eye, Heart, ExternalLink, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import SponsoredAdvertsService from '../../services/sponsoredService';

const SponsoredSellerProfile = ({ sellerId, onClose }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [showContactModal, setShowContactModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    stats: true,
    verification: true,
    listings: false,
    reviews: false
  });
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load seller data from API
  React.useEffect(() => {
    const loadSellerData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await SponsoredAdvertsService.homepage.getTrendingServices();
        
        if (response.success) {
          setSellerData(response.data);
        } else {
          setError('Failed to load seller profile');
        }
      } catch (err) {
        console.error('Error loading seller data:', err);
        setError('Failed to load seller profile');
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      loadSellerData();
    }
  }, [sellerId]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleContactSeller = async (message) => {
    try {
      const response = await SponsoredAdvertsService.homepage.getTrendingServices();
      if (response.success) {
        setShowContactModal(false);
        // Show success message
        alert('Message sent successfully!');
      } else {
        alert(response.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error contacting seller:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };
      
      const response = await SponsoredAdvertsService.homepage.getTrendingServices();
      
      if (response.success) {
        setShowContactModal(false);
        alert('Message sent successfully!');
      } else {
        alert('Failed to send message: ' + response.message);
      }
    } catch (error) {
      console.error('Contact seller failed:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Get country flag
  const getCountryFlag = (country) => {
    const flags = {
      'USA': '🇺🇸',
      'UK': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'Spain': '🇪🇸',
      'UAE': '🇦🇪',
      'Singapore': '🇸🇬',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽'
    };
    return flags['USA'] || '🌍'; // Default to USA for sample data
  };

  const tabs = [
    { id: 'about', label: 'About', icon: Globe },
    { id: 'listings', label: 'Listings', icon: Eye },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'contact', label: 'Contact', icon: MessageCircle }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              {sellerData.verified ? (
                <Shield className="w-8 h-8 text-white" />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {sellerData?.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900">{sellerData?.name || 'Unknown Seller'}</h2>
                {sellerData?.verified && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Verified</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{sellerData?.averageRating || 0}</span>
                  <span>({sellerData?.totalReviews || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{sellerData?.adsCount || 0} ads</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{sellerData.totalSales}</div>
            <div className="text-xs text-gray-600">Total Sales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{sellerData.totalRevenue}</div>
            <div className="text-xs text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{sellerData.responseRate}</div>
            <div className="text-xs text-gray-600">Response Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{sellerData.responseTime}</div>
            <div className="text-xs text-gray-600">Response Time</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'text-yellow-600 border-b-2 border-yellow-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Business Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Business Type:</span>
                      <span className="text-sm font-medium text-gray-900">{sellerData.businessType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Member Since:</span>
                      <span className="text-sm font-medium text-gray-900">{sellerData.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Last Active:</span>
                      <span className="text-sm font-medium text-gray-900">{sellerData.lastActive}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Location:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {getCountryFlag('USA')} United States
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Languages:</span>
                      <span className="text-sm font-medium text-gray-900">{sellerData?.languages?.join(', ') || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification */}
              <div>
                <button
                  onClick={() => toggleSection('verification')}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
                  {expandedSections.verification ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.verification && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-green-800">{sellerData.verificationLevel}</div>
                          <div className="text-sm text-green-600">Fully verified business</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[
                          'Business registration verified',
                          'Identity verified',
                          'Bank account verified',
                          'Phone number verified',
                          'Email address verified'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                            <CheckCircle className="w-3 h-3" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {sellerData.specialties.map((specialty, index) => (
                    <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sellerData.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-900">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'listings' && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Listings ({sellerData?.listings?.length || 0})</h3>
              <div className="space-y-4">
                {sellerData?.listings?.map((listing) => (
                  <div key={listing.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/img/NoImage.png';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{listing.title}</h4>
                      <div className="text-lg font-bold text-gray-900 mb-2">{listing.price}</div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{listing.views.toLocaleString()} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{listing.likes} likes</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{sellerData?.averageRating || 0}</span>
                  </div>
                  <span className="text-sm text-gray-600">({sellerData?.totalReviews || 0} reviews)</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {sellerData?.reviews?.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">{review.author?.charAt(0) || 'U'}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{review.author || 'Anonymous'}</span>
                            {review.verified && (
                              <CheckCircle className="w-3 h-3 text-blue-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span>•</span>
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <button className="w-full flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium text-blue-900">Phone</div>
                    <div className="text-sm text-blue-700">+1 (555) 123-4567</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium text-green-900">Send Message</div>
                    <div className="text-sm text-green-700">Average response: {sellerData?.responseTime || 'N/A'}</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium text-purple-900">Email</div>
                    <div className="text-sm text-purple-700">contact@example.com</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Website</div>
                    <div className="text-sm text-gray-700">www.example.com</div>
                  </div>
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-medium text-yellow-900">Premium Seller Benefits</h4>
                </div>
                <ul className="space-y-1 text-sm text-yellow-800">
                  <li>• 24/7 customer support</li>
                  <li>• Verified business status</li>
                  <li>• Priority listing placement</li>
                  <li>• Advanced analytics dashboard</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <button
            onClick={() => setShowContactModal(true)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Contact Seller
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            View All Ads
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact {sellerData.name}</h3>
              <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    name="message"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter your message..."
                  />
                </div>
              </form>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Send Message
                </button>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SponsoredSellerProfile;
