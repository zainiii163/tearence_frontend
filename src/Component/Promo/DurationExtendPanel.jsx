import React, { useState } from 'react';
import promoService from '../../services/PromoService';
import { PROMO_PRICING_PLANS, formatDurationLabel } from '../../config/promoPricing';
import RewardCodeInput from '../Promo/RewardCodeInput';

/**
 * Extend / renew how long a post stays live (user dashboard).
 */
const DurationExtendPanel = ({
  type, // listing | featured | sponsored | promoted | affiliate_post | affiliate_offer
  id,
  currentExpiresAt,
  onExtended,
}) => {
  const [planSlug, setPlanSlug] = useState('featured');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState(null);

  const plans = PROMO_PRICING_PLANS;
  const selected = plans.find((p) => p.slug === planSlug) || plans[0];

  const extend = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await promoService.extendDuration({
        type,
        id,
        plan_slug: planSlug,
        duration_days: selected?.duration_days,
        promo_code: promoCode?.code || undefined,
      });
      if (res.success) {
        setMessage(res.message || 'Duration updated');
        if (onExtended) onExtended(res.data);
      } else {
        setError(res.message || 'Failed to extend');
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to extend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
      <div>
        <h4 className="text-sm font-semibold text-gray-900">Live duration</h4>
        <p className="text-xs text-gray-500">
          Current expiry:{' '}
          {currentExpiresAt
            ? new Date(currentExpiresAt).toLocaleString()
            : 'Not set (defaults to 30 days from publish)'}
        </p>
      </div>
      <select
        value={planSlug}
        onChange={(e) => setPlanSlug(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      >
        {plans.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name} — ${p.price_usd} / {p.duration_label || formatDurationLabel(p.duration_days)}
          </option>
        ))}
      </select>
      <RewardCodeInput
        tier={selected?.tier}
        planSlug={selected?.slug}
        originalPrice={selected?.price_usd || 0}
        onApplied={setPromoCode}
        onCleared={() => setPromoCode(null)}
      />
      <button
        type="button"
        onClick={extend}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Updating…' : `Extend by ${selected?.duration_label || formatDurationLabel(selected?.duration_days)}`}
      </button>
      {message && <p className="text-xs text-green-600">{message}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default DurationExtendPanel;
