import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import '../styles/affiliates.css';
import useAuthRedirect from '../hooks/useAuthRedirect';
import affiliateService from '../services/AffiliateService';
import toast from 'react-hot-toast';
import AffiliateHero from '../Component/affiliates/AffiliateHero';
import AffiliateMarketplaceHero from '../Component/affiliates/AffiliateMarketplaceHero';
import AffiliateCategoryGrid from '../Component/affiliates/AffiliateCategoryGrid';
import AffiliateModalForm from '../Component/affiliates/AffiliateModalForm';
import AffiliateGrid from '../Component/affiliates/AffiliateGrid';
import AffiliateMarketplaceTable from '../Component/affiliates/AffiliateMarketplaceTable';
import AffiliateMarketplaceCards from '../Component/affiliates/AffiliateMarketplaceCards';
import AffiliateActivityFeed from '../Component/affiliates/AffiliateActivityFeed';
import AffiliateHowItWorks from '../Component/affiliates/AffiliateHowItWorks';
import AffiliateFlowStrip from '../Component/affiliates/AffiliateFlowStrip';
import { FaThLarge, FaList } from 'react-icons/fa';
import StandardListingFilters from '../Component/shared/StandardListingFilters';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import { getCategoryTheme } from '../constants/categoryThemes';
import { rewriteLocalStorageUrl, getStorageAssetUrl } from '../utils/jobsHelpers';
import { enrichMarketplaceStats } from '../utils/affiliateMarketplaceStats';
import { cacheBusinessOffers } from '../utils/affiliateOfferCache';
import { extractListItems } from '../utils/apiResponseHelpers';
import { isBusinessAccount } from '../utils/accountType';
import { normalizeAffiliateFormMode } from '../utils/affiliateFormMode';
import { getOfferShopping } from '../utils/offerShoppingActivity';

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
 * Clive’s 3-part Affiliates architecture:
 * - ads (default /affiliates): promoted affiliate link ads
 * - marketplace (/affiliates/marketplace): businesses offering products/services to promote
 * Legacy aliases: links → ads, programs → marketplace
 */
const AffiliatesPage = ({ hubMode = 'ads' }) => {
  const normalizedHub =
    hubMode === 'programs' || hubMode === 'marketplace'
      ? 'marketplace'
      : hubMode === 'links' || hubMode === 'ads'
        ? 'ads'
        : 'ads';
  const isMarketplaceHub = normalizedHub === 'marketplace';
  const isProgramsHub = isMarketplaceHub; // keep alias used throughout render
  const [searchParams, setSearchParams] = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const { userDetail } = useSelector((store) => store.auth);
  const canListBusinessOffers = isAuthenticated && isBusinessAccount(userDetail);
  const canPostLinkAd = isAuthenticated;

  const canOpenPostForm = (mode) => {
    const normalized = normalizeAffiliateFormMode(mode) || mode;
    if (normalized === 'business') return canListBusinessOffers;
    if (normalized === 'user') return canPostLinkAd;
    return false;
  };

  const [postFormMode, setPostFormMode] = useState(isMarketplaceHub ? 'business' : 'user');
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
  const [dealFilter, setDealFilter] = useState('all');
  const [sortBy, setSortBy] = useState(isMarketplaceHub ? 'gravity' : 'newest');
  const [sortOrder, setSortOrder] = useState('desc');
  const [savedItems, setSavedItems] = useState([]);
  // Forced by hub: marketplace = business only; ads = user (+ featured links)
  const [contentType, setContentType] = useState(isMarketplaceHub ? 'business' : 'user');
  const marketplaceRef = useRef(null);

  const homeHref = isMarketplaceHub ? '/affiliates/marketplace' : '/affiliates';
  const openPostDefaultMode = isMarketplaceHub ? 'business' : 'user';

  const openPostForm = (mode = openPostDefaultMode) => {
    const normalized = normalizeAffiliateFormMode(mode) || mode;

    if (
      requireAuth(
        `${homeHref}?postForm=true&mode=${normalized}`,
        normalized === 'business'
          ? 'You must be logged in to list a product or service.'
          : 'You must be logged in to post an affiliate link ad.'
      )
    ) {
      if (!canOpenPostForm(normalized)) {
        if (normalized === 'business') {
          toast.error('Switch to a Business account to list products on the marketplace.');
        }
        return;
      }
      setPostFormMode(normalized);
      setShowPostForm(true);
      setSearchParams({ postForm: 'true', mode: normalized });
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
      const normalized =
        normalizeAffiliateFormMode(modeParam) ||
        (isProgramsHub ? 'business' : 'user');
      if (canOpenPostForm(normalized)) {
        setPostFormMode(normalized);
        setShowPostForm(true);
      }
    }
  }, [searchParams, isAuthenticated, isProgramsHub, canListBusinessOffers, canPostLinkAd]);

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
        isProgramsHub
          ? affiliateService.getBusinessOffers({
              per_page: 48,
              marketplace: 1,
              sort: 'gravity',
              order: 'desc',
            })
          : Promise.resolve({ data: [] }),
        isProgramsHub
          ? Promise.resolve({ data: [] })
          : affiliateService.getUserPosts({ per_page: 48, marketplace: 1 }),
        isProgramsHub
          ? Promise.resolve({ data: [] })
          : affiliateService.getAffiliateLinks({ per_page: 50 }),
      ]);

    if (categoriesResult.status === 'fulfilled') {
      setCategories(categoriesResult.value?.data || []);
    } else {
      console.warn('Affiliate categories unavailable:', categoriesResult.reason);
      setCategories([]);
    }
    setCategoriesLoading(false);

    if (businessResult.status === 'fulfilled') {
      const offers = extractListItems(businessResult.value);
      cacheBusinessOffers(offers);
      setBusinessOffers(offers);
    } else {
      console.warn('Business offers unavailable:', businessResult.reason);
      setBusinessOffers([]);
    }

    if (userResult.status === 'fulfilled') {
      setUserPosts(extractListItems(userResult.value));
    } else {
      console.warn('User posts unavailable:', userResult.reason);
      setUserPosts([]);
    }

    if (linksResult.status === 'fulfilled') {
      setAffiliateLinks(extractListItems(linksResult.value));
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
      const offers = extractListItems(response);
      cacheBusinessOffers(offers);
      setBusinessOffers(offers);
    } catch (err) {
      console.error('Error fetching business offers:', err);
      toast.error('Failed to load business offers');
    }
  };

  const fetchUserPosts = async (params = {}) => {
    try {
      const response = await affiliateService.getUserPosts(params);
      setUserPosts(extractListItems(response));
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

    const filterParams = {
      per_page: 48,
      marketplace: 1,
    };
    if (selectedCategoryId) filterParams.category_id = selectedCategoryId;
    if (next.country) filterParams.country = next.country;
    if (next.city) filterParams.city = next.city;
    if (next.search || topSearch.trim()) filterParams.q = next.search || topSearch.trim();
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
    fetchBusinessOffers({ per_page: 48, marketplace: isProgramsHub ? 1 : undefined });
    fetchUserPosts({ per_page: 48, marketplace: isProgramsHub ? undefined : 1 });
  };

  const clearExtraFilters = () => {
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
    const businessParams = selectedCategoryId
      ? { category_id: selectedCategoryId, per_page: 48, marketplace: isProgramsHub ? 1 : undefined }
      : { per_page: 48, marketplace: isProgramsHub ? 1 : undefined };
    const userParams = selectedCategoryId
      ? { category_id: selectedCategoryId, per_page: 48, marketplace: isProgramsHub ? undefined : 1 }
      : { per_page: 48, marketplace: isProgramsHub ? undefined : 1 };
    fetchBusinessOffers(businessParams);
    fetchUserPosts(userParams);
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
        const list = Array.isArray(bOffers) ? bOffers : [];
        cacheBusinessOffers(list);
        setBusinessOffers(list);
      } else {
        const uPosts = response?.data?.user_posts ?? response?.user_posts ?? [];
        const links = response?.data?.affiliate_links ?? response?.affiliate_links ?? [];
        setUserPosts(Array.isArray(uPosts) ? uPosts : []);
        setAffiliateLinks(Array.isArray(links) ? links : []);
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
    const enriched = enrichMarketplaceStats({
      ...item,
      contentType: contentTypeKey,
      id: `${idPrefix}-${item.id}`,
      type: contentTypeKey === 'link' ? 'link' : contentTypeKey,
      ...fields,
      image: resolveImageUrl(item),
      isNew: createdAt > fiveMinutesAgo,
    });
    return enriched;
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

        const shopping = getOfferShopping(offer);
        if (dealFilter === 'on_sale' && !shopping.on_sale) return;
        if (dealFilter === 'dropping_soon' && !shopping.dropping_soon) return;

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
    } else if (sortBy === 'commission' || sortBy === 'commission_rate') {
      content.sort((a, b) => {
        const ca = Number(a.commission || 0);
        const cb = Number(b.commission || 0);
        return sortOrder === 'asc' ? ca - cb : cb - ca;
      });
    } else if (sortBy === 'gravity') {
      content.sort((a, b) => {
        const ga = a.marketplace_stats?.gravity ?? 0;
        const gb = b.marketplace_stats?.gravity ?? 0;
        return sortOrder === 'asc' ? ga - gb : gb - ga;
      });
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
    sortOrder,
    dealFilter,
  ]);

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
      backHref={isMarketplaceHub ? '/affiliates' : '/'}
      showBackBar
      backBarTo={isMarketplaceHub ? '/affiliates' : '/'}
      backBarLabel={isMarketplaceHub ? 'Affiliate' : 'Back Home'}
      hero={
        isProgramsHub ? (
          <AffiliateMarketplaceHero
            searchValue={topSearch}
            onSearchChange={(e) => setTopSearch(e.target.value)}
            onSearchSubmit={applyTopSearch}
            showSellCta={canListBusinessOffers}
            onSellClick={() => openPostForm('business')}
          />
        ) : (
          <AffiliateHero
            searchValue={topSearch}
            onSearchChange={(e) => setTopSearch(e.target.value)}
            onSearchSubmit={applyTopSearch}
          />
        )
      }
      categoryGrid={
        <AffiliateCategoryGrid
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleCategorySelect}
          loading={categoriesLoading}
          compact={isProgramsHub}
        />
      }
      contentClassName={
        isProgramsHub ? 'page-container py-3 sm:py-4' : 'page-container py-4 sm:py-6'
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
              {isProgramsHub && <option value="gravity">Highest gravity</option>}
              <option value="newest">Newest</option>
              <option value="views">Most views</option>
              {isProgramsHub && (
                <option value="commission">Highest commission</option>
              )}
              <option value="rating">Top rated</option>
            </select>
        ),
      }}
      bottomCta={
        isProgramsHub
          ? canListBusinessOffers
            ? {
                buttonLabel: 'List product or service',
                onPostClick: () => openPostForm('business'),
                theme: theme.ctaTheme,
                buttonOnly: true,
              }
            : null
          : {
              buttonLabel: 'Post an affiliate advert',
              onPostClick: () => openPostForm('user'),
              theme: theme.ctaTheme,
              buttonOnly: true,
            }
      }
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

          <AffiliateFlowStrip />

          {!isProgramsHub && <AffiliateHowItWorks variant="ads" />}

          {isProgramsHub && (
            <div ref={marketplaceRef} className="mb-4">
              <AffiliateHowItWorks />
              <div className="flex flex-wrap items-end justify-between gap-2 mb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
                    Marketplace offers
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                    Tag brand products, sales, price drops, and scheduled drops — then earn on hop sales
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                        viewMode === 'grid'
                          ? 'bg-primary text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                      aria-label="Card view"
                    >
                      <FaThLarge className="h-3 w-3" />
                      Cards
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                        viewMode === 'list'
                          ? 'bg-primary text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                      aria-label="Table view"
                    >
                      <FaList className="h-3 w-3" />
                      Table
                    </button>
                  </div>
                  {canListBusinessOffers ? (
                    <button
                      type="button"
                      onClick={() => openPostForm('business')}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      + Sell on marketplace
                    </button>
                  ) : (
                    <Link
                      to="/dashboard?tab=affiliates&mode=buying&sub=promoting"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      My promotions →
                    </Link>
                  )}
                </div>
              </div>
              <div className="mb-3 inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
                {[
                  { id: 'all', label: 'All offers' },
                  { id: 'on_sale', label: 'On sale' },
                  { id: 'dropping_soon', label: 'Dropping soon' },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setDealFilter(chip.id)}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                      dealFilter === chip.id
                        ? 'bg-primary text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              {viewMode === 'list' ? (
                <AffiliateMarketplaceTable
                  offers={mainListings.length ? mainListings : allContent}
                  loading={loading}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={(key, order) => {
                    setSortBy(key);
                    setSortOrder(order);
                  }}
                />
              ) : (
                <AffiliateMarketplaceCards
                  offers={mainListings.length ? mainListings : allContent}
                  loading={loading}
                />
              )}
            </div>
          )}

          {isProgramsHub && (
            <div className="mb-6">
              <AffiliateActivityFeed compact showRealData />
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

          {!isProgramsHub &&
            (loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-r-transparent" />
            </div>
          ) : allContent.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                No affiliate link ads found
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                These are posts already being promoted — try different filters
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
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-2">
                Affiliate ads being promoted
              </h2>
              <p className="text-xs text-gray-500 mb-3">
                Live hop posts. To join a brand program first, use Marketplace → Get hop link → Post as Affiliate Ad.
              </p>
              <AffiliateGrid
                offers={allContent}
                hubMode="links"
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
          ))}
    </CategoryPageShell>
  );
};

export default AffiliatesPage;
