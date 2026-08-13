import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import toast from 'react-hot-toast';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import donationAPI from '../api/donationAPI';
import { resolveStorageUrl } from '../utils/dashboardEditMappers';
import AuthenticCheckoutModal from '../Component/Payment/AuthenticCheckoutModal';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

const PRESETS = [10, 25, 50, 100];

const DonationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState(25);
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [contributionId, setContributionId] = useState(null);
  const [checkoutAmount, setCheckoutAmount] = useState(0);

  const loadCampaign = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await donationAPI.getDonationById(id);
      const data = res?.data || res;
      if (data?.title || data?.id) setCampaign(data);
      else setError('Campaign not found');
    } catch (e) {
      setError(e?.message || 'Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaign();
  }, [id]);

  const imageUrl = useMemo(() => {
    if (!campaign) return null;
    return (
      resolveStorageUrl(campaign.cover_image || campaign.image) ||
      campaign.cover_image ||
      null
    );
  }, [campaign]);

  const currency = campaign?.currency || 'USD';
  const money = (n) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(n) || 0);

  const handleDonate = async () => {
    if (!campaign) return;
    if (!requireAuth(`/donations/${id}`, 'Log in to donate to this campaign.')) return;
    if (!amount || Number(amount) < 1) {
      toast.error('Enter a donation amount of at least $1');
      return;
    }

    setSubmitting(true);
    try {
      const res = await donationAPI.startDonate(campaign.id, {
        amount: Number(amount),
        donor_name: anonymous ? 'Anonymous' : donorName || 'Supporter',
        message,
        is_anonymous: anonymous,
      });
      const data = res?.data || res;
      if (!data?.contribution_id) throw new Error(res?.message || 'Could not start donation');
      setContributionId(data.contribution_id);
      setCheckoutAmount(Number(data.amount || amount));
      setCheckoutOpen(true);
      toast.success('Complete PayPal to confirm your gift');
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Donation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (details) => {
    if (!contributionId) return;
    try {
      const res = await donationAPI.confirmDonate(contributionId, {
        payment_id: details.paymentId || details.id,
        payment_method: details?.paymentMethod || details?.payment_method || 'paypal',
      });
      const data = res?.data || res;
      if (data?.donation) setCampaign(data.donation);
      else await loadCampaign();
      setCheckoutOpen(false);
      setContributionId(null);
      toast.success('Thank you — your donation is confirmed!');
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Payment confirmation failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/donations" />
        <div className="flex items-center justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-pink-500 border-r-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton backHref="/donations" />
        <div className="page-container py-16 text-center">
          <p className="mb-4 text-lg text-red-600">{error || 'Campaign not found'}</p>
          <button
            type="button"
            onClick={() => navigate('/donations')}
            className="rounded-lg bg-pink-600 px-5 py-2.5 font-semibold text-white"
          >
            Back to donations
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const raised = Number(campaign.raised_amount || campaign.current_amount || 0);
  const goal = Number(campaign.goal_amount || campaign.target_amount || 0);
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

  return (
    <div className="min-h-screen bg-rose-50/40">
      <UnifiedNavbar showBackButton backHref="/donations" />
      <div className="page-container py-6 sm:py-10">
        <Link
          to="/donations"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="h-3.5 w-3.5" />
          Charities & Donations
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white">
            <div className="min-h-[220px] bg-pink-50 lg:min-h-[360px]">
              {imageUrl ? (
                <img src={imageUrl} alt={campaign.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[220px] items-center justify-center text-pink-300">
                  <FaHeart className="h-14 w-14" />
                </div>
              )}
            </div>
            <div className="space-y-4 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                {campaign.category || 'Campaign'}
              </p>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{campaign.title}</h1>
              <p className="leading-relaxed text-gray-600">
                {campaign.description || campaign.story || 'No description provided.'}
              </p>
              {campaign.story && campaign.description && (
                <div>
                  <h2 className="mb-2 text-lg font-semibold text-gray-900">Story</h2>
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-600">{campaign.story}</p>
                </div>
              )}
              {(campaign.city || campaign.country) && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-pink-500" />
                  {[campaign.city, campaign.country].filter(Boolean).join(', ')}
                </p>
              )}
              <p className="text-sm text-gray-600">
                Organizer: <span className="font-semibold">{campaign.organizer_name || 'Anonymous'}</span>
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="rounded-2xl border border-pink-200 bg-white p-5 shadow-sm">
              <div className="mb-1 flex justify-between text-sm text-gray-700">
                <span className="font-semibold">{money(raised)} raised</span>
                <span>Goal {money(goal)}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-pink-500" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <FaUsers /> {campaign.donor_count || 0} donors · {pct}% funded
              </p>

              <label className="mt-5 mb-1 block text-sm font-medium text-gray-700">Amount</label>
              <div className="mb-2 grid grid-cols-4 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p)}
                    className={`rounded-lg border py-2 text-sm font-semibold ${
                      Number(amount) === p
                        ? 'border-pink-500 bg-pink-50 text-pink-800'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    ${p}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2"
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">Your name</label>
              <input
                type="text"
                disabled={anonymous}
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-50"
                placeholder="Optional"
              />

              <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Optional note of support"
              />

              <label className="mb-4 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                Donate anonymously
              </label>

              <button
                type="button"
                onClick={handleDonate}
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3 font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
              >
                <FaHeart />
                {submitting ? 'Starting…' : `Donate ${money(amount)}`}
              </button>

              {!isAuthenticated && (
                <p className="mt-2 text-xs text-gray-500">Sign in required to complete a donation.</p>
              )}
              <p className="mt-3 text-xs text-gray-500">
                Secure PayPal checkout. The campaign total updates only after payment succeeds.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <AuthenticCheckoutModal
        open={checkoutOpen}
        onClose={() => {
          setCheckoutOpen(false);
          setContributionId(null);
        }}
        title="Complete your donation"
        description={`Donate ${money(checkoutAmount)} to “${campaign.title}”.`}
        amount={checkoutAmount}
        upsellType="donation"
        upsellId={contributionId}
        onSuccess={handlePaymentSuccess}
        onError={() => toast.error('PayPal payment failed')}
        footerNote="Your gift is recorded after PayPal confirms payment."
      />
      <Footer />
    </div>
  );
};

export default DonationDetailPage;
