import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiHeart, FiShare2, FiMapPin, FiEye, FiMessageCircle, 
  FiStar, FiDollarSign, FiTag, FiCalendar, FiUser,
  FiCheckCircle, FiTrendingUp, FiZap
} from 'react-icons/fi';
import { buysellAPI } from '../../api/buysell';

const BuySellGrid = ({ adverts, loading, viewMode }) => {
  const [savedItems, setSavedItems] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);

  // Handle different data structures: array or object with items
  const advertsArray = Array.isArray(adverts) ? adverts : adverts?.items || [];

  // Get first image from images object or array
  const getFirstImage = (advert) => {
    if (!advert.images) {
      console.log('[BuySellGrid] No images field, using fallback');
      return null;
    }

    console.log('[BuySellGrid] Images data structure:', typeof advert.images, Array.isArray(advert.images), advert.images);

    let imageUrl = null;

    // If images is an object, get the first value that looks like a URL
    if (typeof advert.images === 'object' && !Array.isArray(advert.images)) {
      const imageKeys = Object.keys(advert.images);
      console.log('[BuySellGrid] Image object keys:', imageKeys);
      for (const key of imageKeys) {
        const value = advert.images[key];
        console.log('[BuySellGrid] Checking image value:', key, '=', value);
        // Check if value is a valid URL (starts with http/https or is a valid path)
        if (value && (typeof value === 'string') && (value.startsWith('http') || value.startsWith('/'))) {
          imageUrl = value;
          console.log('[BuySellGrid] Valid image URL from object:', imageUrl);
          break;
        }
      }
    }
    // If images is an array, get the first item that looks like a URL
    else if (Array.isArray(advert.images) && advert.images.length > 0) {
      console.log('[BuySellGrid] Image array length:', advert.images.length);
      for (const img of advert.images) {
        // Handle both string URLs and objects with url property
        const url = typeof img === 'string' ? img : img?.url;
        console.log('[BuySellGrid] Checking array item:', img, '-> url:', url);
        if (url && (url.startsWith('http') || url.startsWith('/'))) {
          imageUrl = url;
          console.log('[BuySellGrid] Valid image URL from array:', imageUrl);
          break;
        }
      }
    }

    if (!imageUrl) {
      console.log('[BuySellGrid] No valid image URL found, using fallback image');
    }

    return imageUrl;
  };

  const handleSaveItem = async (itemId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (savedItems.has(itemId)) {
        await buysellAPI.unsaveAdvert(itemId);
        setSavedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      } else {
        await buysellAPI.saveAdvert(itemId);
        setSavedItems(prev => {
          const newSet = new Set(prev);
          newSet.add(itemId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
      // Error is handled by API service with toast notifications
    }
  };

  const handleShareItem = (itemId, e) => {
    e.preventDefault();
    e.stopPropagation();
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Check out this item',
        url: `${window.location.origin}/item/${itemId}`
      });
    }
  };

  const handleItemClick = async (advert) => {
    // Track view when item is clicked
    try {
      await buysellAPI.trackView(advert.id);
    } catch (error) {
      // Silent fail for view tracking
      console.error('Error tracking view:', error);
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'promoted': return 'bg-blue-500';
      case 'featured': return 'bg-purple-500';
      case 'sponsored': return 'bg-orange-500';
      case 'new': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPrice = (price, currency = 'USD') => {
    if (price === 0) return 'FREE';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const AdvertCard = ({ advert, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setHoveredCard(advert.id)}
      onHoverEnd={() => setHoveredCard(null)}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* Image Container */}
      <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'h-48'} overflow-hidden bg-gray-100`}>
        <img
          src={getFirstImage(advert) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
          alt={advert.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {advert.promoted && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Promoted
            </span>
          )}
          {advert.featured && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Featured
            </span>
          )}
          {advert.sponsored && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Sponsored
            </span>
          )}
          {advert.itemType === 'give_away' && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <FiZap className="h-3 w-3" />
              FREE
            </span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <AnimatePresence>
          {hoveredCard === advert.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
            >
              <button
                onClick={(e) => handleSaveItem(advert.id, e)}
                className={`p-2 rounded-full ${
                  savedItems.has(advert.id) ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
                } transition-colors`}
              >
                <FiHeart className="h-4 w-4" fill={savedItems.has(advert.id) ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={(e) => handleShareItem(advert.id, e)}
                className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiShare2 className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        {/* Title */}
        <Link to={`/item/${advert.id}`} className="block">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {advert.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-green-600">
            {formatPrice(advert.price, advert.currency)}
          </span>
          {advert.originalPrice && advert.originalPrice > advert.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(advert.originalPrice, advert.currency)}
            </span>
          )}
        </div>

        {/* Meta Info */}
        <div className="space-y-2 text-sm text-gray-600">
          {/* Condition */}
          <div className="flex items-center gap-2">
            <FiTag className="h-4 w-4" />
            <span className="capitalize">{advert.condition?.replace('_', ' ') || 'Not specified'}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <FiMapPin className="h-4 w-4" />
            <span>{advert.location || advert.city}</span>
            {advert.distance && (
              <span className="text-green-600 font-medium">({advert.distance} km)</span>
            )}
          </div>

          {/* Brand/Model */}
          {(advert.brand || advert.model) && (
            <div className="flex items-center gap-2">
              <span className="font-medium">{advert.brand}</span>
              {advert.model && <span>• {advert.model}</span>}
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <FiEye className="h-3 w-3" />
              <span>{advert.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiHeart className="h-3 w-3" />
              <span>{advert.likes || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="h-3 w-3" />
            <span>{formatDate(advert.created_at || advert.createdAt)}</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img
              src={advert.seller?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
              alt={advert.seller?.name || advert.seller_name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">{advert.seller?.name || advert.seller_name}</div>
              <div className="flex items-center gap-1">
                <FiStar className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">{advert.seller?.rating || '0.0'}</span>
                {(advert.seller?.verified || advert.verified_seller) && (
                  <FiCheckCircle className="h-3 w-3 text-green-500" />
                )}
              </div>
            </div>
          </div>

          {/* Contact Button */}
          <Link
            to={`/item/${advert.id}#contact`}
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Contact
          </Link>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="grid gap-6 animate-pulse">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            <div className={`w-full h-48 bg-gray-200 ${viewMode === 'list' ? 'w-48' : ''}`} />
            <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2 w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
        : 'grid-cols-1'
    }`}>
      {advertsArray.length > 0 ? (
        advertsArray.map((advert, index) => (
          <AdvertCard key={advert.id} advert={advert} index={index} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No items found</div>
          <p className="text-gray-400 text-sm">
            Try adjusting your filters or check back later for new listings.
          </p>
        </div>
      )}
    </div>
  );
};

export default BuySellGrid;
