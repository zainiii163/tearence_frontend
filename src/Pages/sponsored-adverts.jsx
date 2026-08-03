import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, Loader2, Plus } from 'lucide-react';
import useAuthRedirect from '../hooks/useAuthRedirect';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import SponsoredHero from '../Component/sponsored/SponsoredHero';
import SponsoredCategoryGrid from '../Component/sponsored/SponsoredCategoryGrid';
import SponsoredAdvertCard from '../Component/sponsored/SponsoredAdvertCard';
import SponsoredFilters from '../Component/sponsored/SponsoredFilters';
import SponsoredActivityFeed from '../Component/sponsored/SponsoredActivityFeed';
import SponsoredPostForm from '../Component/sponsored/SponsoredPostForm';
import sponsoredAdvertsAPI from '../api/sponsoredAdvertsAPI';
import { useSearchParams, useNavigate } from 'react-router-dom';

/**
 * Clive: public feed of sponsored ads across categories — no platform counters.
 * Layout mirrors promoted page (main feed + trending sidebar).
 */
const SponsoredAdvertsPage = () => {
  const { requireAuth } = useAuthRedirect();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [adverts, setAdverts] = useState([]);
  const [featuredAdverts, setFeaturedAdverts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('mostRecent');
  const [showPostForm, setShowPostForm] = useState(false);
  const [savedAdverts, setSavedAdverts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 12,
  });

  const handleCloseModal = () => {
    setShowPostForm(false);
    navigate('/sponsored-adverts', { replace: true });
  };

  const handlePostSponsored = () => {
    if (requireAuth('/sponsored-adverts?postForm=true', 'You must be logged in to post a sponsored advert.')) {
      setShowPostForm(true);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await sponsoredAdvertsAPI.createSponsoredAdvert(formData);
      if (response.success) {
        alert('Sponsored advert created successfully!');
        handleCloseModal();
        await loadAdverts(1);
      } else {
        setError(response.message || 'Failed to create sponsored advert');
      }
    } catch (err) {
      setError(err.message || 'Failed to create sponsored advert');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('postForm') === 'true') {
      if (requireAuth('/sponsored-adverts?postForm=true', 'You must be logged in to post a sponsored advert.')) {
        setShowPostForm(true);
      }
    }
  }, [searchParams]);

  const normalizeList = (payload) => {
    if (!payload) return { rows: [], meta: null };
    // site-feed: { success, data: { data, current_page, ... } }
    if (payload.data?.data && Array.isArray(payload.data.data)) {
      return { rows: payload.data.data, meta: payload.data };
    }
    if (Array.isArray(payload.data)) {
      return { rows: payload.data, meta: payload.meta || payload };
    }
    return { rows: [], meta: null };
  };

  const loadAdverts = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          per_page: pagination.perPage,
          page,
          search: searchQuery || undefined,
          country: selectedCountry || undefined,
        };

        let response = await sponsoredAdvertsAPI.getSiteFeed(params);
        let { rows, meta } = normalizeList(response);

        // Fallback to dedicated sponsored table if site-feed empty / unavailable
        if (!rows.length) {
          response = await sponsoredAdvertsAPI.getSponsoredAdverts({
            per_page: pagination.perPage,
            page,
            search: searchQuery || undefined,
            country: selectedCountry || undefined,
            category_id: selectedCategory || undefined,
          });
          ({ rows, meta } = normalizeList(response));
        }

        // Client category filter for cross-feed (source_label / category_name)
        if (selectedCategory && rows.length) {
          const catName =
            categories.find((c) => String(c.id) === String(selectedCategory))?.name ||
            String(selectedCategory);
          rows = rows.filter((ad) => {
            const hay = `${ad.category_name || ''} ${ad.source_label || ''} ${ad.source || ''}`.toLowerCase();
            return hay.includes(String(catName).toLowerCase()) || String(ad.category_id) === String(selectedCategory);
          });
        }

        if (sortBy === 'mostViewed') {
          rows = [...rows].sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
        }

        setAdverts(rows);
        if (meta) {
          setPagination((prev) => ({
            ...prev,
            currentPage: meta.current_page || page,
            totalPages: meta.last_page || 1,
            total: meta.total || rows.length,
            perPage: meta.per_page || prev.perPage,
          }));
        } else {
          setPagination((prev) => ({ ...prev, currentPage: page, total: rows.length }));
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load sponsored adverts');
        setAdverts([]);
      } finally {
        setLoading(false);
      }
    },
    [pagination.perPage, searchQuery, selectedCountry, selectedCategory, categories, sortBy]
  );

  useEffect(() => {
    (async () => {
      try {
        const [catRes, featuredRes] = await Promise.allSettled([
          sponsoredAdvertsAPI.getCategories(),
          sponsoredAdvertsAPI.getFeaturedAdverts(),
        ]);
        if (catRes.status === 'fulfilled' && catRes.value?.success) {
          const categoriesData = Array.isArray(catRes.value.data)
            ? catRes.value.data
            : catRes.value.data?.data || [];
          setCategories(categoriesData);
        }
        if (featuredRes.status === 'fulfilled' && featuredRes.value?.success) {
          const featured = Array.isArray(featuredRes.value.data)
            ? featuredRes.value.data
            : featuredRes.value.data?.data || [];
          setFeaturedAdverts(featured.slice(0, 8));
        }
      } catch {
        /* ignore */
      }
    })();
  }, []);

  useEffect(() => {
    loadAdverts(1);
  }, [searchQuery, selectedCategory, selectedCountry, sortBy]);

  const handleSearch = (query) => {
    setSearchQuery(query || '');
  };

  const handleSaveAdvert = async (advertId) => {
    if (!requireAuth('/sponsored-adverts', 'You must be logged in to save adverts.')) return;
    try {
      await sponsoredAdvertsAPI.saveAdvert?.(advertId);
      setSavedAdverts((prev) =>
        prev.includes(advertId) ? prev.filter((id) => id !== advertId) : [...prev, advertId]
      );
    } catch (err) {
      console.error('Save advert failed:', err);
    }
  };

  const handleViewAdvert = (advert) => {
    const href = advert.href || `/sponsored-adverts/${advert.slug || advert.id}`;
    navigate(href);
  };

  if (loading && adverts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Sponsored Adverts...</p>
        </div>
      </div>
    );
  }

  if (error && adverts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => loadAdverts(1)}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton backHref="/" />

      <SponsoredHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onPostAdvert={handlePostSponsored}
      />

      <div className="page-container py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-3 space-y-6">
            {featuredAdverts.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Featured Sponsored</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredAdverts.slice(0, 4).map((advert) => (
                    <SponsoredAdvertCard
                      key={`feat-${advert.sponsored_advert_id || advert.id}`}
                      advert={advert}
                      viewMode="grid"
                      isSaved={savedAdverts.includes(advert.sponsored_advert_id || advert.id)}
                      onSave={() => handleSaveAdvert(advert.sponsored_advert_id || advert.id)}
                      onView={() => handleViewAdvert(advert)}
                    />
                  ))}
                </div>
              </section>
            )}

            <SponsoredCategoryGrid
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    <Filter className="w-4 h-4" />
                    Refine
                  </button>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{pagination.total || adverts.length} listings</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="mostRecent">Most Recent</option>
                    <option value="mostViewed">Most Viewed</option>
                  </select>
                  <button
                    type="button"
                    onClick={handlePostSponsored}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-2"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Post
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-4 overflow-hidden"
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

              {loading && adverts.length > 0 ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Updating feed…</p>
                </div>
              ) : adverts.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  <p className="font-medium">No sponsored adverts found</p>
                  <p className="text-sm mt-1">Sponsored posts from site categories will appear here.</p>
                </div>
              ) : (
                <div
                  className={`grid gap-5 ${
                    viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
                  }`}
                >
                  {adverts.map((advert) => (
                    <SponsoredAdvertCard
                      key={advert.id || advert.sponsored_advert_id}
                      advert={advert}
                      viewMode={viewMode}
                      isSaved={savedAdverts.includes(advert.sponsored_advert_id || advert.id)}
                      onSave={() => handleSaveAdvert(advert.sponsored_advert_id || advert.id)}
                      onView={() => handleViewAdvert(advert)}
                    />
                  ))}
                </div>
              )}

              {pagination.currentPage < pagination.totalPages && (
                <div className="text-center mt-8">
                  <button
                    type="button"
                    onClick={() => loadAdverts(pagination.currentPage + 1)}
                    disabled={loading}
                    className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 text-sm font-semibold"
                  >
                    {loading ? 'Loading…' : 'Load more'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <SponsoredActivityFeed />
            </div>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {showPostForm && (
          <SponsoredPostForm onClose={handleCloseModal} onSubmit={handleFormSubmit} />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default SponsoredAdvertsPage;
