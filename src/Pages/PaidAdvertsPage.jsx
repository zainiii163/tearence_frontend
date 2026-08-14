import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaRocket, FaImage, FaArrowRight } from 'react-icons/fa';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import CompactPremiumReel from '../Component/shared/CompactPremiumReel';
import { getCategoryTheme } from '../constants/categoryThemes';
import { extractListItems } from '../utils/apiResponseHelpers';
import { pickPremiumForReel } from '../utils/listingPromotionSort';
import { promotedAdvertsAPI } from '../services/promotedAdvertsAPI';
import { getBannerAds } from '../api/banner';

const TABS = [
  {
    id: 'promoted',
    label: 'Promoted Ads',
    description: 'Boost campaigns that push your offer ahead of standard posts.',
    to: '/promoted-adverts',
    postTo: '/promoted-adverts?postForm=true',
    icon: FaRocket,
    accent: 'from-rose-600 to-rose-800',
  },
  {
    id: 'banners',
    label: 'Banner Ads',
    description: 'Site-wide display banners for brand campaigns.',
    to: '/banner-adverts',
    postTo: '/banner-adverts?postForm=true',
    icon: FaImage,
    accent: 'from-slate-600 to-slate-800',
  },
];

const normalize = (item, lane) => {
  if (!item || typeof item !== 'object') return null;
  const id = item.id || item.slug || item.uuid;
  if (!id) return null;
  return {
    ...item,
    id,
    _lane: lane,
    title: item.title || item.name || item.headline || 'Paid advert',
    slug: item.slug || item.id,
  };
};

/**
 * Paid Adverts hub — Promoted + Banner grouped (Clive: paid adverts on their page).
 */
const PaidAdvertsPage = () => {
  const theme = getCategoryTheme('promoted') || getCategoryTheme('adverts');
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = String(searchParams.get('tab') || 'promoted').toLowerCase();
  const activeTab = raw === 'banners' || raw === 'banner' ? 'banners' : 'promoted';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [promotedRes, bannerRes] = await Promise.all([
          promotedAdvertsAPI.getAdverts({ per_page: 12 }).catch(() => null),
          getBannerAds({ per_page: 12 }).catch(() => null),
        ]);

        const promoted = extractListItems(promotedRes)
          .map((item) => normalize(item, 'promoted'))
          .filter(Boolean);
        const banners = extractListItems(bannerRes)
          .map((item) => normalize(item, 'banners'))
          .filter(Boolean);

        const merged =
          activeTab === 'banners'
            ? [...banners, ...promoted]
            : [...promoted, ...banners];

        if (!cancelled) setPosts(merged.slice(0, 12));
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const reelItems = useMemo(
    () => pickPremiumForReel(posts, { limit: 12, allowFallback: true }),
    [posts]
  );

  const setTab = (id) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', id);
    setSearchParams(next, { replace: true });
  };

  const hrefForPost = (item) => {
    if (item._lane === 'banners') return '/banner-adverts';
    const slug = item.slug || item.id;
    return `/promoted-adverts/${slug}`;
  };

  return (
    <CategoryPageShell
      categoryId="adverts"
      backHref="/adverts"
      showBackBar
      backBarTo="/adverts"
      backBarLabel="All advertising"
      hero={
        <div className="relative overflow-hidden border-b border-slate-200 bg-[#0b1c2c] text-white">
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=60')",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(2,28,48,0.96) 0%, rgba(190,24,93,0.55) 55%, rgba(11,28,44,0.96) 100%)',
            }}
          />
          <div className="relative page-container px-4 py-5 sm:py-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-100/90 mb-1">
              Paid Adverts
            </p>
            <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
              Promoted ads & banners
            </h1>
            <p className="mt-1 text-sm text-rose-50/90 max-w-xl">
              One paid hub for boost campaigns and banner inventory — open either product below.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const selected = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTab(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border transition ${
                      selected
                        ? 'bg-white text-rose-800 border-white shadow-sm'
                        : 'bg-white/10 text-white border-white/25 hover:bg-white/15'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const selected = tab.id === activeTab;
          return (
            <div
              key={tab.id}
              className={`rounded-xl border bg-white p-5 shadow-soft ${
                selected ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
              }`}
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${tab.accent} text-white`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{tab.label}</h2>
              <p className="mt-1 text-sm text-slate-500">{tab.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={tab.to}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90"
                >
                  Browse
                  <FaArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  to={tab.postTo}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  + Post
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <section>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : reelItems.length > 0 ? (
          <CompactPremiumReel
            items={reelItems}
            title={activeTab === 'banners' ? 'Banner & promoted highlights' : 'Promoted & banner highlights'}
            getHref={hrefForPost}
            accentClass={theme.accentText || 'text-primary'}
            borderAccent="hover:border-rose-300"
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">No paid adverts yet</p>
            <p className="mt-1 text-xs text-slate-500 mb-3">
              Post a promoted ad or buy a banner to appear here.
            </p>
            <Link
              to={activeTab === 'banners' ? '/banner-adverts?postForm=true' : '/promoted-adverts?postForm=true'}
              className="inline-flex rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white"
            >
              Create paid advert
            </Link>
          </div>
        )}
      </section>
    </CategoryPageShell>
  );
};

export default PaidAdvertsPage;
