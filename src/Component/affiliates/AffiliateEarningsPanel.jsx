import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  FaDollarSign,
  FaMousePointer,
  FaChartLine,
  FaWallet,
  FaClock,
  FaCheckCircle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import affiliateService from '../../services/AffiliateService';
import { normalizeEarningsPayload } from '../../utils/affiliateMarketplaceStats';
import {
  NETWORK_MISMATCH_WARNING,
  PAYOUT_NETWORKS,
  explorerUrlFor,
  extractTxHash,
  payoutNetworkById,
  validateCryptoAddress,
} from '../../utils/cryptoRails';

const money = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const MIN_PAYOUT = 25;

/**
 * Earnings / payouts ledger for affiliates.
 */
const AffiliateEarningsPanel = () => {
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || {});
  const savedNetwork = String(
    userDetails.crypto_network || userDetails.cryptoNetwork || 'trc20'
  ).toLowerCase();
  const savedAddress =
    userDetails.crypto_wallet_address || userDetails.cryptoWalletAddress || '';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    amount: '',
    method: 'paypal',
    details: '',
    notes: '',
    crypto_network: savedNetwork || 'trc20',
    crypto_address: savedAddress || '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [raw, payoutsRes] = await Promise.all([
        affiliateService.getMyEarnings(),
        affiliateService.getMyPayouts().catch(() => ({ data: [] })),
      ]);
      const normalized = normalizeEarningsPayload(raw);
      const extraPayouts = Array.isArray(payoutsRes?.data)
        ? payoutsRes.data
        : Array.isArray(payoutsRes?.data?.data)
          ? payoutsRes.data.data
          : [];
      if (extraPayouts.length && !normalized.payouts.length) {
        normalized.payouts = extraPayouts;
      }
      setData(normalized);
      setPayoutForm((prev) =>
        prev.amount || !(normalized.totals.available > 0)
          ? prev
          : { ...prev, amount: String(normalized.totals.available.toFixed(2)) }
      );
    } catch (e) {
      toast.error(e?.message || 'Could not load earnings');
      setData(normalizeEarningsPayload({}));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!savedAddress && !savedNetwork) return;
    setPayoutForm((prev) => ({
      ...prev,
      crypto_network: prev.crypto_address ? prev.crypto_network : savedNetwork || prev.crypto_network,
      crypto_address: prev.crypto_address || savedAddress,
    }));
  }, [savedAddress, savedNetwork]);

  useEffect(() => {
    load();
  }, [load]);

  const t = data?.totals || {};
  const conversions = data?.conversions || [];
  const payouts = data?.payouts || [];
  const available = Number(t.available || 0);

  const canRequest = useMemo(
    () => available >= MIN_PAYOUT && Number(payoutForm.amount) > 0,
    [available, payoutForm.amount]
  );

  const submitPayout = async (e) => {
    e.preventDefault();
    const amount = Number(payoutForm.amount);
    if (!amount || amount <= 0) {
      toast.error('Enter a payout amount');
      return;
    }
    if (amount > available) {
      toast.error('Amount exceeds available balance');
      return;
    }
    if (amount < MIN_PAYOUT) {
      toast.error(`Minimum payout is $${MIN_PAYOUT}`);
      return;
    }
    const network = payoutNetworkById(payoutForm.crypto_network);
    if (payoutForm.method === 'crypto') {
      const check = validateCryptoAddress(
        payoutForm.crypto_address,
        payoutForm.crypto_network
      );
      if (!check.ok) {
        toast.error(check.message);
        return;
      }
    }
    setRequesting(true);
    try {
      const cryptoDetails =
        payoutForm.method === 'crypto'
          ? `${network.label} · ${payoutForm.crypto_address.trim()}`
          : payoutForm.details;
      const res = await affiliateService.requestPayout({
        amount,
        method: payoutForm.method,
        payout_details: cryptoDetails,
        notes: payoutForm.notes,
        crypto_network: payoutForm.method === 'crypto' ? payoutForm.crypto_network : undefined,
        crypto_address:
          payoutForm.method === 'crypto' ? payoutForm.crypto_address.trim() : undefined,
        crypto_currency: payoutForm.method === 'crypto' ? network.currency : undefined,
      });
      toast.success(res?.message || 'Payout request submitted');
      setData((prev) => ({
        ...prev,
        payouts: [
          {
            id: `local-${Date.now()}`,
            amount,
            method: payoutForm.method,
            status: 'pending',
            created_at: new Date().toISOString(),
            reference: cryptoDetails || undefined,
            crypto_network: payoutForm.method === 'crypto' ? payoutForm.crypto_network : undefined,
            crypto_address:
              payoutForm.method === 'crypto' ? payoutForm.crypto_address.trim() : undefined,
          },
          ...(prev?.payouts || []),
        ],
        totals: {
          ...prev.totals,
          available: Math.max(0, Number(prev.totals.available) - amount),
          pending: Number(prev.totals.pending || 0) + amount,
        },
      }));
    } catch (err) {
      toast.error(err?.message || 'Could not submit payout request');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Loading earnings…
      </div>
    );
  }

  const salesVolume = Number(
    t.sales_volume ||
      conversions.reduce((s, r) => s + Number(r.sale_amount ?? r.amount ?? 0), 0)
  );

  const cards = [
    {
      label: 'Products sold',
      value: String(t.conversions || conversions.length || 0),
      icon: FaChartLine,
      tone: 'bg-teal-50 text-teal-800',
    },
    {
      label: 'Sales volume',
      value: money(salesVolume),
      icon: FaMousePointer,
      tone: 'bg-indigo-50 text-indigo-700',
    },
    {
      label: 'Total earned',
      value: money(t.earnings),
      icon: FaDollarSign,
      tone: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Available',
      value: money(t.available),
      icon: FaWallet,
      tone: 'bg-sky-50 text-sky-700',
    },
    {
      label: 'Pending',
      value: money(t.pending),
      icon: FaClock,
      tone: 'bg-amber-50 text-amber-800',
    },
    {
      label: 'Paid out',
      value: money(t.paid),
      icon: FaCheckCircle,
      tone: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Earnings & payouts</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          You get paid the % each business offered. See products/services bought via your hop links below.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-soft"
            >
              <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${c.tone}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {c.label}
              </p>
              <p className="text-base font-bold text-slate-900 tabular-nums">{c.value}</p>
            </div>
          );
        })}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Request payout</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Minimum ${MIN_PAYOUT}. Available: {money(available)}. Crypto payouts go to your
              own wallet after admin approval in Filament. WWA does not hold crypto balances.
            </p>
          </div>
        </div>
        <form onSubmit={submitPayout} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="text-slate-700 font-medium">Amount</span>
            <input
              type="number"
              min={MIN_PAYOUT}
              step="0.01"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              value={payoutForm.amount}
              onChange={(e) =>
                setPayoutForm((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="0.00"
            />
          </label>
          <label className="block text-sm">
            <span className="text-slate-700 font-medium">Method</span>
            <select
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              value={payoutForm.method}
              onChange={(e) =>
                setPayoutForm((prev) => ({ ...prev, method: e.target.value }))
              }
            >
              <option value="paypal">PayPal</option>
              <option value="crypto">Crypto (USDT / USDC wallet)</option>
              <option value="bank">Bank transfer</option>
              <option value="wise">Wise</option>
              <option value="other">Other</option>
            </select>
          </label>
          {payoutForm.method === 'crypto' ? (
            <>
              <div className="sm:col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                {NETWORK_MISMATCH_WARNING}
              </div>
              <label className="block text-sm">
                <span className="text-slate-700 font-medium">Network</span>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={payoutForm.crypto_network}
                  onChange={(e) =>
                    setPayoutForm((prev) => ({ ...prev, crypto_network: e.target.value }))
                  }
                >
                  {PAYOUT_NETWORKS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-slate-700 font-medium">Wallet address</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
                  value={payoutForm.crypto_address}
                  onChange={(e) =>
                    setPayoutForm((prev) => ({ ...prev, crypto_address: e.target.value }))
                  }
                  placeholder={payoutNetworkById(payoutForm.crypto_network).example}
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
            </>
          ) : (
            <label className="block text-sm sm:col-span-2">
              <span className="text-slate-700 font-medium">Payout details</span>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                value={payoutForm.details}
                onChange={(e) =>
                  setPayoutForm((prev) => ({ ...prev, details: e.target.value }))
                }
                placeholder="PayPal email or bank reference"
              />
            </label>
          )}
          <label className="block text-sm sm:col-span-2">
            <span className="text-slate-700 font-medium">Notes (optional)</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              value={payoutForm.notes}
              onChange={(e) =>
                setPayoutForm((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </label>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={!canRequest || requesting}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {requesting ? 'Submitting…' : 'Request payout'}
            </button>
          </div>
        </form>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-soft">
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Products sold via your links</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Sales attributed to your hop links — you earn the % the business offered.
            </p>
          </div>
          {conversions.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-500">
              No conversions yet. Share hop links from programs you promote.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold">Offer / code</th>
                    <th className="px-3 py-2 font-semibold text-right">Sale</th>
                    <th className="px-3 py-2 font-semibold text-right">Earn</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {conversions.slice(0, 40).map((row, i) => (
                    <tr key={row.id || i} className="hover:bg-slate-50/80">
                      <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                        {row.created_at || row.date
                          ? new Date(row.created_at || row.date).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-slate-800">
                        <div className="font-medium truncate max-w-[160px]">
                          {row.offer_title ||
                            row.product_service_title ||
                            row.offer?.product_service_title ||
                            'Offer'}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {row.tracking_code || row.hop_code || '—'}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                        {money(row.sale_amount ?? row.amount ?? 0)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-emerald-700">
                        {money(
                          row.commission_amount ??
                            row.commission ??
                            row.earnings ??
                            row.affiliate_earning ??
                            0
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-700">
                          {row.status || 'recorded'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-soft">
          <div className="border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Payout history</h3>
          </div>
          {payouts.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-slate-500">No payouts recorded yet.</p>
              <p className="mt-1 text-xs text-slate-400">
                Submitted requests appear here once the payout API is live.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {payouts.map((p, i) => {
                const txHash = extractTxHash(p);
                const method = String(p.method || p.payout_method || 'Payout');
                const network = p.crypto_network || p.network;
                const payCurrency =
                  network === 'trc20'
                    ? 'usdttrc20'
                    : network === 'polygon'
                      ? 'usdcmatic'
                      : 'usdterc20';
                const explorer = explorerUrlFor(payCurrency, txHash);
                return (
                <li key={p.id || i} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800 capitalize">
                      {method}
                      {network ? ` · ${network}` : ''}
                    </p>
                    <p className="text-xs text-slate-500">
                      {p.paid_at || p.created_at
                        ? new Date(p.paid_at || p.created_at).toLocaleString()
                        : '—'}
                      {p.reference ? ` · ${p.reference}` : ''}
                      {p.crypto_address ? ` · ${p.crypto_address}` : ''}
                    </p>
                    {txHash ? (
                      <p className="text-[11px] text-slate-500 break-all mt-0.5">
                        Tx:{' '}
                        {explorer ? (
                          <a
                            href={explorer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-primary hover:underline"
                          >
                            {txHash}
                          </a>
                        ) : (
                          <span className="font-mono">{txHash}</span>
                        )}
                      </p>
                    ) : null}
                    {p.provider_payout_id ? (
                      <p className="text-[11px] text-slate-400">
                        Provider: {p.provider_payout_id}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums text-slate-900">
                      {money(p.amount)}
                    </p>
                    <p className="text-[11px] capitalize text-slate-500">{p.status || 'paid'}</p>
                  </div>
                </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default AffiliateEarningsPanel;
