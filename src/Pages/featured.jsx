import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, Rocket } from 'lucide-react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import FeaturedHero from '../Component/featured/FeaturedHero';
import FeaturedCategoryGrid from '../Component/featured/FeaturedCategoryGrid';
import FeaturedFilters from '../Component/featured/FeaturedFilters';
import FeaturedGrid from '../Component/featured/FeaturedGrid';
import FeaturedActivityFeed from '../Component/featured/FeaturedActivityFeed';
import FeaturedSellerProfile from '../Component/featured/FeaturedSellerProfile';
import FeaturedFooter from '../Component/featured/FeaturedFooter';
import FeaturedPostForm from '../Component/featured/FeaturedPostForm';
import { featuredAdvertsAPI } from '../api/featuredAdverts';
import '../styles/featured.css';

const FeaturedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSellerProfile, setShowSellerProfile] = useState(null);
  const [savedAdverts, setSavedAdverts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Real API state
  const [adverts, setAdverts] = useState([]);
  const [advertsMeta, setAdvertsMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advertsLoading, setAdvertsLoading] = useState(false);

  const countries = [
    { value: 'all', label: 'All Countries', flag: '🌍' },
    { value: 'United States', label: 'United States', flag: '🇺🇸' },
    { value: 'United Kingdom', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'France', label: 'France', flag: '🇫🇷' },
    { value: 'Germany', label: 'Germany', flag: '🇩🇪' },
    { value: 'Italy', label: 'Italy', flag: '🇮🇹' },
    { value: 'Spain', label: 'Spain', flag: '🇪🇸' },
    { value: 'Japan', label: 'Japan', flag: '🇯🇵' },
    { value: 'China', label: 'China', flag: '🇨🇳' },
    { value: 'Singapore', label: 'Singapore', flag: '🇸🇬' },
    { value: 'Australia', label: 'Australia', flag: '🇦🇺' },
    { value: 'Canada', label: 'Canada', flag: '🇨🇦' },
    { value: 'UAE', label: 'UAE', flag: '🇦🇪' },
    { value: 'Nigeria', label: 'Nigeria', flag: '🇳🇬' },
  ];

  // Auto-show post form if URL parameter is present
  useEffect(() => {
    if (searchParams.get('postForm') === 'true') {
      setShowPostForm(true);
    }
  }, [searchParams]);

  // Load initial data: categories + statistics
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [catRes, statsRes] = await Promise.allSettled([
          featuredAdvertsAPI.getCategoryGrid(),
          featuredAdvertsAPI.getStatistics(),
        ]);
        if (catRes.status === 'fulfilled' && catRes.value?.success) {
          setCategories(catRes.value.data || []);
        }
        if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
          setStatistics(statsRes.value.data);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Load adverts whenever filters change
  const loadAdverts = useCallback(async () => {
    setAdvertsLoading(true);
    try {
      const params = {
        per_page: 20,
        page: currentPage,
        sort_by: sortBy,
      };
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'all') params.category_id = selectedCategory;
      if (selectedCountry !== 'all') params.country = selectedCountry;
      if (priceRange.min) params.min_price = priceRange.min;
      if (priceRange.max) params.max_price = priceRange.max;

      const res = await featuredAdvertsAPI.getFeaturedAdverts(params);
      if (res?.success) {
        setAdverts(res.data?.data || []);
        setAdvertsMeta(res.data);
      }
    } catch (err) {
      console.error('Failed to load adverts:', err);
      setAdverts([]);
    } finally {
      setAdvertsLoading(false);
    }
  }, [currentPage, sortBy, searchQuery, selectedCategory, selectedCountry, priceRange]);

  useEffect(() => {
    loadAdverts();
  }, [loadAdverts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadAdverts();
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(String(categoryId));
    setCurrentPage(1);
  };

  const handleSaveAdvert = async (advert) => {
    setSavedAdverts(prev => {
      const isSaved = prev.some(saved => saved.id === advert.id);
      if (isSaved) return prev.filter(saved => saved.id !== advert.id);
      return [...prev, advert];
    });
    try {
      await featuredAdvertsAPI.saveAdvert(advert.id);
    } catch (err) {
      console.error('Failed to save advert:', err);
    }
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
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('postForm');
    setSearchParams(newSearchParams);
    loadAdverts();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UnifiedNavbar showBackButton={true} />

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
        statistics={statistics}
        countries={countries}
      />

      <FeaturedCategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        loading={loading}
      />

      <FeaturedFilters
        categories={categories}
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

      <FeaturedGrid
        adverts={adverts}
        loading={advertsLoading}
        viewMode={viewMode}
        savedAdverts={savedAdverts}
        onSaveAdvert={handleSaveAdvert}
        onViewAdvert={handleViewAdvert}
        onSellerProfileClick={handleSellerProfileClick}
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        meta={advertsMeta}
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FeaturedActivityFeed />
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-600" />
                Recently Viewed
              </h3>
              {recentlyViewed.length > 0 ? (
                <div className="space-y-3">
                  {recentlyViewed.slice(0, 5).map(advert => {
                    const mainImage = advert.images?.[0]
                      ? (advert.images[0].startsWith('http') ? advert.images[0] : `${process.env.REACT_APP_STORAGE_URL || 'https://api.worldwideadverts.info/storage'}/${advert.images[0]}`)
                      : 'https://via.placeholder.com/64x64?text=No+Image';
                    return (
                      <div key={advert.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <img src={mainImage} alt={advert.title} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{advert.title}</p>
                          <p className="text-xs text-gray-500">{advert.city}, {advert.country} • {advert.formatted_price || advert.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No recently viewed adverts</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Feature Your Advert?
          </h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-6">
            Join thousands of premium sellers who trust Featured Adverts for maximum visibility
          </p>
        </div>
      </div>

      <FeaturedFooter />

      {showPostForm && (
        <FeaturedPostForm onClose={handleClosePostForm} />
      )}

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
