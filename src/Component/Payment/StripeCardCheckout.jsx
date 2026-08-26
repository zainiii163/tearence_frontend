import React, { useMemo, useState } from 'react';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import api from '../../api';
import { assertValidPaymentAmount } from '../../utils/paymentDefence';

const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1e293b',
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#dc2626' },
  },
};

function StripeCardForm({
  amount,
  description,
  upsellType,
  upsellId,
  currency = 'USD',
  onSuccess,
  onError,
  mock = false,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const total = Number(amount) || 0;

  const handleMockPay = async () => {
    setProcessing(true);
    try {
      const safeAmount = assertValidPaymentAmount(total, 'Checkout');
      const { data: created } = await api.post('/stripe/payment-intents', {
        amount: safeAmount,
        currency,
        description: String(description || 'Worldwide Adverts purchase').slice(0, 200),
        upsell_type: upsellType,
        upsell_id: upsellId != null ? String(upsellId) : undefined,
      });
      const id = created?.id;
      if (!id) throw new Error(created?.message || 'Could not create Stripe mock intent');
      const { data: confirmed } = await api.post(`/stripe/payment-intents/${id}/confirm-mock`);
      if (!confirmed?.success && !confirmed?.id) {
        throw new Error(confirmed?.message || 'Stripe mock confirm failed');
      }
      onSuccess?.({
        paymentId: confirmed.id || id,
        details: confirmed.details || confirmed,
        mock: true,
      });
    } catch (err) {
      onError?.(err);
    } finally {
      setProcessing(false);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (mock) {
      await handleMockPay();
      return;
    }
    if (!stripe || !elements) {
      toast.error('Stripe is still loading…');
      return;
    }

    setProcessing(true);
    try {
      const safeAmount = assertValidPaymentAmount(total, 'Checkout');
      const { data: created } = await api.post('/stripe/payment-intents', {
        amount: safeAmount,
        currency,
        description: String(description || 'Worldwide Adverts purchase').slice(0, 200),
        upsell_type: upsellType,
        upsell_id: upsellId != null ? String(upsellId) : undefined,
      });

      const clientSecret = created?.client_secret;
      const intentId = created?.id;
      if (!clientSecret || !intentId) {
        throw new Error(created?.message || 'Could not create Stripe payment');
      }

      if (created.mock) {
        const { data: confirmed } = await api.post(`/stripe/payment-intents/${intentId}/confirm-mock`);
        onSuccess?.({
          paymentId: confirmed.id || intentId,
          details: confirmed.details || confirmed,
          mock: true,
        });
        return;
      }

      const card = elements.getElement(CardElement);
      if (!card) throw new Error('Card field not ready');

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Card payment failed');
      }

      const status = result.paymentIntent?.status;
      if (status !== 'succeeded') {
        throw new Error(`Card payment status: ${status || 'unknown'}`);
      }

      const { data: confirmed } = await api.post(`/stripe/payment-intents/${intentId}/confirm`);
      if (!confirmed?.success && !confirmed?.id) {
        throw new Error(confirmed?.message || 'Could not verify card payment on server');
      }

      onSuccess?.({
        paymentId: confirmed.id || intentId,
        details: confirmed.details || result.paymentIntent || confirmed,
        mock: false,
      });
    } catch (err) {
      onError?.(err);
    } finally {
      setProcessing(false);
    }
  };

  if (mock) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-600">
          Mock card checkout — no real charge. Set <code>STRIPE_SECRET</code> + publishable key for live cards.
        </p>
        <button
          type="button"
          disabled={total <= 0 || processing}
          onClick={handleMockPay}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 disabled:opacity-50"
        >
          {processing ? 'Processing…' : `Pay $${total.toFixed(2)} — Card mock`}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handlePay} className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
        <CardElement options={cardStyle} />
      </div>
      <button
        type="submit"
        disabled={!stripe || total <= 0 || processing}
        className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 disabled:opacity-50"
      >
        {processing ? 'Processing card…' : `Pay $${total.toFixed(2)} with card`}
      </button>
      <p className="text-[11px] text-slate-500 text-center">
        Cards processed securely by Stripe. We never store full card numbers.
      </p>
    </form>
  );
}

/**
 * Stripe Elements wrapper — skips Elements when mock (no publishable key needed).
 */
export default function StripeCardCheckout(props) {
  const { publishableKey, mock } = props;
  const stripePromise = useMemo(() => {
    if (mock || !publishableKey) return null;
    return loadStripe(publishableKey);
  }, [publishableKey, mock]);

  if (mock || !publishableKey) {
    return <StripeCardForm {...props} mock />;
  }

  return (
    <Elements stripe={stripePromise} options={{ appearance: { theme: 'stripe' } }}>
      <StripeCardForm {...props} mock={false} />
    </Elements>
  );
}
