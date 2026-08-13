import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaLock, FaUserCheck } from "react-icons/fa";

/**
 * Compact safety reassurance — shown under the navbar so every visit starts calm.
 */
function SafetyTrustBar({ className = "" }) {
  return (
    <div
      className={`w-full border-b border-emerald-100/80 bg-gradient-to-r from-emerald-50 via-sky-50 to-slate-50 ${className}`}
      role="note"
      aria-label="Safety information"
    >
      <div className="page-container flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 py-1.5 text-[11px] sm:text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
          <FaShieldAlt className="h-3 w-3 text-emerald-600" aria-hidden />
          Safe place to browse & advertise
        </span>
        <span className="hidden sm:inline text-slate-300" aria-hidden>
          ·
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FaLock className="h-3 w-3 text-primary" aria-hidden />
          Encrypted login
        </span>
        <span className="hidden md:inline text-slate-300" aria-hidden>
          ·
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FaUserCheck className="h-3 w-3 text-sky-600" aria-hidden />
          Clear ads policies
        </span>
        <Link
          to="/help/privacy-policy"
          className="font-semibold text-primary hover:underline underline-offset-2"
        >
          Privacy
        </Link>
        <Link
          to="/help/ads-policies"
          className="font-semibold text-primary hover:underline underline-offset-2"
        >
          Ads safety
        </Link>
      </div>
    </div>
  );
}

export default SafetyTrustBar;
