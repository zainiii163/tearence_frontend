import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaIndustry,
  FaCreditCard,
  FaFighterJet,
  FaShoppingBag,
  FaBalanceScale,
  FaCalendar,
  FaBuilding,
  FaBus,
  FaLaptop,
  FaTags,
  FaBook,
  FaMoneyBillWave,
  FaBuysellads,
  FaThLarge,
  FaBriefcase,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { PiFlagBanner } from "react-icons/pi";
import SkeletonPage from "./skeletons/SkeletonPage";

const AllCategory = () => {
  const categoryAdsData = useSelector((store) => store.categories.categoryList);
  const loading = useSelector((store) => store.categories.loading);
  const categoryAds = categoryAdsData?.data || [];

  const getIcon = (iconname) => {
    switch (iconname) {
      case "fa-industry":
        return <FaIndustry className="h-8 w-8" />;
      case "fa-credit-card":
        return <FaCreditCard className="h-8 w-8" />;
      case "fa-fighter-jet":
        return <FaFighterJet className="h-8 w-8" />;
      case "fa-shopping-bag":
        return <FaShoppingBag className="h-8 w-8" />;
      case "fa-balance-scale":
        return <FaBalanceScale className="h-8 w-8" />;
      case "fa-calendar":
        return <FaCalendar className="h-8 w-8" />;
      case "fa-building":
        return <FaBuilding className="h-8 w-8" />;
      case "fa-bus":
        return <FaBus className="h-8 w-8" />;
      case "fa-laptop":
        return <FaLaptop className="h-8 w-8" />;
      case "fa-tags":
        return <FaTags className="h-8 w-8" />;
      case "fa-book":
        return <FaBook className="h-8 w-8" />;
      case "fa-briefcase":
        return <FaBriefcase className="h-8 w-8" />;
      case "fa-money":
        return <FaMoneyBillWave className="h-8 w-8" />;
      case "fa-map-marker-alt":
        return <FaMapMarkerAlt className="h-8 w-8" />;
      case "banner":
        return <PiFlagBanner className="h-8 w-8" />;
      default:
        return <FaBuysellads className="h-8 w-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {loading ? (
        <SkeletonPage showHeader={false} showCategories={true} />
      ) : (
        <>
          <div className="page-container pt-32 sm:pt-24 pb-12">
        {/* Header Section */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FaThLarge className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                All Categories
              </h1>
              <p className="text-muted-foreground">
                Browse all available categories to find what you're looking for
              </p>
            </div>
          </div>
          <div className="h-px bg-border" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-8">
          {categoryAds.items?.filter((item) => 
            !['jobs', 'events', 'book', 'banner'].includes(item.slug)
          ).map((item) => (
            <Link key={item.category_id} to={`/category/${item.slug}`}>
              <div className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex flex-col items-center justify-center p-6 space-y-4 h-32">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {getIcon(item.icon)}
                  </div>
                  <h3 className="text-sm font-medium text-center leading-tight text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}

          {/* Additional Categories */}
          <Link to="/jobs-section">
            <div className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="flex flex-col items-center justify-center p-6 space-y-4 h-32">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <FaBriefcase className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-medium text-center leading-tight text-foreground group-hover:text-primary transition-colors">
                  Jobs & Vacancies
                </h3>
              </div>
            </div>
          </Link>

          <Link to="/events-venues">
            <div className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="flex flex-col items-center justify-center p-6 space-y-4 h-32">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <FaMapMarkerAlt className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-medium text-center leading-tight text-foreground group-hover:text-primary transition-colors">
                  Events & Venues
                </h3>
              </div>
            </div>
          </Link>

          <Link to="/book/">
            <div className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="flex flex-col items-center justify-center p-6 space-y-4 h-32">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <FaBook className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-medium text-center leading-tight text-foreground group-hover:text-primary transition-colors">
                  Books
                </h3>
              </div>
            </div>
          </Link>

          <Link to="/banner/">
            <div className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="flex flex-col items-center justify-center p-6 space-y-4 h-32">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <PiFlagBanner className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-medium text-center leading-tight text-foreground group-hover:text-primary transition-colors">
                  Banner Adverts
                </h3>
              </div>
            </div>
          </Link>
        </div>

        
        {/* Empty State */}
        {(!categoryAds.items || categoryAds.items.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FaThLarge className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No categories found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We couldn't find any categories to display at the moment.
            </p>
          </div>
        )}

        {/* Stats Section */}
        {categoryAds.items && categoryAds.items.length > 0 && (
          <div className="mt-8 rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Category Overview</h3>
                <p className="text-sm text-muted-foreground">
                  Explore {categoryAds.items.length + 3} different categories
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FaThLarge className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
};
export default AllCategory;
