import React, { useEffect, useMemo, useState } from 'react';
import { FiSearch, FiShoppingBag, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  CATEGORY_TEMPLATES,
  resolveTemplateFile,
} from '../../constants/categoryTemplates';
import { resolveTemplateAssetUrl } from '../../utils/templateUrls';
import businessTemplatesAPI from '../../api/businessTemplatesAPI';
import BusinessTemplatePostForm from './BusinessTemplatePostForm';
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
 * Full templates shop with Clive filters + Buy & download.
 */
const TemplateCatalogShop = ({
  vertical = 'business',
  categoryKey = '',
  theme = 'green',
  sellLabel = 'Sell a template',
}) => {
  const { requireAuth } = useAuthRedirect();
  const [apiItems, setApiItems] = useState([]);
  const [apiStatus, setApiStatus] = useState('idle'); // idle | ok | error
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [buyingId, setBuyingId] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);

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
      .list({ vertical, category_slug: categoryKey || undefined, per_page: 50, search })
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
  }, [vertical, categoryKey, search]);

  // Live API when seeded; static packs only if API empty/unavailable (not on empty search).
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

  const filtered = merged.filter((item) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const hay = `${item.title} ${item.blurb || ''} ${item.category || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (typeFilter !== 'all') {
      const t = (item.template_type || item.title || '').toLowerCase();
      if (typeFilter === 'agreement' && !(t.includes('agreement') || t.includes('sale') || t.includes('invoice') || t.includes('bill'))) {
        return false;
      }
      if (typeFilter !== 'agreement' && typeFilter !== 'document' && !t.includes(typeFilter)) {
        return false;
      }
      if (typeFilter === 'document' && (t.includes('pitch') || t.includes('plan') || t.includes('grant') || t.includes('agreement'))) {
        // keep generic docs only loosely
      }
    }
    if (maxPrice !== '' && Number(item.priceAmount) > Number(maxPrice)) return false;
    return true;
  });

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
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-600">Search templates</label>
            <div className="relative mt-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 h-4 w-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Sale agreement, pitch, grant…"
                className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border ${accent}`}
              />
            </div>
          </div>
          <div className="w-full sm:w-40">
            <label className="text-xs font-semibold text-gray-600">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`mt-1 w-full py-2.5 px-3 text-sm rounded-lg border ${accent}`}
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t === 'all' ? 'All types' : t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-36">
            <label className="text-xs font-semibold text-gray-600">Max price ($)</label>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Any"
              className={`mt-1 w-full py-2.5 px-3 text-sm rounded-lg border ${accent}`}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (requireAuth(window.location.pathname, 'Sign in to sell a template.')) {
                setShowPostForm(true);
              }
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          >
            {sellLabel}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {filtered.length} templates · Worldwide Adverts takes 15% of each sale
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((item) => {
          const key = item.id || item.slug || item.title;
          const fileUrl = resolveTemplateAssetUrl(item.file || resolveTemplateFile(item.title));
          return (
            <article
              key={key}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col"
            >
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                {item.categoryLabel || item.category || vertical}
              </p>
              <h3 className="text-sm font-bold text-gray-900 mt-1">{item.title}</h3>
              <p className="text-xs text-gray-600 mt-1.5 flex-1 leading-relaxed">{item.blurb}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-gray-900">{item.price || `From $${item.priceAmount}`}</p>
                <div className="flex gap-2">
                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-gray-600 underline"
                    >
                      Preview
                    </a>
                  )}
                  <button
                    type="button"
                    disabled={buyingId === key}
                    onClick={() => handleBuy(item)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-2.5 py-1.5 disabled:opacity-60"
                  >
                    <FiShoppingBag className="h-3 w-3" />
                    {buyingId === key ? 'Buying…' : 'Buy & download'}
                    <FiDownload className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-500 py-10">No templates match your filters.</p>
      )}

      {showPostForm && (
        <BusinessTemplatePostForm
          defaultVertical={vertical}
          defaultCategoryKey={categoryKey}
          onClose={() => setShowPostForm(false)}
          onSuccess={() => setShowPostForm(false)}
        />
      )}
    </div>
  );
};

export default TemplateCatalogShop;
