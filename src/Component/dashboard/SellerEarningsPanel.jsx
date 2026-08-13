import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaDollarSign, FaWallet, FaCheckCircle, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import sellerMarketplaceService from '../../services/sellerMarketplaceService';
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
 * Seller share of product sales (books, buy-sell, images, templates, services).
 * Listing / advert fees stay with WWA — not shown here as seller balance.
 */
const SellerEarningsPanel = () => {
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || {});
  const savedNetwork = String(
    userDetails.crypto_network || userDetails.cryptoNetwork || 'trc20'
  ).toLowerCase();
  const savedAddress =
    userDetails.crypto_wallet_address || userDetails.cryptoWalletAddress || '';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    method: 'crypto',
    crypto_network: savedNetwork || 'trc20',
    crypto_address: savedAddress || '',
    notes: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const summary = await sellerMarketplaceService.getEarnings();
      setData(summary);
      const avail = Number(summary?.totals?.available || 0);
      setForm((prev) =>
        prev.amount || !(avail > 0)
          ? prev
          : { ...prev, amount: String(avail.toFixed(2)) }
      );
    } catch (e) {
      toast.error(e?.message || 'Could not load seller earnings');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      crypto_network: prev.crypto_address ? prev.crypto_network : savedNetwork || prev.crypto_network,
      crypto_address: prev.crypto_address || savedAddress,
    }));
  }, [savedAddress, savedNetwork]);

  const t = data?.totals || {};
  const available = Number(t.available || 0);
  const feePercent = Number(data?.fee_percent ?? 15);
  const sellerPercent = Number(data?.seller_percent ?? 85);

  const submitPayout = async (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount < MIN_PAYOUT) {
      toast.error(`Minimum payout is $${MIN_PAYOUT}`);
      return;
    }
    if (amount > available) {
      toast.error('Amount exceeds available balance');
      return;
    }
    if (form.method === 'crypto') {
      const check = validateCryptoAddress(form.crypto_address, form.crypto_network);
      if (!check.ok) {
        toast.error(check.message || 'Invalid wallet address');
        return;
      }
    }

    setRequesting(true);
    try {
      await sellerMarketplaceService.requestPayout({
        amount,
        method: form.method,
        crypto_network: form.crypto_network,
        crypto_address: form.crypto_address,
        notes: form.notes || undefined,
      });
      toast.success('Payout requested — admin will send after approval');
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Request failed');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500 py-6">Loading seller earnings…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-950">
        <p className="font-semibold mb-1">Where the money goes</p>
        <ul className="list-disc list-inside space-y-1 text-xs text-emerald-900/90">
          <li>
            <strong>Posting / promoting an ad</strong> (Paid, Promoted, Featured, Sponsored) → 100% Worldwide
            Adverts
          </li>
          <li>
            <strong>Someone buys your product</strong> → buyer pays WWA → you get ~{sellerPercent}% · platform
            keeps {feePercent}%
          </li>
          <li>
            Withdraw your seller balance with crypto (USDT/USDC). Save a wallet under{' '}
            <Link to="/dashboard?tab=security&section=crypto" className="underline font-medium">
              Account → Crypto wallet
            </Link>
            .
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Earned', value: t.earned, icon: FaDollarSign },
          { label: 'Available', value: t.available, icon: FaWallet },
          { label: 'Paid out', value: t.paid_out, icon: FaCheckCircle },
          { label: 'Pending requests', value: t.reserved - (t.paid_out || 0), icon: FaClock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Icon className="text-emerald-600" />
              {label}
            </div>
            <p className="text-xl font-bold text-gray-900">{money(value)}</p>
          </div>
        ))}
      </div>

      {Array.isArray(data?.by_category) && data.by_category.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="font-semibold text-gray-900 mb-3">By category</h3>
          <div className="space-y-2">
            {data.by_category.map((c) => (
              <div key={c.category_key} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {c.label} <span className="text-gray-400">({c.sales} sales)</span>
                </span>
                <span className="font-medium">{money(c.earned)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={submitPayout} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <h3 className="font-semibold text-gray-900">Request seller payout</h3>
        <p className="text-xs text-gray-500">Minimum ${MIN_PAYOUT}. Admin approves and sends crypto.</p>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Amount (USD)</label>
            <input
              type="number"
              min={MIN_PAYOUT}
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Network</label>
            <select
              value={form.crypto_network}
              onChange={(e) => setForm((p) => ({ ...p, crypto_network: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              {PAYOUT_NETWORKS.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Wallet address</label>
          <input
            type="text"
            value={form.crypto_address}
            onChange={(e) => setForm((p) => ({ ...p, crypto_address: e.target.value }))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
            placeholder="Your USDT / USDC address"
          />
          <p className="mt-1 text-[11px] text-amber-800">{NETWORK_MISMATCH_WARNING}</p>
        </div>
        <button
          type="submit"
          disabled={requesting || available < MIN_PAYOUT}
          className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
        >
          {requesting ? 'Submitting…' : 'Request payout'}
        </button>
      </form>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-900">Recent sales (your share)</div>
        {(data?.sales || []).length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No product sales credited yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {data.sales.map((s) => (
              <li key={s.id} className="px-4 py-3 flex justify-between text-sm gap-3">
                <div>
                  <p className="font-medium text-gray-900">{s.label}</p>
                  <p className="text-xs text-gray-500">{s.description || s.source_type}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-emerald-700">{money(s.amount)}</p>
                  <p className="text-[11px] text-gray-400">of {money(s.gross)} sale</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {(data?.payouts || []).length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-900">Payout history</div>
          <ul className="divide-y divide-gray-100">
            {data.payouts.map((p) => {
              const net = payoutNetworkById(p.crypto_network);
              const tx = extractTxHash(p) || p.tx_hash;
              const href = tx && net ? explorerUrlFor(net.id, tx) : null;
              return (
                <li key={p.id} className="px-4 py-3 flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{money(p.amount)} · {p.status}</p>
                    <p className="text-xs text-gray-500">{p.reference}</p>
                    {href && (
                      <a href={href} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                        View tx
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{p.created_at?.slice?.(0, 10) || ''}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SellerEarningsPanel;
