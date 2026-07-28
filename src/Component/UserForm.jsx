import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";
import BusinessSignup from "./auth/BusinessSignup";
import AccountTypeSelector from "./auth/AccountTypeSelector";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

function UserForm() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getRedirectAfterLogin, getAuthMessage, clearRedirect } = useAuthRedirect();
  const [showSignIn, SetShowSignIn] = useState(true);
  const [showSignUp, SetShowSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [accountType, setAccountType] = useState("basic");

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-6 text-white lg:flex lg:p-10 dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: "url(/img/bg-login.jpg)" }}
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img src="/img/wwaLogo.png" alt="World Wide Adverts" className="h-8" />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &quot;Basic users browse and buy. Business accounts post from category dashboards — tow, mechanics, and more.&quot;
              </p>
              <footer className="text-sm">World Wide Adverts Team</footer>
            </blockquote>
          </div>
        </div>

        <div className="flex items-center justify-center p-4 lg:hidden">
          <img src="/img/wwaLogo.png" alt="World Wide Adverts" className="h-8" />
        </div>

        <div className="flex items-center p-4 lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] lg:w-[420px]">
            {authMessage && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
                {authMessage}
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
                <button
                  type="button"
                  onClick={showSignInForm}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium flex-1 transition-all ${
                    showSignIn ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={showSignupForm}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium flex-1 transition-all ${
                    showSignUp ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
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
            </div>

            <div className="grid gap-6">
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
        </div>
      </div>
    </div>
  );
}

export default UserForm;
