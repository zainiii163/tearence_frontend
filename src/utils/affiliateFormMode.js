/** Normalize affiliate post-form mode query values (promoter → user). */
export function normalizeAffiliateFormMode(mode) {
  const m = String(mode || '').toLowerCase();
  if (m === 'promoter' || m === 'promoting' || m === 'links') return 'user';
  if (m === 'business' || m === 'merchant' || m === 'seller') return 'business';
  if (m === 'user') return 'user';
  return null;
}

export default normalizeAffiliateFormMode;
