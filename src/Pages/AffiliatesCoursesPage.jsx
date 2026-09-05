import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaGraduationCap, FaBookOpen, FaExternalLinkAlt, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import AffiliateHubNav from '../Component/affiliates/AffiliateHubNav';
import AffiliateFlowStrip from '../Component/affiliates/AffiliateFlowStrip';
import BooksPostForm from '../Component/books/BooksPostForm';
import affiliateService from '../services/AffiliateService';
import BooksAPI from '../services/booksAPI';
import { extractListItems } from '../utils/apiResponseHelpers';
import { cacheBusinessOffers } from '../utils/affiliateOfferCache';
import { formatBookPrice, getBookCoverUrl } from '../utils/bookFormHelpers';
import useAuthRedirect from '../hooks/useAuthRedirect';

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

const KIND_LABEL = {
  course: 'Course',
  guide: 'Book guide',
  manual: 'Manual',
};

/**
 * Courses hub — user-submitted courses / guides / manuals for sale or free,
 * plus affiliate marketplace education offers and starter guides.
 */
const AffiliatesCoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courseOffers, setCourseOffers] = useState([]);
  const [publications, setPublications] = useState([]);
  const [error, setError] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postKind, setPostKind] = useState('course');

  const openSubmit = (kind = 'course') => {
    if (!requireAuth()) return;
    setPostKind(kind);
    setShowPostForm(true);
    const next = new URLSearchParams(searchParams);
    next.set('postForm', 'true');
    next.set('kind', kind);
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      setPostKind(searchParams.get('kind') || 'course');
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [catRes, coursesRes, booksRes] = await Promise.allSettled([
          affiliateService.getCategories(),
          affiliateService.getCourses({ per_page: 48 }),
          BooksAPI.getBooks({
            courses_only: 1,
            per_page: 48,
            sort_by: 'created_at',
            sort_order: 'desc',
          }),
        ]);

        let offers = [];
        if (coursesRes.status === 'fulfilled') {
          offers = extractListItems(coursesRes.value);
        }
        if ((!offers || offers.length === 0) && catRes.status === 'fulfilled') {
          const cats = extractListItems(catRes.value).filter(isEducationCategory);
          const nested = await Promise.all(
            cats.slice(0, 6).map(async (cat) => {
              try {
                const res = await affiliateService.getBusinessOffers({
                  category_id: cat.id,
                  per_page: 12,
                });
                return extractListItems(res);
              } catch {
                return [];
              }
            })
          );
          offers = nested.flat();
        }
        if (!cancelled) {
          setCourseOffers(Array.isArray(offers) ? offers : []);
          cacheBusinessOffers(offers);
          setPublications(extractListItems(booksRes.status === 'fulfilled' ? booksRes.value : []));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Could not load courses');
          toast.error('Could not load courses');
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

  const visibleGuides = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return STARTER_GUIDES;
    return STARTER_GUIDES.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.level.toLowerCase().includes(q)
    );
  }, [search]);

  const visiblePublications = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return publications;
    return publications.filter((b) => {
      const hay = [b.title, b.author_name, b.short_description, b.description, b.content_kind]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [publications, search]);

  const visibleOffers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courseOffers;
    return courseOffers.filter((offer) => {
      const hay = [
        offer.product_service_title,
        offer.title,
        offer.business_name,
        offer.tagline,
        offer.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [courseOffers, search]);

  if (showPostForm) {
    return (
      <BooksPostForm
        initialContentKind={postKind}
        onClose={() => {
          setShowPostForm(false);
          const next = new URLSearchParams(searchParams);
          next.delete('postForm');
          next.delete('kind');
          setSearchParams(next, { replace: true });
        }}
      />
    );
  }

  return (
    <CategoryPageShell
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
              Courses, guides & manuals
            </h1>
            <p className="mt-2 text-center text-sm text-white/80 max-w-xl mx-auto">
              Sell or give away your courses, book guides, and manuals. Submissions are reviewed before going live.
            </p>

            <form className="mt-4 flex justify-center" onSubmit={(e) => e.preventDefault()}>
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

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => openSubmit('course')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-100"
              >
                <FaPlus className="h-3 w-3" /> Submit course
              </button>
              <button
                type="button"
                onClick={() => openSubmit('guide')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/40 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                Submit book guide
              </button>
              <button
                type="button"
                onClick={() => openSubmit('manual')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/40 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
              >
                Submit manual
              </button>
            </div>

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
        <div className="flex flex-wrap items-end justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Courses & manuals for sale</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              User-submitted courses, book guides, and manuals (free or paid)
            </p>
          </div>
          <Link to="/dashboard?tab=books" className="text-xs font-semibold text-primary hover:underline">
            Manage my publications →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-r-transparent" />
          </div>
        ) : visiblePublications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
            <FaGraduationCap className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-800 mb-1">No courses listed yet</p>
            <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
              Be the first to submit a course, book guide, or manual for sale or free.
            </p>
            <button
              type="button"
              onClick={() => openSubmit('course')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800"
            >
              <FaPlus /> Submit yours
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePublications.map((book) => {
              const cover = getBookCoverUrl(book);
              const kind = KIND_LABEL[book.content_kind] || 'Course';
              return (
                <article
                  key={book.id}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="aspect-[3/4] bg-slate-100">
                    {cover ? (
                      <img src={cover} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-300">
                        <FaBookOpen className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-primary">{kind}</span>
                      <span className="text-xs font-semibold text-slate-700">{formatBookPrice(book)}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-0.5 line-clamp-2">{book.title}</h3>
                    <p className="text-xs text-slate-500 mb-2">{book.author_name}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 flex-1 mb-3">
                      {book.short_description || book.description}
                    </p>
                    <Link
                      to={`/books/${book.slug || book.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      View <FaExternalLinkAlt className="h-2.5 w-2.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

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
            <h2 className="text-base font-semibold text-slate-900">Affiliate education offers</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Marketplace programs affiliates can promote
            </p>
          </div>
          <Link to="/affiliates/marketplace" className="text-xs font-semibold text-primary hover:underline">
            All marketplace offers →
          </Link>
        </div>

        {loading ? null : visibleOffers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-xs text-slate-500">
            No affiliate course offers listed yet.
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
