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

const STORAGE_URL = process.env.REACT_APP_STORAGE_URL || 'https://api.worldwideadverts.info/storage';

const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/600x400?text=No+Image';
  if (path.startsWith('http')) return path;
  return `${STORAGE_URL}/${path}`;
};

const getTierBadge = (tier) => {
  switch (tier) {
    case 'featured':  return 'Featured';
    case 'sponsored': return 'Sponsored';
    case 'promoted':  return 'Promoted';
    default:          return tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'Standard';
  }
};

const FeaturedGrid = ({ 
  adverts, 
  loading,
  viewMode, 
  savedAdverts, 
  onSaveAdvert, 
  onViewAdvert, 
  onSellerProfileClick, 
  currentPage, 
  setCurrentPage,
  meta,
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [quickViewAdvert, setQuickViewAdvert] = useState(null);

  const totalPages = meta?.last_page || 1;
  const paginatedAdverts = adverts;

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

    // Map backend fields
    const badge      = getTierBadge(advert.upsell_tier);
    const mainImage  = getImageUrl(advert.images?.[0]);
    const views      = advert.view_count || 0;
    const price      = advert.formatted_price || (advert.price ? `${advert.currency || '£'}${Number(advert.price).toLocaleString()}` : 'POA');
    const location   = [advert.city, advert.country].filter(Boolean).join(', ');
    const categoryName = advert.category?.name || advert.advert_type || '';
    const sellerName   = advert.contact_name || advert.customer?.name || 'Seller';
    const sellerEmail  = advert.contact_email || '';
    const sellerPhone  = advert.contact_phone || '';
    const isVerified   = advert.is_verified_seller;
    const rating       = advert.rating;
    const sellerObj    = { name: sellerName, email: sellerEmail, phone: sellerPhone, verified: isVerified, rating };

    const sellerForProfile = {
      ...sellerObj,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=7C3AED&color=fff`,
      website: advert.website,
    };

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
        <div className={`relative ${isListView ? 'w-48 h-48 flex-shrink-0' : 'h-64'} overflow-hidden`}>
          <img
            src={mainImage}
            alt={advert.title}
            className="w-full h-full object-cover transition-transform duration-500"
            onError={e => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
          />
          
          {/* Overlay with Actions */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
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
            <div className={`flex items-center space-x-1 ${getBadgeColor(badge)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
              {getBadgeIcon(badge)}
              <span>{badge}</span>
            </div>
          </div>

          {/* Views Count */}
          <div className="absolute bottom-4 right-4">
            <div className="flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
              <Eye className="h-3 w-3" />
              <span>{Number(views).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
          {/* Title and Price */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{advert.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-purple-600">{price}</span>
              {advert.condition && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">{advert.condition}</span>
              )}
            </div>
          </div>

          {/* Location and Category */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span className="truncate max-w-[120px]">{location}</span>
            </div>
            {categoryName && (
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs capitalize">{categoryName}</span>
            )}
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                {sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{sellerName}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  {rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span>{Number(rating).toFixed(1)}</span>
                    </div>
                  )}
                  {isVerified && (
                    <Shield className="h-3 w-3 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {advert.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{advert.description}</p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => handleContactSeller(sellerForProfile, e)}
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

          {/* Hover Extra Info */}
          {isHovered && advert.created_at && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Posted {new Date(advert.created_at).toLocaleDateString()}</span>
                <span className="capitalize">{advert.advert_type}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="page-container py-8">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Adverts
            <span className="text-lg font-normal text-gray-600 ml-2">
              ({meta?.total || adverts.length} results)
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
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedGrid;
