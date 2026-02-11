import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaHotel, 
  FaBed, 
  FaCar, 
  FaPlane, 
  FaShip, 
  FaTrain,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaStar,
  FaDollarSign,
  FaWifi,
  FaSwimmingPool,
  FaParking,
  FaUtensils,
  FaChevronRight,
  FaCheckCircle
} from "react-icons/fa";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import CategorySection from "../Component/CategorySection";

const ResortsTravelPage = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Subcategories for Hotels, Resorts & Travel
  const subcategories = [
    {
      id: "hotels",
      name: "Hotels",
      icon: <FaHotel className="h-6 w-6" />,
      description: "Hotels of all types and budgets",
      slug: "hotels"
    },
    {
      id: "bandb",
      name: "B&B",
      icon: <FaBed className="h-6 w-6" />,
      description: "Bed and Breakfast accommodations",
      slug: "bandb"
    },
    {
      id: "resorts",
      name: "Resorts",
      icon: <FaSwimmingPool className="h-6 w-6" />,
      description: "Luxury resorts and vacation spots",
      slug: "resorts"
    },
    {
      id: "transport",
      name: "Transport Services",
      icon: <FaCar className="h-6 w-6" />,
      description: "Car rentals, taxis, and transport",
      slug: "transport"
    },
    {
      id: "tours",
      name: "Tours & Packages",
      icon: <FaPlane className="h-6 w-6" />,
      description: "Guided tours and travel packages",
      slug: "tours"
    },
    {
      id: "activities",
      name: "Activities",
      icon: <FaStar className="h-6 w-6" />,
      description: "Tourist activities and attractions",
      slug: "activities"
    }
  ];

  // Amenities filters
  const amenities = [
    { id: "wifi", name: "WiFi", icon: <FaWifi className="h-4 w-4" /> },
    { id: "parking", name: "Parking", icon: <FaParking className="h-4 w-4" /> },
    { id: "pool", name: "Swimming Pool", icon: <FaSwimmingPool className="h-4 w-4" /> },
    { id: "restaurant", name: "Restaurant", icon: <FaUtensils className="h-4 w-4" /> },
  ];

  const handleAmenityToggle = (amenityId) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const filteredSubcategories = selectedSubcategory === "all" 
    ? subcategories 
    : subcategories.filter(sub => sub.id === selectedSubcategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Hotels, Resorts & Travel
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Find the perfect accommodations, transport services, and tourist activities for your next trip
            </p>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                  <FaFilter className="h-5 w-5 text-blue-500" />
                  Filters
                </h3>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaSearch className="h-4 w-4 text-blue-500" />
                  Search Services
                </h4>
                <div className="relative">
                  <FaSearch className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                  <input
                    type="text"
                    placeholder="Search destinations, hotels, services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaHotel className="h-4 w-4 text-blue-500" />
                  Categories
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => setSelectedSubcategory("all")}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                      selectedSubcategory === "all"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">🏨</span>
                    All Categories
                  </button>
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => setSelectedSubcategory(subcategory.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                        selectedSubcategory === subcategory.id
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        {subcategory.icon}
                      </div>
                      <span className="text-sm">{subcategory.name}</span>
                      {selectedSubcategory === subcategory.id && (
                        <FaCheckCircle className="h-4 w-4 ml-auto text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaDollarSign className="h-4 w-4 text-blue-500" />
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

              {/* Location */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaMapMarkerAlt className="h-4 w-4 text-blue-500" />
                  Location
                </h4>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <input
                    type="text"
                    placeholder="Enter location..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FaStar className="h-4 w-4 text-blue-500" />
                  Amenities
                </h4>
                <div className="space-y-2">
                  {amenities.map((amenity) => (
                    <button
                      key={amenity.id}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-3 ${
                        selectedAmenities.includes(amenity.id)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      {amenity.icon}
                      <span className="text-sm">{amenity.name}</span>
                      {selectedAmenities.includes(amenity.id) && (
                        <FaCheckCircle className="h-4 w-4 ml-auto text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubcategory("all");
                  setPriceRange({ min: "", max: "" });
                  setSelectedAmenities([]);
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
                  {selectedSubcategory === "all" ? "All Services" : subcategories.find(c => c.id === selectedSubcategory)?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  Browse {selectedSubcategory === "all" ? "all travel services" : subcategories.find(c => c.id === selectedSubcategory)?.name?.toLowerCase()}
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
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          {subcategory.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{subcategory.name}</h3>
                          <p className="text-sm text-gray-600">{subcategory.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-blue-600 font-medium">
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

            {/* Featured Listings */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Listings</h2>
              <CategorySection 
                categorySlug="resorts-travel"
                categoryName="Featured Travel & Accommodation"
                categoryIcon={<FaStar className="h-8 w-8" />}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResortsTravelPage;
