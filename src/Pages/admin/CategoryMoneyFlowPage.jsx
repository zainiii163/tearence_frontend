import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import { fetchCategoryMoneySummary } from '../services/CategoryMoneyService';
import { FaArrowLeft, FaDollarSign, FaHandHoldingUsd, FaHeart } from 'react-icons/fa';

function money(n) {
  return `$${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Clive: per-category money flow for super admin.
 * Our money · Seller payouts · Other monies
 */
export default function CategoryMoneyFlowPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCategoryMoneySummary()
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              'Unable to load category money flow.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totals = summary?.totals || {};
  const categories = summary?.categories || [];

  return (
    <div className="min-h-screen bg-[hsl(210_40%_98%)]">
      <UnifiedNavbar />
      <main className="page-container py-6 sm:py-8 pb-12">
        <div className="mb-4">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <FaArrowLeft className="h-3 w-3" />
            Admin dashboard
          </Link>
        </div>

        <header className="max-w-3xl">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Category money flow
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Each marketplace category broken into our money (products, fees, adverts &amp;
            commissions), payouts to sellers/users, and other monies.
          </p>
        </header>

        {loading && (
          <p className="mt-8 text-sm text-slate-500">Loading ledger…</p>
        )}
        {error && (
          <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  <FaDollarSign className="h-3.5 w-3.5" />
                  Our money
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {money(totals.our_money)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Products, fees, adverts &amp; commissions
                </p>
              </div>
              <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  <FaHandHoldingUsd className="h-3.5 w-3.5" />
                  Seller payouts
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {money(totals.seller_payouts)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Paid / owed to customers selling
                </p>
              </div>
              <div className="rounded-xl border border-sky-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-700">
                  <FaHeart className="h-3.5 w-3.5" />
                  Other monies
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {money(totals.other_monies)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Donations, funding, pass-through
                </p>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Our money</th>
                    <th className="px-4 py-3 font-semibold">Seller payouts</th>
                    <th className="px-4 py-3 font-semibold">Other</th>
                    <th className="px-4 py-3 font-semibold">Gross</th>
                    <th className="px-4 py-3 font-semibold">Txns</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr
                      key={c.category_key}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {c.label}
                      </td>
                      <td className="px-4 py-3 text-emerald-700 font-semibold">
                        {money(c.our_money)}
                      </td>
                      <td className="px-4 py-3 text-amber-700 font-semibold">
                        {money(c.seller_payouts)}
                      </td>
                      <td className="px-4 py-3 text-sky-700 font-semibold">
                        {money(c.other_monies)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{money(c.gross)}</td>
                      <td className="px-4 py-3 text-slate-500">{c.transactions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Also available in Filament Admin → Dashboards → Category Money. After deploy run{' '}
              <code className="rounded bg-slate-100 px-1">php artisan migrate --force</code> and{' '}
              <code className="rounded bg-slate-100 px-1">php artisan money:backfill-category-flows</code>.
            </p>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
