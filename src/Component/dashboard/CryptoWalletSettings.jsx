import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaCoins } from 'react-icons/fa';
import { getUserDetails, updateUserDetails } from '../../slice/AuthSlice';
import {
  NETWORK_MISMATCH_WARNING,
  PAYOUT_NETWORKS,
  payoutNetworkById,
  validateCryptoAddress,
} from '../../utils/cryptoRails';
import api from '../../api';

/**
 * Saved receiving wallet for crypto payouts (affiliates / sellers).
 * WWA does not hold crypto balances in Phase 1.
 */
const CryptoWalletSettings = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || {});
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    crypto_wallet_address: '',
    crypto_network: 'trc20',
  });

  useEffect(() => {
    setForm({
      crypto_wallet_address:
        userDetails.crypto_wallet_address || userDetails.cryptoWalletAddress || '',
      crypto_network: String(
        userDetails.crypto_network || userDetails.cryptoNetwork || 'trc20'
      ).toLowerCase(),
    });
  }, [userDetails.crypto_wallet_address, userDetails.crypto_network]);

  const network = payoutNetworkById(form.crypto_network);
  const verifiedAt =
    userDetails.crypto_wallet_verified_at || userDetails.cryptoWalletVerifiedAt || null;

  const save = async (e) => {
    e.preventDefault();
    const check = validateCryptoAddress(form.crypto_wallet_address, form.crypto_network);
    if (!check.ok) {
      toast.error(check.message);
      return;
    }
    const userId = userDetails.customer_id || userDetails.id;
    if (!userId) {
      toast.error('Sign in to save a wallet address');
      return;
    }
    const payload = {
      crypto_wallet_address: check.address,
      crypto_network: form.crypto_network,
    };
    setSaving(true);
    try {
      try {
        await api.put('/crypto/wallet', payload);
      } catch {
        await dispatch(updateUserDetails({ id: userId, payload })).unwrap();
      }
      toast.success('Crypto wallet saved');
      dispatch(getUserDetails());
    } catch (err) {
      toast.error(err?.message || err?.response?.data?.message || 'Could not save wallet');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
          <FaCoins className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Crypto payout wallet</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Used when you request a USDT/USDC payout. WWA does not store or hold your crypto
            balance — funds go directly to this address after admin approval.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950 mb-4">
        {NETWORK_MISMATCH_WARNING}
      </div>

      <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="font-medium text-slate-800">Network</span>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
            value={form.crypto_network}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, crypto_network: e.target.value }))
            }
          >
            {PAYOUT_NETWORKS.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-slate-800">Wallet address</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
            value={form.crypto_wallet_address}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, crypto_wallet_address: e.target.value }))
            }
            placeholder={network.example}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <div className="sm:col-span-2 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            {verifiedAt
              ? `Verified ${new Date(verifiedAt).toLocaleString()}`
              : 'Not verified yet — admin may confirm this address before the first payout.'}
          </p>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save wallet'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CryptoWalletSettings;
