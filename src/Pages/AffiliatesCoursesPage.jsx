import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBookOpen, FaExternalLinkAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import AffiliateHubNav from '../Component/affiliates/AffiliateHubNav';
import AffiliateFlowStrip from '../Component/affiliates/AffiliateFlowStrip';
import affiliateService from '../services/AffiliateService';
import { extractListItems } from '../utils/apiResponseHelpers';
import { cacheBusinessOffers } from '../utils/affiliateOfferCache';

const STARTER_GUIDES = [
  {
    id: 'guide-start',
    title: 'How affiliate shopping works',
    level: 'Beginner',
    priceLabel: 'Free intro',
    description:
      'Brands list products and optional deals. You join a Marketplace offer, get a hop link, tag/promote it, and earn if a viewer buys within the cookie window.',
    cta: 'Open Marketplace',
    to: '/affiliates/marketplace',
  },
  {
    id: 'guide-promote',
    title: 'Tag products, sales, and drops',
    level: 'Beginner',
    priceLabel: 'Guide',
    description:
      'Promote like a shopping affiliate: share hop links for on-sale items, price drops, discount codes, or “dropping soon” products — including before a drop goes live.',
    cta: 'Browse Affiliate Ads',
    to: '/affiliates',
  },
  {
    id: 'guide-business',
    title: 'List a product with a deal or drop',
    level: 'Business',
    priceLabel: 'Seller guide',
    description:
      'Create a Marketplace offer, set commission and cookie window, then add a sale price, compare-at price, discount code, or scheduled product drop for affiliates to tag.',
    cta: 'Go to Marketplace',
    to: '/affiliates/marketplace?postForm=true&mode=business',
  },
];

const isEducationCategory = (cat) => {
  const name = String(cat?.name || cat?.title || '').toLowerCase();
  const slug = String(cat?.slug || '').toLowerCase();
  return (
    name.includes('course') ||
    name.includes('education') ||
    name.includes('guide') ||
    name.includes('training') ||
    slug.includes('course') ||
    slug.includes('education')
  );
};

/**
 * Affiliate Courses — guides for sale / education offers to help readers get started.
 * Pulls live Marketplace offers in Education/Courses categories when available.
 */
const AffiliatesCoursesPage = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courseOffers, setCourseOffers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [catRes, coursesRes] = await Promise.allSettled([
          affiliateService.getCategories(),
          affiliateService.getCourses({ per_page: 48 }),
        ]);

        let offers = [];
        if (coursesRes.status === 'fulfilled') {
          offers = extractListItems(coursesRes.value);
          cacheBusinessOffers(offers);
        } else {
          // Fallback for older API without /courses
          const offersRes = await affiliateService.getBusinessOffers({
            marketplace: 1,
            per_page: 48,
            sort: 'gravity',
            order: 'desc',
          });
          const all = extractListItems(offersRes);
          cacheBusinessOffers(all);
          const categories =
            catRes.status === 'fulfilled'
              ? extractListItems(catRes.value) || catRes.value?.data || []
              : [];
          const educationIds = new Set(
            (Array.isArray(categories) ? categories : [])
              .filter(isEducationCategory)
              .map((c) => String(c.id))
          );
          offers = (all || []).filter((o) => {
            const catId = String(o.affiliate_category_id || o.affiliate_category?.id || '');
            const catName = String(o.affiliate_category?.name || o.category || '');
            if (educationIds.size && educationIds.has(catId)) return true;
            return isEducationCategory({ name: catName });
          });
        }

        if (!cancelled) setCourseOffers(offers);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError('Could not load course offers');
          toast.error('Could not load course offers');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const q = search.trim().toLowerCase();
  const visibleOffers = useMemo(() => {
    if (!q) return courseOffers;
    return courseOffers.filter((o) => {
      const hay = `${o.product_service_title || ''} ${o.business_name || ''} ${o.tagline || ''} ${o.description || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [courseOffers, q]);

  const visibleGuides = useMemo(() => {
    if (!q) return STARTER_GUIDES;
    return STARTER_GUIDES.filter((g) =>
      `${g.title} ${g.description} ${g.level}`.toLowerCase().includes(q)
    );
  }, [q]);

  return (
    <CategoryPageShell
      categoryId="affiliate"
      backHref="/affiliates"
      showBackBar
      backBarTo="/affiliates"
      backBarLabel="Affiliate Ads"
      hero={
        <section className="relative overflow-hidden border-b border-slate-200 bg-[#0b1c2c] text-white">
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=60')",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(2,28,48,0.96) 0%, rgba(3,106,161,0.78) 55%, rgba(11,28,44,0.96) 100%)',
            }}
          />
          <div className="relative page-container px-4 py-5 sm:py-6">
            <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-center">
              Affiliate Courses
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-200/90 text-center max-w-xl mx-auto">
              Guides that teach how to tag brand products, promote deals and drops, and earn commission.
            </p>

            <form
              className="mt-4 flex justify-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex w-full max-w-2xl rounded-lg overflow-hidden border border-white/20 bg-white shadow-sm">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses and guides…"
                  className="flex-1 min-w-0 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary/90 shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-3 flex justify-center">
              <AffiliateHubNav variant="dark" />
            </div>
          </div>
        </section>
      }
      contentClassName="page-container py-4 sm:py-6"
      filterLayoutProps={null}
    >
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <AffiliateFlowStrip />

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <FaBookOpen className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold text-slate-900">Starter guides</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGuides.map((guide) => (
            <article
              key={guide.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                  <FaGraduationCap className="h-3 w-3" />
                  {guide.level}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">{guide.priceLabel}</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">{guide.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed flex-1 mb-3">{guide.description}</p>
              <Link
                to={guide.to}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90"
              >
                {guide.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Education & course offers</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Live Marketplace programs in education / courses niches
            </p>
          </div>
          <Link
            to="/affiliates/marketplace"
            className="text-xs font-semibold text-primary hover:underline"
          >
            All marketplace offers →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-r-transparent" />
          </div>
        ) : visibleOffers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
            <FaGraduationCap className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-800 mb-1">No course offers listed yet</p>
            <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
              When businesses list education or training programs on Marketplace, they appear here. Use the starter guides above meanwhile.
            </p>
            <Link
              to="/affiliates/marketplace"
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleOffers.map((offer) => (
              <article
                key={offer.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col"
              >
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">
                  {offer.affiliate_category?.name || 'Education'}
                </p>
                <h3 className="text-sm font-semibold text-slate-900 mb-0.5">
                  {offer.product_service_title || offer.title}
                </h3>
                <p className="text-xs text-slate-500 mb-2">{offer.business_name}</p>
                <p className="text-xs text-slate-600 line-clamp-3 flex-1 mb-3">
                  {offer.tagline || offer.description || 'Affiliate education offer'}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-emerald-700">
                    {offer.commission_rate}
                    {offer.commission_type === 'percentage' || !offer.commission_type ? '%' : ''} commission
                  </span>
                  <Link
                    to={`/affiliates/offer/${offer.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    View <FaExternalLinkAlt className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </CategoryPageShell>
  );
};

export default AffiliatesCoursesPage;
