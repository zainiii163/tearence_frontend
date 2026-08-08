import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImagesGrid from '../Component/images/ImagesGrid';
import ImagesFiltersSidebar from '../Component/images/ImagesFiltersSidebar';
import imagesApi from '../services/imagesAPI';
import BrowseMarketplaceHero from '../Component/shared/BrowseMarketplaceHero';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import { getCategoryTheme } from '../constants/categoryThemes';
import useAuthRedirect from '../hooks/useAuthRedirect';

const HERO_BG =
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=80';

const ImagesPage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const [images, setImages] = useState([]);
  const [featuredImages, setFeaturedImages] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(true);
  const [topSearch, setTopSearch] = useState('');

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const imagesRes = await imagesApi.getImages(filters);
      const imageList = imagesRes?.data?.data ?? imagesRes?.data ?? [];
      setImages(Array.isArray(imageList) ? imageList : []);

      if (Object.keys(filters).length === 0) {
        const [featuredRes, statsRes] = await Promise.all([
          imagesApi.getFeaturedImages().catch(() => ({ data: [] })),
          imagesApi.getStatistics().catch(() => ({ data: {} })),
        ]);
        const featured = featuredRes?.data || [];
        setFeaturedImages(Array.isArray(featured) ? featured : []);
        setStatistics(statsRes?.data || {});
      }

      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load images');
      setImages([]);
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const next = { ...prev, [filterType]: value };
      if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
        delete next[filterType];
      }
      return next;
    });
  };

  const applyTopSearch = () => {
    handleFilterChange('search', topSearch.trim() || null);
  };

  const clearFilters = () => {
    setFilters({});
    setTopSearch('');
  };

  const handleSellMedia = () => {
    if (requireAuth('/post-images', 'You must be logged in to sell images or short videos.')) {
      navigate('/post-images');
    }
  };

  const activeCount = Object.values(filters).filter(
    (v) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0)
  ).length;
  const theme = getCategoryTheme('images');

  return (
    <CategoryPageShell
      categoryId="images"
      backHref="/"
      hero={
        <BrowseMarketplaceHero
          title="Stock Images & Media"
          eyebrow=""
          imageUrl={HERO_BG}
          theme={theme.heroTheme}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
          searchPlaceholder="Search images…"
          heroChips={[
            { to: '/images', label: 'Stock Images' },
            { to: '/images/videos', label: 'Video Templates' },
          ]}
        />
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: () => {},
        onClear: clearFilters,
        theme: theme.filterTheme,
        homeHref: '/images',
        activeCount,
        filterFields: (
          <ImagesFiltersSidebar filters={filters} onFilterChange={handleFilterChange} />
        ),
      }}
      bottomCta={{
        buttonLabel: 'List your images, stock, or media',
        onPostClick: handleSellMedia,
        theme: theme.ctaTheme,
        buttonOnly: true,
      }}
    >
          {featuredImages.length > 0 && Object.keys(filters).length === 0 && (
            <div className="mb-6">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">Featured</h2>
              <ImagesGrid images={featuredImages.slice(0, 8)} loading={false} error={null} />
            </div>
          )}

          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
              {Object.keys(filters).length > 0 ? 'Search results' : 'All images'}
            </h2>
            <ImagesGrid images={images} loading={loading} error={error} />
          </div>
    </CategoryPageShell>
  );
};

export default ImagesPage;
