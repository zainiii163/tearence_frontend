import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Download, Play, ShoppingCart, Check } from 'lucide-react';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import BrowseBottomPostCta from '../shared/BrowseBottomPostCta';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import {
  VIDEO_TEMPLATE_CATEGORIES,
  VIDEO_TEMPLATE_PRODUCTS,
  isVideoPurchased,
  markVideoPurchased,
} from '../../data/videoMarketplace';

const HERO_BG =
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80';

/**
 * Clive: short videos as adverts + template videos users can purchase.
 */
const VideoTemplatesBrowsePage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [previewId, setPreviewId] = useState(null);
  const [purchasedTick, setPurchasedTick] = useState(0);

  const items = useMemo(() => {
    let list = VIDEO_TEMPLATE_PRODUCTS;
    if (category !== 'all') list = list.filter((v) => v.category === category);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((v) =>
        `${v.title} ${v.description} ${v.category}`.toLowerCase().includes(q)
      );
    }
    return list;
  }, [category, search, purchasedTick]);

  const handleBuy = (item) => {
    // Demo checkout — same pattern as software marketplace
    const ok = window.confirm(
      `Purchase "${item.title}" for $${item.price}?\n\n(Demo checkout — unlocks download on this device.)`
    );
    if (!ok) return;
    markVideoPurchased(item.id);
    setPurchasedTick((n) => n + 1);
    alert('Purchase successful. You can now download this video template.');
  };

  const handleDownload = (item) => {
    if (!isVideoPurchased(item.id)) {
      handleBuy(item);
      return;
    }
    const a = document.createElement('a');
    a.href = item.videoUrl;
    a.download = `${item.id}.mp4`;
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePostVideoAdvert = () => {
    if (
      requireAuth(
        '/post-images?media=video',
        'You must be logged in to post a short video advert.'
      )
    ) {
      navigate('/post-images?media=video');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UnifiedNavbar showBackButton backHref="/images" />

      <BrowseMarketplaceHero
        title="Video Templates & Short Adverts"
        eyebrow="Images & Media"
        subtitle="Preview free. Purchase template videos, or post your own short video adverts."
        imageUrl={HERO_BG}
        theme="violet"
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        onSearchSubmit={() => {}}
        searchPlaceholder="Search video templates…"
        heroChips={[
          { to: '/images', label: 'Stock Images' },
          { to: '/images/videos', label: 'Video Templates' },
        ]}
      />

      <div className="page-container py-5 sm:py-7 flex-1">
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${
              category === 'all'
                ? 'bg-violet-700 text-white border-violet-700'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            All
          </button>
          {VIDEO_TEMPLATE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${
                category === c.id
                  ? 'bg-violet-700 text-white border-violet-700'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => {
            const owned = isVideoPurchased(item.id);
            const isPreview = previewId === item.id;
            return (
              <article
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="relative aspect-video bg-black">
                  {isPreview ? (
                    <video
                      src={item.videoUrl}
                      poster={item.poster}
                      controls
                      autoPlay
                      className="h-full w-full object-cover"
                      onEnded={() => setPreviewId(null)}
                    />
                  ) : (
                    <button
                      type="button"
                      className="absolute inset-0 w-full h-full"
                      onClick={() => setPreviewId(item.id)}
                    >
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="h-full w-full object-cover opacity-90"
                      />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="rounded-full bg-white/90 p-3 shadow">
                          <Play className="h-5 w-5 text-violet-700" />
                        </span>
                      </span>
                      {item.duration && (
                        <span className="absolute bottom-2 right-2 rounded bg-black/70 text-white text-[10px] px-1.5 py-0.5">
                          {item.duration}
                        </span>
                      )}
                    </button>
                  )}
                </div>
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug">{item.title}</h3>
                    {item.tag && (
                      <span className="shrink-0 rounded-full bg-violet-50 text-violet-700 text-[10px] font-semibold px-2 py-0.5">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.description}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-gray-900">${item.price}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewId(item.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <Film className="h-3.5 w-3.5" />
                        Preview
                      </button>
                      {owned ? (
                        <button
                          type="button"
                          onClick={() => handleDownload(item)}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1.5 text-[11px] font-semibold"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Download
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuy(item)}
                          className="inline-flex items-center gap-1 rounded-md bg-violet-700 hover:bg-violet-800 text-white px-2 py-1.5 text-[11px] font-semibold"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Buy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-violet-100 bg-violet-50/60 p-4 text-sm text-violet-900">
          <p className="font-semibold">For admins</p>
          <p className="mt-1 text-xs sm:text-sm text-violet-800/90">
            Super admins can upload stock images and set Featured / Promoted / Sponsored from the Filament admin
            dashboard under <strong>Marketplace → Stock Images</strong>. Short video files can also be attached there
            (video field). Users purchase templates here, or post their own video adverts via Sell Media.
          </p>
          <Link to="/images" className="inline-block mt-2 text-xs font-semibold text-violet-700 hover:underline">
            ← Back to Stock Images
          </Link>
        </div>

        <BrowseBottomPostCta
          title="Post a short video advert"
          description="Upload short video adverts or sell template videos to buyers worldwide."
          buttonLabel="Start selling"
          onPostClick={handlePostVideoAdvert}
          theme="purple"
        />
      </div>

      <Footer />
    </div>
  );
};

export default VideoTemplatesBrowsePage;
