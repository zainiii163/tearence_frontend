import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Eye, Heart, MessageCircle, User, Briefcase, ExternalLink, Check, Award, Share2, X } from 'lucide-react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import { servicesApi } from '../services/servicesSolutionsApi';
import { formatCountry } from '../utils/apiResponseHelpers';

// Strip HTML tags from strings returned by the backend
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await servicesApi.getService(id);
        const data = response?.data || response;
        setService(data);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton={true} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton={true} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
            <p className="text-gray-600 mb-4">The service you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <button onClick={() => navigate('/services')} className="hover:text-blue-600">
            Services
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                  {service.tagline && (
                    <p className="text-lg text-gray-600">{service.tagline}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(service.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-bold text-gray-900">
                    {typeof service.rating === 'number' ? service.rating.toFixed(1) : parseFloat(service.rating || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-500 ml-2">
                  ({service.review_count || 0} reviews)
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center text-sm text-gray-500 space-x-6">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{service.views || 0} views</span>
                </div>
                {service.enquiries && (
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>{service.enquiries} enquiries</span>
                  </div>
                )}
                {service.orders && (
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    <span>{service.orders} orders</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Media */}
            {service.media && service.media.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Service Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {service.media.map((media, index) => (
                    <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {media.file_path ? (
                        <img
                          src={media.file_path}
                          alt={`Service image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Briefcase className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Service</h2>
              <div
                className="prose prose-blue max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </div>

            {/* What's Included */}
            {service.whats_included && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included</h2>
                <ul className="space-y-3">
                  {Array.isArray(service.whats_included) 
                    ? service.whats_included.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{stripHtml(item)}</span>
                        </li>
                      ))
                    : <li className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{stripHtml(service.whats_included)}</span>
                      </li>
                  }
                </ul>
              </div>
            )}

            {/* What's Not Included */}
            {service.whats_not_included && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What's Not Included</h2>
                <ul className="space-y-3">
                  {Array.isArray(service.whats_not_included) 
                    ? service.whats_not_included.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{stripHtml(item)}</span>
                        </li>
                      ))
                    : <li className="flex items-start">
                        <X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{stripHtml(service.whats_not_included)}</span>
                      </li>
                  }
                </ul>
              </div>
            )}

            {/* Requirements */}
            {service.requirements && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="text-gray-700 prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: service.requirements }} />
              </div>
            )}

            {/* Experience */}
            {service.experience && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Provider Experience</h2>
                <div className="text-gray-700 prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: service.experience }} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mr-3 flex items-center justify-center">
                  {service.serviceProvider?.profile_photo || service.user?.profile_photo ? (
                    <img 
                      src={service.serviceProvider?.profile_photo || service.user?.profile_photo} 
                      alt="Provider" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {service.serviceProvider?.business_name || service.user?.name || 'Provider'}
                  </h3>
                  {service.is_verified && (
                    <div className="flex items-center text-green-600 text-sm">
                      <Award className="w-4 h-4 mr-1" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{formatCountry(service.country)}</span>
                {service.city && <span>, {service.city}</span>}
              </div>

              <button
                onClick={() => {
                  // Contact provider functionality
                }}
                className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Provider
              </button>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${service.starting_price}
                </span>
                <span className="text-gray-500"> / starting from</span>
              </div>

              {service.delivery_time && (
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{service.delivery_time} days delivery</span>
                </div>
              )}

              {service.availability && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Availability</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(service.availability) 
                      ? service.availability.map((avail, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {avail}
                          </span>
                        ))
                      : <span className="text-gray-600">{service.availability}</span>
                    }
                  </div>
                </div>
              )}

              {service.languages && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(service.languages) 
                      ? service.languages.map((lang, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {lang}
                          </span>
                        ))
                      : <span className="text-gray-600">{service.languages}</span>
                    }
                  </div>
                </div>
              )}
            </div>

            {/* Packages */}
            {service.packages && Object.keys(service.packages).length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Packages</h3>
                <div className="space-y-4">
                  {Object.entries(service.packages).map(([key, pkg]) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 capitalize">{pkg.name}</h4>
                        <span className="font-bold text-gray-900">${pkg.price}</span>
                      </div>
                      {pkg.description && (
                        <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                      )}
                      {pkg.delivery_time && (
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{pkg.delivery_time} days</span>
                        </div>
                      )}
                      {pkg.features && pkg.features.length > 0 && (
                        <ul className="text-sm text-gray-600">
                          {pkg.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
