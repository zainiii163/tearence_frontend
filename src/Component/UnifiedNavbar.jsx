import React, { useEffect, useState, useRef } from "react";
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
import { FaHouseUser, FaIndustry, FaPencilAlt, FaShoppingBag, FaBuysellads, FaFighterJet, FaCreditCard, FaBalanceScale, FaCalendar, FaBuilding, FaBus, FaLaptop, FaTags, FaBook, FaChartLine, FaBriefcase, FaMapMarkerAlt, FaRocket, FaCar, FaTshirt, FaHome, FaPlus, FaUsers, FaPlane, FaHeart } from "react-icons/fa";
import { Image as ImageIcon, Crown } from 'lucide-react';
import { PiFlagBanner } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { BiDesktop } from "react-icons/bi";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import "../input.css";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { IoMdList } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { getCategoriesList } from "../slice/CategorySlice";
import { setLatitude, setLongitude } from "../slice/GeoLocationSlice";
import { logOut } from "../slice/AuthSlice";
import { useTranslation } from "react-i18next";
import ChatNotification from "./Chat/ChatNotification";
import FeaturedPostForm from "./featured/FeaturedPostForm";

/** Auto back target for marketplace pages when backHref is not passed. */
const getCategoryBackFromPath = (pathname) => {
  const rules = [
    // Category / sub-pages → section root
    [/^\/buy-sell\/category\/.+/i, '/buy-sell'],
    [/^\/buy-sell\/(templates|calculators)/i, '/buy-sell'],
    [/^\/business\/category\/.+/i, '/business'],
    [/^\/business\/(templates|calculators)/i, '/business'],
    [/^\/businesses-for-sale\/category\/.+/i, '/businesses-for-sale'],
    [/^\/businesses-for-sale\/(templates|calculators)/i, '/businesses-for-sale'],
    [/^\/services\/category\/.+/i, '/services'],
    [/^\/services\/(templates|calculators)/i, '/services'],
    [/^\/property\/category\/.+/i, '/property'],
    [/^\/property\/(templates|calculators)/i, '/property'],
    [/^\/property\/\d+/i, '/property'],
    [/^\/vehicles\/(templates|calculators)/i, '/vehicles'],
    [/^\/vehicles\/category\/.+/i, '/vehicles'],
    [/^\/books\/(templates|calculators)/i, '/books'],
    [/^\/books\/category\/.+/i, '/books'],
    [/^\/calculators\/?$/i, '/'],
    [/^\/category\/.+/i, '/'],
    // Section landing pages → homepage
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
  const { logIn } = useSelector((store) => store.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [isOpenCategorySearch, setIsOpenCategorySearch] = useState(false);

  const dropdownRef = useRef(null);
  const dropdownRefSearch = useRef(null);

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

  useEffect(() => {
    dispatch(getCategoriesList({ is_parent: "yes" })).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug("Categories fetch error in Navbar:", error);
      }
      // Silently handle the error - the component will work with empty categories
      // The mock data fallback in CategorySlice will handle this
    });
  }, [dispatch]);

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

  // Geolocation handling (simplified from original)
  useEffect(() => {
    const geolocationPreference = localStorage.getItem('geolocation_preference');
    const hasAskedBefore = localStorage.getItem('geolocation_asked') === 'true';
    
    const handleGeolocation = () => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by this browser.");
        return;
      }

      if (geolocationPreference === 'denied') {
        console.log("User has denied geolocation");
        return;
      }

      if (!hasAskedBefore) {
        localStorage.setItem('geolocation_asked', 'true');
        requestGeolocation();
      } else if (geolocationPreference === 'allowed') {
        requestGeolocation();
      }
    };

    const requestGeolocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem('geolocation_preference', 'allowed');
          dispatch(setLatitude(position.coords.latitude));
          dispatch(setLongitude(position.coords.longitude));
          console.log("✅ Geolocation access granted");
        },
        (error) => {
          console.log("📍 Location information unavailable or denied");
          localStorage.setItem('geolocation_preference', 'denied');
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    };

    handleGeolocation();
  }, [dispatch]);

  return (
    <div className="w-full fixed z-[100] bg-background border-b shadow-sm">
      <div className="page-container flex justify-between h-14 sm:h-16 items-center">
        {/* Left Section */}
        <div className="flex gap-2 sm:gap-4 items-center">
          {/* Back Button */}
          {resolvedShowBack && (
            <button
              onClick={handleBackClick}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full mr-2"
            >
              <MdArrowBack className="h-4 w-4" />
            </button>
          )}
          
          {/* Logo */}
          <Link to="/">
            <img src="/img/wwaLogo.png" alt="logo" className="w-28 sm:w-32 md:w-36 lg:w-40" />
          </Link>

          {/* Communities Button */}
          <Link to="/communities">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3 gap-2">
              <FaUsers className="h-4 w-4" />
              <span className="hidden sm:inline">Communities</span>
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

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2">
          <ChatNotification className="rounded-full h-10 w-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground" />
          
          {/* User Menu */}
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full"
            onClick={toggleDropDown}
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
                  <Link to="/account?component=AccountInfo">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <FaHouseUser className="mr-2 h-4 w-4" />
                      {t("Account Info")}
                    </div>
                  </Link>
                  <Link to="/dashboard">
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
                      Communities
                    </div>
                  </Link>
                  <div className="h-px bg-border my-1"></div>
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
                  <Link to="/favorite-ads">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <AiOutlineHeart className="mr-2 h-4 w-4" />
                      Favorites
                    </div>
                  </Link>
                  <Link to="/my-featured-ads">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <BiDesktop className="mr-2 h-4 w-4" />
                      Featured Ads
                    </div>
                  </Link>
                  <Link to="/my-sponsored-ads">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <AiOutlineMenuFold className="mr-2 h-4 w-4" />
                      Sponsored Ads
                    </div>
                  </Link>
                  <Link to="/sponsored">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <Crown className="mr-2 h-4 w-4" />
                      Sponsored Adverts
                    </div>
                  </Link>
                  <Link to="/banners">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <PiFlagBanner className="mr-2 h-4 w-4" />
                      Banner Ads
                    </div>
                  </Link>
                  <Link to="/affiliates">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <FaUsers className="mr-2 h-4 w-4" />
                      Affiliates Hub
                    </div>
                  </Link>
                  <Link to="/my-affiliate-ads">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <BiDesktop className="mr-2 h-4 w-4" />
                      My Affiliate Ads
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
                   <Link to="/my-banner-ads">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent">
                      <PiFlagBanner className="mr-2 h-4 w-4" />
                      Banner Adverts
                    </div>
                  </Link>
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
                  <Link to="/Login?type=business">
                    <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
                      <FaUserAlt className="mr-2 h-4 w-4" />
                      Login
                    </div>
                  </Link>
                </>
              )}
            </div>
          )}

          {logIn && (
            <Link to="/dashboard">
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-3 gap-2"
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

      {/* Category Modal (for main page) */}
      {showModal && location.pathname === '/' && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4" onClick={() => setShowModal(false)}>
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

      {/* Featured Advert Post Form Modal */}
      {showFeaturedModal && (
        <FeaturedPostForm onClose={() => setShowFeaturedModal(false)} />
      )}
    </div>
  );
};

export default UnifiedNavbar;
