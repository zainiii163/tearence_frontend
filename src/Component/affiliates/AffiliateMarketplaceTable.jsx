import React from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

/**
 * ClickBank-style marketplace table: product, gravity, $/sale, %, cookie, Get Link.
 */
const AffiliateMarketplaceTable = ({
  offers = [],
  loading = false,
  sortBy = 'gravity',
  sortOrder = 'desc',
  onSortChange,
}) => {
  const cols = [
    { key: 'product', label: 'Product / service', sortable: false },
    { key: 'gravity', label: 'Gravity', sortable: true, tip: 'Promoters with recent conversions' },
    { key: 'avg_sale', label: 'Avg $/sale', sortable: false },
    { key: 'commission', label: 'Commission', sortable: true, sortKey: 'commission_rate' },
    { key: 'epc', label: 'EPC', sortable: false, tip: 'Earnings per hop click' },
    { key: 'cookie', label: 'Cookie', sortable: false },
    { key: 'action', label: '', sortable: false },
  ];

  const SortIcon = ({ colKey }) => {
    const active =
      sortBy === colKey ||
      (colKey === 'gravity' && sortBy === 'gravity') ||
      (colKey === 'commission' && (sortBy === 'commission_rate' || sortBy === 'commission'));
    if (!active) return <FaSort className="inline ml-1 opacity-40 text-[10px]" />;
    return sortOrder === 'asc' ? (
      <FaSortUp className="inline ml-1 text-[10px]" />
    ) : (
      <FaSortDown className="inline ml-1 text-[10px]" />
    );
  };

  const handleHeader = (col) => {
    if (!col.sortable || !onSortChange) return;
    const key = col.sortKey || col.key;
    if (sortBy === key || (key === 'gravity' && sortBy === 'gravity')) {
      onSortChange(key, sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      onSortChange(key, 'desc');
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Loading marketplace…
      </div>
    );
  }

  if (!offers.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-base font-semibold text-slate-900">No marketplace offers yet</p>
        <p className="text-sm text-slate-500 mt-1">
          Businesses can list products and services here for affiliates to promote.
        </p>
        <Link
          to="/affiliates/marketplace?postForm=true&mode=business"
          className="inline-block mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          List your product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-900 text-white">
          <tr>
            {cols.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-3 font-semibold whitespace-nowrap ${
                  col.sortable ? 'cursor-pointer select-none hover:bg-slate-800' : ''
                }`}
                title={col.tip}
                onClick={() => handleHeader(col)}
              >
                {col.label}
                {col.sortable && <SortIcon colKey={col.key} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
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
            const cookie =
              stats.cookie_days ?? offer.cookie_duration ?? '—';

            return (
              <tr key={offer.id} className="hover:bg-sky-50/50 transition-colors">
                <td className="px-3 py-3 max-w-[280px]">
                  <Link
                    to={`/affiliates/offer/${rawId}`}
                    state={{ offerPreview: offer }}
                    className="font-semibold text-slate-900 hover:text-primary line-clamp-2"
                  >
                    {title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {offer.business_name}
                    {offer.affiliate_category?.name || offer.category
                      ? ` · ${offer.affiliate_category?.name || offer.category}`
                      : ''}
                  </p>
                </td>
                <td className="px-3 py-3 font-semibold text-primary tabular-nums">
                  {stats.gravity ?? 0}
                </td>
                <td className="px-3 py-3 tabular-nums text-slate-800">
                  ${Number(stats.avg_earnings_per_sale || 0).toFixed(2)}
                </td>
                <td className="px-3 py-3 font-medium text-emerald-700 tabular-nums">
                  {commission}
                </td>
                <td className="px-3 py-3 tabular-nums text-slate-700">
                  ${Number(stats.epc || 0).toFixed(2)}
                </td>
                <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                  {cookie === '—' ? cookie : `${cookie}d`}
                </td>
                <td className="px-3 py-3 text-right whitespace-nowrap">
                  <Link
                    to={`/affiliates/offer/${rawId}`}
                    state={{ offerPreview: offer }}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90"
                  >
                    Get link
                    <FaExternalLinkAlt className="h-2.5 w-2.5" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AffiliateMarketplaceTable;
