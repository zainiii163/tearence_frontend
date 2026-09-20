import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import AuthService from '../services/AuthService';
import { getUserDetails } from '../slice/AuthSlice';

const CODE_LENGTH = 6;

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { logIn } = useSelector((store) => store.auth || {});

  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const from = location.state?.from || 'post';

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-advance to next input
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === CODE_LENGTH - 1) {
      const fullCode = newCode.join('');
      if (fullCode.length === CODE_LENGTH) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;

    const newCode = Array(CODE_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);

    const nextEmpty = newCode.findIndex((d) => !d);
    const focusIndex = nextEmpty === -1 ? CODE_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === CODE_LENGTH) {
      handleVerify(pasted);
    }
  };

  const handleVerify = async (fullCode) => {
    setVerifying(true);
    setError('');
    try {
      await AuthService.verifyEmail(fullCode);
      setSuccess(true);
      toast.success('Email verified!');

      // Refresh Redux state
      if (logIn) {
        try {
          await dispatch(getUserDetails()).unwrap();
        } catch {
          // Fallback: update localStorage directly
          try {
            const cached = JSON.parse(localStorage.getItem('user') || '{}');
            if (cached.data) {
              cached.data.email_verified_at = new Date().toISOString();
              cached.data.email_verified = true;
            } else {
              cached.email_verified_at = new Date().toISOString();
              cached.email_verified = true;
            }
            localStorage.setItem('user', JSON.stringify(cached));
          } catch { /* ignore */ }
        }
      }

      // Redirect after short delay
      setTimeout(() => {
        if (logIn) {
          navigate('/communities', { replace: true });
        } else {
          navigate('/Login', { replace: true });
        }
      }, 1800);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid or expired code. Please try again.');
      setCode(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await AuthService.resendVerificationEmail();
      toast.success('New code sent! Check your inbox.');
      setCode(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === CODE_LENGTH) {
      handleVerify(fullCode);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1c2c]/85 via-[#036aa1]/55 to-[#0b1c2c]/90" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-white/95 backdrop-blur-md shadow-trust p-6 sm:p-8 text-center">
        <img src="/img/wwaLogo.png" alt="World Wide Adverts" className="h-9 mx-auto mb-4" />
        <h1 className="font-display text-xl font-semibold text-slate-900 mb-2">Verify your email</h1>

        {success ? (
          <p className="text-sm text-emerald-700 font-medium">
            Email verified successfully! Redirecting...
          </p>
        ) : (
          <>
            <p className="text-sm text-slate-600 mb-1">
              Enter the 6-digit code sent to your email address.
            </p>
            <p className="text-xs text-slate-400 mb-6">
              Check your inbox (and spam folder).
            </p>

            <form onSubmit={handleManualSubmit}>
              <div className="flex justify-center gap-2 mb-4">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    disabled={verifying}
                    className="w-11 h-12 text-center text-lg font-semibold rounded-lg border border-slate-200 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition disabled:opacity-50"
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={verifying || code.join('').length < CODE_LENGTH}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-semibold shadow-sm hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifying ? 'Verifying...' : 'Verify email'}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-teal-600 font-medium hover:text-teal-800 disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend verification code'}
              </button>
              <div>
                <Link
                  to={logIn ? '/communities' : '/Login'}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  {from === 'post' ? 'Skip for now' : 'Back to login'}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
