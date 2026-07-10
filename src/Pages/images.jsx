import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Loader2 } from 'lucide-react';
import ImagesGrid from '../Component/images/ImagesGrid';
import ImagesFiltersSidebar from '../Component/images/ImagesFiltersSidebar';
import imagesApi from '../services/imagesAPI';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';

const ImagesPage = () => {
  const [images, setImages] = useState([]);
  const [featuredImages, setFeaturedImages] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load images with filters
      const imagesRes = await imagesApi.getImages(filters);
      setImages(imagesRes.data?.data || []);
      
      // Load featured images and statistics only on initial load (no filters)
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
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <UnifiedNavbar showBackButton={true} />

      {/* Category Header */}
      <div className="bg-white border-b pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Images & Media</h1>
              <p className="text-gray-600 mb-2">
                Buy and sell admin-verified images for commercial and personal use.
              </p>
              {statistics.total_images && (
                <p className="text-sm text-gray-500">
                  {statistics.total_images.toLocaleString()} images • {statistics.verified_creators?.toLocaleString() || 0} verified creators
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="hidden lg:block">
            <ImagesFiltersSidebar filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Images Grid */}
          <div className="flex-1">
            {/* Featured Section */}
            {featuredImages.length > 0 && Object.keys(filters).length === 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredImages.slice(0, 4).map(image => (
                    <ImagesGrid key={image.id} images={[image]} loading={false} />
                  ))}
                </div>
              </div>
            )}

            {/* All Images Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {Object.keys(filters).length > 0 ? 'Search Results' : 'All Images'}
                </h2>
                {images.length > 0 && (
                  <span className="text-sm text-gray-600">{images.length} images</span>
                )}
              </div>
              <ImagesGrid images={images} loading={loading} error={error} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ImagesPage;
