import React, { useState } from 'react';
import { FaTag, FaCheckCircle, FaTimes } from 'react-icons/fa';
import promoService from '../../services/PromoService';

/**
 * Reward / promo code input for advertising checkouts.
 * onApplied({ code, discount_amount, final_price, points_awarded, type, value, code_id })
 */
const RewardCodeInput = ({
  tier = null,
  planSlug = null,
  originalPrice = 0,
  onApplied,
  onCleared,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [applied, setApplied] = useState(null);

  const apply = async () => {
    if (!code.trim()) {
      setError('Enter a reward code');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await promoService.validateCode({
        code: code.trim(),
        tier,
        plan_slug: planSlug,
        original_price: originalPrice,
      });
      if (!res.success && !res.data?.valid) {
        setError(res.message || res.data?.message || 'Invalid code');
        return;
      }
      const data = res.data || res;
      setApplied(data);
      setSuccess(data.message || 'Code applied');
      if (onApplied) onApplied(data);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.data?.message ||
        e?.message ||
        'Failed to validate code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setApplied(null);
    setCode('');
    setError('');
    setSuccess('');
    if (onCleared) onCleared();
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-800">
        <FaTag className="text-green-600" />
        Reward / promo code
      </label>
      {!applied ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. WWA10"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={apply}
            disabled={loading}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Apply'}
          </button>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3 rounded-lg bg-green-50 p-3">
          <div className="text-sm text-green-800">
            <div className="mb-1 flex items-center gap-2 font-semibold">
              <FaCheckCircle /> {applied.code}
            </div>
            {applied.discount_amount > 0 && (
              <p>
                Discount: ${Number(applied.discount_amount).toFixed(2)} — pay $
                {Number(applied.final_price).toFixed(2)}
              </p>
            )}
            {applied.points_awarded > 0 && (
              <p>+{applied.points_awarded} reward points</p>
            )}
          </div>
          <button type="button" onClick={clear} className="text-gray-500 hover:text-gray-800">
            <FaTimes />
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {success && !error && <p className="mt-2 text-xs text-green-600">{success}</p>}
    </div>
  );
};

export default RewardCodeInput;
