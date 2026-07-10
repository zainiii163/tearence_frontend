/** Sponsored advert display status (matches backend accessor) */
export function getSponsoredAdvertStatus(advert) {
  if (!advert) return 'pending';
  if (advert.status) return advert.status;
  if (advert.is_active === true || advert.is_active === 1) return 'active';
  if (advert.payment_status === 'pending') return 'pending';
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

/** Whether a listing/advert counts as active across modules */
export function isActiveListing(item) {
  if (!item) return false;
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
