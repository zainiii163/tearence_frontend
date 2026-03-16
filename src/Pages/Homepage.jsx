import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PostNewAds from "../Component/PostNewAds";
import Footer from "../Component/Footer";
import Video from "../Component/Video";
import Navbar from "../Component/Navbar";
import Loading from "../Component/Loading";
import useAuthRedirect from "../hooks/useAuthRedirect";
import {
  FaIndustry,
  FaBriefcase,
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
} from "react-icons/fa";

function Homepage() {
  const [isLoading, setIsLoading] = useState(true);
  const { requireAuth } = useAuthRedirect();
  const navigate = useNavigate();

  // Categories that are primarily for exploration should not require authentication
  const exploreCategories = ['books', 'banner', 'sponsored', 'promoted', 'featured', 'events', 'business', 
                            'buy-sell', 'services', 'jobs', 'property', 'vehicles', 'funding', 'donations'];
  
  // These categories still require authentication for posting
  const postAuthCategories = ['resorts', 'affiliate', 'classifieds', 'investment'];

  // Handle category card clicks with authentication for posting
  const handleCategoryClick = (category) => {
    // Define routes with post form parameters for posting categories
    const postFormRoutes = {
      'vehicles': '/vehicles?postForm=true',
      'funding': '/funding?postForm=true',
      'donations': '/donations?postForm=true',
      'jobs': '/jobs?postForm=true',
      'property': '/property?postForm=true',
      'services': '/services?postForm=true',
      'banner': '/banner-adverts?postForm=true',
      'sponsored': '/sponsored-adverts?postForm=true',
      'promoted': '/promoted-adverts?postForm=true',
      'buy-sell': '/buy-sell?postForm=true',
      'business': '/business?postForm=true',
      'events': '/events-venues?postForm=true',
      'resorts': '/resorts-travel?postForm=true',
      'featured': '/featured?postForm=true',
      'affiliate': '/affiliate?postForm=true',
      'classifieds': '/classifieds-ads?postForm=true',
      'investment': '/investment-category?postForm=true'
    };

    // For "Post Now" categories, require authentication and navigate to post form
    if (category.slug !== 'books' && !exploreCategories.includes(category.slug) && postFormRoutes[category.slug]) {
      requireAuth(postFormRoutes[category.slug], `You must be logged in to post in ${category.name}.`);
      return;
    }

    // For "Explore" categories (like books), navigate directly to page
    const exploreRoutes = {
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
      'stores': '/stores'
    };

    const targetRoute = exploreRoutes[category.slug] || `/category/${category.slug}`;
    navigate(targetRoute);
  };

// Define the categories to display on homepage in 4 rows of 4 cards each
  const categories = [
    // First row: sponsered, classified, services & featured
    {
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
    {
      slug: "buy-sell",
      name: "Buy and Sell",
      description: "Post anything you want to sell or find items to purchase",
      icon: <FaUsers className="h-8 w-8" />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      hoverBg: "hover:from-green-500 hover:to-emerald-500",
    },
    
    // Second row: business, services, jobs & property
    {
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
    {
      slug: "services",
      name: "Services & Solutions",
      description: "Professional services, consulting, and business solutions",
      icon: <FaCogs className="h-8 w-8" />,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-100 to-orange-100",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200",
      hoverBg: "hover:from-amber-500 hover:to-orange-500",
    },
    {
      slug: "jobs",
      name: "Jobs & Vacancies", 
      description: "Discover career opportunities and job openings worldwide",
      icon: <FaBriefcase className="h-8 w-8" />,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-100 to-teal-100",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      hoverBg: "hover:from-emerald-500 hover:to-teal-500",
    },
    {
      slug: "property",
      name: "Property & Real Estate",
      description: "Browse properties for sale, rent, and real estate investments",
      icon: <FaHome className="h-8 w-8" />,
      color: "from-violet-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-violet-100 to-purple-100",
      iconColor: "text-violet-600",
      borderColor: "border-violet-200",
      hoverBg: "hover:from-violet-500 hover:to-purple-500",
    },

    // Third row: promoted, banner, Events & resorts
    {
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
    {
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
    {
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
    
    // Fourth row: vehicles, investment, books & funding
    {
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
    {
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
    {
      slug: "donations",
      name: "Charities & Donations",
      description: "Humanitarian causes and charitable contributions",
      icon: <FaHeart className="h-8 w-8" />,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-gradient-to-br from-pink-100 to-rose-100",
      iconColor: "text-pink-600",
      borderColor: "border-pink-200",
      hoverBg: "hover:from-pink-500 hover:to-rose-500",
    },
    {
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

    // Fifth row: resorts, featured, affiliate & classifieds
    {
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
    {
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
    {
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
    {
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

    // Sixth row: investment & stores
    {
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
    {
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
  ];
  useEffect(() => {
    if (localStorage.getItem("hasVisitedHomepage")) {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("hasVisitedHomepage", "true");
      }, 1000);
    }
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full">
          <Navbar />
          <Video />

          {/* Categories Section */}
          <div className="w-full py-4 sm:py-6 lg:py-8 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                {categories.map((category) => {
                  return (
                    <div key={category.slug}>
                      <div
                        onClick={() => handleCategoryClick(category)}
                        className={`group relative overflow-hidden rounded-xl w-full ${category.bgColor} ${category.borderColor} border-2 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${category.hoverBg} hover:text-white text-left cursor-pointer`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300" 
                             style={{backgroundImage: `linear-gradient(to bottom right, ${category.color.split(' ')[1]}, ${category.color.split(' ')[3]})`}} />
                         
                        <div className="relative p-2 sm:p-3 lg:p-4">
                          <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-white/80 backdrop-blur-sm mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20`}>
                            <div className={`${category.iconColor} group-hover:text-white transition-colors duration-300 text-xs sm:text-sm lg:text-base`}>
                              {category.icon}
                            </div>
                          </div>
                          
                          <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-800 mb-1 sm:mb-2 group-hover:text-white transition-colors duration-300">
                            {category.name}
                          </h3>
                          
                          <p className="text-gray-600 text-xs sm:text-xs lg:text-sm leading-relaxed mb-2 sm:mb-3 group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                            {category.description}
                          </p>
                          
                          <div className="flex items-center text-gray-700 font-medium text-xs group-hover:text-white group-hover:gap-2 transition-all duration-300">
                            <span>
                              {exploreCategories.includes(category.slug) ? 'Explore' : 'Post Now'}
                            </span>
                            <FaArrowRight className="h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>                  );
                })}
              </div>
              
            </div>
          </div>
          
          <PostNewAds />
          <Footer />
        </div>
      )}
    </div>
  );
}

export default Homepage;
