import React, { useState } from 'react';
import { Star, MapPin, Clock, Eye, Heart, MessageCircle, User, Briefcase, ExternalLink } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { formatCountry } from '../../utils/apiResponseHelpers';

const ServicesGrid = ({ services, loading }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [contactingService, setContactingService] = useState(null);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
      'China': '🇨🇳',
      'Mexico': '🇲🇽',
      'Netherlands': '🇳🇱',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Belgium': '🇧🇪',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'New Zealand': '🇳🇿',
      'Singapore': '🇸🇬',
      'UAE': '🇦🇪',
      'South Africa': '🇿🇦',
      'Russia': '🇷🇺',
      'Turkey': '🇹🇷',
      'Poland': '🇵🇱',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Colombia': '🇨🇴',
      'Peru': '🇵🇪',
      'Venezuela': '🇻🇪',
      'Egypt': '🇪🇬',
      'Nigeria': '🇳🇬',
      'Kenya': '🇰🇪',
      'Morocco': '🇲🇦',
      'South Korea': '🇰🇷',
      'Thailand': '🇹🇭',
      'Malaysia': '🇲🇾',
      'Indonesia': '🇮🇩',
      'Philippines': '🇵🇭',
      'Vietnam': '🇻🇳',
      'Pakistan': '🇵🇰',
      'Bangladesh': '🇧🇩',
      'Saudi Arabia': '🇸🇦',
      'Israel': '🇮🇱',
      'Greece': '🇬🇷',
      'Portugal': '🇵🇹',
      'Ireland': '🇮🇪',
      'Czech Republic': '🇨🇿',
      'Hungary': '🇭🇺',
      'Romania': '🇷🇴',
      'Ukraine': '🇺🇦',
      'Belarus': '🇧🇾',
      'Croatia': '🇭🇷',
      'Serbia': '🇷🇸',
      'Bulgaria': '🇧🇬',
      'Slovakia': '🇸🇰',
      'Slovenia': '🇸🇮',
      'Estonia': '🇪🇪',
      'Latvia': '🇱🇻',
      'Lithuania': '🇱🇹',
      'Luxembourg': '🇱🇺',
      'Malta': '🇲🇹',
      'Cyprus': '🇨🇾',
      'Iceland': '🇮🇸'
    };
    return flags[countryName] || '🌍';
  };

  const handleQuickView = (service) => {
    setSelectedService(service);
    setShowQuickView(true);
  };

  const handleCloseQuickView = () => {
    setShowQuickView(false);
    setSelectedService(null);
  };

  const handleContactProvider = async (serviceId) => {
    if (!user) {
      alert('Please login to contact providers');
      return;
    }

    setContactingService(serviceId);
    try {
      // This would integrate with your backend contact endpoint
      // await dispatch(contactProvider(serviceId, contactData));
      alert('Contact request sent successfully!');
    } catch (error) {
      console.error('Error contacting provider:', error);
      alert('Failed to send contact request. Please try again.');
    } finally {
      setContactingService(null);
    }
  };

  const handleViewService = (serviceId) => {
    // Navigate to service detail page
    window.location.href = `/services/${serviceId}`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => {
          return (
            <div key={service.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              {/* Service Image */}
              <div className="relative h-52 bg-gray-100 overflow-hidden">
                {service.media?.find(m => m.is_thumbnail)?.file_path ? (
                  <img
                    src={service.media.find(m => m.is_thumbnail).file_path}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex items-center justify-center">
                    <Briefcase className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                
                {/* Promotion Badge */}
                {service.promotion_type && service.promotion_type !== 'standard' && (
                  <div className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full shadow-lg ${
                    service.promotion_type === 'featured' ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white' :
                    service.promotion_type === 'sponsored' ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white' :
                    service.promotion_type === 'network_boost' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' :
                    'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  }`}>
                    {service.promotion_type === 'network_boost' ? 'NETWORK' : 
                     service.promotion_type.charAt(0).toUpperCase() + service.promotion_type.slice(1)}
                  </div>
                )}
                
                {/* Verified Badge */}
                {service.is_verified && (
                  <div className="absolute top-3 right-3 bg-green-600 text-white p-2 rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleQuickView(service)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleViewService(service.id)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-5">
                {/* Provider Info */}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mr-3 flex items-center justify-center shadow-md">
                    {service.serviceProvider?.profile_photo || service.user?.profile_photo ? (
                      <img 
                        src={service.serviceProvider?.profile_photo || service.user?.profile_photo} 
                        alt="Provider" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {service.serviceProvider?.business_name || service.user?.name || 'Provider'}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-1">{getCountryFlag(service.country)}</span>
                      <span className="truncate">{formatCountry(service.country)}</span>
                    </div>
                  </div>
                  
                  {/* Save/Favorite Button */}
                  <button
                    onClick={() => {
                      // Toggle favorite functionality
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                {/* Service Title */}
                <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors text-lg leading-tight">
                  {service.title}
                </h3>

                {/* Service Tagline */}
                {service.tagline && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.tagline}</p>
                )}

                {/* Rating and Reviews */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(service.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : i < Math.ceil(service.rating || 0)
                            ? 'text-yellow-400 fill-current opacity-50'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-bold text-gray-900">
                      {typeof service.rating === 'number' ? service.rating.toFixed(1) : parseFloat(service.rating || 0).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    ({service.review_count || 0} reviews)
                  </span>
                </div>

                {/* Skills/Tags */}
                {service.skills && service.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {service.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {service.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{service.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Price and Delivery */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${service.starting_price}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">/from</span>
                  </div>
                  {service.delivery_time && (
                    <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3 mr-1" />
                      {service.delivery_time} days
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Eye className="w-3 h-3 mr-1" />
                  <span className="mr-3">{service.views || 0} views</span>
                  {service.enquiries && (
                    <>
                      <MessageCircle className="w-3 h-3 mr-1" />
                      <span>{service.enquiries} enquiries</span>
                    </>
                  )}
                  {service.orders && (
                    <>
                      <Briefcase className="w-3 h-3 ml-3 mr-1" />
                      <span>{service.orders} orders</span>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewService(service.id)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
                  >
                    View Service
                  </button>
                  
                  <button
                    onClick={() => handleQuickView(service)}
                    className="px-4 py-3 border border-gray-300 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      {showQuickView && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Service Quick View</h3>
                <button
                  onClick={handleCloseQuickView}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Images */}
                  <div>
                    <div className="h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                      {selectedService.media?.find(m => m.is_thumbnail)?.file_path ? (
                        <img
                          src={selectedService.media.find(m => m.is_thumbnail).file_path}
                          alt={selectedService.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <Briefcase className="w-16 h-16 text-blue-600" />
                        </div>
                      )}
                    </div>
                    
                    {/* Additional Images */}
                    {selectedService.media && selectedService.media.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {selectedService.media.slice(0, 4).map((media, index) => (
                          <div key={index} className="h-16 bg-gray-100 rounded overflow-hidden">
                            {media.file_path ? (
                              <img
                                src={media.file_path}
                                alt={`Service image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column - Details */}
                  <div>
                    {/* Provider Info */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {selectedService.serviceProvider?.business_name || selectedService.user?.name}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{getCountryFlag(selectedService.country)}</span>
                          <span className="ml-1">{formatCountry(selectedService.country)}</span>
                          {selectedService.is_verified && (
                            <span className="ml-2 text-green-600">✓ Verified</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Service Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedService.title}</h2>
                    
                    {/* Tagline */}
                    {selectedService.tagline && (
                      <p className="text-gray-600 mb-4">{selectedService.tagline}</p>
                    )}

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="ml-1 font-semibold text-gray-900">
                          {typeof selectedService.rating === 'number' ? selectedService.rating.toFixed(1) : parseFloat(selectedService.rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-500 ml-2">
                        ({selectedService.review_count || 0} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ${selectedService.starting_price}
                      </span>
                      <span className="text-gray-500"> / starting from</span>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600">{selectedService.description}</p>
                    </div>

                    {/* What's Included */}
                    {selectedService.whats_included && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">What's Included</h4>
                        <ul className="text-sm text-gray-600">
                          {Array.isArray(selectedService.whats_included) 
                            ? selectedService.whats_included.map((item, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-green-500 mr-2">✓</span>
                                  {item}
                                </li>
                              ))
                            : <li>{selectedService.whats_included}</li>
                          }
                        </ul>
                      </div>
                    )}

                    {/* Delivery Time */}
                    {selectedService.delivery_time && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Delivery Time</h4>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {selectedService.delivery_time} days
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={() => handleContactProvider(selectedService.id)}
                        disabled={contactingService === selectedService.id}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {contactingService === selectedService.id ? 'Sending...' : 'Contact Provider'}
                      </button>
                      
                      <button
                        onClick={() => handleViewService(selectedService.id)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        View Full Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesGrid;
