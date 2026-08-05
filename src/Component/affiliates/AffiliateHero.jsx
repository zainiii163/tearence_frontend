import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Globe, 
  Users, 
  Briefcase, 
  Star, 
  TrendingUp, 
  ArrowRight,
  Target,
  Zap,
  DollarSign,
  Shield,
  Eye
} from 'lucide-react';

const AffiliateHero = ({ stats, onPostBusiness, onPostPromoter }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showStickySearch, setShowStickySearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsScrolled(scrolled);
      setShowStickySearch(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      {/* Main Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-black/20" />
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"
          animate={{
            y: [0, -15, 0],
            x: [0, 15, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <div className="relative page-container py-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Promote & Earn —
              <span className="block text-yellow-300">All in One Global Hub</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              Discover affiliate offers or promote your own products and services worldwide.
            </motion.p>

            {/* Post CTAs — primary actions for posting affiliate links */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <button
                type="button"
                onClick={onPostPromoter}
                className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-8 py-3.5 rounded-full font-semibold text-lg hover:bg-yellow-300 transition-colors shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Post Affiliate Link
              </button>
              <button
                type="button"
                onClick={onPostBusiness}
                className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/40 px-8 py-3.5 rounded-full font-semibold text-lg hover:bg-white/25 transition-colors backdrop-blur-sm"
              >
                <Briefcase className="h-5 w-5" />
                Post Business Offer
              </button>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              variants={itemVariants}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-full p-2 flex items-center">
                <Search className="h-6 w-6 text-white/70 ml-4" />
                <input
                  type="text"
                  placeholder="Search affiliate offers..."
                  className="flex-1 bg-transparent text-white placeholder-white/70 px-4 py-3 outline-none"
                />
                <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors">
                  Search
                </button>
              </div>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.totalOffers.toLocaleString()}</div>
                <div className="text-white/70 text-sm">Total Offers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.totalPromoters.toLocaleString()}</div>
                <div className="text-white/70 text-sm">Promoters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.totalCategories}</div>
                <div className="text-white/70 text-sm">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.verifiedBusinesses}</div>
                <div className="text-white/70 text-sm">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.avgCommission}%</div>
                <div className="text-white/70 text-sm">Avg Commission</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{stats.totalEarnings}</div>
                <div className="text-white/70 text-sm">Total Earnings</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <motion.div
        className={`fixed top-20 left-0 right-0 z-40 bg-white shadow-lg transition-all duration-300 ${
          showStickySearch ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="page-container py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search affiliate offers, categories, or businesses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AffiliateHero;
