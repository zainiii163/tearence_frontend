import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingBag, FiDownload, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  CATEGORY_TEMPLATES,
  resolveTemplateFile,
} from '../../constants/categoryTemplates';
import { resolveTemplateAssetUrl } from '../../utils/templateUrls';
import businessTemplatesAPI from '../../api/businessTemplatesAPI';
import BusinessTemplatePostForm from './BusinessTemplatePostForm';
import TemplatePagePreviewModal from './TemplatePagePreviewModal';
import TemplateQuoteModal from './TemplateQuoteModal';
import TemplateProfessionalFillOffer from './TemplateProfessionalFillOffer';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

const parsePrice = (label) => {
  if (typeof label === 'number') return label;
  const m = String(label || '').match(/(\d+(?:\.\d+)?)/);
  return m ? Number(m[1]) : 19;
};

const slugFromTitle = (title) =>
  String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Templates shop — left filters, centered search, compact cards, titles-only preview.
 */
const TemplateCatalogShop = ({
  vertical = 'business',
  categoryKey = '',
  theme = 'green',
  sellLabel = 'Sell a template',
  backHref = null,
  backLabel = 'Back',
}) => {
  const { requireAuth } = useAuthRedirect();
  const [apiItems, setApiItems] = useState([]);
  const [apiStatus, setApiStatus] = useState('idle');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [buyingId, setBuyingId] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [quoteItem, setQuoteItem] = useState(null);
  const [showGeneralQuote, setShowGeneralQuote] = useState(false);

  const staticItems = useMemo(() => {
    const tree = CATEGORY_TEMPLATES[vertical] || {};
    const packs = [];
    const keys = categoryKey && tree[categoryKey] ? [categoryKey] : Object.keys(tree);
    keys.forEach((key) => {
      const section = tree[key];
      (section?.items || []).forEach((item) => {
        packs.push({
          ...item,
          category: key,
          categoryLabel: section.headline || key,
          file: item.file || resolveTemplateFile(item.title),
          priceAmount: parsePrice(item.price),
          slug: slugFromTitle(item.title),
          source: 'catalog',
        });
      });
    });
    return packs;
  }, [vertical, categoryKey]);

  useEffect(() => {
    let cancelled = false;
    setApiStatus('idle');
    businessTemplatesAPI
      .list({
        vertical,
        category_slug: categoryKey || undefined,
        per_page: 50,
        search: search || undefined,
        max_price: maxPrice || undefined,
        is_premium: premiumOnly || undefined,
        template_type: typeFilter !== 'all' ? typeFilter : undefined,
      })
      .then((res) => {
        if (cancelled) return;
        const rows = res?.data?.data || res?.data?.items || res?.data || [];
        if (!Array.isArray(rows)) {
          setApiItems([]);
          setApiStatus('ok');
          return;
        }
        setApiItems(
          rows.map((item) => ({
            id: item.id,
            title: item.title,
            blurb: item.blurb,
            price: item.display_price || item.price_label || `From $${item.price}`,
            priceAmount: Number(item.price) || parsePrice(item.price_label),
            file: item.file_url,
            slug: item.slug,
            template_type: item.template_type,
            category: item.category_slug,
            is_premium: Boolean(item.is_premium_active || item.is_premium),
            source: 'api',
          }))
        );
        setApiStatus('ok');
      })
      .catch(() => {
        if (!cancelled) {
          setApiItems([]);
          setApiStatus('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [vertical, categoryKey, search, maxPrice, premiumOnly, typeFilter]);

  const merged = useMemo(() => {
    if (apiStatus === 'ok' && apiItems.length > 0) return apiItems;
    if (apiStatus === 'ok' && search) return [];
    return staticItems;
  }, [apiStatus, apiItems, staticItems, search]);

  const types = useMemo(() => {
    const set = new Set();
    merged.forEach((i) => {
      if (i.template_type) set.add(i.template_type);
      else if (i.title) {
        const t = i.title.toLowerCase();
        if (t.includes('agreement') || t.includes('sale') || t.includes('invoice')) set.add('agreement');
        else if (t.includes('pitch') || t.includes('deck')) set.add('pitch');
        else if (t.includes('plan')) set.add('plan');
        else if (t.includes('grant') || t.includes('proposal')) set.add('proposal');
        else set.add('document');
      }
    });
    return ['all', ...Array.from(set)];
  }, [merged]);

  const filtered = merged
    .filter((item) => {
      const q = search.trim().toLowerCase();
      if (q) {
        const hay = `${item.title} ${item.blurb || ''} ${item.category || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (typeFilter !== 'all') {
        const t = (item.template_type || item.title || '').toLowerCase();
        if (
          typeFilter === 'agreement' &&
          !(t.includes('agreement') || t.includes('sale') || t.includes('invoice') || t.includes('bill'))
        ) {
          return false;
        }
        if (typeFilter !== 'agreement' && typeFilter !== 'document' && !t.includes(typeFilter)) {
          return false;
        }
      }
      if (maxPrice !== '' && Number(item.priceAmount) > Number(maxPrice)) return false;
      if (premiumOnly && !item.is_premium) return false;
      return true;
    })
    .sort((a, b) => Number(Boolean(b.is_premium)) - Number(Boolean(a.is_premium)));

  const handleBuy = async (item) => {
    const path = window.location.pathname + window.location.search;
    if (!requireAuth(path, 'Sign in to buy and download templates.')) return;

    const key = item.id || item.slug || item.title;
    setBuyingId(key);
    try {
      const res = await businessTemplatesAPI.purchase({
        template_id: item.id || undefined,
        slug: item.slug || slugFromTitle(item.title),
        title: item.title,
        file_url: item.file || resolveTemplateAssetUrl(resolveTemplateFile(item.title)),
        price: item.priceAmount,
        payment_method: 'platform',
      });
      const data = res?.data || res;
      const url = data?.download_url;
      toast.success('Purchase complete — downloading your template.');
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else if (item.file) {
        window.open(resolveTemplateAssetUrl(item.file), '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Purchase failed. Try again.');
    } finally {
      setBuyingId(null);
    }
  };

  const accent =
    theme === 'purple'
      ? 'border-violet-200 focus:ring-violet-300'
      : theme === 'slate'
        ? 'border-[#0c1520]/20 focus:ring-[#b8895a]'
        : theme === 'emerald'
          ? 'border-teal-200 focus:ring-teal-300'
          : theme === 'red'
            ? 'border-rose-200 focus:ring-rose-300'
            : theme === 'amber'
              ? 'border-amber-200 focus:ring-amber-300'
              : theme === 'orange'
                ? 'border-orange-200 focus:ring-orange-300'
                : 'border-emerald-200 focus:ring-emerald-300';

  return (
    <div className="space-y-4">
      {backHref && (
        <Link
          to={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900"
        >
          <FiArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      )}

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Left filters (Clive) */}
        <aside className="w-full lg:w-52 shrink-0 space-y-3">
          <div className="rounded-lg border border-gray-200 bg-white p-3 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Filters</p>
            <div>
              <label className="text-xs font-semibold text-gray-600">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`mt-1 w-full py-2 px-2.5 text-sm rounded-md border ${accent}`}
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'All types' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Max price ($)</label>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Any"
                className={`mt-1 w-full py-2 px-2.5 text-sm rounded-md border ${accent}`}
              />
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={premiumOnly}
                onChange={(e) => setPremiumOnly(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-gray-300"
              />
              Premium only
            </label>
            <button
              type="button"
              onClick={() => {
                setTypeFilter('all');
                setMaxPrice('');
                setPremiumOnly(false);
                setSearch('');
              }}
              className="w-full text-[11px] font-semibold text-gray-500 hover:text-gray-800 underline"
            >
              Clear filters
            </button>
            <button
              type="button"
              onClick={() => {
                if (requireAuth(window.location.pathname, 'Sign in to sell a template.')) {
                  setShowPostForm(true);
                }
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-gray-300 bg-white hover:bg-gray-50"
            >
              {sellLabel}
            </button>
            <p className="text-[11px] text-gray-500 leading-snug">
              {filtered.length} templates · 15% platform fee
            </p>
          </div>
        </aside>

        {/* Main: centered search + compact cards */}
        <div className="flex-1 min-w-0 space-y-4">
          <TemplateProfessionalFillOffer
            theme={theme}
            onRequestQuote={() => setShowGeneralQuote(true)}
          />

          <div className="max-w-xl mx-auto w-full">
            <label className="sr-only">Search templates</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 h-4 w-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates — sale agreement, pitch, grant…"
                className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border bg-white shadow-sm ${accent}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {filtered.map((item) => {
              const key = item.id || item.slug || item.title;
              return (
                <article
                  key={key}
                  className="rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm flex flex-col"
                >
                  <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400 truncate flex items-center gap-1 flex-wrap">
                    <span className="text-teal-700 shrink-0 normal-case tracking-normal font-semibold">Fillable</span>
                    {item.is_premium && (
                      <span className="text-amber-600 shrink-0">Premium</span>
                    )}
                    {item.categoryLabel || item.category || vertical}
                  </p>
                  <h3 className="text-[13px] font-bold text-gray-900 mt-0.5 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-snug flex-1">
                    {item.blurb}
                  </p>
                  <div className="mt-2 pt-2 border-t border-gray-100 space-y-1.5">
                    <p className="text-sm font-bold text-gray-900">
                      {item.price || `From $${item.priceAmount}`}
                    </p>
                    <button
                      type="button"
                      disabled={buyingId === key}
                      onClick={() => handleBuy(item)}
                      className="w-full inline-flex items-center justify-center gap-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-2 py-1.5 disabled:opacity-60"
                    >
                      <FiShoppingBag className="h-3 w-3" />
                      {buyingId === key ? 'Buying…' : 'Buy & download'}
                      <FiDownload className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="w-full text-[11px] font-semibold text-gray-500 hover:text-gray-800 underline"
                    >
                      Preview pages
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuoteItem(item)}
                      className="w-full inline-flex items-center justify-center gap-1 text-[11px] font-semibold px-2 py-1.5 rounded-md border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100"
                    >
                      <FiMessageSquare className="h-3 w-3" /> Get quote (we fill it)
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-10">No templates match your filters.</p>
          )}
        </div>
      </div>

      {/* Titles + tiny page teaser (Clive / Vikas–Shihab workflow) */}
      {previewItem && (
        <TemplatePagePreviewModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onBuy={(it) => handleBuy(it)}
          buying={buyingId === (previewItem.id || previewItem.slug || previewItem.title)}
        />
      )}

      {showPostForm && (
        <BusinessTemplatePostForm
          defaultVertical={vertical}
          defaultCategoryKey={categoryKey}
          onClose={() => setShowPostForm(false)}
          onSuccess={() => setShowPostForm(false)}
        />
      )}

      <TemplateQuoteModal
        open={Boolean(quoteItem) || showGeneralQuote}
        template={quoteItem}
        vertical={vertical}
        onClose={() => {
          setQuoteItem(null);
          setShowGeneralQuote(false);
        }}
      />
    </div>
  );
};

export default TemplateCatalogShop;
