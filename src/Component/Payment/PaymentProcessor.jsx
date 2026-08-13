import React, { useEffect, useRef, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';
import { FaCreditCard, FaLock, FaCoins } from 'react-icons/fa';
import { fetchPayPalConfig, resolvePayPalClientId } from '../../utils/paypalConfig';
import { fetchCryptoConfig } from '../../utils/cryptoConfig';
import { assertValidPaymentAmount, assertValidPaymentId } from '../../utils/paymentDefence';
import {
  CRYPTO_PROVIDER,
  NETWORK_MISMATCH_WARNING,
  explorerUrlFor,
  extractTxHash,
  getPayCurrencyMeta,
  isCompletedCryptoStatus,
  labelPayCurrency,
  preferPhase1Currencies,
} from '../../utils/cryptoRails';
import api from '../../api';

/**
 * Site-wide checkout — PayPal + Crypto for every product that uses this component.
 */
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
  const [cryptoConfig, setCryptoConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [payCurrency, setPayCurrency] = useState('usdttrc20');
  const [cryptoInvoice, setCryptoInvoice] = useState(null);
  const [cryptoPolling, setCryptoPolling] = useState(false);
  const cryptoSettledRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setConfigLoading(true);
    Promise.all([fetchPayPalConfig(), fetchCryptoConfig()])
      .then(([pp, crypto]) => {
        if (cancelled) return;
        setPaypalConfig(pp);
        setCryptoConfig(crypto);
        const list = preferPhase1Currencies(crypto?.pay_currencies);
        if (list.length) {
          setPayCurrency(list[0]);
        } else if (crypto?.settle_currency) {
          setPayCurrency(String(crypto.settle_currency).toLowerCase());
        }
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
  const cryptoEnabled = Boolean(cryptoConfig?.enabled);
  const cryptoMock = Boolean(cryptoConfig?.mock);
  const payCurrencies = preferPhase1Currencies(cryptoConfig?.pay_currencies);
  const payMeta = getPayCurrencyMeta(payCurrency);

  const paypalOptions = {
    'client-id': clientId,
    currency: paypalConfig?.currency || 'USD',
    intent: 'capture',
  };

  const finishSuccess = ({ paymentId, method, details, mock }) => {
    const id = assertValidPaymentId(paymentId);
    assertValidPaymentAmount(total);
    if (method === 'crypto') {
      cryptoSettledRef.current = true;
    }
    const txHash = extractTxHash(details);
    if (onSuccess) {
      onSuccess({
        paymentId: id,
        paymentMethod: method,
        amount: total,
        upsellType,
        upsellId,
        details,
        mock: Boolean(mock),
        provider: method === 'crypto' ? CRYPTO_PROVIDER : 'paypal',
        currency: method === 'crypto' ? payMeta.currency : 'USD',
        network: method === 'crypto' ? payMeta.network : undefined,
        pay_currency: method === 'crypto' ? payCurrency : undefined,
        tx_hash: txHash || undefined,
        provider_invoice_id: method === 'crypto' ? id : undefined,
      });
    }
    toast.success(
      mock
        ? method === 'crypto'
          ? 'Crypto mock payment successful!'
          : 'Sandbox mock payment successful!'
        : 'Payment successful!'
    );
  };

  const handlePayPalSuccess = (details) => {
    setProcessing(true);
    try {
      const paymentId =
        details?.id ||
        details?.orderID ||
        details?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
      finishSuccess({
        paymentId,
        method: 'paypal',
        details,
        mock: Boolean(details?.mock || isMock),
      });
    } catch (err) {
      handleError(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleError = (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Payment failed. Please try again.';
    toast.error(message);
    if (onError) onError(error);
  };

  const createOrder = async () => {
    const safeAmount = assertValidPaymentAmount(total, 'Checkout');
    const { data } = await api.post('/paypal/orders', {
      amount: safeAmount,
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
      handleError(err);
      setProcessing(false);
    }
  };

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
      handleError(err);
      setProcessing(false);
    }
  };

  const createCryptoInvoice = async () => {
    setProcessing(true);
    setCryptoInvoice(null);
    try {
      const safeAmount = assertValidPaymentAmount(total, 'Checkout');
      const { data } = await api.post('/crypto/invoices', {
        amount: safeAmount,
        currency: cryptoConfig?.currency || 'USD',
        pay_currency: payCurrency,
        description: String(description || 'Worldwide Adverts purchase').slice(0, 200),
        upsell_type: upsellType,
        upsell_id: upsellId != null ? String(upsellId) : undefined,
      });
      if (!data?.payment_id && !data?.id) {
        throw new Error(data?.message || 'Could not create crypto invoice');
      }
      cryptoSettledRef.current = false;
      setCryptoInvoice(data);
      toast.success(data.mock ? 'Mock crypto invoice ready' : 'Crypto invoice created');
    } catch (err) {
      handleError(err);
    } finally {
      setProcessing(false);
    }
  };

  const confirmCryptoMock = async () => {
    if (!cryptoInvoice?.payment_id && !cryptoInvoice?.id) return;
    const id = cryptoInvoice.payment_id || cryptoInvoice.id;
    setProcessing(true);
    try {
      const { data } = await api.post(`/crypto/invoices/${id}/confirm-mock`);
      if (!data?.success && !data?.id) {
        throw new Error(data?.message || 'Crypto mock confirm failed');
      }
      finishSuccess({
        paymentId: data.id || id,
        method: 'crypto',
        details: data.details || data,
        mock: true,
      });
    } catch (err) {
      handleError(err);
    } finally {
      setProcessing(false);
    }
  };

  const checkCryptoStatus = async ({ silent = false } = {}) => {
    if (!cryptoInvoice?.payment_id && !cryptoInvoice?.id) return false;
    if (cryptoSettledRef.current) return true;
    const id = cryptoInvoice.payment_id || cryptoInvoice.id;
    setCryptoPolling(true);
    try {
      const { data } = await api.get(`/crypto/invoices/${id}`);
      if (data?.completed || isCompletedCryptoStatus(data?.status)) {
        finishSuccess({
          paymentId: id,
          method: 'crypto',
          details: data,
          mock: Boolean(cryptoInvoice.mock),
        });
        return true;
      }
      if (!silent) {
        toast('Payment not confirmed yet — wait for network confirmation.', { icon: '⏳' });
      }
      return false;
    } catch (err) {
      if (!silent) handleError(err);
      return false;
    } finally {
      setCryptoPolling(false);
    }
  };

  useEffect(() => {
    if (!cryptoInvoice || cryptoInvoice.mock || cryptoSettledRef.current) return undefined;
    const id = cryptoInvoice.payment_id || cryptoInvoice.id;
    if (!id) return undefined;
    const timer = setInterval(() => {
      checkCryptoStatus({ silent: true });
    }, 8000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cryptoInvoice]);

  return (
    <div className="rounded-lg border bg-white p-6 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <FaLock className="h-5 w-5 text-violet-700" />
        <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
      </div>

      {paymentMethod === 'paypal' && isSandbox && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <strong>PayPal sandbox</strong>
          {isMock
            ? ' — local mock checkout (no real charge). Use “Pay sandbox” to complete a test payment.'
            : ' — use a PayPal Sandbox buyer account from developer.paypal.com. No live money is taken.'}
        </div>
      )}

      {paymentMethod === 'crypto' && cryptoMock && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <strong>Crypto mock mode</strong> — no real on-chain transfer. Create an invoice, then confirm
          mock payment. Set <code>NOWPAYMENTS_API_KEY</code> for live crypto.
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
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setCryptoInvoice(null);
              }}
              className="h-4 w-4 text-violet-700"
            />
            <FaCreditCard className="h-5 w-5 text-gray-500" />
            <span>PayPal{isSandbox ? ' (Sandbox)' : ''}</span>
          </label>

          {cryptoEnabled && (
            <label className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="crypto"
                checked={paymentMethod === 'crypto'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 text-violet-700"
              />
              <FaCoins className="h-5 w-5 text-amber-600" />
              <span>
                Crypto (USDT / USDC)
                {cryptoMock ? ' — Mock' : ''}
              </span>
            </label>
          )}
        </div>
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
                onError={(err) => handleError(err)}
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

      {paymentMethod === 'crypto' && cryptoEnabled && (
        <div className="pt-1 space-y-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
            {NETWORK_MISMATCH_WARNING}
          </div>
          <label className="block text-sm">
            <span className="font-medium text-gray-800">Pay with</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={payCurrency}
              onChange={(e) => {
                setPayCurrency(e.target.value);
                setCryptoInvoice(null);
                cryptoSettledRef.current = false;
              }}
              disabled={processing}
            >
              {payCurrencies.map((c) => (
                <option key={c} value={c}>
                  {labelPayCurrency(c)}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-[11px] text-slate-500">
              Network: <strong>{payMeta.network}</strong> · {payMeta.addressHint}
            </span>
          </label>

          {!cryptoInvoice ? (
            <button
              type="button"
              disabled={total <= 0 || processing || configLoading}
              onClick={createCryptoInvoice}
              className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3.5 disabled:opacity-50"
            >
              {processing ? 'Creating invoice…' : `Pay $${total.toFixed(2)} with crypto`}
            </button>
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 space-y-3 text-sm">
              <p className="font-semibold text-slate-900">Send payment</p>
              <p className="text-xs text-slate-700">
                Send <strong>only</strong> {payMeta.label} on the <strong>{payMeta.network}</strong> network.
              </p>
              {cryptoInvoice.pay_address && (
                <div>
                  <p className="text-xs text-slate-600 mb-1">Address</p>
                  <code className="block break-all rounded bg-white border px-2 py-1.5 text-[11px]">
                    {cryptoInvoice.pay_address}
                  </code>
                </div>
              )}
              <div className="flex flex-wrap gap-3 text-xs text-slate-700">
                {cryptoInvoice.pay_amount != null && (
                  <span>
                    Amount:{' '}
                    <strong>
                      {cryptoInvoice.pay_amount}{' '}
                      {(cryptoInvoice.pay_currency || payCurrency).toUpperCase()}
                    </strong>
                  </span>
                )}
                <span>
                  Network: <strong>{payMeta.network}</strong>
                </span>
                <span>
                  Ref: <strong>{cryptoInvoice.payment_id || cryptoInvoice.id}</strong>
                </span>
              </div>
              {extractTxHash(cryptoInvoice) ? (
                <p className="text-xs break-all text-slate-700">
                  Tx:{' '}
                  {explorerUrlFor(payCurrency, extractTxHash(cryptoInvoice)) ? (
                    <a
                      href={explorerUrlFor(payCurrency, extractTxHash(cryptoInvoice))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-amber-800 hover:underline"
                    >
                      {extractTxHash(cryptoInvoice)}
                    </a>
                  ) : (
                    <code>{extractTxHash(cryptoInvoice)}</code>
                  )}
                </p>
              ) : null}
              {cryptoInvoice.invoice_url && (
                <a
                  href={cryptoInvoice.invoice_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm font-semibold text-amber-800 hover:underline"
                >
                  Open payment page →
                </a>
              )}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                {cryptoInvoice.mock ? (
                  <button
                    type="button"
                    disabled={processing}
                    onClick={confirmCryptoMock}
                    className="flex-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 disabled:opacity-50"
                  >
                    {processing ? 'Confirming…' : 'Confirm mock payment'}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={cryptoPolling || processing}
                    onClick={() => checkCryptoStatus({ silent: false })}
                    className="flex-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 disabled:opacity-50"
                  >
                    {cryptoPolling ? 'Checking…' : 'Check payment status'}
                  </button>
                )}
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => {
                    setCryptoInvoice(null);
                    cryptoSettledRef.current = false;
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700"
                >
                  Cancel
                </button>
              </div>
              {!cryptoInvoice.mock && (
                <p className="text-[11px] text-slate-500">
                  Status is confirmed by NOWPayments (webhook / invoice poll), not by this button alone.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentProcessor;
