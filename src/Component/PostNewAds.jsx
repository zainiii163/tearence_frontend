import React, { useState } from "react";
import { getCategoriesList } from "../slice/CategorySlice";
import {
  FaIndustry,
  FaShoppingBag,
  FaBuysellads,
  FaFighterJet,
  FaCreditCard,
  FaBalanceScale,
  FaCalendar,
  FaBuilding,
  FaBus,
  FaLaptop,
  FaTags,
  FaBook,
} from "react-icons/fa";
import {
  Dialog,
} from "@headlessui/react";
import { PiFlagBanner } from "react-icons/pi";
import { MdCancel } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiDesktop } from "react-icons/bi";

function PostNewAds() {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const categoryAdsData = useSelector((store) => store.categories.categoryList);
  const categoryAds = categoryAdsData?.data || [];
  React.useEffect(() => {
    dispatch(getCategoriesList({ is_parent: "yes" }));
  }, [dispatch]);
  const getIcon = (iconname) => {
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
      case "affiliate":
        return <BiDesktop />;
      default:
        return <FaBuysellads />;
    }
  };
  return (
    <>
      <div className="w-full py-12 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] rounded-2xl"></div>
            
            {/* Main Content */}
            <div className="relative rounded-2xl border bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 bg-card/80 backdrop-blur-sm text-card-foreground shadow-xl overflow-hidden">
              <div className="px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                  {/* Left Content */}
                  <div className="flex-1 text-center lg:text-left space-y-4">
<div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 border-purple-200 mb-4">
                      <FaTags className="mr-2 h-3 w-3" />
                      Start Selling Today
                    </div><h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                      <span className="text-white">Easy and </span>
                      <span className="text-yellow-300">Quick!</span>
                    </h1>
<p className="text-lg sm:text-xl text-purple-100 max-w-2xl">
                      Post your ad in minutes and reach thousands of potential buyers. 
                      It's simple, fast, and completely free to get started.
                    </p>                    <div className="flex flex-wrap items-center gap-4 text-sm text-purple-200 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Free to post</span>
                      </div>
<div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        <span>Instant publishing</span>
                      </div>                      <div className="flex items-center gap-2">
<div className="h-2 w-2 rounded-full bg-purple-600"></div>
                        <span>Wide reach</span>                      </div>
                    </div>
                  </div>
                  
                  {/* Right Content - CTA */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-purple-500/80 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                      <button
                        onClick={() => setShowModal(true)}
                        className="relative inline-flex items-center justify-center gap-3 rounded-xl text-lg font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-purple-600 hover:bg-gray-50 hover:scale-105 hover:shadow-lg h-14 px-8 group"
                      >
                        <FaTags className="h-5 w-5 transition-transform group-hover:scale-110" />
                        <span>POST NEW AD</span>
                        <div className="h-5 w-5 rounded-full bg-purple-600/20 flex items-center justify-center">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    </div>
                    
                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
<div className="space-y-1">
                        <div className="text-2xl font-bold text-white">10K+</div>
                        <div className="text-xs text-purple-200">Active Ads</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-white">50K+</div>
                        <div className="text-xs text-purple-200">Users</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-white">24/7</div>
                        <div className="text-xs text-purple-200">Support</div>
                      </div>                    </div>
                  </div>
                </div>
              </div>
              
{/* Bottom decorative element */}
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={showModal}
        as="div"
        onClose={() => setShowModal(false)}
        className="z-[9999] fixed inset-0 overflow-y-auto"
      >
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
        <div className="w-screen h-screen flex items-center justify-center p-4">
          <div className="relative rounded-2xl border bg-card/95 backdrop-blur-md text-card-foreground shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="relative border-b bg-gradient-to-r from-purple-500/5 to-purple-500/10 px-6 py-6">              <button
                className="absolute right-4 top-4 inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-all hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 w-10"
                onClick={() => setShowModal(false)}
              >
                <MdCancel className="h-5 w-5" />
              </button>
              
              <div className="pr-12">
                <div className="flex items-center gap-3 mb-2">
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-600">
                    <FaTags className="h-5 w-5" />
                  </div>                  <h2 className="text-2xl font-bold tracking-tight">Choose Category</h2>
                </div>
                <p className="text-muted-foreground">Select a category to post your ad and reach the right audience</p>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAds.items?.map((item, index) => (
                  <Link
                    key={item.category_id}
                    to={`/post/${item.slug}/${item.category_id}`}
                    onClick={() => setShowModal(false)}
                    className="group"
                  >
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-primary/20">
                      <div className="flex items-center p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 group-hover:bg-purple-500/20 transition-colors mr-4">
                          {getIcon(item.icon)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground group-hover:text-purple-600 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Post in {item.name.toLowerCase()}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {/* Special Categories */}
                <Link
                  key={"banner"}
                  to={`/postbanner`}
                  onClick={() => setShowModal(false)}
                  className="group"
                >
                  <div className="rounded-xl border bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800 text-card-foreground shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500/20 transition-colors mr-4">
                        <PiFlagBanner className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-orange-900 dark:text-orange-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          Banner
                        </p>
                        <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">
                          Promote your business
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-4 w-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link
                  key={"affiliate"}
                  to={`/postaffiliate`}
                  onClick={() => setShowModal(false)}
                  className="group"
                >
<div className="rounded-xl border bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800 text-card-foreground shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20 transition-colors mr-4">
                        <BiDesktop className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-purple-900 dark:text-purple-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          Affiliate
                        </p>
                        <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                          Earn with partnerships
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default PostNewAds;
