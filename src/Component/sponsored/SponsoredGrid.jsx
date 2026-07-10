import React from 'react';
import { motion } from 'framer-motion';
import { Crown, MapPin, Eye, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const SponsoredGrid = ({ adverts, loading, meta, onPageChange }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const getTierBadge = (tier) => {
    switch(tier) {
      case 'premium':
        return <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center"><Crown className="w-3 h-3 mr-1" /> Premium</span>;
      case 'plus':
        return <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Plus</span>;
      case 'basic':
        return <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Basic</span>;
      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="flex justify-between">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!adverts || adverts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Crown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sponsored Adverts Found</h3>
        <p className="text-gray-600">Try adjusting your filters or check back later for new listings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {adverts.map((advert) => (
          <motion.div
            key={advert.id}
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              {advert.main_image ? (
                <img
                  src={advert.main_image}
                  alt={advert.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Crown className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              {/* Tier Badge */}
              <div className="absolute top-3 right-3">
                {getTierBadge(advert.sponsorship_tier)}
              </div>

              {/* Featured Badge */}
              {advert.is_featured && (
                <div className="absolute top-3 left-3">
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Featured</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {advert.title}
              </h3>
              
              {advert.tagline && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                  {advert.tagline}
                </p>
              )}

              {/* Location */}
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="truncate">{advert.city}, {advert.country}</span>
              </div>

              {/* Price */}
              {advert.price && (
                <div className="mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    {advert.currency === 'GBP' ? '£' : advert.currency === 'USD' ? '$' : '€'}{Number(advert.price).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{Number(advert.views_count || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  <span>{Number(advert.saves_count || 0).toLocaleString()}</span>
                </div>
                {advert.rating > 0 && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>{Number(advert.rating).toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Seller Info */}
              <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                {advert.logo ? (
                  <img
                    src={advert.logo}
                    alt={advert.business_name || advert.seller_name}
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {advert.business_name || advert.seller_name}
                  </p>
                  {advert.verified_seller && (
                    <p className="text-xs text-green-600">Verified Seller</p>
                  )}
                </div>
              </div>

              {/* View Button */}
              <Link
                to={`/sponsored/${advert.slug}`}
                className="block w-full text-center py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all text-sm font-semibold"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => onPageChange(meta.current_page - 1)}
            disabled={meta.current_page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {[...Array(meta.last_page)].map((_, i) => {
            const page = i + 1;
            if (
              page === 1 ||
              page === meta.last_page ||
              (page >= meta.current_page - 1 && page <= meta.current_page + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-4 py-2 rounded-lg ${
                    page === meta.current_page
                      ? 'bg-yellow-500 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            }
            if (page === meta.current_page - 2 || page === meta.current_page + 2) {
              return <span key={page} className="px-2">...</span>;
            }
            return null;
          })}

          <button
            onClick={() => onPageChange(meta.current_page + 1)}
            disabled={meta.current_page === meta.last_page}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SponsoredGrid;
