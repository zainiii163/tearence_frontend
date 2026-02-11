import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaSearch, 
  FaTag, 
  FaCar, 
  FaMobileAlt, 
  FaLaptop, 
  FaHome, 
  FaTshirt,
  FaBook,
  FaGamepad,
  FaDumbbell,
  FaBaby,
  FaTools,
  FaMusic,
  FaCamera,
  FaDog,
  FaChevronRight,
  FaFilter,
  FaDollarSign,
  FaCheckCircle
} from "react-icons/fa";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import SubcategoryNavigation from "../Component/SubcategoryNavigation";
import CategorySection from "../Component/CategorySection";

const BuySellPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [condition, setCondition] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Buy and Sell categories
  const categories = [
    {
      id: "vehicles",
      name: "Vehicles",
      icon: <FaCar className="h-6 w-6" />,
      description: "Cars, motorcycles, boats, and more",
      slug: "vehicles"
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: <FaMobileAlt className="h-6 w-6" />,
      description: "Phones, computers, gadgets",
      slug: "electronics"
    },
    {
      id: "computers",
      name: "Computers",
      icon: <FaLaptop className="h-6 w-6" />,
      description: "Laptops, desktops, accessories",
      slug: "computers"
    },
    {
      id: "property",
      name: "Property",
      icon: <FaHome className="h-6 w-6" />,
      description: "Homes, apartments, land for sale",
      slug: "property"
    },
    {
      id: "fashion",
      name: "Fashion & Accessories",
      icon: <FaTshirt className="h-6 w-6" />,
      description: "Clothing, shoes, jewelry",
      slug: "fashion"
    },
    {
      id: "books",
      name: "Books & Media",
      icon: <FaBook className="h-6 w-6" />,
      description: "Books, movies, music",
      slug: "books"
    },
    {
      id: "gaming",
      name: "Gaming",
      icon: <FaGamepad className="h-6 w-6" />,
      description: "Video games, consoles, accessories",
      slug: "gaming"
    },
    {
      id: "sports",
      name: "Sports & Fitness",
      icon: <FaDumbbell className="h-6 w-6" />,
      description: "Equipment, gear, fitness items",
      slug: "sports"
    },
    {
      id: "baby",
      name: "Baby & Kids",
      icon: <FaBaby className="h-6 w-6" />,
      description: "Baby items, toys, kids products",
      slug: "baby"
    },
    {
      id: "home-garden",
      name: "Home & Garden",
      icon: <FaHome className="h-6 w-6" />,
      description: "Furniture, appliances, garden tools",
      slug: "home-garden"
    },
    {
      id: "tools",
      name: "Tools & Hardware",
      icon: <FaTools className="h-6 w-6" />,
      description: "Power tools, hardware, equipment",
      slug: "tools"
    },
    {
      id: "music",
      name: "Musical Instruments",
      icon: <FaMusic className="h-6 w-6" />,
      description: "Guitars, pianos, audio equipment",
      slug: "music"
    },
    {
      id: "cameras",
      name: "Cameras & Photo",
      icon: <FaCamera className="h-6 w-6" />,
      description: "Cameras, lenses, photography gear",
      slug: "cameras"
    },
    {
      id: "pets",
      name: "Pets & Supplies",
      icon: <FaDog className="h-6 w-6" />,
      description: "Pet supplies, accessories, services",
      slug: "pets"
    },
    {
      id: "other",
      name: "Other Items",
      icon: <FaTag className="h-6 w-6" />,
      description: "Everything else",
      slug: "other"
    }
  ];

  const conditions = [
    { value: "all", label: "All Conditions" },
    { value: "new", label: "New" },
    { value: "like-new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "salvage", label: "For Parts/Salvage" }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "closest", label: "Nearest First" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SubcategoryNavigation pageType="buy-sell" currentCategory={selectedCategory !== "all" ? selectedCategory : null} />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Buy and Sell
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Post anything you want to sell or find great deals from local sellers
            </p>
          </div>
        </div>
      </div>

      {/* Search and filters moved to left sidebar */}

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                  <FaFilter className="h-5 w-5 text-green-500" />
                  Filters
                </h3>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaSearch className="h-4 w-4 text-green-500" />
                  Search Items
                </h4>
                <div className="relative">
                  <FaSearch className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                  <input
                    type="text"
                    placeholder="Search for items to buy or sell..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaTag className="h-4 w-4 text-green-500" />
                  Categories
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                      selectedCategory === "all"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">🌟</span>
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                        selectedCategory === category.id
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-green-100 text-green-600">
                        {category.icon}
                      </div>
                      <span className="text-sm">{category.name}</span>
                      {selectedCategory === category.id && (
                        <FaCheckCircle className="h-4 w-4 ml-auto text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaDollarSign className="h-4 w-4 text-green-500" />
                  Price Range
                </h4>
                <div className="space-y-3">
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      placeholder="Min price"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaCheckCircle className="h-4 w-4 text-green-500" />
                  Condition
                </h4>
                <div className="space-y-2">
                  {conditions.map((cond) => (
                    <button
                      key={cond.value}
                      onClick={() => setCondition(cond.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                        cond.value === condition
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      {cond.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaChevronRight className="h-4 w-4 text-green-500" />
                  Sort By
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-semibold"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceRange({ min: "", max: "" });
                  setCondition("all");
                  setSortBy("newest");
                }}
                className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-bold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all border-2 border-gray-300"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedCategory === "all" ? "All Items" : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  Browse {selectedCategory === "all" ? "all categories" : categories.find(c => c.id === selectedCategory)?.name?.toLowerCase()}
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
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-green-600 font-medium">
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

            {/* Recent Listings */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Listings</h2>
              <CategorySection 
                categorySlug="buy-sell"
                categoryName="Latest Buy and Sell Posts"
                categoryIcon={<FaTag className="h-8 w-8" />}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuySellPage;
