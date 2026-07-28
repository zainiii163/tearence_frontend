import { useCallback, useState } from 'react';
import verificationAPI from '../api/verificationAPI';

/**
 * Live email/phone verification against /api/v1/verification/*.
 * Always verifies on the server — no client-side demo OTP.
 */
export const useVerification = () => {
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [loading, setLoading] = useState({ email: false, phone: false, company: false });
  const [companyVerified, setCompanyVerified] = useState(null);
  /** Shown only when API returns a code because email/SMS delivery failed. */
  const [deliveryFallbackCode, setDeliveryFallbackCode] = useState(null);

  const sendEmailCode = useCallback(async (email) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Enter a valid email address first');
    }
    setLoading((p) => ({ ...p, email: true }));
    setDeliveryFallbackCode(null);
    try {
      const res = await verificationAPI.sendEmailOtp(email);
      const payload = res?.data ?? res;
      setEmailCodeSent(true);
      setEmailVerified(false);

      const code = payload?.dev_code ? String(payload.dev_code) : null;
      if (code) {
        setDeliveryFallbackCode(code);
        return code;
      }
      return null;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message || error?.message || 'Failed to send email verification code'
      );
    } finally {
      setLoading((p) => ({ ...p, email: false }));
    }
  }, []);

  const sendPhoneCode = useCallback(async (phone, country = '') => {
    if (!phone || phone.replace(/\D/g, '').length < 8) {
      throw new Error('Enter a valid phone number first');
    }
    setLoading((p) => ({ ...p, phone: true }));
    setDeliveryFallbackCode(null);
    try {
      const res = await verificationAPI.sendPhoneOtp(phone, country);
      const payload = res?.data ?? res;
      setPhoneCodeSent(true);
      setPhoneVerified(false);
      const code = payload?.dev_code || null;
      if (code) {
        setDeliveryFallbackCode(String(code));
        return String(code);
      }
      return null;
    } catch (error) {
      throw new Error(
        error?.response?.data?.message || error?.message || 'Failed to send SMS verification code'
      );
    } finally {
      setLoading((p) => ({ ...p, phone: false }));
    }
  }, []);

  const verifyEmailCode = useCallback(async (input, email) => {
    if (!input?.trim()) return false;
    if (!email?.trim()) {
      throw new Error('Enter your email before verifying the code');
    }
    try {
      const res = await verificationAPI.verifyEmailOtp(email, input.trim());
      const payload = res?.data ?? res;
      const ok =
        res?.status === 'Success' ||
        res?.status === 'success' ||
        res?.success === true ||
        payload?.verified === true ||
        payload?.success === true ||
        payload?.status === 'Success' ||
        String(payload?.message || '')
          .toLowerCase()
          .includes('verif');
      if (ok) {
        setEmailVerified(true);
        setDeliveryFallbackCode(null);
        return true;
      }
      throw new Error(payload?.message || res?.message || 'Invalid or expired verification code');
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || 'Email verification failed';
      throw new Error(msg);
    }
  }, []);

  const verifyPhoneCode = useCallback(async (input, phone) => {
    if (!input?.trim()) return false;
    if (!phone?.trim()) {
      throw new Error('Enter your phone before verifying the code');
    }
    try {
      const res = await verificationAPI.verifyPhoneOtp(phone, input.trim());
      const payload = res?.data ?? res;
      const ok =
        res?.status === 'Success' ||
        res?.status === 'success' ||
        res?.success === true ||
        payload?.verified === true ||
        payload?.success === true ||
        payload?.status === 'Success' ||
        String(payload?.message || '')
          .toLowerCase()
          .includes('verif');
      if (ok) {
        setPhoneVerified(true);
        setDeliveryFallbackCode(null);
        return true;
      }
      throw new Error(payload?.message || res?.message || 'Invalid or expired verification code');
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || 'Phone verification failed';
      throw new Error(msg);
    }
  }, []);

  const verifyCompany = useCallback(async ({ companyNumber, vatNumber, country }) => {
    if (!companyNumber?.trim()) {
      throw new Error('Company registration number is required');
    }
    setLoading((p) => ({ ...p, company: true }));
    try {
      const res = await verificationAPI.verifyCompany({ companyNumber, vatNumber, country });
      const verified = res?.data?.verified ?? res?.verified ?? true;
      setCompanyVerified(verified);
      return { verified, message: res?.message || res?.data?.message || 'Company verified' };
    } catch (error) {
      throw new Error(error?.response?.data?.message || 'Company verification failed');
    } finally {
      setLoading((p) => ({ ...p, company: false }));
    }
  }, []);

  const resetVerification = useCallback(() => {
    setEmailCodeSent(false);
    setPhoneCodeSent(false);
    setEmailVerified(false);
    setPhoneVerified(false);
    setDeliveryFallbackCode(null);
    setCompanyVerified(null);
  }, []);

  return {
    emailCodeSent,
    phoneCodeSent,
    emailVerified,
    phoneVerified,
    isFullyVerified: emailVerified && phoneVerified,
    demoMode: false,
    deliveryFallbackCode,
    loading,
    companyVerified,
    sendEmailCode,
    sendPhoneCode,
    verifyEmailCode,
    verifyPhoneCode,
    verifyCompany,
    resetVerification,
    setEmailVerified,
    setPhoneVerified,
  };
};

export default useVerification;
