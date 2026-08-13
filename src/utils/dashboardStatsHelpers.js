/** Sponsored advert display status (matches backend accessor) */
export function getSponsoredAdvertStatus(advert) {
  if (!advert) return 'pending';
  // Unpaid invoices always show as pending (even if a stale status string exists)
  if (isListingAwaitingPayment(advert)) return 'pending';
  if (advert.is_active === true || advert.is_active === 1) return 'active';
  if (advert.status) return advert.status;
  if (advert.payment_status === 'failed') return 'failed';
  return 'paused';
}

export function getSponsoredStatusClasses(status) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/** True when the listing is waiting for promotion / invoice payment */
export function isListingAwaitingPayment(item) {
  if (!item) return false;
  const pay = String(item.payment_status || '').toLowerCase();
  const status = String(item.status || '').toLowerCase();
  const promo = String(item.promotion_status || '').toLowerCase();

  if (pay === 'paid' || pay === 'completed') return false;
  if (pay === 'pending') return true;
  if (['pending', 'pending_payment'].includes(status)) return true;
  if (promo === 'pending') return true;
  return false;
}

export function getListingLifecycleStatus(item) {
  if (!item) return 'pending';
  if (isListingAwaitingPayment(item)) return 'pending';
  if (isActiveListing(item)) return 'active';
  if (String(item.status || '').toLowerCase() === 'expired') return 'expired';
  if (item.expires_at && new Date(item.expires_at) <= new Date()) return 'expired';
  return String(item.status || 'inactive').toLowerCase();
}

export function getListingLifecycleClasses(status) {
  switch (String(status || '').toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
    case 'pending_payment':
      return 'bg-yellow-100 text-yellow-800';
    case 'expired':
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function formatListingLifecycleLabel(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'pending' || s === 'pending_payment') return 'Pending';
  if (s === 'active') return 'Active';
  if (s === 'expired') return 'Expired';
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Unknown';
}

/** Whether a listing/advert counts as active across modules */
export function isActiveListing(item) {
  if (!item) return false;
  if (isListingAwaitingPayment(item)) return false;
  if (['active', 'approved', 'published'].includes(item.status)) return true;
  if (item.is_active === true || item.is_active === 1) return true;
  if (item.payment_status === 'paid' && item.is_active !== false) return true;
  return false;
}

export function getItemViews(item) {
  return Number(
    item?.views ?? item?.view_count ?? item?.views_count ?? item?.total_views ?? 0
  ) || 0;
}

export function getItemSaves(item) {
  return Number(
    item?.saves ?? item?.save_count ?? item?.saves_count ?? item?.favorites_count ?? 0
  ) || 0;
}

/** Sum totals across multiple user listing arrays */
export function aggregateListStats(lists = []) {
  const allItems = lists.flatMap((list) => (Array.isArray(list) ? list : []));

  return {
    totalPosts: allItems.length,
    activePosts: allItems.filter(isActiveListing).length,
    totalViews: allItems.reduce((sum, item) => sum + getItemViews(item), 0),
    totalSaves: allItems.reduce((sum, item) => sum + getItemSaves(item), 0),
  };
}

/** Map legacy /dashboard/user payload into overview stats */
export function statsFromLegacyDashboard(userDashboard) {
  if (!userDashboard) {
    return { totalPosts: 0, activePosts: 0, totalViews: 0, totalSaves: 0 };
  }

  const legacyStats = userDashboard.stats || {};
  const analytics = userDashboard.post_analytics_summary;

  let totalViews = 0;
  let totalSaves = 0;

  if (analytics && typeof analytics === 'object') {
    const rows = Array.isArray(analytics) ? analytics : Object.values(analytics);
    totalViews = rows.reduce((sum, row) => sum + Number(row?.total_views || 0), 0);
    totalSaves = rows.reduce(
      (sum, row) => sum + Number(row?.total_favorites || row?.total_saves || 0),
      0
    );
  }

  return {
    totalPosts: Number(legacyStats.total_listings || 0),
    activePosts: Number(legacyStats.active_listings || 0),
    totalViews,
    totalSaves,
  };
}

/** Merge module-wide stats with legacy dashboard (take higher counts) */
export function mergeOverviewStats(moduleStats, legacyStats) {
  return {
    totalPosts: Math.max(moduleStats.totalPosts, legacyStats.totalPosts),
    activePosts: Math.max(moduleStats.activePosts, legacyStats.activePosts),
    totalViews: Math.max(moduleStats.totalViews, legacyStats.totalViews),
    totalSaves: Math.max(moduleStats.totalSaves, legacyStats.totalSaves),
  };
}
