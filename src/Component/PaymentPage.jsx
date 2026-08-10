import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import UnifiedNavbar from './UnifiedNavbar';
import Footer from './Footer';
import PaymentProcessor from './Payment/PaymentProcessor';
import { MIN_LISTING_PRICE } from '../constants/listingTierOptions';

/**
 * Universal checkout — listing upgrades, sponsored ads, sandbox QA.
 * Pass state or query: amount, description, listingId, upsellType, returnTo
 */
function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const state = location.state || {};
  const isSandboxPage = location.pathname.includes('/payment/sandbox');

  const amount = useMemo(() => {
    const raw =
      state.amount ??
      searchParams.get('amount') ??
      (isSandboxPage ? 1 : null);
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return n;
    return MIN_LISTING_PRICE;
  }, [state.amount, searchParams, isSandboxPage]);

  const description =
    state.description ||
    searchParams.get('description') ||
    (isSandboxPage
      ? 'WWA PayPal sandbox test payment'
      : state.upsellTier
        ? `Upgrade: ${state.upsellTier}`
        : 'Worldwide Adverts listing payment');

  const upsellType =
    state.upsellType || searchParams.get('type') || (isSandboxPage ? 'sandbox_test' : 'listing');
  const upsellId =
    state.listingId ||
    state.upsellId ||
    searchParams.get('id') ||
    (isSandboxPage ? 'sandbox-1' : undefined);
  const returnTo = state.returnTo || searchParams.get('returnTo') || '/dashboard';

  const handleSuccess = (result) => {
    toast.success(
      result?.mock
        ? 'Sandbox payment recorded. You can wire this to activate the listing next.'
        : 'Payment complete.'
    );
    if (isSandboxPage) {
      navigate('/payment/sandbox', {
        replace: true,
        state: { lastPayment: result },
      });
      return;
    }
    navigate(returnTo, {
      state: { paymentResult: result, paymentSuccess: true },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <UnifiedNavbar showBackButton backHref={returnTo} />
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
            {isSandboxPage ? 'Sandbox checkout' : 'Checkout'}
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            {isSandboxPage ? 'Test PayPal payment' : 'Complete your payment'}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {isSandboxPage
              ? 'Complete a $1 sandbox charge to verify create → approve → capture. No live money when mock/sandbox keys are used.'
              : 'Pay securely with PayPal to activate your listing or upgrade.'}
          </p>
        </div>

        {isSandboxPage && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <p className="font-semibold mb-1">How to verify</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Stay logged in (orders require auth).</li>
              <li>Click <strong>Pay $1.00 — Sandbox mock</strong> (or real PayPal buttons if sandbox keys are set).</li>
              <li>You should see a success toast and payment id below.</li>
            </ol>
            <p className="text-xs mt-2">
              For real PayPal Sandbox: set <code className="font-mono">PAYPAL_SANDBOX_CLIENT_ID</code> /{' '}
              <code className="font-mono">SECRET</code> and <code className="font-mono">PAYPAL_SANDBOX_MOCK=false</code>.
            </p>
          </div>
        )}

        <PaymentProcessor
          amount={amount}
          description={description}
          upsellType={upsellType}
          upsellId={upsellId}
          onSuccess={handleSuccess}
          onError={() => {}}
        />

        {state.lastPayment && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">Last sandbox payment</p>
            <p className="text-xs mt-1 break-all">
              ID: {state.lastPayment.paymentId || state.lastPayment.details?.id}
            </p>
            <p className="text-xs">
              Amount: ${Number(state.lastPayment.amount || 0).toFixed(2)}
              {state.lastPayment.mock ? ' (mock)' : ''}
            </p>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link to="/dashboard" className="text-violet-700 font-medium hover:underline">
            Back to dashboard
          </Link>
          {!isSandboxPage && (
            <>
              {' · '}
              <Link to="/payment/sandbox" className="text-gray-600 hover:underline">
                Open sandbox test
              </Link>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PaymentPage;
