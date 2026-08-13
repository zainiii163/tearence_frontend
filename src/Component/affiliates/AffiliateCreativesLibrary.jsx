import React, { useState } from 'react';
import { FaCopy, FaCheck, FaDownload, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';
import { resolveCreatives } from '../../utils/affiliateMarketplaceStats';

/**
 * ClickBank-style promotional creatives library for an offer.
 */
const AffiliateCreativesLibrary = ({ offer, hopLink = null }) => {
  const creatives = resolveCreatives(offer).map((c) => ({
    ...c,
    displayUrl: getStorageAssetUrl(c.url) || c.url,
  }));
  const [copiedId, setCopiedId] = useState(null);

  const copyText = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Copied');
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      toast.error('Could not copy');
    }
  };

  const htmlSnippet = (url) => {
    const href = hopLink || '#';
    return `<a href="${href}" target="_blank" rel="noopener"><img src="${url}" alt="${offer?.product_service_title || 'Offer'}" /></a>`;
  };

  if (!creatives.length && !hopLink) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
        <FaImage className="mx-auto h-6 w-6 text-slate-300 mb-2" />
        <p className="text-sm font-medium text-slate-700">No creatives uploaded yet</p>
        <p className="text-xs text-slate-500 mt-1">
          Sellers can add banners and images when listing a product or service.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Promotional creatives</h3>
          <p className="text-xs text-slate-500">
            Copy image URL or HTML with your hop link for ads and landing pages.
          </p>
        </div>
      </div>

      {hopLink && (
        <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-800 mb-1">
            Your hop link
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <code className="flex-1 min-w-0 text-xs break-all text-slate-700">{hopLink}</code>
            <button
              type="button"
              onClick={() => copyText(hopLink, 'hop')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-white"
            >
              {copiedId === 'hop' ? <FaCheck className="h-3 w-3" /> : <FaCopy className="h-3 w-3" />}
              Copy hop
            </button>
          </div>
        </div>
      )}

      {creatives.length === 0 ? (
        <p className="text-xs text-slate-500">No image assets on this offer yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {creatives.map((c, idx) => (
            <div
              key={`${c.url}-${idx}`}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-soft"
            >
              <div className="aspect-[16/9] bg-slate-100">
                <img
                  src={c.displayUrl}
                  alt={c.label}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-800">{c.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyText(c.displayUrl, `url-${idx}`)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {copiedId === `url-${idx}` ? <FaCheck className="h-2.5 w-2.5" /> : <FaCopy className="h-2.5 w-2.5" />}
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(htmlSnippet(c.displayUrl), `html-${idx}`)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {copiedId === `html-${idx}` ? <FaCheck className="h-2.5 w-2.5" /> : <FaCopy className="h-2.5 w-2.5" />}
                    HTML
                  </button>
                  <a
                    href={c.displayUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <FaDownload className="h-2.5 w-2.5" />
                    Open
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AffiliateCreativesLibrary;
