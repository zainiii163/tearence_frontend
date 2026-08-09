import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  DollarSign,
  Gift,
  AlertCircle,
  Loader2,
  User,
  Calendar,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import fundingService from '../../services/FundingService';
import AuthenticCheckoutModal from '../Payment/AuthenticCheckoutModal';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

const money = (n, currency = 'USD') => {
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
  return `${symbol}${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const FundingPledgeForm = ({ project, rewards = [], onClose, onSuccess, initialReward = null }) => {
  const currency = project?.currency || 'USD';
  const minContribution = Number(project?.minimum_contribution || 1);
  const raised = Number(project?.current_funded ?? project?.current_funding ?? 0);
  const backers = Number(project?.backers_count ?? project?.backer_count ?? 0);
  const daysLeft = project?.days_remaining ?? project?.daysLeft ?? null;
  const cover =
    resolveStorageUrl(project?.cover_image) || project?.cover_image || '/img/NoImage.png';

  const [selectedReward, setSelectedReward] = useState(initialReward);
  const [pledgeData, setPledgeData] = useState({
    amount: initialReward
      ? String(initialReward.minimum_contribution)
      : String(minContribution),
    funding_reward_id: initialReward?.id || null,
    notes: '',
    is_anonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [pendingPledge, setPendingPledge] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const availableRewards = useMemo(
    () =>
      (rewards || []).filter((reward) => {
        if (reward.is_active === false) return false;
        if (reward.limit == null) return true;
        return Number(reward.claimed_count || 0) < Number(reward.limit);
      }),
    [rewards]
  );

  const handleRewardSelect = (reward) => {
    setSelectedReward(reward);
    setPledgeData((prev) => ({
      ...prev,
      amount: String(reward.minimum_contribution),
      funding_reward_id: reward.id,
    }));
  };

  const handleCustomAmountChange = (amount) => {
    setSelectedReward(null);
    setPledgeData((prev) => ({
      ...prev,
      amount,
      funding_reward_id: null,
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setIsSubmitting(true);
    setError(null);

    try {
      const amount = parseFloat(pledgeData.amount);
      if (!amount || Number.isNaN(amount)) {
        throw new Error('Enter a valid pledge amount');
      }
      if (amount < minContribution) {
        throw new Error(`Minimum contribution is ${money(minContribution, currency)}`);
      }
      if (selectedReward && amount < Number(selectedReward.minimum_contribution)) {
        throw new Error(
          `Minimum for this reward is ${money(selectedReward.minimum_contribution, currency)}`
        );
      }

      const response = await fundingService.makePledge(project.id, {
        amount,
        funding_reward_id: pledgeData.funding_reward_id || undefined,
        notes: pledgeData.notes || undefined,
        is_anonymous: !!pledgeData.is_anonymous,
      });

      const pledge = response?.data || response;
      if (!pledge?.id) {
        throw new Error(response?.message || 'Could not create pledge');
      }

      setPendingPledge(pledge);
      setCheckoutOpen(true);
      toast.success('Pledge reserved — complete PayPal payment to confirm.');
    } catch (err) {
      const message =
        err?.message ||
        err?.errors?.amount?.[0] ||
        'Failed to create pledge. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (details) => {
    if (!pendingPledge?.id) return;
    try {
      const response = await fundingService.confirmPledgePayment(pendingPledge.id, {
        payment_id: details?.paymentId || details?.id || details?.orderID,
        payment_method: 'paypal',
      });
      toast.success(response?.message || 'Payment confirmed — thank you for backing!');
      setCheckoutOpen(false);
      onSuccess?.(response?.data || pendingPledge);
      onClose?.();
    } catch (err) {
      const message = err?.message || 'Payment confirmation failed';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 border-b border-gray-200 bg-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-[#02a95c] rounded-lg text-white">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Back this project</h2>
                    <p className="text-sm text-gray-600 line-clamp-1">{project?.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-red-800 font-medium">Pledge error</p>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={cover}
                      alt={project?.title || 'Project'}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = '/img/NoImage.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{project?.title}</h3>
                      {project?.tagline && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.tagline}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {money(raised, currency)} raised
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {backers} backers
                        </span>
                        {daysLeft != null && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {daysLeft} days left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose a reward</h3>
                  <div className="space-y-3">
                    <button
                      type="button"
                      className={`w-full text-left border rounded-lg p-4 transition-all ${
                        !selectedReward
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleCustomAmountChange(String(minContribution))}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 font-medium">
                            <Heart className="w-4 h-4 text-gray-400" />
                            No reward
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Support this project without a perk
                          </p>
                        </div>
                        <span className="font-semibold text-emerald-700">
                          {money(minContribution, currency)}+
                        </span>
                      </div>
                    </button>

                    {availableRewards.map((reward) => (
                      <button
                        key={reward.id}
                        type="button"
                        className={`w-full text-left border rounded-lg p-4 transition-all ${
                          selectedReward?.id === reward.id
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleRewardSelect(reward)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 font-medium">
                              <Gift className="w-4 h-4 text-gray-400" />
                              {reward.title}
                              {reward.limit != null && (
                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                  {Math.max(
                                    0,
                                    Number(reward.limit) - Number(reward.claimed_count || 0)
                                  )}{' '}
                                  left
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                            {reward.estimated_delivery_date && (
                              <p className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                Est. delivery:{' '}
                                {new Date(reward.estimated_delivery_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <span className="font-semibold text-emerald-700 whitespace-nowrap">
                            {money(reward.minimum_contribution, currency)}+
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pledge amount ({currency})
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min={minContribution}
                      step="0.01"
                      value={pledgeData.amount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum contribution: {money(minContribution, currency)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to creator (optional)
                  </label>
                  <textarea
                    value={pledgeData.notes}
                    onChange={(e) =>
                      setPledgeData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Add a note of support…"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={pledgeData.is_anonymous}
                    onChange={(e) =>
                      setPledgeData((prev) => ({ ...prev, is_anonymous: e.target.checked }))
                    }
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  Back anonymously
                </label>

                <p className="text-xs text-gray-500 flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
                  Your pledge is held as pending until PayPal payment succeeds. The campaign total
                  updates only after payment is confirmed.
                </p>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !pledgeData.amount}
                  className="inline-flex items-center gap-2 bg-[#02a95c] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating pledge…
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      Continue to PayPal · {money(pledgeData.amount, currency)}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <AuthenticCheckoutModal
          open={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          title="Complete your pledge"
          description={`Pay ${money(pendingPledge?.amount || pledgeData.amount, currency)} to back “${project?.title || 'this project'}”.`}
          amount={Number(pendingPledge?.amount || pledgeData.amount) || 0}
          upsellType="funding_pledge"
          upsellId={pendingPledge?.id}
          onSuccess={handlePaymentSuccess}
          onError={(err) => toast.error(err?.message || 'Payment failed')}
          footerNote="Funds are attributed to the campaign after PayPal confirms the payment."
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default FundingPledgeForm;
