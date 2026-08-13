import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCheck,
  FaCopy,
  FaExternalLinkAlt,
  FaLock,
  FaShieldAlt,
  FaStar,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import AffiliateCreativesLibrary from '../Component/affiliates/AffiliateCreativesLibrary';
import affiliateService from '../services/AffiliateService';
import { extractListItems } from '../utils/apiResponseHelpers';
import { getStorageAssetUrl } from '../utils/jobsHelpers';
import {
  enrichMarketplaceStats,
  resolveCreatives,
} from '../utils/affiliateMarketplaceStats';
import { cacheBusinessOffers } from '../utils/affiliateOfferCache';

const AffiliateOfferDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [application, setApplication] = useState(null);
  const [copied, setCopied] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    let cancelled = false;
    const preview = location.state?.offerPreview;
    const previewId = preview
      ? String(preview.id || '').replace(/^business-/, '')
      : null;
    const hasPreview = Boolean(preview && previewId === String(id));

    if (hasPreview) {
      const normalized = enrichMarketplaceStats({
        ...preview,
        id: Number(previewId) || preview.id,
      });
      cacheBusinessOffers([normalized]);
      setOffer(normalized);
      setLoading(false);
    } else {
      setOffer(null);
      setLoading(true);
    }
    setError('');

    (async () => {
      try {
        const raw = await affiliateService.getBusinessOffer(id);
        const data = raw?.data || raw;
        if (!data?.id && !data?.product_service_title && !data?.title) {
          throw new Error('Offer not found');
        }
        if (!cancelled) {
          const enriched = enrichMarketplaceStats(data || {});
          setOffer(enriched);
          setError('');
          affiliateService.trackClick('business', id).catch(() => {});
        }
      } catch (e) {
        if (!cancelled && !hasPreview) {
          setError(e?.message || 'Offer not found');
          setOffer(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isLoggedIn || !id) return;
    let cancelled = false;
    (async () => {
      try {
        const apps = await affiliateService.getMyApplications({ per_page: 100 });
        const list = extractListItems(apps);
        const match = list.find((a) => {
          const offer = a.business_affiliate_offer || a.businessAffiliateOffer || a.offer || {};
          return (
            String(a.offer_id || a.business_offer_id || a.affiliate_offer_id) === String(id) ||
            String(offer.id) === String(id)
          );
        });
        if (!cancelled) setApplication(match || null);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isLoggedIn]);

  const stats = offer?.marketplace_stats || {};
  const heroImage = useMemo(() => {
    if (!offer) return null;
    const creatives = resolveCreatives(offer);
    const first = creatives[0]?.url || offer.image_url || offer.logo_url || offer.banner_url;
    return first ? getStorageAssetUrl(first) || first : null;
  }, [offer]);

  const hopLink =
    application?.hop_url ||
    application?.tracking_url ||
    application?.hop_link ||
    application?.promoter_link ||
    application?.affiliate_link ||
    (application?.tracking_code
      ? `https://api.worldwideadverts.info/go/aff/${application.tracking_code}`
      : null);

  const status = (application?.status || '').toLowerCase();
  const isApproved = status === 'approved' || status === 'active';
  const isPending = status === 'pending' || status === 'submitted';

  const commissionLabel =
    stats.commission_label ||
    (offer?.commission_type === 'fixed'
      ? `$${Number(offer?.commission_rate || 0).toFixed(2)}`
      : `${offer?.commission_rate || 0}%`);

  const handleApply = async () => {
    if (!isLoggedIn) {
      toast.error('Sign in to promote this offer');
      navigate('/login', { state: { from: `/affiliates/offer/${id}` } });
      return;
    }
    setApplying(true);
    try {
      const res = await affiliateService.applyToPromote(id, {});
      const data = res?.data || res;
      setApplication(data?.application || data);
      toast.success(res?.message || data?.message || 'You are now promoting this offer');
    } catch (e) {
      toast.error(e?.message || 'Could not join this offer');
    } finally {
      setApplying(false);
    }
  };

  const copyHop = async () => {
    if (!hopLink) return;
    try {
      await navigator.clipboard.writeText(hopLink);
      setCopied(true);
      toast.success('Hop link copied');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Could not copy');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button
          type="button"
          onClick={() => navigate('/affiliates')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary mb-5"
        >
          <FaArrowLeft className="h-3.5 w-3.5" />
          Back to marketplace
        </button>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-soft">
            Loading offer…
          </div>
        ) : error || !offer ? (
          <div className="rounded-2xl border border-rose-100 bg-white p-10 text-center shadow-soft">
            <p className="text-rose-700 font-medium">{error || 'Offer not found'}</p>
            <Link to="/affiliates" className="mt-4 inline-block text-sm text-primary font-semibold">
              Browse programs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main */}
            <div className="lg:col-span-8 space-y-5">
              <section className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-soft">
                <div className="relative aspect-[21/9] bg-gradient-to-br from-sky-100 via-white to-teal-50">
                  {heroImage ? (
                    <img
                      src={heroImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.opacity = '0';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-slate-900/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-100 mb-1">
                      {offer.affiliate_category?.name || offer.category || 'Affiliate program'}
                    </p>
                    <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">
                      {offer.product_service_title || offer.title || 'Affiliate offer'}
                    </h1>
                    {offer.tagline ? (
                      <p className="mt-1.5 text-sm text-white/85 max-w-2xl">{offer.tagline}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100 border-t border-slate-100">
                  {[
                    { label: 'Gravity', value: stats.gravity ?? '—' },
                    { label: 'EPC', value: stats.epc != null ? `$${Number(stats.epc).toFixed(2)}` : '—' },
                    { label: 'Commission', value: commissionLabel },
                    {
                      label: 'Cookie',
                      value: stats.cookie_days != null ? `${stats.cookie_days}d` : '30d',
                    },
                  ].map((s) => (
                    <div key={s.label} className="bg-white px-3 py-3.5 text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        {s.label}
                      </p>
                      <p className="mt-0.5 text-lg font-bold text-slate-900 tabular-nums">{s.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-soft">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">About this offer</h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {offer.description ||
                    offer.product_description ||
                    offer.details ||
                    'Promote this product or service with a tracked hop link. You earn when referred visitors convert within the cookie window.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {offer.country ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {offer.country}
                    </span>
                  ) : null}
                  {offer.is_verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                      <FaShieldAlt className="h-3 w-3" /> Verified
                    </span>
                  ) : null}
                  {offer.is_featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                      <FaStar className="h-3 w-3" /> Featured
                    </span>
                  ) : null}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-soft">
                <AffiliateCreativesLibrary
                  offer={offer}
                  hopLink={isApproved ? hopLink : null}
                />
              </section>
            </div>

            {/* Sidebar CTA */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Promote & earn
                  </p>
                  <p className="mt-1 text-2xl font-bold text-primary tabular-nums">{commissionLabel}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {offer.commission_type === 'fixed' ? 'Fixed payout per sale' : 'of sale amount'}
                    {stats.cookie_days != null ? ` · ${stats.cookie_days}-day cookie` : ''}
                  </p>
                </div>

                {!isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/login', { state: { from: `/affiliates/offer/${id}` } })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover"
                  >
                    <FaLock className="h-3.5 w-3.5" />
                    Sign in to get hop link
                  </button>
                ) : isApproved && hopLink ? (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
                      <FaCheck className="h-3 w-3" /> Approved — your hop link
                    </p>
                    <code className="block rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] break-all text-slate-700">
                      {hopLink}
                    </code>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={copyHop}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-white"
                      >
                        {copied ? <FaCheck className="h-3.5 w-3.5" /> : <FaCopy className="h-3.5 w-3.5" />}
                        Copy hop
                      </button>
                      <a
                        href={hopLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-700 hover:bg-slate-50"
                        title="Open hop link"
                      >
                        <FaExternalLinkAlt className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ) : isPending ? (
                  <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-3 text-sm text-amber-900">
                    Application pending seller review. Check back soon for your hop link.
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={applying}
                    onClick={handleApply}
                    className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                  >
                    {applying ? 'Joining…' : 'Get hop link'}
                  </button>
                )}

                <Link
                  to="/dashboard?tab=affiliates&sub=promoting"
                  className="block text-center text-xs font-semibold text-primary hover:underline"
                >
                  Open affiliate dashboard →
                </Link>

                <ul className="text-[11px] text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
                  <li>Share your hop link on ads, social, email, or your site.</li>
                  <li>Conversions are attributed within the cookie window.</li>
                  <li>Earnings appear under Dashboard → Affiliates → Promoting / Earnings.</li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateOfferDetailPage;
