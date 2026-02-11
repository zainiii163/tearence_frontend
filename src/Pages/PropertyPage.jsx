import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaHome, 
  FaBuilding, 
  FaIndustry, 
  FaTractor, 
  FaTree, 
  FaSearch,
  FaMapMarkerAlt,
  FaChevronRight,
  FaFilter,
  FaDollarSign,
  FaCheckCircle,
  FaBed,
  FaBath
} from "react-icons/fa";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import SubcategoryNavigation from "../Component/SubcategoryNavigation";
import CategorySection from "../Component/CategorySection";

const PropertyPage = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [bedrooms, setBedrooms] = useState("any");
  const [bathrooms, setBathrooms] = useState("any");
  const [propertyType, setPropertyType] = useState("all");

  // Property subcategories
  const subcategories = [
    {
      id: "houses",
      name: "Houses",
      icon: <FaHome className="h-6 w-6" />,
      description: "Single family homes, townhouses, villas",
      slug: "houses"
    },
    {
      id: "commercial",
      name: "Commercial",
      icon: <FaBuilding className="h-6 w-6" />,
      description: "Office spaces, retail, commercial properties",
      slug: "commercial"
    },
    {
      id: "industrial",
      name: "Industrial",
      icon: <FaIndustry className="h-6 w-6" />,
      description: "Warehouses, factories, industrial spaces",
      slug: "industrial"
    },
    {
      id: "farm",
      name: "Farm & Agricultural",
      icon: <FaTractor className="h-6 w-6" />,
      description: "Farms, agricultural land, rural properties",
      slug: "farm"
    },
    {
      id: "plots",
      name: "Plots & Land",
      icon: <FaTree className="h-6 w-6" />,
      description: "Residential plots, land for development",
      slug: "plots"
    }
  ];

  const bedroomOptions = [
    { value: "any", label: "Any" },
    { value: "1", label: "1+" },
    { value: "2", label: "2+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" },
    { value: "5", label: "5+" }
  ];

  const bathroomOptions = [
    { value: "any", label: "Any" },
    { value: "1", label: "1+" },
    { value: "2", label: "2+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SubcategoryNavigation pageType="property" currentCategory={selectedSubcategory !== "all" ? selectedSubcategory : null} />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Property & Real Estate
            </h1>
            <p className="text-xl text-violet-100 max-w-3xl mx-auto">
              Find your perfect property - houses, commercial spaces, industrial properties, farms, and land
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
                  <FaFilter className="h-5 w-5 text-violet-500" />
                  Filters
                </h3>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaSearch className="h-4 w-4 text-violet-500" />
                  Search Properties
                </h4>
                <div className="relative">
                  <FaSearch className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Property Types */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaHome className="h-4 w-4 text-violet-500" />
                  Property Types
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => setSelectedSubcategory("all")}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                      selectedSubcategory === "all"
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">🏠</span>
                    All Property Types
                  </button>
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => setSelectedSubcategory(subcategory.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                        selectedSubcategory === subcategory.id
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                        {subcategory.icon}
                      </div>
                      <span className="text-sm">{subcategory.name}</span>
                      {selectedSubcategory === subcategory.id && (
                        <FaCheckCircle className="h-4 w-4 ml-auto text-violet-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type (Sale/Rent) */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaChevronRight className="h-4 w-4 text-violet-500" />
                  Listing Type
                </h4>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all font-semibold"
                >
                  <option value="all">All Types</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="lease">For Lease</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaDollarSign className="h-4 w-4 text-violet-500" />
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
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaBed className="h-4 w-4 text-violet-500" />
                  Bedrooms
                </h4>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all font-semibold"
                >
                  {bedroomOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} Bedrooms
                    </option>
                  ))}
                </select>
              </div>

              {/* Bathrooms */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaBath className="h-4 w-4 text-violet-500" />
                  Bathrooms
                </h4>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all font-semibold"
                >
                  {bathroomOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} Bathrooms
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaMapMarkerAlt className="h-4 w-4 text-violet-500" />
                  Location
                </h4>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <input
                    type="text"
                    placeholder="Enter location..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubcategory("all");
                  setPriceRange({ min: "", max: "" });
                  setBedrooms("any");
                  setBathrooms("any");
                  setPropertyType("all");
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
                  {selectedSubcategory === "all" ? "All Properties" : subcategories.find(c => c.id === selectedSubcategory)?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  Browse {selectedSubcategory === "all" ? "all property types" : subcategories.find(c => c.id === selectedSubcategory)?.name?.toLowerCase()}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
            </div>

            {/* Subcategories Grid */}
            {selectedSubcategory === "all" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {subcategories.map((subcategory) => (
                  <Link key={subcategory.id} to={`/category/${subcategory.slug}`}>
                    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                          {subcategory.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{subcategory.name}</h3>
                          <p className="text-sm text-gray-600">{subcategory.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-violet-600 font-medium">
                        Browse {subcategory.name}
                        <FaChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Category Section for selected subcategory */}
            {selectedSubcategory !== "all" && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {subcategories.find(sub => sub.id === selectedSubcategory)?.name}
                  </h2>
                  <p className="text-gray-600">
                    {subcategories.find(sub => sub.id === selectedSubcategory)?.description}
                  </p>
                </div>
                <CategorySection 
                  categorySlug={selectedSubcategory}
                  categoryName={subcategories.find(sub => sub.id === selectedSubcategory)?.name}
                  categoryIcon={subcategories.find(sub => sub.id === selectedSubcategory)?.icon}
                />
              </div>
            )}

            {/* Featured Properties */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Properties</h2>
              <CategorySection 
                categorySlug="property"
                categoryName="Featured Real Estate"
                categoryIcon={<FaHome className="h-8 w-8" />}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyPage;

