import React, { useMemo, useState } from 'react';
import {
  FiCode,
  FiStar,
  FiShoppingBag,
  FiPlus,
  FiDownload,
  FiEye,
  FiLock,
} from 'react-icons/fi';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import BrowseBottomPostCta from '../shared/BrowseBottomPostCta';
import { BrowseFilterLayout } from '../shared/BrowseFilterLayout';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import SoftwarePurchaseModal from './SoftwarePurchaseModal';
import {
  ALL_SOFTWARE_ITEMS,
  LIVE_SOFTWARE_PRODUCTS,
  SOFTWARE_CATEGORIES,
  SOFTWARE_FRAMEWORKS,
  SOFTWARE_LANGUAGES,
  hasPurchasedSoftware,
  triggerSoftwareFileDownload,
} from '../../data/softwareMarketplace';

const HERO_BG =
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&q=80';

const SoftwareBrowsePage = () => {
  const { requireAuth } = useAuthRedirect();
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

  const categoryLabel = selectedCategory
    ? SOFTWARE_CATEGORIES.find((c) => c.slug === selectedCategory)?.name
    : null;

  const items = useMemo(() => {
    let list = [...ALL_SOFTWARE_ITEMS];
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
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else {
      list.sort((a, b) => {
        if (Boolean(b.isLive) !== Boolean(a.isLive)) return Number(b.isLive) - Number(a.isLive);
        return b.sales - a.sales;
      });
    }
    return list;
  }, [
    selectedCategory,
    appliedSearch,
    sortBy,
    priceMin,
    priceMax,
    framework,
    language,
  ]);

  const handlePostClick = () => {
    requireAuth(
      '/software?post=1',
      'You must be logged in to sell software or digital products.'
    );
  };

  const openPreview = (item) => {
    const url = item.previewUrl || item.downloadUrl;
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleBuyOrDownload = (item) => {
    if (!item.downloadUrl) return;
    if (hasPurchasedSoftware(item.id)) {
      triggerSoftwareFileDownload(item);
      return;
    }
    setCheckoutItem(item);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setTopSearch('');
    setAppliedSearch('');
    setSortBy('popular');
    setPriceMin('');
    setPriceMax('');
    setFramework('');
    setLanguage('');
  };

  const activeCount =
    (selectedCategory ? 1 : 0) +
    (appliedSearch ? 1 : 0) +
    (sortBy !== 'popular' ? 1 : 0) +
    (priceMin !== '' || priceMax !== '' ? 1 : 0) +
    (framework ? 1 : 0) +
    (language ? 1 : 0);

  const renderProductActions = (item, compact = false) => {
    const owned = hasPurchasedSoftware(item.id);
    // purchaseTick forces re-render after checkout
    void purchaseTick;

    return (
      <div className={`flex ${compact ? 'flex-col' : 'flex-row'} gap-2 mt-3`}>
        {(item.previewUrl || item.downloadUrl) && (
          <button
            type="button"
            onClick={() => openPreview(item)}
            className={`inline-flex items-center justify-center gap-1 rounded-md border border-blue-200 bg-white text-blue-800 text-[11px] font-bold hover:bg-blue-50 ${
              compact ? 'px-2.5 py-1.5 w-full' : 'px-3 py-2 flex-1'
            }`}
          >
            <FiEye className="h-3.5 w-3.5" />
            Preview
          </button>
        )}
        {item.downloadUrl && (
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

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton />

      <BrowseMarketplaceHero
        title="Software & Code"
        eyebrow="Software"
        imageUrl={HERO_BG}
        theme="blue"
        categoryLabel={categoryLabel}
        searchValue={topSearch}
        onSearchChange={(e) => setTopSearch(e.target.value)}
        onSearchSubmit={() => setAppliedSearch(topSearch.trim())}
        searchPlaceholder="Search scripts, themes, plugins…"
      />

      <div className="page-container py-4 sm:py-6">
        {LIVE_SOFTWARE_PRODUCTS.length > 0 && !selectedCategory && !appliedSearch && (
          <section className="mb-5 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4 sm:p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-1 text-center sm:text-left">
              Featured live products
            </h2>
            <p className="text-xs text-gray-600 mb-3 text-center sm:text-left">
              Preview free — download unlocks after payment.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {LIVE_SOFTWARE_PRODUCTS.slice(0, 3).map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border border-blue-100 bg-white p-3 flex flex-col"
                >
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{item.title}</h3>
                  <p className="text-[11px] text-gray-500 mt-1 flex-1 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-gray-500">
                    <span>{item.framework}</span>
                    <span className="font-bold text-gray-900">${item.price}</span>
                  </div>
                  {renderProductActions(item, true)}
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <FiCode className="h-4 w-4 text-blue-600" />
              Categories
            </h2>
            {selectedCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                Show all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
            {SOFTWARE_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(active ? '' : cat.slug)}
                  className={`rounded border px-2 py-1.5 text-left text-[11px] sm:text-xs font-semibold transition-colors ${
                    active
                      ? 'border-blue-500 bg-blue-50 text-blue-800 ring-1 ring-blue-200'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-blue-400'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <BrowseFilterLayout
          open={showFilters}
          onOpenChange={setShowFilters}
          onApply={() => setAppliedSearch(topSearch.trim())}
          onClear={clearFilters}
          theme="blue"
          homeHref="/software"
          activeCount={activeCount}
          filterFields={
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
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Programming language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm"
                >
                  <option value="">All languages</option>
                  {SOFTWARE_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
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
          }
          toolbarLeft={
            <p className="text-sm text-gray-600">
              {items.length} item{items.length === 1 ? '' : 's'}
              {categoryLabel ? ` · ${categoryLabel}` : ''}
            </p>
          }
          toolbarRight={
            <button
              type="button"
              onClick={handlePostClick}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold px-3 py-2"
            >
              <FiPlus className="h-4 w-4" />
              Sell software
            </button>
          }
        >
          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
              No items match your selection.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className={`group overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition-all ${
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
                    <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
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
                    {renderProductActions(item)}
                  </div>
                </article>
              ))}
            </div>
          )}
        </BrowseFilterLayout>

        <BrowseBottomPostCta
          title="Sell your software or digital product"
          description="List scripts, themes, plugins, apps and digital assets for buyers worldwide."
          buttonLabel="Start selling"
          onPostClick={handlePostClick}
          theme="blue"
        />
      </div>

      {checkoutItem && (
        <SoftwarePurchaseModal
          item={checkoutItem}
          onClose={() => setCheckoutItem(null)}
          onPurchased={() => setPurchaseTick((n) => n + 1)}
        />
      )}

      <Footer />
    </div>
  );
};

export default SoftwareBrowsePage;
