import React, { useState } from 'react';
import { FiX, FiLock, FiDownload, FiCreditCard, FiCheck } from 'react-icons/fi';
import {
  markSoftwarePurchased,
  triggerSoftwareFileDownload,
} from '../../data/softwareMarketplace';

/**
 * Paywall before download. Demo checkout unlocks the file for this browser,
 * then triggers the real download.
 */
const SoftwarePurchaseModal = ({ item, onClose, onPurchased }) => {
  const [step, setStep] = useState('pay'); // pay | processing | done
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [card, setCard] = useState('');
  const [error, setError] = useState('');

  if (!item) return null;

  const handlePay = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || card.replace(/\s/g, '').length < 12) {
      setError('Enter name, email, and a valid card number to continue.');
      return;
    }
    setStep('processing');
    window.setTimeout(() => {
      markSoftwarePurchased(item.id, {
        amount: item.price,
        email: email.trim(),
        title: item.title,
      });
      setStep('done');
      onPurchased?.(item.id);
      window.setTimeout(() => {
        triggerSoftwareFileDownload(item);
      }, 400);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-slate-50">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <FiLock className="h-4 w-4 text-blue-700" />
            Secure checkout
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700 mb-1">
            Download unlock
          </p>
          <h2 className="text-base font-bold text-gray-900 leading-snug">{item.title}</h2>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-gray-900">${item.price}</span>
            <span className="text-xs text-gray-500">one-time · instant download</span>
          </div>

          {step === 'pay' && (
            <form onSubmit={handlePay} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Jane Buyer"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email (receipt)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Card number</label>
                <div className="relative">
                  <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={card}
                    onChange={(e) => setCard(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm"
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                    autoComplete="cc-number"
                  />
                </div>
                <p className="mt-1 text-[10px] text-gray-400">
                  Demo paywall — use any 12+ digit test card. Live Stripe/PayPal can replace this later.
                </p>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold py-2.5"
              >
                Pay ${item.price} & unlock download
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="mt-8 mb-4 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
              <p className="mt-3 text-sm font-semibold text-gray-800">Processing payment…</p>
            </div>
          )}

          {step === 'done' && (
            <div className="mt-6 mb-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <FiCheck className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-bold text-gray-900">Payment successful</p>
              <p className="text-xs text-gray-500 mt-1">Your download should start automatically.</p>
              <button
                type="button"
                onClick={() => triggerSoftwareFileDownload(item)}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold py-2.5"
              >
                <FiDownload className="h-4 w-4" />
                Download again
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 w-full text-xs font-semibold text-gray-500 hover:text-gray-800 py-2"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoftwarePurchaseModal;
