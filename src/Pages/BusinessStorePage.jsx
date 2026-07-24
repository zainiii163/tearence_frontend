import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiPhone, FiMail, FiGlobe, FiClock, FiCheck, FiX, FiTrendingUp, FiUsers, FiDollarSign, FiPackage, FiEdit, FiSettings } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import toast from 'react-hot-toast';
import BackButton from '../Component/BackButton';

const BusinessStorePage = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    fetchBusinessData();
  }, [slug]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      
      // Mock business data - in production, this would come from API
      const mockBusiness = {
        id: 1,
        name: 'Tech Solutions Inc.',
        slug: 'tech-solutions-inc',
        description: 'Leading technology solutions provider specializing in software development, IT consulting, and digital transformation services.',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        category: 'Technology',
        subcategory: 'Software Development',
        founded: '2015',
        employees: '50-100',
        location: {
          address: '123 Tech Street, Silicon Valley, CA 94000',
          city: 'Silicon Valley',
          country: 'United States',
          coordinates: { lat: 37.4419, lng: -122.1430 }
        },
        contact: {
          phone: '+1 (555) 123-4567',
          email: 'info@techsolutions.com',
          website: 'https://techsolutions.com'
        },
        social: {
          facebook: 'https://facebook.com/techsolutions',
          twitter: 'https://twitter.com/techsolutions',
          linkedin: 'https://linkedin.com/company/techsolutions',
          instagram: 'https://instagram.com/techsolutions'
        },
        rating: 4.8,
        reviews: 127,
        verification: 'verified',
        subscription: {
          plan: 'premium',
          status: 'active',
          postsUsed: 3,
          postsLimit: 5,
          expiresAt: '2024-12-31',
          features: ['permanent_posts', 'featured_badge', 'analytics', 'priority_support']
        },
        stats: {
          totalViews: 15420,
          totalClicks: 3240,
          activeAdverts: 3,
          responseRate: 95
        },
        operatingHours: {
          monday: '9:00 AM - 6:00 PM',
          tuesday: '9:00 AM - 6:00 PM',
          wednesday: '9:00 AM - 6:00 PM',
          thursday: '9:00 AM - 6:00 PM',
          friday: '9:00 AM - 6:00 PM',
          saturday: '10:00 AM - 4:00 PM',
          sunday: 'Closed'
        }
      };

      const mockAdverts = [
        {
          id: 1,
          title: 'Custom Software Development Services',
          description: 'Professional custom software development tailored to your business needs.',
          price: 5000,
          currency: 'USD',
          type: 'service',
          status: 'active',
          featured: true,
          sponsored: false,
          promoted: false,
          images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'],
          createdAt: '2024-01-15',
          views: 2450,
          clicks: 320
        },
        {
          id: 2,
          title: 'IT Consulting Package',
          description: 'Comprehensive IT consulting for businesses looking to optimize their technology infrastructure.',
          price: 2500,
          currency: 'USD',
          type: 'service',
          status: 'active',
          featured: false,
          sponsored: true,
          promoted: false,
          images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'],
          createdAt: '2024-01-10',
          views: 1890,
          clicks: 210
        },
        {
          id: 3,
          title: 'Cloud Migration Services',
          description: 'Expert cloud migration services to help your business transition to the cloud.',
          price: 3500,
          currency: 'USD',
          type: 'service',
          status: 'active',
          featured: false,
          sponsored: false,
          promoted: true,
          images: ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400'],
          createdAt: '2024-01-05',
          views: 1560,
          clicks: 180
        }
      ];

      setBusiness(mockBusiness);
      setAdverts(mockAdverts);
      setSubscriptionStatus(mockBusiness.subscription);
      
    } catch (error) {
      console.error('Error fetching business data:', error);
      toast.error('Failed to load business information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeSubscription = () => {
    setShowUpgradeModal(true);
  };

  const handleSubscribe = async (plan) => {
    try {
      // Mock subscription process - in production, this would integrate with payment gateway
      console.log('Subscribing to plan:', plan);
      toast.success('Subscription upgraded successfully!');
      setShowUpgradeModal(false);
      // Refresh business data
      fetchBusinessData();
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast.error('Failed to upgrade subscription');
    }
  };

  const getAdvertTypeBadge = (advert) => {
    if (advert.featured) {
      return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Featured</span>;
    }
    if (advert.sponsored) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Sponsored</span>;
    }
    if (advert.promoted) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Promoted</span>;
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Standard</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Not Found</h2>
          <p className="text-gray-600 mb-6">The business you're looking for doesn't exist or has been removed.</p>
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 bg-gray-200">
        <img
          src={business.coverImage}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <BackButton 
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border-white/30"
          />
        </div>

        {/* Business Logo */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
            <img
              src={business.logo}
              alt={business.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="page-container pt-20 pb-8">
        {/* Business Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
            <p className="text-gray-600 mb-4">{business.description}</p>
            
            {/* Verification Badge */}
            {business.verification === 'verified' && (
              <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                <FiCheck className="h-4 w-4 mr-1" />
                Verified Business
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(business.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-gray-700 font-medium">{business.rating}</span>
                <span className="ml-1 text-gray-500">({business.reviews} reviews)</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              {business.social.facebook && (
                <a href={business.social.facebook} className="text-blue-600 hover:text-blue-700">
                  <FaFacebook className="h-5 w-5" />
                </a>
              )}
              {business.social.twitter && (
                <a href={business.social.twitter} className="text-blue-400 hover:text-blue-500">
                  <FaTwitter className="h-5 w-5" />
                </a>
              )}
              {business.social.linkedin && (
                <a href={business.social.linkedin} className="text-blue-700 hover:text-blue-800">
                  <FaLinkedin className="h-5 w-5" />
                </a>
              )}
              {business.social.instagram && (
                <a href={business.social.instagram} className="text-pink-600 hover:text-pink-700">
                  <FaInstagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Business Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <FiMapPin className="h-5 w-5 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{business.location.city}, {business.location.country}</p>
            </div>
            <div className="text-center">
              <FiUsers className="h-5 w-5 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{business.employees} employees</p>
            </div>
            <div className="text-center">
              <FiClock className="h-5 w-5 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Founded {business.founded}</p>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Subscription Status</h3>
            {subscriptionStatus.status === 'active' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Active
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FiPackage className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{subscriptionStatus.postsUsed}/{subscriptionStatus.postsLimit}</p>
              <p className="text-sm text-gray-600">Posts Used</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FiTrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{business.stats.totalViews}</p>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FiDollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{business.stats.responseRate}%</p>
              <p className="text-sm text-gray-600">Response Rate</p>
            </div>
          </div>

          {subscriptionStatus.postsUsed >= subscriptionStatus.postsLimit && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <FiPackage className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800">
                  You've reached your post limit. Upgrade your subscription to post more adverts.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleUpgradeSubscription}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upgrade Subscription
          </button>
        </div>

        {/* Active Adverts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Adverts ({adverts.length})</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adverts.map((advert) => (
              <div key={advert.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={advert.images[0]}
                    alt={advert.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {getAdvertTypeBadge(advert)}
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{advert.title}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{advert.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-blue-600">
                      ${advert.price.toLocaleString()}
                    </span>
                    <div className="text-xs text-gray-500">
                      <span>{advert.views} views</span>
                      <span className="mx-1">•</span>
                      <span>{advert.clicks} clicks</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/ads-detail/${advert.slug || advert.id}`}
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {adverts.length === 0 && (
            <div className="text-center py-8">
              <FiPackage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No active adverts yet</p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-3">
                <FiPhone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">{business.contact.phone}</span>
              </div>
              <div className="flex items-center mb-3">
                <FiMail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">{business.contact.email}</span>
              </div>
              <div className="flex items-center">
                <FiGlobe className="h-5 w-5 text-gray-400 mr-3" />
                <a href={business.contact.website} className="text-blue-600 hover:text-blue-700">
                  {business.contact.website}
                </a>
              </div>
            </div>
            
            <div>
              <div className="flex items-start mb-3">
                <FiMapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                <span className="text-gray-700">{business.location.address}</span>
              </div>
              <div className="flex items-start">
                <FiClock className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                <div className="text-gray-700">
                  <p className="font-medium mb-1">Operating Hours</p>
                  <div className="text-sm space-y-1">
                    {Object.entries(business.operatingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize">{day}:</span>
                        <span>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Upgrade Subscription</h3>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Premium Plan</h4>
                    <span className="text-2xl font-bold text-blue-600">$49/mo</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                      5 permanent posts
                    </li>
                    <li className="flex items-center">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                      Featured badge
                    </li>
                    <li className="flex items-center">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                      Analytics dashboard
                    </li>
                    <li className="flex items-center">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                      Priority support
                    </li>
                  </ul>
                  <button
                    onClick={() => handleSubscribe('premium')}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Select Premium
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Enterprise Plan</h4>
                    <span className="text-2xl font-bold text-purple-600">$99/mo</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                      Unlimited permanent posts
                    </li>
                    <li className="flex items-center">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                      Featured & sponsored badges
                    </li>
                    <li className="flex items-center">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                      Dedicated support
                    </li>
                    <li className="flex items-center">
                      <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                      Custom branding
                    </li>
                  </ul>
                  <button
                    onClick={() => handleSubscribe('enterprise')}
                    className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Select Enterprise
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessStorePage;
