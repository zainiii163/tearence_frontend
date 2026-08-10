import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import '../styles/affiliates.css';
import useAuthRedirect from '../hooks/useAuthRedirect';
import affiliateService from '../services/AffiliateService';
import toast from 'react-hot-toast';
import AffiliateHero from '../Component/affiliates/AffiliateHero';
import AffiliateCategoryGrid from '../Component/affiliates/AffiliateCategoryGrid';
import AffiliateModalForm from '../Component/affiliates/AffiliateModalForm';
import AffiliateGrid from '../Component/affiliates/AffiliateGrid';
import StandardListingFilters from '../Component/shared/StandardListingFilters';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import { getCategoryTheme } from '../constants/categoryThemes';
import { rewriteLocalStorageUrl, getStorageAssetUrl } from '../utils/jobsHelpers';

const hasActiveFilters = (activeFilters = {}) =>
  Object.entries(activeFilters).some(([, value]) => {
    if (typeof value === 'boolean') return value;
    return value !== '' && value != null;
  });

const isValidImageValue = (val) => {
  if (!val || typeof val !== 'string' || !val.trim()) return false;
  const v = val.trim();
  return (
    v.startsWith('http://') ||
    v.startsWith('https://') ||
    v.startsWith('/storage/') ||
    /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/i.test(v)
  );
};

const resolveImageUrl = (item) => {
  const candidates = [
    item?.image_url,
    item?.logo_url,
    item?.banner_url,
    item?.thumbnail_url,
    item?.cover_image,
    item?.image,
    item?.photo,
  ];

  if (Array.isArray(item?.images) && item.images.length > 0) {
    const first = item.images[0];
    if (typeof first === 'string') candidates.unshift(first);
    else if (first?.url) candidates.unshift(first.url);
  }

  if (Array.isArray(item?.promotional_assets) && item.promotional_assets.length > 0) {
    const first = item.promotional_assets[0];
    if (typeof first === 'string') candidates.unshift(first);
    else if (first?.url) candidates.unshift(first.url);
    else if (first?.path) candidates.unshift(first.path);
  }

  for (const val of candidates) {
    if (!isValidImageValue(val)) continue;
    if (val.startsWith('http://') || val.startsWith('https://')) {
      return rewriteLocalStorageUrl(val);
    }
    return getStorageAssetUrl(val);
  }
  return null;
};

/**
 * Affiliates hubs (ClickBank-style split):
 * - programs (default /affiliates): merchant programs to join & get a WWA hop
 * - links (/affiliates/links): affiliate link ads already being promoted (view/open hop)
 */
const AffiliatesPage = ({ hubMode = 'programs' }) => {
  const isProgramsHub = hubMode !== 'links';
  const [searchParams, setSearchParams] = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuthRedirect();

  const [postFormMode, setPostFormMode] = useState(isProgramsHub ? 'business' : 'user');
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [businessOffers, setBusinessOffers] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [affiliateLinks, setAffiliateLinks] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [topSearch, setTopSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [savedItems, setSavedItems] = useState([]);
  // Forced by hub: programs = business only; links = user (+ featured links)
  const [contentType, setContentType] = useState(isProgramsHub ? 'business' : 'user');

  const homeHref = isProgramsHub ? '/affiliates' : '/affiliates/links';
  const openPostDefaultMode = isProgramsHub ? 'business' : 'user';

  const openPostForm = (mode = openPostDefaultMode) => {
    if (
      requireAuth(
        `${homeHref}?postForm=true&mode=${mode}`,
        'You must be logged in to post an affiliate listing.'
      )
    ) {
      setPostFormMode(mode);
      setShowPostForm(true);
      setSearchParams({ postForm: 'true', mode });
    }
  };

  const handleCloseModal = () => {
    setShowPostForm(false);
    setSearchParams({});
  };

  useEffect(() => {
    const postFormParam = searchParams.get('postForm');
    const modeParam = searchParams.get('mode');
    if (postFormParam === 'true' && isAuthenticated) {
      if (modeParam === 'business' || modeParam === 'user') {
        setPostFormMode(modeParam);
      }
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSubmissionSuccess = () => {
    loadInitialData();
    toast.success('Affiliate listing created successfully!', {
      duration: 4000,
      position: 'top-center',
    });
    handleCloseModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadInitialData = async () => {
    setLoading(true);
    setCategoriesLoading(true);
    setError(null);

    const [categoriesResult, businessResult, userResult, linksResult] =
      await Promise.allSettled([
        affiliateService.getCategories(),
        affiliateService.getBusinessOffers({ per_page: 48 }),
        affiliateService.getUserPosts({ per_page: 48 }),
        affiliateService.getAffiliateLinks({ per_page: 50 }),
      ]);

    if (categoriesResult.status === 'fulfilled') {
      setCategories(categoriesResult.value?.data || []);
    } else {
      console.warn('Affiliate categories unavailable:', categoriesResult.reason);
      setCategories([]);
    }
    setCategoriesLoading(false);

    if (businessResult.status === 'fulfilled') {
      const businessData = businessResult.value?.data || businessResult.value;
      setBusinessOffers(
        Array.isArray(businessData) ? businessData : businessData?.data || []
      );
    } else {
      console.warn('Business offers unavailable:', businessResult.reason);
      setBusinessOffers([]);
    }

    if (userResult.status === 'fulfilled') {
      const userData = userResult.value?.data || userResult.value;
      setUserPosts(Array.isArray(userData) ? userData : userData?.data || []);
    } else {
      console.warn('User posts unavailable:', userResult.reason);
      setUserPosts([]);
    }

    if (linksResult.status === 'fulfilled') {
      const linksData = linksResult.value?.data || linksResult.value;
      setAffiliateLinks(
        Array.isArray(linksData) ? linksData : linksData?.data || []
      );
    } else {
      console.warn('Affiliate link ads unavailable:', linksResult.reason);
      setAffiliateLinks([]);
    }

    const allFailed =
      categoriesResult.status === 'rejected' &&
      businessResult.status === 'rejected' &&
      userResult.status === 'rejected' &&
      linksResult.status === 'rejected';

    if (allFailed) {
      setError('Failed to load affiliate data');
      toast.error('Failed to load affiliate data');
    }

    setLoading(false);
    setCategoriesLoading(false);
  };

  const fetchBusinessOffers = async (params = {}) => {
    try {
      const response = await affiliateService.getBusinessOffers(params);
      const bData = response?.data || response;
      setBusinessOffers(Array.isArray(bData) ? bData : bData?.data || []);
    } catch (err) {
      console.error('Error fetching business offers:', err);
      toast.error('Failed to load business offers');
    }
  };

  const fetchUserPosts = async (params = {}) => {
    try {
      const response = await affiliateService.getUserPosts(params);
      const uData = response?.data || response;
      setUserPosts(Array.isArray(uData) ? uData : uData?.data || []);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      toast.error('Failed to load user posts');
    }
  };

  const trackClick = async (type, id) => {
    try {
      await affiliateService.trackClick(type, id);
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  };

  const applyFilters = () => {
    const next = { ...pendingFilters };
    setFilters(next);

    const filterParams = { per_page: 48 };
    if (selectedCategoryId) filterParams.category_id = selectedCategoryId;
    if (next.country) filterParams.country = next.country;
    if (next.city) filterParams.country = next.city; // soft match via country field when city used
    if (next.featured) filterParams.featured = true;
    if (next.promoted) filterParams.promoted = true;
    if (next.sponsored) filterParams.sponsored = true;

    if (isProgramsHub) {
      fetchBusinessOffers(filterParams);
    } else {
      fetchUserPosts(filterParams);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
    setSelectedCategoryId(null);
    fetchBusinessOffers({ per_page: 48 });
    fetchUserPosts({ per_page: 48 });
  };

  const clearExtraFilters = () => {
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
    fetchBusinessOffers(
      selectedCategoryId
        ? { category_id: selectedCategoryId, per_page: 48 }
        : { per_page: 48 }
    );
    fetchUserPosts(
      selectedCategoryId
        ? { category_id: selectedCategoryId, per_page: 48 }
        : { per_page: 48 }
    );
  };

  const handleFilterChange = (filterName, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [filterName]: value };
      if (typeof value === 'boolean' && !value) delete next[filterName];
      if ((typeof value === 'string' || typeof value === 'number') && value === '') {
        delete next[filterName];
      }
      return next;
    });
  };

  const applyTopSearch = async () => {
    const q = topSearch.trim();
    const next = { ...pendingFilters };
    if (q) next.search = q;
    else delete next.search;
    setPendingFilters(next);
    setFilters(next);

    if (!q) {
      await loadInitialData();
      return;
    }

    try {
      const response = await affiliateService.searchAffiliateContent(
        q,
        isProgramsHub ? 'business' : 'user'
      );
      if (isProgramsHub) {
        const bOffers =
          response?.data?.business_offers ?? response?.business_offers ?? [];
        setBusinessOffers(Array.isArray(bOffers) ? bOffers : []);
      } else {
        const uPosts = response?.data?.user_posts ?? response?.user_posts ?? [];
        setUserPosts(Array.isArray(uPosts) ? uPosts : []);
      }
    } catch (err) {
      console.error('Error searching content:', err);
      toast.error('Search failed');
    }
  };

  const handleCategorySelect = (categoryId) => {
    const nextId =
      selectedCategoryId != null && String(selectedCategoryId) === String(categoryId)
        ? null
        : categoryId;
    setSelectedCategoryId(nextId);
    const params = { per_page: 48 };
    if (nextId) params.category_id = nextId;
    fetchBusinessOffers(params);
    fetchUserPosts(params);
  };

  const handleSaveItem = (itemId) => {
    setSavedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleItemClick = async (type, id) => {
    await trackClick(type, id);
  };

  const normalizeOffer = (item, contentTypeKey, idPrefix, fields) => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
    const createdAt = new Date(item.created_at);
    return {
      ...item,
      contentType: contentTypeKey,
      id: `${idPrefix}-${item.id}`,
      type: contentTypeKey === 'link' ? 'link' : contentTypeKey,
      ...fields,
      image: resolveImageUrl(item),
      isNew: createdAt > fiveMinutesAgo,
    };
  };

  const allContent = useMemo(() => {
    const content = [];
    const safeBusiness = Array.isArray(businessOffers) ? businessOffers : [];
    const safeUsers = Array.isArray(userPosts) ? userPosts : [];
    const safeLinks = Array.isArray(affiliateLinks) ? affiliateLinks : [];
    const q = (filters.search || topSearch || '').toLowerCase().trim();

    const matchesSearch = (title, tagline, extra = '') => {
      if (!q) return true;
      return `${title} ${tagline} ${extra}`.toLowerCase().includes(q);
    };

    if (isProgramsHub) {
      safeBusiness.forEach((offer) => {
        const title = offer.product_service_title || offer.title;
        const tagline = offer.tagline || '';
        if (!matchesSearch(title, tagline, offer.country || '')) return;
        if (filters.country && !(offer.country || '').toLowerCase().includes(String(filters.country).toLowerCase())) {
          return;
        }
        if (filters.featured && !(offer.is_featured || offer.featured)) return;
        if (filters.promoted && !(offer.is_promoted || offer.promoted)) return;
        if (filters.sponsored && !(offer.is_sponsored || offer.sponsored)) return;

        content.push(
          normalizeOffer(offer, 'business', 'business', {
            title,
            tagline,
            commission: offer.commission_rate || offer.commission || 0,
            category: offer.affiliate_category?.name || offer.category || '',
            country: offer.country || '',
            verified: offer.is_verified || false,
            promoted: offer.is_promoted || false,
            featured: offer.is_featured || false,
            sponsored: offer.is_sponsored || false,
            views: offer.views || 0,
            rating: offer.rating || 0,
            reviews: offer.reviews || 0,
            tracking_link: offer.tracking_link,
            affiliate_link: offer.affiliate_link,
          })
        );
      });
    } else {
      safeUsers.forEach((post) => {
        const title = post.title;
        const tagline = post.description
          ? `${post.description.substring(0, 80)}...`
          : '';
        if (!matchesSearch(title, tagline, post.country || '')) return;
        if (filters.country && !(post.country || '').toLowerCase().includes(String(filters.country).toLowerCase())) {
          return;
        }
        if (filters.featured && !(post.is_featured || post.featured)) return;
        if (filters.promoted && !(post.is_promoted || post.promoted)) return;
        if (filters.sponsored && !(post.is_sponsored || post.sponsored)) return;

        content.push(
          normalizeOffer(post, 'user', 'user', {
            title,
            tagline,
            commission: 0,
            category: post.affiliate_category?.name || post.category || '',
            country: post.country || '',
            verified: false,
            promoted: post.is_promoted || false,
            featured: post.is_featured || false,
            sponsored: post.is_sponsored || false,
            views: post.views || 0,
            rating: post.rating || 0,
            reviews: post.reviews || 0,
            tracking_link: post.affiliate_link,
            affiliate_link: post.affiliate_link,
          })
        );
      });

      safeLinks.forEach((link) => {
        const title = link.title;
        const tagline = link.position
          ? `Featured · ${link.position}`
          : 'Affiliate link to promote';
        if (!matchesSearch(title, tagline)) return;

        content.push(
          normalizeOffer(link, 'link', 'link', {
            title,
            tagline,
            commission: 0,
            category: 'Featured',
            country: link.country || '',
            verified: true,
            promoted: false,
            featured: true,
            sponsored: false,
            views: link.views || 0,
            rating: 0,
            reviews: 0,
            tracking_link: link.tracking_link || link.affiliate_link || link.link,
            affiliate_link: link.affiliate_link || link.link,
          })
        );
      });
    }

    if (sortBy === 'views') {
      content.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'commission') {
      content.sort((a, b) => (b.commission || 0) - (a.commission || 0));
    } else if (sortBy === 'rating') {
      content.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      content.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
    }

    return content;
  }, [
    businessOffers,
    userPosts,
    affiliateLinks,
    isProgramsHub,
    filters,
    topSearch,
    sortBy,
  ]);

  const featuredRow = useMemo(
    () =>
      isProgramsHub
        ? []
        : allContent.filter((item) => item.contentType === 'link').slice(0, 6),
    [allContent, isProgramsHub]
  );

  const mainListings = useMemo(() => {
    if (isProgramsHub) return allContent;
    if (filters.featured || filters.promoted || filters.sponsored) {
      return allContent;
    }
    return allContent.filter((item) => item.contentType !== 'link');
  }, [allContent, filters, isProgramsHub]);

  const activeFilterCount = Object.entries(filters).filter(([, v]) => {
    if (typeof v === 'boolean') return v;
    return v !== '' && v != null;
  }).length;

  const theme = getCategoryTheme('affiliate');

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={clearExtraFilters}
      theme={theme.filterTheme}
      asPanel={false}
      showActions={false}
      showTitle={false}
      showPrice={false}
      searchPlaceholder={
        isProgramsHub ? 'Search programs…' : 'Search affiliate link ads…'
      }
    />
  );

  return (
    <CategoryPageShell
      categoryId="affiliate"
      backHref="/"
      showBackBar
      backBarTo="/"
      backBarLabel="Back Home"
      hero={
        <AffiliateHero
          hubMode={isProgramsHub ? 'programs' : 'links'}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
        />
      }
      categoryGrid={
        <AffiliateCategoryGrid
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleCategorySelect}
          loading={categoriesLoading}
        />
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: clearFilters,
        theme: theme.filterTheme,
        homeHref,
        filterFields,
        activeCount: activeFilterCount,
        toolbarLeft: (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white"
            >
              <option value="newest">Newest</option>
              <option value="views">Most views</option>
              {isProgramsHub && (
                <option value="commission">Highest commission</option>
              )}
              <option value="rating">Top rated</option>
            </select>
        ),
      }}
      bottomCta={{
        buttonLabel: isProgramsHub
          ? 'Publish your affiliate program'
          : 'Post an affiliate advert',
        onPostClick: () => openPostForm(openPostDefaultMode),
        theme: theme.ctaTheme,
        buttonOnly: true,
      }}
      afterContent={
        <AnimatePresence>
          {showPostForm && (
            <AffiliateModalForm
              onClose={handleCloseModal}
              categories={categories}
              onSubmissionSuccess={handleSubmissionSuccess}
              initialMode={postFormMode}
            />
          )}
        </AnimatePresence>
      }
    >
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
              <button
                type="button"
                onClick={() => loadInitialData()}
                className="ml-3 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {hasActiveFilters(filters) && !loading && allContent.length === 0 && (
            <div className="mb-4">
              <button
                type="button"
                onClick={clearExtraFilters}
                className="text-xs font-medium text-violet-700 hover:text-violet-900"
              >
                Clear and show all
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-r-transparent" />
            </div>
          ) : allContent.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {isProgramsHub
                  ? 'No affiliate programs found'
                  : 'No affiliate link ads found'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {isProgramsHub
                  ? 'Try changing your selection'
                  : 'These are posts already being promoted — try different filters'}
              </p>
              <button
                type="button"
                onClick={clearExtraFilters}
                className="px-4 py-2 text-sm bg-violet-700 text-white rounded-lg hover:bg-violet-800"
              >
                Reset
              </button>
            </div>
          ) : (
            <>
              {featuredRow.length > 0 &&
                !(filters.featured || filters.promoted || filters.sponsored) && (
                  <section className="mb-5">
                    <h2 className="text-sm font-bold text-gray-900 mb-2">
                      Featured affiliate hops
                    </h2>
                    <p className="text-xs text-gray-500 mb-2">
                      Already being promoted — open the ClickBank hop URL as posted
                    </p>
                    <AffiliateGrid
                      offers={featuredRow}
                      hubMode={isProgramsHub ? 'programs' : 'links'}
                      viewMode={viewMode}
                      setViewMode={setViewMode}
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                      savedItems={savedItems}
                      onSaveItem={handleSaveItem}
                      searchQuery={topSearch}
                      setSearchQuery={setTopSearch}
                      contentType={contentType}
                      loading={false}
                      onItemClick={handleItemClick}
                      trackClick={trackClick}
                      embedInBrowse
                    />
                  </section>
                )}

              <section>
                {featuredRow.length > 0 &&
                  !(filters.featured || filters.promoted || filters.sponsored) && (
                    <h2 className="text-sm font-bold text-gray-900 mb-2">
                      {isProgramsHub ? 'Programs' : 'Affiliate posts'}
                    </h2>
                  )}
                <AffiliateGrid
                  offers={mainListings.length ? mainListings : allContent}
                  hubMode={isProgramsHub ? 'programs' : 'links'}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  savedItems={savedItems}
                  onSaveItem={handleSaveItem}
                  searchQuery={topSearch}
                  setSearchQuery={setTopSearch}
                  contentType={contentType}
                  loading={false}
                  onItemClick={handleItemClick}
                  trackClick={trackClick}
                  embedInBrowse
                />
              </section>
            </>
          )}
    </CategoryPageShell>
  );
};

export default AffiliatesPage;
