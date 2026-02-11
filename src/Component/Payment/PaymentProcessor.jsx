import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";
import { FaCreditCard, FaLock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const PaymentProcessor = ({ 
  amount, 
  description, 
  onSuccess, 
  onError,
  upsellType = "job", // 'job' or 'candidate'
  upsellId,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [processing, setProcessing] = useState(false);

  // Get PayPal Client ID from environment variables
  const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const isPayPalConfigured = paypalClientId && paypalClientId !== "YOUR_PAYPAL_CLIENT_ID" && paypalClientId.trim() !== "";

  const paypalOptions = {
    "client-id": isPayPalConfigured ? paypalClientId : "sb", // Use sandbox test ID as fallback for development
    currency: "USD",
  };

  const handlePayPalSuccess = (details) => {
    setProcessing(true);
    // Process payment success
    if (onSuccess) {
      onSuccess({
        paymentId: details.id,
        paymentMethod: "paypal",
        amount: amount,
        upsellType,
        upsellId,
      });
    }
    toast.success("Payment successful!");
    setProcessing(false);
  };

  const handlePayPalError = (error) => {
    toast.error("Payment failed. Please try again.");
    if (onError) {
      onError(error);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FaLock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Secure Payment</h3>
      </div>

      {/* Payment Summary */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Description:</span>
          <span className="font-medium">{description}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary">${amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
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
          {/* Add more payment methods here if needed */}
        </div>
      </div>

      {/* PayPal Payment Button */}
      {paymentMethod === "paypal" && (
        <div className="pt-4">
          {isPayPalConfigured ? (
            <PayPalScriptProvider options={paypalOptions}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: amount.toFixed(2),
                          currency_code: "USD",
                        },
                        description: description,
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    handlePayPalSuccess(details);
                  });
                }}
                onError={(err) => {
                  handlePayPalError(err);
                }}
                style={{
                  layout: "vertical",
                  color: "blue",
                  shape: "rect",
                  label: "paypal",
                }}
              />
            </PayPalScriptProvider>
          ) : (
            // Hidden in development - allow form submission without payment
            null
          )}
        </div>
      )}

      {/* Security Notice */}
      <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/30 text-sm">
        <FaCheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium mb-1">Secure Payment</p>
          <p className="text-muted-foreground">
            Your payment information is encrypted and secure. We never store your credit card details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessor;

