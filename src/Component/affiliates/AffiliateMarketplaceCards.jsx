import React from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaFire } from 'react-icons/fa';

/**
 * ClickBank-style offer cards for products & services marketplace.
 */
const AffiliateMarketplaceCards = ({ offers = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-44 rounded-xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!offers.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
        <p className="text-sm font-semibold text-slate-800">No marketplace offers yet</p>
        <p className="mt-1 text-xs text-slate-500">
          Businesses can list products and services for affiliates to promote.
        </p>
        <Link
          to="/affiliates?postForm=true&mode=business"
          className="inline-flex mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          List your product or service
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {offers.map((offer) => {
        const rawId = String(offer.id || '').replace(/^business-/, '');
        const stats = offer.marketplace_stats || {};
        const title =
          offer.product_service_title || offer.title || offer.business_name || 'Offer';
        const commission =
          stats.commission_label ||
          (offer.commission_type === 'fixed'
            ? `$${offer.commission_rate}`
            : `${offer.commission_rate}%`);
        const cookie = stats.cookie_days ?? offer.cookie_duration;
        const gravity = Number(stats.gravity ?? 0);
        const hot = gravity >= 20;

        return (
          <article
            key={offer.id}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-soft hover:border-primary/30 hover:shadow-trust transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  to={`/affiliates/offer/${rawId}`}
                  state={{ offerPreview: offer }}
                  className="text-sm font-semibold text-slate-900 group-hover:text-primary line-clamp-2"
                >
                  {title}
                </Link>
                <p className="mt-0.5 text-xs text-slate-500 truncate">
                  {offer.business_name || 'Business'}
                  {offer.affiliate_category?.name || offer.category
                    ? ` · ${offer.affiliate_category?.name || offer.category}`
                    : ''}
                </p>
              </div>
              {hot && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 shrink-0">
                  <FaFire className="h-2.5 w-2.5" />
                  Hot
                </span>
              )}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-slate-50 px-1.5 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Gravity</p>
                <p className="text-sm font-bold text-slate-900 tabular-nums">{gravity || '—'}</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-1.5 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  EPC
                </p>
                <p className="text-sm font-bold text-slate-900 tabular-nums">
                  {stats.epc != null ? `$${Number(stats.epc).toFixed(2)}` : '—'}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 px-1.5 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Comm.</p>
                <p className="text-sm font-bold text-primary tabular-nums">{commission || '—'}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                Cookie {cookie != null && cookie !== '' ? `${cookie}d` : '—'}
                {' · '}
                Avg ${Number(stats.avg_earnings_per_sale || 0).toFixed(2)}
              </span>
            </div>

            <Link
              to={`/affiliates/offer/${rawId}`}
              state={{ offerPreview: offer }}
              className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90"
            >
              Get hop link
              <FaExternalLinkAlt className="h-2.5 w-2.5" />
            </Link>
          </article>
        );
      })}
    </div>
  );
};

export default AffiliateMarketplaceCards;
