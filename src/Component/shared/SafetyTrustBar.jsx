import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaLock, FaUserCheck } from "react-icons/fa";

/**
 * Compact safety reassurance — intended for the page bottom (footer), not the navbar.
 */
function SafetyTrustBar({ className = "", variant = "light" }) {
  const isDark = variant === "dark";

  return (
    <div
      className={
        isDark
          ? `w-full border-b border-white/10 bg-[#0e2436] ${className}`
          : `w-full border-t border-emerald-100/80 bg-gradient-to-r from-emerald-50 via-sky-50 to-slate-50 ${className}`
      }
      role="navigation"
      aria-label="Safety and trust"
    >
      <div
        className={`page-container flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 py-2.5 text-[11px] sm:text-xs ${
          isDark ? "text-slate-300" : "text-slate-600"
        }`}
      >
        <Link
          to="/help/ads-policies"
          className={`inline-flex items-center gap-1.5 font-medium underline-offset-2 hover:underline ${
            isDark ? "text-slate-200 hover:text-white" : "text-slate-700 hover:text-primary"
          }`}
        >
          <FaShieldAlt
            className={`h-3 w-3 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
            aria-hidden
          />
          Safe place to browse & advertise
        </Link>
        <span className={`hidden sm:inline ${isDark ? "text-slate-600" : "text-slate-300"}`} aria-hidden>
          ·
        </span>
        <Link
          to="/help/privacy-policy"
          className={`inline-flex items-center gap-1.5 underline-offset-2 hover:underline ${
            isDark ? "hover:text-white" : "hover:text-primary"
          }`}
        >
          <FaLock className={`h-3 w-3 ${isDark ? "text-sky-400" : "text-primary"}`} aria-hidden />
          Encrypted login
        </Link>
        <span className={`hidden md:inline ${isDark ? "text-slate-600" : "text-slate-300"}`} aria-hidden>
          ·
        </span>
        <Link
          to="/help/ads-policies"
          className={`inline-flex items-center gap-1.5 underline-offset-2 hover:underline ${
            isDark ? "hover:text-white" : "hover:text-primary"
          }`}
        >
          <FaUserCheck className={`h-3 w-3 ${isDark ? "text-sky-300" : "text-sky-600"}`} aria-hidden />
          Clear ads policies
        </Link>
        <Link
          to="/help/privacy-policy"
          className={`font-semibold underline-offset-2 hover:underline ${
            isDark ? "text-sky-300 hover:text-white" : "text-primary"
          }`}
        >
          Privacy
        </Link>
        <Link
          to="/help/ads-policies"
          className={`font-semibold underline-offset-2 hover:underline ${
            isDark ? "text-sky-300 hover:text-white" : "text-primary"
          }`}
        >
          Ads safety
        </Link>
        <Link
          to="/help/help"
          className={`font-semibold underline-offset-2 hover:underline ${
            isDark ? "text-sky-300 hover:text-white" : "text-primary"
          }`}
        >
          Help & Q&A
        </Link>
      </div>
    </div>
  );
}

export default SafetyTrustBar;
