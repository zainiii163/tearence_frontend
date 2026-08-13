import React from 'react';
import toast from 'react-hot-toast';
import AuthenticCheckoutModal from '../Payment/AuthenticCheckoutModal';
import {
  markSoftwarePurchased,
  triggerSoftwareFileDownload,
} from '../../data/softwareMarketplace';

/**
 * Paywall before download — authentic PayPal checkout (no fake card form).
 */
const SoftwarePurchaseModal = ({ item, onClose, onPurchased }) => {
  if (!item) return null;

  const handlePaymentSuccess = (details) => {
    markSoftwarePurchased(item.id, {
      amount: item.price,
      paymentId: details.paymentId || details.id,
      paymentMethod: details?.paymentMethod || 'paypal',
      title: item.title,
      paidAt: new Date().toISOString(),
    });
    onPurchased?.(item.id);
    toast.success('Payment confirmed — starting download.');
    window.setTimeout(() => {
      triggerSoftwareFileDownload(item);
      onClose?.();
    }, 400);
  };

  return (
    <AuthenticCheckoutModal
      open
      onClose={onClose}
      title={`Pay for ${item.title}`}
      description={`Complete payment to unlock “${item.title}” ($${item.price}).`}
      amount={item.price}
      upsellType="software"
      upsellId={item.id}
      onSuccess={handlePaymentSuccess}
      onError={() => toast.error('Payment failed')}
      footerNote="File download unlocks only after payment confirms (PayPal or Crypto)."
    />
  );
};

export default SoftwarePurchaseModal;
