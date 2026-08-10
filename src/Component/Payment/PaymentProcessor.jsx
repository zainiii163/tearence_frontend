import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';
import { FaCreditCard, FaLock } from 'react-icons/fa';
import { fetchPayPalConfig, resolvePayPalClientId } from '../../utils/paypalConfig';
import api from '../../api';

const PaymentProcessor = ({
  amount,
  description,
  onSuccess,
  onError,
  upsellType = 'job',
  upsellId,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [processing, setProcessing] = useState(false);
  const [paypalConfig, setPaypalConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setConfigLoading(true);
    fetchPayPalConfig()
      .then((cfg) => {
        if (!cancelled) setPaypalConfig(cfg);
      })
      .finally(() => {
        if (!cancelled) setConfigLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const total = Number(amount) || 0;
  const clientId = paypalConfig?.client_id || resolvePayPalClientId();
  const isSandbox = paypalConfig?.sandbox !== false;
  const isMock = Boolean(paypalConfig?.mock);

  const paypalOptions = {
    'client-id': clientId,
    currency: paypalConfig?.currency || 'USD',
    intent: 'capture',
  };

  const handlePayPalSuccess = (details) => {
    setProcessing(true);
    if (onSuccess) {
      onSuccess({
        paymentId: details.id,
        paymentMethod: 'paypal',
        amount: total,
        upsellType,
        upsellId,
        details,
        mock: Boolean(details?.mock || isMock),
      });
    }
    toast.success(isMock ? 'Sandbox mock payment successful!' : 'Payment successful!');
    setProcessing(false);
  };

  const handlePayPalError = (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Payment failed. Please try again.';
    toast.error(message);
    if (onError) onError(error);
  };

  const createOrder = async () => {
    const { data } = await api.post('/paypal/orders', {
      amount: total,
      currency: paypalConfig?.currency || 'USD',
      description: String(description || 'Worldwide Adverts purchase').slice(0, 127),
      upsell_type: upsellType,
      upsell_id: upsellId != null ? String(upsellId) : undefined,
    });

    if (!data?.id) {
      throw new Error(data?.message || 'PayPal did not return an order id');
    }
    return data.id;
  };

  const onApprove = async (data) => {
    setProcessing(true);
    try {
      const orderId = data.orderID || data.orderId;
      const { data: captured } = await api.post(`/paypal/orders/${orderId}/capture`);
      if (!captured?.success && !captured?.id) {
        throw new Error(captured?.message || 'PayPal capture failed');
      }
      handlePayPalSuccess(captured.details || captured);
    } catch (err) {
      handlePayPalError(err);
      setProcessing(false);
    }
  };

  /** Full mock path when sandbox_mock is on — PayPal JS cannot approve MOCK-* order ids. */
  const handleMockPay = async () => {
    setProcessing(true);
    try {
      const orderId = await createOrder();
      const { data: captured } = await api.post(`/paypal/orders/${orderId}/capture`);
      if (!captured?.success && !captured?.id) {
        throw new Error(captured?.message || 'Sandbox capture failed');
      }
      handlePayPalSuccess(captured.details || captured);
    } catch (err) {
      handlePayPalError(err);
      setProcessing(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <FaLock className="h-5 w-5 text-violet-700" />
        <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
      </div>

      {isSandbox && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <strong>PayPal sandbox</strong>
          {isMock
            ? ' — local mock checkout (no real charge). Use “Pay sandbox” to complete a test payment.'
            : ' — use a PayPal Sandbox buyer account from developer.paypal.com. No live money is taken.'}
        </div>
      )}

      <div className="rounded-lg bg-slate-50 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Description</span>
          <span className="font-medium text-right max-w-[60%] text-gray-900">{description}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-violet-700">${total.toFixed(2)}</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-3 block text-gray-800">Payment method</label>
        <label className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors">
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="h-4 w-4 text-violet-700"
          />
          <FaCreditCard className="h-5 w-5 text-gray-500" />
          <span>PayPal{isSandbox ? ' (Sandbox)' : ''}</span>
        </label>
      </div>

      {paymentMethod === 'paypal' && (
        <div className="pt-1">
          {configLoading ? (
            <p className="text-sm text-gray-600 text-center py-4">Loading payment…</p>
          ) : processing ? (
            <p className="text-sm text-gray-600 text-center py-4">Confirming payment…</p>
          ) : isMock ? (
            <button
              type="button"
              disabled={total <= 0}
              onClick={handleMockPay}
              className="w-full rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-semibold py-3.5 disabled:opacity-50"
            >
              Pay ${total.toFixed(2)} — Sandbox mock
            </button>
          ) : (
            <PayPalScriptProvider options={paypalOptions}>
              <PayPalButtons
                disabled={total <= 0}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => handlePayPalError(err)}
                onCancel={() => toast('Payment cancelled', { icon: 'ℹ️' })}
                style={{
                  layout: 'vertical',
                  color: 'blue',
                  shape: 'rect',
                  label: 'pay',
                }}
              />
            </PayPalScriptProvider>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentProcessor;
