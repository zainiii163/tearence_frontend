import React, { useState, useEffect } from 'react';
import ImagesGrid from '../Component/images/ImagesGrid';
import ImagesFiltersSidebar from '../Component/images/ImagesFiltersSidebar';
import imagesApi from '../services/imagesAPI';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import BrowseMarketplaceHero from '../Component/shared/BrowseMarketplaceHero';
import { BrowseFilterLayout } from '../Component/shared/BrowseFilterLayout';

const HERO_BG =
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1920&q=80';

const ImagesPage = () => {
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
          imagesApi.getFeaturedImages(),
          imagesApi.getStatistics(),
        ]);
        setFeaturedImages(featuredRes.data || []);
        setStatistics(statsRes.data || {});
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
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
            : 'Buy and sell admin-verified images for commercial and personal use'
        }
        imageUrl={HERO_BG}
        theme="violet"
        searchValue={topSearch}
        onSearchChange={(e) => setTopSearch(e.target.value)}
        onSearchSubmit={applyTopSearch}
        searchPlaceholder="Search images…"
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
      </div>

      <Footer />
    </div>
  );
};

export default ImagesPage;
