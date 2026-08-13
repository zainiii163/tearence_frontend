import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaSearch,
  FaPlus,
  FaHeart,
  FaUser,
  FaArrowUp,
  FaTimes,
  FaQuestionCircle,
  FaBullhorn,
  FaShieldAlt,
  FaEnvelope,
  FaLifeRing,
} from "react-icons/fa";
import { getDashboardHomePath, resolveAccountType } from "../../utils/accountType";

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

function QuickHelpPanel({ open, onClose }) {
  if (!open) return null;

  const items = [
    {
      to: "/post-ad",
      icon: FaPlus,
      title: "Post an advert",
      desc: "Choose a category and publish in minutes.",
    },
    {
      to: "/category-menu",
      icon: FaSearch,
      title: "Find something",
      desc: "Browse categories or use search in the header.",
    },
    {
      to: "/adverts",
      icon: FaBullhorn,
      title: "Promote your ad",
      desc: "Sponsored, featured, promoted, or banner options.",
    },
    {
      to: "/help/ads-policies",
      icon: FaShieldAlt,
      title: "Stay safe",
      desc: "Read ads policies and privacy guidance.",
    },
    {
      to: "/help/help",
      icon: FaLifeRing,
      title: "Get help",
      desc: "Guides and answers for common questions.",
    },
    {
      to: "/about/contact",
      icon: FaEnvelope,
      title: "Contact us",
      desc: "Reach the World Wide Adverts team.",
    },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close help"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wwa-help-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-trust overflow-hidden"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5 bg-gradient-to-r from-sky-50 to-emerald-50">
          <div>
            <p id="wwa-help-title" className="text-base font-semibold text-slate-900">
              What can you do here?
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Quick actions to browse, post, promote, or get help.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-800"
            aria-label="Close"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
        <ul className="max-h-[min(70vh,420px)] overflow-y-auto p-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-slate-50 transition-colors"
                >
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{item.title}</span>
                    <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {item.desc}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function MobileBottomNav({ onOpenHelp }) {
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
      <button
        type="button"
        onClick={onOpenHelp}
        className="absolute right-2 -top-10 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-sm"
      >
        <FaQuestionCircle className="h-3 w-3 text-primary" />
        Help
      </button>
    </nav>
  );
}

function DesktopHelpButton({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="hidden md:inline-flex fixed right-3 bottom-3 z-[90] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 shadow-soft hover:border-primary/30 hover:text-primary transition-colors"
      aria-label="Open help — what you can do"
    >
      <FaQuestionCircle className="h-4 w-4 text-primary" />
      Help
    </button>
  );
}

/**
 * Site-wide friendly UX chrome: skip link, mobile nav, help, back-to-top.
 */
export default function SiteUxShell() {
  const location = useLocation();
  const hidden = shouldHideChrome(location.pathname);
  const [helpOpen, setHelpOpen] = useState(false);

  const openHelp = useCallback(() => setHelpOpen(true), []);
  const closeHelp = useCallback(() => setHelpOpen(false), []);

  useEffect(() => {
    const open = () => setHelpOpen(true);
    window.addEventListener("wwa-open-help", open);
    return () => window.removeEventListener("wwa-open-help", open);
  }, []);

  useEffect(() => {
    setHelpOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!helpOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setHelpOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [helpOpen]);

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
      {!hidden && (
        <>
          <ScrollToTopButton bottomClass="bottom-24 md:bottom-20" />
          <DesktopHelpButton onOpen={openHelp} />
          <MobileBottomNav onOpenHelp={openHelp} />
          <QuickHelpPanel open={helpOpen} onClose={closeHelp} />
        </>
      )}
    </>
  );
}
