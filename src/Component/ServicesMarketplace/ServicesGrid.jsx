import React, { useState } from 'react';
import { Star, Heart, Eye, MapPin, Briefcase, Clock, CheckCircle, ArrowRight, ExternalLink, User } from 'lucide-react';

const ServiceCard = ({ service, onQuickView, onSave, onContact }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (onSave) onSave(service.id, !isSaved);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(service);
  };

  const handleContact = (e) => {
    e.stopPropagation();
    if (onContact) onContact(service);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'promoted':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'featured':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'sponsored':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getCountryFlag = (country) => {
    // Simple flag mapping - you'd want to use a proper flag library
    const flagMap = {
      'US': '🇺🇸',
      'UK': '🇬🇧',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'IN': '🇮🇳',
      'PK': '🇵🇰',
      'AE': '🇦🇪',
      'SA': '🇸🇦'
    };
    return flagMap[country] || '🌍';
  };

  return (
    <div
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {/* Service Image */}
        <div className="absolute inset-0 flex items-center justify-center">
          {service.image ? (
            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-500" />
            </div>
          )}
        </div>

        {/* Badges */}
        {service.badges && service.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {service.badges.map((badge, index) => (
              <span
                key={index}
                className={`px-3 py-1 text-xs font-semibold rounded-full ${getBadgeColor(badge)}`}
              >
                {badge.charAt(0).toUpperCase() + badge.slice(1)}
              </span>
            ))}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Quick View Overlay (appears on hover) */}
        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-2">
            <button
              onClick={handleQuickView}
              className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Quick View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Provider Info */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {service.provider?.photo ? (
              <img src={service.provider.photo} alt={service.provider.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <User className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {service.provider?.name || 'Service Provider'}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{getCountryFlag(service.provider?.country || 'US')}</span>
              <span>{service.provider?.country || 'United States'}</span>
              {service.provider?.verified && (
                <CheckCircle className="w-3 h-3 text-blue-500" />
              )}
            </div>
          </div>
        </div>

        {/* Service Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {service.title}
        </h3>

        {/* Category */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
            {service.category}
          </span>
          {service.deliveryTime && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{service.deliveryTime}</span>
            </div>
          )}
        </div>

        {/* Rating */}
        {service.rating && (
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{service.rating}</span>
            </div>
            {service.reviewCount && (
              <span className="text-xs text-gray-500">({service.reviewCount} reviews)</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${service.startingPrice || 0}
            </span>
            <span className="text-sm text-gray-500 ml-1">Starting from</span>
          </div>
          {service.views && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Eye className="w-3 h-3" />
              <span>{service.views}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleContact}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact
          </button>
          <button
            onClick={handleQuickView}
            className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ServicesGrid = ({ 
  services = [], 
  loading = false, 
  onQuickView, 
  onSave, 
  onContact,
  viewMode = 'grid',
  className = ''
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-5 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
        <p className="text-gray-500">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  const gridClasses = viewMode === 'list' 
    ? 'grid grid-cols-1 gap-6'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';

  return (
    <div className={`${gridClasses} ${className}`}>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onQuickView={onQuickView}
          onSave={onSave}
          onContact={onContact}
        />
      ))}
    </div>
  );
};

export { ServiceCard, ServicesGrid };
