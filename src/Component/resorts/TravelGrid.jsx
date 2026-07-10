import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Eye, 
  MapPin, 
  Phone, 
  Car,
  Hotel,
  Compass,
  CheckCircle,
} from 'lucide-react';
import { getTravelImageUrl, getTravelLogoUrl } from '../../utils/travelFormHelpers';

const TravelGrid = ({ adverts, viewMode, onSaveAdvert, savedAdverts, onBusinessProfile }) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [brokenImages, setBrokenImages] = useState({});

  const getPromotionBadge = (tier) => {
    const badges = {
      promoted: { text: 'Promoted', color: 'from-blue-500 to-blue-600' },
      featured: { text: 'Featured', color: 'from-purple-500 to-purple-600' },
      sponsored: { text: 'Sponsored', color: 'from-orange-500 to-orange-600' },
      network_wide: { text: 'Network Wide', color: 'from-red-500 to-red-600' },
      standard: { text: '', color: '' }
    };
    return badges[tier] || badges.standard;
  };

  const getTypeIcon = (type) => {
    const icons = {
      accommodation: <Hotel className="w-4 h-4" />,
      transport: <Car className="w-4 h-4" />,
      experience: <Compass className="w-4 h-4" />
    };
    return icons[type] || <Hotel className="w-4 h-4" />;
  };

  const getDisplayPrice = (advert) => {
    if (advert.price_per_night) return { amount: advert.price_per_night, label: '/night' };
    if (advert.price_per_trip) return { amount: advert.price_per_trip, label: '/trip' };
    if (advert.price_per_service) return { amount: advert.price_per_service, label: '/service' };
    return null;
  };

  const getImage = (advert) => advert.display_image_url || getTravelImageUrl(advert);
  const getLogo = (advert) => advert.logo_url || getTravelLogoUrl(advert);
  const getLocation = (advert) => [advert.city, advert.country].filter(Boolean).join(', ') || 'Location not specified';
  const getAmenities = (advert) => Array.isArray(advert.amenities) ? advert.amenities : [];

  const handleCardClick = (advert) => {
    if (advert?.slug) {
      navigate(`/resorts-travel/${advert.slug}`);
    }
  };

  const handleSaveToggle = (advertId, e) => {
    e.stopPropagation();
    onSaveAdvert(advertId);
  };

  const handleBusinessClick = (advert, e) => {
    e.stopPropagation();
    onBusinessProfile({
      name: advert.business_name,
      logo: getLogo(advert),
      verified: advert.verified_business,
      phone: advert.phone_number,
      email: advert.email,
      website: advert.website,
    });
  };

  if (!Array.isArray(adverts) || adverts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">
          <Hotel />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No travel services found</h3>
        <p className="text-gray-600">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
      "space-y-4"
    }>
      {adverts.map((advert, index) => {
        const promotionBadge = getPromotionBadge(advert.promotion_tier);
        const isSaved = savedAdverts.has(advert.id);
        const displayPrice = getDisplayPrice(advert);
        const amenities = getAmenities(advert);
        const maxAmenities = viewMode === 'list' ? 4 : 3;
        
        return (
          <motion.div
            key={advert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredCard(advert.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardClick(advert)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(advert);
              }
            }}
            role="button"
            tabIndex={0}
            className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            {/* Image Container */}
            <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200`}>
              {!brokenImages[advert.id] && getImage(advert) ? (
                <img
                  src={getImage(advert)}
                  alt={advert.title}
                  className="w-full h-full object-cover"
                  onError={() => setBrokenImages((prev) => ({ ...prev, [advert.id]: true }))}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Hotel className="w-12 h-12 text-slate-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {promotionBadge.text && (
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${promotionBadge.color}`}>
                    {promotionBadge.text}
                  </span>
                </div>
              )}

              {advert.verified_business && (
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleSaveToggle(advert.id, e)}
                className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isSaved ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </motion.button>

              {hoveredCard === advert.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-3 left-3 flex space-x-2"
                >
                  {advert.phone_number && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${advert.phone_number}`; }}
                      className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-white"
                    >
                      <Phone className="w-5 h-5" />
                    </motion.button>
                  )}
                </motion.div>
              )}

              <div className="absolute bottom-3 left-3">
                <div className="flex items-center space-x-1 text-white text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{getLocation(advert)}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                    {getTypeIcon(advert.advert_type)}
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{advert.advert_type}</span>
                </div>
                {advert.currency && displayPrice && (
                  <span className="text-xs text-gray-400">{advert.currency}</span>
                )}
              </div>

              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{advert.title}</h3>

              {advert.tagline && (
                <p className="text-sm text-blue-600 mb-1 line-clamp-1 italic">{advert.tagline}</p>
              )}

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {advert.description || advert.overview}
              </p>

              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {amenities.slice(0, maxAmenities).map((amenity, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                  {amenities.length > maxAmenities && (
                    <span className="text-xs text-gray-500">+{amenities.length - maxAmenities}</span>
                  )}
                </div>
              )}

              {advert.business_name && (
                <div
                  className="flex items-center space-x-2 mb-3 cursor-pointer group"
                  onClick={(e) => handleBusinessClick(advert, e)}
                >
                  {getLogo(advert) ? (
                    <img
                      src={getLogo(advert)}
                      alt={advert.business_name}
                      className="w-6 h-6 rounded-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : null}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {advert.business_name}
                    </div>
                  </div>
                  {advert.verified_business && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  {displayPrice ? (
                    <div className="text-xl font-bold text-gray-900">
                      {advert.currency || '$'}{Number(displayPrice.amount).toFixed(0)}
                      <span className="text-sm text-gray-500 font-normal">{displayPrice.label}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Contact for pricing</span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-gray-400 text-xs">
                  <Eye className="w-4 h-4" />
                  <span>View details</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TravelGrid;
