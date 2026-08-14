import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  FiTool,
  FiVolume2,
  FiBarChart2,
  FiMail,
  FiShare2,
  FiTarget,
  FiArrowRight,
  FiShoppingCart,
} from 'react-icons/fi';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import businessToolsService from '../services/BusinessToolsService';

const ICON_MAP = {
  volume: FiVolume2,
  share: FiShare2,
  mail: FiMail,
  target: FiTarget,
  chart: FiBarChart2,
  tool: FiTool,
};

const FALLBACK_TOOLS = [
  {
    id: 'ad-campaign-kit',
    slug: 'ad-campaign-kit',
    title: 'Ad campaign kit',
    blurb: 'Brief, creative checklist, budget sheet and KPI tracker for sponsored / featured / promoted ads.',
    display_price: 'From $29',
    price: 29,
    icon: 'volume',
    tag: 'Advertising',
    file_url: '/business/templates',
  },
  {
    id: 'social-content-calendar',
    slug: 'social-content-calendar',
    title: 'Social content calendar',
    blurb: '30-day planner for posts, Reels and affiliate hops — fillable month grid.',
    display_price: 'From $19',
    price: 19,
    icon: 'share',
    tag: 'Marketing',
    file_url: '/templates/monthly-calendar-planner.html',
  },
  {
    id: 'email-promo-pack',
    slug: 'email-promo-pack',
    title: 'Email promo pack',
    blurb: 'Launch, nurture and win-back email outlines for WWA listings and offers.',
    display_price: 'From $22',
    price: 22,
    icon: 'mail',
    tag: 'Marketing',
    file_url: '/business/templates',
  },
  {
    id: 'affiliate-creative-pack',
    slug: 'affiliate-creative-pack',
    title: 'Affiliate creative pack',
    blurb: 'Hooks, CTAs and creative prompts influencers can use when promoting your offer.',
    display_price: 'From $24',
    price: 24,
    icon: 'target',
    tag: 'Affiliates',
    file_url: '/affiliates/marketplace?postForm=true&mode=business',
  },
  {
    id: 'seo-listing-booster',
    slug: 'seo-listing-booster',
    title: 'SEO listing booster',
    blurb: 'Title formulas, keyword checklist and schema tips for marketplace listings.',
    display_price: 'From $18',
    price: 18,
    icon: 'chart',
    tag: 'Growth',
    file_url: '/business/templates',
  },
  {
    id: 'commercial-agreement-tool',
    slug: 'commercial-agreement-tool',
    title: 'Commercial agreement (dispute-ready)',
    blurb: 'B2B contract with dispute / ADR clauses — fillable HTML.',
    display_price: 'From $24',
    price: 24,
    icon: 'tool',
    tag: 'Legal',
    file_url: '/templates/commercial-agreement.html',
  },
];

/**
 * Business tools for sale — marketing & advertising beyond templates.
 */
const BusinessToolsPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [tools, setTools] = useState(FALLBACK_TOOLS);
  const [loading, setLoading] = useState(true);
  const [buyingSlug, setBuyingSlug] = useState(null);
  const [ownedSlugs, setOwnedSlugs] = useState(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await businessToolsService.list({
          category_slug: category || undefined,
          per_page: 50,
        });
        const rows = res?.data?.data || res?.data || [];
        if (!cancelled && Array.isArray(rows) && rows.length) {
          setTools(rows);
        }
      } catch {
        /* keep fallback */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await businessToolsService.myPurchases();
        const rows = res?.data || [];
        if (cancelled || !Array.isArray(rows)) return;
        const owned = new Set(
          rows
            .filter((p) => p.status === 'paid')
            .map((p) => p.tool?.slug || p.tool_slug)
            .filter(Boolean)
        );
        setOwnedSlugs(owned);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const heading = useMemo(() => {
    if (!category) return 'Business tools';
    return `Business tools · ${category}`;
  }, [category]);

  const handleBuy = async (tool) => {
    if (!isAuthenticated) {
      toast.error('Sign in with a business account to purchase tools.');
      window.location.href = '/Login?type=business';
      return;
    }
    const slug = tool.slug || tool.id;
    setBuyingSlug(slug);
    try {
      const created = await businessToolsService.purchase({
        slug,
        tool_id: tool.id && typeof tool.id === 'number' ? tool.id : undefined,
        payment_method: 'manual',
      });
      const purchase = created?.data;
      if (created?.needs_payment && purchase?.id) {
        await businessToolsService.confirmPayment(purchase.id, {
          payment_method: 'manual',
          payment_reference: `manual-${Date.now()}`,
        });
      }
      toast.success('Tool unlocked — opening pack…');
      setOwnedSlugs((prev) => new Set([...prev, slug]));
      const openUrl = tool.file_url || tool.preview_url || '/business/templates';
      if (String(openUrl).startsWith('http') || String(openUrl).startsWith('/templates')) {
        window.open(openUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = openUrl;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Purchase failed');
    } finally {
      setBuyingSlug(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <UnifiedNavbar />
      <main className="flex-1">
        <section className="border-b border-slate-200 bg-gradient-to-r from-emerald-800 to-teal-700 text-white">
          <div className="page-container py-12 sm:py-14 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200 mb-2">
              World Wide Adverts
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{heading}</h1>
            <p className="mt-3 text-emerald-50/95 text-base max-w-xl">
              Marketing and advertising tools for businesses — alongside fillable templates.
              Buy packs here and use them from your category dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/dashboard?tab=overview&mode=selling"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-50"
              >
                Open business dashboards
                <FiArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/business/templates"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Templates shop
              </Link>
            </div>
          </div>
        </section>

        <section className="page-container py-10">
          {loading && <p className="text-sm text-slate-500 mb-4">Loading tools…</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => {
              const Icon = ICON_MAP[tool.icon] || FiTool;
              const slug = tool.slug || tool.id;
              const owned = ownedSlugs.has(slug);
              const priceLabel = tool.display_price || tool.price_label || `From $${tool.price ?? '—'}`;
              return (
                <article
                  key={slug}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                    {tool.tag || 'Tool'}
                  </span>
                  <div className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-3 text-base font-bold text-slate-900">{tool.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 flex-1">{tool.blurb}</p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">{priceLabel}</span>
                    <button
                      type="button"
                      disabled={buyingSlug === slug}
                      onClick={() => handleBuy(tool)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-800 hover:underline disabled:opacity-50"
                    >
                      <FiShoppingCart className="h-3.5 w-3.5" />
                      {owned ? 'Open again' : buyingSlug === slug ? 'Buying…' : 'Buy'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-2xl border border-violet-200 bg-violet-50 p-6">
            <h2 className="text-lg font-bold text-violet-950">Promote with Affiliates</h2>
            <p className="mt-1 text-sm text-violet-900/80 max-w-2xl">
              Post products and services you want promoted. Influencers apply with socials; you approve
              them from your dashboard and they get a hop link.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/affiliates/marketplace?postForm=true&mode=business"
                className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800"
              >
                Post to Affiliates
              </Link>
              <Link
                to="/dashboard?tab=affiliates"
                className="rounded-lg border border-violet-300 px-4 py-2 text-sm font-semibold text-violet-900 hover:bg-white"
              >
                Approve influencers
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessToolsPage;
