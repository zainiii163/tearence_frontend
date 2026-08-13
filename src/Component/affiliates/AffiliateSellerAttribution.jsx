import React, { useMemo, useState } from 'react';
import { FaCopy, FaRedo, FaCode } from 'react-icons/fa';
import toast from 'react-hot-toast';
import affiliateService from '../../services/AffiliateService';

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info/api/v1';

/**
 * Merchant attribution guide: manual Report sale + checkout postback.
 */
const AffiliateSellerAttribution = ({ offer, onTokenRotated }) => {
  const [open, setOpen] = useState(false);
  const [rotating, setRotating] = useState(false);

  const postbackUrl =
    offer?.postback_url || `${API_BASE.replace(/\/$/, '')}/affiliates/conversions/postback`;
  const token = offer?.postback_token || '';

  const curl = useMemo(() => {
    if (!token) return '';
    return `curl -X POST "${postbackUrl}" \\
  -H "Content-Type: application/json" \\
  -H "X-WWA-Postback-Token: ${token}" \\
  -d '{"tracking_code":"AFFILIATE_TRACKING_CODE","amount":49.99,"order_id":"ORDER-123","offer_id":${offer?.id}}'`;
  }, [postbackUrl, token, offer?.id]);

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error('Could not copy');
    }
  };

  const rotate = async () => {
    if (!window.confirm('Rotate this offer’s postback token? Update your checkout webhook after.')) {
      return;
    }
    setRotating(true);
    try {
      const res = await affiliateService.rotateOfferPostbackToken(offer.id);
      const next = res?.data || {};
      toast.success('Postback token rotated');
      onTokenRotated?.(offer.id, next);
    } catch (e) {
      toast.error(e?.message || 'Could not rotate token');
    } finally {
      setRotating(false);
    }
  };

  return (
    <div className="mt-3 rounded-lg border border-sky-100 bg-sky-50/50 p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="text-sm font-semibold text-sky-900 inline-flex items-center gap-2">
          <FaCode className="h-3.5 w-3.5" />
          Record conversions &amp; postback
        </span>
        <span className="text-xs font-medium text-sky-700">{open ? 'Hide' : 'Show'}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-3 text-sm text-slate-700">
          <ol className="list-decimal pl-4 space-y-1 text-xs sm:text-sm text-slate-600">
            <li>
              Affiliate shares their hop link → visitor clicks → cookie starts.
            </li>
            <li>
              When they buy on your site, either click <strong>Report sale</strong> here, or fire
              the postback from checkout.
            </li>
            <li>
              Pass the affiliate <code className="text-[11px] bg-white px-1 rounded border">tracking_code</code>{' '}
              from the hop URL (<code className="text-[11px] bg-white px-1 rounded border">?aff=</code>).
            </li>
          </ol>

          <div>
            <p className="text-xs font-semibold text-slate-800 mb-1">Postback URL</p>
            <div className="flex gap-2">
              <code className="flex-1 text-[11px] break-all rounded border border-slate-200 bg-white px-2 py-1.5">
                {postbackUrl}
              </code>
              <button
                type="button"
                onClick={() => copy(postbackUrl, 'URL')}
                className="shrink-0 rounded border border-slate-200 bg-white px-2 py-1 text-xs hover:bg-slate-50"
              >
                <FaCopy />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-slate-800">Offer postback token</p>
              <button
                type="button"
                disabled={rotating || !offer?.id}
                onClick={rotate}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 hover:underline disabled:opacity-50"
              >
                <FaRedo className={`h-2.5 w-2.5 ${rotating ? 'animate-spin' : ''}`} />
                Rotate
              </button>
            </div>
            <div className="flex gap-2">
              <code className="flex-1 text-[11px] break-all rounded border border-slate-200 bg-white px-2 py-1.5 font-mono">
                {token || 'Token will appear after refresh (run backend migrate)'}
              </code>
              <button
                type="button"
                disabled={!token}
                onClick={() => copy(token, 'Token')}
                className="shrink-0 rounded border border-slate-200 bg-white px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-40"
              >
                <FaCopy />
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Header: <code>X-WWA-Postback-Token</code> (or body field <code>postback_token</code>)
            </p>
          </div>

          {curl && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-slate-800">Sample curl</p>
                <button
                  type="button"
                  onClick={() => copy(curl, 'Curl')}
                  className="text-[11px] font-semibold text-sky-800 hover:underline"
                >
                  Copy
                </button>
              </div>
              <pre className="overflow-x-auto rounded border border-slate-200 bg-slate-900 text-slate-100 text-[10px] leading-relaxed p-2.5">
                {curl}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AffiliateSellerAttribution;
