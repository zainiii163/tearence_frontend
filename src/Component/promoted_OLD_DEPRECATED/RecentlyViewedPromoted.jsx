import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye, Heart, ExternalLink, Trash2, RotateCcw, ArrowRight } from 'lucide-react';
import PromotedCard from './PromotedCard';

const RecentlyViewedPromoted = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Sample recently viewed adverts (in real app, this would come from localStorage)
  const sampleRecentlyViewed = [
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
      postedTime: "2 hours ago",
      viewedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      promoted: true
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
      postedTime: "5 hours ago",
      viewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      promoted: true
    },
    {
      id: 3,
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
      postedTime: "3 hours ago",
      viewedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      promoted: true
    },
    {
      id: 4,
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
      postedTime: "6 hours ago",
      viewedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      promoted: true
    }
  ];

  useEffect(() => {
    // Load recently viewed from localStorage or use sample data
    const stored = localStorage.getItem('recentlyViewedPromoted');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed);
      } catch (e) {
        setRecentlyViewed(sampleRecentlyViewed);
      }
    } else {
      setRecentlyViewed(sampleRecentlyViewed);
    }
  }, []);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const handleClearAll = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('recentlyViewedPromoted');
  };

  const handleRemoveItem = (id) => {
    const updated = recentlyViewed.filter(item => item.id !== id);
    setRecentlyViewed(updated);
    localStorage.setItem('recentlyViewedPromoted', JSON.stringify(updated));
  };

  const handleQuickView = (advert) => {
    console.log('Quick view:', advert);
  };

  const handleSave = (advertId, isSaved) => {
    console.log('Save advert:', advertId, isSaved);
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

  if (recentlyViewed.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recently Viewed</h3>
        <p className="text-gray-600 mb-6">
          Start browsing promoted adverts to see your viewing history here.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/promoted'}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all"
        >
          Browse Promoted Ads
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recently Viewed</h3>
            <p className="text-sm text-gray-600">Promoted adverts you've viewed recently</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 mr-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current"></div>
                <div className="bg-current"></div>
                <div className="bg-current"></div>
                <div className="bg-current"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <div className="w-4 h-4 space-y-1">
                <div className="bg-current h-0.5"></div>
                <div className="bg-current h-0.5"></div>
                <div className="bg-current h-0.5"></div>
              </div>
            </button>
          </div>
          
          {/* Clear All Button */}
          <button
            onClick={handleClearAll}
            className="text-gray-500 hover:text-red-600 transition-colors p-1"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recently Viewed Items */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-4'
        }
      >
        {recentlyViewed.map((advert) => (
          <motion.div
            key={advert.id}
            variants={itemVariants}
            className={viewMode === 'list' ? 'w-full' : ''}
          >
            {viewMode === 'grid' ? (
              <div className="relative group">
                <PromotedCard
                  advert={advert}
                  onQuickView={handleQuickView}
                  onSave={handleSave}
                />
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(advert.id);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  title="Remove from history"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                {/* Viewed Time */}
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {formatTimeAgo(new Date(advert.viewedAt))}
                </div>
              </div>
            ) : (
              /* List View */
              <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group">
                <div className="flex gap-4">
                  <img
                    src={advert.image}
                    alt={advert.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{advert.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{advert.category}</span>
                          <span>•</span>
                          <span>{advert.location}</span>
                          <span>•</span>
                          <span className="font-bold text-amber-600">{advert.price}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Viewed {formatTimeAgo(new Date(advert.viewedAt))}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.location.href = `/ads-detail/${advert.id}`}
                          className="text-amber-600 hover:text-amber-700 p-1"
                          title="View advert"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveItem(advert.id)}
                          className="text-red-500 hover:text-red-600 p-1"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* View More Button */}
      <div className="mt-6 text-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/promoted'}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all text-sm"
        >
          <Eye className="w-4 h-4" />
          View More Promoted Ads
        </motion.button>
      </div>
    </div>
  );
};

export default RecentlyViewedPromoted;
