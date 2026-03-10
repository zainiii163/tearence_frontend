import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBullhorn, FaPlus } from 'react-icons/fa';
import PromotedHero from '../Component/promoted/PromotedHero';
import PromotedCategoryGrid from '../Component/promoted/PromotedCategoryGrid';
import PromotedCarousel from '../Component/promoted/PromotedCarousel';
import PromotedGrid from '../Component/promoted/PromotedGrid';
import PromotedFilters from '../Component/promoted/PromotedFilters';
import PromotedActivityFeed from '../Component/promoted/PromotedActivityFeed';
import TrendingCountries from '../Component/promoted/TrendingCountries';
import TrendingCategories from '../Component/promoted/TrendingCategories';
import RecentlyViewedPromoted from '../Component/promoted/RecentlyViewedPromoted';
import PromotedUpgradeSection from '../Component/promoted/PromotedUpgradeSection';
import BackButton from '../Component/BackButton';

const PromotedPage = () => {
  const [filters, setFilters] = useState({
    category: '',
    country: '',
    city: '',
    priceRange: { min: 0, max: 10000 },
    advertType: '',
    verifiedOnly: false
  });
  const [sortBy, setSortBy] = useState('most_recent');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative">
      {/* Back Button - Top Left */}
      <div className="fixed top-20 left-4 z-40">
        <BackButton className="bg-white/90 hover:bg-white shadow-lg border border-gray-200" />
      </div>
      
      {/* Post Promoted Button - Top Right */}
      <div className="fixed top-20 right-4 z-40">
        <Link
          to="/post-promoted-ad"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-600 hover:bg-orange-700 text-white h-10 px-4 gap-2 shadow-lg hover:shadow-xl"
        >
          <FaBullhorn className="h-4 w-4" />
          <span className="hidden sm:inline">Post Promoted</span>
        </Link>
      </div>
      
      {/* Hero Section with Sticky Search */}
      <PromotedHero onSearch={handleSearch} onFilterChange={handleFilterChange} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Promoted Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <PromotedCarousel />
            </motion.div>

            {/* Category Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <PromotedCategoryGrid />
            </motion.div>

            {/* Filters and Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <PromotedFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                />
              </div>

              <PromotedGrid
                filters={filters}
                sortBy={sortBy}
                searchQuery={searchQuery}
              />
            </div>

            {/* Trending Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <TrendingCountries />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <TrendingCategories />
              </motion.div>
            </div>

            {/* Recently Viewed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <RecentlyViewedPromoted />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Live Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-24"
            >
              <PromotedActivityFeed />
            </motion.div>

            {/* Upgrade Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <PromotedUpgradeSection />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotedPage;
