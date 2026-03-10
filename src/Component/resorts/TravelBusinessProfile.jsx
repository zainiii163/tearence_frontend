import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Star, 
  Calendar, 
  CheckCircle,
  Users,
  Hotel,
  Car,
  MessageCircle,
  ExternalLink,
  Award,
  TrendingUp
} from 'lucide-react';

const TravelBusinessProfile = ({ business, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!business) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Hotel },
    { id: 'listings', label: 'Listings', icon: Hotel },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'contact', label: 'Contact', icon: Phone }
  ];

  const sampleListings = [
    {
      id: 1,
      title: 'Luxury Beach Resort',
      image: 'https://images.unsplash.com/photo-1571003123894-1fba9f8f8d59?w=400&h=300&fit=crop',
      price: 450,
      rating: 4.9,
      reviews: 234,
      category: 'accommodation'
    },
    {
      id: 2,
      title: 'Airport Transfer Service',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      price: 65,
      rating: 4.7,
      reviews: 156,
      category: 'transport'
    },
    {
      id: 3,
      title: 'City Center Hotel',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63e5170?w=400&h=300&fit=crop',
      price: 180,
      rating: 4.8,
      reviews: 189,
      category: 'accommodation'
    }
  ];

  const sampleReviews = [
    {
      id: 1,
      author: 'Sarah Johnson',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excellent service and beautiful accommodations. Would definitely recommend!',
      helpful: 23
    },
    {
      id: 2,
      author: 'Michael Chen',
      rating: 4,
      date: '2024-01-10',
      comment: 'Great experience overall. Professional staff and clean facilities.',
      helpful: 15
    },
    {
      id: 3,
      author: 'Emma Wilson',
      rating: 5,
      date: '2024-01-05',
      comment: 'Outstanding service! They went above and beyond to make our stay memorable.',
      helpful: 31
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-r from-blue-600 to-teal-600">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop"
                alt="Business Cover"
                className="w-full h-full object-cover opacity-50"
              />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Business Info Overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-end space-x-4">
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg"
                  />
                  <div className="flex-1 text-white">
                    <div className="flex items-center space-x-2 mb-1">
                      <h2 className="text-2xl font-bold">{business.name}</h2>
                      {business.verified && (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-blue-100">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{business.rating}</span>
                        <span className="text-sm">({Math.floor(Math.random() * 500 + 100)} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Hotel className="w-4 h-4" />
                        <span>{business.listings} listings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About {business.name}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {business.name} is a premier travel service provider dedicated to delivering exceptional experiences for travelers worldwide. 
                      With years of expertise in the industry, we specialize in providing top-quality accommodations and transportation services 
                      that exceed our customers' expectations.
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{business.listings}</div>
                      <div className="text-sm text-gray-600">Active Listings</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{business.rating}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">98%</div>
                      <div className="text-sm text-gray-600">Response Rate</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">2h</div>
                      <div className="text-sm text-gray-600">Response Time</div>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Services Offered</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Hotel className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Luxury Accommodations</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Car className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">Transport Services</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-700">Group Tours</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Award className="w-5 h-5 text-orange-600" />
                        <span className="text-gray-700">Premium Experiences</span>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        🏆 Top Rated 2024
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        ✨ Premium Partner
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        🌿 Eco Friendly
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        ⭐ Customer Choice
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Listings Tab */}
              {activeTab === 'listings' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Active Listings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sampleListings.map((listing) => (
                      <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex">
                          <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-32 h-32 object-cover"
                          />
                          <div className="flex-1 p-4">
                            <h4 className="font-semibold text-gray-900 mb-1">{listing.title}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span>{listing.rating}</span>
                              <span>({listing.reviews} reviews)</span>
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                              ${listing.price}
                              <span className="text-sm text-gray-500 font-normal">
                                {listing.category === 'accommodation' ? '/night' : '/trip'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-semibold text-lg">{business.rating}</span>
                      </div>
                      <span className="text-gray-600">({Math.floor(Math.random() * 500 + 100)} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {sampleReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-gray-900">{review.author}</div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span>{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{review.comment}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-blue-600">
                            <span>👍 Helpful</span>
                            <span>({review.helpful})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-600">Phone</div>
                          <div className="font-medium text-gray-900">+1 (555) 123-4567</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-600">Email</div>
                          <div className="font-medium text-gray-900">contact@{business.name.toLowerCase().replace(/\s+/g, '')}.com</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-600">Website</div>
                          <a href="#" className="font-medium text-blue-600 hover:underline flex items-center space-x-1">
                            <span>www.{business.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-600">Address</div>
                          <div className="font-medium text-gray-900">
                            123 Business Street, Suite 100<br />
                            New York, NY 10001, United States
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Send a Message</h4>
                        <form className="space-y-3">
                          <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <textarea
                            placeholder="Your Message"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Send Message</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default TravelBusinessProfile;
