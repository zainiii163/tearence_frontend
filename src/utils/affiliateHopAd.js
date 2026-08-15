const PREFILL_KEY = 'wwa_affiliate_ad_prefill';

export function resolveHopUrl(application = {}) {
  if (!application || typeof application !== 'object') return null;
  return (
    application.hop_url ||
    application.promoter_link ||
    application.tracking_url ||
    application.hop_link ||
    application.affiliate_link ||
    (application.tracking_code
      ? `https://api.worldwideadverts.info/go/aff/${application.tracking_code}`
      : null)
  );
}

export function stashHopAsAd({ hop, title, description, offerId } = {}) {
  if (!hop || typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(
      PREFILL_KEY,
      JSON.stringify({
        hop,
        title: title || '',
        description: description || '',
        offerId: offerId || null,
        at: Date.now(),
      })
    );
  } catch {
    /* ignore quota */
  }
}

export function peekHopAsAdPrefill() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(PREFILL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.hop ? parsed : null;
  } catch {
    return null;
  }
}

export function consumeHopAsAdPrefill() {
  const parsed = peekHopAsAdPrefill();
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(PREFILL_KEY);
    } catch {
      /* ignore */
    }
  }
  return parsed;
}

export function affiliateAdPostPath() {
  return '/affiliates?postForm=true&mode=user';
}
