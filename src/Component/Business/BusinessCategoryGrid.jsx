import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaStore, 
  FaBuilding, 
  FaIndustry, 
  FaShoppingCart, 
  FaDollarSign,
  FaChartLine,
  FaUsers,
  FaGlobe,
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
  FaStar
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { getBusinessAdsModern } from "../../slice/ListSlice";

const BusinessCategoryGrid = () => {
  const dispatch = useDispatch();
  const { catAdsList } = useSelector((store) => store.ads);

  useEffect(() => {
    dispatch(getBusinessAdsModern());
  }, [dispatch]);

  const businessCategories = [
    {
      id: "retail",
      name: "Retail & Shopping",
      icon: <FaShoppingCart className="h-6 w-6" />,
      description: "Clothing, electronics, groceries, specialty stores",
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
    {
      id: "restaurants",
      name: "Restaurants & Food",
      icon: <FaUtensils className="h-6 w-6" />,
      description: "Restaurants, cafes, bars, food delivery",
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
    {
      id: "services",
      name: "Professional Services",
      icon: <FaBriefcase className="h-6 w-6" />,
      description: "Consulting, legal, financial, business services",
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
    {
      id: "healthcare",
      name: "Healthcare & Wellness",
      icon: <FaStethoscope className="h-6 w-6" />,
      description: "Hospitals, clinics, fitness, wellness centers",
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
    {
      id: "education",
      name: "Education & Training",
      icon: <FaGraduationCap className="h-6 w-6" />,
      description: "Schools, universities, tutoring, training",
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
    {
      id: "automotive",
      name: "Automotive",
      icon: <FaCar className="h-6 w-6" />,
      description: "Car dealerships, repair shops, auto parts",
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
    {
      id: "real-estate",
      name: "Real Estate",
      icon: <FaHome className="h-6 w-6" />,
      description: "Property sales, rentals, real estate services",
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
    {
      id: "entertainment",
      name: "Entertainment & Leisure",
      icon: <FaGamepad className="h-6 w-6" />,
      description: "Movies, gaming, sports, recreational activities",
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
    {
      id: "travel",
      name: "Travel & Hospitality",
      icon: <FaPlane className="h-6 w-6" />,
      description: "Hotels, travel agencies, tourism services",
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
    {
      id: "beauty",
      name: "Beauty & Personal Care",
      icon: <FaHeart className="h-6 w-6" />,
      description: "Salons, spas, personal care services",
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
    {
      id: "pets",
      name: "Pet Services",
      icon: <FaDog className="h-6 w-6" />,
      description: "Pet stores, grooming, veterinary services",
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
    {
      id: "home-garden",
      name: "Home & Garden",
      icon: <FaHome className="h-6 w-6" />,
      description: "Home improvement, furniture, garden supplies",
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
    {
      id: "technology",
      name: "Technology & Electronics",
      icon: <FaLaptop className="h-6 w-6" />,
      description: "Electronics stores, computer services, tech support",
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
    {
      id: "sports-fitness",
      name: "Sports & Fitness",
      icon: <FaDumbbell className="h-6 w-6" />,
      description: "Gyms, sports equipment, fitness centers",
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
    {
      id: "industrial",
      name: "Industrial & Manufacturing",
      icon: <FaIndustry className="h-6 w-6" />,
      description: "Manufacturing, warehouses, industrial services",
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
    {
      id: "non-profit",
      name: "Non-Profit & Religious",
      icon: <FaChurch className="h-6 w-6" />,
      description: "Charities, religious organizations, community services",
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
  ];

  const featuredBusinesses = catAdsList?.items?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Business & Stores Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover local businesses and online stores across various categories. 
            Find everything from retail shops to professional services.
          </p>
        </div>

        {/* Featured Businesses */}
        {featuredBusinesses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Businesses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBusinesses.map((business) => (
                <div key={business.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <img 
                      src={business.image || "/img/NoImage.png"} 
                      alt={business.title}
                      className="w-12 h-12 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{business.title}</h3>
                      <p className="text-sm text-gray-600">{business.category}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {business.description}
                  </p>
                  <Link 
                    to={`/business/${business.slug}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Business →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businessCategories.map((category) => (
              <div key={category.id} className="group">
                <Link 
                  to={`/business/category/${category.id}`}
                  className={`block p-4 rounded-lg border-2 border-gray-200 ${category.color} ${category.hoverColor} transition-all duration-200 hover:shadow-lg h-40 flex flex-col`}
                >
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg ${category.color} ${category.hoverColor} mr-3`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 text-sm">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-700 text-xs mb-3 line-clamp-2 flex-1">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-600">
                      {category.subcategories.length} subcategories
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      Explore →
                    </span>
                  </div>
                </Link>
                
                {/* Subcategories (shown on hover) */}
                <div className="mt-2 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/business/category/${category.id}/${sub.id}`}
                      className="block text-xs text-gray-600 hover:text-blue-600 pl-2 py-1"
                    >
                      • {sub.name}
                    </Link>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="text-xs text-gray-500 pl-2">
                      +{category.subcategories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <FaStore className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">10,000+</div>
            <div className="text-gray-600">Active Businesses</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <FaUsers className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">50,000+</div>
            <div className="text-gray-600">Monthly Visitors</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <FaGlobe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">100+</div>
            <div className="text-gray-600">Cities Covered</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <FaStar className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">List Your Business</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Join thousands of businesses that are already reaching more customers through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/my-business"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Add Your Business
            </Link>
            <Link 
              to="/business"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse All Businesses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCategoryGrid;
