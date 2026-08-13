import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthErrorAndMessage, signIn, signUp } from '../../slice/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import VerificationFields from '../shared/VerificationFields';
import { BUSINESS_DASHBOARD_CATEGORIES } from '../Business/businessCategoryDashboardConfig';
import { getCategoryDashboardPath } from '../../utils/accountType';

/**
 * Business signup — category FIRST (before account details), then credentials.
 * Clive: they choose homepage category when they sign up → matching dashboard.
 */
function BusinessSignup({ showSignInForm }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1); // 1 = category, 2 = account
  const [verification, setVerification] = useState({ emailVerified: false });
  const [formData, setFormData] = useState({
    first_name: 'Business',
    last_name: 'Owner',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    business_name: '',
    dashboard_category: '',
    user_type: 'business',
  });

  const selectedCategory = useMemo(
    () => BUSINESS_DASHBOARD_CATEGORIES.find((c) => c.id === formData.dashboard_category) || null,
    [formData.dashboard_category]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onVerificationChange = useCallback((v) => setVerification(v), []);

  const pickCategory = (id) => {
    setFormData((prev) => ({ ...prev, dashboard_category: id }));
  };

  const goToAccountStep = () => {
    if (!formData.dashboard_category) {
      toast.error('Choose your business category first.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dashboard_category) {
      toast.error('Choose your business category first.');
      setStep(1);
      return;
    }
    if (!formData.business_name.trim()) {
      toast.error('Business name is required.');
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

    const catId = formData.dashboard_category;
    const catMeta = BUSINESS_DASHBOARD_CATEGORIES.find((c) => c.id === catId);

    try {
      const nameParts = formData.business_name.trim().split(/\s+/);
      const payload = {
        ...formData,
        first_name: nameParts[0] || 'Business',
        last_name: nameParts.slice(1).join(' ') || 'Owner',
        email_verified: Boolean(verification.emailVerified),
        // Backend stores this on customer + CustomerBusiness at register
        business_category: catId,
        business_category_slug: catId,
        business_category_name: catMeta?.name || catId,
      };
      await dispatch(signUp({ formData: payload })).unwrap();

      try {
        await dispatch(
          signIn({
            formData: {
              email: formData.email.trim(),
              password: formData.password,
            },
          })
        ).unwrap();
        toast.success(`Welcome! Opening your ${catMeta?.name || 'business'} dashboard.`);
        try {
          localStorage.setItem('wwa_login_account_type', 'business');
          localStorage.setItem('wwa_dashboard_mode', 'selling');
          localStorage.setItem(
            'wwa_business_profile_draft',
            JSON.stringify({
              dashboard_category: catId,
              business_category: catMeta?.name || catId,
              business_category_slug: catId,
              business_name: formData.business_name.trim(),
              category_chosen_at_signup: true,
            })
          );
          sessionStorage.removeItem('wwa_biz_dash_redirected');
        } catch {
          /* ignore */
        }
        // Category already chosen — land on dashboard (company docs optional later)
        navigate(getCategoryDashboardPath(catId));
      } catch {
        toast.success('Account created! Sign in to open your category dashboard.');
        navigate('/Login?type=business');
        showSignInForm?.();
      }
    } catch (error) {
      toast.error(error?.message || 'Registration failed');
    }
  };

  useEffect(() => {
    dispatch(clearAuthErrorAndMessage());
  }, [dispatch]);

  const inputClass =
    'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/40';

  return (
    <div className="grid gap-5">
      <div className="grid gap-1.5 text-left">
        <h2 className="text-lg font-semibold text-slate-900">Register your business</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          {step === 1
            ? 'Step 1 — Pick your category before creating your account'
            : 'Step 2 — Create your login for this category dashboard'}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span
            className={`h-1.5 w-10 rounded-full ${step === 1 ? 'bg-primary' : 'bg-primary/40'}`}
          />
          <span
            className={`h-1.5 w-10 rounded-full ${step === 2 ? 'bg-primary' : 'bg-slate-200'}`}
          />
        </div>
      </div>

      {step === 1 && (
        <div className="grid gap-4">
          <p className="text-sm text-center text-muted-foreground">
            This decides which dashboard you get (Vehicles, Property, Jobs…). Choose before you sign up.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[52vh] overflow-y-auto pr-1">
            {BUSINESS_DASHBOARD_CATEGORIES.map((c) => {
              const Icon = c.icon;
              const selected = formData.dashboard_category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => pickCategory(c.id)}
                  className={`relative text-left rounded-xl border p-3 transition ${
                    selected
                      ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                      : 'border-border hover:border-primary/40 bg-background'
                  }`}
                >
                  {selected && (
                    <span className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <FiCheck className="h-3 w-3" />
                    </span>
                  )}
                  <div
                    className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${c.color} text-white`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {c.emoji} {c.name}
                  </p>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={goToAccountStep}
            disabled={!formData.dashboard_category}
            className="inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 w-full disabled:opacity-50 shadow-sm"
          >
            Continue with {selectedCategory ? selectedCategory.name : 'category'}
            <FiArrowRight className="h-4 w-4" />
          </button>

          <p className="text-xs text-center text-muted-foreground">
            Already have a business account?{' '}
            <button type="button" onClick={showSignInForm} className="underline">
              Sign in
            </button>
          </p>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="grid gap-4">
          {selectedCategory && (
            <div
              className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 bg-gradient-to-r ${selectedCategory.color} text-white`}
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-white/80 font-semibold">
                  Your dashboard
                </p>
                <p className="text-sm font-bold truncate">
                  {selectedCategory.emoji} {selectedCategory.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="shrink-0 text-xs font-semibold underline text-white/95"
              >
                Change
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground w-fit"
          >
            <FiArrowLeft className="h-4 w-4" /> Back to categories
          </button>

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
            {loading
              ? 'Creating account…'
              : `Create ${selectedCategory?.name || 'business'} account`}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            Company certificate, VAT and tax details can be added later from your dashboard.
          </p>
        </form>
      )}
    </div>
  );
}

export default BusinessSignup;
