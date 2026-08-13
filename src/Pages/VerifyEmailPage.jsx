import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthService from '../services/AuthService';

/**
 * Handles magic-link email verification: /verify-email/:token
 */
const VerifyEmailPage = () => {
  const { token: pathToken } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = pathToken || searchParams.get('token') || '';
  const [status, setStatus] = useState(token ? 'verifying' : 'missing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('missing');
      return undefined;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await AuthService.verifyEmail(token);
        if (cancelled) return;
        setStatus('success');
        setMessage(res?.message || 'Email verified successfully. You can sign in now.');
        toast.success('Email verified');
        setTimeout(() => navigate('/Login', { replace: true }), 1800);
      } catch (error) {
        if (cancelled) return;
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          'Verification link is invalid or has expired.';
        setStatus('error');
        setMessage(msg);
        toast.error(msg);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1c2c]/85 via-[#036aa1]/55 to-[#0b1c2c]/90" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white/95 backdrop-blur-md shadow-trust p-6 sm:p-8 text-center">
        <img src="/img/wwaLogo.png" alt="World Wide Adverts" className="h-9 mx-auto mb-4" />
        <h1 className="font-display text-xl font-semibold text-slate-900 mb-2">Email verification</h1>

        {status === 'verifying' && (
          <p className="text-sm text-slate-600">Verifying your email securely…</p>
        )}
        {status === 'success' && (
          <p className="text-sm text-emerald-700 font-medium">{message}</p>
        )}
        {status === 'error' && (
          <>
            <p className="text-sm text-rose-600 mb-3">{message}</p>
            <p className="text-xs text-slate-500 mb-3">
              You can also verify with a 6-digit code during signup.
            </p>
          </>
        )}
        {status === 'missing' && (
          <p className="text-sm text-slate-600 mb-4">No verification token found in this link.</p>
        )}

        <Link
          to="/Login"
          className="inline-flex mt-4 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 hover:bg-primary/90 shadow-sm"
        >
          Go to Sign In
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
