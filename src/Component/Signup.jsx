import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthErrorAndMessage, signUp } from "../slice/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { extractReferralCodeFromUrl, validateReferralCode } from "../utils/referralHelper";
function Signup(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, authMessage } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    referral_code: "",
  });

  const [referralInfo, setReferralInfo] = useState(null);
  const [referralError, setReferralError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      await dispatch(signUp({ formData })).unwrap()
      toast.success("Account created successfully! Please complete KYC verification to continue.");
      navigate("/kyc-verification");
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

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Create an account</h1>
          <p className="text-balance text-muted-foreground text-sm sm:text-base">
            Enter your information to create your account
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="first_name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                First name
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                placeholder="Enter your first name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="last_name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Last name
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                placeholder="Enter your last name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password_confirmation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Confirm password
            </label>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              placeholder="Confirm your password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Referral Code Section */}
          <div className="grid gap-2">
            <label htmlFor="referral_code" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Referral Code (Optional)
            </label>
            <input
              id="referral_code"
              type="text"
              name="referral_code"
              placeholder="Enter referral code (e.g., ABC12345)"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.referral_code}
              onChange={handleChange}
              maxLength={8}
            />
            <p className="text-xs text-muted-foreground">
              Enter a referral code to get 20% discount on your first advert
            </p>
          </div>

          {/* Referral Info/Error Display */}
          {referralInfo && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm text-green-800">
                🎉 {referralInfo.message}
              </p>
            </div>
          )}
          
          {referralError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800">
                ⚠️ {referralError}
              </p>
            </div>
          )}

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mt-0.5"
              required
            />
            <label
              htmlFor="terms"
              className="text-xs sm:text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link to="/help/terms-and-condition" className="underline text-primary hover:text-primary/80">
                terms & conditions
              </Link>
            </label>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </form>
      {authMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {authMessage}
        </div>
      )}
      <div className="text-center text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={props.showSignInForm}
          className="underline"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

export default Signup;
