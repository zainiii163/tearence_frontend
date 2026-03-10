import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import PromotedCard from './PromotedCard';
import { promotedAdvertsUtils } from '../../services/promotedAdvertsAPI';

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
    return adverts.map(advert => ({
      id: advert.id,
      slug: advert.slug,
      title: advert.title,
      tagline: advert.tagline,
      description: advert.description,
      price: promotedAdvertsUtils.formatPrice(advert.price, advert.currency),
      location: `${advert.city}, ${advert.country}`,
      category: advert.category?.name || 'Uncategorized',
      image: advert.main_image_url || 'https://via.placeholder.com/400x300?text=No+Image',
      country: advert.country,
      views: advert.views_count || 0,
      saves: advert.saves_count || 0,
      rating: advert.rating || 4.5,
      reviews: advert.reviews_count || 0,
      badge: promotedAdvertsUtils.getPromotionTierDisplay(advert.promotion_tier),
      badgeColor: promotedAdvertsUtils.getPromotionTierColor(advert.promotion_tier),
      advert_type: advert.advert_type,
      condition: advert.condition,
      verified_seller: advert.verified_seller,
      is_favorited_by_current_user: advert.is_favorited_by_current_user || false,
      created_at: advert.created_at,
      updated_at: advert.updated_at,
      seller: {
        name: advert.seller_name,
        business_name: advert.business_name,
        avatar: advert.logo_url || 'https://via.placeholder.com/40x40?text=Logo',
        verified: advert.verified_seller,
        phone: advert.phone,
        email: advert.email,
        website: advert.website
      },
      key_features: advert.key_features || [],
      additional_images: advert.additional_images_urls || [],
      video_link: advert.video_link
    }));
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

  // Filter and sort adverts
  const filteredAndSortedAdverts = useMemo(() => {
    let filtered = [...formattedAdverts];

    // Apply search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(advert =>
        advert.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        advert.category.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        advert.location.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(advert => advert.category === filters.category);
    }

    // Apply country filter
    if (filters.country) {
      filtered = filtered.filter(advert => advert.location.includes(filters.country));
    }

    // Apply price range filter
    if (filters.priceRange) {
      const minPrice = parseFloat(filters.priceRange.min) || 0;
      const maxPrice = parseFloat(filters.priceRange.max) || Infinity;
      filtered = filtered.filter(advert => {
        const price = parseFloat(advert.price.replace(/[^0-9.]/g, ''));
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply verified only filter
    if (filters.verifiedOnly) {
      filtered = filtered.filter(advert => advert.seller.verified);
    }

    // Apply sorting
    switch (sortBy) {
      case 'most_recent':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'most_viewed':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'trending':
        filtered.sort((a, b) => (b.views * b.rating) - (a.views * a.rating));
        break;
      case 'price_low_high':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price_high_low':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
          return priceB - priceA;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [promotedAdverts, searchQuery, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedAdverts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAdverts = filteredAndSortedAdverts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdvertView = (advert) => {
    console.log('View advert:', advert);
    // Navigate to advert detail page
  };

  const handleAdvertSave = (advert) => {
    console.log('Save advert:', advert);
    // Save to user's favorites
  };

  const handleAdvertContact = (advert) => {
    console.log('Contact seller:', advert);
    // Open contact modal or navigate to contact form
  };

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

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Promoted Adverts
          </h3>
          <p className="text-sm text-gray-600">
            Showing {paginatedAdverts.length} of {filteredAndSortedAdverts.length} results
          </p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Adverts Grid */}
      {paginatedAdverts.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {paginatedAdverts.map((advert) => (
            <motion.div
              key={advert.id}
              variants={itemVariants}
              className={viewMode === 'list' ? 'w-full' : ''}
            >
              <PromotedCard
                advert={advert}
                onView={handleAdvertView}
                onSave={handleAdvertSave}
                onContact={handleAdvertContact}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No promoted adverts found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === currentPage;
              const isNearCurrentPage = Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages;
              
              if (!isNearCurrentPage && page === currentPage - 3) {
                return (
                  <span key={page} className="px-3 py-2 text-gray-500">
                    ...
                  </span>
                );
              }
              
              if (!isNearCurrentPage && page === currentPage + 3) {
                return (
                  <span key={page} className="px-3 py-2 text-gray-500">
                    ...
                  </span>
                );
              }
              
              if (!isNearCurrentPage) {
                return null;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isCurrentPage
                      ? 'bg-orange-500 text-white'
                      : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PromotedGrid;
