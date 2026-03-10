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
      }
    },
    {
      id: 3,
      title: 'Expert Digital Marketing Services',
      price: '$95/hour',
      location: 'London, United Kingdom',
      category: 'Jobs & Services',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
      country: 'GB',
      views: 29876,
      rating: 5.0,
      reviews: 234,
      badge: 'Promoted',
      seller: {
        name: 'Digital Growth Agency',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face',
        verified: true,
        email: 'hello@digitalgrowth.com',
        website: 'https://digitalgrowth.com'
      }
    },
    {
      id: 4,
      title: 'Profitable E-commerce Business',
      price: '$150,000',
      location: 'New York, New York',
      category: 'Business Opportunities',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop',
      country: 'US',
      views: 56789,
      rating: 4.7,
      reviews: 45,
      badge: 'Sponsored',
      seller: {
        name: 'Business Brokers NY',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        verified: true,
        phone: '+1-212-555-0789',
        email: 'info@businessbrokersny.com'
      }
    },
    {
      id: 5,
      title: 'Brand New MacBook Pro 16" M2 Max',
      price: '$2,799',
      location: 'Toronto, Canada',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      country: 'CA',
      views: 67890,
      rating: 4.9,
      reviews: 167,
      badge: 'Featured',
      seller: {
        name: 'Tech Depot Canada',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        verified: true,
        phone: '+1-416-555-0234',
        email: 'sales@techdepot.ca'
      }
    },
    {
      id: 6,
      title: 'Designer Fashion Collection - Premium Brands',
      price: '$3,500',
      location: 'Paris, France',
      category: 'Fashion & Beauty',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      country: 'FR',
      views: 34567,
      rating: 4.8,
      reviews: 78,
      badge: 'Promoted',
      seller: {
        name: 'Paris Fashion House',
        avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&crop=face',
        verified: true,
        email: 'contact@parisfashion.fr',
        website: 'https://parisfashion.fr'
      }
    },
    {
      id: 7,
      title: 'Luxury Safari Experience in Kenya',
      price: '$8,999',
      location: 'Nairobi, Kenya',
      category: 'Travel & Experiences',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=300&fit=crop',
      country: 'KE',
      views: 23456,
      rating: 5.0,
      reviews: 92,
      badge: 'Sponsored',
      seller: {
        name: 'Africa Safari Tours',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&crop=face',
        verified: true,
        phone: '+254-20-555-0123',
        email: 'info@africasafari.co.ke'
      }
    },
    {
      id: 8,
      title: 'VIP Concert Tickets - World Tour',
      price: '$450',
      location: 'London, United Kingdom',
      category: 'Events & Tickets',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
      country: 'GB',
      views: 18976,
      rating: 4.6,
      reviews: 34,
      badge: 'Featured',
      seller: {
        name: 'Premium Tickets UK',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        verified: true,
        phone: '+44-20-555-0456',
        email: 'tickets@premiumuk.co.uk'
      }
    },
    {
      id: 9,
      title: 'Purebred German Shepherd Puppies',
      price: '$1,800',
      location: 'Sydney, Australia',
      category: 'Pets & Animals',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
      country: 'AU',
      views: 45678,
      rating: 4.9,
      reviews: 156,
      badge: 'Promoted',
      seller: {
        name: 'Sydney Pet Breeders',
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face',
        verified: true,
        phone: '+61-2-555-0789',
        email: 'puppies@sydneypets.com.au'
      }
    },
    {
      id: 10,
      title: 'Smart Home Automation System',
      price: '$2,200',
      location: 'Berlin, Germany',
      category: 'Home & Garden',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      country: 'DE',
      views: 28765,
      rating: 4.7,
      reviews: 89,
      badge: 'Sponsored',
      seller: {
        name: 'Smart Home Germany',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        verified: true,
        phone: '+49-30-555-0123',
        email: 'info@smarthome.de'
      }
    },
    {
      id: 11,
      title: 'Professional Fitness Training Program',
      price: '$299/month',
      location: 'Dubai, UAE',
      category: 'Health & Wellness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      country: 'AE',
      views: 34567,
      rating: 5.0,
      reviews: 201,
      badge: 'Featured',
      seller: {
        name: 'Dubai Fitness Elite',
        avatar: 'https://images.unsplash.com/photo-1594736797933-d0acc24019ce?w=40&h=40&fit=crop&crop=face',
        verified: true,
        phone: '+971-4-555-0456',
        email: 'train@fitnessdubai.ae'
      }
    },
    {
      id: 12,
      title: 'Advanced Web Development Course',
      price: '$899',
      location: 'San Francisco, California',
      category: 'Education & Courses',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      country: 'US',
      views: 42345,
      rating: 4.8,
      reviews: 178,
      badge: 'Promoted',
      seller: {
        name: 'Tech Academy SF',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        verified: true,
        email: 'learn@techacademy.sf',
        website: 'https://techacademy.sf'
      }
    }
  ];

  // Filter and sort adverts
  const filteredAndSortedAdverts = useMemo(() => {
    let filtered = [...promotedAdverts];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(advert =>
        advert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        advert.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        advert.location.toLowerCase().includes(searchQuery.toLowerCase())
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
