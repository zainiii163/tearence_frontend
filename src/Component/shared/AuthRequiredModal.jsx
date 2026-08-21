import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Modal: guests can keep browsing; sign-in only when they choose.
 * Open via: window.dispatchEvent(new CustomEvent('wwa-auth-required', { detail: { message, from } }))
 */
export default function AuthRequiredModal() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [from, setFrom] = useState('/communities');

  useEffect(() => {
    const onNeed = (e) => {
      const detail = e?.detail || {};
      setMessage(
        detail.message ||
          'You need an account to like, comment, follow, or create posts.'
      );
      setFrom(detail.from || window.location.pathname || '/communities');
      setOpen(true);
    };
    window.addEventListener('wwa-auth-required', onNeed);
    return () => window.removeEventListener('wwa-auth-required', onNeed);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wwa-auth-title"
        className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center"
      >
        <h3 id="wwa-auth-title" className="font-bold text-lg mb-2 text-slate-900">
          Sign in required
        </h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem('authRedirect', from);
            navigate('/Login', { state: { from, message } });
          }}
          className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold mb-2 hover:bg-primary/90"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="w-full text-gray-500 text-sm py-2 hover:text-gray-800"
        >
          Continue browsing
        </button>
      </div>
    </div>
  );
}
