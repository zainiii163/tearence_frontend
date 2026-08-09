import React from 'react';
import { X } from 'lucide-react';
import PaymentProcessor from '../Payment/PaymentProcessor';
import { isPayPalSandboxDemo } from '../../utils/paypalConfig';

/**
 * Authentic checkout shell used on category template shops and service orders.
 * Always routes money through PayPalButtons — no "Pay (test)" / platform freebies.
 */
const AuthenticCheckoutModal = ({
  open,
  onClose,
  title = 'Secure checkout',
  description = '',
  amount = 0,
  upsellType = 'purchase',
  upsellId,
  onSuccess,
  onError,
  footerNote,
}) => {
  if (!open) return null;

  const total = Number(amount) || 0;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {description ? <p className="text-sm text-gray-600">{description}</p> : null}

          {isPayPalSandboxDemo() && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-3">
              PayPal is running in sandbox demo mode. Set{' '}
              <code className="font-mono">REACT_APP_PAYPAL_CLIENT_ID</code> to your
              Sandbox/Live Client ID for production charges.
            </p>
          )}

          <PaymentProcessor
            amount={total}
            description={description || title}
            upsellType={upsellType}
            upsellId={upsellId}
            onSuccess={onSuccess}
            onError={onError}
          />

          {footerNote ? <p className="text-xs text-gray-500">{footerNote}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default AuthenticCheckoutModal;
