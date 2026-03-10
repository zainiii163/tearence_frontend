import React, { useState } from 'react';
import { 
  FaHeart, 
  FaEye, 
  FaMapMarkerAlt, 
  FaTag, 
  FaStar, 
  FaCheckCircle,
  FaExpand,
  FaShare,
  FaCrown,
  FaGem,
  FaRocket,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaShieldAlt
} from 'react-icons/fa';

const PremiumAdvertCard = ({ advert, onQuickView, onSave, onShare }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (onSave) onSave(advert);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(advert);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (onShare) onShare(advert);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Sponsored':
        return 'from-yellow-400 to-orange-500';
      case 'Featured':
        return 'from-purple-500 to-pink-500';
      case 'Promoted':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Sponsored':
        return FaCrown;
      case 'Featured':
        return FaGem;
      case 'Promoted':
        return FaRocket;
      default:
        return FaStar;
    }
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(rating) 
                ? 'text-yellow-400' 
                : i < rating 
                ? 'text-yellow-200' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      <div className="absolute top-4 right-4 z-20">
        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 bg-gradient-to-r ${getBadgeColor(advert.badge)} text-white shadow-lg`}>
          {React.createElement(getBadgeIcon(advert.badge), { className: "h-3 w-3" })}
          <span>{advert.badge}</span>
        </div>
      </div>

      {/* Quick Actions (Hover) */}
      <div className={`absolute top-4 left-4 z-20 flex flex-col space-y-2 transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
      }`}>
        <button
          onClick={handleQuickView}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all transform hover:scale-110 shadow-lg"
          title="Quick View"
        >
          <FaExpand className="h-4 w-4 text-gray-700" />
        </button>
        <button
          onClick={handleSave}
          className={`p-2 backdrop-blur-sm rounded-lg transition-all transform hover:scale-110 shadow-lg ${
            isSaved 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
          title={isSaved ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <FaHeart className={`h-4 w-4 ${isSaved ? 'text-white' : ''}`} />
        </button>
        <button
          onClick={handleShare}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all transform hover:scale-110 shadow-lg"
          title="Share"
        >
          <FaShare className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={advert.image}
          alt={advert.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Location Flag (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-10">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <span className="text-lg">{advert.flag}</span>
            <span className="text-sm font-medium text-gray-900">{advert.location}</span>
          </div>
        </div>

        {/* View Count (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-10">
          <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
            <FaEye className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              {advert.views?.toLocaleString() || '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Category */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1 mr-2">
              {advert.title}
            </h3>
            <div className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
              <FaTag className="h-3 w-3" />
              <span>{advert.category}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-purple-600">
            {advert.price}
          </div>
          {advert.originalPrice && (
            <div className="text-sm text-gray-500 line-through">
              {advert.originalPrice}
            </div>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <img
                src={advert.sellerAvatar || `https://ui-avatars.com/api/?name=${advert.seller}&background=random`}
                alt={advert.seller}
                className="h-8 w-8 rounded-full border-2 border-gray-200"
              />
              {advert.verified && (
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="h-2 w-2 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{advert.seller}</div>
              {advert.rating && renderRating(advert.rating)}
            </div>
          </div>
          
          {/* Verification Badge */}
          {advert.verified && (
            <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              <FaShieldAlt className="h-3 w-3" />
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Contact Options */}
        <div className="flex items-center space-x-2 mb-4 text-xs text-gray-500">
          {advert.phone && (
            <div className="flex items-center space-x-1">
              <FaPhone className="h-3 w-3" />
              <span>Phone Available</span>
            </div>
          )}
          {advert.email && (
            <div className="flex items-center space-x-1">
              <FaEnvelope className="h-3 w-3" />
              <span>Email Available</span>
            </div>
          )}
          {advert.website && (
            <div className="flex items-center space-x-1">
              <FaGlobe className="h-3 w-3" />
              <span>Website</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>View Details</span>
            <FaExpand className="h-3 w-3" />
          </button>
          <button
            onClick={handleSave}
            className={`p-2 rounded-xl transition-all transform hover:scale-105 ${
              isSaved 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaHeart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/5 pointer-events-none rounded-2xl" />
      )}
    </div>
  );
};

export default PremiumAdvertCard;
