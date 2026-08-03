import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ImagesGrid from '../Component/images/ImagesGrid';
import ImagesFiltersSidebar from '../Component/images/ImagesFiltersSidebar';
import imagesApi from '../services/imagesAPI';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import BrowseMarketplaceHero from '../Component/shared/BrowseMarketplaceHero';
import { BrowseFilterLayout } from '../Component/shared/BrowseFilterLayout';
import BrowseBottomPostCta from '../Component/shared/BrowseBottomPostCta';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { filterImagesStockDemo, IMAGES_STOCK_DEMO } from '../data/imagesStockDemo';

const HERO_BG =
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=80';

const mergeImages = (apiList, filters) => {
  const demo = filterImagesStockDemo(filters);
  const seen = new Set();
  const merged = [];

  [...(Array.isArray(apiList) ? apiList : []), ...demo].forEach((item) => {
    const key = String(item.slug || item.id || item.title);
    if (seen.has(key)) return;
    // Prefer real photos over lorem/placeholder titles when slugs collide
    seen.add(key);
    merged.push(item);
  });

  // If API only returned sparse/placeholder rows, keep demos first so the grid fills
  if (!apiList?.length || apiList.length < 3) {
    const demoIds = new Set(demo.map((d) => d.id));
    const apiOnly = (apiList || []).filter((a) => !demoIds.has(a.id));
    return [...demo, ...apiOnly];
  }

  return merged;
};

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

      let imageList = [];
      try {
        const imagesRes = await imagesApi.getImages(filters);
        imageList = imagesRes?.data?.data ?? imagesRes?.data ?? [];
        if (!Array.isArray(imageList)) imageList = [];
      } catch (apiErr) {
        console.warn('Images API unavailable, using stock demos', apiErr);
        imageList = [];
      }

      setImages(mergeImages(imageList, filters));

      if (Object.keys(filters).length === 0) {
        try {
          const [featuredRes, statsRes] = await Promise.all([
            imagesApi.getFeaturedImages(),
            imagesApi.getStatistics(),
          ]);
          const featured = featuredRes?.data || [];
          setFeaturedImages(
            Array.isArray(featured) && featured.length
              ? featured
              : IMAGES_STOCK_DEMO.filter((i) => i.promotion_tier === 'featured').slice(0, 6)
          );
          const stats = statsRes?.data || {};
          setStatistics({
            ...stats,
            total_images: Math.max(
              Number(stats.total_images) || 0,
              mergeImages(imageList, filters).length
            ),
          });
        } catch {
          setFeaturedImages(IMAGES_STOCK_DEMO.filter((i) => i.promotion_tier === 'featured').slice(0, 6));
          setStatistics({ total_images: IMAGES_STOCK_DEMO.length });
        }
      }

      setLoading(false);
    } catch (err) {
      setImages(filterImagesStockDemo(filters));
      setError(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton />

      <BrowseMarketplaceHero
        title="Stock Images & Media"
        eyebrow="Images"
        subtitle={
          statistics.total_images
            ? `${Number(statistics.total_images).toLocaleString()} images · buy & sell verified media`
            : 'Buy and sell admin-verified images and short video templates'
        }
        imageUrl={HERO_BG}
        theme="violet"
        searchValue={topSearch}
        onSearchChange={(e) => setTopSearch(e.target.value)}
        onSearchSubmit={applyTopSearch}
        searchPlaceholder="Search images…"
        heroChips={[
          { to: '/images', label: 'Stock Images' },
          { to: '/images/videos', label: 'Video Templates' },
        ]}
      />

      <div className="page-container py-4 sm:py-6">
        <BrowseFilterLayout
          open={showFilters}
          onOpenChange={setShowFilters}
          onApply={() => {}}
          onClear={clearFilters}
          theme="purple"
          homeHref="/images"
          activeCount={activeCount}
          filterFields={
            <ImagesFiltersSidebar filters={filters} onFilterChange={handleFilterChange} />
          }
          toolbarLeft={
            <p className="text-sm text-gray-600">
              {loading ? 'Loading…' : `${images.length} images`}
            </p>
          }
        >
          {featuredImages.length > 0 && Object.keys(filters).length === 0 && (
            <div className="mb-6">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">Featured</h2>
              <ImagesGrid images={featuredImages.slice(0, 4)} loading={false} />
            </div>
          )}

          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
              {Object.keys(filters).length > 0 ? 'Search results' : 'All images'}
            </h2>
            <ImagesGrid images={images} loading={loading} error={error} />
          </div>
        </BrowseFilterLayout>

        <BrowseBottomPostCta
          title="Sell your stock images or short video adverts"
          description="Upload verified media for commercial and personal use worldwide."
          buttonLabel="Start selling"
          onPostClick={handleSellMedia}
          theme="purple"
        />
      </div>

      <Footer />
    </div>
  );
};

export default ImagesPage;
