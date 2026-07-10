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
      'investment': '/investment-category',
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
      name: "Funding & Investment",
      description: "Business investment, partnerships, and funding opportunities",
      icon: <FaChartLine className="h-8 w-8" />,
      color: "from-green-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-green-100 to-teal-100",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      hoverBg: "hover:from-green-500 hover:to-teal-500",
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
      name: "Investment Opportunities",
      description: "Investment opportunities and financial services",
      icon: <FaChartLine className="h-8 w-8" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-100 to-teal-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      hoverBg: "hover:from-emerald-500 hover:to-teal-500",
    },
  };

  const categoryRowSlugs = [
    ["buy-sell", "business", "services", "property"],
    ["events", "sponsored", "promoted", "banner", "featured"],
    ["funding", "stores", "books", "vehicles", "donations"],
    ["images", "classifieds", "affiliate", "resorts", "investment"],
  ];

  const categoryGridClass =
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 items-stretch";

  const renderCategoryCard = (category) => (
    <div key={category.slug} className="h-full">
      <div
        onClick={() => handleCategoryClick(category)}
        className={`group relative overflow-hidden rounded-xl w-full h-full min-h-[220px] sm:min-h-[230px] lg:min-h-[240px] flex flex-col ${category.bgColor} ${category.borderColor} border-2 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${category.hoverBg} hover:text-white text-left cursor-pointer`}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${category.color.split(" ")[1]}, ${category.color.split(" ")[3]})`,
          }}
        />

        <div className="relative flex flex-col flex-1 p-4 sm:p-5 lg:p-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/80 backdrop-blur-sm mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20 shrink-0">
            <div
              className={`${category.iconColor} group-hover:text-white transition-colors duration-300 text-lg sm:text-xl`}
            >
              {React.isValidElement(category.icon) ? category.icon : null}
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 group-hover:text-white transition-colors duration-300 line-clamp-2 min-h-[3rem]">
            {category.name}
          </h3>

          <p className="flex-1 text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-white/90 transition-colors duration-300 line-clamp-3">
            {category.description}
          </p>

          <div className="mt-auto flex items-center text-gray-700 font-medium text-sm group-hover:text-white group-hover:gap-2 transition-all duration-300">
            <span>Explore</span>
            <FaArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
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
          <div className="w-full py-4 sm:py-6 lg:py-8 bg-background">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
              {/* Section Header */}
              <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Explore Categories
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                  Discover our wide range of categories and find exactly what you're looking for
                </p>
              </div>
              
              <div className={categoryGridClass}>
                {categoryRowSlugs.flatMap((rowSlugs, rowIndex) => {
                  const cards = rowSlugs.map((slug) =>
                    renderCategoryCard(categoryDefinitions[slug])
                  );

                  if (rowIndex === 0) {
                    cards.push(
                      <div key="row-1-spacer" className="hidden xl:block" aria-hidden="true" />
                    );
                  }

                  return cards;
                })}
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
