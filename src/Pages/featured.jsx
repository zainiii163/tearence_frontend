import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Globe, 
  Star, 
  Crown, 
  Rocket,
  Home,
  Car,
  Briefcase,
  Laptop,
  Shirt,
  Plane,
  Ticket,
  Cat,
  Sprout,
  Heart,
  GraduationCap,
  Filter,
  MapPin,
  Eye,
  ArrowRight,
  Play,
  Pause,
  CheckCircle,
  X,
  Plus,
  ChevronRight,
  User,
  Building,
  Phone,
  Mail,
  MessageCircle,
  Heart as HeartIcon,
  Share2,
  Camera,
  Video,
  FileText,
  Map,
  CreditCard,
  Shield,
  TrendingUp,
  Clock,
  DollarSign,
  Tag,
  Package,
  Award,
  Zap,
  Target,
  BarChart3,
  Users,
  Calendar,
  CheckSquare
} from 'lucide-react';
import FeaturedNavbar from '../Component/featured/FeaturedNavbar';
import FeaturedHero from '../Component/featured/FeaturedHero';
import FeaturedCategoryGrid from '../Component/featured/FeaturedCategoryGrid';
import FeaturedFilters from '../Component/featured/FeaturedFilters';
import FeaturedGrid from '../Component/featured/FeaturedGrid';
import FeaturedActivityFeed from '../Component/featured/FeaturedActivityFeed';
import FeaturedSellerProfile from '../Component/featured/FeaturedSellerProfile';
import FeaturedPostForm from '../Component/featured/FeaturedPostForm';
import FeaturedFooter from '../Component/featured/FeaturedFooter';

const FeaturedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSellerProfile, setShowSellerProfile] = useState(null);
  const [savedAdverts, setSavedAdverts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Auto-show post form if URL parameter is present
  useEffect(() => {
    if (searchParams.get('postForm') === 'true') {
      setShowPostForm(true);
    }
  }, [searchParams]);

  // Featured categories with international appeal
  const featuredCategories = [
    {
      id: 'property',
      name: 'Property',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      featuredCount: 1247,
      color: 'from-blue-500 to-cyan-500',
      trending: true
    },
    {
      id: 'vehicles',
      name: 'Cars & Vehicles',
      icon: Car,
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
      featuredCount: 892,
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'jobs',
      name: 'Jobs & Services',
      icon: Briefcase,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      featuredCount: 2156,
      color: 'from-purple-500 to-pink-500',
      trending: true
    },
    {
      id: 'business',
      name: 'Business Opportunities',
      icon: Rocket,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      featuredCount: 634,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'electronics',
      name: 'Electronics',
      icon: Laptop,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
      featuredCount: 1567,
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 'fashion',
      name: 'Fashion & Beauty',
      icon: Shirt,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      featuredCount: 923,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'travel',
      name: 'Travel & Experiences',
      icon: Plane,
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      featuredCount: 445,
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'events',
      name: 'Events & Tickets',
      icon: Ticket,
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
      featuredCount: 312,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'pets',
      name: 'Pets & Animals',
      icon: Cat,
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
      featuredCount: 278,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'home-garden',
      name: 'Home & Garden',
      icon: Sprout,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      featuredCount: 534,
      color: 'from-lime-500 to-green-500'
    },
    {
      id: 'health',
      name: 'Health & Wellness',
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
      featuredCount: 412,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'education',
      name: 'Education & Courses',
      icon: GraduationCap,
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
      featuredCount: 189,
      color: 'from-blue-600 to-indigo-600'
    }
  ];

  // Sample featured adverts data
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
      seller: {
        name: 'Elite Properties',
        avatar: 'https://ui-avatars.com/api/?name=Elite+Properties&background=0D8ABC&color=fff',
        phone: '+1 555-0123',
        email: 'contact@eliteproperties.com',
        website: 'https://eliteproperties.com',
        verified: true,
        rating: 4.8,
        memberSince: '2018',
        responseRate: '98%',
        totalListings: 47
      },
      flag: '🇺🇸',
      postedDate: '2 days ago',
      description: 'Stunning luxury penthouse in the heart of Manhattan with panoramic city views.',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1600566753376-12c8e0c7a8a7?w=600&h=400&fit=crop'
      ]
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
      seller: {
        name: 'Classic Motors',
        avatar: 'https://ui-avatars.com/api/?name=Classic+Motors&background=FF6B6B&color=fff',
        phone: '+39 02 1234 5678',
        email: 'info@classicmotors.it',
        website: 'https://classicmotors.it',
        verified: true,
        rating: 4.9,
        memberSince: '2015',
        responseRate: '96%',
        totalListings: 89
      },
      flag: '🇮🇹',
      postedDate: '1 week ago',
      description: 'Immaculate 1962 Ferrari 250 GT Berlinetta. One of the most iconic classic cars ever made.',
      images: [
        'https://images.unsplash.com/photo-1583121274602-3e2820c6f88b?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop'
      ]
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
      seller: {
        name: 'Venture Capital Ltd',
        avatar: 'https://ui-avatars.com/api/?name=Venture+Capital&background=4ECDC4&color=fff',
        phone: '+44 20 7123 4567',
        email: 'invest@venturecap.co.uk',
        website: 'https://venturecap.co.uk',
        verified: true,
        rating: 4.7,
        memberSince: '2019',
        responseRate: '92%',
        totalListings: 23
      },
      flag: '🇬🇧',
      postedDate: '3 days ago',
      description: 'Exclusive investment opportunity in a high-growth AI startup. Projected 300% ROI within 3 years.',
      images: [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'
      ]
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
      seller: {
        name: 'Global Business School',
        avatar: 'https://ui-avatars.com/api/?name=Global+Business+School&background=FFD93D&color=333',
        phone: '+65 6123 4567',
        email: 'admissions@gbs.edu.sg',
        website: 'https://gbs.edu.sg',
        verified: true,
        rating: 4.6,
        memberSince: '2010',
        responseRate: '99%',
        totalListings: 156
      },
      flag: '🇸🇬',
      postedDate: '5 days ago',
      description: 'Top-ranked Executive MBA program with global immersion experiences.',
      images: [
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop'
      ]
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
      seller: {
        name: 'Luxury Travel Co',
        avatar: 'https://ui-avatars.com/api/?name=Luxury+Travel&background=6C5CE7&color=fff',
        phone: '+960 333 1234',
        email: 'packages@luxurytravel.mv',
        website: 'https://luxurytravel.mv',
        verified: true,
        rating: 4.9,
        memberSince: '2016',
        responseRate: '97%',
        totalListings: 78
      },
      flag: '🇲🇻',
      postedDate: '1 day ago',
      description: 'All-inclusive 7-day luxury resort package in the Maldives. Overwater villa, private chef, spa treatments.',
      images: [
        'https://images.unsplash.com/photo-1540202404-1b927e3f3a1d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'
      ]
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
      seller: {
        name: 'Fashion House Paris',
        avatar: 'https://ui-avatars.com/api/?name=Fashion+House&background=E17055&color=fff',
        phone: '+33 1 42 86 83 45',
        email: 'partnerships@fashionhouse.fr',
        website: 'https://fashionhouse.fr',
        verified: true,
        rating: 4.8,
        memberSince: '2012',
        responseRate: '94%',
        totalListings: 34
      },
      flag: '🇫🇷',
      postedDate: '4 days ago',
      description: 'Exclusive partnership opportunity with established Parisian fashion brand.',
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop'
      ]
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

  // Handler functions
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching with:', { searchQuery, selectedCategory, selectedCountry, priceRange });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
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

  const handleViewAdvert = (advert) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== advert.id);
      return [advert, ...filtered].slice(0, 10);
    });
  };

  const handleSellerProfileClick = (seller) => {
    setShowSellerProfile(seller);
  };

  const handleClosePostForm = () => {
    setShowPostForm(false);
    // Remove postForm parameter from URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('postForm');
    setSearchParams(newSearchParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <FeaturedNavbar />

      {/* Hero Section */}
      <FeaturedHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        onSearch={handleSearch}
        onPostAdvert={() => setShowPostForm(true)}
      />

      {/* Featured Category Grid */}
      <FeaturedCategoryGrid 
        categories={featuredCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Filters and Sorting */}
      <FeaturedFilters
        categories={featuredCategories}
        countries={countries}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Featured Adverts Grid */}
      <FeaturedGrid
        adverts={featuredAdverts}
        viewMode={viewMode}
        savedAdverts={savedAdverts}
        onSaveAdvert={handleSaveAdvert}
        onViewAdvert={handleViewAdvert}
        onSellerProfileClick={handleSellerProfileClick}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Activity Feed and Engagement */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Activity Feed */}
          <div className="lg:col-span-2">
            <FeaturedActivityFeed />
          </div>
          
          {/* Recently Viewed */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-600" />
                Recently Viewed
              </h3>
              {recentlyViewed.length > 0 ? (
                <div className="space-y-3">
                  {recentlyViewed.slice(0, 5).map(advert => (
                    <div key={advert.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <img src={advert.image} alt={advert.title} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{advert.title}</p>
                        <p className="text-xs text-gray-500">{advert.location} • {advert.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No recently viewed adverts</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Feature Your Advert?
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Join thousands of premium sellers who trust Featured Adverts for maximum visibility
            </p>
          </div>
          <button
            onClick={() => setShowPostForm(true)}
            className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
          >
            <span>Post Featured Advert</span>
            <Rocket className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <FeaturedFooter />

      {/* Post Form Modal */}
      {showPostForm && (
        <FeaturedPostForm onClose={handleClosePostForm} />
      )}

      {/* Seller Profile Modal */}
      {showSellerProfile && (
        <FeaturedSellerProfile 
          seller={showSellerProfile} 
          onClose={() => setShowSellerProfile(null)} 
        />
      )}
    </div>
  );
};

export default FeaturedPage;
