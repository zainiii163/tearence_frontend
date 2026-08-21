import { communitiesAPI } from '../api/communities';

/**
 * Resolve / create the Social Hub page for a business (Clive: business ↔ social).
 */
export async function getBusinessSocialPage(businessId) {
  if (!businessId) return null;
  try {
    const res = await communitiesAPI.getBusinessCommunity(businessId);
    // API shape: { success, data: community|null }
    const page = res && Object.prototype.hasOwnProperty.call(res, 'data') ? res.data : res;
    if (!page || typeof page !== 'object') return null;
    if (!page.slug && !page.community_id && !page.id && !page.social_href) return null;
    return page;
  } catch {
    return null;
  }
}

export async function ensureBusinessSocialPage(businessId) {
  if (!businessId) throw new Error('Missing business id');
  const res = await communitiesAPI.ensureBusinessCommunity(businessId);
  const page = res && Object.prototype.hasOwnProperty.call(res, 'data') ? res.data : res;
  if (!page || (!page.slug && !page.community_id && !page.id && !page.social_href)) {
    throw new Error(res?.message || 'Social Hub page was not created');
  }
  return page;
}

export function socialHrefForCommunity(community) {
  if (!community) return '/communities';
  if (typeof community.social_href === 'string' && community.social_href.includes('/community/') && !community.social_href.includes('undefined')) {
    return community.social_href;
  }
  const id = community.slug || community.community_id || community.id;
  if (!id || id === 'undefined' || id === 'null') return '/communities';
  return `/community/${id}`;
}

export function businessHrefFromCommunity(community) {
  const biz = community?.business;
  if (!biz) return null;
  return biz.href || `/business/${biz.slug || biz.id}`;
}
