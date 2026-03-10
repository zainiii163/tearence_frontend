import React, { useState } from 'react';
import { 
  Heart, 
  Eye, 
  MapPin, 
  Star, 
  Shield, 
  Phone, 
  Mail, 
  MessageCircle, 
  Share2, 
  ExternalLink,
  Crown,
  Zap,
  Award,
  Search,
  TrendingUp,
  ChevronRight,
  Grid as GridIcon,
  List,
  User,
  Building
} from 'lucide-react';

const FeaturedGrid = ({ 
  adverts, 
  viewMode, 
  savedAdverts, 
  onSaveAdvert, 
  onViewAdvert, 
  onSellerProfileClick, 
  currentPage, 
  setCurrentPage 
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [quickViewAdvert, setQuickViewAdvert] = useState(null);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(adverts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAdverts = adverts.slice(startIndex, startIndex + itemsPerPage);

  const handleSaveAdvert = (advert, e) => {
    e.stopPropagation();
    onSaveAdvert(advert);
  };

  const handleViewAdvert = (advert, e) => {
    e.stopPropagation();
    onViewAdvert(advert);
    setQuickViewAdvert(advert);
  };

  const handleContactSeller = (seller, e) => {
    e.stopPropagation();
    onSellerProfileClick(seller);
  };

  const handleShareAdvert = (advert, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: advert.title,
        text: `Check out this ${advert.badge} ${advert.category}: ${advert.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'Featured':
        return <Star className="h-3 w-3" />;
      case 'Sponsored':
        return <Zap className="h-3 w-3" />;
      case 'Promoted':
        return <Crown className="h-3 w-3" />;
      default:
        return <Award className="h-3 w-3" />;
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Featured':
        return 'bg-purple-500';
      case 'Sponsored':
        return 'bg-yellow-500';
      case 'Promoted':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const AdvertCard = ({ advert, isListView = false }) => {
    const isSaved = savedAdverts.some(saved => saved.id === advert.id);
    const isHovered = hoveredCard === advert.id;

    return (
      <div
        className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
          isListView ? 'flex' : ''
        } ${isHovered ? 'transform scale-[1.02]' : ''}`}
        onMouseEnter={() => setHoveredCard(advert.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => onViewAdvert(advert)}
      >
        {/* Image Section */}
        <div className={`relative ${isListView ? 'w-48 h-48' : 'h-64'} overflow-hidden`}>
          <img
            src={advert.image}
            alt={advert.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay with Actions */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : ''
          }`}>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleSaveAdvert(advert, e)}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isSaved ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => handleShareAdvert(advert, e)}
                  className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-colors backdrop-blur-sm"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={(e) => handleViewAdvert(advert, e)}
                className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-colors backdrop-blur-sm"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-4 left-4">
            <div className={`flex items-center space-x-1 ${getBadgeColor(advert.badge)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
              {getBadgeIcon(advert.badge)}
              <span>{advert.badge}</span>
            </div>
          </div>

          {/* Country Flag */}
          <div className="absolute top-4 right-4">
            <span className="text-2xl">{advert.flag}</span>
          </div>

          {/* Views Count */}
          <div className="absolute bottom-4 right-4">
            <div className="flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
              <Eye className="h-3 w-3" />
              <span>{advert.views.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
          {/* Title and Price */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{advert.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-purple-600">{advert.price}</span>
              {advert.originalPrice && (
                <span className="text-sm text-gray-500 line-through">{advert.originalPrice}</span>
              )}
            </div>
          </div>

          {/* Location and Category */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{advert.location}</span>
            </div>
            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">{advert.category}</span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={advert.seller.avatar}
                alt={advert.seller.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{advert.seller.name}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span>{advert.seller.rating}</span>
                  </div>
                  {advert.seller.verified && (
                    <Shield className="h-3 w-3 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{advert.description}</p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => handleContactSeller(advert.seller, e)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Contact</span>
            </button>
            <button
              onClick={(e) => handleViewAdvert(advert, e)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>

          {/* Additional Info (Hover) */}
          {isHovered && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Posted {advert.postedDate}</span>
                <span>{advert.seller.responseRate} response rate</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Adverts
            <span className="text-lg font-normal text-gray-600 ml-2">
              ({adverts.length} results)
            </span>
          </h2>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Adverts Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {paginatedAdverts.map(advert => (
          <AdvertCard 
            key={advert.id} 
            advert={advert} 
            isListView={viewMode === 'list'}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {adverts.length === 0 && (
        <div className="text-center py-12">
          <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No featured adverts found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedGrid;
