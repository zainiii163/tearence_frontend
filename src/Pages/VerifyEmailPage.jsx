import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthService from '../services/AuthService';

/**
 * Handles magic-link email verification: /verify-email/:token
 * Also accepts ?token= for query-style links.
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
        <img src="/img/wwaLogo.png" alt="World Wide Adverts" className="h-8 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Email verification</h1>

        {status === 'verifying' && (
          <p className="text-sm text-gray-600">Verifying your email…</p>
        )}
        {status === 'success' && (
          <p className="text-sm text-green-700">{message}</p>
        )}
        {status === 'error' && (
          <>
            <p className="text-sm text-red-600 mb-4">{message}</p>
            <p className="text-xs text-gray-500 mb-3">
              You can also verify with a 6-digit code during signup.
            </p>
          </>
        )}
        {status === 'missing' && (
          <p className="text-sm text-gray-600 mb-4">No verification token found in this link.</p>
        )}

        <Link
          to="/Login"
          className="inline-flex mt-4 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 hover:bg-primary/90"
        >
          Go to Sign In
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
