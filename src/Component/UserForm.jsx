import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

function UserForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getRedirectAfterLogin, getAuthMessage, clearRedirect } = useAuthRedirect();
  const [showSignIn, SetShowSignIn] = useState(true);
  const [showSignUp, SetShowSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const showSignInForm = useCallback(() => {
    SetShowSignIn(true);
    SetShowSignUp(false);
  }, []);

  const showSignupForm = useCallback(() => {
    SetShowSignIn(false);
    SetShowSignUp(true);
  }, []);

  // Handle redirect and message on component mount
  useEffect(() => {
    // Get redirect destination and message
    const redirectPath = getRedirectAfterLogin();
    const message = getAuthMessage();
    
    if (message) {
      setAuthMessage(message);
    }

    // If user is already authenticated and has a redirect, navigate immediately
    const token = localStorage.getItem('jwt_token');
    if (token && redirectPath) {
      navigate(redirectPath, { replace: true });
      clearRedirect();
    }
  }, [navigate, getRedirectAfterLogin, getAuthMessage, clearRedirect]);

  // Handle URL parameters for tab switching
  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    if (queryParameters.get("tab") === "signup") {
      showSignupForm();
    }
  }, [showSignupForm]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Desktop sidebar - hidden on mobile */}
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
                "Connect with buyers and sellers worldwide. Your marketplace for everything."
              </p>
              <footer className="text-sm">World Wide Adverts Team</footer>
            </blockquote>
          </div>
          <div className="relative z-20 grid grid-cols-3 gap-4 mt-8 opacity-50">
            <img src="/img/login-logos/mgnit.jpeg" className="rounded-full w-12 h-12 lg:w-16 lg:h-16 object-cover" alt="MGNIT" />
            <img src="/img/login-logos/aisecs.jpeg" className="rounded-full w-12 h-12 lg:w-16 lg:h-16 object-cover" alt="AISECS" />
            <img src="/img/login-logos/mgnit-gaming.jpeg" className="rounded-full w-12 h-12 lg:w-16 lg:h-16 object-cover" alt="MGNIT Gaming" />
            <img src="/img/login-logos/b2b.jpeg" className="rounded-full w-12 h-12 lg:w-16 lg:h-16 object-cover" alt="B2B" />
            <img src="/img/login-logos/book-writting.jpeg" className="rounded-full w-12 h-12 lg:w-16 lg:h-16 object-cover" alt="Book Writing" />
            <img src="/img/login-logos/logo-1.jpeg" className="rounded-full w-12 h-12 lg:w-16 lg:h-16 object-cover" alt="Logo" />
          </div>
        </div>
        
        {/* Mobile header - visible only on mobile */}
        <div className="flex items-center justify-center p-4 lg:hidden">
          <img src="/img/wwaLogo.png" alt="World Wide Adverts" className="h-8" />
        </div>
        
        {/* Main content area */}
        <div className="flex items-center p-4 lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] lg:w-[350px]">
            {/* Authentication Message */}
            {authMessage && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
                {authMessage}
              </div>
            )}
            
            <div className="flex flex-col space-y-4 text-center">
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
                <button
                  onClick={showSignInForm}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                    showSignIn
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={showSignupForm}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
                    showSignUp
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>
            <div className="grid gap-6">
              {showSignIn && <Signin showSignupForm={showSignupForm} />}
              {showSignUp && <Signup showSignInForm={showSignInForm} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
