import React, { useEffect, useState } from 'react';
import { FiShoppingBag, FiArrowRight, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  getCategoryTemplates,
  resolveCategoryTemplateKey,
  resolveTemplateFile,
} from '../../constants/categoryTemplates';
import { resolveTemplateAssetUrl } from '../../utils/templateUrls';
import businessTemplatesAPI from '../../api/businessTemplatesAPI';
import BusinessTemplatePostForm from './BusinessTemplatePostForm';
import TemplatePagePreviewModal from './TemplatePagePreviewModal';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

const THEMES = {
  green: {
    wrap: 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50',
    badge: 'bg-emerald-100 text-emerald-800',
    price: 'text-emerald-700',
    button: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    accent: 'border-emerald-100 hover:border-emerald-300',
  },
  emerald: {
    wrap: 'border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50',
    badge: 'bg-teal-100 text-teal-800',
    price: 'text-teal-700',
    button: 'bg-teal-700 hover:bg-teal-800 text-white',
    accent: 'border-teal-100 hover:border-teal-300',
  },
  purple: {
    wrap: 'border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50',
    badge: 'bg-violet-100 text-violet-800',
    price: 'text-violet-700',
    button: 'bg-violet-700 hover:bg-violet-800 text-white',
    accent: 'border-violet-100 hover:border-violet-300',
  },
  red: {
    wrap: 'border-rose-200 bg-gradient-to-br from-rose-50 via-white to-orange-50',
    badge: 'bg-rose-100 text-rose-800',
    price: 'text-rose-700',
    button: 'bg-rose-700 hover:bg-rose-800 text-white',
    accent: 'border-rose-100 hover:border-rose-300',
  },
  amber: {
    wrap: 'border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50',
    badge: 'bg-amber-100 text-amber-900',
    price: 'text-amber-800',
    button: 'bg-amber-600 hover:bg-amber-700 text-white',
    accent: 'border-amber-100 hover:border-amber-300',
  },
  orange: {
    wrap: 'border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50',
    badge: 'bg-orange-100 text-orange-900',
    price: 'text-orange-800',
    button: 'bg-orange-600 hover:bg-orange-700 text-white',
    accent: 'border-orange-100 hover:border-orange-300',
  },
  blue: {
    wrap: 'border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-50',
    badge: 'bg-sky-100 text-sky-900',
    price: 'text-sky-800',
    button: 'bg-blue-700 hover:bg-blue-800 text-white',
    accent: 'border-sky-100 hover:border-sky-300',
  },
  slate: {
    wrap: 'border-[#0c1520]/15 bg-gradient-to-br from-[#faf8f4] via-white to-[#f3efe6]',
    badge: 'bg-[#0c1520] text-[#b8895a]',
    price: 'text-[#0c1520]',
    button: 'bg-[#0c1520] hover:bg-[#1a2838] text-white',
    accent: 'border-[#0c1520]/10 hover:border-[#b8895a]',
  },
};

/**
 * Clive: relevant content at bottom of each category — business templates for sale.
 * Prefers live API; falls back to static categoryTemplates.js.
 * Sell opens dedicated BusinessTemplatePostForm.
 */
const BrowseCategoryTemplates = ({
  vertical,
  categoryKey = '',
  categoryName = '',
  theme = 'green',
  onBrowseClick,
  onSellClick,
  onPosted,
  browseLabel = 'Browse templates',
  sellLabel = 'Sell a template',
}) => {
  const { requireAuth } = useAuthRedirect();
  const fallback = getCategoryTemplates(vertical, categoryKey, categoryName);
  const [content, setContent] = useState(fallback);
  const [showPostForm, setShowPostForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const slug =
      resolveCategoryTemplateKey(vertical, categoryKey, categoryName) || 'default';

    setContent(fallback);

    businessTemplatesAPI
      .browse(vertical, slug)
      .then((res) => {
        if (cancelled) return;
        const data = res?.data ?? res;
        if (data?.items?.length) {
          setContent({
            headline: data.headline || fallback?.headline,
            description: data.description || fallback?.description,
            items: data.items.map((item) => ({
              title: item.title,
              blurb: item.blurb,
              price: item.price || item.price_label || `From $${item.price_amount ?? 0}`,
              id: item.id,
              slug: item.slug,
              file: resolveTemplateAssetUrl(
                item.file_url || item.file || resolveTemplateFile(item.title)
              ),
            })),
          });
        }
      })
      .catch(() => {
        /* keep static fallback */
      });

    return () => {
      cancelled = true;
    };
  }, [vertical, categoryKey, categoryName, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSellClick = () => {
    if (onSellClick) {
      onSellClick();
      return;
    }
    const path = `${window.location.pathname}${window.location.search || ''}`;
    if (requireAuth(path, 'You must be logged in to sell a template.')) {
      setShowPostForm(true);
    }
  };

  const handlePosted = () => {
    setRefreshKey((k) => k + 1);
    onPosted?.();
  };

  const handleBuy = async (item) => {
    const path = `${window.location.pathname}${window.location.search || ''}`;
    if (!requireAuth(path, 'Sign in to buy and download templates.')) return;
    try {
      const priceMatch = String(item.price || '').match(/(\d+)/);
      const res = await businessTemplatesAPI.purchase({
        template_id: item.id || undefined,
        slug: item.slug || String(item.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: item.title,
        file_url: item.file || resolveTemplateAssetUrl(resolveTemplateFile(item.title)),
        price: priceMatch ? Number(priceMatch[1]) : 19,
        payment_method: 'platform',
      });
      const url = res?.data?.download_url;
      toast.success('Purchased — downloading template.');
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
      else if (item.file) window.open(resolveTemplateAssetUrl(item.file), '_blank', 'noopener,noreferrer');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Purchase failed.');
    }
  };

  if (!content?.items?.length) return null;

  const t = THEMES[theme] || THEMES.green;
  const badgeLabel =
    vertical === 'buy-sell'
      ? 'Buy & sell templates'
      : vertical === 'books'
        ? 'Book & author templates'
        : vertical === 'property'
          ? 'Property templates for sale'
          : 'Business templates for sale';

  return (
    <>
      <section className={`mt-8 mb-2 rounded-2xl border ${t.wrap} p-5 sm:p-6`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div>
            <p className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-md mb-2 ${t.badge}`}>
              <FiShoppingBag className="h-3.5 w-3.5" />
              {badgeLabel}
            </p>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">{content.headline}</h2>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">{content.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {onBrowseClick && (
              <button
                type="button"
                onClick={onBrowseClick}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg ${t.button}`}
              >
                {browseLabel}
                <FiArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleSellClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
            >
              {sellLabel}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {content.items.slice(0, 8).map((item) => (
            <article
              key={item.id || item.slug || item.title}
              className={`rounded-lg border bg-white/80 p-2.5 ${t.accent} transition-colors flex flex-col`}
            >
              <h3 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2">
                {item.title}
              </h3>
              <p className="text-[11px] text-gray-600 mt-1 leading-snug line-clamp-2 flex-1">
                {item.blurb}
              </p>
              <div className="mt-2 pt-2 border-t border-gray-100 space-y-1.5">
                <p className={`text-sm font-bold ${t.price}`}>{item.price}</p>
                <button
                  type="button"
                  onClick={() => handleBuy(item)}
                  className="w-full inline-flex items-center justify-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Buy & download <FiDownload className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewItem(item)}
                  className="w-full text-[11px] font-semibold text-gray-500 hover:text-gray-800 underline"
                >
                  Preview pages
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {previewItem && (
        <TemplatePagePreviewModal
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onBuy={(it) => {
            handleBuy(it);
            setPreviewItem(null);
          }}
        />
      )}

      {showPostForm && (
        <BusinessTemplatePostForm
          defaultVertical={vertical}
          defaultCategoryKey={categoryKey}
          defaultCategoryName={categoryName}
          onClose={() => setShowPostForm(false)}
          onSuccess={handlePosted}
        />
      )}
    </>
  );
};

export default BrowseCategoryTemplates;
