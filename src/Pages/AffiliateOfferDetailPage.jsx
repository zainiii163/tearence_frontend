import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  DollarSign,
  MapPin,
  Briefcase,
  Send,
  Loader2,
  Copy,
  Check,
  Link2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import affiliateService from '../services/AffiliateService';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { getStorageAssetUrl } from '../utils/jobsHelpers';
import AffiliateJoinModal from '../Component/affiliates/AffiliateJoinModal';

const AffiliateOfferDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [myApplication, setMyApplication] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const loadOffer = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await affiliateService.getBusinessOffer(id);
      const data = res?.data || res;
      if (data?.id || data?.title || data?.product_service_title) {
        setOffer(data);
        setMyApplication(data.my_application || null);
      } else {
        setError('Offer not found');
      }
    } catch (e) {
      setError(e?.message || e?.error || 'Failed to load offer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const imageUrl =
    getStorageAssetUrl(offer?.logo_url || offer?.banner_url || offer?.image_url) ||
    offer?.logo_url ||
    offer?.banner_url ||
    null;

  const title = offer?.product_service_title || offer?.title || offer?.business_name;
  const merchantUrl = offer?.tracking_link || offer?.affiliate_link || offer?.website_url;
  const promoterLink =
    myApplication?.hop_url ||
    myApplication?.promoter_link ||
    (myApplication?.tracking_code
      ? `https://api.worldwideadverts.info/go/aff/${myApplication.tracking_code}`
      : null);

  const handleJoinClick = () => {
    if (!requireAuth(`/affiliates/offer/${id}`, 'Log in to join this affiliate program.')) return;
    setShowJoinModal(true);
  };

  const handleJoinSubmit = async (payload) => {
    setJoining(true);
    try {
      const res = await affiliateService.applyToPromote(id, payload);
      const app = res?.data || res;
      setMyApplication(app);
      setShowJoinModal(false);
      if (app?.status === 'approved') {
        toast.success(res?.message || 'Approved — copy your tracking link');
      } else {
        toast.success(
          res?.message ||
            'Application submitted. The business will review your social channels.'
        );
      }
    } catch (err) {
      toast.error(err?.message || err?.error || 'Could not submit join application');
    } finally {
      setJoining(false);
    }
  };

  const handleCopyLink = async () => {
    if (!promoterLink) return;
    try {
      await navigator.clipboard.writeText(promoterLink);
      setCopied(true);
      toast.success('Tracking link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleOpenMerchant = async () => {
    try {
      await affiliateService.trackClick('business', Number(id));
    } catch {
      /* non-blocking */
    }
    if (merchantUrl) {
      window.open(merchantUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('No merchant destination link on this offer');
    }
  };

  const commissionLabel = () => {
    if (offer?.commission_rate == null && !offer?.commission) return null;
    if (offer.commission_type === 'fixed') {
      return `${offer.currency || '$'}${Number(offer.commission_rate).toFixed(2)} per sale`;
    }
    return `${offer.commission_rate}% commission`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <UnifiedNavbar showBackButton backHref="/affiliates" />
        <div className="flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-slate-50">
        <UnifiedNavbar showBackButton backHref="/affiliates" />
        <div className="page-container py-16 text-center">
          <p className="mb-4 text-red-600">{error || 'Offer not found'}</p>
          <button
            type="button"
            onClick={() => navigate('/affiliates')}
            className="rounded-lg bg-violet-600 px-5 py-2.5 font-semibold text-white"
          >
            Back to Affiliate Hub
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isPromoting = myApplication?.status === 'approved' && promoterLink;
  const isPending = myApplication?.status === 'pending';
  const isRejected = myApplication?.status === 'rejected';

  return (
    <div className="min-h-screen bg-violet-50/30">
      <UnifiedNavbar showBackButton backHref="/affiliates" />
      {showJoinModal && (
        <AffiliateJoinModal
          offerTitle={title}
          submitting={joining}
          onClose={() => !joining && setShowJoinModal(false)}
          onSubmit={handleJoinSubmit}
        />
      )}
      <div className="page-container py-6 sm:py-10">
        <Link
          to="/affiliates"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Affiliate programs
        </Link>

        <div className="mb-6 rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm text-gray-700">
          <strong className="text-violet-800">How it works:</strong> Browse programs → Join with your
          social links → Business reviews → Get your unique tracking link → Promote & earn.
          Looking for ready-made links instead?{' '}
          <Link to="/affiliates/links" className="font-semibold text-violet-700 underline">
            Links to promote
          </Link>
          .
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white">
            <div className="min-h-[200px] bg-violet-100 lg:min-h-[280px]">
              {imageUrl ? (
                <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[200px] items-center justify-center text-violet-300">
                  <Briefcase className="h-14 w-14" />
                </div>
              )}
            </div>
            <div className="space-y-4 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                {offer.affiliate_category?.name ||
                  offer.category?.name ||
                  offer.category_name ||
                  'Business program'}
              </p>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
              {offer.business_name && (
                <p className="text-lg text-gray-700">
                  by <span className="font-semibold">{offer.business_name}</span>
                </p>
              )}
              {offer.tagline && <p className="text-violet-700 italic">{offer.tagline}</p>}
              <p className="leading-relaxed text-gray-600 whitespace-pre-wrap">
                {offer.description || 'No description provided.'}
              </p>
              {(offer.country || offer.region) && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-violet-500" />
                  {[offer.region, offer.country].filter(Boolean).join(', ')}
                </p>
              )}
              {offer.cookie_duration && (
                <p className="text-sm text-gray-500">Cookie duration: {offer.cookie_duration} days</p>
              )}
              {Array.isArray(offer.allowed_traffic_types) && offer.allowed_traffic_types.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Allowed traffic</p>
                  <div className="flex flex-wrap gap-1.5">
                    {offer.allowed_traffic_types.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-violet-50 px-2 py-0.5 text-xs text-violet-700"
                      >
                        {String(t).replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {offer.join_instructions && (
                <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
                  <p className="text-sm font-semibold text-violet-900 mb-1">Join instructions</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{offer.join_instructions}</p>
                </div>
              )}
              {offer.restrictions && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Restrictions</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{offer.restrictions}</p>
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
              {commissionLabel() && (
                <div className="mb-4 flex items-center gap-2 text-violet-800">
                  <DollarSign className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-gray-500">You earn</p>
                    <p className="text-xl font-bold">{commissionLabel()}</p>
                  </div>
                </div>
              )}

              {isPromoting ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                    <Link2 className="h-4 w-4" />
                    Your unique tracking link
                  </p>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs break-all text-slate-700">
                    {promoterLink}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied' : 'Copy tracking link'}
                  </button>
                  <p className="text-xs text-gray-500">
                    Share this link. Clicks and conversions are attributed to you.
                    {myApplication?.clicks_count != null
                      ? ` Clicks: ${myApplication.clicks_count}.`
                      : ''}
                    {myApplication?.earnings_total != null
                      ? ` Earnings: ${myApplication.earnings_total}.`
                      : ''}
                  </p>
                </div>
              ) : isPending ? (
                <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-900">Application pending</p>
                  <p className="text-xs text-amber-800">
                    Your social links were submitted. The business will review and approve you to
                    receive a tracking link.
                  </p>
                </div>
              ) : isRejected ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    Application was not approved
                    {myApplication?.rejection_reason
                      ? `: ${myApplication.rejection_reason}`
                      : '.'}
                  </div>
                  <button
                    type="button"
                    onClick={handleJoinClick}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold text-white hover:bg-violet-700"
                  >
                    <Send className="h-4 w-4" />
                    Apply again
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleJoinClick}
                  disabled={joining}
                  className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  Join — share your socials
                </button>
              )}

              <button
                type="button"
                onClick={handleOpenMerchant}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 py-3 font-semibold text-violet-800 hover:bg-violet-50"
              >
                <ExternalLink className="h-4 w-4" />
                Preview merchant offer
              </button>

              {!isAuthenticated && (
                <p className="mt-3 text-xs text-gray-500">Sign in to join and receive your hop link.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AffiliateOfferDetailPage;
