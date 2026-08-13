import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthRedirect from '../hooks/useAuthRedirect';
import {
  Grid3X3,
  List,
  ExternalLink,
  Heart,
  Eye,
  Target,
  Star,
  AlertCircle,
  X,
} from 'lucide-react';

import {
  useBannerAds,
  useFeaturedBanners,
  useBannerCategories,
} from '../hooks/useBannerData';
import '../styles/banner-adverts.css';

import BannerHero from '../Component/banner/BannerHero';
import BannerCarousel, { resolveBannerImageUrl } from '../Component/banner/BannerCarousel';
import BannerCategoryGrid from '../Component/banner/BannerCategoryGrid';
import BannerCard from '../Component/banner/BannerCard';
import BannerFilters from '../Component/banner/BannerFilters';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import CompactPremiumReel from '../Component/shared/CompactPremiumReel';
import { getCategoryTheme } from '../constants/categoryThemes';
import { pickPremiumForReel } from '../utils/listingPromotionSort';
import {
  isBannerPurchased,
  purchaseBanner,
  triggerBannerDownload,
  getSafeBannerVisitUrl,
} from '../data/bannerMarketplaceCatalog';
import AuthenticCheckoutModal from '../Component/Payment/AuthenticCheckoutModal';
import { purchaseBannerAd, confirmBannerPayment } from '../api/banner';
import ProtectedBannerImage from '../Component/banner/ProtectedBannerImage';

const BannerAdvertsPage = ({ initialCategoryId = null }) => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();

  const isCategoryView = Boolean(initialCategoryId);

  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId || 'all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [pendingFilters, setPendingFilters] = useState({
    category: initialCategoryId || 'all',
    country: 'all',
    bannerSize: 'all',
    badge: 'all',
    verified: false,
    sortBy: 'recent',
  });
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiError, setApiError] = useState(null);
  const [checkoutBanner, setCheckoutBanner] = useState(null);
  const [checkoutPurchaseId, setCheckoutPurchaseId] = useState(null);
  const [buying, setBuying] = useState(false);

  const itemsPerPage = 12;

  const { data: apiCategories, loading: categoriesLoading } = useBannerCategories();

  /** Live API categories only — no hardcoded marketplace fallbacks */
  const categories = useMemo(() => {
    const list = Array.isArray(apiCategories) ? apiCategories : [];
    return [...list].sort((a, b) => {
      const ao = Number(a.sort_order ?? 999);
      const bo = Number(b.sort_order ?? 999);
      if (ao !== bo) return ao - bo;
      return String(a.name || '').localeCompare(String(b.name || ''));
    });
  }, [apiCategories]);

  const apiCategoryId = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') return undefined;
    if (/^\d+$/.test(String(selectedCategory))) return selectedCategory;
    const match = categories.find(
      (c) =>
        String(c.slug || '').toLowerCase() === String(selectedCategory).toLowerCase() ||
        String(c.name || '').toLowerCase() === String(selectedCategory).toLowerCase()
    );
    return match?.id != null ? String(match.id) : undefined;
  }, [selectedCategory, categories]);

  const {
    data: banners,
    loading: bannersLoading,
    error: bannersError,
    pagination,
    refetch: refetchBanners,
  } = useBannerAds({
    category_id: apiCategoryId,
    country: selectedCountry !== 'all' ? selectedCountry : undefined,
    banner_size: selectedSize !== 'all' ? selectedSize : undefined,
    promotion_tier: selectedBadge !== 'all' ? selectedBadge : undefined,
    verified_only: verifiedOnly || undefined,
    search: searchQuery || undefined,
    sort_by:
      sortBy === 'recent'
        ? 'created_at'
        : sortBy === 'views'
          ? 'views_count'
          : sortBy === 'ctr'
            ? 'ctr'
            : sortBy === 'rating'
              ? 'rating'
              : 'created_at',
    sort_order: 'desc',
    page: currentPage,
    limit: itemsPerPage,
  });

  const { data: featuredBanners, loading: featuredLoading } = useFeaturedBanners(12);

  const categoryMeta = useMemo(() => {
    if (!isCategoryView) return null;
    const key = String(initialCategoryId);
    return (
      categories.find(
        (c) =>
          String(c.id) === key ||
          String(c.slug) === key ||
          String(c.name).toLowerCase() === key.toLowerCase()
      ) || null
    );
  }, [categories, initialCategoryId, isCategoryView]);

  const categoryLabel = categoryMeta?.name || (isCategoryView ? String(initialCategoryId) : null);

  const displayBanners = useMemo(() => {
    // API banners only — no local catalog placeholders
    let list = Array.isArray(banners) ? banners.filter((b) => !b?.is_catalog) : [];

    // When API already filtered by category_id, trust the response.
    // Only client-filter when we still need slug/name matching without a resolved id.
    if (selectedCategory && selectedCategory !== 'all' && !apiCategoryId) {
      const key = String(selectedCategory).toLowerCase();
      list = list.filter((b) => {
        const cat = b.category || {};
        const slug = String(
          b.banner_category_slug || b.category_slug || cat.slug || ''
        ).toLowerCase();
        const name = String(b.category_name || cat.name || '').toLowerCase();
        const id = String(b.category_id ?? b.banner_category_id ?? cat.id ?? '');
        return slug === key || name === key || id === String(selectedCategory);
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (b) =>
          String(b.title || '').toLowerCase().includes(q) ||
          String(b.description || '').toLowerCase().includes(q) ||
          String(b.business_name || '').toLowerCase().includes(q)
      );
    }

    if (selectedSize !== 'all') {
      list = list.filter(
        (b) =>
          String(b.banner_size || '').includes(selectedSize) ||
          String(b.banner_size_display || '')
            .toLowerCase()
            .includes(String(selectedSize).toLowerCase())
      );
    }

    return list;
  }, [banners, selectedCategory, apiCategoryId, searchQuery, selectedSize]);

  /** Categories with rotating thumbs from related banner posts */
  const categoriesWithThumbs = useMemo(() => {
    const imagesByCat = new Map();
    const pushImg = (key, img) => {
      if (!key || !img) return;
      const k = String(key);
      const list = imagesByCat.get(k) || [];
      if (list.includes(img) || list.length >= 8) return;
      list.push(img);
      imagesByCat.set(k, list);
    };

    const pools = [
      ...(Array.isArray(featuredBanners) ? featuredBanners : []),
      ...(Array.isArray(displayBanners) ? displayBanners : []),
      ...(Array.isArray(banners) ? banners : []),
    ];
    for (const b of pools) {
      const catId = String(b.category?.id ?? b.banner_category_id ?? b.category_id ?? '');
      const catSlug = String(b.category?.slug || b.banner_category_slug || b.category_slug || '').toLowerCase();
      const img = resolveBannerImageUrl(b);
      if (!img) continue;
      pushImg(catId, img);
      pushImg(catSlug, img);
    }

    return categories.map((c) => {
      const cover = c.image || c.image_url || '';
      const isDefault =
        !cover ||
        /default-category|default-icon|placeholder/i.test(String(cover));
      const samples =
        imagesByCat.get(String(c.id)) ||
        imagesByCat.get(String(c.slug || '').toLowerCase()) ||
        [];
      const gallery = [
        ...samples,
        ...(!isDefault && cover ? [cover] : []),
      ].filter(Boolean);

      return {
        ...c,
        image: gallery[0] || cover || null,
        image_url: gallery[0] || cover || null,
        images: gallery,
        post_images: gallery,
        active_banners_count:
          c.active_banners_count ?? c.active_banner_ads_count ?? c.banner_ads_count ?? null,
      };
    });
  }, [categories, featuredBanners, displayBanners, banners]);

  /** Featured strip: real API banners with resolvable images only */
  const featuredCarouselBanners = useMemo(() => {
    const pool = [
      ...(Array.isArray(featuredBanners) ? featuredBanners : []),
      ...(Array.isArray(displayBanners) ? displayBanners : []),
    ];
    const seen = new Set();
    const out = [];
    for (const b of pool) {
      const key = String(b.id ?? b.slug ?? b.catalog_id ?? '');
      if (key && seen.has(key)) continue;
      if (!resolveBannerImageUrl(b)) continue;
      if (key) seen.add(key);
      out.push({
        ...b,
        image_url: resolveBannerImageUrl(b),
        featured: true,
      });
      if (out.length >= 12) break;
    }
    return out;
  }, [featuredBanners, displayBanners]);

  const reelItems = useMemo(
    () => pickPremiumForReel(featuredCarouselBanners, { limit: 12, allowFallback: true }),
    [featuredCarouselBanners]
  );

  useEffect(() => {
    if (bannersError && !displayBanners.length) {
      setApiError(bannersError.message || 'Failed to load banners');
    } else {
      setApiError(null);
    }
  }, [bannersError, displayBanners.length]);

  const handlePostClick = () => {
    if (requireAuth('/postbanner', 'You must be logged in to post a banner advert.')) {
      navigate('/postbanner');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedCountry, selectedSize, selectedBadge, verifiedOnly, searchQuery, sortBy]);

  useEffect(() => {
    setSelectedCategory(initialCategoryId || 'all');
    setPendingFilters((prev) => ({
      ...prev,
      category: initialCategoryId || 'all',
    }));
  }, [initialCategoryId]);

  const handleCategorySelect = (category) => {
    if (!category || category === 'all') {
      navigate('/banner-adverts');
      return;
    }
    const slugOrId = category.slug || category.id;
    navigate(`/banner-adverts/category/${slugOrId}`);
  };

  const handleBannerClick = (banner) => {
    setSelectedBanner(banner);
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewedBanners') || '[]');
    const filtered = recentlyViewed.filter((b) => b.id !== banner.id);
    filtered.unshift({
      id: banner.id,
      title: banner.title,
      banner_image: banner.banner_image,
      business_name: banner.business_name,
      viewed_at: new Date().toISOString(),
    });
    localStorage.setItem('recentlyViewedBanners', JSON.stringify(filtered.slice(0, 10)));
  };

  const handleBuyBanner = async (banner) => {
    const id = banner.id || banner.catalog_id;

    if (isBannerPurchased(id)) {
      const ok = await triggerBannerDownload(banner);
      if (ok) toast.success('Download started');
      else toast.error('Purchase required to download this banner.');
      return;
    }

    if (!requireAuth('/banner-adverts', 'Log in to purchase banners.')) return;

    setBuying(true);
    try {
      const res = await purchaseBannerAd(id);
      const data = res?.data || res;

      if (data?.payment_status === 'completed' && data?.download_token) {
        purchaseBanner({
          ...banner,
          download_token: data.download_token,
          download_url: data.download_url,
        });
        await triggerBannerDownload({
          ...banner,
          download_token: data.download_token,
          download_url: data.download_url,
        });
        toast.success('Already purchased — downloading your banner.');
        return;
      }

      if (!data?.purchase_id) {
        throw new Error(res?.message || 'Could not start checkout');
      }

      setSelectedBanner(null);
      setCheckoutPurchaseId(data.purchase_id);
      setCheckoutBanner({
        ...banner,
        checkoutAmount: Number(data.amount ?? banner.price ?? banner.promotion_price) || 29,
      });
      toast.success('Order ready — pay with PayPal to download.');
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Purchase failed. Try again.');
    } finally {
      setBuying(false);
    }
  };

  const handleBannerPaymentSuccess = async (details) => {
    if (!checkoutBanner || !checkoutPurchaseId) return;
    try {
      const res = await confirmBannerPayment(checkoutPurchaseId, {
        payment_id: details.paymentId || details.id,
        payment_method: details?.paymentMethod || details?.payment_method || 'paypal',
      });
      const data = res?.data || res;
      purchaseBanner({
        ...checkoutBanner,
        download_token: data.download_token,
        download_url: data.download_url,
      });
      await triggerBannerDownload({
        ...checkoutBanner,
        download_token: data.download_token,
        download_url: data.download_url,
      });
      toast.success('Payment complete — your banner is downloading.');
      setCheckoutBanner(null);
      setCheckoutPurchaseId(null);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Payment confirmation failed');
    }
  };

  const handleSaveBanner = (bannerId) => {
    const savedBanners = JSON.parse(localStorage.getItem('favoriteBanners') || '[]');
    if (!savedBanners.includes(bannerId)) {
      savedBanners.push(bannerId);
      localStorage.setItem('favoriteBanners', JSON.stringify(savedBanners));
    }
  };

  const handleUnsaveBanner = (bannerId) => {
    const savedBanners = JSON.parse(localStorage.getItem('favoriteBanners') || '[]');
    localStorage.setItem(
      'favoriteBanners',
      JSON.stringify(savedBanners.filter((id) => id !== bannerId))
    );
  };

  const isBannerSaved = (bannerId) => {
    const savedBanners = JSON.parse(localStorage.getItem('favoriteBanners') || '[]');
    return savedBanners.includes(bannerId);
  };

  const handleFilterChange = (key, value) => {
    setPendingFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const next = { ...pendingFilters };
    const cat = next.category || 'all';

    setSelectedCountry(next.country && next.country !== 'all' ? next.country : 'all');
    setSelectedSize(next.bannerSize && next.bannerSize !== 'all' ? next.bannerSize : 'all');
    setSelectedBadge(next.badge && next.badge !== 'all' ? next.badge : 'all');
    setVerifiedOnly(Boolean(next.verified));
    setSortBy(next.sortBy || 'recent');

    if (cat === 'all' || cat === '' || cat == null) {
      setSelectedCategory('all');
      if (isCategoryView) navigate('/banner-adverts');
    } else if (String(cat) !== String(selectedCategory) || !isCategoryView) {
      setSelectedCategory(cat);
      navigate(`/banner-adverts/category/${cat}`);
    }
  };

  const clearAllFilters = () => {
    setPendingFilters({
      category: 'all',
      country: 'all',
      bannerSize: 'all',
      badge: 'all',
      verified: false,
      sortBy: 'recent',
    });
    setSelectedCountry('all');
    setSelectedSize('all');
    setSelectedBadge('all');
    setVerifiedOnly(false);
    setSortBy('recent');
    setSearchQuery('');
    setSelectedCategory('all');
    if (isCategoryView) navigate('/banner-adverts');
  };

  const clearExtraFilters = () => {
    setPendingFilters((prev) => ({
      ...prev,
      country: 'all',
      bannerSize: 'all',
      badge: 'all',
      verified: false,
      sortBy: 'recent',
      category: initialCategoryId || 'all',
    }));
    setSelectedCountry('all');
    setSelectedSize('all');
    setSelectedBadge('all');
    setVerifiedOnly(false);
    setSortBy('recent');
    setSearchQuery('');
  };

  const appliedFilterCount = [
    !isCategoryView && selectedCategory !== 'all',
    selectedCountry !== 'all',
    selectedSize !== 'all',
    selectedBadge !== 'all',
    verifiedOnly,
    Boolean(searchQuery?.trim()),
  ].filter(Boolean).length;

  const filterFields = (
    <BannerFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      categories={categoriesWithThumbs || []}
      categoriesLoading={categoriesLoading}
      showCategory={!isCategoryView}
    />
  );
  const theme = getCategoryTheme('banner');

  if (bannersLoading && !banners && !isCategoryView && displayBanners.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading banners…</p>
        </div>
      </div>
    );
  }

  if (apiError && displayBanners.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Banners</h2>
          <p className="text-gray-600 mb-4">{apiError}</p>
          <button
            type="button"
            onClick={() => {
              setApiError(null);
              refetchBanners();
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <CategoryPageShell
      categoryId="banner"
      backHref={isCategoryView ? '/banner-adverts' : '/adverts'}
      showBackBar
      backBarTo={isCategoryView ? '/banner-adverts' : '/adverts'}
      backBarLabel={isCategoryView ? 'Back to Banners' : 'Back to Adverts'}
      className="bg-slate-50"
      contentClassName="page-container py-6 sm:py-8"
      hero={
        <BannerHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryLabel={categoryLabel}
        />
      }
      categoryGrid={
        !isCategoryView ? (
          <BannerCategoryGrid
            categories={categoriesWithThumbs}
            loading={categoriesLoading}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        ) : null
      }
      premiumReel={
        reelItems.length > 0 ? (
          <CompactPremiumReel
            items={reelItems}
            title="Featured"
            onItemClick={handleBannerClick}
            accentClass={theme.accentText || 'text-blue-700'}
            borderAccent="hover:border-blue-300"
          />
        ) : null
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: isCategoryView ? clearExtraFilters : clearAllFilters,
        theme: theme.filterTheme,
        homeHref: theme.route,
        filterFields,
        activeCount: appliedFilterCount,
        toolbarLeft: (
          <div className="flex items-center gap-3 flex-wrap min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {categoryLabel || 'All banners'}
            </p>
            <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        ),
      }}
      bottomCta={{
        buttonLabel: 'List your banners',
        onPostClick: handlePostClick,
        theme: theme.ctaTheme,
        buttonOnly: true,
      }}
      afterContent={
        <AnimatePresence>
          {selectedBanner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedBanner(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words pr-2">
                      {selectedBanner.title}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setSelectedBanner(null)}
                      className="text-gray-400 hover:text-gray-600 shrink-0"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ProtectedBannerImage
                        src={resolveBannerImageUrl(selectedBanner) || selectedBanner.banner_image}
                        alt={selectedBanner.title}
                        className="w-full rounded-lg border border-slate-200 aspect-video"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-3">{selectedBanner.description}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Size: {selectedBanner.banner_size_display || selectedBanner.banner_size}
                      </p>
                      {(selectedBanner.price != null || selectedBanner.promotion_price != null) && (
                        <p className="text-lg font-bold text-indigo-700 mb-4">
                          ${Number(selectedBanner.price ?? selectedBanner.promotion_price).toFixed(0)}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {selectedBanner.views_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {selectedBanner.ctr || 0}% CTR
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={buying}
                          onClick={() => handleBuyBanner(selectedBanner)}
                          className="bg-indigo-700 text-white px-5 py-2 rounded-lg hover:bg-indigo-800 font-semibold text-sm disabled:opacity-60"
                        >
                          {isBannerPurchased(selectedBanner.id)
                            ? 'Download again'
                            : buying
                              ? 'Preparing…'
                              : 'Buy & download'}
                        </button>
                        {getSafeBannerVisitUrl(selectedBanner) && (
                          <a
                            href={getSafeBannerVisitUrl(selectedBanner)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-100 text-slate-800 px-5 py-2 rounded-lg hover:bg-slate-200 text-sm inline-flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Visit site
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            handleSaveBanner(selectedBanner.id);
                            setSelectedBanner(null);
                          }}
                          className="bg-slate-100 text-slate-800 px-5 py-2 rounded-lg hover:bg-slate-200 text-sm inline-flex items-center gap-2"
                        >
                          <Heart className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      }
    >
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
            : 'space-y-4'
        }
      >
        {displayBanners.map((banner) => (
          <BannerCard
            key={banner.id || banner.slug}
            banner={banner}
            viewMode={viewMode}
            onClick={() => handleBannerClick(banner)}
            onBusinessClick={() => {}}
            onSave={() => handleSaveBanner(banner.id)}
            onUnsave={() => handleUnsaveBanner(banner.id)}
            isSaved={isBannerSaved(banner.id)}
            onBuy={handleBuyBanner}
          />
        ))}
      </div>

      {bannersLoading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      )}

      {!bannersLoading && displayBanners.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Target className="w-14 h-14 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No banners found</h3>
          <p className="text-gray-600 mb-4 text-sm">
            {appliedFilterCount > 0
              ? 'Try adjusting filters'
              : 'Choose a category to browse paid banner packs'}
          </p>
          {appliedFilterCount > 0 && (
            <button
              type="button"
              onClick={clearExtraFilters}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {pagination && pagination.total > itemsPerPage && !isCategoryView && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
              className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page}
              className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </CategoryPageShell>

    <AuthenticCheckoutModal
      open={Boolean(checkoutBanner)}
      onClose={() => {
        setCheckoutBanner(null);
        setCheckoutPurchaseId(null);
      }}
      title="Buy banner creative"
      description={
        checkoutBanner
          ? `${checkoutBanner.title || 'Banner'} — ${
              checkoutBanner.banner_size_display || checkoutBanner.banner_size || 'standard size'
            }. Pay once to unlock the clean download file.`
          : ''
      }
      amount={checkoutBanner?.checkoutAmount || 0}
      upsellType="banner"
      upsellId={checkoutPurchaseId || checkoutBanner?.id || checkoutBanner?.slug}
      onSuccess={handleBannerPaymentSuccess}
      onError={() => toast.error('Payment failed. Please try again.')}
      footerNote="The clean banner file downloads only after payment. Previews are watermarked and cannot be used as free downloads."
    />
    </>
  );
};

export default BannerAdvertsPage;
