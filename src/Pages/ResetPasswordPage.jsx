import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { resetPassword } from '../slice/AuthSlice';

/**
 * Tokenized password reset (from email link: /reset-password?token=...&email=...).
 */
const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const emailFromLink = params.get('email') || '';

  const [email, setEmail] = useState(emailFromLink);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () => Boolean(token && email && password.length >= 8 && password === passwordConfirmation),
    [token, email, password, passwordConfirmation]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Reset link is missing or invalid. Request a new one.');
      return;
    }
    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await dispatch(
        resetPassword({
          email: email.trim(),
          token,
          password,
          password_confirmation: passwordConfirmation,
        })
      ).unwrap();
      toast.success('Password updated. You can sign in now.');
      navigate('/Login');
    } catch (err) {
      toast.error(err?.message || 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Set a new password</h1>
        <p className="text-sm text-slate-500 mt-1">
          Choose a strong password for your Worldwide Adverts account.
        </p>

        {!token ? (
          <p className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg p-3">
            This page needs a valid reset link from your email.{' '}
            <Link to="/Login" className="font-semibold underline">
              Request a new reset link
            </Link>
            .
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full h-10 rounded-md border px-3 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">New password</label>
            <input
              type="password"
              className="mt-1 w-full h-10 rounded-md border px-3 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm password</label>
            <input
              type="password"
              className="mt-1 w-full h-10 rounded-md border px-3 text-sm"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full h-10 rounded-md bg-blue-600 text-white text-sm font-semibold disabled:opacity-50"
          >
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          <Link to="/Login" className="text-blue-600 font-medium">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
