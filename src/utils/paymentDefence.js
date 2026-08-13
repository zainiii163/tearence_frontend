/**
 * Client-side payment defence helpers (pairs with server PaymentVerificationService).
 * Never treat UI success as paid until the API confirm returns success.
 */

const FAKE_PAYMENT_IDS = new Set([
  'paid',
  'free',
  'test',
  'success',
  'ok',
  'true',
  '1',
  'dummy',
  'fake',
]);

export function assertValidPaymentAmount(amount, label = 'Payment') {
  const n = Number(amount);
  if (!Number.isFinite(n) || n < 0.01) {
    throw new Error(`${label} amount is invalid.`);
  }
  if (n > 100000) {
    throw new Error(`${label} amount is too large.`);
  }
  return Math.round(n * 100) / 100;
}

export function assertValidPaymentId(paymentId) {
  const id = String(paymentId || '').trim();
  if (id.length < 6) {
    throw new Error('Missing payment reference.');
  }
  if (FAKE_PAYMENT_IDS.has(id.toLowerCase())) {
    throw new Error('Invalid payment reference.');
  }
  return id;
}

/**
 * Build confirm-payment payload after PayPal capture or crypto invoice completion.
 */
export function buildConfirmPaymentPayload(captureResult, { paymentMethod = 'paypal' } = {}) {
  const paymentId = assertValidPaymentId(
    captureResult?.paymentId ||
      captureResult?.id ||
      captureResult?.orderID ||
      captureResult?.purchase_units?.[0]?.payments?.captures?.[0]?.id
  );
  return {
    payment_id: paymentId,
    payment_reference: paymentId,
    payment_transaction_id: paymentId,
    transaction_id: paymentId,
    payment_method: paymentMethod,
  };
}

export default {
  assertValidPaymentAmount,
  assertValidPaymentId,
  buildConfirmPaymentPayload,
};
