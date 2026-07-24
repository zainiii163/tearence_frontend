/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImCross } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  signIn,
  signUp,
  clearAuthErrorAndMessage,
  getUserDetails,
} from "../slice/AuthSlice";
import { clearAdsErrorAndMessage } from "../slice/StoreSlice";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

import toast from "react-hot-toast";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
} from "firebase/auth";
import ReCAPTCHA from "react-google-recaptcha";
import { twoFactorAPI } from "../api/twoFactorAPI";

// import LinkedInOAuth from "./LinkedInOAuth";

function Signin(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getRedirectAfterLogin, clearRedirect } = useAuthRedirect();
  const { logIn } = useSelector((store) => store.auth);
  const accountType = props.accountType || "basic";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [emailForget, setEmailForget] = useState("");

  const [showOverlay, setShowOverlay] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pending2faToken, setPending2faToken] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const finishLoginRedirect = () => {
    toast.success('Login successful!');
    const redirectPath = getRedirectAfterLogin();
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
      clearRedirect();
    } else if (accountType === 'business') {
      navigate('/my-business/dashboard', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  // Handle redirect after successful login
  useEffect(() => {
    if (logIn) {
      const redirectPath = getRedirectAfterLogin();
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
        clearRedirect();
      }
    }
  }, [logIn, navigate, getRedirectAfterLogin, clearRedirect]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleForgotPasswordClick = () => {
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (process.env.REACT_APP_GOOGLE_CAPTCHA_SITE_KEY && !recaptchaToken) {
      alert("Please complete the reCAPTCHA.");
      return;
    }
    setIsLoading(true);
    try {
      const signInResult = await dispatch(signIn({ formData })).unwrap();
      const data = signInResult?.data || signInResult;
      const requires2fa = !!(data?.requires_2fa || signInResult?.requires_2fa);

      if (requires2fa) {
        setPending2faToken(data?.pending_token || signInResult?.pending_token);
        toast('Enter your authenticator code to finish signing in.');
        return;
      }

      const token = data?.access_token || signInResult?.access_token || signInResult?.token;
      const userData = data?.user || signInResult?.user;

      if (token || userData || signInResult?.success) {
        if (!userData) {
          try {
            await dispatch(getUserDetails()).unwrap();
          } catch (userDetailsError) {
            console.warn('Failed to fetch user details after login:', userDetailsError);
          }
        }
        finishLoginRedirect();
      } else {
        throw new Error('Login failed - invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error?.message || error?.payload?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2fa = async (e) => {
    e.preventDefault();
    if (!pending2faToken || !twoFactorCode.trim()) return;
    setIsLoading(true);
    try {
      const res = await twoFactorAPI.verifyLogin({
        pending_token: pending2faToken,
        code: twoFactorCode.trim(),
      });
      const data = res?.data || res;
      const token = data?.access_token;
      const userData = data?.user;
      if (!token) throw new Error(res?.message || 'Invalid code');

      localStorage.setItem('token', token);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.id || userData.customer_id) {
          localStorage.setItem('customer_id', userData.id || userData.customer_id);
        }
      }
      // Re-dispatch a lightweight sync via getUserDetails after token is set
      try {
        await dispatch(getUserDetails()).unwrap();
      } catch {
        // still allow login with stored token
      }
      setPending2faToken(null);
      finishLoginRedirect();
      window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Invalid authentication code');
    } finally {
      setIsLoading(false);
    }
  };

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handlePasswordChange = () => {
    dispatch(forgotPassword({ email: emailForget }));
    closeOverlay();
    navigate("/Login");
  };
  
  useEffect(() => {
    dispatch(clearAuthErrorAndMessage());
    dispatch(clearAdsErrorAndMessage());
  }, [dispatch]);

  // Social Media Sign In
  const handleSignUpAndSignIn = async (payload) => {
    try {
      await dispatch(signUp({ formData: payload })).unwrap();
      setTimeout(async () => {
        await dispatch(
          signIn({
            formData: { email: payload.email, password: payload.password },
          })
        ).unwrap();
        await dispatch(getUserDetails()).unwrap();
        
        // Check for redirect path after social login
        const redirectPath = getRedirectAfterLogin();
        if (redirectPath) {
          navigate(redirectPath, { replace: true });
          clearRedirect();
        } else {
          navigate("/", { replace: true });
        }
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handlingAfterSocialMediaSignIn = async (result) => {
    try {
      const payload = { email: result.user.email, password: result.user.uid };
      await dispatch(signIn({ formData: payload })).unwrap();
      await dispatch(getUserDetails()).unwrap();
      
      // Check for redirect path after social login
      const redirectPath = getRedirectAfterLogin();
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
        clearRedirect();
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      if (error.message === "Data not found.") {
        const fullName = result.user.displayName.trim();
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");
        const payloadSign = {
          first_name: firstName,
          last_name: lastName ?? firstName,
          email: result.user.email,
          password: result.user.uid,
          password_confirmation: result.user.uid,
        };
        handleSignUpAndSignIn(payloadSign);
      } else {
        toast.error(error.message);
      }
    }
  };
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handlingAfterSocialMediaSignIn(result);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  // const handleFacebookLogin = async () => {
  //   const provider = new FacebookAuthProvider();
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     await handlingAfterSocialMediaSignIn(result);
  //   } catch (error) {
  //     console.log(error);
  //     // if (error) {
  //     //   toast.error(error);
  //     // }
  //   }
  // };
  const handleXLogin = async () => {
    const provider = new TwitterAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handlingAfterSocialMediaSignIn(result);
    } catch (error) {
      console.error("X login error:", error);
    }
  };

  return (
    <div className="grid gap-6">
      {pending2faToken ? (
        <form onSubmit={handleVerify2fa} className="grid gap-4">
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">Two-factor authentication</h1>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code from your authenticator app (or a recovery code).
            </p>
          </div>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm tracking-widest"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            placeholder="000000"
            autoFocus
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {isLoading ? 'Verifying…' : 'Verify & continue'}
          </button>
          <button
            type="button"
            className="text-sm underline text-muted-foreground"
            onClick={() => {
              setPending2faToken(null);
              setTwoFactorCode('');
            }}
          >
            Back to sign in
          </button>
        </form>
      ) : (
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {accountType === 'business' ? 'Business sign in' : 'Welcome back'}
          </h1>
          <p className="text-balance text-muted-foreground text-sm sm:text-base">
            {accountType === 'business'
              ? 'Access your business dashboard to post and manage listings'
              : 'Enter your credentials to access your account'}
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email
            </label>
            <input
              id="email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="username"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <Link
                to="#"
                onClick={handleForgotPasswordClick}
                className="text-xs sm:text-sm underline text-primary hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          {process.env.REACT_APP_GOOGLE_CAPTCHA_SITE_KEY && (
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_GOOGLE_CAPTCHA_SITE_KEY}
              onChange={onRecaptchaChange}
            />
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </form>
      )}
      {!pending2faToken && (
      <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-2 sm:px-4 py-2"
          title="Sign in with Google"
        >
          <svg className="h-4 w-4" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={handleXLogin}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-2 sm:px-4 py-2"
          title="Sign in with X (Twitter)"
        >
          <svg className="h-4 w-4" viewBox="0 0 50 50">
            <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z" />
          </svg>
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-2 sm:px-4 py-2"
          title="Sign in with LinkedIn"
        >
          <svg className="h-4 w-4" viewBox="0 0 48 48">
            <path
              fill="#0078d4"
              d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
            />
            <path
              fill="#fff"
              d="M12,19h5v17h-5V19z M14.485,17h-0.028C12.965,17,12,15.888,12,14.499C12,13.08,12.995,12,14.514,12c1.521,0,2.458,1.08,2.486,2.499C17,15.887,16.035,17,14.485,17z M36,36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698c-1.501,0-2.313,1.012-2.707,1.99C24.957,25.543,25,26.511,25,27v9h-5V19h5v2.616C25.721,20.5,26.85,19,29.738,19c3.578,0,6.261,2.25,6.261,7.274L36,36L36,36z"
            />
          </svg>
        </button>
      </div>
      </>
      )}
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={props.showSignupForm}
          className="underline"
        >
          Sign up
        </button>
      </div>
      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-lg w-full max-w-md p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeOverlay}
              className="absolute right-2 top-2 sm:right-4 sm:top-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
            >
              <ImCross className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <div className="space-y-4 pr-8 sm:pr-0">
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-semibold">Reset Password</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your email address and we'll send you a reset link.
                </p>
              </div>
              <div className="grid gap-2">
                <label htmlFor="reset-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your email"
                  value={emailForget}
                  onChange={(e) => setEmailForget(e.target.value)}
                />
              </div>
              <button
                onClick={handlePasswordChange}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signin;
