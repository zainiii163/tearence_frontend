import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaDollarSign, FaHandshake, FaStore, FaUserFriends } from 'react-icons/fa';
import toast from 'react-hot-toast';
import affiliateService from '../../services/AffiliateService';

const money = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * Business side of affiliate money —
 * who pays (business) vs who is paid (promoter); sales + commissions owed.
 */
export default function BusinessAffiliateMoneyPanel() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await affiliateService.getBusinessMoney();
      setData(res?.data || res);
    } catch (e) {
      toast.error(e?.message || 'Could not load business affiliate money');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="text-sm text-slate-500 py-6">Loading sales &amp; payouts…</p>;
  }

  const totals = data?.totals || {};
  const byOffer = data?.by_offer || [];
  const recent = data?.recent_sales || [];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3 text-sm text-slate-700">
        <p className="font-semibold text-slate-900 flex items-center gap-2">
          <FaHandshake className="text-primary" /> Affiliate money flow
        </p>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          <strong>You (business) pay</strong> the commission % you offered on each attributed
          sale. <strong>Promoters get paid</strong> that amount when they request a payout
          (admins mark paid). Products bought via their hop link appear below.
        </p>
        {data?.explanation ? (
          <p className="mt-1 text-[11px] text-slate-500">{data.explanation}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Sales</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{totals.sales_count || 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Sales volume</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">{money(totals.sales_volume)}</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700 flex items-center gap-1">
            <FaUserFriends className="h-3 w-3" /> Owed to promoters
          </p>
          <p className="mt-1 text-xl font-semibold text-amber-900">
            {money(totals.commissions_owed_to_promoters)}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 flex items-center gap-1">
            <FaStore className="h-3 w-3" /> Your net after commissions
          </p>
          <p className="mt-1 text-xl font-semibold text-emerald-900">
            {money(totals.your_net_after_commissions)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-800">Payouts</p>
        <p className="mt-1">
          Commissions above become promoter balances. Promoters request payout from their
          earnings tab; settle those requests in Filament admin. Track attributed sales here and
          on each offer via <strong>Report sale</strong> / postback.
        </p>
        <Link
          to="/dashboard?tab=affiliates&mode=selling&sub=adverts"
          className="inline-block mt-2 font-semibold text-primary hover:underline"
        >
          View adverts &amp; expiry →
        </Link>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2">By offer</h3>
        {byOffer.length === 0 ? (
          <p className="text-sm text-slate-500">
            No offers yet.{' '}
            <Link to="/dashboard?tab=affiliates&mode=selling" className="text-primary font-semibold hover:underline">
              Create an offer
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Product / service</th>
                  <th className="px-3 py-2 text-left">Your offer</th>
                  <th className="px-3 py-2 text-right">Sales</th>
                  <th className="px-3 py-2 text-right">Volume</th>
                  <th className="px-3 py-2 text-right">Commissions owed</th>
                </tr>
              </thead>
              <tbody>
                {byOffer.map((o) => (
                  <tr key={o.offer_id} className="border-t border-slate-100">
                    <td className="px-3 py-2.5 font-medium text-slate-900">{o.title}</td>
                    <td className="px-3 py-2.5 text-slate-600">
                      {o.commission_type === 'flat' || o.commission_type === 'fixed'
                        ? money(o.commission_rate)
                        : `${o.commission_rate}%`}
                    </td>
                    <td className="px-3 py-2.5 text-right">{o.sales_count}</td>
                    <td className="px-3 py-2.5 text-right">{money(o.sales_volume)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-amber-800">
                      {money(o.commissions_owed)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <FaDollarSign className="text-primary" /> Recent attributed sales
        </h3>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">
            No hop conversions yet. Report a sale on an offer when a promoter drives a purchase,
            or wire your checkout to the postback URL.
          </p>
        ) : (
          <ul className="space-y-2">
            {recent.slice(0, 12).map((row) => (
              <li
                key={row.id || `${row.order_id}-${row.sale_amount}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {row.offer?.product_service_title || row.product_title || 'Sale'}
                  </p>
                  <p className="text-xs text-slate-500">
                    Order {row.order_id || '—'} · Promoter code{' '}
                    {row.application?.tracking_code || row.tracking_code || '—'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{money(row.sale_amount)}</p>
                  <p className="text-xs text-amber-700">
                    Commission {money(row.commission_amount)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
