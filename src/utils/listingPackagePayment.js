import { buildConfirmPaymentPayload } from './paymentDefence';

/**
 * Derive paid/promo flags + payment confirm fields from the package the seller selects.
 */
export function listingPayloadFromPackage(pkg, payment = null) {
  const price = Number(pkg?.price) || 0;
  const days = Number(
    pkg?.listing_days || pkg?.duration_days || pkg?.promo_days || (price > 0 ? 7 : 3)
  );
  const expires = new Date();
  expires.setDate(expires.getDate() + (Number.isFinite(days) && days > 0 ? days : 7));
  const iso = expires.toISOString();

  const title = String(pkg?.title || '');
  const isPromoted = pkg?.promo_show_promoted_area === 'yes' || /promot/i.test(title);
  const isFeatured = pkg?.promo_show_featured_area === 'yes' || pkg?.promo_show_at_top === 'yes' || /feature/i.test(title);
  const isSponsored = pkg?.promo_sign === 'yes' || /sponsor/i.test(title);
  const isPaid = price >= 0.01 || /paid/i.test(title);

  const payload = {
    package_id: pkg?.package_id ?? pkg?.id,
    package: pkg,
    is_paid: isPaid,
    is_promoted: isPromoted,
    is_sponsored: isSponsored,
    is_featured: isFeatured,
  };

  if (isPaid) payload.paid_expires_at = iso;
  if (isPromoted) payload.promoted_expires_at = iso;
  if (isSponsored) payload.sponsored_expires_at = iso;

  if (payment && price >= 0.01) {
    Object.assign(
      payload,
      buildConfirmPaymentPayload(payment, {
        paymentMethod: payment.paymentMethod || payment.payment_method || 'paypal',
      })
    );
  }

  return payload;
}

export function packageRequiresPayment(pkg) {
  return Number(pkg?.price) >= 0.01;
}
