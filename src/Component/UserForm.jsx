import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaShieldAlt, FaLock, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import Signin from "./Signin";
import Signup from "./Signup";
import BusinessSignup from "./auth/BusinessSignup";
import AccountTypeSelector from "./auth/AccountTypeSelector";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

/** High-quality auth panel imagery (basic vs business). */
const AUTH_IMAGES = {
  basic:
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80",
  business:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
};

function UserForm() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getRedirectAfterLogin, getAuthMessage, clearRedirect } = useAuthRedirect();
  const [showSignIn, SetShowSignIn] = useState(true);
  const [showSignUp, SetShowSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [accountType, setAccountType] = useState("basic");
  const [imgBroken, setImgBroken] = useState(false);

  const showSignInForm = useCallback(() => {
    SetShowSignIn(true);
    SetShowSignUp(false);
  }, []);

  const showSignupForm = useCallback(() => {
    SetShowSignIn(false);
    SetShowSignUp(true);
  }, []);

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setImgBroken(false);
    const params = new URLSearchParams(searchParams);
    params.set("type", type);
    if (showSignUp) params.set("tab", "signup");
    setSearchParams(params, { replace: true });
  };

  useEffect(() => {
    const redirectPath = getRedirectAfterLogin();
    const message = getAuthMessage();
    if (message) setAuthMessage(message);

    const token = localStorage.getItem("token") || localStorage.getItem("jwt_token");
    if (token && redirectPath) {
      navigate(redirectPath, { replace: true });
      clearRedirect();
    }
  }, [navigate, getRedirectAfterLogin, getAuthMessage, clearRedirect]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    const type = searchParams.get("type");
    if (tab === "signup") showSignupForm();
    else if (type === "business" && tab !== "signup") showSignInForm();
    if (type === "business" || type === "basic") setAccountType(type);
  }, [searchParams, showSignupForm, showSignInForm]);

  const isBusiness = accountType === "business";
  const panelImage = imgBroken
    ? "/img/login-bg.jpg"
    : AUTH_IMAGES[isBusiness ? "business" : "basic"];

  const panelCopy = isBusiness
    ? {
        title: "Business accounts",
        headline: "Grow your business with trusted advertising",
        quote:
          "Post and manage listings from category dashboards — stores, services, events, and more.",
        bullets: [
          "Pick your category when you register",
          "Dedicated business dashboards",
          "Post services, products & ads",
        ],
      }
    : {
        title: "Personal accounts",
        headline: "Browse, buy, and advertise with confidence",
        quote:
          "Explore marketplaces, save favorites, and post personal ads in a secure account.",
        bullets: [
          "Browse & buy across marketplaces",
          "Track purchases in one place",
          "Post personal Buy & Sell ads",
        ],
      };

  return (
    <div className="min-h-screen bg-[hsl(210_40%_98%)]">
      <div className="relative min-h-screen grid lg:grid-cols-2">
        {/* Visual panel */}
        <aside className="relative hidden lg:flex min-h-screen flex-col overflow-hidden text-white">
          <img
            src={panelImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setImgBroken(true)}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(165deg, rgba(2,28,48,0.78) 0%, rgba(3,106,161,0.55) 45%, rgba(11,28,44,0.92) 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_20%_10%,rgba(255,255,255,0.35),transparent_50%)]" />

          <div className="relative z-10 flex h-full flex-col p-8 xl:p-12">
            <Link to="/" className="inline-flex items-center gap-2 w-fit">
              <img src="/img/wwaLogo.png" alt="World Wide Adverts" className="h-10 drop-shadow" />
            </Link>

            <div className="mt-auto max-w-md space-y-4 pb-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-sky-200/90">
                {panelCopy.title}
              </p>
              <h2 className="font-display text-3xl xl:text-4xl font-semibold tracking-tight text-white leading-tight">
                {panelCopy.headline}
              </h2>
              <p className="text-sm xl:text-base text-slate-100/95 leading-relaxed">
                {panelCopy.quote}
              </p>
              <ul className="space-y-2.5 pt-2">
                {panelCopy.bullets.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/95">
                    <FaCheckCircle className="h-4 w-4 text-emerald-300 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 pt-4 text-xs text-sky-100/90">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/25 px-2.5 py-1.5 border border-white/15 backdrop-blur-sm">
                  <FaShieldAlt className="h-3 w-3 text-emerald-300" />
                  Clear ads policies
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/25 px-2.5 py-1.5 border border-white/15 backdrop-blur-sm">
                  <FaLock className="h-3 w-3 text-sky-200" />
                  Encrypted sign-in
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <div className="relative flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(3,106,161,0.06),transparent_50%)]" />

          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="mb-6 flex items-center justify-between gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
              >
                <FaArrowLeft className="h-3 w-3" />
                Back to home
              </Link>
              <Link to="/" className="lg:hidden shrink-0">
                <img src="/img/wwaLogo.png" alt="World Wide Adverts" className="h-8" />
              </Link>
            </div>

            {/* Mobile hero image strip */}
            <div className="lg:hidden relative mb-6 h-36 overflow-hidden rounded-2xl shadow-soft">
              <img
                src={panelImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setImgBroken(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c2c]/90 via-[#036aa1]/45 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="font-display text-lg font-semibold text-white">World Wide Adverts</p>
                <p className="text-xs text-sky-100/90 mt-0.5">Safe place to browse & advertise</p>
              </div>
            </div>

            {authMessage && (
              <div className="mb-4 bg-sky-50 border border-sky-200 text-sky-900 px-4 py-3 rounded-xl text-sm">
                {authMessage}
              </div>
            )}

            <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 sm:p-7 shadow-soft backdrop-blur-sm">
              <div className="space-y-1 mb-5">
                <h1 className="font-display text-2xl sm:text-[1.65rem] font-semibold text-slate-900 tracking-tight">
                  {showSignIn ? "Welcome back" : "Create your account"}
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Encrypted sign-in. Your details stay private and protected.
                </p>
              </div>

              <div className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 p-1 w-full mb-4">
                <button
                  type="button"
                  onClick={showSignInForm}
                  className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-semibold flex-1 transition-all ${
                    showSignIn ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={showSignupForm}
                  className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-semibold flex-1 transition-all ${
                    showSignUp ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <AccountTypeSelector
                value={accountType}
                onChange={handleAccountTypeChange}
                mode={showSignIn ? "signin" : "signup"}
              />

              <div className="mt-5">
                {showSignIn && (
                  <Signin showSignupForm={showSignupForm} accountType={accountType} />
                )}
                {showSignUp && accountType === "business" && (
                  <BusinessSignup showSignInForm={showSignInForm} />
                )}
                {showSignUp && accountType === "basic" && (
                  <Signup showSignInForm={showSignInForm} />
                )}
              </div>
            </div>

            <p className="mt-5 text-center text-[11px] text-slate-400 leading-relaxed">
              By continuing you agree to our{" "}
              <Link to="/help/terms-of-use" className="text-primary hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/help/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
