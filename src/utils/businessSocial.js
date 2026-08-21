import { communitiesAPI } from '../api/communities';

/**
 * Resolve / create the Social Hub page for a business (Clive: business ↔ social).
 */
export async function getBusinessSocialPage(businessId) {
  if (!businessId) return null;
  try {
    const res = await communitiesAPI.getBusinessCommunity(businessId);
    return res?.data ?? res ?? null;
  } catch {
    return null;
  }
}

export async function ensureBusinessSocialPage(businessId) {
  if (!businessId) throw new Error('Missing business id');
  const res = await communitiesAPI.ensureBusinessCommunity(businessId);
  return res?.data ?? res;
}

export function socialHrefForCommunity(community) {
  if (!community) return '/communities';
  const id = community.slug || community.community_id || community.id;
  return community.social_href || `/community/${id}`;
}

export function businessHrefFromCommunity(community) {
  const biz = community?.business;
  if (!biz) return null;
  return biz.href || `/business/${biz.slug || biz.id}`;
}
