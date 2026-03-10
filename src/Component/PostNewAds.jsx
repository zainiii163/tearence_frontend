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
  FaStar,
  FaPlane,
} from "react-icons/fa";
import { PiFlagBanner } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiDesktop } from "react-icons/bi";

function PostNewAds() {
  const dispatch = useDispatch();

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
      case "fa-plane":
        return <FaPlane />;
      default:
        return <FaBuysellads />;
    }
  };
  return (
    <div className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card/95 backdrop-blur-md text-card-foreground shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="border-b bg-gradient-to-r from-purple-500/5 to-purple-500/10 px-6 py-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-600">
                <FaTags className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Browse Categories</h2>
            </div>
            <p className="text-muted-foreground">
              Explore different categories and post directly from the category page.
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAds.items?.filter((item) => 
                  !['banner', 'affiliate', 'promoted'].includes(item.slug)
                ).map((item, index) => (
                  <Link
                    key={item.category_id}
                    to={`/category/${item.slug}`}
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
                            Browse {item.name.toLowerCase()}
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
                  to={`/banner`}
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
                          Browse banner ads
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
                  key={"featured-advert"}
                  to={`/post-featured-advert`}
                  className="group"
                >
                  <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800 text-card-foreground shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500/20 transition-colors mr-4">
                        <FaStar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-purple-900 dark:text-purple-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          Featured Advert
                        </p>
                        <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                          Post premium featured advert
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              
              <Link
                  key={"affiliate"}
                  to={`/affiliate-ads`}
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
                          Browse affiliate programs
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              
              <Link
                  key={"promoted"}
                  to={`/promoted-ads`}
                  className="group"
                >
                  <div className="rounded-xl border bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 text-card-foreground shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 group-hover:bg-yellow-500/20 transition-colors mr-4">
                        <FaTags className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-yellow-900 dark:text-yellow-100 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                          Promoted Advert
                        </p>
                        <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">
                          Browse promoted ads
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              
              <Link
                  key={"travel"}
                  to={`/travel/post`}
                  className="group"
                >
                  <div className="rounded-xl border bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-950/20 dark:to-blue-900/20 border-sky-200 dark:border-sky-800 text-card-foreground shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500/20 transition-colors mr-4">
                        <FaPlane className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sky-900 dark:text-sky-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          Travel Advert
                        </p>
                        <p className="text-xs text-sky-600/70 dark:text-sky-400/70 mt-1">
                          Post hotels, resorts & travel
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-4 w-4 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostNewAds;
