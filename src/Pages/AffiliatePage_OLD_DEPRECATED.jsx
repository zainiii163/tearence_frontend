import React, { useState, useEffect } from "react";
import { 
  FaLink, 
  FaUsers, 
  FaDollarSign, 
  FaChartLine, 
  FaCopy,
  FaEye,
  FaShoppingCart,
  FaTrophy,
  FaGift,
  FaRocket,
  FaHandshake,
  FaStar,
  FaClock,
  FaSearch,
  FaPlus,
  FaGraduationCap,
  FaHeart,
  FaPlane
} from "react-icons/fa";
import { BsGrid3X3Gap, BsListUl } from "react-icons/bs";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAffiliateList, createAffiliate } from "../slice/AffiliateSLice";
import AffiliateServices from "../services/AffiliateServices";
import toast from "react-hot-toast";

const AffiliatePage = () => {
  const dispatch = useDispatch();
  const { affiliateList } = useSelector((state) => state.aff);
  
  const [activeTab, setActiveTab] = useState("browse");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  // Load affiliate data on component mount
  useEffect(() => {
    dispatch(getAffiliateList({ position: "all", skip: 0, limit: 100 }));
  }, [dispatch]);

  // Form state for posting affiliate links
  const [postFormData, setPostFormData] = useState({
    title: "",
    company: "",
    category: "",
    description: "",
    commission: "",
    cookieDuration: "",
    paymentMethod: "",
    minPayout: "",
    affiliateLink: "",
    imageUrl: ""
  });

  // Form state for joining affiliate program
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    website: "",
    trafficSource: "",
    marketingMethods: "",
    experience: ""
  });

  // Affiliate categories
  const categories = [
    {
      id: "ecommerce",
      name: "E-commerce",
      icon: <FaShoppingCart className="h-6 w-6" />,
      description: "Online stores, retail products, shopping deals",
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: "software",
      name: "Software & Apps",
      icon: <FaRocket className="h-6 w-6" />,
      description: "SaaS, mobile apps, digital tools",
      color: "bg-purple-100 text-purple-600"
    },
    {
      id: "education",
      name: "Education & Courses",
      icon: <FaGraduationCap className="h-6 w-6" />,
      description: "Online courses, educational platforms",
      color: "bg-green-100 text-green-600"
    },
    {
      id: "finance",
      name: "Finance & Banking",
      icon: <FaDollarSign className="h-6 w-6" />,
      description: "Banking, investment, financial services",
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: "health",
      name: "Health & Wellness",
      icon: <FaHeart className="h-6 w-6" />,
      description: "Health products, fitness, wellness services",
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: "travel",
      name: "Travel & Hospitality",
      icon: <FaPlane className="h-6 w-6" />,
      description: "Hotels, flights, travel services",
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  // Transform API data to match expected format
  const transformAffiliateData = (apiData) => {
    if (!apiData?.data?.items) return [];
    
    return apiData.data.items.map(item => ({
      id: item.id,
      title: item.title || "Untitled Program",
      category: item.category || "general",
      company: item.company || "Unknown Company",
      commission: item.commission || "Varies",
      description: item.description || "No description available",
      image: item.image_url || "/img/NoImage.png",
      rating: item.rating || 4.0,
      reviews: item.reviews || 0,
      clicks: item.clicks || 0,
      conversions: item.conversions || 0,
      featured: item.featured || false,
      cookieDuration: item.cookieDuration || "30 days",
      paymentMethod: item.paymentMethod || "PayPal",
      minPayout: item.minPayout || "$50",
      link: item.link || "#"
    }));
  };

  const [affiliateLinks, setAffiliateLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);

  // Update affiliate links when API data changes
  useEffect(() => {
    const transformedData = transformAffiliateData(affiliateList);
    setAffiliateLinks(transformedData);
    setFilteredLinks(transformedData);
  }, [affiliateList]);

  // Filter affiliate links
  useEffect(() => {
    let filtered = affiliateLinks;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(link => link.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(link => 
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort links
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular": return b.clicks - a.clicks;
        case "rating": return b.rating - a.rating;
        case "commission": return parseFloat(b.commission.match(/\d+/)?.[0] || 0) - parseFloat(a.commission.match(/\d+/)?.[0] || 0);
        case "conversions": return b.conversions - a.conversions;
        default: return 0;
      }
    });

    setFilteredLinks(filtered);
  }, [affiliateLinks, selectedCategory, searchQuery, sortBy]);

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
    { value: "commission", label: "Highest Commission" },
    { value: "conversions", label: "Most Conversions" }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  // Handle posting affiliate link
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(createAffiliate({
        formData: {
          title: postFormData.title,
          link: postFormData.affiliateLink,
          image_url: postFormData.imageUrl,
          company: postFormData.company,
          category: postFormData.category,
          description: postFormData.description,
          commission: postFormData.commission,
          cookieDuration: postFormData.cookieDuration,
          paymentMethod: postFormData.paymentMethod,
          minPayout: postFormData.minPayout
        }
      })).unwrap();
      
      toast.success("Affiliate program posted successfully!");
      setShowPostForm(false);
      setPostFormData({
        title: "",
        company: "",
        category: "",
        description: "",
        commission: "",
        cookieDuration: "",
        paymentMethod: "",
        minPayout: "",
        affiliateLink: "",
        imageUrl: ""
      });
      
      // Refresh the list
      dispatch(getAffiliateList({ position: "all", skip: 0, limit: 100 }));
    } catch (error) {
      toast.error("Failed to post affiliate program");
      console.error(error);
    }
  };

  // Handle affiliate program application
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await AffiliateServices.submitAffiliateApplication(applicationData);
      toast.success("Application submitted successfully! We'll review it within 24-48 hours.");
      setShowApplicationForm(false);
      setApplicationData({
        name: "",
        email: "",
        website: "",
        trafficSource: "",
        marketingMethods: "",
        experience: ""
      });
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      console.error(error);
    }
  };

  // Handle joining affiliate programs
  const handleJoinProgram = async (programId) => {
    try {
      await AffiliateServices.joinAffiliateProgram(programId);
      toast.success("Successfully joined the affiliate program!");
      
      // Refresh the list to update the UI
      dispatch(getAffiliateList({ position: "all", skip: 0, limit: 100 }));
    } catch (error) {
      toast.error("Failed to join program. Please try again.");
      console.error(error);
    }
  };

  // Handle input changes for post form
  const handlePostInputChange = (e) => {
    const { name, value } = e.target;
    setPostFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input changes for application form
  const handleApplicationInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Affiliate Programs Marketplace
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Promote products you love and earn commissions. Join top affiliate programs or post your own affiliate links.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search affiliate programs, companies, or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("browse")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "browse"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaLink className="inline mr-2" />
              Browse Programs
            </button>
            <button
              onClick={() => setActiveTab("our-program")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "our-program"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaHandshake className="inline mr-2" />
              Join Our Program
            </button>
            <button
              onClick={() => setActiveTab("post-link")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "post-link"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaPlus className="inline mr-2" />
              Post Your Link
            </button>
          </div>
        </div>
      </div>

      {/* Browse Programs Tab */}
      {activeTab === "browse" && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                    selectedCategory === category.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${category.color} mb-3 mx-auto`}>
                    {category.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
                </button>
              ))}
            </div>
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedCategory === "all" ? "All Programs" : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-600">{filteredLinks.length} programs available</p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-600"}`}
                >
                  <BsGrid3X3Gap className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-600"}`}
                >
                  <BsListUl className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Programs Grid */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((link) => (
                <div key={link.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={link.image}
                      alt={link.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {link.featured && (
                      <div className="absolute top-2 left-2 bg-blue-400 text-blue-900 px-2 py-1 rounded text-xs font-semibold">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      {link.commission}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {categories.find(c => c.id === link.category)?.name}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{link.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{link.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Cookie:</span>
                        <span className="font-medium ml-1">{link.cookieDuration}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Payout:</span>
                        <span className="font-medium ml-1">{link.minPayout}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <FaStar className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium">{link.rating}</span>
                        <span className="text-sm text-gray-500">({link.reviews})</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <FaEye className="inline mr-1" />
                        {link.clicks.toLocaleString()} clicks
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleJoinProgram(link.id)}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition-colors"
                      >
                        Join Program
                      </button>
                      <button 
                        onClick={() => copyToClipboard(link.link)}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <FaCopy className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLinks.map((link) => (
                <div key={link.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-6">
                    <img
                      src={link.image}
                      alt={link.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {categories.find(c => c.id === link.category)?.name}
                            </span>
                            {link.featured && (
                              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                              {link.commission}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.title}</h3>
                          <p className="text-gray-600 mb-3">{link.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <FaStar className="h-4 w-4 text-blue-400" />
                            <span className="font-medium">{link.rating}</span>
                            <span className="text-gray-500">({link.reviews})</span>
                          </div>
                          
                          <div className="text-gray-500">
                            <FaEye className="inline mr-1" />
                            {link.clicks.toLocaleString()} clicks
                          </div>
                          
                          <div className="text-gray-500">
                            <FaShoppingCart className="inline mr-1" />
                            {link.conversions.toLocaleString()} conversions
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Cookie:</span>
                            <span className="font-medium ml-1">{link.cookieDuration}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleJoinProgram(link.id)}
                            className="bg-blue-500 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-600 transition-colors"
                          >
                            Join Program
                          </button>
                          <button 
                            onClick={() => copyToClipboard(link.link)}
                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <FaCopy className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Join Our Program Tab */}
      {activeTab === "our-program" && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <FaHandshake className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Affiliate Program</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Earn generous commissions by referring paying customers to our platform
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <FaDollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Competitive Commissions</h3>
                      <p className="text-gray-600">Earn up to 30% commission on all referred customer payments</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <FaClock className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">30-Day Cookie Duration</h3>
                      <p className="text-gray-600">Get credit for referrals who convert within 30 days</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <FaChartLine className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Analytics</h3>
                      <p className="text-gray-600">Track clicks, conversions, and earnings in real-time</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <FaGift className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Bonuses</h3>
                      <p className="text-gray-600">Earn extra bonuses for high-performing affiliates</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <FaUsers className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Dedicated Support</h3>
                      <p className="text-gray-600">Get personalized support from our affiliate team</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <FaTrophy className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Tier System</h3>
                      <p className="text-gray-600">Progress through tiers for higher commission rates</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Commission Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">15%</div>
                    <div className="text-sm text-gray-600">Standard Tier</div>
                    <div className="text-xs text-gray-500">0-50 referrals</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">25%</div>
                    <div className="text-sm text-gray-600">Premium Tier</div>
                    <div className="text-xs text-gray-500">51-200 referrals</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">30%</div>
                    <div className="text-sm text-gray-600">Elite Tier</div>
                    <div className="text-xs text-gray-500">200+ referrals</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => setShowApplicationForm(true)}
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Apply to Join Our Program
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Your Link Tab */}
      {activeTab === "post-link" && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <FaPlus className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Post Your Affiliate Link</h2>
                <p className="text-lg text-gray-600">
                  Share your affiliate program with our community of marketers and promoters
                </p>
              </div>

              <form onSubmit={handlePostSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program Name *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={postFormData.title}
                      onChange={handlePostInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Amazon Associates"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={postFormData.company}
                      onChange={handlePostInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Amazon"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select 
                    name="category"
                    value={postFormData.category}
                    onChange={handlePostInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={postFormData.description}
                    onChange={handlePostInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe your affiliate program and what makes it attractive..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate *
                    </label>
                    <input
                      type="text"
                      name="commission"
                      value={postFormData.commission}
                      onChange={handlePostInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Up to 10% or $5 per sale"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cookie Duration *
                    </label>
                    <input
                      type="text"
                      name="cookieDuration"
                      value={postFormData.cookieDuration}
                      onChange={handlePostInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 30 days"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select 
                      name="paymentMethod"
                      value={postFormData.paymentMethod}
                      onChange={handlePostInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select payment method</option>
                      <option value="paypal">PayPal</option>
                      <option value="wire">Wire Transfer</option>
                      <option value="check">Check</option>
                      <option value="direct-deposit">Direct Deposit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Payout
                    </label>
                    <input
                      type="text"
                      name="minPayout"
                      value={postFormData.minPayout}
                      onChange={handlePostInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., $50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Affiliate Link *
                  </label>
                  <input
                    type="url"
                    name="affiliateLink"
                    value={postFormData.affiliateLink}
                    onChange={handlePostInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://example.com/affiliate/signup"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={postFormData.imageUrl}
                    onChange={handlePostInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    I agree to the terms and conditions for posting affiliate programs
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Post Affiliate Program
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("browse")}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="text-center mb-8">
              <FaHandshake className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Affiliate Program</h2>
              <p className="text-lg text-gray-600">
                Become our affiliate partner and start earning commissions today!
              </p>
            </div>

            <form onSubmit={handleApplicationSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={applicationData.name}
                    onChange={handleApplicationInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={applicationData.email}
                    onChange={handleApplicationInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website or Social Media Profile
                </label>
                <input
                  type="url"
                  name="website"
                  value={applicationData.website}
                  onChange={handleApplicationInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Traffic Source *
                </label>
                <select
                  name="trafficSource"
                  value={applicationData.trafficSource}
                  onChange={handleApplicationInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select traffic source</option>
                  <option value="website">Website/Blog</option>
                  <option value="social">Social Media</option>
                  <option value="email">Email Marketing</option>
                  <option value="ppc">Paid Advertising</option>
                  <option value="seo">SEO/Organic Search</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marketing Methods *
                </label>
                <textarea
                  name="marketingMethods"
                  value={applicationData.marketingMethods}
                  onChange={handleApplicationInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Describe how you plan to promote our products..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Affiliate Experience
                </label>
                <textarea
                  name="experience"
                  value={applicationData.experience}
                  onChange={handleApplicationInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Tell us about your experience with affiliate marketing..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AffiliatePage;
