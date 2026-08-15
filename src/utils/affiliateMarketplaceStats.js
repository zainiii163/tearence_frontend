/**
 * Marketplace display stats from live offer fields.
 * API returns: views, clicks, applications, commission_*, promotional_assets.
 * Gravity/EPC are derived only from those real counters (no invented conversion rates).
 */
export function enrichMarketplaceStats(offer = {}) {
  const existing =
    offer.marketplace_stats && typeof offer.marketplace_stats === 'object'
      ? { ...offer.marketplace_stats }
      : {};

  const clicks = Number(
    existing.clicks ?? offer.clicks ?? offer.clicks_count ?? offer.hop_clicks ?? 0
  );
  const conversions = Number(
    existing.conversions ??
      offer.conversions ??
      offer.conversions_count ??
      offer.sales_count ??
      0
  );
  const views = Number(existing.views ?? offer.views ?? offer.view_count ?? 0);
  const promoters = Number(
    existing.active_promoters ??
      existing.promoters ??
      offer.active_promoters_count ??
      offer.promoters_count ??
      offer.applications_count ??
      (typeof offer.applications === 'number' ? offer.applications : 0)
  );

  const commissionRate = Number(
    offer.commission_rate ?? existing.commission_rate ?? 0
  );
  const isFixed =
    offer.commission_type === 'fixed' ||
    String(offer.commission_type || '').toLowerCase() === 'fixed';

  const price = Number(offer.price ?? offer.product_price ?? 0);
  const avgSale = Number(
    existing.avg_earnings_per_sale ??
      existing.avg_sale ??
      offer.avg_sale_amount ??
      offer.average_sale ??
      (isFixed ? commissionRate : price > 0 ? price : 0)
  );

  const hasBackendGravity = Object.prototype.hasOwnProperty.call(
    existing,
    'gravity'
  );
  const hasBackendEpc = Object.prototype.hasOwnProperty.call(existing, 'epc');

  let gravity = Number(existing.gravity);
  if (!hasBackendGravity || !Number.isFinite(gravity)) {
    // Derived heat score from real index counters (ClickBank-style composite)
    const clickSignal = Math.log10(clicks + 1) * 14;
    const viewSignal = Math.log10(views + 1) * 7;
    const promoterSignal = promoters * 4.8;
    const conversionSignal = conversions * 9;
    const featuredBoost =
      (offer.is_featured || offer.featured ? 8 : 0) +
      (offer.is_promoted || offer.promoted ? 5 : 0) +
      (offer.is_verified ? 4 : 0);
    gravity = Math.max(
      0,
      Math.min(
        999,
        Math.round(
          clickSignal + viewSignal + promoterSignal + conversionSignal + featuredBoost
        )
      )
    );
  }

  let epc = Number(existing.epc);
  if (!hasBackendEpc || !Number.isFinite(epc) || epc < 0) {
    if (clicks > 0 && conversions > 0) {
      if (isFixed) {
        epc = (commissionRate * conversions) / clicks;
      } else if (avgSale > 0) {
        epc = (avgSale * (commissionRate / 100) * conversions) / clicks;
      } else {
        epc = 0;
      }
    } else {
      epc = 0;
    }
  }

  const cookieDays =
    existing.cookie_days ??
    offer.cookie_duration ??
    offer.cookie_days ??
    30;

  const commissionLabel =
    existing.commission_label ||
    (isFixed
      ? `$${Number(commissionRate).toFixed(2)}`
      : `${Number(commissionRate)}%`);

  const shopping =
    existing.shopping ||
    offer.shopping ||
    offer.shopping_activity ||
    null;

  return {
    ...offer,
    shopping: shopping || offer.shopping,
    marketplace_stats: {
      ...existing,
      gravity,
      epc: Number(Number(epc).toFixed(2)),
      avg_earnings_per_sale: Number(Number(avgSale).toFixed(2)),
      cookie_days: cookieDays,
      commission_label: commissionLabel,
      clicks,
      conversions,
      views,
      active_promoters: promoters,
      shopping: shopping || existing.shopping,
      _derived: !hasBackendGravity || !hasBackendEpc,
    },
  };
}

export function enrichOfferList(list = []) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => enrichMarketplaceStats(item));
}

export function normalizeEarningsPayload(raw) {
  const data = raw?.data || raw || {};
  const totals = data.totals || {};
  const conversions = Array.isArray(data.recent_conversions)
    ? data.recent_conversions
    : Array.isArray(data.conversions)
      ? data.conversions
      : [];
  const applications = Array.isArray(data.applications) ? data.applications : [];
  const payouts = Array.isArray(data.payouts)
    ? data.payouts
    : Array.isArray(data.payment_history)
      ? data.payment_history
      : [];

  const earned = Number(
    totals.earnings ?? totals.total_earnings ?? data.total_earnings ?? 0
  );
  const pending = Number(
    totals.pending ?? totals.pending_earnings ?? data.pending_earnings ?? 0
  );
  const paid = Number(
    totals.paid ??
      totals.paid_earnings ??
      data.paid_earnings ??
      Math.max(0, earned - pending)
  );
  const available = Number(
    totals.available ??
      totals.available_balance ??
      Math.max(0, earned - paid - pending)
  );

  const sales_volume = Number(
    totals.sales_volume ??
      conversions.reduce((s, r) => s + Number(r.sale_amount ?? r.amount ?? 0), 0)
  );

  return {
    totals: {
      programs: Number(
        totals.programs ??
          applications.filter((a) =>
            ['approved', 'active'].includes(String(a.status || '').toLowerCase())
          ).length
      ),
      clicks: Number(totals.clicks ?? 0),
      conversions: Number(totals.conversions ?? conversions.length),
      sales_volume,
      earnings: earned,
      pending,
      paid,
      available,
    },
    conversions,
    applications,
    payouts,
    source: data._source || 'api',
  };
}

export function resolveCreatives(offer = {}) {
  const assets = [];
  const push = (url, label = 'Creative') => {
    if (!url || typeof url !== 'string') return;
    const trimmed = url.trim();
    if (!trimmed) return;
    if (assets.some((a) => a.url === trimmed)) return;
    assets.push({ url: trimmed, label });
  };

  if (Array.isArray(offer.promotional_assets)) {
    offer.promotional_assets.forEach((item, i) => {
      if (typeof item === 'string') push(item, `Asset ${i + 1}`);
      else if (item?.url) push(item.url, item.label || `Asset ${i + 1}`);
      else if (item?.path) push(item.path, item.label || `Asset ${i + 1}`);
    });
  }

  push(offer.banner_url, 'Banner');
  push(offer.logo_url, 'Logo');
  push(offer.image_url, 'Image');
  push(offer.cover_image, 'Cover');
  if (Array.isArray(offer.images)) {
    offer.images.forEach((img, i) => {
      if (typeof img === 'string') push(img, `Image ${i + 1}`);
      else if (img?.url) push(img.url, `Image ${i + 1}`);
    });
  }

  return assets;
}
