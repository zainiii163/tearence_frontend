import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTag, FaPercent, FaGift, FaCheckCircle } from 'react-icons/fa';
import referralService from '../../services/ReferralService';
import { calculateDiscount, isEligibleForReferralDiscount, getStoredReferralCode } from '../../utils/referralHelper';

const ReferralDiscount = ({ originalPrice, onDiscountApplied, advertData }) => {
  const dispatch = useDispatch();
  const { userDetail } = useSelector(state => state.auth);
  const [referralCode, setReferralCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [autoAppliedCode, setAutoAppliedCode] = useState('');

  useEffect(() => {
    // Check for stored referral code from URL
    const storedCode = getStoredReferralCode();
    if (storedCode && userDetail) {
      setReferralCode(storedCode);
      setAutoAppliedCode(storedCode);
      applyReferralDiscount(storedCode);
    }
  }, [userDetail]);

  const applyReferralDiscount = async (code = referralCode) => {
    if (!code.trim()) {
      setError('Please enter a referral code');
      return;
    }

    if (!userDetail) {
      setError('Please login to apply referral discount');
      return;
    }

    if (!isEligibleForReferralDiscount(userDetail, code)) {
      setError('You are not eligible for this referral discount');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await referralService.applyReferralDiscount(
        userDetail.customer_id,
        advertData,
        code
      );

      if (response.success) {
        const discountData = calculateDiscount(originalPrice, response.data.discount_percentage);
        setDiscount(discountData);
        setSuccess(`Referral discount applied! You saved $${discountData.discountAmount.toFixed(2)}`);
        
        // Notify parent component
        if (onDiscountApplied) {
          onDiscountApplied({
            ...discountData,
            referralCode: code,
            referralId: response.data.referral_id
          });
        }
      } else {
        setError(response.message || 'Invalid referral code');
      }
    } catch (error) {
      setError('Failed to apply referral discount. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeDiscount = () => {
    setDiscount(null);
    setReferralCode('');
    setError('');
    setSuccess('');
    
    if (onDiscountApplied) {
      onDiscountApplied(null);
    }
  };

  const handleReferralCodeChange = (e) => {
    const value = e.target.value.toUpperCase();
    setReferralCode(value);
    setError('');
    setSuccess('');
    
    // Clear discount if code is changed
    if (discount && value !== discount.referralCode) {
      setDiscount(null);
      if (onDiscountApplied) {
        onDiscountApplied(null);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
      <div className="flex items-center mb-4">
        <FaTag className="text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Referral Discount</h3>
      </div>

      {discount ? (
        // Discount Applied View
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-600 mr-2" />
                <div>
                  <div className="font-semibold text-green-800">
                    Referral Discount Applied!
                  </div>
                  <div className="text-sm text-green-600">
                    Code: {discount.referralCode}
                  </div>
                </div>
              </div>
              <button
                onClick={removeDiscount}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Original Price</div>
              <div className="text-lg font-semibold line-through text-gray-500">
                ${originalPrice.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Discount</div>
              <div className="text-lg font-semibold text-green-600">
                -${discount.discountAmount.toFixed(2)} ({discount.discountPercentage}%)
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Final Price</div>
              <div className="text-lg font-bold text-purple-600">
                ${discount.finalPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Discount Input View
        <div className="space-y-4">
          {autoAppliedCode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-blue-800">
                <FaGift className="inline mr-1" />
                Referral code detected and applied automatically!
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Referral Code
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={referralCode}
                onChange={handleReferralCodeChange}
                placeholder="REF-12345-USERNAME"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={loading}
              />
              <button
                onClick={() => applyReferralDiscount()}
                disabled={loading || !referralCode.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <FaPercent className="mr-2" />
                )}
                Apply
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-sm text-green-800">{success}</div>
            </div>
          )}

          <div className="bg-white bg-opacity-60 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Enter a valid referral code to get discount on your advert</li>
              <li>• New users get 15% discount on their first advert</li>
              <li>• Your friend who referred you also gets rewards</li>
              <li>• Discount applies automatically to eligible adverts</li>
            </ul>
          </div>

          {!userDetail && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-sm text-yellow-800">
                <FaGift className="inline mr-1" />
                Please login to apply referral discounts
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralDiscount;
