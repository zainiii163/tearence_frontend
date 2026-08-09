import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";
import { FaCreditCard, FaLock, FaCheckCircle } from "react-icons/fa";
import { resolvePayPalClientId, isPayPalSandboxDemo } from "../../utils/paypalConfig";
import api from "../../api";

const PaymentProcessor = ({
  amount,
  description,
  onSuccess,
  onError,
  upsellType = "job",
  upsellId,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [processing, setProcessing] = useState(false);

  const clientId = resolvePayPalClientId();
  const sandboxDemo = isPayPalSandboxDemo();

  const paypalOptions = {
    "client-id": clientId,
    currency: "USD",
    intent: "capture",
  };

  const total = Number(amount) || 0;

  const handlePayPalSuccess = (details) => {
    setProcessing(true);
    if (onSuccess) {
      onSuccess({
        paymentId: details.id,
        paymentMethod: "paypal",
        amount: total,
        upsellType,
        upsellId,
        details,
      });
    }
    toast.success("Payment successful!");
    setProcessing(false);
  };

  const handlePayPalError = (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Payment failed. Please try again.";
    toast.error(message);
    if (onError) {
      onError(error);
    }
  };

  /** Server-side order create — required; client actions.order is deprecated/rejected. */
  const createOrder = async () => {
    const { data } = await api.post("/paypal/orders", {
      amount: total,
      currency: "USD",
      description: String(description || "Worldwide Adverts purchase").slice(0, 127),
      upsell_type: upsellType,
      upsell_id: upsellId != null ? String(upsellId) : undefined,
    });

    if (!data?.id) {
      throw new Error(data?.message || "PayPal did not return an order id");
    }
    return data.id;
  };

  /** Server-side capture after buyer approval. */
  const onApprove = async (data) => {
    setProcessing(true);
    try {
      const orderId = data.orderID || data.orderId;
      const { data: captured } = await api.post(`/paypal/orders/${orderId}/capture`);
      if (!captured?.success && !captured?.id) {
        throw new Error(captured?.message || "PayPal capture failed");
      }
      handlePayPalSuccess(captured.details || captured);
    } catch (err) {
      handlePayPalError(err);
      setProcessing(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FaLock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Secure Payment</h3>
      </div>

      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Description:</span>
          <span className="font-medium text-right max-w-[60%]">{description}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
        {sandboxDemo && (
          <p className="text-xs text-amber-700 pt-1">PayPal sandbox demo client</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium mb-3 block">Payment Method</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-primary"
            />
            <FaCreditCard className="h-5 w-5 text-muted-foreground" />
            <span>PayPal</span>
          </label>
        </div>
      </div>

      {paymentMethod === "paypal" && (
        <div className="pt-2">
          {processing ? (
            <p className="text-sm text-gray-600 text-center py-4">Confirming payment…</p>
          ) : (
            <PayPalScriptProvider options={paypalOptions}>
              <PayPalButtons
                disabled={total <= 0}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => {
                  handlePayPalError(err);
                }}
                onCancel={() => {
                  toast("Payment cancelled", { icon: "ℹ️" });
                }}
                style={{
                  layout: "vertical",
                  color: "blue",
                  shape: "rect",
                  label: "pay",
                }}
              />
            </PayPalScriptProvider>
          )}
        </div>
      )}

      <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/30 text-sm">
        <FaCheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium mb-1">Secure Payment</p>
          <p className="text-muted-foreground">
            Your payment is processed by PayPal. We never store your card details.
            Downloads and seller work unlock only after payment succeeds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessor;
