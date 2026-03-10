import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaGlobe, 
  FaStar, 
  FaCrown, 
  FaRocket,
  FaHome,
  FaCar,
  FaBriefcase,
  FaLaptop,
  FaTshirt,
  FaPlane,
  FaTicketAlt,
  FaPaw,
  FaSeedling,
  FaHeartbeat,
  FaGraduationCap,
  FaFilter,
  FaMapMarkerAlt,
  FaArrowUp,
  FaEye,
  FaArrowRight,
  FaPlay,
  FaPause,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';
import FeaturedCarousel from '../Component/FeaturedAdverts/FeaturedCarousel';
import SmartFilters from '../Component/FeaturedAdverts/SmartFilters';
import PremiumAdvertCard from '../Component/FeaturedAdverts/PremiumAdvertCard';
import QuickViewModal from '../Component/FeaturedAdverts/QuickViewModal';
import LiveActivityFeed from '../Component/FeaturedAdverts/LiveActivityFeed';
import TrendingSection from '../Component/FeaturedAdverts/TrendingSection';
import FeaturedSellerProfiles from '../Component/FeaturedAdverts/FeaturedSellerProfiles';
import PremiumPostingForm from '../Component/FeaturedAdverts/PremiumPostingForm';
import PageUpsellSection from '../Component/FeaturedAdverts/PageUpsellSection';

const FeaturedAdvertsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isMapAnimating, setIsMapAnimating] = useState(true);
  
  // New states for premium features
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    country: 'all',
    city: '',
    priceMin: '',
    priceMax: '',
    type: 'all',
    verifiedOnly: false
  });
  const [sortBy, setSortBy] = useState('recent');
  const [quickViewAdvert, setQuickViewAdvert] = useState(null);
  const [savedAdverts, setSavedAdverts] = useState([]);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showPostingForm, setShowPostingForm] = useState(false);

  // Global categories with international appeal
  const globalCategories = [
    {
      id: 'property',
      name: 'Property',
      icon: FaHome,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      featuredCount: 1247,
      color: 'from-blue-500 to-cyan-500',
      trending: true
    },
    {
      id: 'vehicles',
      name: 'Cars & Vehicles',
      icon: FaCar,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
      featuredCount: 892,
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'jobs',
      name: 'Jobs & Services',
      icon: FaBriefcase,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      featuredCount: 2156,
      color: 'from-purple-500 to-pink-500',
      trending: true
    },
    {
      id: 'business',
      name: 'Business Opportunities',
      icon: FaRocket,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      featuredCount: 634,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'electronics',
      name: 'Electronics',
      icon: FaLaptop,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      featuredCount: 1567,
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 'fashion',
      name: 'Fashion & Beauty',
      icon: FaTshirt,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      featuredCount: 923,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'travel',
      name: 'Travel & Experiences',
      icon: FaPlane,
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      featuredCount: 445,
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'events',
      name: 'Events & Tickets',
      icon: FaTicketAlt,
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
      featuredCount: 312,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'pets',
      name: 'Pets & Animals',
      icon: FaPaw,
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
      featuredCount: 278,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'home-garden',
      name: 'Home & Garden',
      icon: FaSeedling,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      featuredCount: 534,
      color: 'from-lime-500 to-green-500'
    },
    {
      id: 'health',
      name: 'Health & Wellness',
      icon: FaHeartbeat,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
      featuredCount: 412,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'education',
      name: 'Education & Courses',
      icon: FaGraduationCap,
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
      featuredCount: 189,
      color: 'from-blue-600 to-indigo-600'
    }
  ];

  // Global regions with featured ads data
  const globalRegions = [
    {
      id: 'north-america',
      name: 'North America',
      coordinates: { x: 25, y: 35 },
      featuredCount: 3421,
      trendingCategories: ['Property', 'Vehicles', 'Jobs'],
      avgPrice: '$2,450',
      flag: '🇺🇸'
    },
    {
      id: 'europe',
      name: 'Europe',
      coordinates: { x: 48, y: 30 },
      featuredCount: 2856,
      trendingCategories: ['Business', 'Fashion', 'Travel'],
      avgPrice: '€1,890',
      flag: '🇪🇺'
    },
    {
      id: 'asia',
      name: 'Asia',
      coordinates: { x: 70, y: 40 },
      featuredCount: 4123,
      trendingCategories: ['Electronics', 'Education', 'Jobs'],
      avgPrice: '¥125,000',
      flag: '🌏'
    },
    {
      id: 'south-america',
      name: 'South America',
      coordinates: { x: 35, y: 65 },
      featuredCount: 1234,
      trendingCategories: ['Travel', 'Events', 'Fashion'],
      avgPrice: 'R$8,900',
      flag: '🇧🇷'
    },
    {
      id: 'africa',
      name: 'Africa',
      coordinates: { x: 50, y: 55 },
      featuredCount: 892,
      trendingCategories: ['Business', 'Education', 'Health'],
      avgPrice: 'R45,000',
      flag: '🌍'
    },
    {
      id: 'oceania',
      name: 'Oceania',
      coordinates: { x: 80, y: 70 },
      featuredCount: 1567,
      trendingCategories: ['Property', 'Travel', 'Pets'],
      avgPrice: 'AU$3,200',
      flag: '🇦🇺'
    }
  ];

  // Enhanced sample featured adverts with premium data
  const featuredAdverts = [
    {
      id: 1,
      title: 'Luxury Penthouse in Manhattan',
      category: 'Property',
      location: 'New York, USA',
      price: '$2,500,000',
      originalPrice: '$2,800,000',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
      badge: 'Featured',
      views: 15234,
      featured: true,
      seller: 'Elite Properties',
      flag: '🇺🇸',
      verified: true,
      rating: 4.8,
      sellerAvatar: 'https://ui-avatars.com/api/?name=Elite+Properties&background=0D8ABC&color=fff',
      phone: '+1 555-0123',
      email: 'contact@eliteproperties.com',
      website: 'https://eliteproperties.com',
      postedDate: '2 days ago',
      memberSince: '2018',
      responses: 47,
      responseRate: '98%',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1600566753376-12c8e0c7a8a7?w=600&h=400&fit=crop'
      ],
      description: 'Stunning luxury penthouse in the heart of Manhattan with panoramic city views. This exceptional property features 3 bedrooms, 4 bathrooms, a private terrace, and premium finishes throughout.'
    },
    {
      id: 2,
      title: 'Vintage Ferrari 250 GT',
      category: 'Vehicles',
      location: 'Milan, Italy',
      price: '€1,800,000',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c6f88b?w=600&h=400&fit=crop',
      badge: 'Sponsored',
      views: 28901,
      featured: true,
      seller: 'Classic Motors',
      flag: '🇮🇹',
      verified: true,
      rating: 4.9,
      sellerAvatar: 'https://ui-avatars.com/api/?name=Classic+Motors&background=FF6B6B&color=fff',
      phone: '+39 02 1234 5678',
      email: 'info@classicmotors.it',
      website: 'https://classicmotors.it',
      postedDate: '1 week ago',
      memberSince: '2015',
      responses: 89,
      responseRate: '96%',
      images: [
        'https://images.unsplash.com/photo-1583121274602-3e2820c6f88b?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop'
      ],
      description: 'Immaculate 1962 Ferrari 250 GT Berlinetta. One of the most iconic classic cars ever made, with complete restoration documentation and racing history.'
    },
    {
      id: 3,
      title: 'Tech Startup Investment Opportunity',
      category: 'Business',
      location: 'London, UK',
      price: '£500,000',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
      badge: 'Featured',
      views: 9876,
      featured: true,
      seller: 'Venture Capital Ltd',
      flag: '🇬🇧',
      verified: true,
      rating: 4.7,
      sellerAvatar: 'https://ui-avatars.com/api/?name=Venture+Capital&background=4ECDC4&color=fff',
      phone: '+44 20 7123 4567',
      email: 'invest@venturecap.co.uk',
      website: 'https://venturecap.co.uk',
      postedDate: '3 days ago',
      memberSince: '2019',
      responses: 23,
      responseRate: '92%',
      images: [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
      ],
      description: 'Exclusive investment opportunity in a high-growth AI startup. Projected 300% ROI within 3 years. Already secured $2M in seed funding.'
    },
    {
      id: 4,
      title: 'Executive MBA Program - Global Business',
      category: 'Education',
      location: 'Singapore',
      price: '$85,000',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop',
      badge: 'Promoted',
      views: 6543,
      featured: true,
      seller: 'Global Business School',
      flag: '🇸🇬',
      verified: true,
      rating: 4.6,
      sellerAvatar: 'https://ui-avatars.com/api/?name=Global+Business+School&background=FFD93D&color=333',
      phone: '+65 6123 4567',
      email: 'admissions@gbs.edu.sg',
      website: 'https://gbs.edu.sg',
      postedDate: '5 days ago',
      memberSince: '2010',
      responses: 156,
      responseRate: '99%',
      images: [
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop'
      ],
      description: 'Top-ranked Executive MBA program with global immersion experiences. Join leaders from Fortune 500 companies in this transformative 18-month program.'
    },
    {
      id: 5,
      title: 'Exclusive Caribbean Resort Package',
      category: 'Travel',
      location: 'Maldives',
      price: '$12,000',
      image: 'https://images.unsplash.com/photo-1540202404-1b927e3f3a1d?w=600&h=400&fit=crop',
      badge: 'Featured',
      views: 18765,
      featured: true,
      seller: 'Luxury Travel Co',
      flag: '🇲🇻',
      verified: true,
      rating: 4.9,
      sellerAvatar: 'https://ui-avatars.com/api/?name=Luxury+Travel&background=6C5CE7&color=fff',
      phone: '+960 333 1234',
      email: 'packages@luxurytravel.mv',
      website: 'https://luxurytravel.mv',
      postedDate: '1 day ago',
      memberSince: '2016',
      responses: 78,
      responseRate: '97%',
      images: [
        'https://images.unsplash.com/photo-1540202404-1b927e3f3a1d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'
      ],
      description: 'All-inclusive 7-day luxury resort package in the Maldives. Overwater villa, private chef, spa treatments, and water sports included.'
    },
    {
      id: 6,
      title: 'Premium Fashion Brand Partnership',
      category: 'Fashion',
      location: 'Paris, France',
      price: '€250,000',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      badge: 'Sponsored',
      views: 12345,
      featured: true,
      seller: 'Fashion House Paris',
      flag: '🇫🇷',
      verified: true,
      rating: 4.8,
      sellerAvatar: 'https://ui-avatars.com/api/?name=Fashion+House&background=E17055&color=fff',
      phone: '+33 1 42 86 83 45',
      email: 'partnerships@fashionhouse.fr',
      website: 'https://fashionhouse.fr',
      postedDate: '4 days ago',
      memberSince: '2012',
      responses: 34,
      responseRate: '94%',
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop'
      ],
      description: 'Exclusive partnership opportunity with established Parisian fashion brand. Looking for investors to expand into Asian markets. Projected 40% annual growth.'
    }
  ];

  const countries = [
    { value: 'all', label: 'All Countries', flag: '🌍' },
    { value: 'us', label: 'United States', flag: '🇺🇸' },
    { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'france', label: 'France', flag: '🇫🇷' },
    { value: 'germany', label: 'Germany', flag: '🇩🇪' },
    { value: 'italy', label: 'Italy', flag: '🇮🇹' },
    { value: 'spain', label: 'Spain', flag: '🇪🇸' },
    { value: 'japan', label: 'Japan', flag: '🇯🇵' },
    { value: 'china', label: 'China', flag: '🇨🇳' },
    { value: 'singapore', label: 'Singapore', flag: '🇸🇬' },
    { value: 'australia', label: 'Australia', flag: '🇦🇺' },
    { value: 'canada', label: 'Canada', flag: '🇨🇦' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsMapAnimating(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handler functions for premium features
  const handleQuickView = (advert) => {
    setQuickViewAdvert(advert);
    setShowQuickView(true);
  };

  const handleCloseQuickView = () => {
    setShowQuickView(false);
    setQuickViewAdvert(null);
  };

  const handleSaveAdvert = (advert) => {
    setSavedAdverts(prev => {
      const isSaved = prev.some(saved => saved.id === advert.id);
      if (isSaved) {
        return prev.filter(saved => saved.id !== advert.id);
      } else {
        return [...prev, advert];
      }
    });
  };

  const handleShareAdvert = (advert) => {
    if (navigator.share) {
      navigator.share({
        title: advert.title,
        text: `Check out this ${advert.badge} ${advert.category}: ${advert.title}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching with:', { searchQuery, selectedCategory, selectedCountry, priceRange });
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    console.log('Selected region:', region);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8">
            {/* Premium Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <FaCrown className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-semibold">The World's Most Featured Adverts</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Discover Featured Adverts
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  From Around the World
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Premium listings across all categories — hand‑picked, high‑visibility, and globally showcased.
              </p>
            </div>

            {/* Universal Search Bar */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search Input */}
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-200" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search featured adverts..."
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Category Select */}
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="all" className="bg-gray-900">All Categories</option>
                      {globalCategories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-gray-900">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <FaFilter className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200 pointer-events-none" />
                  </div>

                  {/* Country Select */}
                  <div className="relative">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      {countries.map(country => (
                        <option key={country.value} value={country.value} className="bg-gray-900">
                          {country.flag} {country.label}
                        </option>
                      ))}
                    </select>
                    <FaGlobe className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200 pointer-events-none" />
                  </div>
                </div>

                {/* Price Range */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      placeholder="Min Price"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      placeholder="Max Price"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <FaSearch className="h-4 w-4" />
                    <span>Search Featured</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <FaStar className="h-4 w-4 text-yellow-400" />
                <span>15,234 Featured Ads</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaGlobe className="h-4 w-4 text-blue-400" />
                <span>142 Countries</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEye className="h-4 w-4 text-green-400" />
                <span>2.3M Daily Views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Adverts Carousel */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Premium Featured Showcase
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Highest-tier sponsored adverts with maximum visibility
          </p>
        </div>
        <FeaturedCarousel adverts={featuredAdverts} />
      </div>

      {/* Engagement Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Activity Feed */}
            <div className="lg:col-span-2">
              <LiveActivityFeed />
            </div>
            
            {/* Trending Section */}
            <div>
              <TrendingSection />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Seller Profiles */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <FeaturedSellerProfiles />
      </div>

      {/* Post Featured Advert Button */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Sell?
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Post your featured advert and reach millions of potential buyers worldwide
            </p>
          </div>
          <button
            onClick={() => setShowPostingForm(true)}
            className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
          >
            <span>Post Featured Advert</span>
            <FaRocket className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Smart Filters Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <SmartFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          totalCount={featuredAdverts.length}
        />
      </div>

      {/* Global Category Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Global Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover premium listings from every corner of the world, organized by popular categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {globalCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02]"
              >
                {/* Trending Badge */}
                {category.trending && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <FaArrowUp className="h-3 w-3" />
                      <span>Trending</span>
                    </div>
                  </div>
                )}

                {/* Image Background */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Category Icon */}
                  <div className="absolute bottom-4 left-4">
                    <div className={`h-12 w-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className={`h-6 w-6 bg-gradient-to-br ${category.color} bg-clip-text text-transparent`} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                    <span className="text-sm font-semibold text-purple-600">
                      {category.featuredCount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Featured Ads</span>
                    <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
                      <span>Explore</span>
                      <FaArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Interactive Global Map */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Interactive Global Map
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Click on any region to explore featured adverts from around the world
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Map Container */}
            <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl h-96 overflow-hidden">
              {/* Simple World Map Representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Map Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-gradient-to-br from-blue-200 via-green-200 to-blue-200 rounded-2xl" />
                  </div>

                  {/* Enhanced Region Markers */}
                  {globalRegions.map((region) => (
                    <div
                      key={region.id}
                      onClick={() => handleRegionClick(region)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                        selectedRegion?.id === region.id ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                      }`}
                      style={{
                        left: `${region.coordinates.x}%`,
                        top: `${region.coordinates.y}%`
                      }}
                    >
                      {/* Enhanced Pulse Animation */}
                      <div className={`absolute inset-0 rounded-full bg-purple-400 opacity-30 ${
                        isMapAnimating ? 'animate-ping' : ''
                      }`} />
                      
                      {/* Region Marker with Enhanced Design */}
                      <div className={`relative h-16 w-16 bg-white rounded-full shadow-lg flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                        selectedRegion?.id === region.id 
                          ? 'border-purple-500 bg-purple-50 shadow-xl' 
                          : 'border-gray-300 hover:border-purple-400 hover:shadow-xl'
                      }`}>
                        <span className="text-2xl mb-1">{region.flag}</span>
                        <div className="text-xs font-bold text-gray-700 text-center">
                          {region.featuredCount > 9999 
                            ? `${(region.featuredCount / 1000).toFixed(1)}k` 
                            : region.featuredCount
                          }
                        </div>
                      </div>

                      {/* Enhanced Region Tooltip */}
                      {selectedRegion?.id === region.id && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-gray-900 text-white p-4 rounded-xl shadow-xl z-30 w-72">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{region.flag}</span>
                              <h4 className="font-bold text-lg">{region.name}</h4>
                            </div>
                            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              ACTIVE
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Featured Ads:</span>
                              <span className="font-semibold text-yellow-400">{region.featuredCount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Average Price:</span>
                              <span className="font-semibold text-green-400">{region.avgPrice}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-700">
                              <div className="text-xs text-gray-400 mb-2">Trending Categories:</div>
                              <div className="flex flex-wrap gap-1">
                                {region.trendingCategories.map((cat, index) => (
                                  <span key={index} className="text-xs bg-purple-600 px-2 py-1 rounded text-white">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                              Explore {region.name} Listings →
                            </button>
                          </div>
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-2">
                            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Enhanced Map Controls */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <button
                      onClick={() => setIsMapAnimating(!isMapAnimating)}
                      className="h-10 w-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                      title={isMapAnimating ? "Pause Animation" : "Play Animation"}
                    >
                      {isMapAnimating ? (
                        <FaPause className="h-4 w-4 text-gray-600" />
                      ) : (
                        <FaPlay className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedRegion(null)}
                      className="h-10 w-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                      title="Clear Selection"
                    >
                      <FaTimes className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Region Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
              {globalRegions.map((region) => (
                <div
                  key={region.id}
                  onClick={() => handleRegionClick(region)}
                  className={`text-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedRegion?.id === region.id
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{region.flag}</div>
                  <div className="text-sm font-bold text-gray-900">{region.name}</div>
                  <div className="text-xs text-gray-500">
                    {region.featuredCount > 9999 
                      ? `${(region.featuredCount / 1000).toFixed(1)}k ads` 
                      : `${region.featuredCount} ads`
                    }
                  </div>
                  {selectedRegion?.id === region.id && (
                    <div className="mt-2 text-xs text-purple-600 font-medium">
                      ✓ Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Adverts Listing with Enhanced Features */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Premium Featured Adverts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hand-picked listings from verified sellers worldwide
          </p>
          
          {/* Additional Stats Bar */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center space-x-2">
              <FaCrown className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Premium Quality</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCheckCircle className="h-4 w-4 text-green-500" />
              <span className="font-medium">Verified Sellers</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaGlobe className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Global Reach</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaRocket className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Fast Results</span>
            </div>
          </div>
        </div>

        {/* Featured Adverts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredAdverts.map((advert) => (
            <PremiumAdvertCard
              key={advert.id}
              advert={advert}
              onQuickView={handleQuickView}
              onSave={handleSaveAdvert}
              onShare={handleShareAdvert}
            />
          ))}
        </div>

        {/* Enhanced Load More Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Discover More Premium Listings
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied buyers who found their perfect match through our featured adverts
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-orange-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg">
                Load More Featured Adverts
              </button>
              <button 
                onClick={() => setShowPostingForm(true)}
                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border-2 border-purple-200"
              >
                List Your Advert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        advert={quickViewAdvert}
        isOpen={showQuickView}
        onClose={handleCloseQuickView}
        onSave={handleSaveAdvert}
        onShare={handleShareAdvert}
      />

      {/* Premium Posting Form Modal */}
      <PremiumPostingForm
        isOpen={showPostingForm}
        onClose={() => setShowPostingForm(false)}
      />

      {/* Page Upsell Section */}
      <PageUpsellSection />
    </div>
  );
};

export default FeaturedAdvertsPage;
