import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Share2,
  Eye,
  MapPin,
  BedDouble,
  Bath,
  Square,
  Car,
  Star,
  Phone,
  Mail,
  Globe,
  Calendar,
  DollarSign,
  Building,
  Home,
  Flag,
  ExternalLink,
  Check,
  Award,
  TrendingUp,
  Zap,
  User,
  MessageCircle,
  X
} from 'lucide-react';
import propertyApi from '../../services/propertyApi';

const PropertyCard = ({
  property,
  onView,
  onSave,
  isSaved,
  viewMode = 'grid'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    onSave(property.id);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description || property.overview,
        url: window.location.href + `/property/${property.id}`
      });
    }
  };

  const handleContact = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const response = await propertyApi.contactAgent(property.id);
      console.log('Contact response:', response);
      const contactData = response.data?.data?.contact_info || response.data?.contact_info || response.contact_info;
      setContactInfo(contactData);
      setShowContactModal(true);
    } catch (error) {
      console.error('Error contacting agent:', error);
      alert('Failed to load contact information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'Promoted': 'bg-blue-500',
      'Featured': 'bg-purple-500',
      'Sponsored': 'bg-green-500',
      'Urgent': 'bg-red-500',
      'New': 'bg-yellow-500',
      'Hot': 'bg-orange-500',
      'Standard': 'bg-gray-500'
    };
    return colors[badge] || 'bg-gray-500';
  };

  const formatPrice = (price, currency = 'USD') => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'د.إ'
    };
    const symbol = symbols[currency] || currency;
    
    if (price >= 1000000) {
      return `${symbol}${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${symbol}${(price / 1000).toFixed(0)}K`;
    }
    return `${symbol}${price}`;
  };

  const getBadges = (property) => {
    const badges = [];
    
    if (property.is_sponsored) {
      badges.push('Sponsored');
    } else if (property.is_featured) {
      badges.push('Featured');
    } else if (property.is_promoted) {
      badges.push('Promoted');
    } else {
      badges.push('Standard');
    }
    
    // Add other badges based on data
    if (property.views_count > 1000) {
      badges.push('Hot');
    }
    
    const createdDate = new Date(property.created_at);
    const daysSinceCreated = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
    if (daysSinceCreated <= 7) {
      badges.push('New');
    }
    
    return badges;
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        onClick={() => onView(property)}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-48 flex-shrink-0">
            {property.cover_image ? (
              <img 
                src={property.cover_image.startsWith('http') ? property.cover_image : `/storage/${property.cover_image}`}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{ display: property.cover_image ? 'none' : 'flex' }}>
              <Building className="w-8 h-8 text-gray-400" />
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {getBadges(property).slice(0, 2).map((badge, index) => (
                <span
                  key={index}
                  className={`${getBadgeColor(badge)} text-white text-xs px-2 py-1 rounded-full`}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="absolute top-2 right-2 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>

            {/* View Count */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
              <Eye className="w-3 h-3" />
              {property.views_count || property.views || 0}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{property.description || property.overview}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{formatPrice(property.price, property.currency)}</div>
                <div className="text-sm text-gray-500">{property.category}</div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4" />
              <span>{property.city}</span>
              {property.country && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{property.country}</span>
                </>
              )}
            </div>

            {/* Specifications */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              {(property.bedrooms !== undefined && property.bedrooms !== null) && (
                <div className="flex items-center gap-1">
                  <BedDouble className="w-4 h-4" />
                  <span>{property.bedrooms} beds</span>
                </div>
              )}
              {(property.bathrooms !== undefined && property.bathrooms !== null) && (
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{property.bathrooms} baths</span>
                </div>
              )}
              {property.property_size && (
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4" />
                  <span>{property.formatted_size || `${property.property_size} sq ft`}</span>
                </div>
              )}
              {(property.parking_spaces > 0 || property.specifications?.parking) && (
                <div className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  <span>Parking</span>
                </div>
              )}
            </div>

            {/* Agent Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {property.seller_logo ? (
                    <img src={property.seller_logo} alt="Seller" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{property.seller_name}</div>
                  {(property.verified_agent || property.user?.verified) && (
                    <div className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Verified Agent
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={handleContact}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={() => onView(property)}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {property.cover_image ? (
          <img 
            src={property.cover_image.startsWith('http') ? property.cover_image : `/storage/${property.cover_image}`}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{ display: property.cover_image ? 'none' : 'flex' }}>
          <Building className="w-12 h-12 text-gray-400" />
        </div>
        
        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
        >
          <div className="text-white">
            <div className="text-sm font-medium mb-1">Quick View</div>
            <div className="text-xs opacity-90">Click to see full details</div>
          </div>
        </motion.div>

        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={handleSave}
            className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* View Count */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
          <Eye className="w-3 h-3" />
          {property.views_count || property.views || 0}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price and Category */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{formatPrice(property.price, property.currency)}</div>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{property.category}</span>
          </div>
          {property.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-gray-900">{property.rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{property.description || property.overview}</p>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{property.city}</span>
          {property.country && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{property.country}</span>
            </>
          )}
        </div>

        {/* Specifications */}
        {((property.bedrooms !== undefined && property.bedrooms !== null) || 
          (property.bathrooms !== undefined && property.bathrooms !== null) || 
          property.property_size) && (
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
            {(property.bedrooms !== undefined && property.bedrooms !== null) && (
              <div className="flex items-center gap-1">
                <BedDouble className="w-4 h-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {(property.bathrooms !== undefined && property.bathrooms !== null) && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.property_size && (
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span>{property.formatted_size || `${property.property_size} sq ft`}</span>
              </div>
            )}
          </div>
        )}

        {/* Agent Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              {property.seller_logo ? (
                <img src={property.seller_logo} alt="Seller" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-3 h-3 text-gray-400" />
              )}
            </div>
            <span className="text-sm text-gray-700">{property.seller_name}</span>
            {(property.verified_agent || property.user?.verified) && (
              <Check className="w-3 h-3 text-green-500" />
            )}
          </div>

          <button
            onClick={handleContact}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={() => setShowContactModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {contactInfo?.agent_name && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Agent Name</p>
                  <p className="text-sm font-medium text-gray-900">{contactInfo.agent_name}</p>
                </div>
              )}
              {contactInfo?.agent_email && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Agent Email</p>
                    <a href={`mailto:${contactInfo.agent_email}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {contactInfo.agent_email}
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.agent_phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Agent Phone</p>
                    <a href={`tel:${contactInfo.agent_phone}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {contactInfo.agent_phone}
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.agency_name && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Agency</p>
                  <p className="text-sm font-medium text-gray-900">{contactInfo.agency_name}</p>
                </div>
              )}
              {contactInfo?.agency_email && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Agency Email</p>
                    <a href={`mailto:${contactInfo.agency_email}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {contactInfo.agency_email}
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.agency_phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Agency Phone</p>
                    <a href={`tel:${contactInfo.agency_phone}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {contactInfo.agency_phone}
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.whatsapp && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.owner_email && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Owner Email</p>
                    <a href={`mailto:${contactInfo.owner_email}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {contactInfo.owner_email}
                    </a>
                  </div>
                </div>
              )}
              {contactInfo?.owner_phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Owner Phone</p>
                    <a href={`tel:${contactInfo.owner_phone}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {contactInfo.owner_phone}
                    </a>
                  </div>
                </div>
              )}
              {!contactInfo?.agent_email && !contactInfo?.agent_phone && !contactInfo?.agency_email && !contactInfo?.agency_phone && !contactInfo?.whatsapp && !contactInfo?.owner_email && !contactInfo?.owner_phone && (
                <p className="text-sm text-gray-500 text-center py-4">No contact information available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const PropertyGrid = ({ 
  properties, 
  viewMode, 
  onView, 
  onSave, 
  savedProperties 
}) => {
  return (
    <div className={
      viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
        : 'space-y-4'
    }>
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onView={onView}
          onSave={onSave}
          isSaved={savedProperties && savedProperties.includes ? savedProperties.includes(property.id) : false}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;
