/**
 * Multi-format repost: share one advert's content across free / paid / featured /
 * sponsored / promoted / banner / affiliate create flows.
 */
export const REPOST_PREFILL_KEY = 'wwa_repost_prefill';
export const REPOST_QUEUE_KEY = 'wwa_repost_formats_queue';

export function readRepostPrefill(locationState) {
  const fromState = locationState?.repostPrefill;
  if (fromState && typeof fromState === 'object') return fromState;
  try {
    const raw = sessionStorage.getItem(REPOST_PREFILL_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeRepostPrefill(prefill, formatsQueue = []) {
  try {
    sessionStorage.setItem(REPOST_PREFILL_KEY, JSON.stringify(prefill || {}));
    sessionStorage.setItem(REPOST_QUEUE_KEY, JSON.stringify(formatsQueue || []));
  } catch {
    /* ignore */
  }
}

export function clearRepostPrefill() {
  try {
    sessionStorage.removeItem(REPOST_PREFILL_KEY);
    sessionStorage.removeItem(REPOST_QUEUE_KEY);
  } catch {
    /* ignore */
  }
}

export const REPOST_FORMAT_PATHS = {
  free: '/post-ad',
  paid: '/post-ad',
  featured: '/post-featured-advert',
  sponsored: '/post-promoted-ad',
  promoted: '/post-promoted-ad',
  banner: '/postbanner',
  affiliate: '/dashboard?tab=affiliates&mode=selling&create=true&sub=selling',
};

/**
 * After successfully posting one format, open the next selected format (if any).
 * @returns {{ done: boolean, nextPath?: string, remaining?: string[] }}
 */
export function advanceRepostQueue(completedFormatId) {
  let queue = [];
  try {
    queue = JSON.parse(sessionStorage.getItem(REPOST_QUEUE_KEY) || '[]');
  } catch {
    queue = [];
  }
  if (!Array.isArray(queue) || !queue.length) {
    clearRepostPrefill();
    return { done: true };
  }

  let remaining = queue;
  if (completedFormatId) {
    remaining = queue.filter((id) => id !== completedFormatId);
    // Also drop the first item if it matches the completed path we just finished
    if (remaining.length === queue.length && queue[0]) {
      remaining = queue.slice(1);
    }
  } else {
    remaining = queue.slice(1);
  }

  try {
    sessionStorage.setItem(REPOST_QUEUE_KEY, JSON.stringify(remaining));
  } catch {
    /* ignore */
  }

  if (!remaining.length) {
    clearRepostPrefill();
    return { done: true };
  }

  const nextId = remaining[0];
  const nextPath = REPOST_FORMAT_PATHS[nextId] || '/dashboard';
  return { done: false, nextPath, nextFormat: nextId, remaining };
}
