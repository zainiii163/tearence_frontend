import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import affiliateService from '../../services/AffiliateService';
import toast from 'react-hot-toast';
import { 
  Grid, 
  List, 
  Search, 
  Heart, 
  Eye, 
  ExternalLink, 
  Share2,
  Star,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Crown,
  Zap,
  TrendingUp,
  Filter,
  Clock,
  Badge
} from 'lucide-react';

const AffiliateGrid = ({ 
  offers, 
  businessOffers,
  userPosts,
  viewMode, 
  setViewMode, 
  sortBy, 
  setSortBy, 
  savedItems, 
  onSaveItem, 
  searchQuery, 
  setSearchQuery,
  contentType,
  trackClick,
  loading,
  onItemClick,
  /** When true, skip hero/search chrome — parent BrowseFilterLayout owns that */
  embedInBrowse = false,
}) => {
  const [displayedContent, setDisplayedContent] = useState(offers);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Sync displayedContent when offers prop changes
  useEffect(() => {
    setDisplayedContent(offers);
  }, [offers]);

  const sortOptions = [
    { label: 'Newest', value: 'newest', icon: Clock },
    { label: 'Most Views', value: 'views', icon: Eye },
    { label: 'Highest Commission', value: 'commission', icon: DollarSign },
    { label: 'Top Rated', value: 'rating', icon: Star }
  ];

  const getBadgeColor = (type) => {
    switch (type) {
      case 'promoted': return 'bg-blue-100 text-blue-800';
      case 'featured': return 'bg-purple-100 text-purple-800';
      case 'sponsored': return 'bg-yellow-100 text-yellow-800';
      default: return '';
    }
  };

  const getBadgeIcon = (type) => {
    switch (type) {
      case 'promoted': return TrendingUp;
      case 'featured': return Crown;
      case 'sponsored': return Zap;
      default: return null;
    }
  };

  const handleOfferClick = async (offer) => {
    try {
      // Filament / paid link ads — open only (no hub trackClick IDs)
      if (offer.contentType === 'link' || String(offer.id || '').startsWith('link-')) {
        const url = offer.tracking_link || offer.affiliate_link;
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      // Track click analytics
      const offerType = offer.contentType === 'user' ? 'user' : 'business';
      const offerId = offer.contentType === 'user' 
        ? offer.id.replace('user-', '')
        : offer.id.replace('business-', '');
      
      if (trackClick) {
        await trackClick(offerType, parseInt(offerId));
      }
      
      // Call custom onItemClick handler if provided
      if (onItemClick) {
        await onItemClick(offerType, parseInt(offerId));
      }
      
      // Open affiliate link in new tab
      if (offer.tracking_link || offer.affiliate_link) {
        window.open(offer.tracking_link || offer.affiliate_link, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error handling offer click:', error);
      // Still open the link even if tracking fails
      if (offer.tracking_link || offer.affiliate_link) {
        window.open(offer.tracking_link || offer.affiliate_link, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleSaveItem = async (offerId) => {
    try {
      if (onSaveItem) {
        await onSaveItem(offerId);
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const AffiliateCard = ({ offer, index }) => {
    const BadgeIcon = getBadgeIcon(offer.promoted ? 'promoted' : offer.featured ? 'featured' : offer.sponsored ? 'sponsored' : null);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        onMouseEnter={() => setHoveredCard(offer.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => handleOfferClick(offer)}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
          {offer.image ? (
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-full object-cover"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.style.display = 'none'; 
                // Show the placeholder sibling
                const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                if (placeholder) placeholder.classList.remove('opacity-0', 'pointer-events-none');
              }}
            />
          ) : null}
          {/* Gradient placeholder - shown when no image or image fails */}
          <div className={`image-placeholder absolute inset-0 flex flex-col items-center justify-center ${
            offer.type === 'business'
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
              : 'bg-gradient-to-br from-purple-500 to-pink-600'
          } ${offer.image ? 'opacity-0 pointer-events-none' : ''}`}>
            <div className="text-white text-5xl font-bold opacity-30 select-none">
              {(offer.title || '?').charAt(0).toUpperCase()}
            </div>
            <div className="text-white text-xs mt-2 opacity-60 px-4 text-center line-clamp-1">
              {offer.category || (offer.type === 'business' ? 'Business' : 'Promoter')}
            </div>
          </div>
          
          {/* Overlay Actions */}
          {hoveredCard === offer.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-2"
            >
              <button
                onClick={() => handleSaveItem(offer.id)}
                className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart className={`h-4 w-4 ${savedItems.includes(offer.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Eye className="h-4 w-4" />
              </button>
              <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {offer.isNew && (
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center animate-pulse">
                <Badge className="h-3 w-3 mr-1" />
                New
              </div>
            )}
            {offer.verified && (
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Verified
              </div>
            )}
            {(offer.promoted || offer.featured || offer.sponsored) && BadgeIcon && (
              <div className={`text-xs px-2 py-1 rounded-full flex items-center ${getBadgeColor(
                offer.promoted ? 'promoted' : offer.featured ? 'featured' : 'sponsored'
              )}`}>
                <BadgeIcon className="h-3 w-3 mr-1" />
                {offer.promoted ? 'Promoted' : offer.featured ? 'Featured' : 'Sponsored'}
              </div>
            )}
          </div>

          {/* Type Badge */}
          <div className="absolute top-2 right-2">
            <div className={`text-xs px-2 py-1 rounded-full ${
              offer.type === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {offer.type === 'business' ? (
                <><Briefcase className="inline h-3 w-3 mr-1" />Business</>
              ) : (
                <><Users className="inline h-3 w-3 mr-1" />Promoter</>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {offer.title}
          </h3>

          {/* Tagline */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {offer.tagline}
          </p>

          {/* Category */}
          <div className="text-xs text-gray-500 mb-3">
            {offer.category}
          </div>

          {/* Key Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-green-600 font-medium">
                <DollarSign className="h-4 w-4 mr-1" />
                {offer.commission}% commission
              </div>
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {offer.country}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-gray-700">{offer.rating}</span>
                <span className="text-gray-500 ml-1">({offer.reviews})</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Eye className="h-4 w-4 mr-1" />
                {offer.views.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              {offer.type === 'business' ? 'View Program' : 'View Link'}
            </button>
            <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const AffiliateListItem = ({ offer, index }) => {
    const BadgeIcon = getBadgeIcon(offer.promoted ? 'promoted' : offer.featured ? 'featured' : offer.sponsored ? 'sponsored' : null);
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4"
      >
        <div className="flex items-start space-x-4">
          {/* Image */}
          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            {offer.image ? (
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
            ) : null}
            <div className={`absolute inset-0 flex items-center justify-center ${
              offer.type === 'business'
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                : 'bg-gradient-to-br from-purple-500 to-pink-600'
            } ${offer.image ? 'opacity-0' : ''}`}>
              <span className="text-white text-2xl font-bold opacity-40 select-none">
                {(offer.title || '?').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -top-1 -right-1">
              <div className={`text-xs px-1.5 py-0.5 rounded-full ${
                offer.type === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {offer.type === 'business' ? 'B' : 'P'}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{offer.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">{offer.tagline}</p>
              </div>
              
              {/* Badges */}
              <div className="flex flex-col space-y-1 ml-4">
                {offer.isNew && (
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    ✓ New
                  </div>
                )}
                {offer.verified && (
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    ✓ Verified
                  </div>
                )}
                {(offer.promoted || offer.featured || offer.sponsored) && BadgeIcon && (
                  <div className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(
                    offer.promoted ? 'promoted' : offer.featured ? 'featured' : 'sponsored'
                  )}`}>
                    {offer.promoted ? 'Promoted' : offer.featured ? 'Featured' : 'Sponsored'}
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <span className="text-green-600 font-medium">
                {offer.commission}% commission
              </span>
              <span>{offer.category}</span>
              <span>{offer.country}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{offer.rating} ({offer.reviews})</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{offer.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2 ml-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              {offer.type === 'business' ? 'View Program' : 'View Link'}
            </button>
            <div className="flex space-x-1">
              <button
                onClick={() => handleSaveItem(offer.id)}
                className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Heart className={`h-4 w-4 ${savedItems.includes(offer.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
              <button className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={embedInBrowse ? 'space-y-4' : 'space-y-6'}>
      {!embedInBrowse && (
        <>
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search affiliate offers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <div className="text-gray-600">
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Loading...
                </span>
              ) : (
                <span>Showing <span className="font-semibold text-gray-900">{offers.length}</span> offers</span>
              )}
            </div>
          </div>
        </>
      )}

      {/* Offers Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-r-transparent" />
        </div>
      ) : offers.length > 0 ? (
        <div className={viewMode === 'grid' ? 
          "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : 
          "space-y-4"
        }>
          {offers.map((offer, index) => 
            viewMode === 'grid' ? (
              <AffiliateCard key={offer.id} offer={offer} index={index} />
            ) : (
              <AffiliateListItem key={offer.id} offer={offer} index={index} />
            )
          )}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-2">No affiliate offers found</h3>
          <p className="text-sm text-gray-600">Try changing your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default AffiliateGrid;
