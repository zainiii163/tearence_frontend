import React from 'react';
import { X } from 'lucide-react';
import PaymentProcessor from '../Payment/PaymentProcessor';
import { fetchPayPalConfig } from '../../utils/paypalConfig';

/**
 * Authentic checkout shell used across the site (templates, services, books, …).
 * Money goes through PaymentProcessor — PayPal and/or Crypto.
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
  const [sandboxInfo, setSandboxInfo] = React.useState(null);

  React.useEffect(() => {
    if (!open) return;
    fetchPayPalConfig().then(setSandboxInfo).catch(() => {});
  }, [open]);

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

          {sandboxInfo?.sandbox && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-3">
              {sandboxInfo.mock
                ? 'Test mode available — PayPal mock and Crypto mock complete without real charges when configured that way.'
                : 'PayPal Sandbox may be active for card/PayPal tests. Crypto uses its own live/mock config.'}
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
