import React, { useMemo, useState } from 'react';
import { FiChevronDown, FiExternalLink } from 'react-icons/fi';
import moment from 'moment';
import EbayAdsData from '../../data/ebay.json';

/**
 * Compact eBay partner drawer — exactly 2 rows of cards when open.
 * Clive: keep partner content available without dominating Buy & Sell.
 */
const EbayAdsDrawer = ({ defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  const items = useMemo(() => {
    const list = Array.isArray(EbayAdsData) ? EbayAdsData : EbayAdsData?.data?.items || [];
    // 2 rows × ~3 cols on desktop ≈ 6; show a bit more for wrap
    return list.slice(0, 6);
  }, []);

  if (!items.length) return null;

  return (
    <section className="page-container px-2 sm:px-6 lg:px-8 pb-6">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
          aria-expanded={open}
        >
          <div>
            <p className="text-sm font-bold text-gray-900">eBay partner offers</p>
            <p className="text-[11px] text-gray-500">Special deals from our partners</p>
          </div>
          <FiChevronDown
            className={`h-5 w-5 text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="border-t border-slate-100 px-3 py-3">
            {/* Exactly two visual rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-fr max-h-[11.5rem] overflow-hidden">
              {items.map((item) => (
                <a
                  key={item.id || item.url || item.name}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-[5rem] rounded-lg border border-slate-100 bg-slate-50/80 hover:bg-white hover:border-emerald-200 hover:shadow-sm transition-all overflow-hidden"
                >
                  {item.imageUrl ? (
                    <div className="w-16 h-full shrink-0 bg-slate-100 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1 p-2 flex flex-col justify-between">
                    <div className="min-w-0">
                      {item.groupName && (
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-emerald-700">
                          {item.groupName}
                        </span>
                      )}
                      <p className="text-[11px] font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-700">
                        Open <FiExternalLink className="h-3 w-3" />
                      </span>
                      {item.endDate && (
                        <span className="text-[9px] text-gray-400">
                          Exp {moment(item.endDate).format('MM/DD')}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EbayAdsDrawer;
