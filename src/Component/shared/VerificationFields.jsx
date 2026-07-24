import React, { useState } from 'react';
import { CheckCircle, Shield, Mail, Phone, Building2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useVerification from '../../hooks/useVerification';

const inputClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

/**
 * @param {'email'|'phone'|'both'} mode
 * Clive: email on signup; phone on first post.
 */
const VerificationFields = ({
  email = '',
  phone = '',
  onEmailChange,
  onPhoneChange,
  showBusinessFields = false,
  companyNumber = '',
  vatNumber = '',
  country = '',
  onCompanyNumberChange,
  onVatNumberChange,
  onCountryChange,
  onVerificationChange,
  compact = false,
  mode = 'both',
}) => {
  const verification = useVerification();
  const [emailCodeInput, setEmailCodeInput] = useState('');
  const [phoneCodeInput, setPhoneCodeInput] = useState('');
  const showEmail = mode === 'email' || mode === 'both';
  const showPhone = mode === 'phone' || mode === 'both';

  React.useEffect(() => {
    const emailOk = !showEmail || verification.emailVerified;
    const phoneOk = !showPhone || verification.phoneVerified;
    onVerificationChange?.({
      emailVerified: verification.emailVerified,
      phoneVerified: verification.phoneVerified,
      isFullyVerified: emailOk && phoneOk,
      companyVerified: verification.companyVerified,
    });
  }, [
    showEmail,
    showPhone,
    verification.emailVerified,
    verification.phoneVerified,
    verification.companyVerified,
    onVerificationChange,
  ]);

  const handleSendEmail = async () => {
    try {
      const code = await verification.sendEmailCode(email);
      if (code) {
        setEmailCodeInput(code);
        toast.success('Verification code ready — click Verify to continue.', { duration: 6000 });
      } else {
        toast.success(`Verification code sent to ${email}`);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVerifyEmail = async () => {
    const ok = await verification.verifyEmailCode(emailCodeInput, email);
    if (ok) toast.success('Email verified');
    else toast.error('Invalid or expired verification code');
  };

  const handleSendPhone = async () => {
    try {
      const code = await verification.sendPhoneCode(phone, country);
      if (code) {
        setPhoneCodeInput(code);
        toast.success('Verification code ready — click Verify to continue.', { duration: 6000 });
      } else {
        toast.success('SMS verification code sent');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVerifyPhone = async () => {
    const ok = await verification.verifyPhoneCode(phoneCodeInput, phone);
    if (ok) toast.success('Phone number verified');
    else toast.error('Invalid or expired verification code');
  };

  const handleVerifyCompany = async () => {
    try {
      const result = await verification.verifyCompany({ companyNumber, vatNumber, country });
      toast.success(result.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const helperText =
    mode === 'email'
      ? 'Verify your email to create your account. Mobile verification is required when you post.'
      : mode === 'phone'
        ? 'Verify your mobile number before posting.'
        : 'Email and phone must be verified.';

  return (
    <div className={`rounded-xl border border-blue-200 bg-blue-50/50 ${compact ? 'p-4' : 'p-5'} space-y-4`}>
      <div className="flex items-start gap-2">
        <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">
            {mode === 'email' ? 'Email verification' : mode === 'phone' ? 'Mobile verification' : 'Identity verification'}
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">{helperText}</p>
        </div>
      </div>

      {showEmail && (
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" /> Email{' '}
            {verification.emailVerified && <CheckCircle className="h-3.5 w-3.5 text-green-600" />}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange?.(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              readOnly={!onEmailChange}
            />
            {!verification.emailVerified && (
              <button
                type="button"
                onClick={handleSendEmail}
                disabled={verification.loading.email}
                className="shrink-0 px-3 py-2 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {verification.loading.email ? 'Sending…' : 'Send code'}
              </button>
            )}
          </div>
          {verification.emailCodeSent && !verification.emailVerified && (
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={emailCodeInput}
                onChange={(e) => setEmailCodeInput(e.target.value)}
                placeholder="6-digit code"
                className={inputClass}
              />
              <button
                type="button"
                onClick={handleVerifyEmail}
                className="px-3 py-2 text-xs font-semibold rounded-md border border-blue-600 text-blue-700"
              >
                Verify
              </button>
            </div>
          )}
        </div>
      )}

      {showPhone && (
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" /> Mobile{' '}
            {verification.phoneVerified && <CheckCircle className="h-3.5 w-3.5 text-green-600" />}
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange?.(e.target.value)}
              placeholder="Include country code, e.g. +1…"
              className={inputClass}
              readOnly={!onPhoneChange}
            />
            {!verification.phoneVerified && (
              <button
                type="button"
                onClick={handleSendPhone}
                disabled={verification.loading.phone}
                className="shrink-0 px-3 py-2 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {verification.loading.phone ? 'Sending…' : 'Send SMS'}
              </button>
            )}
          </div>
          {verification.phoneCodeSent && !verification.phoneVerified && (
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={phoneCodeInput}
                onChange={(e) => setPhoneCodeInput(e.target.value)}
                placeholder="6-digit code"
                className={inputClass}
              />
              <button
                type="button"
                onClick={handleVerifyPhone}
                className="px-3 py-2 text-xs font-semibold rounded-md border border-blue-600 text-blue-700"
              >
                Verify
              </button>
            </div>
          )}
        </div>
      )}

      {showBusinessFields && (
        <div className="pt-2 border-t border-blue-200 space-y-3">
          <p className="text-xs font-semibold text-gray-700 flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" /> Company details (any country)
          </p>
          {onCountryChange && (
            <div>
              <label className="text-xs font-medium text-gray-700">Country / region</label>
              <input
                type="text"
                value={country}
                onChange={(e) => onCountryChange(e.target.value)}
                placeholder="Country"
                className={inputClass}
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Company registration number</label>
              <input
                type="text"
                value={companyNumber}
                onChange={(e) => onCompanyNumberChange?.(e.target.value)}
                placeholder="Company number"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">VAT / tax number</label>
              <input
                type="text"
                value={vatNumber}
                onChange={(e) => onVatNumberChange?.(e.target.value)}
                placeholder="VAT / tax ID"
                className={inputClass}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleVerifyCompany}
            disabled={verification.loading.company || !companyNumber.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50"
          >
            {verification.loading.company ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Verify company
          </button>
          {verification.companyVerified === 'pending' && (
            <p className="text-xs text-amber-700">Company check queued for review.</p>
          )}
          {verification.companyVerified === true && (
            <p className="text-xs text-green-700 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> Company verified
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VerificationFields;
