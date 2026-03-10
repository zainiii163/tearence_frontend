import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, MapPin, Star, ExternalLink, User, Shield, TrendingUp } from 'lucide-react';

const PromotedCard = ({ advert, onQuickView, onSave }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(advert.id, !isSaved);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    onQuickView?.(advert);
  };

  const handleViewAdvert = () => {
    window.location.href = `/ads-detail/${advert.id}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleViewAdvert}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative h-48 lg:h-56 overflow-hidden">
        <img
          src={advert.image}
          alt={advert.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Promoted Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <TrendingUp className="w-3 h-3" />
            PROMOTED
          </div>
        </div>

        {/* Country Flag */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-lg shadow-md">
            {advert.countryFlag}
          </div>
        </div>

        {/* Quick Actions (visible on hover) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : 10 
          }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-3 right-3 z-10 flex gap-2"
        >
          <button
            onClick={handleQuickView}
            className="bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-lg hover:bg-white transition-colors shadow-md"
            title="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className={`p-2 rounded-lg transition-all shadow-md ${
              isSaved 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save advert'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </motion.div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-lg text-xs font-semibold shadow-md">
            {advert.category}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {advert.title}
        </h3>

        {/* Price */}
        <div className="text-2xl font-bold text-amber-600 mb-3">
          {advert.price}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span>{advert.location}</span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{advert.seller}</div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-current" />
                <span className="text-xs text-gray-600">{advert.rating}</span>
                {advert.verified && (
                  <Shield className="w-3 h-3 text-blue-500 ml-1" title="Verified seller" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{advert.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{advert.saves.toLocaleString()}</span>
            </div>
          </div>
          {advert.postedTime && (
            <div className="text-xs">
              {advert.postedTime}
            </div>
          )}
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewAdvert}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
        >
          View Advert
          <ExternalLink className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Premium Border Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  );
};

export default PromotedCard;
