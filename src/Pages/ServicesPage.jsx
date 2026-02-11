import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  FaSearch, 
  FaFilter, 
  FaStar, 
  FaHeart, 
  FaDollarSign,
  FaClock,
  FaBriefcase,
  FaPalette,
  FaCode,
  FaPen,
  FaCamera,
  FaMusic,
  FaChartLine,
  FaBullhorn,
  FaLanguage,
  FaChevronRight,
  FaTimes,
  FaCheckCircle,
  FaUser,
  FaGlobe,
  FaTrophy,
  FaLightbulb,
  FaMobile,
  FaDatabase,
  FaCloud,
  FaShieldAlt,
  FaSearchPlus,
  FaTag,
  FaHeadset,
  FaChartBar,
  FaVideo,
  FaMicrophone,
  FaPaintBrush,
  FaLaptop,
  FaServer,
  FaRobot,
  FaGamepad,
  FaDumbbell,
  FaPlane,
  FaUtensils,
  FaEnvelope,
  FaEye,
  FaHandHoldingHeart,
  FaHome,
  FaBuilding,
  FaIndustry,
  FaSeedling,
  FaLandmark,
  FaAd,
  FaCrown,
  FaBook,
  FaUsers,
  FaExclamationTriangle,
  FaFire
} from "react-icons/fa";
import { BsGrid3X3Gap, BsListUl } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { MdLocalOffer, MdVerified } from "react-icons/md";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import SubcategoryNavigation from "../Component/SubcategoryNavigation";
import servicesService from "../services/ServicesServices";

// Sample service data (in real app, this would come from API)
const sampleServices = [
  {
    id: 1,
    title: "Professional Logo Design",
    category: "graphics-design",
    subcategory: "logo-design",
    seller: "John Designer",
    rating: 4.9,
    reviews: 234,
    price: 45,
    deliveryTime: "3 days",
    image: "/img/logo-design.jpg",
    description: "I will create a professional and modern logo for your business",
    level: "Level 2 Seller",
    featured: true,
    online: true,
    pro: false,
    languages: ["English", "Spanish"],
    sellerImage: "/img/seller1.jpg"
  },
  {
    id: 2,
    title: "React Web Development",
    category: "programming-tech",
    subcategory: "web-development",
    seller: "Sarah Developer",
    rating: 5.0,
    reviews: 189,
    price: 150,
    deliveryTime: "7 days",
    image: "/img/react-dev.jpg",
    description: "I will build a responsive React web application",
    level: "Top Rated Seller",
    featured: true,
    online: true,
    pro: true,
    languages: ["English", "French"],
    sellerImage: "/img/seller2.jpg"
  },
  {
    id: 3,
    title: "SEO Content Writing",
    category: "writing-translation",
    subcategory: "content-writing",
    seller: "Mike Writer",
    rating: 4.8,
    reviews: 156,
    price: 35,
    deliveryTime: "2 days",
    image: "/img/content-writing.jpg",
    description: "I will write SEO-optimized blog posts and articles",
    level: "Level 1 Seller",
    online: false,
    pro: false,
    languages: ["English"],
    sellerImage: "/img/seller3.jpg"
  },
  {
    id: 4,
    title: "Professional Video Editing",
    category: "video-photo",
    subcategory: "video-editing",
    seller: "Alex Video",
    rating: 4.7,
    reviews: 98,
    price: 80,
    deliveryTime: "5 days",
    image: "/img/video-editing.jpg",
    description: "I will edit your videos professionally with transitions and effects",
    level: "Level 2 Seller",
    online: true,
    pro: false,
    languages: ["English", "German"],
    sellerImage: "/img/seller4.jpg"
  },
  {
    id: 5,
    title: "Social Media Marketing",
    category: "marketing",
    subcategory: "social-media-marketing",
    seller: "Emma Marketing",
    rating: 4.9,
    reviews: 267,
    price: 120,
    deliveryTime: "4 days",
    image: "/img/social-media.jpg",
    description: "I will manage your social media accounts and create content",
    level: "Top Rated Seller",
    featured: true,
    online: true,
    pro: true,
    languages: ["English", "Spanish", "French"],
    sellerImage: "/img/seller5.jpg"
  },
  {
    id: 6,
    title: "Business Plan Writing",
    category: "business",
    subcategory: "business-plans",
    seller: "David Business",
    rating: 4.6,
    reviews: 78,
    price: 200,
    deliveryTime: "10 days",
    image: "/img/business-plan.jpg",
    description: "I will create a comprehensive business plan for your startup",
    level: "Level 1 Seller",
    online: false,
    pro: false,
    languages: ["English"],
    sellerImage: "/img/seller6.jpg"
  },
  {
    id: 7,
    title: "Brand Identity Design",
    category: "graphics-design",
    subcategory: "branding",
    seller: "Lisa Creative",
    rating: 4.9,
    reviews: 312,
    price: 300,
    deliveryTime: "14 days",
    image: "/img/brand-identity.jpg",
    description: "Complete brand identity package with logo, colors, and guidelines",
    level: "Top Rated Seller",
    featured: true,
    online: true,
    pro: true,
    languages: ["English", "Italian"],
    sellerImage: "/img/seller7.jpg"
  },
  {
    id: 8,
    title: "Mobile App Development",
    category: "programming-tech",
    subcategory: "mobile-apps",
    seller: "Tom Mobile",
    rating: 4.8,
    reviews: 145,
    price: 500,
    deliveryTime: "21 days",
    image: "/img/mobile-app.jpg",
    description: "I will develop a native mobile app for iOS and Android",
    level: "Level 2 Seller",
    online: true,
    pro: false,
    languages: ["English"],
    sellerImage: "/img/seller8.jpg"
  },
  {
    id: 9,
    title: "Voice Over Recording",
    category: "music-audio",
    subcategory: "voice-over",
    seller: "Rachel Voice",
    rating: 4.9,
    reviews: 423,
    price: 60,
    deliveryTime: "2 days",
    image: "/img/voice-over.jpg",
    description: "Professional voice over for commercials, videos, and podcasts",
    level: "Top Rated Seller",
    online: true,
    pro: true,
    languages: ["English", "Spanish", "French"],
    sellerImage: "/img/seller9.jpg"
  },
  {
    id: 10,
    title: "Professional Photography",
    category: "video-photo",
    subcategory: "photography",
    seller: "Mark Photo",
    rating: 4.7,
    reviews: 189,
    price: 250,
    deliveryTime: "7 days",
    image: "/img/photography.jpg",
    description: "Product photography and event coverage services",
    level: "Level 2 Seller",
    online: false,
    pro: false,
    languages: ["English"],
    sellerImage: "/img/seller10.jpg"
  },
  {
    id: 11,
    title: "SEO Optimization",
    category: "marketing",
    subcategory: "seo",
    seller: "Kevin SEO",
    rating: 4.8,
    reviews: 267,
    price: 180,
    deliveryTime: "14 days",
    image: "/img/seo.jpg",
    description: "Complete SEO audit and optimization for your website",
    level: "Top Rated Seller",
    featured: true,
    online: true,
    pro: true,
    languages: ["English", "German"],
    sellerImage: "/img/seller11.jpg"
  },
  {
    id: 12,
    title: "Fitness Coaching",
    category: "lifestyle",
    subcategory: "fitness",
    seller: "Amy Fitness",
    rating: 4.9,
    reviews: 156,
    price: 90,
    deliveryTime: "1 day",
    image: "/img/fitness.jpg",
    description: "Personalized fitness plans and online coaching sessions",
    level: "Level 1 Seller",
    online: true,
    pro: false,
    languages: ["English"],
    sellerImage: "/img/seller12.jpg"
  },
  {
    id: 13,
    title: "Business Investment Consulting",
    category: "funding",
    subcategory: "business-investment",
    seller: "Michael Investor",
    rating: 4.8,
    reviews: 89,
    price: 500,
    deliveryTime: "14 days",
    image: "/img/business-investment.jpg",
    description: "Expert guidance for business investment opportunities and partnership deals",
    level: "Top Rated Seller",
    featured: true,
    online: true,
    pro: true,
    languages: ["English", "Spanish"],
    sellerImage: "/img/seller13.jpg"
  },
  {
    id: 14,
    title: "Startup Funding Strategy",
    category: "funding",
    subcategory: "startup-funding",
    seller: "Sarah Startup",
    rating: 4.9,
    reviews: 156,
    price: 300,
    deliveryTime: "7 days",
    image: "/img/startup-funding.jpg",
    description: "Comprehensive startup funding strategy and investor pitch preparation",
    level: "Level 2 Seller",
    online: true,
    pro: false,
    languages: ["English"],
    sellerImage: "/img/seller14.jpg"
  },
  {
    id: 15,
    title: "Humanitarian Aid Campaign",
    category: "charities-donations",
    subcategory: "humanitarian-aid",
    seller: "Help Foundation",
    rating: 5.0,
    reviews: 423,
    price: 25,
    deliveryTime: "1 day",
    image: "/img/humanitarian-aid.jpg",
    description: "Support humanitarian causes and disaster relief efforts worldwide",
    level: "Verified Organization",
    featured: true,
    online: true,
    pro: true,
    languages: ["English", "French", "Spanish"],
    sellerImage: "/img/seller15.jpg"
  },
  {
    id: 16,
    title: "Medical Donation Support",
    category: "charities-donations",
    subcategory: "medical-donations",
    seller: "Health Matters",
    rating: 4.9,
    reviews: 267,
    price: 50,
    deliveryTime: "3 days",
    image: "/img/medical-donations.jpg",
    description: "Help fund medical treatments and healthcare for those in need",
    level: "Verified Charity",
    online: true,
    pro: false,
    languages: ["English"],
    sellerImage: "/img/seller16.jpg"
  },
  {
    id: 17,
    title: "Web Banner Design",
    category: "banner-ads",
    subcategory: "web-banners",
    seller: "Banner Pro",
    rating: 4.7,
    reviews: 178,
    price: 75,
    deliveryTime: "4 days",
    image: "/img/web-banners.jpg",
    description: "Professional web banner design for websites and online campaigns",
    level: "Level 2 Seller",
    online: true,
    pro: false,
    languages: ["English", "Spanish"],
    sellerImage: "/img/seller17.jpg"
  },
  {
    id: 18,
    title: "Social Media Banner Ads",
    category: "banner-ads",
    subcategory: "social-media-banners",
    seller: "Social Ads Expert",
    rating: 4.8,
    reviews: 234,
    price: 100,
    deliveryTime: "3 days",
    image: "/img/social-banners.jpg",
    description: "Eye-catching social media banner ads for all platforms",
    level: "Top Rated Seller",
    featured: true,
    online: true,
    pro: true,
    languages: ["English", "French", "German"],
    sellerImage: "/img/seller18.jpg"
  },
  {
    id: 19,
    title: "Sponsored Content Creation",
    category: "sponsored-featured",
    subcategory: "sponsored-posts",
    seller: "Content Sponsor",
    rating: 4.9,
    reviews: 312,
    price: 200,
    deliveryTime: "5 days",
    image: "/img/sponsored-content.jpg",
    description: "Create engaging sponsored content for brands and businesses",
    level: "Top Rated Seller",
    featured: true,
    online: true,
    pro: true,
    languages: ["English", "Spanish"],
    sellerImage: "/img/seller19.jpg"
  },
  {
    id: 20,
    title: "Premium Featured Listings",
    category: "sponsored-featured",
    subcategory: "featured-listings",
    seller: "Promote Plus",
    rating: 4.6,
    reviews: 145,
    price: 150,
    deliveryTime: "2 days",
    image: "/img/featured-listings.jpg",
    description: "Get premium placement and featured listing promotion for your services",
    level: "Level 1 Seller",
    online: false,
    pro: false,
    languages: ["English"],
    sellerImage: "/img/seller20.jpg"
  },
  {
    id: 21,
    title: "Residential House Sales",
    category: "property-real-estate",
    subcategory: "houses",
    seller: "Home Realty",
    rating: 4.8,
    reviews: 289,
    price: 1000,
    deliveryTime: "30 days",
    image: "/img/houses.jpg",
    description: "Professional residential property sales and real estate services",
    level: "Top Rated Seller",
    featured: true,
    online: true,
    pro: true,
    languages: ["English", "Spanish"],
    sellerImage: "/img/seller21.jpg"
  },
  {
    id: 22,
    title: "Commercial Property Leasing",
    category: "property-real-estate",
    subcategory: "commercial",
    seller: "Commercial Spaces",
    rating: 4.7,
    reviews: 167,
    price: 800,
    deliveryTime: "21 days",
    image: "/img/commercial-property.jpg",
    description: "Commercial property leasing and business space solutions",
    level: "Level 2 Seller",
    online: true,
    pro: false,
    languages: ["English"],
    sellerImage: "/img/seller22.jpg"
  },
  {
    id: 23,
    title: "Industrial Property Management",
    category: "property-real-estate",
    subcategory: "industrial",
    seller: "Industrial Pro",
    rating: 4.9,
    reviews: 98,
    price: 1200,
    deliveryTime: "45 days",
    image: "/img/industrial-property.jpg",
    description: "Industrial property management and warehouse solutions",
    level: "Top Rated Seller",
    online: false,
    pro: true,
    languages: ["English", "German"],
    sellerImage: "/img/seller23.jpg"
  },
  {
    id: 24,
    title: "Farm Land Sales",
    category: "property-real-estate",
    subcategory: "farm",
    seller: "Agri Realty",
    rating: 4.6,
    reviews: 76,
    price: 600,
    deliveryTime: "60 days",
    image: "/img/farm-land.jpg",
    description: "Agricultural land and farm property sales services",
    level: "Level 1 Seller",
    online: true,
    pro: false,
    languages: ["English"],
    sellerImage: "/img/seller24.jpg"
  },
  {
    id: 25,
    title: "Land Plot Development",
    category: "property-real-estate",
    subcategory: "plots",
    seller: "Plot Developers",
    rating: 4.8,
    reviews: 134,
    price: 400,
    deliveryTime: "90 days",
    image: "/img/land-plots.jpg",
    description: "Land plot development and investment opportunities",
    level: "Level 2 Seller",
    online: true,
    pro: false,
    languages: ["English", "Spanish"],
    sellerImage: "/img/seller25.jpg"
  }
];

const ServicesPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [deliveryTime, setDeliveryTime] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [sellerLevel, setSellerLevel] = useState("all");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [proOnly, setProOnly] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Service categories like Fiverr with subcategories
  const categories = [
    {
      id: "graphics-design",
      name: "Graphics & Design",
      icon: <FaPalette className="h-6 w-6" />,
      description: "Logo design, branding, web design, illustration",
      color: "bg-purple-100 text-purple-600",
      subcategories: [
        { id: "logo-design", name: "Logo Design", icon: <FaPaintBrush /> },
        { id: "branding", name: "Brand Style Guides", icon: <FaTrophy /> },
        { id: "web-design", name: "Web & App Design", icon: <FaLaptop /> },
        { id: "illustration", name: "Illustration", icon: <FaPen /> },
        { id: "print-design", name: "Print Design", icon: <FaTag /> },
        { id: "social-media-design", name: "Social Media Design", icon: <FaBullhorn /> }
      ]
    },
    {
      id: "programming-tech",
      name: "Programming & Tech",
      icon: <FaCode className="h-6 w-6" />,
      description: "Web development, mobile apps, software engineering",
      color: "bg-blue-100 text-blue-600",
      subcategories: [
        { id: "web-development", name: "Web Development", icon: <FaLaptop /> },
        { id: "mobile-apps", name: "Mobile Apps", icon: <FaMobile /> },
        { id: "desktop-apps", name: "Desktop Applications", icon: <FaServer /> },
        { id: "databases", name: "Database Development", icon: <FaDatabase /> },
        { id: "cloud-computing", name: "Cloud Computing", icon: <FaCloud /> },
        { id: "ai-ml", name: "AI & Machine Learning", icon: <FaRobot /> },
        { id: "cybersecurity", name: "Cybersecurity", icon: <FaShieldAlt /> }
      ]
    },
    {
      id: "writing-translation",
      name: "Writing & Translation",
      icon: <FaPen className="h-6 w-6" />,
      description: "Content writing, copywriting, translation services",
      color: "bg-green-100 text-green-600",
      subcategories: [
        { id: "content-writing", name: "Content Writing", icon: <FaPen /> },
        { id: "copywriting", name: "Copywriting", icon: <FaBullhorn /> },
        { id: "technical-writing", name: "Technical Writing", icon: <FaCode /> },
        { id: "translation", name: "Translation", icon: <FaLanguage /> },
        { id: "proofreading", name: "Proofreading & Editing", icon: <FaCheckCircle /> }
      ]
    },
    {
      id: "video-photo",
      name: "Video & Photo",
      icon: <FaCamera className="h-6 w-6" />,
      description: "Video editing, photography, animation services",
      color: "bg-pink-100 text-pink-600",
      subcategories: [
        { id: "video-editing", name: "Video Editing", icon: <FaVideo /> },
        { id: "photography", name: "Photography", icon: <FaCamera /> },
        { id: "animation", name: "Animation", icon: <HiSparkles /> },
        { id: "visual-effects", name: "Visual Effects", icon: <FaLightbulb /> },
        { id: "drone-videography", name: "Drone Videography", icon: <FaPlane /> }
      ]
    },
    {
      id: "music-audio",
      name: "Music & Audio",
      icon: <FaMusic className="h-6 w-6" />,
      description: "Music production, voice over, audio editing",
      color: "bg-yellow-100 text-yellow-600",
      subcategories: [
        { id: "music-production", name: "Music Production", icon: <FaMusic /> },
        { id: "voice-over", name: "Voice Over", icon: <FaMicrophone /> },
        { id: "audio-editing", name: "Audio Editing", icon: <FaHeadset /> },
        { id: "mixing-mastering", name: "Mixing & Mastering", icon: <FaChartBar /> },
        { id: "podcast-production", name: "Podcast Production", icon: <FaMicrophone /> }
      ]
    },
    {
      id: "marketing",
      name: "Marketing",
      icon: <FaBullhorn className="h-6 w-6" />,
      description: "Digital marketing, SEO, social media marketing",
      color: "bg-red-100 text-red-600",
      subcategories: [
        { id: "digital-marketing", name: "Digital Marketing", icon: <FaChartLine /> },
        { id: "seo", name: "SEO", icon: <FaSearchPlus /> },
        { id: "social-media-marketing", name: "Social Media Marketing", icon: <FaBullhorn /> },
        { id: "content-marketing", name: "Content Marketing", icon: <FaPen /> },
        { id: "email-marketing", name: "Email Marketing", icon: <FaEnvelope /> },
        { id: "ppc-advertising", name: "PPC Advertising", icon: <FaDollarSign /> }
      ]
    },
    {
      id: "business",
      name: "Business",
      icon: <FaChartLine className="h-6 w-6" />,
      description: "Business consulting, market research, plans",
      color: "bg-indigo-100 text-indigo-600",
      subcategories: [
        { id: "business-consulting", name: "Business Consulting", icon: <FaChartLine /> },
        { id: "market-research", name: "Market Research", icon: <FaSearchPlus /> },
        { id: "business-plans", name: "Business Plans", icon: <FaBriefcase /> },
        { id: "presentations", name: "Presentations", icon: <FaChartBar /> },
        { id: "legal-consulting", name: "Legal Consulting", icon: <FaShieldAlt /> }
      ]
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      icon: <FaHeart className="h-6 w-6" />,
      description: "Gaming, fitness, travel, astrology services",
      color: "bg-rose-100 text-rose-600",
      subcategories: [
        { id: "gaming", name: "Gaming", icon: <FaGamepad /> },
        { id: "fitness", name: "Fitness", icon: <FaDumbbell /> },
        { id: "travel", name: "Travel", icon: <FaPlane /> },
        { id: "astrology", name: "Astrology", icon: <FaStar /> },
        { id: "cooking", name: "Cooking", icon: <FaUtensils /> },
        { id: "lifestyle-coaching", name: "Lifestyle Coaching", icon: <FaHeart /> }
      ]
    },
    {
      id: "funding",
      name: "Business Funding & Investment",
      icon: <FaChartLine className="h-6 w-6" />,
      description: "Business investment opportunities, partnerships, startup funding, and venture capital for entrepreneurs",
      color: "bg-emerald-100 text-emerald-600",
      purpose: "business",
      subcategories: [
        { id: "business-investment", name: "Business Investment", icon: <FaBriefcase /> },
        { id: "startup-funding", name: "Startup Funding", icon: <FaChartLine /> },
        { id: "venture-capital", name: "Venture Capital", icon: <FaDollarSign /> },
        { id: "partnership-opportunities", name: "Partnership Opportunities", icon: <FaBriefcase /> },
        { id: "crowdfunding", name: "Crowdfunding", icon: <FaUsers /> }
      ]
    },
    {
      id: "charities-donations",
      name: "Charities & Humanitarian Aid",
      icon: <FaHandHoldingHeart className="h-6 w-6" />,
      description: "Support humanitarian causes, charitable organizations, and donation campaigns for those in need",
      color: "bg-pink-100 text-pink-600",
      purpose: "humanitarian",
      subcategories: [
        { id: "humanitarian-aid", name: "Humanitarian Aid", icon: <FaHandHoldingHeart /> },
        { id: "medical-donations", name: "Medical Donations", icon: <FaHeart /> },
        { id: "education-funds", name: "Education Funds", icon: <FaBook /> },
        { id: "disaster-relief", name: "Disaster Relief", icon: <FaHeart /> },
        { id: "community-support", name: "Community Support", icon: <FaUsers /> }
      ]
    },
    {
      id: "banner-ads",
      name: "Banner Ads",
      icon: <FaAd className="h-6 w-6" />,
      description: "Banner advertising, display ads, promotional banners",
      color: "bg-orange-100 text-orange-600",
      subcategories: [
        { id: "web-banners", name: "Web Banners", icon: <FaGlobe /> },
        { id: "mobile-banners", name: "Mobile Banners", icon: <FaMobile /> },
        { id: "social-media-banners", name: "Social Media Banners", icon: <FaBullhorn /> },
        { id: "email-banners", name: "Email Banners", icon: <FaEnvelope /> },
        { id: "digital-billboards", name: "Digital Billboards", icon: <FaAd /> }
      ]
    },
    {
      id: "sponsored-featured",
      name: "Sponsored & Featured",
      icon: <FaCrown className="h-6 w-6" />,
      description: "Sponsored content, featured listings, promoted services",
      color: "bg-purple-100 text-purple-600",
      subcategories: [
        { id: "sponsored-posts", name: "Sponsored Posts", icon: <FaBullhorn /> },
        { id: "featured-listings", name: "Featured Listings", icon: <FaStar /> },
        { id: "promoted-ads", name: "Promoted Ads", icon: <FaAd /> },
        { id: "premium-placement", name: "Premium Placement", icon: <FaCrown /> },
        { id: "highlighted-services", name: "Highlighted Services", icon: <FaStar /> }
      ]
    },
    {
      id: "property-real-estate",
      name: "Property & Real Estate",
      icon: <FaHome className="h-6 w-6" />,
      description: "Real estate services, property sales, rentals, and management",
      color: "bg-teal-100 text-teal-600",
      subcategories: [
        { id: "houses", name: "Houses", icon: <FaHome /> },
        { id: "commercial", name: "Commercial Properties", icon: <FaBuilding /> },
        { id: "industrial", name: "Industrial Properties", icon: <FaIndustry /> },
        { id: "farm", name: "Farm & Agricultural", icon: <FaSeedling /> },
        { id: "plots", name: "Land & Plots", icon: <FaLandmark /> }
      ]
    }
  ];

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredServices, setFilteredServices] = useState([]);

  // Search suggestions
  const popularSearches = useMemo(() => [
    "logo design", "web development", "content writing", "video editing",
    "social media marketing", "SEO optimization", "mobile app development",
    "voice over", "business plan", "brand identity", "photography",
    "business investment", "startup funding", "humanitarian aid", "banner design",
    "sponsored content", "property sales", "commercial real estate", "farm land"
  ], []);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const params = {
          search: searchQuery || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          priceMin: priceRange.min || undefined,
          priceMax: priceRange.max || undefined,
          sortBy: sortBy !== "relevance" ? sortBy : undefined,
          limit: 50
        };
        
        const response = await servicesService.getServicesList(params);
        
        // Debug: Log the actual response structure
        console.log('API Response:', response);
        
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Transform API data to match our component structure
          const transformedServices = response.data.data.map(service => ({
            id: service.id,
            title: service.title || service.name,
            category: service.category || "programming-tech",
            subcategory: service.subcategory || "web-development",
            seller: service.seller?.name || "Professional Seller",
            rating: service.rating || 4.5,
            reviews: service.reviews || Math.floor(Math.random() * 500) + 10,
            price: service.price || 50,
            deliveryTime: service.deliveryTime || "3 days",
            image: service.image || "/img/NoImage.png",
            description: service.description || "Professional service with excellent quality and fast delivery.",
            level: service.level || "Level 1 Seller",
            featured: service.featured || false,
            online: service.online !== false,
            pro: service.pro || false,
            languages: service.languages || ["English"],
            sellerImage: service.seller?.image || "/img/NoImage.png"
          }));
          
          setServices(transformedServices);
        } else {
          // Debug: Log why we're falling back
          console.log('API Response structure unexpected:', {
            hasData: !!response.data,
            hasDataData: !!(response.data && response.data.data),
            dataDataType: response.data && response.data.data ? typeof response.data.data : 'undefined',
            isArray: response.data && response.data.data ? Array.isArray(response.data.data) : false
          });
          // Fallback to sample data if API returns no data or wrong structure
          setServices(sampleServices);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Using sample data.');
        // Fallback to sample data on error
        setServices(sampleServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [searchQuery, selectedCategory, priceRange, sortBy]);
  useEffect(() => {
    if (searchQuery.trim()) {
      const suggestions = popularSearches.filter(search => 
        search.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(suggestions.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, popularSearches, setSearchSuggestions, setShowSuggestions]);

  // Filter services based on criteria
  useEffect(() => {
    let filtered = services;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory !== "all") {
      filtered = filtered.filter(service => service.subcategory === selectedSubcategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(service => 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.seller.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange.min) {
      filtered = filtered.filter(service => service.price >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(service => service.price <= parseInt(priceRange.max));
    }

    // Filter by delivery time
    if (deliveryTime !== "all") {
      filtered = filtered.filter(service => {
        const days = parseInt(service.deliveryTime);
        switch (deliveryTime) {
          case "1": return days <= 1;
          case "3": return days <= 3;
          case "7": return days <= 7;
          case "14": return days <= 14;
          case "30": return days <= 30;
          default: return true;
        }
      });
    }

    // Filter by seller level
    if (sellerLevel !== "all") {
      filtered = filtered.filter(service => {
        switch (sellerLevel) {
          case "new": return service.level === "New Seller";
          case "level1": return service.level === "Level 1 Seller";
          case "level2": return service.level === "Level 2 Seller";
          case "toprated": return service.level === "Top Rated Seller";
          default: return true;
        }
      });
    }

    // Filter by online status
    if (onlineOnly) {
      filtered = filtered.filter(service => service.online);
    }

    // Filter by pro status
    if (proOnly) {
      filtered = filtered.filter(service => service.pro);
    }

    // Filter by languages
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(service => 
        selectedLanguages.some(lang => service.languages.includes(lang))
      );
    }

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_low": return a.price - b.price;
        case "price_high": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        case "reviews": return b.reviews - a.reviews;
        case "relevance":
        default: return 0;
      }
    });

    setFilteredServices(filtered);
  }, [services, selectedCategory, selectedSubcategory, searchQuery, priceRange, deliveryTime, sellerLevel, onlineOnly, proOnly, selectedLanguages, sortBy]);

  const deliveryOptions = [
    { value: "all", label: "Any delivery time" },
    { value: "1", label: "Within 24 hours" },
    { value: "3", label: "Within 3 days" },
    { value: "7", label: "Within 7 days" },
    { value: "14", label: "Within 14 days" },
    { value: "30", label: "Within 30 days" }
  ];

  const sellerLevelOptions = [
    { value: "all", label: "Any seller level" },
    { value: "new", label: "New Seller" },
    { value: "level1", label: "Level 1 Seller" },
    { value: "level2", label: "Level 2 Seller" },
    { value: "toprated", label: "Top Rated Seller" }
  ];

  const languageOptions = [
    "English", "Spanish", "French", "German", "Italian", "Portuguese",
    "Chinese", "Japanese", "Korean", "Arabic", "Russian", "Dutch"
  ];

  const budgetPresets = [
    { min: "", max: "25", label: "Under $25" },
    { min: "25", max: "50", label: "$25 - $50" },
    { min: "50", max: "100", label: "$50 - $100" },
    { min: "100", max: "250", label: "$100 - $250" },
    { min: "250", max: "500", label: "$250 - $500" },
    { min: "500", max: "", label: "Over $500" }
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "rating", label: "Best Rated" },
    { value: "reviews", label: "Most Reviewed" },
    { value: "price_low", label: "Lowest Price" },
    { value: "price_high", label: "Highest Price" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SubcategoryNavigation pageType="services" currentCategory={selectedCategory !== "all" ? selectedCategory : null} />
      
      {/* Fiverr-style Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(255,255,255,.1) 35px,
              rgba(255,255,255,.1) 70px
            )`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <HiSparkles className="h-10 w-10 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Find the perfect freelance service for your business
            </h1>
            <p className="text-xl text-green-50 mb-8 max-w-3xl mx-auto">
              Access a global pool of talented freelancers and get your projects done by the best
            </p>
            
            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="text-green-100 text-sm">Popular:</span>
              {['Logo Design', 'WordPress', 'Video Editing', 'AI Services', 'Social Media'].map((term, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(term)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
            
            {/* Search moved to left sidebar */}
            
            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-8 mt-10">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <FaCheckCircle className="h-5 w-5 text-green-300" />
                </div>
                <span className="text-sm font-medium">Verified Sellers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <FaShieldAlt className="h-5 w-5 text-green-300" />
                </div>
                <span className="text-sm font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <FaHeadset className="h-5 w-5 text-green-300" />
                </div>
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Services Section */}
      <div className="bg-white py-16 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trending Services This Week
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the most popular services that businesses are looking for right now
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.filter(s => s.featured).slice(0, 4).map((service) => (
              <div key={service.id} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-green-500 transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/img/NoImage.png";
                      }}
                    />
                  </div>
                  <div className="absolute top-2 left-2">
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <FaFire className="h-3 w-3" />
                      Trending
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {service.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <FaStar className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-bold">{service.rating}</span>
                      <span className="text-xs text-gray-500">({service.reviews})</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      From ${service.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category-specific Header */}
        {selectedCategory === "funding" && (
          <div className="mb-12 text-center">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <FaChartLine className="h-12 w-12 mr-3" />
                <h2 className="text-3xl font-bold">Business Funding & Investment Opportunities</h2>
              </div>
              <p className="text-emerald-100 text-lg max-w-3xl mx-auto">
                Connect with investors and partners to fuel your business growth. Find investment opportunities, 
                venture capital, and strategic partnerships for startups and established businesses.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="font-semibold">Seek Investment</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="font-semibold">Find Partners</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="font-semibold">Grow Business</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedCategory === "charities-donations" && (
          <div className="mb-12 text-center">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <FaHandHoldingHeart className="h-12 w-12 mr-3" />
                <h2 className="text-3xl font-bold">Charities & Humanitarian Aid</h2>
              </div>
              <p className="text-pink-100 text-lg max-w-3xl mx-auto">
                Support humanitarian causes and make a difference in people's lives. Donate to verified charities, 
                support disaster relief efforts, and contribute to meaningful humanitarian campaigns.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="font-semibold">Save Lives</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="font-semibold">Support Causes</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="font-semibold">Make Impact</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!selectedCategory || !["funding", "charities-donations"].includes(selectedCategory) ? (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our wide range of professional services. Each category is curated to help you find exactly what you need.
            </p>
          </div>
        ) : null}
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your projects done in 4 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaSearch className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">1. Search</h3>
              <p className="text-gray-600 text-sm">Browse thousands of services or search for exactly what you need</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaUser className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">2. Choose</h3>
              <p className="text-gray-600 text-sm">Review seller profiles, ratings, and portfolios to find the perfect match</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaDollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">3. Pay</h3>
              <p className="text-gray-600 text-sm">Secure payment with escrow protection - funds released only when you're satisfied</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaCheckCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">4. Review</h3>
              <p className="text-gray-600 text-sm">Receive your work and rate your experience to help the community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Results Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                  <FaFilter className="h-5 w-5 text-blue-500" />
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaSearch className="h-4 w-4 text-blue-500" />
                  Search Services
                </h4>
                <div className="relative">
                  <div className="flex items-center">
                    <FaSearch className="h-5 w-5 text-gray-400 absolute left-3 z-10" />
                    <input
                      type="text"
                      placeholder="What service are you looking for?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  
                  {/* Search Suggestions */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden">
                      <div className="p-2">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(suggestion);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                          >
                            <FaSearch className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaPalette className="h-4 w-4 text-purple-500" />
                  Categories
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedSubcategory("all");
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                      selectedCategory === "all"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">🌟</span>
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedSubcategory("all");
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                        selectedCategory === category.id
                          ? category.id === "funding" 
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : category.id === "charities-donations"
                            ? "border-pink-500 bg-pink-50 text-pink-700"
                            : "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${category.color}`}>
                        {category.icon}
                      </div>
                      <span className="text-sm">{category.name}</span>
                      {selectedCategory === category.id && (
                        <FaCheckCircle className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaLightbulb className="h-4 w-4 text-yellow-500" />
                  Quick Filters
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setOnlineOnly(!onlineOnly);
                      setProOnly(false);
                    }}
                    className={`px-3 py-2 text-sm font-semibold rounded-xl border-2 transition-all ${
                      onlineOnly
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Online Now
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setProOnly(!proOnly);
                      setOnlineOnly(false);
                    }}
                    className={`px-3 py-2 text-sm font-semibold rounded-xl border-2 transition-all ${
                      proOnly
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <MdVerified className="h-4 w-4" />
                      Pro Sellers
                    </div>
                  </button>
                </div>
              </div>

              {/* Budget Presets */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaDollarSign className="h-4 w-4 text-green-500" />
                  Budget
                </h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {budgetPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setPriceRange({ min: preset.min, max: preset.max })}
                      className={`px-3 py-2 text-sm font-semibold rounded-xl border-2 transition-all ${
                        priceRange.min === preset.min && priceRange.max === preset.max
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      placeholder="Min price"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaClock className="h-4 w-4 text-blue-500" />
                  Delivery Time
                </h4>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
                >
                  {deliveryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seller Level */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaTrophy className="h-4 w-4 text-yellow-500" />
                  Seller Level
                </h4>
                <select
                  value={sellerLevel}
                  onChange={(e) => setSellerLevel(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold"
                >
                  {sellerLevelOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seller Status */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FaUser className="h-4 w-4" />
                  Seller Status
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlineOnly}
                      onChange={(e) => setOnlineOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Online now</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={proOnly}
                      onChange={(e) => setProOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Pro sellers only</span>
                  </label>
                </div>
              </div>

              {/* Languages */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaGlobe className="h-4 w-4 text-indigo-500" />
                  Languages
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {languageOptions.map((language) => (
                    <label key={language} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(language)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLanguages([...selectedLanguages, language]);
                          } else {
                            setSelectedLanguages(selectedLanguages.filter(lang => lang !== language));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-sm font-medium text-gray-700">{language}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedSubcategory("all");
                    setPriceRange({ min: "", max: "" });
                    setDeliveryTime("all");
                    setSellerLevel("all");
                    setOnlineOnly(false);
                    setProOnly(false);
                    setSelectedLanguages([]);
                    setSortBy("relevance");
                  }}
                  className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-bold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all border-2 border-gray-300"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedCategory === "all" ? "All Services" : categories.find(c => c.id === selectedCategory)?.name}
                  {selectedSubcategory !== "all" && (
                    <span className="text-lg text-gray-600 ml-2">
                      - {categories.find(c => c.id === selectedCategory)?.subcategories.find(s => s.id === selectedSubcategory)?.name}
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredServices.length} services found
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FaChevronRight className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 rotate-90 pointer-events-none" />
                </div>
                
                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-l-lg ${viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <BsGrid3X3Gap className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-r-lg ${viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <BsListUl className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subcategories */}
            {selectedCategory !== "all" && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedSubcategory("all")}
                    className={`px-6 py-3 rounded-full border-2 font-semibold transition-all transform hover:scale-105 ${
                      selectedSubcategory === "all"
                        ? "border-blue-500 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md"
                    }`}
                  >
                    All Subcategories
                  </button>
                  {categories.find(c => c.id === selectedCategory)?.subcategories.map((subcat) => (
                    <button
                      key={subcat.id}
                      onClick={() => setSelectedSubcategory(subcat.id)}
                      className={`px-6 py-3 rounded-full border-2 font-semibold transition-all transform hover:scale-105 flex items-center gap-2 ${
                        selectedSubcategory === subcat.id
                          ? "border-blue-500 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md"
                      }`}
                    >
                      <span className="text-lg">{subcat.icon}</span>
                      {subcat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-lg text-gray-600">Loading amazing services...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3">
                  <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-800">Notice</h3>
                    <p className="text-yellow-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Services Grid/List */}
            {!loading && (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredServices.map((service) => (
                  <div key={service.id} className="group bg-white rounded-2xl border border-gray-200 hover:shadow-2xl hover:border-gray-300 transition-all duration-500 overflow-hidden transform hover:scale-105">
                    {/* Service Image */}
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.target.src = "/img/NoImage.png";
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {service.featured && (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <MdLocalOffer className="h-3 w-3" />
                            Featured
                          </div>
                        )}
                        {service.pro && (
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <MdVerified className="h-3 w-3" />
                            Pro
                          </div>
                        )}
                        {service.online && (
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            Online
                          </div>
                        )}
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all hover:scale-110">
                          <FaHeart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                        </button>
                        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all hover:scale-110">
                          <FaEye className="h-4 w-4 text-gray-600 hover:text-blue-500" />
                        </button>
                      </div>
                    </div>

                    {/* Service Content */}
                    <div className="p-5">
                      {/* Category and Level */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                            {categories.find(c => c.id === service.category)?.name}
                          </span>
                          <span className="text-xs font-semibold text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 px-2 py-1 rounded-lg border border-blue-200">
                            {service.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaStar className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-bold text-gray-900">{service.rating}</span>
                        </div>
                      </div>
                       
                      <Link to={`/service/${service.id}`} className="block group">
                        <h3 className="font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 text-lg group-hover:underline">
                          {service.title}
                        </h3>
                      </Link>
                       
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Seller Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={service.sellerImage}
                              alt={service.seller}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                              onError={(e) => {
                                e.target.src = "/img/NoImage.png";
                              }}
                            />
                            {service.online && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-bold text-gray-900">{service.seller}</div>
                              {service.level === "Top Rated Seller" && (
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                  <FaTrophy className="h-3 w-3" />
                                  Top Rated
                                </div>
                              )}
                              {service.pro && (
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                                  <MdVerified className="h-3 w-3" />
                                  Pro
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <FaStar className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm font-bold text-gray-900">{service.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500">({service.reviews} reviews)</span>
                              {service.reviews > 100 && (
                                <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                                  100+
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Trust Indicators */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <FaCheckCircle className="h-3 w-3 text-green-500" />
                          <span>Verified</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <FaShieldAlt className="h-3 w-3 text-blue-500" />
                          <span>Insured</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <FaHeadset className="h-3 w-3 text-purple-500" />
                          <span>Fast Response</span>
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {service.languages.slice(0, 2).map((lang, index) => (
                          <span key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                            {lang}
                          </span>
                        ))}
                        {service.languages.length > 2 && (
                          <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                            +{service.languages.length - 2}
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FaClock className="h-4 w-4" />
                          <span className="font-medium">{service.deliveryTime}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 font-medium">From</div>
                          <div className="text-xl font-bold text-gray-900">${service.price}</div>
                        </div>
                      </div>
                      
                      {/* Quick Contact Buttons */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        {service.category === "funding" ? (
                          <>
                            <button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg">
                              Invest Now
                            </button>
                            <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all">
                              View Details
                            </button>
                          </>
                        ) : service.category === "charities-donations" ? (
                          <>
                            <button className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:from-pink-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg">
                              Donate Now
                            </button>
                            <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all">
                              View Details
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                              Contact
                            </button>
                            <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all">
                              View Details
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div key={service.id} className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex gap-6">
                      <div className="relative flex-shrink-0">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-40 h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex gap-2">
                          {service.featured && (
                            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                              <MdLocalOffer className="h-3 w-3" />
                              Featured
                            </div>
                          )}
                          {service.pro && (
                            <div className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                              <MdVerified className="h-3 w-3" />
                              Pro
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                {categories.find(c => c.id === service.category)?.name}
                              </span>
                              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {service.level}
                              </span>
                              {service.online && (
                                <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                  Online
                                </div>
                              )}
                            </div>
                            <Link to={`/service/${service.id}`}>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                {service.title}
                              </h3>
                            </Link>
                            <p className="text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                            
                            {/* Languages */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {service.languages.map((lang, index) => (
                                <span key={index} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all ml-4">
                            <FaHeart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={service.sellerImage}
                                  alt={service.seller}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                />
                                {service.online && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{service.seller}</div>
                                <div className="flex items-center gap-1">
                                  <FaStar className="h-4 w-4 text-yellow-400" />
                                  <span className="text-sm font-medium">{service.rating}</span>
                                  <span className="text-sm text-gray-500">({service.reviews})</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <FaClock className="h-4 w-4" />
                              {service.deliveryTime}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Starting at</div>
                            <div className="text-2xl font-bold text-gray-900">${service.price}</div>
                            {/* Category-specific action button */}
                            <div className="mt-2">
                              {service.category === "funding" ? (
                                <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md">
                                  Invest Now
                                </button>
                              ) : service.category === "charities-donations" ? (
                                <button className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-pink-600 hover:to-rose-700 transition-all shadow-md">
                                  Donate Now
                                </button>
                              ) : (
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all">
                                  Contact
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredServices.length === 0 && (
              <div className="text-center py-20">
                <div className="text-gray-400 mb-6">
                  <FaSearch className="h-20 w-20 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No services found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedSubcategory("all");
                    setPriceRange({ min: "", max: "" });
                    setDeliveryTime("all");
                    setSellerLevel("all");
                    setOnlineOnly(false);
                    setProOnly(false);
                    setSelectedLanguages([]);
                    setSortBy("relevance");
                    setSearchQuery("");
                  }}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServicesPage;

