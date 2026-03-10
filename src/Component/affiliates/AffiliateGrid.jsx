import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Clock
} from 'lucide-react';

const AffiliateGrid = ({ 
  offers, 
  viewMode, 
  setViewMode, 
  sortBy, 
  setSortBy, 
  savedItems, 
  onSaveItem, 
  searchQuery, 
  setSearchQuery 
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);

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
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={offer.image}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Actions */}
          {hoveredCard === offer.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center space-x-2"
            >
              <button
                onClick={() => onSaveItem(offer.id)}
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
          <div className="relative w-24 h-24 flex-shrink-0">
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-full object-cover rounded-lg"
            />
            
            {/* Type Badge */}
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
                onClick={() => onSaveItem(offer.id)}
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
    <div className="space-y-6">
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
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
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
          Showing <span className="font-semibold text-gray-900">{offers.length}</span> offers
        </div>
      </div>

      {/* Offers Grid/List */}
      {offers.length > 0 ? (
        <div className={viewMode === 'grid' ? 
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
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
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No offers found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default AffiliateGrid;
