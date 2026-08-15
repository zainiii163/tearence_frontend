import React, { useEffect, useLayoutEffect, useState, useRef, lazy, Suspense } from "react";
import { BiSolidUser } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import {
  MdCancel,
  MdLogout,
  MdOutlineNewLabel,
  MdArrowBack,
} from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillMessage } from "react-icons/ai";
import { AiOutlineMenuFold } from "react-icons/ai";
import { FaQuestionCircle, FaHouseUser, FaIndustry, FaPencilAlt, FaShoppingBag, FaBuysellads, FaFighterJet, FaCreditCard, FaBalanceScale, FaCalendar, FaBuilding, FaBus, FaLaptop, FaTags, FaBook, FaChartLine, FaBriefcase, FaMapMarkerAlt, FaRocket, FaCar, FaTshirt, FaHome, FaPlus, FaUsers, FaPlane, FaHeart } from "react-icons/fa";
import { Image as ImageIcon, Crown } from 'lucide-react';
import { PiFlagBanner } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { BiDesktop } from "react-icons/bi";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { IoMdList } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { getCategoriesList } from "../slice/CategorySlice";
import { setLatitude, setLongitude } from "../slice/GeoLocationSlice";
import { logOut } from "../slice/AuthSlice";
import { useTranslation } from "react-i18next";
import ChatNotification from "./Chat/ChatNotification";
import { getDashboardHomePath, resolveAccountType } from "../utils/accountType";
import SafetyTrustBar from "./shared/SafetyTrustBar";

const FeaturedPostForm = lazy(() => import("./featured/FeaturedPostForm"));

/** Auto back target for marketplace pages when backHref is not passed. */
const getCategoryBackFromPath = (pathname) => {
  const rules = [
    // Category / sub-pages → section root
    [/^\/buy-sell\/category\/.+/i, '/buy-sell'],
    [/^\/buy-sell\/(templates|calculators)/i, '/buy-sell'],
    [/^\/classifieds-ads\/category\/.+/i, '/classifieds-ads'],
    [/^\/classifieds-ads\/(templates|calculators)/i, '/classifieds-ads'],
    [/^\/business\/category\/.+/i, '/business'],
    [/^\/business\/(templates|calculators)/i, '/business'],
    [/^\/businesses-for-sale\/category\/.+/i, '/businesses-for-sale'],
    [/^\/businesses-for-sale\/(templates|calculators)/i, '/businesses-for-sale'],
    [/^\/businesses-for-sale\/[^/]+\/?$/i, '/businesses-for-sale'],
    [/^\/services\/category\/.+/i, '/services'],
    [/^\/services\/(templates|calculators)/i, '/services'],
    [/^\/property\/category\/.+/i, '/property'],
    [/^\/property\/(templates|calculators)/i, '/property'],
    [/^\/property\/\d+/i, '/property'],
    [/^\/vehicles\/(templates|calculators)/i, '/vehicles'],
    [/^\/vehicles\/category\/.+/i, '/vehicles'],
    [/^\/books\/(templates|calculators)/i, '/books'],
    [/^\/books\/category\/.+/i, '/books'],
    [/^\/property\/(region|country)\/.+/i, '/property'],
    [/^\/jobs\/(vacancies|seekers|templates|calculators|post)/i, '/jobs'],
    [/^\/jobs\/\d+/i, '/jobs'],
    [/^\/jobs\/?$/i, '/'],
    [/^\/events-venues\/(events|venues)(\/category\/.+)?$/i, '/events-venues'],
    [/^\/events-venues\/?$/i, '/'],
    [/^\/adverts\/?$/i, '/'],
    [/^\/affiliates\/(marketplace|courses|offer\/.+)/i, '/affiliates'],
    [/^\/affiliates\/?$/i, '/'],
    [/^\/featured-adverts(\/category\/.+)?$/i, '/adverts'],
    [/^\/featured(\/|$)/i, '/adverts'],
    [/^\/paid-adverts\/?$/i, '/adverts'],
    [/^\/sponsored-adverts\/?$/i, '/adverts'],
    [/^\/promoted-adverts\/?$/i, '/adverts'],
    [/^\/banner-adverts\/?$/i, '/adverts'],
    [/^\/stores\/?$/i, '/'],
    [/^\/online-stores\/?$/i, '/'],
    [/^\/banner-adverts\/category\/.+/i, '/paid-adverts?tab=banners'],
    [/^\/promoted-adverts\/category\/.+/i, '/paid-adverts?tab=promoted'],
    [/^\/sponsored-adverts\/category\/.+/i, '/sponsored-adverts'],
    [/^\/calculators\/?$/i, '/'],
    [/^\/category\/.+/i, '/'],
    // Section landing pages → homepage
    [/^\/classifieds-ads\/?$/i, '/'],
    [/^\/buy-sell\/?$/i, '/'],
    [/^\/business\/?$/i, '/'],
    [/^\/business-page\/?$/i, '/'],
    [/^\/businesses-for-sale\/?$/i, '/'],
    [/^\/services\/?$/i, '/'],
    [/^\/services-marketplace\/?$/i, '/'],
    [/^\/property\/?$/i, '/'],
    [/^\/real-estate\/?$/i, '/'],
    [/^\/properties\/?$/i, '/'],
    [/^\/property-marketplace\/?$/i, '/'],
    [/^\/vehicles\/?$/i, '/'],
    [/^\/vehicles-marketplace\/?$/i, '/'],
    [/^\/books\/?$/i, '/'],
    [/^\/books-marketplace\/?$/i, '/'],
    [/^\/banner-adverts\/?$/i, '/adverts'],
  ];
  for (const [pattern, href] of rules) {
    if (pattern.test(pathname)) return href;
  }
  return null;
};

const UnifiedNavbar = ({ showBackButton = false, backHref = null }) => {
  const { requireAuth } = useAuthRedirect();
  const dispatch = useDispatch();
  const { searchValue } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const categoryAdsData = useSelector((store) => store.categories.categoryList);
  const categoryAds = Array.isArray(categoryAdsData) ? categoryAdsData : categoryAdsData?.data || [];

  const [searchKeyword, setSearchKeyword] = useState("");
  const { logIn, userDetail } = useSelector((store) => store.auth);
  const accountType = resolveAccountType(userDetail);
  const dashboardHome = getDashboardHomePath(accountType);
  const isBusinessUser = accountType === 'business';
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [isOpenCategorySearch, setIsOpenCategorySearch] = useState(false);

  const dropdownRef = useRef(null);
  const dropdownRefSearch = useRef(null);
  const navBarRef = useRef(null);
  const [navOffset, setNavOffset] = useState(0);

  useLayoutEffect(() => {
    const el = navBarRef.current;
    if (!el) return undefined;

    const updateOffset = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      setNavOffset(height);
      document.documentElement.style.setProperty('--wwa-navbar-offset', `${height}px`);
    };

    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(el);
    window.addEventListener('resize', updateOffset);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateOffset);
    };
  }, []);

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const autoBackHref = getCategoryBackFromPath(location.pathname);
  const resolvedShowBack = showBackButton || Boolean(autoBackHref);
  const resolvedBackHref = backHref || autoBackHref;

  const handleBackClick = () => {
    if (resolvedBackHref) {
      navigate(resolvedBackHref);
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefSearch.current &&
        !dropdownRefSearch.current.contains(event.target)
      ) {
        setTimeout(() => {
          setIsOpenCategorySearch(false);
        }, 500);
      }
    };
    if (isOpenCategorySearch) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenCategorySearch]);

  // Fetch categories only when search opens (not on every navbar mount)
  useEffect(() => {
    if (!isOpenCategorySearch) return;
    const existing = Array.isArray(categoryAdsData)
      ? categoryAdsData
      : categoryAdsData?.data;
    if (Array.isArray(existing) && existing.length > 0) return;

    dispatch(getCategoriesList({ is_parent: "yes" })).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug("Categories fetch error in Navbar:", error);
      }
    });
  }, [dispatch, categoryAdsData, isOpenCategorySearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search-results/${searchKeyword}`);
  };

  useEffect(() => {
    if (location.pathname.includes("search-results")) {
      setSearchKeyword(searchValue);
    }
    return () => { };
  }, [location, searchValue]);

  const getIcon = (iconname) => {
    // Ensure iconname is a string
    if (!iconname || typeof iconname !== 'string') {
      return <FaBuysellads />;
    }
    
    switch (iconname) {
      case "fa-industry":
        return <FaIndustry />;
      case "fa-credit-card":
        return <FaCreditCard />;
      case "fa-fighter-jet":
        return <FaFighterJet />;
      case "fa-shopping-bag":
        return <FaShoppingBag />;
      case "fa-balance-scale":
        return <FaBalanceScale />;
      case "fa-calendar":
        return <FaCalendar />;
      case "fa-building":
        return <FaBuilding />;
      case "fa-bus":
        return <FaBus />;
      case "fa-laptop":
        return <FaLaptop />;
      case "fa-tags":
        return <FaTags />;
      case "fa-book":
        return <FaBook />;
      case "banner":
        return <PiFlagBanner />;
      default:
        return <FaBuysellads />;
    }
  };

  // Geolocation: defer until idle so it never blocks first paint / navigation
  useEffect(() => {
    const geolocationPreference = localStorage.getItem('geolocation_preference');
    const hasAskedBefore = localStorage.getItem('geolocation_asked') === 'true';

    const requestGeolocation = () => {
      if (!navigator.geolocation) return;
      if (geolocationPreference === 'denied') return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem('geolocation_preference', 'allowed');
          dispatch(setLatitude(position.coords.latitude));
          dispatch(setLongitude(position.coords.longitude));
        },
        () => {
          localStorage.setItem('geolocation_preference', 'denied');
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 600000
        }
      );
    };

    const handleGeolocation = () => {
      if (!navigator.geolocation) return;
      if (geolocationPreference === 'denied') return;

      if (!hasAskedBefore) {
        localStorage.setItem('geolocation_asked', 'true');
        requestGeolocation();
      } else if (geolocationPreference === 'allowed') {
        requestGeolocation();
      }
    };

    let idleId;
    let timeoutId;
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(handleGeolocation, { timeout: 4000 });
    } else {
      timeoutId = setTimeout(handleGeolocation, 2500);
    }

    return () => {
      if (idleId != null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [dispatch]);

  return (
    <>
    <div
      ref={navBarRef}
      className="w-full fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
    >
      <div className="page-container flex justify-between h-14 sm:h-16 items-center overflow-hidden">
        {/* Left Section */}
        <div className="flex gap-2 sm:gap-4 items-center min-w-0">
          {/* Back Button */}
          {resolvedShowBack && (
            <button
              onClick={handleBackClick}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 mr-2 shrink-0"
            >
              <MdArrowBack className="h-4 w-4" />
            </button>
          )}
          
          {/* Logo — height-capped so it cannot grow past the bar and cover page content */}
          <Link to="/" className="shrink-0 flex items-center" aria-label="World Wide Adverts home">
            <img
              src="/img/wwaLogo.png"
              alt="World Wide Adverts"
              className="h-8 sm:h-9 md:h-10 w-auto max-w-[9rem] sm:max-w-[10rem] md:max-w-[11rem] object-contain"
            />
          </Link>

          {/* Social Hub */}
          <Link to="/communities">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-50 hover:text-primary h-10 px-3 gap-2 text-slate-700">
              <FaUsers className="h-4 w-4" />
              <span className="hidden sm:inline">Social Hub</span>
            </button>
          </Link>
        </div>

        {/* Search Section */}
        <div className="relative hidden md:block flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch}>
            <div className="flex">
              <div className="relative flex-shrink-0 inline-flex">
                <div className="flex">
                  <Link
                    id="dropdown-button"
                    data-dropdown-toggle="dropdown"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3 rounded-r-none border-r-0"
                    to={location.pathname !== "/category-menu" ? '/category-menu' : '/'}
                  >
                    <IoMdList className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="relative w-full">
                <input
                  value={searchKeyword}
                  type="search"
                  id="search-dropdown"
                  className="flex h-10 w-full rounded-r-md border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 rounded-l-none border-l-0"
                  placeholder="Search ads, jobs, property…"
                  required
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-3 rounded-l-none"
                >
                  <BiSearch className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2">
          <ChatNotification className="rounded-lg h-10 w-10 border border-slate-200 bg-white hover:bg-slate-50 hover:text-primary" />

          <Link to="/post-ad" className="hidden sm:inline-flex">
            <span className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors">
              <FaPlus className="h-3.5 w-3.5" />
              Post Ad
            </span>
          </Link>

          <button
            type="button"
            className="hidden md:inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
            aria-label="Help — what you can do"
            title="Help"
            onClick={() => window.dispatchEvent(new CustomEvent("wwa-open-help"))}
          >
            <FaQuestionCircle className="h-4 w-4" />
          </button>
          
          {/* User Menu */}
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-50 hover:text-primary h-10 w-10"
            onClick={toggleDropDown}
            aria-label="Account menu"
          >
            <BiSolidUser className="h-4 w-4" />
          </button>
          
          {isOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-[9999] min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-56 top-12 right-2"
            >
              {location.pathname !== "/" && (
                <Link to="/">
                  <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                    <AiFillHome className="mr-2 h-4 w-4" /> {t("Home")}
                  </div>
                </Link>
              )}
              {logIn ? (
                <>
                  <Link to="/dashboard?tab=security&section=profile">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <FaHouseUser className="mr-2 h-4 w-4" />
                      {t("Account Info")}
                    </div>
                  </Link>
                  <Link to={dashboardHome}>
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <FaChartLine className="mr-2 h-4 w-4" />
                      Dashboard
                    </div>
                  </Link>
                  <Link to="/messages">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <AiFillMessage className="mr-2 h-4 w-4" />
                      Messages
                    </div>
                  </Link>
                  <Link to="/communities">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <FaUsers className="mr-2 h-4 w-4" />
                      Social Hub
                    </div>
                  </Link>
                  <div className="h-px bg-border my-1"></div>
                  {isBusinessUser && (
                    <>
                      <Link to="/my-store">
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                          <FaIndustry className="mr-2 h-4 w-4" />
                          Store
                        </div>
                      </Link>
                      <Link to="/business-store">
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                          <FaIndustry className="mr-2 h-4 w-4" />
                          Business
                        </div>
                      </Link>
                      <div className="h-px bg-border my-1"></div>
                    </>
                  )}
                  <Link to="/favorite-ads">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <AiOutlineHeart className="mr-2 h-4 w-4" />
                      Favorites
                    </div>
                  </Link>
                  <Link to="/affiliates">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <FaUsers className="mr-2 h-4 w-4" />
                      Affiliates
                    </div>
                  </Link>
                  <Link to="/dashboard?tab=affiliates&sub=promoting">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <BiDesktop className="mr-2 h-4 w-4" />
                      {isBusinessUser ? 'My Affiliate Ads' : 'My promotions'}
                    </div>
                  </Link>
                  {isBusinessUser && (
                    <>
                      <div className="h-px bg-border my-1"></div>
                      <Link to="/adverts">
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                          <Crown className="mr-2 h-4 w-4" />
                          Adverts
                        </div>
                      </Link>
                      <Link to="/sponsored-adverts">
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                          <Crown className="mr-2 h-4 w-4" />
                          Sponsored
                        </div>
                      </Link>
                      <Link to="/featured-adverts">
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                          <BiDesktop className="mr-2 h-4 w-4" />
                          Featured
                        </div>
                      </Link>
                      <Link to="/paid-adverts">
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                          <Crown className="mr-2 h-4 w-4" />
                          Paid Adverts
                        </div>
                      </Link>
                      <Link to="/partners">
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                          <FaUsers className="mr-2 h-4 w-4" />
                          Partnerships
                        </div>
                      </Link>
                      <Link to="/my-classifieds-ads">
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                          <MdOutlineNewLabel className="mr-2 h-4 w-4" />
                          Classifieds Ads
                        </div>
                      </Link>
                      <Link to="/my-new-ads">
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                          <MdOutlineNewLabel className="mr-2 h-4 w-4" />
                          News Ads
                        </div>
                      </Link>
                    </>
                  )}
                  <div className="h-px bg-border my-1"></div>
                  <Link
                    to="/Login"
                    onClick={() => {
                      toggleDropDown();
                      dispatch(logOut());
                    }}
                  >
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent text-destructive">
                      <MdLogout className="mr-2 h-4 w-4" />
                      Logout
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/Login?tab=signup&type=basic">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
                      <FaPencilAlt className="mr-2 h-4 w-4" />
                      Register (Basic)
                    </div>
                  </Link>
                  <Link to="/Login?tab=signup&type=business">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
                      <FaBuilding className="mr-2 h-4 w-4" />
                      Register (Business)
                    </div>
                  </Link>
                  <Link to="/Login?type=basic">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
                      <FaUserAlt className="mr-2 h-4 w-4" />
                      Login (Basic)
                    </div>
                  </Link>
                  <Link to="/Login?type=business">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
                      <FaBuilding className="mr-2 h-4 w-4" />
                      Login (Business)
                    </div>
                  </Link>
                </>
              )}
            </div>
          )}

          {logIn && (
            <Link to={dashboardHome}>
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-primary h-10 px-3 gap-2"
              >
                <FaChartLine className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-4 md:hidden">
        <form className="w-full" onSubmit={handleSearch}>
          <div className="flex">
            <div className="relative flex-shrink-0 inline-flex">
              <div className="flex">
                <Link
                  id="dropdown-button"
                  data-dropdown-toggle="dropdown"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3 rounded-r-none border-r-0"
                  to={"/category-menu"}
                >
                  <IoMdList className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative w-full">
              <input
                type="search"
                id="search-dropdown-mobile"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-l-none border-l-0"
                placeholder="Search..."
                required
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button
                type="submit"
                className="absolute top-0 end-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-3 rounded-l-none"
              >
                <BiSearch className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

      {/* Category Modal (for main page) — outside measured bar */}
      {showModal && location.pathname === '/' && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4" onClick={() => setShowModal(false)}>
          <div className="rounded-lg border bg-card text-card-foreground shadow-lg w-full max-w-4xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto relative p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute right-2 sm:right-4 top-2 sm:top-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => setShowModal(false)}
            >
              <MdCancel className="h-4 w-4" />
            </button>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 pr-8 sm:pr-12">
              <h2 className="text-xl sm:text-2xl font-semibold leading-none tracking-tight">Choose Category</h2>
              <p className="text-sm text-muted-foreground">Select a category to post your ad</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Array.isArray(categoryAds) && categoryAds.map((item, index) => {
                // Ensure item is valid and has required properties
                if (!item || typeof item !== 'object') return null;
                
                const categoryName = item.name || 'Unknown Category';
                const categorySlug = item.slug || `category-${item.category_id || item.id || index}`;
                const categoryId = item.category_id || item.id || index;
                const iconKey = typeof item.icon === 'string' ? item.icon : 'default';
                
                return (
                  <Link
                    key={categoryId}
                    to={`/post/${categorySlug}/${categoryId}`}
                    onClick={() => setShowModal(false)}
                  >
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
                          {getIcon(iconKey)}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {categoryName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <Link
                key={"banner"}
                to={`/postbanner`}
                onClick={() => setShowModal(false)}
              >
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
                      <PiFlagBanner />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        Banner
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                key={"affiliate"}
                to={`/affiliates?postForm=true&mode=user`}
                onClick={() => setShowModal(false)}
              >
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
                      <BiDesktop />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        Affiliate
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                key={"jobs"}
                to={`/jobs/post`}
                onClick={() => setShowModal(false)}
              >
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
                      <FaBriefcase />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        Jobs
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                key={"vacancies"}
                to={`/vacancies/post`}
                onClick={() => setShowModal(false)}
              >
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
                      <FaIndustry />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        Vacancies
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Featured Advert Post Form Modal — lazy so posting form is not in every page bundle */}
      {showFeaturedModal && (
        <Suspense fallback={null}>
          <FeaturedPostForm onClose={() => setShowFeaturedModal(false)} />
        </Suspense>
      )}
    {/* Reserve space for fixed navbar — height matches measured bar (row + mobile search). */}
    <div
      className={`w-full shrink-0 ${navOffset ? '' : 'h-[7.5rem] md:h-16'}`}
      style={navOffset ? { height: navOffset } : undefined}
      aria-hidden="true"
    />
    <SafetyTrustBar />
    </>
  );
};

export default UnifiedNavbar;
