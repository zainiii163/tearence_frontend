import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBullhorn,
  FaClock,
  FaExclamationTriangle,
  FaRedo,
  FaStar,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import affiliateService from '../../services/AffiliateService';
import MultiFormatRepostWizard from '../adverts/MultiFormatRepostWizard';

const FORMAT_LABEL = {
  featured: 'Featured',
  sponsored: 'Sponsored',
  promoted: 'Promoted',
  banner: 'Banner',
  affiliate: 'Affiliate',
  affiliate_post: 'Affiliate post',
  paid: 'Paid',
  free: 'Free',
};

/**
 * Clive: business/user adverts across formats with expiry + repost into more formats.
 */
export default function BusinessAdvertsInventoryPanel() {
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState(null);
  const [repostSource, setRepostSource] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await affiliateService.getMyAdvertsInventory();
      setPayload(res?.data || res);
    } catch (e) {
      toast.error(e?.message || 'Could not load adverts inventory');
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="text-sm text-slate-500 py-6">Loading your adverts…</p>;
  }

  const summary = payload?.summary || {};
  const items = payload?.items || [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <FaBullhorn className="text-primary" /> Your adverts
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Paid, sponsored, featured, promoted, banner &amp; affiliate — with expiry. Repost one
            advert into more formats to grow reach.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setRepostSource({
              title: '',
              description: '',
              format: 'free',
              id: null,
            })
          }
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-95"
        >
          <FaRedo className="h-3 w-3" /> Repost / multi-format
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <p className="text-[10px] uppercase text-slate-500 font-bold">Total</p>
          <p className="text-lg font-semibold">{summary.total || 0}</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2.5">
          <p className="text-[10px] uppercase text-emerald-700 font-bold">Active</p>
          <p className="text-lg font-semibold text-emerald-900">{summary.active || 0}</p>
        </div>
        <div className="rounded-lg border border-amber-100 bg-amber-50/40 px-3 py-2.5">
          <p className="text-[10px] uppercase text-amber-700 font-bold flex items-center gap-1">
            <FaClock className="h-3 w-3" /> Expiring ≤7d
          </p>
          <p className="text-lg font-semibold text-amber-900">{summary.expiring_soon || 0}</p>
        </div>
        <div className="rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2.5">
          <p className="text-[10px] uppercase text-rose-700 font-bold flex items-center gap-1">
            <FaExclamationTriangle className="h-3 w-3" /> Expired
          </p>
          <p className="text-lg font-semibold text-rose-900">{summary.expired || 0}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No featured / sponsored / promoted / banner / affiliate ads yet. Post from the dashboard
          or use multi-format repost.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Format</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Expires</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const days = item.days_remaining;
                const expLabel = !item.expires_at
                  ? '—'
                  : days < 0
                    ? `Expired ${Math.abs(days)}d ago`
                    : days === 0
                      ? 'Today'
                      : `${days}d left`;
                return (
                  <tr key={item.source_key} className="border-t border-slate-100">
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {item.format === 'featured' && <FaStar className="h-3 w-3 text-amber-500" />}
                        {FORMAT_LABEL[item.format] || item.format}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-slate-900 max-w-[220px] truncate">
                      {item.title}
                    </td>
                    <td className="px-3 py-2.5 capitalize text-slate-600">{item.status_label}</td>
                    <td
                      className={`px-3 py-2.5 text-xs font-medium ${
                        days != null && days < 0
                          ? 'text-rose-600'
                          : days != null && days <= 7
                            ? 'text-amber-700'
                            : 'text-slate-600'
                      }`}
                    >
                      {expLabel}
                    </td>
                    <td className="px-3 py-2.5 text-right space-x-2 whitespace-nowrap">
                      {item.edit_path && (
                        <Link
                          to={item.edit_path}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Manage
                        </Link>
                      )}
                      <button
                        type="button"
                        className="text-xs font-semibold text-slate-700 hover:text-primary"
                        onClick={() => setRepostSource(item)}
                      >
                        Repost formats
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {repostSource && (
        <MultiFormatRepostWizard
          source={repostSource}
          onClose={() => setRepostSource(null)}
        />
      )}
    </div>
  );
}
