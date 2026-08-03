import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { 
  FaHeart, 
  FaHandsHelping, 
  FaSearch, 
  FaFilter,
  FaDonate,
  FaUsers,
  FaHome,
  FaSchool,
  FaHospital,
  FaLeaf,
  FaPaw,
  FaGlobe,
  FaChild,
  FaUtensils,
  FaWater,
  FaBookOpen,
  FaChevronRight,
  FaCheckCircle
} from "react-icons/fa";
import UnifiedNavbar from "../Component/UnifiedNavbar";
import Footer from "../Component/Footer";
import CategorySection from "../Component/CategorySection";
import useAuthRedirect from "../hooks/useAuthRedirect";
import DonationPostFormModal from "../Component/donation/DonationPostFormModal";

const DonationsPage = () => {
  const { requireAuth } = useAuthRedirect();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showPostForm, setShowPostForm] = useState(false);

  // Check for postForm URL parameter
  useEffect(() => {
    if (searchParams.get('postForm') === 'true') {
      if (requireAuth(null, 'You must be logged in to create a donation campaign.')) {
        setShowPostForm(true);
      }
    }
  }, [searchParams, requireAuth]);

  // Handle successful donation creation
  const handleDonationSuccess = () => {
    setShowPostForm(false);
    // Optionally reload the page or show a success message
    window.location.reload();
  };

  // Handle post donation with authentication
  const handlePostDonation = () => {
    requireAuth('/donations?postForm=true', 'You must be logged in to create a donation campaign.');
  };

  // Donation categories
  const categories = [
    {
      id: "disaster-relief",
      name: "Disaster Relief",
      icon: <FaHome className="h-6 w-6" />,
      description: "Emergency response, natural disasters, crisis support",
      slug: "disaster-relief"
    },
    {
      id: "education",
      name: "Education",
      icon: <FaSchool className="h-6 w-6" />,
      description: "Schools, scholarships, educational programs",
      slug: "education"
    },
    {
      id: "healthcare",
      name: "Healthcare",
      icon: <FaHospital className="h-6 w-6" />,
      description: "Medical expenses, hospitals, health initiatives",
      slug: "healthcare"
    },
    {
      id: "environment",
      name: "Environment",
      icon: <FaLeaf className="h-6 w-6" />,
      description: "Conservation, climate change, wildlife protection",
      slug: "environment"
    },
    {
      id: "animal-welfare",
      name: "Animal Welfare",
      icon: <FaPaw className="h-6 w-6" />,
      description: "Animal shelters, rescue organizations, pet care",
      slug: "animal-welfare"
    },
    {
      id: "humanitarian",
      name: "Humanitarian Aid",
      icon: <FaHandsHelping className="h-6 w-6" />,
      description: "Refugee support, poverty alleviation, basic needs",
      slug: "humanitarian"
    },
    {
      id: "children",
      name: "Children & Youth",
      icon: <FaChild className="h-6 w-6" />,
      description: "Orphanages, child welfare, youth programs",
      slug: "children"
    },
    {
      id: "food-security",
      name: "Food Security",
      icon: <FaUtensils className="h-6 w-6" />,
      description: "Food banks, hunger relief, nutrition programs",
      slug: "food-security"
    },
    {
      id: "water-sanitation",
      name: "Water & Sanitation",
      icon: <FaWater className="h-6 w-6" />,
      description: "Clean water projects, sanitation facilities",
      slug: "water-sanitation"
    },
    {
      id: "community-development",
      name: "Community Development",
      icon: <FaUsers className="h-6 w-6" />,
      description: "Community projects, local development initiatives",
      slug: "community-development"
    },
    {
      id: "international-aid",
      name: "International Aid",
      icon: <FaGlobe className="h-6 w-6" />,
      description: "International development, global humanitarian efforts",
      slug: "international-aid"
    },
    {
      id: "religious",
      name: "Religious Organizations",
      icon: <FaBookOpen className="h-6 w-6" />,
      description: "Faith-based charities, religious community support",
      slug: "religious"
    }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "urgent", label: "Most Urgent" },
    { value: "goal_low", label: "Goal: Low to High" },
    { value: "goal_high", label: "Goal: High to Low" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <UnifiedNavbar />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="page-container py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Charities & Donations
            </h1>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto">
              Support humanitarian causes and make a difference in people's lives
            </p>
          </div>
        </div>
      </div>

      {/* Search and filters moved to left sidebar */}

      {/* Main Content with Sidebar */}
      <div className="page-container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                  <FaFilter className="h-5 w-5 text-pink-500" />
                  Filters
                </h3>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaSearch className="h-4 w-4 text-pink-500" />
                  Search Causes
                </h4>
                <div className="relative">
                  <FaSearch className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                  <input
                    type="text"
                    placeholder="Search for charitable causes and organizations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaHeart className="h-4 w-4 text-pink-500" />
                  Categories
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                      selectedCategory === "all"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">❤️</span>
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                        selectedCategory === category.id
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                        {React.isValidElement(category.icon) ? category.icon : null}
                      </div>
                      <span className="text-sm">{category.name}</span>
                      {selectedCategory === category.id && (
                        <FaCheckCircle className="h-4 w-4 ml-auto text-pink-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaChevronRight className="h-4 w-4 text-pink-500" />
                  Sort By
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all font-semibold"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear all */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSortBy("newest");
                }}
                className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-bold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all border-2 border-gray-300"
              >
                Clear all
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedCategory === "all" ? "All Causes" : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  Browse {selectedCategory === "all" ? "all charitable causes" : categories.find(c => c.id === selectedCategory)?.name?.toLowerCase()}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
            </div>

            {/* Categories Grid */}
            {selectedCategory === "all" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {categories.map((category) => (
                  <Link key={category.id} to={`/category/${category.slug}`}>
                    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                          {React.isValidElement(category.icon) ? category.icon : null}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-pink-600 font-medium">
                        Browse {category.name}
                        <FaChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Category Section for selected category */}
            {selectedCategory !== "all" && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {categories.find(cat => cat.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-gray-600">
                    {categories.find(cat => cat.id === selectedCategory)?.description}
                  </p>
                </div>
                <CategorySection 
                  categorySlug={selectedCategory}
                  categoryName={categories.find(cat => cat.id === selectedCategory)?.name}
                  categoryIcon={categories.find(cat => cat.id === selectedCategory)?.icon}
                />
              </div>
            )}

            {/* Recent Campaigns */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Campaigns</h2>
              <CategorySection 
                categorySlug="donations"
                categoryName="Latest Donation Campaigns"
                categoryIcon={<FaHeart className="h-8 w-8" />}
              />
            </div>

            {/* Call to Action */}
            <div className="mt-16 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-8 text-center">
              <FaHeart className="h-16 w-16 text-pink-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Make a Difference Today</h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Every contribution counts. Start a donation campaign or support existing causes to help those in need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/donations/featured"
                  className="inline-flex items-center px-6 py-3 bg-white text-pink-600 font-medium rounded-lg border border-pink-200 hover:bg-pink-50 transition-colors"
                >
                  <FaHeart className="mr-2 h-5 w-5" />
                  Featured Causes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Donation Post Form Modal */}
      {showPostForm && (
        <DonationPostFormModal
          onClose={() => setShowPostForm(false)}
          onSuccess={handleDonationSuccess}
        />
      )}
    </div>
  );
};

export default DonationsPage;
