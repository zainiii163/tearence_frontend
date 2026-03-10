import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, MapPin, Star, Heart, Eye, TrendingUp, Globe, X, Menu, ChevronDown, User, Briefcase, Home, Car, Book, Plane, ShoppingBag, Wrench, Calendar, Users, BadgeCheck, Crown, Zap, ArrowRight, Plus, Check } from 'lucide-react';
import SponsoredNavbar from '../Component/sponsored/SponsoredNavbar';
import SponsoredHero from '../Component/sponsored/SponsoredHero';
import SponsoredCategoryGrid from '../Component/sponsored/SponsoredCategoryGrid';
import SponsoredAdvertCard from '../Component/sponsored/SponsoredAdvertCard';
import SponsoredFilters from '../Component/sponsored/SponsoredFilters';
import SponsoredSellerProfile from '../Component/sponsored/SponsoredSellerProfile';
import SponsoredActivityFeed from '../Component/sponsored/SponsoredActivityFeed';
import SponsoredPostForm from '../Component/sponsored/SponsoredPostForm';
import SponsoredFooter from '../Component/sponsored/SponsoredFooter';

// Sample sponsored adverts data
const sampleSponsoredAdverts = [
  {
    id: 1,
    title: "Luxury Penthouse Apartment - Manhattan Skyline",
    category: "Property",
    price: "$2,500,000",
    country: "USA",
    city: "New York",
    image: "/img/banner/luxury-property-1.jpg",
    badges: ["Sponsored Premium", "Featured"],
    seller: {
      name: "Elite Properties NYC",
      verified: true,
      rating: 4.9,
      adsCount: 45
    },
    views: 12543,
    condition: "New",
    description: "Stunning penthouse with panoramic Manhattan views, premium amenities, and exclusive rooftop access."
  },
  {
    id: 2,
    title: "2024 Tesla Model S Plaid - Limited Edition",
    category: "Cars & Vehicles",
    price: "$149,999",
    country: "USA",
    city: "Los Angeles",
    image: "/img/banner/tesla-plaid.jpg",
    badges: ["Sponsored Plus", "Trending"],
    seller: {
      name: "Luxury Motors LA",
      verified: true,
      rating: 4.8,
      adsCount: 23
    },
    views: 8765,
    condition: "New",
    description: "Limited edition Tesla Model S Plaid with custom upgrades and full warranty."
  },
  {
    id: 3,
    title: "Senior Software Engineer - Remote Global",
    category: "Jobs & Services",
    price: "$180,000/year",
    country: "UK",
    city: "London",
    image: "/img/banner/tech-job.jpg",
    badges: ["Sponsored Premium"],
    seller: {
      name: "TechCorp International",
      verified: true,
      rating: 4.7,
      adsCount: 156
    },
    views: 15432,
    condition: "Not Applicable",
    description: "Join our global team as a Senior Software Engineer. Work remotely from anywhere."
  },
  {
    id: 4,
    title: "Exclusive Dubai Desert Safari Experience",
    category: "Travel & Experiences",
    price: "$599",
    country: "UAE",
    city: "Dubai",
    image: "/img/banner/dubai-safari.jpg",
    badges: ["Sponsored Plus", "Hot Deal"],
    seller: {
      name: "Desert Adventures",
      verified: true,
      rating: 4.9,
      adsCount: 67
    },
    views: 9876,
    condition: "New",
    description: "Premium desert safari experience with luxury accommodations and exclusive activities."
  },
  {
    id: 5,
    title: "Professional Web Design Package",
    category: "Business Opportunities",
    price: "$2,999",
    country: "Canada",
    city: "Toronto",
    image: "/img/banner/web-design.jpg",
    badges: ["Sponsored Basic"],
    seller: {
      name: "Creative Digital Agency",
      verified: false,
      rating: 4.6,
      adsCount: 89
    },
    views: 5432,
    condition: "Not Applicable",
    description: "Complete web design package including SEO, hosting, and maintenance for one year."
  },
  {
    id: 6,
    title: "Designer Fashion Collection - Milan",
    category: "Fashion & Beauty",
    price: "€3,500",
    country: "Italy",
    city: "Milan",
    image: "/img/banner/fashion-milan.jpg",
    badges: ["Sponsored Premium", "Exclusive"],
    seller: {
      name: "Milan Fashion House",
      verified: true,
      rating: 5.0,
      adsCount: 34
    },
    views: 11234,
    condition: "New",
    description: "Exclusive designer collection from Milan Fashion Week 2024."
  },
  {
    id: 7,
    title: "VIP Concert Tickets - World Tour",
    category: "Events & Tickets",
    price: "$450",
    country: "USA",
    city: "Las Vegas",
    image: "/img/banner/concert-vip.jpg",
    badges: ["Sponsored Plus", "Limited"],
    seller: {
      name: "VIP Ticket Master",
      verified: true,
      rating: 4.8,
      adsCount: 201
    },
    views: 7890,
    condition: "New",
    description: "VIP concert tickets with backstage access and exclusive merchandise."
  },
  {
    id: 8,
    title: "Purebred Golden Retriever Puppies",
    category: "Pets & Animals",
    price: "$1,800",
    country: "Australia",
    city: "Sydney",
    image: "/img/banner/golden-puppies.jpg",
    badges: ["Sponsored Basic"],
    seller: {
      name: "Premium Breeders AU",
      verified: true,
      rating: 4.9,
      adsCount: 12
    },
    views: 6543,
    condition: "New",
    description: "AKC registered Golden Retriever puppies, health guaranteed, vaccinated."
  },
  {
    id: 9,
    title: "Smart Home Automation System",
    category: "Electronics",
    price: "$3,499",
    country: "Germany",
    city: "Berlin",
    image: "/img/banner/smart-home.jpg",
    badges: ["Sponsored Plus", "New Tech"],
    seller: {
      name: "Smart Home Solutions",
      verified: true,
      rating: 4.7,
      adsCount: 78
    },
    views: 4321,
    condition: "New",
    description: "Complete smart home automation system with AI integration and mobile control."
  },
  {
    id: 10,
    title: "Organic Farm - 50 Acres",
    category: "Home & Garden",
    price: "$850,000",
    country: "USA",
    city: "Portland",
    image: "/img/banner/organic-farm.jpg",
    badges: ["Sponsored Premium"],
    seller: {
      name: "Green Real Estate",
      verified: true,
      rating: 4.8,
      adsCount: 29
    },
    views: 9876,
    condition: "Used",
    description: "Certified organic farm with established crops, equipment, and irrigation systems."
  },
  {
    id: 11,
    title: "Executive Health Check Package",
    category: "Health & Wellness",
    price: "$2,200",
    country: "Singapore",
    city: "Singapore",
    image: "/img/banner/health-check.jpg",
    badges: ["Sponsored Plus", "Premium"],
    seller: {
      name: "Singapore Medical Center",
      verified: true,
      rating: 4.9,
      adsCount: 145
    },
    views: 7654,
    condition: "Not Applicable",
    description: "Comprehensive executive health check-up with advanced diagnostics and consultation."
  },
  {
    id: 12,
    title: "Online MBA Program - Top University",
    category: "Education & Courses",
    price: "$45,000",
    country: "UK",
    city: "Oxford",
    image: "/img/banner/mba-online.jpg",
    badges: ["Sponsored Premium", "Top Rated"],
    seller: {
      name: "Oxford Business School",
      verified: true,
      rating: 5.0,
      adsCount: 67
    },
    views: 13579,
    condition: "Not Applicable",
    description: "Prestigious online MBA program from one of the world's top business schools."
  }
];

const SponsoredAdvertsPage = () => {
  const [adverts, setAdverts] = useState(sampleSponsoredAdverts);
  const [filteredAdverts, setFilteredAdverts] = useState(sampleSponsoredAdverts);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('mostRecent');
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [savedAdverts, setSavedAdverts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Apply filters
  useEffect(() => {
    let filtered = adverts;

    if (selectedCategory) {
      filtered = filtered.filter(ad => ad.category === selectedCategory);
    }

    if (selectedCountry) {
      filtered = filtered.filter(ad => ad.country === selectedCountry);
    }

    if (searchQuery) {
      filtered = filtered.filter(ad => 
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'mostViewed':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'priceLow':
        filtered.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));
        break;
      case 'priceHigh':
        filtered.sort((a, b) => parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, '')));
        break;
      case 'trending':
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        // mostRecent - keep original order
        break;
    }

    setFilteredAdverts(filtered);
  }, [selectedCategory, selectedCountry, searchQuery, sortBy, adverts]);

  const handleSaveAdvert = (advertId) => {
    setSavedAdverts(prev => 
      prev.includes(advertId) 
        ? prev.filter(id => id !== advertId)
        : [...prev, advertId]
    );
  };

  const handleViewAdvert = (advert) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== advert.id);
      return [advert.id, ...filtered].slice(0, 10);
    });
  };

  const handleSellerClick = (seller) => {
    setSelectedSeller(seller);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SponsoredNavbar 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onPostAdvert={() => setShowPostForm(true)}
      />

      <SponsoredHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Crown className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">12,456</span>
              </div>
              <p className="text-sm text-gray-600">Sponsored Ads</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">142</span>
              </div>
              <p className="text-sm text-gray-600">Countries</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="w-5 h-5 text-purple-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">45.2M</span>
              </div>
              <p className="text-sm text-gray-600">Total Views</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">98%</span>
              </div>
              <p className="text-sm text-gray-600">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <SponsoredCategoryGrid 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredAdverts.length} Sponsored Ads
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mostRecent">Most Recent</option>
                <option value="mostViewed">Most Viewed</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <SponsoredFilters
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Adverts Grid */}
        <div className={`grid gap-6 mb-8 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredAdverts.map((advert) => (
            <SponsoredAdvertCard
              key={advert.id}
              advert={advert}
              viewMode={viewMode}
              isSaved={savedAdverts.includes(advert.id)}
              onSave={() => handleSaveAdvert(advert.id)}
              onView={() => handleViewAdvert(advert)}
              onSellerClick={() => handleSellerClick(advert.seller)}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mb-12">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
            Load More Sponsored Ads
          </button>
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SponsoredActivityFeed />
          </div>
          <div>
            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Recently Viewed</h3>
                <div className="space-y-3">
                  {recentlyViewed.slice(0, 5).map((advertId) => {
                    const advert = adverts.find(a => a.id === advertId);
                    return advert ? (
                      <div key={advertId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={advert.image} 
                          alt={advert.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{advert.title}</p>
                          <p className="text-xs text-gray-600">{advert.price}</p>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Premium Promotion */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center mb-4">
                <Crown className="w-6 h-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold">Go Premium</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Get maximum visibility for your adverts with our Premium sponsorship packages.
              </p>
              <button 
                onClick={() => setShowPostForm(true)}
                className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
              >
                Upgrade Your Ad
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Profile Modal */}
      <AnimatePresence>
        {selectedSeller && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSeller(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <SponsoredSellerProfile 
                seller={selectedSeller}
                onClose={() => setSelectedSeller(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Form Modal */}
      <AnimatePresence>
        {showPostForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <SponsoredPostForm onClose={() => setShowPostForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SponsoredFooter />
    </div>
  );
};

export default SponsoredAdvertsPage;
