import { communitiesAPI } from '../api/communities';

/**
 * Resolve / create the Social Hub page for a business (Clive: business ↔ social).
 */
export async function getBusinessSocialPage(businessId) {
  if (!businessId) return null;
  try {
    const res = await communitiesAPI.getBusinessCommunity(businessId);
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
  if (
    typeof community.social_href === 'string' &&
    community.social_href.includes('/community/') &&
    !community.social_href.includes('undefined')
  ) {
    return community.social_href;
  }
  const id = community.slug || community.community_id || community.id;
  if (!id || id === 'undefined' || id === 'null') return '/communities';
  return `/community/${id}`;
}

/** Ensure http(s) URL for external links */
export function normalizeHttpUrl(raw) {
  const value = String(raw || '').trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  return `https://${value}`;
}

/** Digits-only WhatsApp id for wa.me links */
export function normalizeWhatsAppNumber(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  return digits.length >= 8 ? digits : null;
}

export function whatsappHref(raw) {
  if (!raw) return null;
  const asUrl = String(raw).trim();
  if (/^https?:\/\//i.test(asUrl)) return asUrl;
  const digits = normalizeWhatsAppNumber(asUrl);
  return digits ? `https://wa.me/${digits}` : null;
}

const PLATFORM_META = {
  wwa_hub: { label: 'WWA Social Hub', icon: 'hub' },
  website: { label: 'Website', icon: 'globe' },
  facebook: { label: 'Facebook', icon: 'facebook' },
  instagram: { label: 'Instagram', icon: 'instagram' },
  linkedin: { label: 'LinkedIn', icon: 'linkedin' },
  twitter: { label: 'X / Twitter', icon: 'twitter' },
  youtube: { label: 'YouTube', icon: 'youtube' },
  tiktok: { label: 'TikTok', icon: 'tiktok' },
  whatsapp: { label: 'WhatsApp', icon: 'whatsapp' },
  custom: { label: 'Other site', icon: 'link' },
};

export function platformMeta(platform) {
  return PLATFORM_META[platform] || PLATFORM_META.custom;
}

function profileOf(business) {
  return business?.profile || business?.category_profile || {};
}

/**
 * Collect social links: WWA Social Hub + profile.social_links + website.
 * Other WWA properties (e.g. carservicesltd.com) are custom/website rows.
 */
export function collectBusinessSocialLinks(business, hubCommunity = null) {
  const profile = profileOf(business);
  const links = [];
  const seen = new Set();

  const push = (entry) => {
    if (!entry?.url && entry?.platform !== 'wwa_hub') return;
    const key = `${entry.platform}:${entry.url || entry.label}`;
    if (seen.has(key)) return;
    seen.add(key);
    links.push(entry);
  };

  if (hubCommunity) {
    const href = socialHrefForCommunity(hubCommunity);
    if (href && href !== '/communities') {
      push({
        platform: 'wwa_hub',
        label: hubCommunity.name || 'WWA Social Hub',
        url: href,
        internal: true,
      });
    }
  }

  const rawList = Array.isArray(profile.social_links)
    ? profile.social_links
    : Array.isArray(business?.social_links)
      ? business.social_links
      : [];

  rawList.forEach((item) => {
    if (!item) return;
    if (typeof item === 'string') {
      const url = normalizeHttpUrl(item);
      if (url) push({ platform: 'custom', label: 'Website', url });
      return;
    }
    const platform = String(item.platform || 'custom').toLowerCase();
    if (platform === 'wwa_hub') return;
    const url =
      platform === 'whatsapp'
        ? whatsappHref(item.url || item.value || item.phone)
        : normalizeHttpUrl(item.url || item.href || item.value);
    if (!url) return;
    push({
      platform,
      label: item.label || platformMeta(platform).label,
      url,
      internal: Boolean(item.internal),
    });
  });

  ['facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'tiktok'].forEach((platform) => {
    const raw = profile[platform] || business?.[platform] || profile.social?.[platform];
    const url = normalizeHttpUrl(raw);
    if (url) push({ platform, label: platformMeta(platform).label, url });
  });

  const website = normalizeHttpUrl(business?.business_website || profile.website);
  if (website) {
    push({ platform: 'website', label: 'Website', url: website });
  }

  return links;
}

export function resolveBusinessContactActions(business, hubCommunity = null) {
  const profile = profileOf(business);
  const phone =
    profile.booking_phone ||
    business?.booking_phone ||
    business?.business_phone_number ||
    business?.personal_phone_number ||
    null;
  const email = business?.business_email || business?.personal_email || null;
  // Prefer dedicated booking URL — do not silently treat website as "Book"
  const bookingUrl = normalizeHttpUrl(
    profile.booking_url || business?.booking_url || null
  );
  const whatsapp = whatsappHref(
    profile.whatsapp || business?.whatsapp || profile.whatsapp_number || null
  );

  return {
    bookingUrl,
    phone,
    email,
    whatsapp,
    socialLinks: collectBusinessSocialLinks(business, hubCommunity),
  };
}

export function businessHrefFromCommunity(community) {
  const biz = community?.business;
  if (!biz) {
    const fallbackId = community?.business_id;
    return fallbackId ? `/business/${fallbackId}` : null;
  }
  const key = biz.id || biz.slug;
  if (!key) return null;
  return biz.href?.includes('/business/') && biz.id
    ? `/business/${biz.id}`
    : `/business/${key}`;
}
