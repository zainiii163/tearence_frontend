import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaSearch,
  FaPlus,
  FaHeart,
  FaUser,
  FaArrowUp,
} from "react-icons/fa";
import { getDashboardHomePath, resolveAccountType } from "../../utils/accountType";
import AuthRequiredModal from "./AuthRequiredModal";

const HIDDEN_PATHS = [
  /^\/dashboard/i,
  /^\/admin/i,
  /^\/Login/i,
  /^\/register/i,
  /^\/verify-email/i,
  /^\/reset-password/i,
  /^\/messages/i,
  /^\/affiliate-dashboard/i,
  /^\/affiliate\/dashboard/i,
  /^\/funding\/dashboard/i,
  /^\/my-business\/dashboard/i,
];

const shouldHideChrome = (pathname) =>
  HIDDEN_PATHS.some((re) => re.test(pathname));

function SkipToContent() {
  return (
    <a
      href="#wwa-main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[600] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
    >
      Skip to content
    </a>
  );
}

function ScrollToTopButton({ bottomClass }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-3 z-[90] inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-trust border border-white/10 transition hover:bg-primary ${bottomClass}`}
      aria-label="Back to top"
    >
      <FaArrowUp className="h-4 w-4" />
    </button>
  );
}

function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logIn } = useSelector((store) => store.auth);
  const { userDetail } = useSelector((store) => store.auth);
  const accountType = resolveAccountType(userDetail);
  const dashboardHome = getDashboardHomePath(accountType);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const itemClass = (active) =>
    `flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-semibold transition-colors ${
      active ? "text-primary" : "text-slate-500"
    }`;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-[95] md:hidden border-t border-slate-200/90 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_-12px_rgba(15,23,42,0.18)]"
      aria-label="Quick navigation"
    >
      <div className="flex items-stretch h-14 px-1">
        <Link to="/" className={itemClass(isActive("/") && location.pathname === "/")}>
          <FaHome className="h-4 w-4" />
          Home
        </Link>
        <Link to="/category-menu" className={itemClass(isActive("/category-menu") || isActive("/search-results"))}>
          <FaSearch className="h-4 w-4" />
          Search
        </Link>
        <Link
          to="/post-ad"
          className="relative flex flex-1 flex-col items-center justify-center -mt-3"
          aria-label="Post an advert"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-soft border-4 border-white">
            <FaPlus className="h-5 w-5" />
          </span>
          <span className="text-[10px] font-semibold text-primary mt-0.5">Post</span>
        </Link>
        <Link
          to={logIn ? "/favorite-ads" : "/Login"}
          className={itemClass(isActive("/favorite-ads"))}
        >
          <FaHeart className="h-4 w-4" />
          Saved
        </Link>
        <button
          type="button"
          onClick={() => {
            if (logIn) navigate(dashboardHome);
            else navigate("/Login");
          }}
          className={itemClass(isActive("/dashboard") || isActive("/Login"))}
        >
          <FaUser className="h-4 w-4" />
          {logIn ? "Account" : "Login"}
        </button>
      </div>
    </nav>
  );
}

/**
 * Site-wide UX chrome: skip link, mobile nav, back-to-top.
 * Help / Q&A lives on /help/help and in the footer (no floating "?" buttons).
 */
export default function SiteUxShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const hidden = shouldHideChrome(location.pathname);

  useEffect(() => {
    const open = () => navigate("/help/help");
    window.addEventListener("wwa-open-help", open);
    return () => window.removeEventListener("wwa-open-help", open);
  }, [navigate]);

  useEffect(() => {
    if (hidden) {
      document.body.classList.remove("wwa-has-mobile-nav");
      return undefined;
    }
    document.body.classList.add("wwa-has-mobile-nav");
    return () => document.body.classList.remove("wwa-has-mobile-nav");
  }, [hidden]);

  return (
    <>
      <SkipToContent />
      <div id="wwa-main" tabIndex={-1} className="outline-none" />
      <AuthRequiredModal />
      {!hidden && (
        <>
          <ScrollToTopButton bottomClass="bottom-24 md:bottom-20" />
          <MobileBottomNav />
        </>
      )}
    </>
  );
}
