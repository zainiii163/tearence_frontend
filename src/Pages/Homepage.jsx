import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostNewAds from "../Component/PostNewAds";
import Footer from "../Component/Footer";
import Video from "../Component/Video";
import Navbar from "../Component/Navbar";
import Loading from "../Component/Loading";
import { usePostingAuth } from "../hooks/useAuthRedirect";
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

  // Authentication hooks for posting-related categories
  const { handlePostClick: handleBookPost } = usePostingAuth('/books/post-advert', 'You must be logged in to post a book advertisement.');
  const { handlePostClick: handleResortPost } = usePostingAuth('/resorts-travel?postForm=true', 'You must be logged in to post a resort or travel listing.');
  const { handlePostClick: handleEventPost } = usePostingAuth('/events-venues?postForm=true', 'You must be logged in to post an event or venue.');
  const { handlePostClick: handleBusinessPost } = usePostingAuth('/business?postForm=true', 'You must be logged in to post a business listing.');
  const { handlePostClick: handleFundingPost } = usePostingAuth('/funding?postForm=true', 'You must be logged in to post a funding project.');
  const { handlePostClick: handleDonationPost } = usePostingAuth('/donations?postForm=true', 'You must be logged in to create a donation campaign.');
  const { handlePostClick: handleSponsoredPost } = usePostingAuth('/sponsored-adverts?postForm=true', 'You must be logged in to post a sponsored advertisement.');
  const { handlePostClick: handleBuySellPost } = usePostingAuth('/buy-sell?postForm=true', 'You must be logged in to post an item for sale.');
  const { handlePostClick: handleAffiliatePost } = usePostingAuth('/affiliates?postForm=true', 'You must be logged in to post an affiliate program.');
  const { handlePostClick: handleFeaturedPost } = usePostingAuth('/promoted-adverts?postForm=true', 'You must be logged in to post a featured advertisement.');
  const { handlePostClick: handlePromotedPost } = usePostingAuth('/promoted-adverts?postForm=true', 'You must be logged in to post a promoted advertisement.');
  const { handlePostClick: handleBannerPost } = usePostingAuth('/banner-adverts?postForm=true', 'You must be logged in to post a banner advertisement.');
  const { handlePostClick: handleJobsPost } = usePostingAuth('/jobs?postForm=true', 'You must be logged in to post a job vacancy.');
  const { handlePostClick: handlePropertyPost } = usePostingAuth('/property?postForm=true', 'You must be logged in to post a property listing.');
  const { handlePostClick: handleServicesPost } = usePostingAuth('/services?postForm=true', 'You must be logged in to post a service.');
  const { handlePostClick: handleVehiclesPost } = usePostingAuth('/vehicles?postForm=true', 'You must be logged in to post a vehicle advertisement.');

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
    {
      slug: "affiliate",
      name: "Affiliate Programs",
      description: "Affiliate marketing opportunities and partnerships",
      icon: <FaMedal className="h-8 w-8" />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-100 to-cyan-100",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      hoverBg: "hover:from-blue-500 hover:to-cyan-500",
    },
    {
      slug: "featured",
      name: "Featured Ads",
      description: "Highlighted premium advertisements",
      icon: <FaStar className="h-8 w-8" />,
      color: "from-purple-600 to-indigo-600",
      bgColor: "bg-gradient-to-br from-purple-100 to-indigo-100",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      hoverBg: "hover:from-purple-600 hover:to-indigo-600",
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
    {
      slug: "resorts-travel",
      name: "Hotels, Resorts & Travel",
      description: "B&B, hotels, transport services, and tourist destinations",
      icon: <FaPlane className="h-8 w-8" />,
      color: "from-sky-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-sky-100 to-blue-100",
      iconColor: "text-sky-600",
      borderColor: "border-sky-200",
      hoverBg: "hover:from-sky-500 hover:to-blue-500",
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
                  // Determine if this is a posting-related category that needs auth
                  const isPostingCategory = ['book', 'resorts-travel', 'events', 'business', 'funding', 'donations', 'sponsored', 'buy-sell', 'affiliate', 'featured', 'promoted', 'banner', 'jobs', 'property', 'services', 'vehicles'].includes(category.slug);
                  
                  // Get the appropriate handler
                  const getPostHandler = (slug) => {
                    switch(slug) {
                      case 'book': return handleBookPost;
                      case 'resorts-travel': return handleResortPost;
                      case 'events': return handleEventPost;
                      case 'business': return handleBusinessPost;
                      case 'funding': return handleFundingPost;
                      case 'donations': return handleDonationPost;
                      case 'sponsored': return handleSponsoredPost;
                      case 'buy-sell': return handleBuySellPost;
                      case 'affiliate': return handleAffiliatePost;
                      case 'featured': return handleFeaturedPost;
                      case 'promoted': return handlePromotedPost;
                      case 'banner': return handleBannerPost;
                      case 'jobs': return handleJobsPost;
                      case 'property': return handlePropertyPost;
                      case 'services': return handleServicesPost;
                      case 'vehicles': return handleVehiclesPost;
                      default: return null;
                    }
                  };

                  const postHandler = getPostHandler(category.slug);
                  
                  const linkTo =
                    category.slug === 'books'
                      ? '/books/post-advert'
                      : category.slug === 'resorts-travel'
                      ? '/resorts-travel'
                      : category.slug === 'events'
                      ? '/events-venues'
                      : category.slug === 'business'
                      ? '/business'
                      : category.slug === 'funding'
                      ? '/funding-category'
                      : category.slug === 'donations'
                      ? '/donations'
                      : category.slug === 'sponsored'
                      ? '/sponsored-adverts'
                      : category.slug === 'buy-sell'
                        ? '/buy-sell'
                      : category.slug === 'affiliate'
                      ? '/affiliates'
                      : category.slug === 'featured'
                      ? '/promoted-adverts'
                      : category.slug === 'promoted'
                      ? '/promoted-adverts'
                      : category.slug === 'banner'
                      ? '/banner-adverts'
                      : category.slug === 'jobs'
                      ? '/jobs'
                      : category.slug === 'property'
                      ? '/property'
                      : category.slug === 'services'
                      ? '/services'
                      : category.slug === 'vehicles'
                      ? '/vehicles'
                      : `/category/${category.slug}`;
                  
                  return (
                    <div key={category.slug}>
                      {isPostingCategory && postHandler ? (
                        // Use button for posting categories (requires auth)
                        <button
                          onClick={postHandler}
                          className={`group relative overflow-hidden rounded-xl w-full ${category.bgColor} ${category.borderColor} border-2 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${category.hoverBg} hover:text-white text-left`}
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
                              <span>Post Now</span>
                              <FaArrowRight className="h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </button>
                      ) : (
                        // Use Link for non-posting categories (browse-only)
                        <Link
                          to={linkTo}
                          className={`group relative overflow-hidden rounded-xl ${category.bgColor} ${category.borderColor} border-2 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${category.hoverBg} hover:text-white`}
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
                              <span>Explore</span>
                              <FaArrowRight className="h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </Link>
                      )}
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
