import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Download, Play, ShoppingCart, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import BrowseBottomPostCta from '../shared/BrowseBottomPostCta';
import AuthenticCheckoutModal from '../Payment/AuthenticCheckoutModal';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import imagesAPI from '../../services/imagesAPI';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';
import { VIDEO_TEMPLATE_CATEGORIES, isVideoPurchased, markVideoPurchased } from '../../data/videoMarketplace';

const HERO_BG =
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80';

const mapImageToVideoItem = (row) => {
  const id = row.id || row.slug;
  const thumb =
    resolveStorageUrl(row.thumbnail_url || row.main_image_url || row.main_image || row.thumbnail) ||
    null;
  const videoUrl =
    resolveStorageUrl(row.video_url || row.video_path || row.download_url) ||
    row.video_url ||
    row.video_path ||
    '';
  return {
    id,
    slug: row.slug,
    title: row.title,
    description: row.short_description || row.description || '',
    category: row.image_category || row.category || 'video',
    price: Number(row.standard_price ?? row.price ?? 0),
    currency: row.currency || 'USD',
    thumbnail: thumb,
    videoUrl,
    raw: row,
  };
};

/**
 * Video listings from Stock Images API (media_type=video). No hardcoded catalog.
 */
const VideoTemplatesBrowsePage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [previewId, setPreviewId] = useState(null);
  const [purchasedTick, setPurchasedTick] = useState(0);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [apiItems, setApiItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await imagesAPI.getImages({
          per_page: 48,
          media_type: 'video',
          search: search || undefined,
        });
        const rows = res?.data?.data || res?.data || res || [];
        const list = (Array.isArray(rows) ? rows : [])
          .filter((r) => {
            const mt = String(r.media_type || r.type || '').toLowerCase();
            return (
              mt.includes('video') ||
              r.video_url ||
              r.video_path ||
              String(r.image_category || '').toLowerCase().includes('video')
            );
          })
          .map(mapImageToVideoItem);
        // If API has no media_type filter support, show video-like rows or empty — never mock demos
        if (!cancelled) setApiItems(list);
      } catch (e) {
        if (!cancelled) {
          setApiItems([]);
          setError(e?.message || 'Failed to load videos');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search]);

  const items = useMemo(() => {
    let list = [...apiItems];
    if (category !== 'all') list = list.filter((v) => v.category === category);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((v) =>
        `${v.title} ${v.description} ${v.category}`.toLowerCase().includes(q)
      );
    }
    return list;
  }, [apiItems, category, search, purchasedTick]);

  const handleBuy = (item) => {
    if (!requireAuth('/images/videos', 'Sign in to buy video templates.')) return;
    if (item.slug) {
      navigate(`/images/${item.slug}`);
      return;
    }
    setCheckoutItem(item);
  };

  const handlePaymentSuccess = (details) => {
    if (!checkoutItem) return;
    markVideoPurchased(checkoutItem.id, {
      paymentId: details.paymentId || details.id,
      paymentMethod: details?.paymentMethod || 'paypal',
      paidAt: new Date().toISOString(),
    });
    setPurchasedTick((n) => n + 1);
    toast.success('Payment confirmed — download unlocked.');
    setCheckoutItem(null);
  };

  const handleDownload = (item) => {
    if (item.slug) {
      navigate(`/images/${item.slug}`);
      return;
    }
    if (!isVideoPurchased(item.id)) {
      handleBuy(item);
      return;
    }
    if (!item.videoUrl) {
      toast.error('Download not available yet');
      return;
    }
    window.open(item.videoUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePostVideoAdvert = () => {
    if (requireAuth('/post-images?media=video', 'Sign in to post a video advert.')) {
      navigate('/post-images?media=video');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavbar showBackButton backHref="/images" />
      <BrowseMarketplaceHero
        title="Video Templates"
        eyebrow="Stock Images & Media"
        imageUrl={HERO_BG}
        theme="violet"
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        onSearchSubmit={() => setSearch(search.trim())}
        searchPlaceholder="Search video templates…"
      />

      <div className="page-container py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <Link to="/images" className="rounded-lg border px-3 py-1.5 text-sm font-semibold">
            Stock Images
          </Link>
          <span className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white">
            Video Templates
          </span>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`rounded-full px-3 py-1 text-sm ${
              category === 'all' ? 'bg-violet-600 text-white' : 'bg-white border'
            }`}
          >
            All
          </button>
          {VIDEO_TEMPLATE_CATEGORIES.map((c) => (
            <button
              key={c.id || c.slug || c}
              type="button"
              onClick={() => setCategory(c.id || c.slug || c)}
              className={`rounded-full px-3 py-1 text-sm capitalize ${
                category === (c.id || c.slug || c)
                  ? 'bg-violet-600 text-white'
                  : 'bg-white border'
              }`}
            >
              {c.name || c.label || c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
          </div>
        ) : error ? (
          <p className="py-16 text-center text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white py-16 text-center">
            <Film className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="font-semibold text-gray-900">No video listings yet</p>
            <p className="mt-1 text-sm text-gray-500">
              Post a video from Stock Images, or browse still images.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={handlePostVideoAdvert}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Post video
              </button>
              <Link to="/images" className="rounded-lg border px-4 py-2 text-sm font-semibold">
                Browse images
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const owned = isVideoPurchased(item.id);
              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-violet-300">
                        <Film className="h-12 w-12" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setPreviewId(previewId === item.id ? null : item.id)}
                      className="absolute bottom-3 right-3 rounded-full bg-black/70 p-2 text-white"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3 p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-violet-700">
                        {item.currency} {Number(item.price).toFixed(2)}
                      </span>
                      {owned ? (
                        <button
                          type="button"
                          onClick={() => handleDownload(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white"
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuy(item)}
                          className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" /> Buy
                        </button>
                      )}
                    </div>
                    {owned && (
                      <p className="flex items-center gap-1 text-xs text-green-700">
                        <Check className="h-3 w-3" /> Purchased
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <BrowseBottomPostCta
          buttonLabel="Post a video advert"
          onPostClick={handlePostVideoAdvert}
          theme="purple"
        />
      </div>

      {checkoutItem && (
        <AuthenticCheckoutModal
          open
          onClose={() => setCheckoutItem(null)}
          title="Buy video"
          description={checkoutItem.title}
          amount={checkoutItem.price}
          onSuccess={handlePaymentSuccess}
        />
      )}
      <Footer />
    </div>
  );
};

export default VideoTemplatesBrowsePage;
