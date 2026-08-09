import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCode,
  FiDownload,
  FiExternalLink,
  FiLock,
  FiShoppingBag,
  FiStar,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import SoftwarePurchaseModal from '../Component/software/SoftwarePurchaseModal';
import businessTemplatesAPI from '../api/businessTemplatesAPI';
import { resolveStorageUrl } from '../utils/dashboardEditMappers';
import {
  SOFTWARE_CATEGORIES,
  findSoftwareByIdOrSlug,
  hasPurchasedSoftware,
  triggerSoftwareFileDownload,
} from '../data/softwareMarketplace';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

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
  description: tpl.description || tpl.blurb || '',
  slug: tpl.slug,
  raw: tpl,
});

const SoftwareDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ownedTick, setOwnedTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');

      const local = findSoftwareByIdOrSlug(id);
      if (local) {
        if (!cancelled) {
          setItem(local);
          setLoading(false);
        }
        return;
      }

      // API listing: /software/tpl-123 or /software/{slug}
      try {
        const rawId = String(id || '').replace(/^tpl-/, '');
        let tpl = null;
        try {
          const bySlug = await businessTemplatesAPI.getBySlug(rawId);
          tpl = bySlug?.data || bySlug;
        } catch {
          /* try list match */
        }
        if (!tpl?.title) {
          const list = await businessTemplatesAPI.list({ per_page: 100 });
          const rows = Array.isArray(list?.data?.data)
            ? list.data.data
            : Array.isArray(list?.data)
              ? list.data
              : [];
          tpl =
            rows.find(
              (t) =>
                String(t.id) === String(rawId) ||
                String(t.slug) === String(id) ||
                `tpl-${t.id}` === String(id)
            ) || null;
        }
        if (!cancelled) {
          if (tpl?.title) {
            setItem(mapTemplateToItem(tpl));
          } else {
            setError('Product not found');
          }
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load product');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const categoryName = useMemo(
    () => SOFTWARE_CATEGORIES.find((c) => c.slug === item?.category)?.name || item?.category,
    [item]
  );

  const owned = item && !item.isApiListing && hasPurchasedSoftware(item.id);
  void ownedTick;

  const handleBuyOrDownload = () => {
    if (!item) return;
    if (!requireAuth(`/software/${item.id}`, 'Log in to purchase or download.')) return;

    const price = Number(item.price);
    if (!Number.isFinite(price) || price < 10) {
      toast.error('Paid purchase required (minimum $10).');
      return;
    }
    if (owned) {
      triggerSoftwareFileDownload(item);
      return;
    }
    setCheckoutOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/software" />
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/software" />
        <div className="page-container py-16 text-center">
          <p className="text-lg text-red-600 mb-4">{error || 'Product not found'}</p>
          <button
            type="button"
            onClick={() => navigate('/software')}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Back to Software & Code
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton backHref="/software" />

      <div className="page-container py-6 sm:py-8 max-w-5xl">
        <button
          type="button"
          onClick={() => navigate('/software')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Software & Code
        </button>

        <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[240px] bg-slate-900">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full min-h-[260px] max-h-[420px] object-cover"
              />
              {item.tag && (
                <span className="absolute top-3 left-3 rounded bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1">
                  {item.tag}
                </span>
              )}
            </div>

            <div className="p-6 sm:p-8 flex flex-col">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700 mb-2">
                {categoryName || 'Software'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {item.title}
              </h1>
              <p className="mt-2 text-sm text-gray-500">by {item.author}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                  <FiStar className="fill-current" />
                  {item.rating}
                </span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-600">
                  {(item.sales || 0).toLocaleString()} sales
                </span>
                <span className="inline-flex items-center gap-1 ml-auto text-xl font-bold text-blue-700">
                  <FiShoppingBag />${item.price}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.framework && (
                  <span className="rounded-full bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1">
                    {item.framework}
                  </span>
                )}
                {item.language && (
                  <span className="rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1">
                    {item.language}
                  </span>
                )}
              </div>

              {item.description && (
                <p className="mt-5 text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              )}

              <div className="mt-auto pt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleBuyOrDownload}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700"
                >
                  {owned ? (
                    <>
                      <FiDownload /> Download now
                    </>
                  ) : (
                    <>
                      <FiLock /> Buy for ${item.price}
                    </>
                  )}
                </button>
                {item.previewUrl && (
                  <a
                    href={item.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    <FiExternalLink /> Preview
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiCode className="text-blue-600" />
                What’s included
              </h2>
              <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li>Instant digital download after payment</li>
                <li>Works offline in modern browsers (where applicable)</li>
                <li>Ready for commercial use on your projects</li>
                <li>Support via the Worldwide Adverts marketplace</li>
              </ul>
            </section>
            <section className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">Ready to use it?</p>
              <p className="text-sm text-gray-600 mb-4">
                Purchase unlocks the file. After PayPal confirms, download starts automatically.
              </p>
              <Link
                to="/software"
                className="text-sm font-semibold text-blue-700 hover:underline"
              >
                Browse more software →
              </Link>
            </section>
          </div>
        </article>
      </div>

      {checkoutOpen && (
        <SoftwarePurchaseModal
          item={item}
          onClose={() => setCheckoutOpen(false)}
          onPurchased={() => setOwnedTick((n) => n + 1)}
        />
      )}

      <Footer />
    </div>
  );
};

export default SoftwareDetailPage;
