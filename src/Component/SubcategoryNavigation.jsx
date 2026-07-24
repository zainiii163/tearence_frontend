import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChevronDown, 
  FaChevronRight, 
  FaTags, 
  FaBriefcase, 
  FaHome, 
  FaCar, 
  FaCogs,
  FaHeart,
  FaBullhorn,
  FaStar,
  FaIndustry,
  FaChartLine,
  FaDollarSign,
  FaUsers,
  FaGamepad,
  FaDumbbell,
  FaTshirt,
  FaMobileAlt,
  FaLaptop,
  FaMusic,
  FaCamera,
  FaTools,
  FaSeedling,
  FaBuilding,
  FaLandmark,
  FaEnvelope,
  FaShieldAlt,
  FaPalette,
  FaCode,
  FaPen,
  FaTrophy,
  FaPaintBrush,
  FaTag,
  FaCrown,
  FaFire,
  FaStore,
  FaFlag,
  FaServer,
  FaDatabase,
  FaCloud,
  FaRobot,
  FaLanguage,
  FaVideo,
  FaLightbulb,
  FaMicrophone,
  FaHeadset,
  FaChartBar,
  FaSearchPlus
} from 'react-icons/fa';

const SubcategoryNavigation = ({ pageType, currentCategory = null }) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Define subcategories for each page type
  const getSubcategories = () => {
    switch (pageType) {
      case 'homepage':
        return [
          {
            id: 'sponsored',
            name: 'Sponsored Ads',
            icon: <FaBullhorn className="h-4 w-4" />,
            subcategories: [
              { id: 'featured-sponsors', name: 'Featured Sponsors', icon: <FaStar className="h-3 w-3" /> },
              { id: 'premium-ads', name: 'Premium Ads', icon: <FaCrown className="h-3 w-3" /> },
              { id: 'top-promoted', name: 'Top Promoted', icon: <FaFire className="h-3 w-3" /> }
            ]
          },
          {
            id: 'buy-sell',
            name: 'Buy & Sell',
            icon: <FaTags className="h-4 w-4" />,
            subcategories: [
              { id: 'electronics', name: 'Electronics', icon: <FaMobileAlt className="h-3 w-3" /> },
              { id: 'vehicles', name: 'Vehicles', icon: <FaCar className="h-3 w-3" /> },
              { id: 'property', name: 'Property', icon: <FaHome className="h-3 w-3" /> },
              { id: 'fashion', name: 'Fashion', icon: <FaTshirt className="h-3 w-3" /> }
            ]
          },
          {
            id: 'services',
            name: 'Services',
            icon: <FaCogs className="h-4 w-4" />,
            subcategories: [
              { id: 'digital-marketing', name: 'Digital Marketing', icon: <FaBullhorn className="h-3 w-3" /> },
              { id: 'web-development', name: 'Web Development', icon: <FaCode className="h-3 w-3" /> },
              { id: 'consulting', name: 'Business Consulting', icon: <FaBriefcase className="h-3 w-3" /> },
              { id: 'creative-services', name: 'Creative Services', icon: <FaPalette className="h-3 w-3" /> }
            ]
          },
          {
            id: 'jobs',
            name: 'Jobs',
            icon: <FaBriefcase className="h-4 w-4" />,
            subcategories: [
              { id: 'technology', name: 'Technology', icon: <FaCode className="h-3 w-3" /> },
              { id: 'healthcare', name: 'Healthcare', icon: <FaHeart className="h-3 w-3" /> },
              { id: 'education', name: 'Education', icon: <FaPen className="h-3 w-3" /> },
              { id: 'finance', name: 'Finance', icon: <FaDollarSign className="h-3 w-3" /> }
            ]
          },
          {
            id: 'banner-adverts',
            name: 'Banner Adverts',
            icon: <FaFlag className="h-4 w-4" />,
            subcategories: [
              { id: 'featured-banners', name: 'Featured Banners', icon: <FaStar className="h-3 w-3" /> },
              { id: 'sponsored-banners', name: 'Sponsored Banners', icon: <FaCrown className="h-3 w-3" /> },
              { id: 'trending-banners', name: 'Trending Banners', icon: <FaFire className="h-3 w-3" /> },
              { id: 'new-banners', name: 'New Banners', icon: <FaTag className="h-3 w-3" /> }
            ]
          },
          {
            id: 'property',
            name: 'Property',
            icon: <FaHome className="h-4 w-4" />,
            subcategories: [
              { id: 'residential', name: 'Residential', icon: <FaHome className="h-3 w-3" /> },
              { id: 'commercial', name: 'Commercial', icon: <FaBuilding className="h-3 w-3" /> },
              { id: 'land', name: 'Land & Plots', icon: <FaLandmark className="h-3 w-3" /> }
            ]
          }
        ];

      case 'services':
        return [
          {
            id: 'graphics-design',
            name: 'Graphics & Design',
            icon: <FaPalette className="h-4 w-4" />,
            subcategories: [
              { id: 'logo-design', name: 'Logo Design', icon: <FaPaintBrush className="h-3 w-3" /> },
              { id: 'branding', name: 'Brand Style Guides', icon: <FaTrophy className="h-3 w-3" /> },
              { id: 'web-design', name: 'Web & App Design', icon: <FaLaptop className="h-3 w-3" /> },
              { id: 'illustration', name: 'Illustration', icon: <FaPen className="h-3 w-3" /> },
              { id: 'print-design', name: 'Print Design', icon: <FaTag className="h-3 w-3" /> }
            ]
          },
          {
            id: 'programming-tech',
            name: 'Programming & Tech',
            icon: <FaCode className="h-4 w-4" />,
            subcategories: [
              { id: 'web-development', name: 'Web Development', icon: <FaLaptop className="h-3 w-3" /> },
              { id: 'mobile-apps', name: 'Mobile Apps', icon: <FaMobileAlt className="h-3 w-3" /> },
              { id: 'desktop-apps', name: 'Desktop Applications', icon: <FaServer className="h-3 w-3" /> },
              { id: 'databases', name: 'Database Development', icon: <FaDatabase className="h-3 w-3" /> },
              { id: 'cloud-computing', name: 'Cloud Computing', icon: <FaCloud className="h-3 w-3" /> },
              { id: 'ai-ml', name: 'AI & Machine Learning', icon: <FaRobot className="h-3 w-3" /> }
            ]
          },
          {
            id: 'writing-translation',
            name: 'Writing & Translation',
            icon: <FaPen className="h-4 w-4" />,
            subcategories: [
              { id: 'content-writing', name: 'Content Writing', icon: <FaPen className="h-3 w-3" /> },
              { id: 'copywriting', name: 'Copywriting', icon: <FaBullhorn className="h-3 w-3" /> },
              { id: 'technical-writing', name: 'Technical Writing', icon: <FaCode className="h-3 w-3" /> },
              { id: 'translation', name: 'Translation', icon: <FaLanguage className="h-3 w-3" /> },
              { id: 'proofreading', name: 'Proofreading & Editing', icon: <FaTag className="h-3 w-3" /> }
            ]
          },
          {
            id: 'video-photo',
            name: 'Video & Photo',
            icon: <FaCamera className="h-4 w-4" />,
            subcategories: [
              { id: 'video-editing', name: 'Video Editing', icon: <FaVideo className="h-3 w-3" /> },
              { id: 'photography', name: 'Photography', icon: <FaCamera className="h-3 w-3" /> },
              { id: 'animation', name: 'Animation', icon: <FaLightbulb className="h-3 w-3" /> },
              { id: 'visual-effects', name: 'Visual Effects', icon: <FaStar className="h-3 w-3" /> }
            ]
          },
          {
            id: 'music-audio',
            name: 'Music & Audio',
            icon: <FaMusic className="h-4 w-4" />,
            subcategories: [
              { id: 'music-production', name: 'Music Production', icon: <FaMusic className="h-3 w-3" /> },
              { id: 'voice-over', name: 'Voice Over', icon: <FaMicrophone className="h-3 w-3" /> },
              { id: 'audio-editing', name: 'Audio Editing', icon: <FaHeadset className="h-3 w-3" /> },
              { id: 'mixing-mastering', name: 'Mixing & Mastering', icon: <FaChartBar className="h-3 w-3" /> }
            ]
          },
          {
            id: 'marketing',
            name: 'Marketing',
            icon: <FaBullhorn className="h-4 w-4" />,
            subcategories: [
              { id: 'digital-marketing', name: 'Digital Marketing', icon: <FaChartLine className="h-3 w-3" /> },
              { id: 'seo', name: 'SEO', icon: <FaSearchPlus className="h-3 w-3" /> },
              { id: 'social-media-marketing', name: 'Social Media Marketing', icon: <FaBullhorn className="h-3 w-3" /> },
              { id: 'content-marketing', name: 'Content Marketing', icon: <FaPen className="h-3 w-3" /> },
              { id: 'email-marketing', name: 'Email Marketing', icon: <FaEnvelope className="h-3 w-3" /> }
            ]
          },
          {
            id: 'business',
            name: 'Business',
            icon: <FaBriefcase className="h-4 w-4" />,
            subcategories: [
              { id: 'business-consulting', name: 'Business Consulting', icon: <FaChartLine className="h-3 w-3" /> },
              { id: 'market-research', name: 'Market Research', icon: <FaSearchPlus className="h-3 w-3" /> },
              { id: 'business-plans', name: 'Business Plans', icon: <FaBriefcase className="h-3 w-3" /> },
              { id: 'presentations', name: 'Presentations', icon: <FaChartBar className="h-3 w-3" /> }
            ]
          },
          {
            id: 'funding',
            name: 'Business Funding & Investment',
            icon: <FaChartLine className="h-4 w-4" />,
            subcategories: [
              { id: 'business-investment', name: 'Business Investment', icon: <FaBriefcase className="h-3 w-3" /> },
              { id: 'startup-funding', name: 'Startup Funding', icon: <FaChartLine className="h-3 w-3" /> },
              { id: 'venture-capital', name: 'Venture Capital', icon: <FaDollarSign className="h-3 w-3" /> },
              { id: 'partnership-opportunities', name: 'Partnership Opportunities', icon: <FaUsers className="h-3 w-3" /> }
            ]
          }
        ];

      case 'buy-sell':
        return [
          {
            id: 'vehicles',
            name: 'Vehicles',
            icon: <FaCar className="h-4 w-4" />,
            subcategories: [
              { id: 'cars', name: 'Cars', icon: <FaCar className="h-3 w-3" /> },
              { id: 'motorcycles', name: 'Motorcycles', icon: <FaCar className="h-3 w-3" /> },
              { id: 'trucks', name: 'Trucks & Vans', icon: <FaCar className="h-3 w-3" /> },
              { id: 'boats', name: 'Boats', icon: <FaCar className="h-3 w-3" /> },
              { id: 'parts', name: 'Vehicle Parts', icon: <FaTools className="h-3 w-3" /> }
            ]
          },
          {
            id: 'electronics',
            name: 'Electronics',
            icon: <FaMobileAlt className="h-4 w-4" />,
            subcategories: [
              { id: 'phones', name: 'Mobile Phones', icon: <FaMobileAlt className="h-3 w-3" /> },
              { id: 'computers', name: 'Computers', icon: <FaLaptop className="h-3 w-3" /> },
              { id: 'tv-audio', name: 'TV & Audio', icon: <FaMusic className="h-3 w-3" /> },
              { id: 'gaming-consoles', name: 'Gaming Consoles', icon: <FaGamepad className="h-3 w-3" /> },
              { id: 'accessories', name: 'Accessories', icon: <FaTools className="h-3 w-3" /> }
            ]
          },
          {
            id: 'property',
            name: 'Property',
            icon: <FaHome className="h-4 w-4" />,
            subcategories: [
              { id: 'houses', name: 'Houses', icon: <FaHome className="h-3 w-3" /> },
              { id: 'apartments', name: 'Apartments', icon: <FaBuilding className="h-3 w-3" /> },
              { id: 'land', name: 'Land & Plots', icon: <FaLandmark className="h-3 w-3" /> },
              { id: 'commercial', name: 'Commercial', icon: <FaIndustry className="h-3 w-3" /> }
            ]
          },
          {
            id: 'fashion',
            name: 'Fashion & Accessories',
            icon: <FaTshirt className="h-4 w-4" />,
            subcategories: [
              { id: 'clothing', name: 'Clothing', icon: <FaTshirt className="h-3 w-3" /> },
              { id: 'shoes', name: 'Shoes', icon: <FaTshirt className="h-3 w-3" /> },
              { id: 'jewelry', name: 'Jewelry', icon: <FaStar className="h-3 w-3" /> },
              { id: 'bags', name: 'Bags & Accessories', icon: <FaTag className="h-3 w-3" /> }
            ]
          },
          {
            id: 'home-garden',
            name: 'Home & Garden',
            icon: <FaHome className="h-4 w-4" />,
            subcategories: [
              { id: 'furniture', name: 'Furniture', icon: <FaHome className="h-3 w-3" /> },
              { id: 'appliances', name: 'Appliances', icon: <FaCogs className="h-3 w-3" /> },
              { id: 'garden', name: 'Garden & Outdoor', icon: <FaSeedling className="h-3 w-3" /> },
              { id: 'decor', name: 'Home Decor', icon: <FaHome className="h-3 w-3" /> }
            ]
          }
        ];

      case 'property':
        return [
          {
            id: 'residential',
            name: 'Residential Property',
            icon: <FaHome className="h-4 w-4" />,
            subcategories: [
              { id: 'houses', name: 'Houses', icon: <FaHome className="h-3 w-3" /> },
              { id: 'apartments', name: 'Apartments', icon: <FaBuilding className="h-3 w-3" /> },
              { id: 'condos', name: 'Condos', icon: <FaBuilding className="h-3 w-3" /> },
              { id: 'townhouses', name: 'Townhouses', icon: <FaHome className="h-3 w-3" /> }
            ]
          },
          {
            id: 'commercial',
            name: 'Commercial Property',
            icon: <FaIndustry className="h-4 w-4" />,
            subcategories: [
              { id: 'offices', name: 'Office Spaces', icon: <FaBuilding className="h-3 w-3" /> },
              { id: 'retail', name: 'Retail Spaces', icon: <FaStore className="h-3 w-3" /> },
              { id: 'warehouses', name: 'Warehouses', icon: <FaIndustry className="h-3 w-3" /> },
              { id: 'industrial', name: 'Industrial', icon: <FaIndustry className="h-3 w-3" /> }
            ]
          },
          {
            id: 'land',
            name: 'Land & Plots',
            icon: <FaLandmark className="h-4 w-4" />,
            subcategories: [
              { id: 'residential-land', name: 'Residential Land', icon: <FaHome className="h-3 w-3" /> },
              { id: 'commercial-land', name: 'Commercial Land', icon: <FaIndustry className="h-3 w-3" /> },
              { id: 'agricultural', name: 'Agricultural Land', icon: <FaSeedling className="h-3 w-3" /> },
              { id: 'farm', name: 'Farm Land', icon: <FaSeedling className="h-3 w-3" /> }
            ]
          }
        ];

      case 'jobs':
        return [
          {
            id: 'technology',
            name: 'Technology',
            icon: <FaCode className="h-4 w-4" />,
            subcategories: [
              { id: 'software-development', name: 'Software Development', icon: <FaCode className="h-3 w-3" /> },
              { id: 'it-support', name: 'IT Support', icon: <FaLaptop className="h-3 w-3" /> },
              { id: 'data-science', name: 'Data Science', icon: <FaChartBar className="h-3 w-3" /> },
              { id: 'cybersecurity', name: 'Cybersecurity', icon: <FaShieldAlt className="h-3 w-3" /> }
            ]
          },
          {
            id: 'business',
            name: 'Business & Finance',
            icon: <FaBriefcase className="h-4 w-4" />,
            subcategories: [
              { id: 'management', name: 'Management', icon: <FaBriefcase className="h-3 w-3" /> },
              { id: 'finance', name: 'Finance & Accounting', icon: <FaDollarSign className="h-3 w-3" /> },
              { id: 'marketing', name: 'Marketing & Sales', icon: <FaBullhorn className="h-3 w-3" /> },
              { id: 'hr', name: 'Human Resources', icon: <FaUsers className="h-3 w-3" /> }
            ]
          },
          {
            id: 'healthcare',
            name: 'Healthcare',
            icon: <FaHeart className="h-4 w-4" />,
            subcategories: [
              { id: 'medical', name: 'Medical & Nursing', icon: <FaHeart className="h-3 w-3" /> },
              { id: 'mental-health', name: 'Mental Health', icon: <FaHeart className="h-3 w-3" /> },
              { id: 'wellness', name: 'Wellness & Fitness', icon: <FaDumbbell className="h-3 w-3" /> }
            ]
          }
        ];

      default:
        return [];
    }
  };

  const subcategories = getSubcategories();

  if (!subcategories.length) return null;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="page-container">
        <div className="py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
            <FaTags className="h-4 w-4" />
            <span className="font-medium">Browse by Category:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {subcategories.map((category) => (
              <div key={category.id} className="relative">
                {category.id === 'banner-adverts' ? (
                  <Link
                    to="/banner-adverts"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <span className="flex items-center">
                      {React.isValidElement(category.icon) ? category.icon : null}
                    </span>
                    <span>{category.name}</span>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <span className="ml-1">
                        {expandedCategories.has(category.id) ? (
                          <FaChevronDown className="h-3 w-3" />
                        ) : (
                          <FaChevronRight className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <span className="flex items-center">
                      {React.isValidElement(category.icon) ? category.icon : null}
                    </span>
                    <span>{category.name}</span>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <span className="ml-1">
                        {expandedCategories.has(category.id) ? (
                          <FaChevronDown className="h-3 w-3" />
                        ) : (
                          <FaChevronRight className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </button>
                )}

                {/* Dropdown for subcategories */}
                {category.subcategories && 
                 category.subcategories.length > 0 && 
                 expandedCategories.has(category.id) && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          to={`/${pageType}/${category.id}/${subcategory.id}`}
                          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                        >
                          <span className="flex items-center text-gray-500">
                            {subcategory.icon}
                          </span>
                          <span>{subcategory.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* "All Categories" option */}
            <Link
              to={`/${pageType}`}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !currentCategory
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <FaTags className="h-4 w-4" />
              <span>All Categories</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryNavigation;
