import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import PromotedCard from './PromotedCard';
import { promotedAdvertsUtils } from '../../services/promotedAdvertsAPI';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

const PromotedGrid = ({ 
  adverts = [], 
  loading = false, 
  pagination = {}, 
  onPageChange,
  onAdvertClick,
  onToggleFavorite,
  filters,
  sortBy,
  sortOrder
}) => {
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Format advert data for display
  const formattedAdverts = useMemo(() => {
    return adverts.map(advert => {
      const resolvedImage =
        resolveStorageUrl(advert.main_image_url || advert.main_image || advert.image) || null;
      const resolvedLogo =
        resolveStorageUrl(advert.logo_url || advert.logo) || null;

      return {
      id: advert.id,
      slug: advert.slug,
      title: advert.title,
      tagline: advert.tagline,
      description: advert.description,
      price: advert.price,
      currency: advert.currency,
      location: `${advert.city || ''}${advert.city && advert.country ? ', ' : ''}${advert.country || ''}`,
      category: advert.category?.name || advert.category_name || advert.source_label || 'Uncategorized',
      main_image: resolvedImage,
      main_image_url: resolvedImage,
      image: resolvedImage,
      country: advert.country,
      city: advert.city,
      views_count: advert.views_count || 0,
      views: advert.views_count || 0,
      saves: advert.saves_count || 0,
      rating: advert.rating || 4.5,
      reviews: advert.reviews_count || 0,
      promotion_tier: advert.promotion_tier,
      badge: promotedAdvertsUtils.getPromotionTierDisplay(advert.promotion_tier),
      badgeColor: promotedAdvertsUtils.getPromotionTierColor(advert.promotion_tier),
      advert_type: advert.advert_type,
      condition: advert.condition,
      verified_seller: advert.verified_seller,
      seller_name: advert.seller_name,
      phone: advert.phone,
      email: advert.email,
      website: advert.website,
      is_favorited: advert.is_favorited_by_current_user || false,
      is_favorited_by_current_user: advert.is_favorited_by_current_user || false,
      created_at: advert.created_at,
      updated_at: advert.updated_at,
      logo: resolvedLogo,
      logo_url: resolvedLogo,
      seller: {
        name: advert.seller_name,
        business_name: advert.business_name,
        avatar: resolvedLogo,
        verified: advert.verified_seller,
        phone: advert.phone,
        email: advert.email,
        website: advert.website
      },
      key_features: advert.key_features || [],
      additional_images: advert.additional_images_urls || [],
      video_link: advert.video_link
    };
    });
  }, [adverts]);

  // Show loading state
  if (loading && formattedAdverts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-600">Loading promoted adverts...</p>
      </div>
    );
  }

  // Show empty state
  if (!loading && formattedAdverts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No promoted adverts found</h3>
        <p className="text-gray-600 text-center max-w-md">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  // Handle page change
  const handlePageChange = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Showing {formattedAdverts.length} of {pagination.total || 0} results
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-orange-100 text-orange-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-orange-100 text-orange-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Adverts Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }>
        {formattedAdverts.map((advert, index) => (
          <motion.div
            key={advert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <PromotedCard
              advert={advert}
              viewMode={viewMode}
              onAdvertClick={onAdvertClick}
              onToggleFavorite={onToggleFavorite}
            />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
            className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  page === pagination.currentPage
                    ? 'bg-orange-500 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PromotedGrid;
