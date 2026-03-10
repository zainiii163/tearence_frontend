import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  MessageCircle, 
  Heart, 
  Share2, 
  Shield, 
  Calendar,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  Eye,
  Package,
  Building
} from 'lucide-react';

const FeaturedSellerProfile = ({ seller, onClose }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isSaved, setIsSaved] = useState(false);

  const tabs = [
    { id: 'about', label: 'About', icon: Users },
    { id: 'listings', label: 'Listings', icon: Package },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'stats', label: 'Stats', icon: TrendingUp }
  ];

  const sampleListings = [
    {
      id: 1,
      title: 'Luxury Villa with Ocean View',
      price: '$1,200,000',
      location: 'Monaco',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop',
      views: 15234,
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Executive Business Center',
      price: '$850,000',
      location: 'London',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
      views: 9876,
      posted: '1 week ago'
    },
    {
      id: 3,
      title: 'Premium Investment Portfolio',
      price: '$2,500,000',
      location: 'New York',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      views: 28901,
      posted: '3 days ago'
    }
  ];

  const sampleReviews = [
    {
      id: 1,
      author: 'John Smith',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent service! Very professional and responsive. The property was exactly as described.',
      verified: true
    },
    {
      id: 2,
      author: 'Emma Wilson',
      rating: 4,
      date: '1 month ago',
      comment: 'Great experience overall. Smooth transaction and good communication throughout.',
      verified: true
    },
    {
      id: 3,
      author: 'Carlos Rodriguez',
      rating: 5,
      date: '2 months ago',
      comment: 'Outstanding seller! Went above and beyond to ensure everything was perfect.',
      verified: false
    }
  ];

  const handleSaveSeller = () => {
    setIsSaved(!isSaved);
  };

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: seller.name,
        text: `Check out ${seller.name} on WorldwideAdverts`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleContactSeller = () => {
    // Open contact form or messaging
    alert('Contact form would open here');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">About {seller.name}</h4>
              <p className="text-gray-700 leading-relaxed">
                Premium seller with extensive experience in the {seller.category || 'marketplace'}. 
                Committed to providing exceptional service and value to all clients. 
                Specialized in high-end properties and investment opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Contact Information</h5>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{seller.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{seller.email}</span>
                  </div>
                  {seller.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={seller.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                        {seller.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-3">Business Details</h5>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">Member since {seller.memberSince}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{seller.responseRate} response rate</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{seller.totalListings} active listings</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h5 className="font-medium text-purple-900 mb-2 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Premium Seller Benefits
              </h5>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  Verified business credentials
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  Priority customer support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  Enhanced listing visibility
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
                  Advanced analytics dashboard
                </li>
              </ul>
            </div>
          </div>
        );

      case 'listings':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Active Listings</h4>
              <span className="text-sm text-gray-600">{sampleListings.length} listings</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleListings.map(listing => (
                <div key={listing.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h5 className="font-medium text-gray-900 mb-2">{listing.title}</h5>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="font-semibold text-purple-600">{listing.price}</span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {listing.views.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.location}
                      </span>
                      <span>{listing.posted}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Customer Reviews</h4>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(seller.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">{seller.rating}</span>
                <span className="text-sm text-gray-600">({sampleReviews.length} reviews)</span>
              </div>
            </div>

            <div className="space-y-4">
              {sampleReviews.map(review => (
                <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium">
                          {review.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{review.author}</span>
                          {review.verified && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-600">Verified</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Performance Statistics</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{seller.totalListings}</div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">2.5h</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{seller.rating}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h5 className="font-medium text-gray-900 mb-4">Monthly Performance</h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Views this month</span>
                  <span className="font-medium text-gray-900">45,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Contacts received</span>
                  <span className="font-medium text-gray-900">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Conversion rate</span>
                  <span className="font-medium text-gray-900">12.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue generated</span>
                  <span className="font-medium text-gray-900">$2.3M</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold text-gray-900">{seller.name}</h2>
                    {seller.verified && (
                      <Shield className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{seller.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{seller.totalListings} listings</span>
                    <span>•</span>
                    <span>Member since {seller.memberSince}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveSeller}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShareProfile}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleContactSeller}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Contact Seller</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <ExternalLink className="h-5 w-5" />
                <span>View All Listings</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSellerProfile;
