import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPackageList } from "../slice/PackageSlice";
import { FaCheck, FaTimes, FaArrowLeft, FaCrown, FaStar, FaImage, FaEye, FaRocket } from "react-icons/fa";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

function Subscription({ data, postType, onSubmit, onBack }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const packageData = useSelector((store) => store.package.packageList);
  const packages = packageData?.data || [];

  useEffect(() => {
    dispatch(getPackageList());
  }, []);

  const getIconBasedOnValue = (value) => {
    return value === "yes" ? (
      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
        <FaCheck className="h-2 w-2 text-green-600" />
      </div>
    ) : (
      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
        <FaTimes className="h-2 w-2 text-red-600" />
      </div>
    );
  };

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showSummaryAndPayment, setShowSummaryAndPayment] = useState(false);
  const [amount, setAmount] = useState("0.00");

  // Placeholder for payment processing logic
  const handleFinish = () => {
    const price = Number(selectedPackage?.price) || 0;
    if (price === 0) {
      // update subscription selected
      onSubmit(selectedPackage);
      // navigate("/");
    } else {
      navigate("/");
    }
    // Implement payment processing logic here
    // You may need to handle the credit card details
  };
  const selectPackage = (card) => {
    const price = Number(card.price) || 0;
    const totalAmount = price + (price * 0.2);
    setAmount(totalAmount.toFixed(2));
    setSelectedPackage(card);

    setShowSummaryAndPayment(true);
  };

  const summaryAndPaymentContent = () => {
    if (!showSummaryAndPayment || !selectedPackage) return null;

    // Ensure price is a number
    const price = Number(selectedPackage.price) || 0;
    const tax = price * 0.2;
    const total = price + tax;

    return (
      <div className="max-w-2xl mx-auto mt-8">
        {/* Order Summary */}
        <div className="rounded-lg border bg-card shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Package: {selectedPackage.title}</span>
              <span className="font-medium">${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (VAT 20%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-lg text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-lg border bg-card shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Payment Method</h3>
          {price !== 0 ? (
            <PayPalScriptProvider
              options={{
                "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
              }}
            >
              <PayPalButtons
                key={amount}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: amount,
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  onSubmit(selectedPackage);
                }}
                onError={(err) => {
                  console.error("PayPal Checkout onError", err);
                }}
              />
            </PayPalScriptProvider>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">This package is free!</p>
              <button
                onClick={handleFinish}
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 text-sm font-medium transition-colors"
              >
                <FaCheck className="h-4 w-4" />
                Complete Order
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              onBack();
            }}
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
          >
            <FaArrowLeft className="h-4 w-4" />
            Back to Form
          </button>

          {price === 0 && (
            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 text-sm font-medium transition-colors"
            >
              <FaCheck className="h-4 w-4" />
              Complete Order
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Choose Your Package
            </h1>
            <p className="text-green-100 text-lg">
              Select the perfect plan to boost your ad's visibility and reach more customers
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Package Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8 pt-4">
          {packages.items?.map((card, index) => {
            const isSelected = selectedPackage === card;
            const isRecommended = card.recommended_sign === "yes";

            return (
              <div
                key={index}
                className={`relative rounded-lg border bg-card shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${isSelected ? "ring-2 ring-primary shadow-lg" : ""
                  } ${isRecommended ? "border-primary" : ""}`}
              >
                {/* Package Header */}
                <div className="p-6 text-center">
                  {/* Recommended Badge */}
                  {isRecommended && (
                    <div className="mb-4 -mt-2">
                      <div className="inline-flex bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium items-center gap-1 shadow-lg">
                        <FaCrown className="h-3 w-3" />
                        RECOMMENDED
                      </div>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {card.title}
                  </h3>
                  <div className="text-3xl font-bold text-primary mb-4">
                    ${card.price}
                    {card.price > 0 && <span className="text-sm text-muted-foreground">/listing</span>}
                  </div>
                </div>

                {/* Features List */}
                <div className="px-6 pb-6">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">{card.auto_renewal}</span>
                      </div>
                      <span className="text-muted-foreground">Auto renewals</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-yellow-600">{card.promo_days}</span>
                      </div>
                      <span className="text-muted-foreground">Featured days</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center">
                        <FaImage className="h-2 w-2 text-purple-600" />
                      </div>
                      <span className="text-muted-foreground">{card.pictures} pictures</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      {getIconBasedOnValue(card.promo_show_at_top)}
                      <span className="text-muted-foreground">Show featured label</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      {getIconBasedOnValue(card.promo_show_featured_area)}
                      <span className="text-muted-foreground">Show in featured areas</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      {getIconBasedOnValue(card.promo_show_promoted_area)}
                      <span className="text-muted-foreground">Show in promoted areas</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      {getIconBasedOnValue(card.promo_sign)}
                      <span className="text-muted-foreground">Priority featured ad</span>
                    </li>
                  </ul>
                </div>

                {/* Selection Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => selectPackage(card)}
                    className={`w-full rounded-md h-10 px-4 py-2 text-sm font-medium transition-colors ${isSelected
                      ? "bg-primary text-primary-foreground"
                      : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      }`}
                  >
                    {isSelected ? (
                      <span className="flex items-center justify-center gap-2">
                        <FaCheck className="h-3 w-3" />
                        Selected
                      </span>
                    ) : (
                      "Select Package"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary and Payment Section */}
        {summaryAndPaymentContent()}
      </div>
    </div>
  );
}

export default Subscription;
