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

  const inputClass =
    'mt-1 w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40';

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1c2c]/88 via-[#036aa1]/50 to-[#0b1c2c]/92" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white/95 backdrop-blur-md p-6 sm:p-8 shadow-trust">
        <img src="/img/wwaLogo.png" alt="World Wide Adverts" className="h-8 mb-4" />
        <h1 className="font-display text-xl font-semibold text-slate-900">Set a new password</h1>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Choose a strong password for your World Wide Adverts account.
        </p>

        {!token ? (
          <p className="mt-4 text-sm text-amber-900 bg-amber-50 border border-amber-100 rounded-xl p-3">
            This page needs a valid reset link from your email.{' '}
            <Link to="/Login" className="font-semibold text-primary hover:underline">
              Request a new reset link
            </Link>
            .
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-5 space-y-3.5">
          <div>
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">New password</label>
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Confirm password</label>
            <input
              type="password"
              className={inputClass}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Updating…' : 'Update password securely'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          <Link to="/Login" className="text-primary font-semibold hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
