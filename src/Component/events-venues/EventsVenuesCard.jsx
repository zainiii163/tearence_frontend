import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Users, DollarSign, Star, Heart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getEventsVenuesImageUrl } from '../../utils/eventsVenuesImages';

const EventsVenuesCard = ({ advert, onSave, isSaved, featured = false }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(() => getEventsVenuesImageUrl(advert));

  useEffect(() => {
    setImageSrc(getEventsVenuesImageUrl(advert));
  }, [advert?.id, advert?.main_image, advert?.images, advert?.image]);

  const handleCardClick = () => {
    navigate(`/events-venues/${advert.slug}`);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    onSave?.(advert.id);
  };

  const getBadgeColor = (tier) => {
    switch (tier) {
      case 'sponsored':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'featured':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'promoted':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'network_boost':
        return 'bg-gradient-to-r from-green-500 to-teal-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getBadgeText = (tier) => {
    switch (tier) {
      case 'sponsored':
        return 'Sponsored';
      case 'featured':
        return 'Featured';
      case 'promoted':
        return 'Promoted';
      case 'network_boost':
        return 'Network Boost';
      default:
        return '';
    }
  };

  const isFeatured = featured || advert.featured || advert.is_featured;
  const imageH = isFeatured ? 'h-52 sm:h-56' : 'h-36 sm:h-40';

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group ${
        isFeatured ? 'ring-1 ring-purple-200' : ''
      }`}
    >
      <div className={`relative ${imageH} overflow-hidden bg-gray-200`}>
        <img
          src={imageSrc}
          alt={advert.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() =>
            setImageSrc(
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
            )
          }
        />
        
        {(advert.promotion_tier && advert.promotion_tier !== 'basic') || isFeatured ? (
          <div className={`absolute top-3 left-3 ${getBadgeColor(advert.promotion_tier || 'featured')} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
            {getBadgeText(advert.promotion_tier) || 'Featured'}
          </div>
        ) : null}

        {advert.is_verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full">
            <Star className="h-4 w-4 fill-current" />
          </div>
        )}

        {typeof onSave === 'function' && (
          <button
            onClick={handleSaveClick}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        )}

        {advert.views_count != null && (
          <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
            {advert.views_count} views
          </div>
        )}
      </div>

      <div className={isFeatured ? 'p-4' : 'p-3'}>
        <h3 className={`font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors ${
          isFeatured ? 'text-lg' : 'text-sm sm:text-base'
        }`}>
          {advert.title}
        </h3>

        {advert.tagline && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-1">{advert.tagline}</p>
        )}

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          <span className="truncate">{[advert.city, advert.country].filter(Boolean).join(', ')}</span>
        </div>

        {/* Event-specific info */}
        {advert.advert_type === 'event' && advert.event_date && (
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
            <span>{new Date(advert.event_date).toLocaleDateString()}</span>
          </div>
        )}

        {/* Venue-specific info */}
        {advert.advert_type === 'venue' && advert.capacity && (
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Users className="h-4 w-4 mr-1 text-gray-400" />
            <span>Capacity: {advert.capacity}</span>
          </div>
        )}

        {/* Price */}
        {advert.advert_type === 'event' && (
          <div className="flex items-center text-sm font-semibold text-purple-600 mb-2">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>
              {advert.free_event ? 'Free' : `${advert.ticket_currency} ${parseFloat(advert.ticket_price).toFixed(2)}`}
            </span>
          </div>
        )}

        {advert.advert_type === 'venue' && advert.price_range && (
          <div className="flex items-center text-sm font-semibold text-purple-600 mb-2">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>{advert.price_range}</span>
          </div>
        )}

        {/* Category */}
        {advert.category && (
          <div className="text-xs text-gray-500 mb-3">
            {advert.category.name}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            {advert.contact_name}
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default EventsVenuesCard;
