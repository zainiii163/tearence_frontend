import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import PromotedCard from './PromotedCard';
import { Loader2, Grid, List, ChevronDown, ChevronUp } from 'lucide-react';

const PromotedGrid = ({ filters, sortBy, searchQuery }) => {
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortByLocal, setSortByLocal] = useState(sortBy);
  const [showFilters, setShowFilters] = useState(false);
  const observerRef = useRef();
  const loadingRef = useRef(false);

  // Sample promoted adverts data
  const sampleAdverts = [
    {
      id: 1,
      title: "Luxury Beachfront Villa with Private Pool",
      category: "Property",
      price: "$3,200,000",
      location: "Malibu, California",
      countryFlag: "🇺🇸",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
      seller: "Paradise Properties",
      rating: 4.9,
      verified: true,
      views: 45234,
      saves: 2341,
      postedTime: "2 hours ago"
    },
    {
      id: 2,
      title: "Brand New Tesla Model S Plaid",
      category: "Cars & Vehicles",
      price: "$135,000",
      location: "San Francisco, CA",
      countryFlag: "🇺🇸",
      image: "https://images.unsplash.com/photo-1617654112369-9209d01a5969?w=400&h=300&fit=crop",
      seller: "EV Motors Premium",
      rating: 4.8,
      verified: true,
      views: 28456,
      saves: 1876,
      postedTime: "5 hours ago"
    },
    {
      id: 3,
      title: "Profitable E-commerce Business",
      category: "Business Opportunities",
      price: "$250,000",
      location: "New York, NY",
      countryFlag: "🇺🇸",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      seller: "Business Brokers Inc",
      rating: 4.7,
      verified: true,
      views: 12890,
      saves: 892,
      postedTime: "1 day ago"
    },
    {
      id: 4,
      title: "iPhone 15 Pro Max 256GB",
      category: "Electronics",
      price: "$1,199",
      location: "Los Angeles, CA",
      countryFlag: "🇺🇸",
      image: "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=400&h=300&fit=crop",
      seller: "TechZone",
      rating: 4.9,
      verified: false,
      views: 67345,
      saves: 4523,
      postedTime: "3 hours ago"
    },
    {
      id: 5,
      title: "Designer Fashion Collection",
      category: "Fashion & Beauty",
      price: "$8,500",
      location: "Paris, France",
      countryFlag: "🇫🇷",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=300&fit=crop",
      seller: "Luxury Fashion House",
      rating: 5.0,
      verified: true,
      views: 34567,
      saves: 2890,
      postedTime: "6 hours ago"
    },
    {
      id: 6,
      title: "Exotic Vacation Package - Maldives",
      category: "Travel & Experiences",
      price: "$12,000",
      location: "Malé, Maldives",
      countryFlag: "🇲🇻",
      image: "https://images.unsplash.com/photo-1540202404-1b927e77f919?w=400&h=300&fit=crop",
      seller: "Luxury Travel Co",
      rating: 4.8,
      verified: true,
      views: 23456,
      saves: 1678,
      postedTime: "4 hours ago"
    },
    {
      id: 7,
      title: "VIP Concert Tickets - World Tour",
      category: "Events & Tickets",
      price: "$850",
      location: "London, UK",
      countryFlag: "🇬🇧",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop",
      seller: "Premium Tickets",
      rating: 4.6,
      verified: true,
      views: 56789,
      saves: 3456,
      postedTime: "1 hour ago"
    },
    {
      id: 8,
      title: "Purebred Golden Retriever Puppies",
      category: "Pets & Animals",
      price: "$2,500",
      location: "Toronto, Canada",
      countryFlag: "🇨🇦",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
      seller: "Premium Breeders",
      rating: 4.9,
      verified: true,
      views: 34567,
      saves: 2345,
      postedTime: "7 hours ago"
    }
  ];

  // Filter and sort adverts
  const getFilteredAdverts = useCallback(() => {
    let filtered = [...sampleAdverts];

    // Apply search query
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
      filtered = filtered.filter(advert => 
        advert.location.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(advert => {
        const price = parseInt(advert.price.replace(/[^0-9]/g, ''));
        return price >= filters.priceRange.min && price <= filters.priceRange.max;
      });
    }

    // Apply verified only filter
    if (filters.verifiedOnly) {
      filtered = filtered.filter(advert => advert.verified);
    }

    // Apply sorting
    switch (sortByLocal) {
      case 'most_recent':
        filtered.sort((a, b) => new Date(b.postedTime) - new Date(a.postedTime));
        break;
      case 'most_viewed':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'trending':
        filtered.sort((a, b) => b.saves - a.saves);
        break;
      case 'price_low_high':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price_high_low':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceB - priceA;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, filters, sortByLocal]);

  // Load more adverts for infinite scroll
  const loadMoreAdverts = useCallback(() => {
    if (loadingRef.current || !hasMore) return;
    
    loadingRef.current = true;
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const filteredAdverts = getFilteredAdverts();
      const startIndex = adverts.length;
      const endIndex = Math.min(startIndex + 4, filteredAdverts.length);
      const newAdverts = filteredAdverts.slice(startIndex, endIndex);

      if (newAdverts.length > 0) {
        setAdverts(prev => [...prev, ...newAdverts]);
        setPage(prev => prev + 1);
      }

      setHasMore(endIndex < filteredAdverts.length);
      setLoading(false);
      loadingRef.current = false;
    }, 800);
  }, [adverts.length, hasMore, getFilteredAdverts]);

  // Initial load and reset when filters change
  useEffect(() => {
    setAdverts([]);
    setPage(1);
    setHasMore(true);
    loadingRef.current = false;
    loadMoreAdverts();
  }, [filters, sortByLocal, searchQuery]);

  // Update local sort when prop changes
  useEffect(() => {
    setSortByLocal(sortBy);
  }, [sortBy]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreAdverts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMoreAdverts, hasMore, loading]);

  const handleQuickView = (advert) => {
    console.log('Quick view:', advert);
    // Implement quick view modal
  };

  const handleSave = (advertId, isSaved) => {
    console.log('Save advert:', advertId, isSaved);
    // Implement save functionality
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
    <div>
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-gray-900">
            Promoted Adverts ({getFilteredAdverts().length})
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-amber-100 text-amber-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-amber-100 text-amber-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Adverts Grid */}
      {adverts.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No promoted adverts found</div>
          <p className="text-gray-400">Try adjusting your filters or search query</p>
        </div>
      ) : (
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
          {adverts.map((advert) => (
            <motion.div
              key={advert.id}
              variants={itemVariants}
              className={viewMode === 'list' ? 'w-full' : ''}
            >
              <PromotedCard
                advert={advert}
                onQuickView={handleQuickView}
                onSave={handleSave}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 text-amber-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading more promoted adverts...</span>
          </div>
        </div>
      )}

      {/* Intersection Observer Target */}
      <div ref={observerRef} className="h-10" />

      {/* No More Results */}
      {!hasMore && adverts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          You've reached the end of promoted adverts
        </div>
      )}
    </div>
  );
};

export default PromotedGrid;
