import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Component/Footer";
import Video from "../Component/Video";
import UnifiedNavbar from "../Component/UnifiedNavbar";
import Loading from "../Component/Loading";
import useAuthRedirect from "../hooks/useAuthRedirect";
import {
  FaIndustry,
  FaHome,
  FaCogs,
  FaCar,
  FaBook,
  FaArrowRight,
  FaChartLine,
  FaCalendarAlt,
  FaPlane,
  FaStar,
  FaMedal,
  FaUsers,
  FaBullhorn,
  FaImage,
  FaHeart,
  FaComments,
} from "react-icons/fa";

function Homepage() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Handle category card clicks - navigate to explore pages
  const handleCategoryClick = (category) => {
    const exploreRoutes = {
      'communities': '/communities',
      'books': '/books',
      'events': '/events-venues',
      'business': '/business',
      'funding': '/funding',
      'donations': '/donations',
      'sponsored': '/sponsored-adverts',
      'buy-sell': '/buy-sell',
      'promoted': '/promoted-adverts',
      'banner': '/banner-adverts',
      'jobs': '/jobs',
      'property': '/property',
      'services': '/services',
      'vehicles': '/vehicles',
      'resorts': '/resorts-travel',
      'featured': '/featured',
      'affiliate': '/affiliate',
      'classifieds': '/classifieds-ads',
      'investment': '/businesses-for-sale',
      'stores': '/stores',
      'images': '/images'
    };

    const targetRoute = exploreRoutes[category.slug] || '/communities';
    navigate(targetRoute);
  };

  const categoryDefinitions = {
    "buy-sell": {
      slug: "buy-sell",
      name: "Buy & Sell",
      description: "Post anything you want to sell or find items to purchase",
      icon: <FaUsers className="h-8 w-8" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      hoverBg: "hover:from-green-500 hover:to-emerald-500",
    },
    business: {
      slug: "business",
      name: "Business & Companies",
      description: "Find business opportunities, company listings, and commercial services",
      icon: <FaIndustry className="h-8 w-8" />,
      color: "from-gray-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-gray-100 to-blue-100",
      iconColor: "text-gray-600",
      borderColor: "border-gray-200",
      hoverBg: "hover:from-gray-500 hover:to-blue-500",
    },
    services: {
      slug: "services",
      name: "Services and Solutions",
      description: "Professional services, consulting, and business solutions",
      icon: <FaCogs className="h-8 w-8" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-100 to-orange-100",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      hoverBg: "hover:from-amber-500 hover:to-orange-500",
    },
    property: {
      slug: "property",
      name: "Property and Solutions",
      description: "Browse properties for sale, rent, and real estate investments",
      icon: <FaHome className="h-8 w-8" />,
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-violet-100 to-purple-100",
      iconColor: "text-violet-600",
      borderColor: "border-violet-200",
      hoverBg: "hover:from-violet-500 hover:to-purple-500",
    },
    events: {
      slug: "events",
      name: "Events & Entertainment",
      description: "Conferences, concerts, festivals, and special occasions",
      icon: <FaCalendarAlt className="h-8 w-8" />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-100 to-pink-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      hoverBg: "hover:from-purple-500 hover:to-pink-500",
    },
    sponsored: {
      slug: "sponsored",
      name: "Sponsored Ads",
      description: "Premium sponsored advertising placements",
      icon: <FaBullhorn className="h-8 w-8" />,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-gradient-to-br from-purple-100 to-indigo-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      hoverBg: "hover:from-purple-500 hover:to-indigo-500",
    },
    promoted: {
      slug: "promoted",
      name: "Promoted Ads",
      description: "Promoted content and advertising campaigns",
      icon: <FaBullhorn className="h-8 w-8" />,
      color: "from-red-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-red-100 to-pink-100",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
      hoverBg: "hover:from-red-500 hover:to-pink-500",
    },
    banner: {
      slug: "banner",
      name: "Banner Ads",
      description: "Display banner advertising solutions",
      icon: <FaImage className="h-8 w-8" />,
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-indigo-100 to-blue-100",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-200",
      hoverBg: "hover:from-indigo-500 hover:to-blue-500",
    },
    featured: {
      slug: "featured",
      name: "Featured Ads",
      description: "Premium featured listings and highlighted content",
      icon: <FaStar className="h-8 w-8" />,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-yellow-100 to-orange-100",
      iconColor: "text-yellow-600",
      borderColor: "border-yellow-200",
      hoverBg: "hover:from-yellow-500 hover:to-orange-500",
    },
    funding: {
      slug: "funding",
      name: "Funding & Crowdfunding",
      description: "Raise business funding via loan or share partnership campaigns",
      icon: <FaHeart className="h-8 w-8" />,
      color: "from-[#02a95c] to-emerald-600",
      bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
      iconColor: "text-[#02a95c]",
      borderColor: "border-emerald-200",
      hoverBg: "hover:from-[#02a95c] hover:to-emerald-600",
    },
    stores: {
      slug: "stores",
      name: "Online Stores",
      description: "Online stores and e-commerce marketplaces",
      icon: <FaHome className="h-8 w-8" />,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-gradient-to-br from-purple-100 to-indigo-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      hoverBg: "hover:from-purple-500 hover:to-indigo-500",
    },
    books: {
      slug: "books",
      name: "Books & Literature",
      description: "Educational books, novels, audiobooks, and digital publications",
      icon: <FaBook className="h-8 w-8" />,
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-indigo-100 to-purple-100",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-200",
      hoverBg: "hover:from-indigo-500 hover:to-purple-500",
    },
    vehicles: {
      slug: "vehicles",
      name: "Vehicles & Transport",
      description: "Cars, motorcycles, trucks, and transportation solutions",
      icon: <FaCar className="h-8 w-8" />,
      color: "from-gray-500 to-red-500",
      bgColor: "bg-gradient-to-br from-gray-100 to-red-100",
      iconColor: "text-gray-600",
      borderColor: "border-gray-200",
      hoverBg: "hover:from-gray-500 hover:to-red-500",
    },
    donations: {
      slug: "donations",
      name: "Charities and Donations",
      description: "Humanitarian causes and charitable contributions",
      icon: <FaHeart className="h-8 w-8" />,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-gradient-to-br from-pink-100 to-rose-100",
      iconColor: "text-pink-600",
      borderColor: "border-pink-200",
      hoverBg: "hover:from-pink-500 hover:to-rose-500",
    },
    images: {
      slug: "images",
      name: "Stock Images & Media",
      description: "Buy and sell admin-verified images for commercial and personal use",
      icon: <FaImage className="h-8 w-8" />,
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-rose-100 to-pink-100",
      iconColor: "text-rose-600",
      borderColor: "border-rose-200",
      hoverBg: "hover:from-rose-500 hover:to-pink-500",
    },
    classifieds: {
      slug: "classifieds",
      name: "Classifieds",
      description: "General classified advertisements and listings",
      icon: <FaMedal className="h-8 w-8" />,
      color: "from-teal-500 to-green-500",
      bgColor: "bg-gradient-to-br from-teal-100 to-green-100",
      iconColor: "text-teal-600",
      borderColor: "border-teal-200",
      hoverBg: "hover:from-teal-500 hover:to-green-500",
    },
    affiliate: {
      slug: "affiliate",
      name: "Affiliate Hub",
      description: "Affiliate marketing programs and partnership opportunities",
      icon: <FaUsers className="h-8 w-8" />,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-gradient-to-br from-pink-100 to-rose-100",
      iconColor: "text-pink-600",
      borderColor: "border-pink-200",
      hoverBg: "hover:from-pink-500 hover:to-rose-500",
    },
    resorts: {
      slug: "resorts",
      name: "Resorts & Travel",
      description: "Luxury resorts, vacation packages, and travel destinations",
      icon: <FaPlane className="h-8 w-8" />,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-cyan-100 to-blue-100",
      iconColor: "text-cyan-600",
      borderColor: "border-cyan-200",
      hoverBg: "hover:from-cyan-500 hover:to-blue-500",
    },
    investment: {
      slug: "investment",
      name: "Businesses for Sale",
      description: "Buy or sell online and physical businesses worldwide",
      icon: <FaIndustry className="h-8 w-8" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-100 to-orange-100",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      hoverBg: "hover:from-amber-500 hover:to-orange-500",
    },
  };

  // Flat order — grid wraps 5 per row with no empty slots (5 + 5 + 5 + 4)
  const categoryOrder = [
    "buy-sell",
    "business",
    "services",
    "property",
    "events",
    "sponsored",
    "promoted",
    "banner",
    "featured",
    "funding",
    "stores",
    "books",
    "vehicles",
    "donations",
    "images",
    "classifieds",
    "affiliate",
    "resorts",
    "investment",
  ];

  const categoryGridClass =
    "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5 lg:gap-3 auto-rows-fr items-stretch";

  const renderCategoryCard = (category) => (
    <div key={category.slug} className="h-full min-w-0">
      <div
        onClick={() => handleCategoryClick(category)}
        className={`group relative overflow-hidden rounded-md w-full h-full min-h-[132px] sm:min-h-[140px] lg:min-h-[148px] max-h-[168px] sm:max-h-[175px] lg:max-h-[182px] flex flex-col ${category.bgColor} ${category.borderColor} border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${category.hoverBg} hover:text-white text-left cursor-pointer`}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${category.color.split(" ")[1]}, ${category.color.split(" ")[3]})`,
          }}
        />

        <div className="relative flex flex-col flex-1 p-2 sm:p-2.5 lg:p-3">
          <div className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-white/80 backdrop-blur-sm mb-1.5 sm:mb-2 group-hover:scale-105 transition-transform duration-200 group-hover:bg-white/20 shrink-0">
            <div
              className={`${category.iconColor} group-hover:text-white transition-colors duration-200 text-sm sm:text-base`}
            >
              {React.isValidElement(category.icon) ? category.icon : null}
            </div>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 group-hover:text-white transition-colors duration-300 line-clamp-2 leading-tight">
            {category.name}
          </h3>

          <p className="flex-1 text-gray-600 text-[11px] sm:text-xs leading-snug mb-2 group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
            {category.description}
          </p>

          <div className="mt-auto flex items-center text-gray-700 font-medium text-[11px] sm:text-xs group-hover:text-white group-hover:gap-1 transition-all duration-300">
            <span>Explore</span>
            <FaArrowRight className="h-3 w-3 ml-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
  useEffect(() => {
    // Set loading to false after a short delay to ensure smooth page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full">
          <UnifiedNavbar />
          <Video />

          {/* Categories Section */}
          <div className="w-full py-3 sm:py-4 lg:py-5 bg-background">
            <div className="page-container page-section-y">
              {/* Section Header */}
              <div className="text-center mb-4 sm:mb-5 lg:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                  Explore Categories
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto px-2">
                  Discover our wide range of categories and find exactly what you're looking for
                </p>
              </div>
              
              <div className={categoryGridClass}>
                {categoryOrder.map((slug) => renderCategoryCard(categoryDefinitions[slug]))}
              </div>
              
            </div>
          </div>
          
          <Footer />
        </div>
      )}
    </div>
  );
}

export default Homepage;
