import React, { useState } from 'react';
import toast from 'react-hot-toast';
import AuthenticCheckoutModal from '../Payment/AuthenticCheckoutModal';
import { confirmListingPaymentAfterCheckout } from '../../utils/listingPayment';
import { MIN_LISTING_PRICE, getTierById } from '../../constants/listingTierOptions';

function resolvePendingAmount(item, amount) {
  const direct = Number(
    amount ??
      item?.amount ??
      item?.upsell_price ??
      item?.sponsorship_price ??
      item?.promotion_price ??
      0
  );
  if (Number.isFinite(direct) && direct >= MIN_LISTING_PRICE) return direct;

  const tierId =
    item?.promotion_plan || item?.upsell_tier || item?.sponsorship_tier || item?.promotion_tier;
  const mapped =
    {
      basic: 'paid',
      plus: 'promoted',
      premium: 'sponsored',
      standard: 'paid',
      promoted_basic: 'promoted',
      promoted_plus: 'featured',
      promoted_premium: 'sponsored',
      network_wide_boost: 'sponsored',
      network_boost: 'sponsored',
    }[String(tierId || '').toLowerCase()] || tierId;
  const tier = getTierById(mapped);
  const fromTier = Number(tier?.price || 0);
  if (fromTier >= MIN_LISTING_PRICE) return fromTier;

  return 0;
}

/**
 * Pay outstanding listing invoice → confirm on API → ad goes live.
 */
const ListingPendingPayAction = ({
  item,
  upsellType,
  amount,
  onPaid,
  label = 'Pay & go live',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [paying, setPaying] = useState(false);

  const listingId =
    item?.id ??
    item?.sponsored_advert_id ??
    item?.advert_id ??
    item?.listing_id ??
    null;

  const total = resolvePendingAmount(item, amount);

  if (!listingId || total < MIN_LISTING_PRICE) return null;

  const handleSuccess = async (payment) => {
    setPaying(true);
    try {
      const result = await confirmListingPaymentAfterCheckout(payment, {
        upsellType,
        upsellId: listingId,
        listingId,
      });
      if (result?.skipped) {
        toast.success('Payment recorded. Refresh if status is still pending.');
      } else {
        toast.success('Invoice cleared — your advert is now live.');
      }
      setOpen(false);
      onPaid?.();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Payment captured but activation failed.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <>
      <button
        type="button"
        disabled={paying}
        onClick={() => setOpen(true)}
        className={
          className ||
          'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50'
        }
      >
        {paying ? 'Activating…' : label}
      </button>

      <AuthenticCheckoutModal
        open={open}
        onClose={() => !paying && setOpen(false)}
        title="Clear invoice & go live"
        description={`Pay $${total.toFixed(2)} to activate “${item?.title || 'your advert'}”. It will post automatically after payment.`}
        amount={total}
        upsellType={upsellType}
        upsellId={listingId}
        onSuccess={handleSuccess}
        onError={() => toast.error('Payment failed')}
        footerNote="After payment clears, your advert status changes from Pending to Active."
      />
    </>
  );
};

export default ListingPendingPayAction;
