import React from 'react';
import { getOfferShopping } from '../../utils/offerShoppingActivity';

const badgeClass = {
  product_drop: 'bg-violet-50 text-violet-800 border-violet-100',
  price_drop: 'bg-sky-50 text-sky-800 border-sky-100',
  percent_off: 'bg-rose-50 text-rose-800 border-rose-100',
  amount_off: 'bg-rose-50 text-rose-800 border-rose-100',
  sale: 'bg-rose-50 text-rose-800 border-rose-100',
};

/**
 * Compact sale / drop / discount-code chips for marketplace cards and tables.
 */
const AffiliateDealBadges = ({ offer, className = '' }) => {
  const shopping = getOfferShopping(offer);
  if (!shopping?.label && !shopping?.discount_code && !shopping?.on_sale) return null;

  const tone = badgeClass[shopping.type] || 'bg-amber-50 text-amber-800 border-amber-100';

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {shopping.label ? (
        <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${tone}`}>
          {shopping.label}
        </span>
      ) : null}
      {shopping.discount_code && shopping.label !== `Code: ${shopping.discount_code}` ? (
        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
          Code {shopping.discount_code}
        </span>
      ) : null}
      {shopping.on_sale && shopping.price != null ? (
        <span className="inline-flex items-baseline gap-1 text-[11px] tabular-nums">
          {shopping.compare_at_price != null ? (
            <span className="text-slate-400 line-through">
              ${Number(shopping.compare_at_price).toFixed(0)}
            </span>
          ) : null}
          <span className="font-bold text-rose-700">${Number(shopping.price).toFixed(0)}</span>
        </span>
      ) : shopping.price != null && !shopping.on_sale ? (
        <span className="text-[11px] font-semibold tabular-nums text-slate-700">
          ${Number(shopping.price).toFixed(0)}
        </span>
      ) : null}
    </div>
  );
};

export default AffiliateDealBadges;
