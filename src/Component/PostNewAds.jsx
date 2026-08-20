import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaIndustry,
  FaBullhorn,
  FaCalendar,
  FaCar,
  FaBook,
  FaStar,
  FaPlane,
  FaMedal,
  FaChartLine,
  FaHome,
  FaBriefcase,
  FaUsers,
  FaHeart,
  FaCogs,
  FaSearch,
  FaRocket,
} from "react-icons/fa";
import { PiFlagBanner } from "react-icons/pi";
import UnifiedNavbar from "./UnifiedNavbar";
import Footer from "./Footer";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

const POSTING_OPTIONS = [
  {
    name: "Buy & Sell",
    hint: "Items for sale",
    icon: FaUsers,
    route: "/buy-sell?postForm=true",
  },
  {
    name: "Vehicles",
    hint: "Cars & bikes",
    icon: FaCar,
    route: "/post-vehicles",
  },
  {
    name: "Books",
    hint: "Books & publications",
    icon: FaBook,
    route: "/post-book",
  },
  {
    name: "Jobs",
    hint: "Vacancies & roles",
    icon: FaBriefcase,
    route: "/post/jobs",
  },
  {
    name: "Property",
    hint: "Homes & land",
    icon: FaHome,
    route: "/postproperty",
  },
  {
    name: "Business",
    hint: "Company listings",
    icon: FaIndustry,
    route: "/post/business",
  },
  {
    name: "Services",
    hint: "Pro services",
    icon: FaCogs,
    route: "/post/services",
  },
  {
    name: "Entertainment",
    hint: "Events & spaces",
    icon: FaCalendar,
    route: "/post/events-venues",
  },
  {
    name: "Resorts & Travel",
    hint: "Trips & stays",
    icon: FaPlane,
    route: "/post/resorts-travel",
  },
  {
    name: "Featured Ads",
    hint: "Premium placement",
    icon: FaStar,
    route: "/featured-adverts?postForm=true",
  },
  {
    name: "Banner Ads",
    hint: "Site banners",
    icon: PiFlagBanner,
    route: "/banner-adverts?postForm=true",
  },
  {
    name: "Classifieds",
    hint: "General ads",
    icon: FaMedal,
    route: "/postclassified",
  },
  {
    name: "Sponsored Ads",
    hint: "Sponsored reach",
    icon: FaBullhorn,
    route: "/sponsored-adverts?postForm=true",
  },
  {
    name: "Promoted Ads",
    hint: "Paid boost",
    icon: FaRocket,
    route: "/promoted-adverts?postForm=true",
  },
  {
    name: "Affiliate",
    hint: "Partner offers",
    icon: FaChartLine,
    route: "/affiliates",
  },
  {
    name: "Businesses for Sale",
    hint: "Sell a business",
    icon: FaChartLine,
    route: "/businesses-for-sale?postForm=true",
  },
  {
    name: "Donations",
    hint: "Charity appeals",
    icon: FaHeart,
    route: "/create-donation",
  },
];

function PostNewAds() {
  const navigate = useNavigate();
  const { requireAuth, clearRedirect } = useAuthRedirect();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const showPostModal = localStorage.getItem("showPostModal");
    if (showPostModal === "true") {
      localStorage.removeItem("showPostModal");
      requireAuth();
    }
  }, [requireAuth]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return POSTING_OPTIONS;
    return POSTING_OPTIONS.filter(
      (o) =>
        o.name.toLowerCase().includes(q) || o.hint.toLowerCase().includes(q)
    );
  }, [query]);

  const handleOptionClick = (route) => {
    clearRedirect();
    if (!requireAuth()) return;
    navigate(route);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[hsl(210_40%_98%)]">
      <UnifiedNavbar />

      <main className="page-container px-3 sm:px-4 py-6 sm:py-8 pb-12">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Post an advert
          </p>
          <p className="mt-1.5 text-sm text-slate-600">
            Pick a category to get started.
          </p>
        </header>

        <div className="mx-auto mt-5 max-w-md">
          <label className="relative block">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 shadow-sm outline-none ring-primary/30 placeholder:text-slate-400 focus:border-primary focus:ring-2"
            />
          </label>
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 sm:gap-3">
          {filtered.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.route + option.name}
                type="button"
                onClick={() => handleOptionClick(option.route)}
                className="group flex flex-col items-start gap-2 rounded-xl border border-slate-200/90 bg-white p-3.5 text-left shadow-sm transition hover:border-primary/40 hover:bg-[hsl(199_40%_98%)] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(199_45%_94%)] text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-semibold text-slate-900 leading-snug">
                  {option.name}
                </span>
                <span className="text-[11px] text-slate-500 leading-snug">
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-500">
            No categories match “{query}”.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default PostNewAds;
