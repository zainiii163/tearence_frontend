import React, { useEffect, useState } from 'react';
import { FaShieldAlt, FaKey, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { twoFactorAPI } from '../../api/twoFactorAPI';

/**
 * Dashboard Security / 2FA panel (Clive: 2FA on all user dashboards).
 */
const DashboardSecurityPanel = () => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await twoFactorAPI.status();
      setEnabled(!!res?.data?.enabled);
    } catch (e) {
      setError(e?.response?.data?.message || 'Could not load 2FA status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startSetup = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    setRecoveryCodes(null);
    try {
      const res = await twoFactorAPI.setup();
      setSetup(res?.data || null);
      setMessage(res?.message || 'Scan the QR code, then enter a code to confirm.');
    } catch (e) {
      setError(e?.response?.data?.message || 'Setup failed.');
    } finally {
      setBusy(false);
    }
  };

  const confirmSetup = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await twoFactorAPI.confirm(code);
      setRecoveryCodes(res?.data?.recovery_codes || []);
      setEnabled(true);
      setSetup(null);
      setCode('');
      setMessage('Two-factor authentication is now enabled.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid code.');
    } finally {
      setBusy(false);
    }
  };

  const disable2fa = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await twoFactorAPI.disable({ password, code });
      setEnabled(false);
      setPassword('');
      setCode('');
      setMessage('Two-factor authentication disabled.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not disable 2FA.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-gray-500">Loading security settings…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-white">
            <FaShieldAlt className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">Two-factor authentication</h2>
            <p className="mt-1 text-sm text-slate-600">
              Protect your Worldwide Adverts account with an authenticator app (Google Authenticator, Authy, etc.).
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: enabled ? '#ecfdf5' : '#fef3c7', color: enabled ? '#047857' : '#92400e' }}
            >
              {enabled ? <FaCheckCircle /> : <FaExclamationTriangle />}
              {enabled ? 'Enabled' : 'Not enabled'}
            </div>
          </div>
        </div>

        {message && <p className="mt-4 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        {!enabled && !setup && (
          <button
            type="button"
            disabled={busy}
            onClick={startSetup}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            <FaKey className="h-3.5 w-3.5" />
            Enable 2FA
          </button>
        )}

        {setup && (
          <form onSubmit={confirmSetup} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              {setup.qr_code_url && (
                <img src={setup.qr_code_url} alt="2FA QR code" className="mx-auto h-48 w-48 rounded-lg bg-white p-2" />
              )}
              <p className="mt-3 break-all text-xs text-slate-500">Secret: {setup.secret}</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">Scan the QR code, then enter the 6-digit code from your app.</p>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm tracking-widest"
                maxLength={8}
                required
              />
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                Confirm &amp; enable
              </button>
            </div>
          </form>
        )}

        {recoveryCodes?.length > 0 && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">Save these recovery codes now — they won’t be shown again.</p>
            <ul className="mt-2 grid gap-1 font-mono text-xs text-amber-950 sm:grid-cols-2">
              {recoveryCodes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {enabled && (
          <form onSubmit={disable2fa} className="mt-6 max-w-md space-y-3 border-t border-slate-100 pt-6">
            <p className="text-sm font-medium text-slate-800">Disable two-factor authentication</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Account password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Authenticator or recovery code"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              Disable 2FA
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DashboardSecurityPanel;
