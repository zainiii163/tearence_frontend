import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthErrorAndMessage, signUp } from "../slice/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { extractReferralCodeFromUrl, validateReferralCode } from "../utils/referralHelper";
import VerificationFields from "./shared/VerificationFields";

function Signup(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, authMessage } = useSelector(
    (state) => state.auth
  );

  const [verification, setVerification] = useState({ emailVerified: false, isFullyVerified: false });
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    referral_code: "",
    user_type: "basic",
  });

  const [referralInfo, setReferralInfo] = useState(null);
  const [referralError, setReferralError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onVerificationChange = useCallback((v) => setVerification(v), []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clive: smooth signup — verify email later (before first post), not at register.
    if (
      formData.first_name.trim() === "" ||
      formData.last_name.trim() === "" ||
      formData.email.trim() === "" ||
      formData.password.trim() === "" ||
      formData.password_confirmation.trim() === ""
    ) {
      alert("All fields are required");
      return;
    }
    try {
      await dispatch(signUp({
        formData: {
          ...formData,
          email_verified: Boolean(verification.emailVerified),
        },
      })).unwrap()
      toast.success("Account created! Sign in to continue. Verify email before your first post.");
      navigate("/Login?type=basic");
      if (typeof props.showSignInForm === 'function') {
        props.showSignInForm();
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    dispatch(clearAuthErrorAndMessage());
    
    // Auto-populate referral code from URL
    const urlReferralCode = extractReferralCodeFromUrl();
    if (urlReferralCode) {
      setFormData(prev => ({ ...prev, referral_code: urlReferralCode }));
      
      // Validate referral code
      if (validateReferralCode(urlReferralCode)) {
        setReferralInfo({
          code: urlReferralCode,
          message: "You're using a referral code! You'll get 20% discount on your first advert."
        });
      } else {
        setReferralError("Invalid referral code format");
      }
    }
  }, [dispatch]);

  const inputClass =
    "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/40";

  return (
    <div className="grid gap-5">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <label htmlFor="first_name" className="text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              placeholder="Your first name"
              className={inputClass}
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="last_name" className="text-sm font-semibold text-slate-700">
              Surname
            </label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              placeholder="Your surname"
              className={inputClass}
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="username" className="text-sm font-semibold text-slate-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Choose a username"
              className={inputClass}
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
              Phone <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Include country code, e.g. +1…"
              className={inputClass}
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              className={inputClass}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              className={inputClass}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="password_confirmation" className="text-sm font-semibold text-slate-700">
              Confirm password
            </label>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              placeholder="Confirm your password"
              className={inputClass}
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>

          <VerificationFields
            mode="email"
            email={formData.email}
            onEmailChange={(email) => setFormData((prev) => ({ ...prev, email }))}
            onVerificationChange={onVerificationChange}
            compact
          />

          <div className="grid gap-1.5">
            <label htmlFor="referral_code" className="text-sm font-semibold text-slate-700">
              Referral code <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="referral_code"
              type="text"
              name="referral_code"
              placeholder="e.g. ABC12345"
              className={inputClass}
              value={formData.referral_code}
              onChange={handleChange}
              maxLength={8}
            />
            <p className="text-xs text-slate-500">
              Get 20% off your first advert with a valid referral code
            </p>
          </div>

          {referralInfo && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <p className="text-sm text-emerald-800">
                {referralInfo.message}
              </p>
            </div>
          )}
          
          {referralError && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
              <p className="text-sm text-rose-800">
                {referralError}
              </p>
            </div>
          )}

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30"
              required
            />
            <label
              htmlFor="terms"
              className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed"
            >
              I agree to the{" "}
              <Link to="/help/terms-and-condition" className="text-primary hover:underline">
                terms & conditions
              </Link>
            </label>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 w-full shadow-sm disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create secure account"}
          </button>
        </div>
      </form>
      {authMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {authMessage}
        </div>
      )}
      <div className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={props.showSignInForm}
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

export default Signup;
