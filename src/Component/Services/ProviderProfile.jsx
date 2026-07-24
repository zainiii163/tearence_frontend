import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Mail, Phone, Globe, Briefcase, Award, Calendar, MessageCircle, Heart, ExternalLink, Check, X, Edit, Camera } from 'lucide-react';
import { formatCountry, formatCityCountry } from '../../utils/apiResponseHelpers';

const ProviderProfile = ({ providerId, onClose }) => {
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const loadProviderData = async () => {
      try {
        setLoading(true);
        // Load provider data
        // const providerData = await getProviderById(providerId);
        // const providerServices = await getProviderServices(providerId);
        // const providerReviews = await getProviderReviews(providerId);
        
        // Mock data for demonstration
        setProvider({
          id: providerId,
          name: 'John Designer',
          businessName: 'Creative Studio Pro',
          email: 'john@example.com',
          phone: '+1 234 567 8900',
          country: 'United States',
          city: 'New York',
          website: 'https://johndesigner.com',
          bio: 'Professional graphic designer with 8+ years of experience in branding, logo design, and digital marketing. I help businesses create stunning visual identities that stand out in the market.',
          skills: ['Logo Design', 'Brand Identity', 'UI/UX Design', 'Digital Marketing', 'Illustration'],
          languages: ['English (Native)', 'Spanish (Fluent)'],
          memberSince: '2022-01-15',
          responseTime: '1 hour',
          lastDelivery: '2 days ago',
          totalOrders: 342,
          totalEarnings: '$45,230',
          averageRating: 4.9,
          totalReviews: 128,
          verificationStatus: 'verified',
          profilePhoto: null,
          coverPhoto: null
        });

        setServices([
          {
            id: 1,
            title: 'Professional Logo Design',
            description: 'I will create a stunning, professional logo for your business',
            price: 50,
            deliveryTime: '3 days',
            image: '/api/placeholder/300/200',
            rating: 4.9,
            reviews: 45,
            category: 'Graphic Design'
          },
          {
            id: 2,
            title: 'Complete Brand Identity Package',
            description: 'Full brand identity including logo, colors, fonts, and guidelines',
            price: 200,
            deliveryTime: '7 days',
            image: '/api/placeholder/300/200',
            rating: 5.0,
            reviews: 23,
            category: 'Graphic Design'
          },
          {
            id: 3,
            title: 'Social Media Graphics',
            description: 'Custom social media graphics for your business profiles',
            price: 75,
            deliveryTime: '2 days',
            image: '/api/placeholder/300/200',
            rating: 4.8,
            reviews: 18,
            category: 'Graphic Design'
          }
        ]);

        setReviews([
          {
            id: 1,
            buyer: 'Sarah Johnson',
            rating: 5,
            date: '2024-01-10',
            comment: 'Absolutely fantastic work! John understood my vision perfectly and delivered beyond expectations. Highly recommend!',
            service: 'Professional Logo Design'
          },
          {
            id: 2,
            buyer: 'Mike Chen',
            rating: 4,
            date: '2024-01-05',
            comment: 'Great communication and quality work. Delivered on time and was very responsive to feedback.',
            service: 'Complete Brand Identity Package'
          },
          {
            id: 3,
            buyer: 'Emily Davis',
            rating: 5,
            date: '2023-12-28',
            comment: 'John is an amazing designer! Very creative and professional. Will definitely work with him again.',
            service: 'Social Media Graphics'
          }
        ]);

      } catch (error) {
        console.error('Error loading provider data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProviderData();
  }, [providerId]);

  const handleContactProvider = () => {
    // Implement contact functionality
    alert('Contact feature coming soon!');
  };

  const handleFollowProvider = () => {
    setIsFollowing(!isFollowing);
    // Implement follow/unfollow functionality
  };

  const getCountryFlag = (country) => {
    const countryName = formatCountry(country);
    const flags = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹',
      'India': '🇮🇳',
      'Brazil': '🇧🇷',
      'Japan': '🇯🇵',
      'China': '🇨🇳'
    };
    return flags[countryName] || '🌍';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading provider profile...</span>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Provider Not Found</h2>
          <p className="text-gray-600 mb-6">The provider you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Navigation */}
        <div className="relative z-10 flex items-center justify-between p-6">
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex space-x-2">
            <button className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center">
              {provider.profilePhoto ? (
                <img
                  src={provider.profilePhoto}
                  alt={provider.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">{provider.name.charAt(0)}</span>
                </div>
              )}
            </div>
            
            {/* Verification Badge */}
            {provider.verificationStatus === 'verified' && (
              <div className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full shadow-lg">
                <Check className="w-4 h-4" />
              </div>
            )}
            
            {/* Edit Profile Button */}
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Provider Information */}
      <div className="page-container py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-1">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{provider.businessName}</p>
                
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="mr-1">{getCountryFlag(provider.country)}</span>
                  <span>{formatCityCountry(provider.city, provider.country)}</span>
                </div>
                
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{provider.averageRating}</div>
                    <div className="flex items-center justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(provider.averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">{provider.totalReviews} reviews</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{provider.totalOrders}</div>
                    <div className="text-sm text-gray-500">Total Orders</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleContactProvider}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact
                  </button>
                  
                  <button
                    onClick={handleFollowProvider}
                    className={`flex-1 px-4 py-3 font-semibold rounded-xl transition-colors flex items-center justify-center ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{provider.responseTime}</div>
                  <div className="text-xs text-gray-600">Response Time</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">{provider.lastDelivery}</div>
                  <div className="text-xs text-gray-600">Last Delivery</div>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{provider.email}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{provider.phone}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  <a href={provider.website} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {provider.website}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Middle Column - Bio & Skills */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  About
                </h3>
                <p className="text-gray-600 leading-relaxed">{provider.bio}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Languages
                </h3>
                <div className="space-y-1">
                  {provider.languages.map((language, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {language}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Stats */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Stats</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(provider.memberSince).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Orders</span>
                    <span className="text-sm font-medium text-gray-900">{provider.totalOrders}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Earnings</span>
                    <span className="text-sm font-medium text-gray-900">{provider.totalEarnings}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Rating</span>
                    <span className="text-sm font-medium text-gray-900">{provider.averageRating}/5.0</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Verification</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      provider.verificationStatus === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {provider.verificationStatus === 'verified' ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-8">
              {['services', 'reviews', 'portfolio'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'services' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Services ({services.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="h-32 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{service.title}</h4>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-blue-600">${service.price}</span>
                        <span className="text-sm text-gray-500">{service.deliveryTime}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(service.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{service.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({service.reviews} reviews)</span>
                      </div>
                      <button className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        View Service
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Reviews ({reviews.length})</h3>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                            <span className="text-gray-600 font-semibold">{review.buyer.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.buyer}</h4>
                            <div className="flex items-center text-sm text-gray-500">
                              <div className="flex items-center mr-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span>{review.rating}/5.0</span>
                            </div>
                              <span className="ml-2">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Service: <span className="font-medium">{review.service}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio</h3>
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🎨</div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Portfolio Coming Soon</h4>
                  <p className="text-gray-600">This provider's portfolio will be available shortly.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
