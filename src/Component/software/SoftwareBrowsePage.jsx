import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FiStar,
  FiShoppingBag,
  FiDownload,
  FiLock,
} from 'react-icons/fi';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import CategoryPageShell from '../shared/CategoryPageShell';
import { getCategoryTheme } from '../../constants/categoryThemes';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import SoftwarePurchaseModal from './SoftwarePurchaseModal';
import CompactPremiumReel from '../shared/CompactPremiumReel';
import BrowsePromotionLanes from '../shared/BrowsePromotionLanes';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';
import BusinessTemplatePostForm from '../shared/BusinessTemplatePostForm';
import businessTemplatesAPI from '../../api/businessTemplatesAPI';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';
import { pickPremiumForReel, splitListingsByPromotion } from '../../utils/listingPromotionSort';
import {
  SOFTWARE_CATEGORIES,
  SOFTWARE_FRAMEWORKS,
  SOFTWARE_LANGUAGES,
  LIVE_SOFTWARE_PRODUCTS,
  DEMO_SOFTWARE_ITEMS,
  hasPurchasedSoftware,
  triggerSoftwareFileDownload,
} from '../../data/softwareMarketplace';

const HERO_BG =
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&q=80';

const mapTemplateToItem = (tpl) => ({
  id: `tpl-${tpl.id || tpl.slug}`,
  title: tpl.title,
  category: tpl.category_slug || 'tools',
  price: Number(tpl.price) || 0,
  sales: tpl.sales_count || tpl.purchases_count || 0,
  rating: Number(tpl.rating) || 4.8,
  author: tpl.seller_name || tpl.user?.name || 'Seller',
  tag: tpl.is_premium ? 'Premium' : 'Listed',
  isLive: true,
  isApiListing: true,
  framework: tpl.template_type || 'Digital',
  language: tpl.vertical || 'software',
  downloadUrl: tpl.file_url || tpl.download_url || '',
  previewUrl: tpl.preview_url || tpl.file_url || '',
  image:
    resolveStorageUrl(tpl.preview_image || tpl.image) ||
    tpl.preview_image ||
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
  description: tpl.blurb || tpl.description || '',
  slug: tpl.slug,
  raw: tpl,
});

const SoftwareBrowsePage = () => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [topSearch, setTopSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [framework, setFramework] = useState('');
  const [language, setLanguage] = useState('');
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [purchaseTick, setPurchaseTick] = useState(0);
  const [apiItems, setApiItems] = useState([]);
  const [loadingApi, setLoadingApi] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const theme = getCategoryTheme('software');

  const loadApiListings = async () => {
    setLoadingApi(true);
    try {
      const res = await businessTemplatesAPI.list({
        per_page: 48,
        search: appliedSearch || undefined,
      });
      const rows = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
      // Prefer software / digital-looking templates; keep others if tagged as tools
      const mapped = rows
        .filter((t) => {
          const hay = `${t.vertical || ''} ${t.category_slug || ''} ${t.template_type || ''} ${t.title || ''}`.toLowerCase();
          return (
            hay.includes('software') ||
            hay.includes('app') ||
            hay.includes('code') ||
            hay.includes('script') ||
            hay.includes('plugin') ||
            hay.includes('template') ||
            t.vertical === 'services' ||
            t.vertical === 'business'
          );
        })
        .map(mapTemplateToItem);
      setApiItems(mapped);
    } catch (e) {
      console.error('Software listings load failed:', e);
      setApiItems([]);
    } finally {
      setLoadingApi(false);
    }
  };

  useEffect(() => {
    loadApiListings();
  }, [appliedSearch]);

  useEffect(() => {
    if (
      (searchParams.get('post') === '1' || searchParams.get('postForm') === 'true') &&
      isAuthenticated
    ) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  const categoryLabel = selectedCategory
    ? SOFTWARE_CATEGORIES.find((c) => c.slug === selectedCategory)?.name
    : null;

  const catalog = useMemo(() => {
    const apiIds = new Set(apiItems.map((i) => String(i.id)));
    const live = LIVE_SOFTWARE_PRODUCTS.filter((p) => !apiIds.has(String(p.id)));
    const demos = DEMO_SOFTWARE_ITEMS.filter(
      (p) => !apiIds.has(String(p.id)) && !live.some((l) => String(l.id) === String(p.id))
    );
    // Prefer API listings; keep curated live + demo products so every category has sellable software.
    return [...apiItems, ...live, ...demos];
  }, [apiItems, purchaseTick]);

  const items = useMemo(() => {
    let list = [...catalog];
    if (selectedCategory) {
      list = list.filter((item) => item.category === selectedCategory);
    }
    if (appliedSearch.trim()) {
      const q = appliedSearch.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q) ||
          String(item.framework || '')
            .toLowerCase()
            .includes(q) ||
          String(item.language || '')
            .toLowerCase()
            .includes(q)
      );
    }
    const min = priceMin !== '' ? Number(priceMin) : null;
    const max = priceMax !== '' ? Number(priceMax) : null;
    if (min != null && !Number.isNaN(min)) {
      list = list.filter((item) => item.price >= min);
    }
    if (max != null && !Number.isNaN(max)) {
      list = list.filter((item) => item.price <= max);
    }
    if (framework) {
      list = list.filter((item) => item.framework === framework);
    }
    if (language) {
      list = list.filter((item) => item.language === language);
    }
    if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    }
    return list;
  }, [
    catalog,
    selectedCategory,
    appliedSearch,
    priceMin,
    priceMax,
    framework,
    language,
    sortBy,
  ]);

  const handlePostClick = () => {
    const path = '/software?post=1';
    if (requireAuth(path, 'You must be logged in to sell software or digital products.')) {
      setShowPostForm(true);
      setSearchParams({ post: '1' });
    }
  };

  const handleBuyOrDownload = (item) => {
    if (!item.downloadUrl && !item.isApiListing) return;
    const price = Number(item.price);
    if (!Number.isFinite(price) || price < 10) {
      toast.error('Paid purchase required (minimum $10). Free downloads are not available.');
      return;
    }
    if (!item.isApiListing && hasPurchasedSoftware(item.id)) {
      triggerSoftwareFileDownload(item);
      return;
    }
    setCheckoutItem(item);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setTopSearch('');
    setAppliedSearch('');
    setPriceMin('');
    setPriceMax('');
    setFramework('');
    setLanguage('');
    setSortBy('popular');
  };

  const activeCount =
    (selectedCategory ? 1 : 0) +
    (appliedSearch ? 1 : 0) +
    (sortBy !== 'popular' ? 1 : 0) +
    (priceMin !== '' || priceMax !== '' ? 1 : 0) +
    (framework ? 1 : 0) +
    (language ? 1 : 0);

  const renderProductActions = (item, compact = false) => {
    const owned = !item.isApiListing && hasPurchasedSoftware(item.id);
    void purchaseTick;
    const canBuy = Boolean(item.downloadUrl) || item.isApiListing;

    return (
      <div className={`flex ${compact ? 'flex-col' : 'flex-row'} gap-2 mt-3`}>
        {canBuy && (
          <button
            type="button"
            onClick={() => handleBuyOrDownload(item)}
            className={`inline-flex items-center justify-center gap-1 rounded-md text-white text-[11px] font-bold ${
              owned ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-blue-700 hover:bg-blue-800'
            } ${compact ? 'px-2.5 py-1.5 w-full' : 'px-3 py-2 flex-1'}`}
          >
            {owned ? (
              <>
                <FiDownload className="h-3.5 w-3.5" /> Download
              </>
            ) : (
              <>
                <FiLock className="h-3.5 w-3.5" /> Buy ${item.price}
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  const featuredReelItems = useMemo(() => {
    return pickPremiumForReel(catalog, { limit: 12, allowFallback: true });
  }, [catalog]);

  const { promoted, regular } = useMemo(() => splitListingsByPromotion(items), [items]);

  const paidListings = useMemo(() => {
    const featuredIds = new Set(featuredReelItems.map((i) => String(i.id)));
    return regular.filter((i) => !featuredIds.has(String(i.id)));
  }, [regular, featuredReelItems]);

  const renderSoftwareGrid = (list) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.map((item) => (
        <article
          key={item.id}
          role="link"
          tabIndex={0}
          onClick={() => navigate(`/software/${item.slug || item.id}`)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate(`/software/${item.slug || item.id}`);
            }
          }}
          className={`group overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-all cursor-pointer ${
            item.isLive
              ? 'border-blue-300 ring-1 ring-blue-100'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
            {item.tag && (
              <span className="absolute top-2 left-2 rounded bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5">
                {item.tag}
              </span>
            )}
          </div>
          <div className="p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700 mb-1">
              {SOFTWARE_CATEGORIES.find((c) => c.slug === item.category)?.name}
            </p>
            <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1 group-hover:text-blue-700">
              {item.title}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {item.framework && (
                <span className="rounded bg-slate-100 text-slate-700 text-[10px] font-semibold px-1.5 py-0.5">
                  {item.framework}
                </span>
              )}
              {item.language && (
                <span className="rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-1.5 py-0.5">
                  {item.language}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="inline-flex items-center gap-0.5 font-semibold text-amber-600">
                  <FiStar className="h-3.5 w-3.5 fill-current" />
                  {item.rating}
                </span>
                <span>·</span>
                <span>{item.sales.toLocaleString()} sales</span>
              </div>
              <div className="inline-flex items-center gap-1 text-sm font-bold text-gray-900">
                <FiShoppingBag className="h-3.5 w-3.5 text-blue-600" />${item.price}
              </div>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">by {item.author}</p>
            <div onClick={(e) => e.stopPropagation()}>{renderProductActions(item)}</div>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <CategoryPageShell
      categoryId="software"
      backHref="/"
      showBackBar
      backBarTo="/"
      backBarLabel="Back Home"
      hero={
        <BrowseMarketplaceHero
          title="Software & Code"
          eyebrow=""
          imageUrl={HERO_BG}
          theme={theme.heroTheme}
          categoryLabel={categoryLabel}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={() => setAppliedSearch(topSearch.trim())}
          searchPlaceholder="Search scripts, themes, plugins…"
        />
      }
      premiumReel={
        featuredReelItems.length > 0 ? (
          <CompactPremiumReel
            items={featuredReelItems}
            title="Featured"
            getHref={(item) => `/software/${item.slug || item.id}`}
            accentClass={theme.accentText || 'text-blue-700'}
            borderAccent="hover:border-blue-300"
          />
        ) : null
      }
      categoryGrid={
        <MarketplaceCategoryCards
          categories={SOFTWARE_CATEGORIES}
          selectedId={selectedCategory}
          title="Categories"
          subtitle="Open a category to browse scripts, themes and apps."
          countLabel="products"
          getId={(c) => c.slug || c.id}
          getLabel={(c) => c.name}
          getSlug={(c) => c.slug || c.id}
          getCount={() => null}
          onSelect={(category, id) =>
            setSelectedCategory((prev) => (String(prev) === String(id) ? '' : id))
          }
          accentRing="ring-blue-500"
          accentBorder="border-blue-300"
          hoverBorder="hover:border-blue-200"
          hoverTitle="group-hover:text-blue-700"
          hoverArrow="group-hover:bg-blue-100 group-hover:text-blue-700"
          initialVisible={16}
        />
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: () => setAppliedSearch(topSearch.trim()),
        onClear: clearFilters,
        theme: theme.filterTheme,
        homeHref: '/software',
        activeCount,
        filterFields: (
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Price range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm"
                />
                <span className="text-gray-400">–</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm"
              >
                <option value="">All frameworks</option>
                {SOFTWARE_FRAMEWORKS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Programming language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm"
              >
                <option value="">All languages</option>
                {SOFTWARE_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm"
              >
                <option value="popular">Most popular</option>
                <option value="rating">Highest rated</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </div>
        ),
      }}
      bottomCta={{
        buttonLabel: 'List your code',
        onPostClick: handlePostClick,
        theme: theme.ctaTheme,
      }}
      afterContent={
        <>
          {checkoutItem ? (
            <SoftwarePurchaseModal
              item={checkoutItem}
              onClose={() => setCheckoutItem(null)}
              onPurchased={() => setPurchaseTick((n) => n + 1)}
            />
          ) : null}
          {showPostForm ? (
            <BusinessTemplatePostForm
              defaultVertical="business"
              defaultCategoryKey="app-software"
              defaultCategoryName="App & software"
              onClose={() => {
                setShowPostForm(false);
                setSearchParams({});
              }}
              onSuccess={() => {
                setShowPostForm(false);
                setSearchParams({});
                loadApiListings();
                toast.success('Your listing is live');
              }}
            />
          ) : null}
        </>
      }
    >
        {loadingApi && items.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
              No items match your selection.
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handlePostClick}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  List your code
                </button>
              </div>
            </div>
          ) : (
            <BrowsePromotionLanes
              promoted={promoted}
              paid={paidListings.length ? paidListings : items}
              maxPromoted={9}
              renderGrid={renderSoftwareGrid}
            />
          )}
    </CategoryPageShell>
  );
};

export default SoftwareBrowsePage;
