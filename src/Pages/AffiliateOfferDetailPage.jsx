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
} from 'lucide-react';
import toast from 'react-hot-toast';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import affiliateService from '../services/AffiliateService';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { getStorageAssetUrl } from '../utils/jobsHelpers';

const AffiliateOfferDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyNote, setApplyNote] = useState('');
  const [showApply, setShowApply] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await affiliateService.getBusinessOffer(id);
        const data = res?.data || res;
        if (!cancelled) {
          if (data?.id || data?.title) setOffer(data);
          else setError('Offer not found');
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || e?.error || 'Failed to load offer');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const imageUrl =
    getStorageAssetUrl(offer?.logo_url || offer?.banner_url || offer?.image_url) ||
    offer?.logo_url ||
    offer?.banner_url ||
    null;

  const affiliateUrl = offer?.tracking_link || offer?.affiliate_link || offer?.website_url;

  const handleOpenLink = async () => {
    try {
      await affiliateService.trackClick('business', Number(id));
    } catch {
      /* non-blocking */
    }
    if (affiliateUrl) {
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('No affiliate link available');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!requireAuth(`/affiliates/offer/${id}`, 'Log in to apply for this program.')) return;

    setApplying(true);
    try {
      await affiliateService.applyToPromote(id, {
        message: applyNote || 'I would like to promote this offer.',
      });
      toast.success('Application submitted');
      setShowApply(false);
      setApplyNote('');
    } catch (err) {
      toast.error(err?.message || err?.error || 'Could not submit application');
    } finally {
      setApplying(false);
    }
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

  return (
    <div className="min-h-screen bg-violet-50/30">
      <UnifiedNavbar showBackButton backHref="/affiliates" />
      <div className="page-container py-6 sm:py-10">
        <Link
          to="/affiliates"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Affiliate Hub
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white">
            <div className="min-h-[200px] bg-violet-100 lg:min-h-[280px]">
              {imageUrl ? (
                <img src={imageUrl} alt={offer.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[200px] items-center justify-center text-violet-300">
                  <Briefcase className="h-14 w-14" />
                </div>
              )}
            </div>
            <div className="space-y-4 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                {offer.category?.name || offer.category || 'Business offer'}
              </p>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {offer.title || offer.business_name}
              </h1>
              {(offer.business_name || offer.company_name) && (
                <p className="text-lg text-gray-700">
                  by <span className="font-semibold">{offer.business_name || offer.company_name}</span>
                </p>
              )}
              <p className="leading-relaxed text-gray-600 whitespace-pre-wrap">
                {offer.description || offer.details || 'No description provided.'}
              </p>
              {(offer.country || offer.city) && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-violet-500" />
                  {[offer.city, offer.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
              {(offer.commission_rate != null || offer.commission) && (
                <div className="mb-4 flex items-center gap-2 text-violet-800">
                  <DollarSign className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-gray-500">Commission</p>
                    <p className="text-xl font-bold">
                      {offer.commission_rate != null
                        ? `${offer.commission_rate}%`
                        : offer.commission}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleOpenLink}
                className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold text-white hover:bg-violet-700"
              >
                <ExternalLink className="h-4 w-4" />
                Open affiliate link
              </button>

              <button
                type="button"
                onClick={() => setShowApply(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 py-3 font-semibold text-violet-800 hover:bg-violet-50"
              >
                <Send className="h-4 w-4" />
                Apply to promote
              </button>

              {!isAuthenticated && (
                <p className="mt-3 text-xs text-gray-500">Sign in required to apply.</p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {showApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleApply}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Apply to promote</h3>
            <textarea
              rows={4}
              value={applyNote}
              onChange={(e) => setApplyNote(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Tell the brand why you're a good fit…"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={applying}
                className="flex-1 rounded-lg bg-violet-600 py-2.5 font-semibold text-white disabled:opacity-60"
              >
                {applying ? 'Submitting…' : 'Submit application'}
              </button>
              <button
                type="button"
                onClick={() => setShowApply(false)}
                className="flex-1 rounded-lg border py-2.5"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AffiliateOfferDetailPage;
