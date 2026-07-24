import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthErrorAndMessage, signUp } from '../../slice/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import VerificationFields from '../shared/VerificationFields';

/**
 * Short global business signup (Clive): business name, email OTP, mobile + password.
 * Email verified on signup; mobile verified on first post. Company docs after login.
 */
function BusinessSignup({ showSignInForm }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [verification, setVerification] = useState({ emailVerified: false });
  const [formData, setFormData] = useState({
    first_name: 'Business',
    last_name: 'Owner',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    business_name: '',
    user_type: 'business',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onVerificationChange = useCallback((v) => setVerification(v), []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.business_name.trim()) {
      toast.error('Business name is required.');
      return;
    }
    if (!verification.emailVerified) {
      toast.error('Please verify your email before registering.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Enter a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 8) {
      toast.error('Enter a valid mobile number.');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const nameParts = formData.business_name.trim().split(/\s+/);
      const payload = {
        ...formData,
        first_name: nameParts[0] || 'Business',
        last_name: nameParts.slice(1).join(' ') || 'Owner',
      };
      await dispatch(signUp({ formData: payload })).unwrap();
      toast.success('Account created! Complete your business profile after signing in.');
      navigate('/my-business/dashboard?completeProfile=1');
    } catch (error) {
      toast.error(error?.message || 'Registration failed');
    }
  };

  useEffect(() => {
    dispatch(clearAuthErrorAndMessage());
  }, [dispatch]);

  const inputClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Register your business</h1>
          <p className="text-balance text-muted-foreground text-sm sm:text-base">
            Verify email on signup — mobile verification when you post; company docs after login
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="business_name" className="text-sm font-medium">
              Business name <span className="text-red-500">*</span>
            </label>
            <input
              id="business_name"
              name="business_name"
              required
              value={formData.business_name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Your trading / company name"
              autoComplete="organization"
            />
          </div>

          <VerificationFields
            mode="email"
            email={formData.email}
            onEmailChange={(v) => setFormData((p) => ({ ...p, email: v }))}
            onVerificationChange={onVerificationChange}
            compact
          />

          <div className="grid gap-2">
            <label htmlFor="biz_phone" className="text-sm font-medium">
              Mobile number <span className="text-red-500">*</span>
              <span className="text-muted-foreground font-normal"> (verify when you post)</span>
            </label>
            <input
              id="biz_phone"
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="Include country code, e.g. +1…"
              autoComplete="tel"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="biz_password" className="text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="biz_password"
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
              autoComplete="new-password"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="biz_password_confirmation" className="text-sm font-medium">
              Confirm password <span className="text-red-500">*</span>
            </label>
            <input
              id="biz_password_confirmation"
              type="password"
              name="password_confirmation"
              required
              value={formData.password_confirmation}
              onChange={handleChange}
              className={inputClass}
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-start space-x-2">
            <input type="checkbox" id="biz_terms" required className="mt-1 h-4 w-4" />
            <label htmlFor="biz_terms" className="text-xs sm:text-sm">
              I agree to the{' '}
              <Link to="/help/terms-and-condition" className="underline text-primary">
                terms & conditions
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 w-full disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create business account'}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            After login you will add company certificate, company number, VAT, tax number and other details.
          </p>
        </div>
      </form>

      <div className="text-center text-sm">
        Already have a business account?{' '}
        <button type="button" onClick={showSignInForm} className="underline">
          Sign in
        </button>
      </div>
    </div>
  );
}

export default BusinessSignup;
