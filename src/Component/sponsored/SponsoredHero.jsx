import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Globe, Eye, Users, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

const SponsoredHero = ({ statistics, onPostAdvert }) => {

  const countries = [
    'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Italy', 'Spain',
    'UAE', 'Singapore', 'Japan', 'China', 'India', 'Brazil', 'Mexico'
  ];

  return (
    <div className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-orange-200"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300 rounded-full filter blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10"
      >
        <Crown className="w-8 h-8 text-yellow-600 opacity-30" />
      </motion.div>
      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-20"
      >
        <Sparkles className="w-6 h-6 text-orange-600 opacity-30" />
      </motion.div>
      <motion.div
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-1/3"
      >
        <TrendingUp className="w-7 h-7 text-amber-600 opacity-30" />
      </motion.div>

      <div className="relative page-container py-8 sm:py-10">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-full mb-6"
          >
            <Crown className="w-4 h-4 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800">Premium High-Visibility Listings</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
          >
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Explore Sponsored Adverts
            </span>
            <br />
            <span className="text-gray-800">From Across the Globe</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Premium, high-visibility listings from top businesses and creators worldwide.
          </motion.p>

          {/* Stats Bar - Real Data */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Crown className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">
                  {statistics ? Number(statistics.total_active || 0).toLocaleString() : '—'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Sponsored Ads</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">
                  {statistics ? (statistics.top_countries?.length || '—') : '—'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Countries</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">
                  {statistics ? Number(statistics.total_views || 0).toLocaleString() : '—'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">
                  {statistics ? Number(statistics.total_saves || 0).toLocaleString() : '—'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Total Saves</p>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600"
          >
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Verified Sellers</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>Premium Placement</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>Global Reach</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SponsoredHero;
