import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBusinessAdsModern } from "../slice/ListSlice";
import { 
  FaStore, 
  FaBuilding, 
  FaIndustry, 
  FaShoppingCart, 
  FaDollarSign,
  FaChartLine,
  FaUsers,
  FaHeart,
  FaCar,
  FaHome,
  FaUtensils,
  FaLaptop,
  FaDumbbell,
  FaPlane,
  FaGraduationCap,
  FaStethoscope,
  FaBriefcase,
  FaSeedling,
  FaGamepad,
  FaBook,
  FaMusic,
  FaPalette,
  FaTools,
  FaTruck,
  FaHotel,
  FaCoffee,
  FaDog,
  FaRing,
  FaMobile,
  FaTv,
  FaHeadphones,
  FaFootballBall,
  FaChurch,
  FaLandmark,
  FaWarehouse,
  FaGavel,
  FaStar,
  FaArrowLeft,
  FaFilter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock
} from "react-icons/fa";

const BusinessCategoryPage = () => {
  const { categoryName, subcategoryName } = useParams();
  const dispatch = useDispatch();
  const { catAdsList } = useSelector((store) => store.ads);
  const [loading, setLoading] = useState(true);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);

  const businessCategories = {
    retail: {
      name: "Retail & Shopping",
      icon: <FaShoppingCart className="h-8 w-8" />,
      description: "Clothing, electronics, groceries, and specialty stores",
      color: "bg-blue-100 text-blue-600",
      hoverColor: "hover:bg-blue-200",
      subcategories: [
        { id: "clothing", name: "Clothing & Fashion", icon: <FaStore /> },
        { id: "electronics", name: "Electronics", icon: <FaLaptop /> },
        { id: "grocery", name: "Grocery & Food", icon: <FaUtensils /> },
        { id: "books", name: "Books & Stationery", icon: <FaBook /> },
        { id: "toys", name: "Toys & Games", icon: <FaGamepad /> },
        { id: "jewelry", name: "Jewelry & Accessories", icon: <FaRing /> }
      ]
    },
    restaurants: {
      name: "Restaurants & Food",
      icon: <FaUtensils className="h-8 w-8" />,
      description: "Restaurants, cafes, bars, and food delivery services",
      color: "bg-orange-100 text-orange-600",
      hoverColor: "hover:bg-orange-200",
      subcategories: [
        { id: "fast-food", name: "Fast Food", icon: <FaUtensils /> },
        { id: "fine-dining", name: "Fine Dining", icon: <FaUtensils /> },
        { id: "cafes", name: "Cafes & Coffee", icon: <FaCoffee /> },
        { id: "bars", name: "Bars & Pubs", icon: <FaUtensils /> },
        { id: "delivery", name: "Food Delivery", icon: <FaTruck /> },
        { id: "bakery", name: "Bakery & Desserts", icon: <FaUtensils /> }
      ]
    },
    services: {
      name: "Professional Services",
      icon: <FaBriefcase className="h-8 w-8" />,
      description: "Consulting, legal, financial, and business services",
      color: "bg-green-100 text-green-600",
      hoverColor: "hover:bg-green-200",
      subcategories: [
        { id: "consulting", name: "Business Consulting", icon: <FaChartLine /> },
        { id: "legal", name: "Legal Services", icon: <FaGavel /> },
        { id: "financial", name: "Financial Services", icon: <FaDollarSign /> },
        { id: "marketing", name: "Marketing & Advertising", icon: <FaChartLine /> },
        { id: "it-services", name: "IT Services", icon: <FaLaptop /> },
        { id: "hr", name: "HR & Recruitment", icon: <FaUsers /> }
      ]
    },
    healthcare: {
      name: "Healthcare & Wellness",
      icon: <FaStethoscope className="h-8 w-8" />,
      description: "Hospitals, clinics, fitness, and wellness centers",
      color: "bg-red-100 text-red-600",
      hoverColor: "hover:bg-red-200",
      subcategories: [
        { id: "hospitals", name: "Hospitals", icon: <FaStethoscope /> },
        { id: "clinics", name: "Medical Clinics", icon: <FaStethoscope /> },
        { id: "fitness", name: "Fitness & Gyms", icon: <FaDumbbell /> },
        { id: "pharmacy", name: "Pharmacy", icon: <FaStethoscope /> },
        { id: "dental", name: "Dental Care", icon: <FaStethoscope /> },
        { id: "mental-health", name: "Mental Health", icon: <FaHeart /> }
      ]
    },
    education: {
      name: "Education & Training",
      icon: <FaGraduationCap className="h-8 w-8" />,
      description: "Schools, universities, tutoring, and training centers",
      color: "bg-purple-100 text-purple-600",
      hoverColor: "hover:bg-purple-200",
      subcategories: [
        { id: "schools", name: "Schools", icon: <FaGraduationCap /> },
        { id: "universities", name: "Universities", icon: <FaGraduationCap /> },
        { id: "tutoring", name: "Tutoring Services", icon: <FaGraduationCap /> },
        { id: "online-courses", name: "Online Courses", icon: <FaLaptop /> },
        { id: "training", name: "Training Centers", icon: <FaGraduationCap /> },
        { id: "libraries", name: "Libraries", icon: <FaBook /> }
      ]
    },
    automotive: {
      name: "Automotive",
      icon: <FaCar className="h-8 w-8" />,
      description: "Car dealerships, repair shops, and auto parts",
      color: "bg-gray-100 text-gray-600",
      hoverColor: "hover:bg-gray-200",
      subcategories: [
        { id: "dealerships", name: "Car Dealerships", icon: <FaCar /> },
        { id: "repair", name: "Auto Repair", icon: <FaTools /> },
        { id: "parts", name: "Auto Parts", icon: <FaCar /> },
        { id: "rental", name: "Car Rental", icon: <FaCar /> },
        { id: "wash", name: "Car Wash", icon: <FaCar /> },
        { id: "tires", name: "Tires & Service", icon: <FaCar /> }
      ]
    },
    "real-estate": {
      name: "Real Estate",
      icon: <FaHome className="h-8 w-8" />,
      description: "Property sales, rentals, and real estate services",
      color: "bg-teal-100 text-teal-600",
      hoverColor: "hover:bg-teal-200",
      subcategories: [
        { id: "residential", name: "Residential", icon: <FaHome /> },
        { id: "commercial", name: "Commercial", icon: <FaBuilding /> },
        { id: "rentals", name: "Property Rentals", icon: <FaHome /> },
        { id: "agents", name: "Real Estate Agents", icon: <FaBuilding /> },
        { id: "property-management", name: "Property Management", icon: <FaBuilding /> },
        { id: "land", name: "Land & Plots", icon: <FaLandmark /> }
      ]
    },
    entertainment: {
      name: "Entertainment & Leisure",
      icon: <FaGamepad className="h-8 w-8" />,
      description: "Movies, gaming, sports, and recreational activities",
      color: "bg-pink-100 text-pink-600",
      hoverColor: "hover:bg-pink-200",
      subcategories: [
        { id: "cinema", name: "Cinema & Movies", icon: <FaTv /> },
        { id: "gaming", name: "Gaming Centers", icon: <FaGamepad /> },
        { id: "sports", name: "Sports Facilities", icon: <FaFootballBall /> },
        { id: "music", name: "Music & Concerts", icon: <FaMusic /> },
        { id: "arts", name: "Arts & Theater", icon: <FaPalette /> },
        { id: "bowling", name: "Bowling & Games", icon: <FaGamepad /> }
      ]
    },
    travel: {
      name: "Travel & Hospitality",
      icon: <FaPlane className="h-8 w-8" />,
      description: "Hotels, travel agencies, and tourism services",
      color: "bg-indigo-100 text-indigo-600",
      hoverColor: "hover:bg-indigo-200",
      subcategories: [
        { id: "hotels", name: "Hotels & Lodging", icon: <FaHotel /> },
        { id: "travel-agency", name: "Travel Agencies", icon: <FaPlane /> },
        { id: "tourism", name: "Tourism Services", icon: <FaPlane /> },
        { id: "transport", name: "Transportation", icon: <FaPlane /> },
        { id: "guides", name: "Tour Guides", icon: <FaPlane /> },
        { id: "cruises", name: "Cruises", icon: <FaPlane /> }
      ]
    },
    beauty: {
      name: "Beauty & Personal Care",
      icon: <FaHeart className="h-8 w-8" />,
      description: "Salons, spas, and personal care services",
      color: "bg-rose-100 text-rose-600",
      hoverColor: "hover:bg-rose-200",
      subcategories: [
        { id: "hair-salon", name: "Hair Salons", icon: <FaHeart /> },
        { id: "spa", name: "Spa & Wellness", icon: <FaHeart /> },
        { id: "nail-salon", name: "Nail Salons", icon: <FaHeart /> },
        { id: "beauty-products", name: "Beauty Products", icon: <FaHeart /> },
        { id: "barbershop", name: "Barbershops", icon: <FaHeart /> },
        { id: "cosmetics", name: "Cosmetics", icon: <FaHeart /> }
      ]
    },
    pets: {
      name: "Pet Services",
      icon: <FaDog className="h-8 w-8" />,
      description: "Pet stores, grooming, and veterinary services",
      color: "bg-yellow-100 text-yellow-600",
      hoverColor: "hover:bg-yellow-200",
      subcategories: [
        { id: "pet-stores", name: "Pet Stores", icon: <FaDog /> },
        { id: "veterinary", name: "Veterinary Services", icon: <FaDog /> },
        { id: "grooming", name: "Pet Grooming", icon: <FaDog /> },
        { id: "boarding", name: "Pet Boarding", icon: <FaDog /> },
        { id: "training", name: "Pet Training", icon: <FaDog /> },
        { id: "supplies", name: "Pet Supplies", icon: <FaDog /> }
      ]
    },
    "home-garden": {
      name: "Home & Garden",
      icon: <FaHome className="h-8 w-8" />,
      description: "Home improvement, furniture, and garden supplies",
      color: "bg-emerald-100 text-emerald-600",
      hoverColor: "hover:bg-emerald-200",
      subcategories: [
        { id: "furniture", name: "Furniture", icon: <FaHome /> },
        { id: "home-improvement", name: "Home Improvement", icon: <FaTools /> },
        { id: "garden", name: "Garden & Landscaping", icon: <FaSeedling /> },
        { id: "appliances", name: "Home Appliances", icon: <FaHome /> },
        { id: "decor", name: "Home Decor", icon: <FaHome /> },
        { id: "storage", name: "Storage Solutions", icon: <FaWarehouse /> }
      ]
    },
    technology: {
      name: "Technology & Electronics",
      icon: <FaLaptop className="h-8 w-8" />,
      description: "Electronics stores, computer services, and tech support",
      color: "bg-cyan-100 text-cyan-600",
      hoverColor: "hover:bg-cyan-200",
      subcategories: [
        { id: "electronics-store", name: "Electronics Stores", icon: <FaLaptop /> },
        { id: "computer-repair", name: "Computer Repair", icon: <FaLaptop /> },
        { id: "mobile-phones", name: "Mobile Phones", icon: <FaMobile /> },
        { id: "gadgets", name: "Gadgets & Accessories", icon: <FaHeadphones /> },
        { id: "software", name: "Software Solutions", icon: <FaLaptop /> },
        { id: "tech-support", name: "Tech Support", icon: <FaLaptop /> }
      ]
    },
    "sports-fitness": {
      name: "Sports & Fitness",
      icon: <FaDumbbell className="h-8 w-8" />,
      description: "Gyms, sports equipment, and fitness centers",
      color: "bg-lime-100 text-lime-600",
      hoverColor: "hover:bg-lime-200",
      subcategories: [
        { id: "gyms", name: "Gyms & Fitness Centers", icon: <FaDumbbell /> },
        { id: "sports-equipment", name: "Sports Equipment", icon: <FaFootballBall /> },
        { id: "yoga", name: "Yoga & Pilates", icon: <FaDumbbell /> },
        { id: "martial-arts", name: "Martial Arts", icon: <FaDumbbell /> },
        { id: "outdoor-sports", name: "Outdoor Sports", icon: <FaFootballBall /> },
        { id: "nutrition", name: "Sports Nutrition", icon: <FaDumbbell /> }
      ]
    },
    industrial: {
      name: "Industrial & Manufacturing",
      icon: <FaIndustry className="h-8 w-8" />,
      description: "Manufacturing, warehouses, and industrial services",
      color: "bg-slate-100 text-slate-600",
      hoverColor: "hover:bg-slate-200",
      subcategories: [
        { id: "manufacturing", name: "Manufacturing", icon: <FaIndustry /> },
        { id: "warehousing", name: "Warehousing", icon: <FaWarehouse /> },
        { id: "logistics", name: "Logistics & Shipping", icon: <FaTruck /> },
        { id: "construction", name: "Construction", icon: <FaBuilding /> },
        { id: "machinery", name: "Machinery & Equipment", icon: <FaIndustry /> },
        { id: "industrial-supplies", name: "Industrial Supplies", icon: <FaTools /> }
      ]
    },
    "non-profit": {
      name: "Non-Profit & Religious",
      icon: <FaChurch className="h-8 w-8" />,
      description: "Charities, religious organizations, and community services",
      color: "bg-violet-100 text-violet-600",
      hoverColor: "hover:bg-violet-200",
      subcategories: [
        { id: "charities", name: "Charities", icon: <FaHeart /> },
        { id: "religious", name: "Religious Organizations", icon: <FaChurch /> },
        { id: "community", name: "Community Services", icon: <FaUsers /> },
        { id: "foundations", name: "Foundations", icon: <FaLandmark /> },
        { id: "volunteer", name: "Volunteer Organizations", icon: <FaUsers /> },
        { id: "advocacy", name: "Advocacy Groups", icon: <FaUsers /> }
      ]
    }
  };

  const category = businessCategories[categoryName];
  const subcategory = subcategoryName && category ? 
    category.subcategories.find(sub => sub.id === subcategoryName) : null;

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        await dispatch(getBusinessAdsModern()).unwrap();
      } catch (error) {
        console.error('Failed to fetch businesses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [dispatch]);

  useEffect(() => {
    if (catAdsList?.items && category) {
      // Filter businesses based on category and subcategory
      const filtered = catAdsList.items.filter(business => {
        // This is a basic filter - you might want to improve this based on your actual data structure
        const businessCategory = business.category?.toLowerCase() || business.type?.toLowerCase() || '';
        const categoryNameLower = category.name.toLowerCase();
        
        // First check if business matches the main category
        const matchesMainCategory = businessCategory.includes(categoryName) || 
                                  businessCategory.includes(categoryName.replace('-', ' ')) ||
                                  categoryNameLower.includes(businessCategory);
        
        // If we have a subcategory, also check for subcategory match
        if (subcategoryName && subcategory) {
          const subcategoryNameLower = subcategory.name.toLowerCase();
          const matchesSubcategory = businessCategory.includes(subcategoryName) ||
                                    businessCategory.includes(subcategoryName.replace('-', ' ')) ||
                                    subcategoryNameLower.includes(businessCategory) ||
                                    business.subcategory === subcategoryName;
          return matchesMainCategory && matchesSubcategory;
        }
        
        return matchesMainCategory;
      });
      setFilteredBusinesses(filtered);
    }
  }, [catAdsList, category, categoryName, subcategoryName, subcategory]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The business category you're looking for doesn't exist.</p>
          <Link 
            to="/business"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Business Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${category.color} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link 
              to="/business"
              className="inline-flex items-center text-gray-700 hover:text-gray-900 mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Back to Business Directory
            </Link>
          </div>
          
          <div className="flex items-center mb-6">
            <div className={`p-4 rounded-lg ${category.color} ${category.hoverColor} mr-6`}>
              {category.icon}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {subcategory ? subcategory.name : category.name}
              </h1>
              <p className="text-xl text-gray-700">
                {subcategory ? `${subcategory.name} - ${category.name}` : category.description}
              </p>
              {subcategory && (
                <div className="mt-2">
                  <Link 
                    to={`/business/category/${categoryName}`}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    ← Back to {category.name}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Subcategories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {category.subcategories.map((sub) => (
              <Link
                key={sub.id}
                to={`/business/category/${categoryName}/${sub.id}`}
                className={`flex flex-col items-center p-4 rounded-lg ${category.color} ${category.hoverColor} transition-all duration-200 hover:shadow-md`}
              >
                <div className="mb-2">{sub.icon}</div>
                <span className="text-sm text-center font-medium">{sub.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Results */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FaFilter className="mr-2" />
                Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Locations</option>
                    <option>New York</option>
                    <option>Los Angeles</option>
                    <option>Chicago</option>
                    <option>Houston</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Ratings</option>
                    <option>4+ Stars</option>
                    <option>3+ Stars</option>
                    <option>2+ Stars</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Prices</option>
                    <option>$</option>
                    <option>$$</option>
                    <option>$$$</option>
                    <option>$$$$</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : `${filteredBusinesses.length} ${subcategory ? subcategory.name : category.name} Found`}
              </h2>
              
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sort by: Relevance</option>
                <option>Sort by: Name</option>
                <option>Sort by: Rating</option>
                <option>Sort by: Distance</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <div key={business.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-4">
                      <img 
                        src={business.image || "/img/NoImage.png"} 
                        alt={business.title}
                        className="w-16 h-16 rounded-lg object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{business.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <FaMapMarkerAlt className="mr-1" />
                          {business.location || 'Location not specified'}
                        </div>
                        <div className="flex items-center">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`h-4 w-4 ${i < Math.floor(business.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {business.rating || 'No rating'} ({business.reviews || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {business.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <FaPhone className="mr-1" />
                        {business.phone || 'No phone'}
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        {business.hours || 'Hours not specified'}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/business/${business.slug}`}
                        className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                      <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        <FaEnvelope />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FaStore className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any businesses in {subcategory ? `${subcategory.name} (${category.name})` : `the ${category.name} category`}.
                </p>
                <Link 
                  to="/business"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse All Categories
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCategoryPage;
