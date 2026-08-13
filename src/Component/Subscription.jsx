import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPackageList } from "../slice/PackageSlice";
import { FaCheck, FaTimes, FaArrowLeft, FaCrown, FaImage } from "react-icons/fa";
import toast from "react-hot-toast";
import AuthenticCheckoutModal from "./Payment/AuthenticCheckoutModal";
import { assertValidPaymentAmount } from "../utils/paymentDefence";
import { packageRequiresPayment } from "../utils/listingPackagePayment";

/**
 * Seller selects a listing package (free / paid / featured / promoted / sponsored).
 * Paid packages must complete AuthenticCheckout before onSubmit runs.
 */
function Subscription({ data, postType = "ads", onSubmit, onBack }) {
  const dispatch = useDispatch();
  const packageData = useSelector((store) => store.package.packageList);
  const packages = packageData?.data || {};

  useEffect(() => {
    dispatch(getPackageList());
  }, [dispatch]);

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
  const [showSummary, setShowSummary] = useState(false);
  const [checkout, setCheckout] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const selectPackage = (card) => {
    setSelectedPackage(card);
    setShowSummary(true);
  };

  const finishWithPackage = async (pkg, payment = null) => {
    if (!pkg || submitting) return;
    setSubmitting(true);
    try {
      await Promise.resolve(onSubmit(pkg, payment));
    } catch (err) {
      toast.error(err?.message || "Could not complete posting");
      setSubmitting(false);
      throw err;
    }
  };

  const handleContinue = async () => {
    if (!selectedPackage) {
      toast.error("Select a package first");
      return;
    }
    const price = Number(selectedPackage.price) || 0;
    if (!packageRequiresPayment(selectedPackage)) {
      await finishWithPackage(selectedPackage, null);
      return;
    }
    try {
      const amount = assertValidPaymentAmount(price, "Listing package");
      setCheckout({
        amount,
        package: selectedPackage,
        description: `${selectedPackage.title || "Listing package"} — ${postType}`,
      });
    } catch (err) {
      toast.error(err?.message || "Invalid package price");
    }
  };

  const handleCheckoutSuccess = async (payment) => {
    if (!checkout?.package) return;
    try {
      await finishWithPackage(checkout.package, payment);
      setCheckout(null);
    } catch {
      // keep checkout open so seller can retry / support can see error toast
    }
  };

  const price = Number(selectedPackage?.price) || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="page-container">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Choose Your Package</h1>
            <p className="text-green-100 text-lg">
              Select what you want to pay for — free, paid, featured, promoted or sponsored.
              Paid packages require checkout before your ad goes live with that plan.
            </p>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8 pt-4">
          {(packages.items || []).map((card, index) => {
            const isSelected = selectedPackage?.package_id === card.package_id;
            const isRecommended = card.recommended_sign === "yes";

            return (
              <div
                key={card.package_id || index}
                className={`relative rounded-lg border bg-card shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${
                  isSelected ? "ring-2 ring-primary shadow-lg" : ""
                } ${isRecommended ? "border-primary" : ""}`}
              >
                <div className="p-6 text-center">
                  {isRecommended && (
                    <div className="mb-4 -mt-2">
                      <div className="inline-flex bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium items-center gap-1 shadow-lg">
                        <FaCrown className="h-3 w-3" />
                        RECOMMENDED
                      </div>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
                  <div className="text-3xl font-bold text-primary mb-4">
                    ${card.price}
                    {Number(card.price) > 0 && (
                      <span className="text-sm text-muted-foreground">/listing</span>
                    )}
                  </div>
                </div>

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

                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => selectPackage(card)}
                    className={`w-full rounded-md h-10 px-4 py-2 text-sm font-medium transition-colors ${
                      isSelected
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

        {showSummary && selectedPackage && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="rounded-lg border bg-card shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Package: {selectedPackage.title}
                  </span>
                  <span className="font-medium">${price.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total due now</span>
                    <span className="font-bold text-lg text-primary">${price.toFixed(2)}</span>
                  </div>
                </div>
                {price > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    You will pay this amount with PayPal or Crypto. Your ad only gets this package
                    after payment is verified.
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Free package — no payment required. Your ad posts with the free plan limits.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onBack?.()}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
              >
                <FaArrowLeft className="h-4 w-4" />
                Back to Form
              </button>

              <button
                type="button"
                onClick={handleContinue}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <FaCheck className="h-4 w-4" />
                {submitting
                  ? "Posting…"
                  : price > 0
                    ? "Continue to checkout"
                    : "Post free ad"}
              </button>
            </div>
          </div>
        )}

        {!showSummary && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onBack?.()}
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium"
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Form
            </button>
          </div>
        )}
      </div>

      <AuthenticCheckoutModal
        open={Boolean(checkout)}
        onClose={() => !submitting && setCheckout(null)}
        title={checkout ? `Pay: ${checkout.package?.title}` : "Secure checkout"}
        description={
          checkout
            ? `Pay $${Number(checkout.amount).toFixed(2)} for the ${checkout.package?.title} package selected on your post.`
            : ""
        }
        amount={checkout?.amount || 0}
        upsellType={postType || "listing_package"}
        upsellId={checkout?.package?.package_id}
        onSuccess={handleCheckoutSuccess}
        onError={() => toast.error("Payment failed — try again")}
        footerNote="Your selected package activates only after payment is verified."
      />
    </div>
  );
}

export default Subscription;
