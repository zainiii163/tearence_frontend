// Category-specific filter configurations

export const CATEGORY_FILTERS = {
  // Jobs & Vacancies
  jobs: {
    filters: [
      {
        key: "jobType",
        label: "Job Type",
        type: "select",
        icon: "FaBriefcase",
        options: [
          { value: "all", label: "All Types" },
          { value: "full-time", label: "Full Time" },
          { value: "part-time", label: "Part Time" },
          { value: "contract", label: "Contract" },
          { value: "freelance", label: "Freelance" },
          { value: "internship", label: "Internship" },
          { value: "temporary", label: "Temporary" },
          { value: "remote", label: "Remote" }
        ]
      },
      {
        key: "salaryRange",
        label: "Salary Range",
        type: "select",
        icon: "FaDollarSign",
        options: [
          { value: "all", label: "All Ranges" },
          { value: "0-30000", label: "$0 - $30,000" },
          { value: "30000-50000", label: "$30,000 - $50,000" },
          { value: "50000-75000", label: "$50,000 - $75,000" },
          { value: "75000-100000", label: "$75,000 - $100,000" },
          { value: "100000-150000", label: "$100,000 - $150,000" },
          { value: "150000-999999", label: "$150,000+" }
        ]
      },
      {
        key: "experience",
        label: "Experience Level",
        type: "select",
        icon: "FaChartLine",
        options: [
          { value: "all", label: "All Levels" },
          { value: "entry", label: "Entry Level" },
          { value: "junior", label: "Junior" },
          { value: "mid", label: "Mid-Level" },
          { value: "senior", label: "Senior" },
          { value: "executive", label: "Executive" }
        ]
      },
      {
        key: "location",
        label: "Location",
        type: "location",
        icon: "MdLocationOn"
      }
    ],
    sortOptions: [
      { value: "newest", label: "Newest First" },
      { value: "oldest", label: "Oldest First" },
      { value: "salary_low", label: "Salary: Low to High" },
      { value: "salary_high", label: "Salary: High to Low" },
      { value: "relevance", label: "Most Relevant" }
    ]
  },

  // Services
  services: {
    filters: [
      {
        key: "serviceCategory",
        label: "Service Category",
        type: "select",
        icon: "FaBriefcase",
        options: [
          { value: "all", label: "All Categories" },
          { value: "graphics-design", label: "Graphics & Design" },
          { value: "programming-tech", label: "Programming & Tech" },
          { value: "digital-marketing", label: "Digital Marketing" },
          { value: "video-animation", label: "Video & Animation" },
          { value: "writing-translation", label: "Writing & Translation" },
          { value: "music-audio", label: "Music & Audio" },
          { value: "business", label: "Business" },
          { value: "lifestyle", label: "Lifestyle" }
        ]
      },
      {
        key: "priceRange",
        label: "Price Range",
        type: "select",
        icon: "FaDollarSign",
        options: [
          { value: "all", label: "All Ranges" },
          { value: "0-50", label: "$0 - $50" },
          { value: "50-100", label: "$50 - $100" },
          { value: "100-250", label: "$100 - $250" },
          { value: "250-500", label: "$250 - $500" },
          { value: "500-1000", label: "$500 - $1,000" },
          { value: "1000-999999", label: "$1,000+" }
        ]
      },
      {
        key: "deliveryTime",
        label: "Delivery Time",
        type: "select",
        icon: "FaClock",
        options: [
          { value: "all", label: "Any Time" },
          { value: "1", label: "Within 24 hours" },
          { value: "3", label: "Within 3 days" },
          { value: "7", label: "Within 7 days" },
          { value: "14", label: "Within 14 days" },
          { value: "30", label: "Within 30 days" }
        ]
      },
      {
        key: "sellerLevel",
        label: "Seller Level",
        type: "select",
        icon: "FaTrophy",
        options: [
          { value: "all", label: "All Levels" },
          { value: "new", label: "New Seller" },
          { value: "level1", label: "Level 1" },
          { value: "level2", label: "Level 2" },
          { value: "toprated", label: "Top Rated" },
          { value: "pro", label: "Pro Seller" }
        ]
      },
      {
        key: "location",
        label: "Location",
        type: "location",
        icon: "MdLocationOn"
      }
    ],
    sortOptions: [
      { value: "relevance", label: "Most Relevant" },
      { value: "newest", label: "Newest First" },
      { value: "oldest", label: "Oldest First" },
      { value: "price_low", label: "Price: Low to High" },
      { value: "price_high", label: "Price: High to Low" },
      { value: "rating", label: "Highest Rated" }
    ]
  },

  // Property & Real Estate
  property: {
    filters: [
      {
        key: "propertyType",
        label: "Property Type",
        type: "select",
        icon: "FaHome",
        options: [
          { value: "all", label: "All Types" },
          { value: "house", label: "House" },
          { value: "apartment", label: "Apartment" },
          { value: "condo", label: "Condo" },
          { value: "townhouse", label: "Townhouse" },
          { value: "villa", label: "Villa" },
          { value: "land", label: "Land" },
          { value: "commercial", label: "Commercial" },
          { value: "industrial", label: "Industrial" },
          { value: "farm", label: "Farm & Agricultural" }
        ]
      },
      {
        key: "priceRange",
        label: "Price Range",
        type: "select",
        icon: "FaDollarSign",
        options: [
          { value: "all", label: "All Ranges" },
          { value: "0-50000", label: "$0 - $50,000" },
          { value: "50000-100000", label: "$50,000 - $100,000" },
          { value: "100000-250000", label: "$100,000 - $250,000" },
          { value: "250000-500000", label: "$250,000 - $500,000" },
          { value: "500000-1000000", label: "$500,000 - $1,000,000" },
          { value: "1000000-999999999", label: "$1,000,000+" }
        ]
      },
      {
        key: "bedrooms",
        label: "Bedrooms",
        type: "select",
        icon: "FaBed",
        options: [
          { value: "all", label: "Any" },
          { value: "1", label: "1+" },
          { value: "2", label: "2+" },
          { value: "3", label: "3+" },
          { value: "4", label: "4+" },
          { value: "5", label: "5+" },
          { value: "6", label: "6+" }
        ]
      },
      {
        key: "bathrooms",
        label: "Bathrooms",
        type: "select",
        icon: "FaBath",
        options: [
          { value: "all", label: "Any" },
          { value: "1", label: "1+" },
          { value: "2", label: "2+" },
          { value: "3", label: "3+" },
          { value: "4", label: "4+" },
          { value: "5", label: "5+" }
        ]
      },
      {
        key: "areaRange",
        label: "Area (sq ft)",
        type: "select",
        icon: "FaRulerCombined",
        options: [
          { value: "all", label: "Any Size" },
          { value: "0-500", label: "Up to 500 sq ft" },
          { value: "500-1000", label: "500 - 1,000 sq ft" },
          { value: "1000-1500", label: "1,000 - 1,500 sq ft" },
          { value: "1500-2500", label: "1,500 - 2,500 sq ft" },
          { value: "2500-5000", label: "2,500 - 5,000 sq ft" },
          { value: "5000-999999", label: "5,000+ sq ft" }
        ]
      },
      {
        key: "listingType",
        label: "Listing Type",
        type: "select",
        icon: "FaTag",
        options: [
          { value: "all", label: "All Types" },
          { value: "sale", label: "For Sale" },
          { value: "rent", label: "For Rent" },
          { value: "lease", label: "For Lease" }
        ]
      },
      {
        key: "location",
        label: "Location",
        type: "location",
        icon: "MdLocationOn"
      }
    ],
    sortOptions: [
      { value: "newest", label: "Newest First" },
      { value: "oldest", label: "Oldest First" },
      { value: "price_low", label: "Price: Low to High" },
      { value: "price_high", label: "Price: High to Low" },
      { value: "size_low", label: "Size: Small to Large" },
      { value: "size_high", label: "Size: Large to Small" }
    ]
  },

  // Business for Sale
  business: {
    filters: [
      {
        key: "businessType",
        label: "Business Type",
        type: "select",
        icon: "FaBriefcase",
        options: [
          { value: "all", label: "All Types" },
          { value: "retail", label: "Retail" },
          { value: "restaurant", label: "Restaurant" },
          { value: "service", label: "Service" },
          { value: "manufacturing", label: "Manufacturing" },
          { value: "tech", label: "Technology" },
          { value: "consulting", label: "Consulting" },
          { value: "franchise", label: "Franchise" },
          { value: "ecommerce", label: "E-commerce" },
          { value: "wholesale", label: "Wholesale" }
        ]
      },
      {
        key: "priceRange",
        label: "Price Range",
        type: "select",
        icon: "FaDollarSign",
        options: [
          { value: "all", label: "All Ranges" },
          { value: "0-25000", label: "$0 - $25,000" },
          { value: "25000-50000", label: "$25,000 - $50,000" },
          { value: "50000-100000", label: "$50,000 - $100,000" },
          { value: "100000-250000", label: "$100,000 - $250,000" },
          { value: "250000-500000", label: "$250,000 - $500,000" },
          { value: "500000-999999999", label: "$500,000+" }
        ]
      },
      {
        key: "revenueRange",
        label: "Annual Revenue",
        type: "select",
        icon: "FaChartLine",
        options: [
          { value: "all", label: "Any Revenue" },
          { value: "0-50000", label: "Up to $50,000" },
          { value: "50000-100000", label: "$50,000 - $100,000" },
          { value: "100000-250000", label: "$100,000 - $250,000" },
          { value: "250000-500000", label: "$250,000 - $500,000" },
          { value: "500000-1000000", label: "$500,000 - $1,000,000" },
          { value: "1000000-999999999", label: "$1,000,000+" }
        ]
      },
      {
        key: "established",
        label: "Years Established",
        type: "select",
        icon: "FaCalendar",
        options: [
          { value: "all", label: "Any Age" },
          { value: "0-1", label: "New (0-1 years)" },
          { value: "1-3", label: "1-3 years" },
          { value: "3-5", label: "3-5 years" },
          { value: "5-10", label: "5-10 years" },
          { value: "10-999", label: "10+ years" }
        ]
      },
      {
        key: "employees",
        label: "Number of Employees",
        type: "select",
        icon: "FaUsers",
        options: [
          { value: "all", label: "Any Size" },
          { value: "1", label: "1 employee" },
          { value: "2-5", label: "2-5 employees" },
          { value: "6-10", label: "6-10 employees" },
          { value: "11-25", label: "11-25 employees" },
          { value: "26-50", label: "26-50 employees" },
          { value: "51-999", label: "50+ employees" }
        ]
      },
      {
        key: "location",
        label: "Location",
        type: "location",
        icon: "MdLocationOn"
      }
    ],
    sortOptions: [
      { value: "newest", label: "Newest First" },
      { value: "oldest", label: "Oldest First" },
      { value: "price_low", label: "Price: Low to High" },
      { value: "price_high", label: "Price: High to Low" },
      { value: "revenue_high", label: "Revenue: High to Low" }
    ]
  },

  // Vehicles
  vehicles: {
    filters: [
      {
        key: "vehicleType",
        label: "Vehicle Type",
        type: "select",
        icon: "FaCar",
        options: [
          { value: "all", label: "All Types" },
          { value: "car", label: "Cars" },
          { value: "truck", label: "Trucks" },
          { value: "suv", label: "SUVs" },
          { value: "motorcycle", label: "Motorcycles" },
          { value: "van", label: "Vans" },
          { value: "bus", label: "Buses" },
          { value: "boat", label: "Boats" }
        ]
      },
      {
        key: "make",
        label: "Make",
        type: "select",
        icon: "FaIndustry",
        options: [
          { value: "all", label: "All Makes" },
          { value: "toyota", label: "Toyota" },
          { value: "honda", label: "Honda" },
          { value: "ford", label: "Ford" },
          { value: "chevrolet", label: "Chevrolet" },
          { value: "bmw", label: "BMW" },
          { value: "mercedes", label: "Mercedes-Benz" },
          { value: "audi", label: "Audi" },
          { value: "nissan", label: "Nissan" },
          { value: "volkswagen", label: "Volkswagen" }
        ]
      },
      {
        key: "year",
        label: "Year",
        type: "select",
        icon: "FaCalendar",
        options: [
          { value: "all", label: "Any Year" },
          { value: "2024", label: "2024" },
          { value: "2023", label: "2023" },
          { value: "2022", label: "2022" },
          { value: "2021", label: "2021" },
          { value: "2020", label: "2020" },
          { value: "2019", label: "2019" },
          { value: "2018", label: "2018" },
          { value: "older", label: "2017 or older" }
        ]
      },
      {
        key: "priceRange",
        label: "Price Range",
        type: "select",
        icon: "FaDollarSign",
        options: [
          { value: "all", label: "All Ranges" },
          { value: "0-5000", label: "$0 - $5,000" },
          { value: "5000-10000", label: "$5,000 - $10,000" },
          { value: "10000-20000", label: "$10,000 - $20,000" },
          { value: "20000-35000", label: "$20,000 - $35,000" },
          { value: "35000-50000", label: "$35,000 - $50,000" },
          { value: "50000-999999999", label: "$50,000+" }
        ]
      },
      {
        key: "mileage",
        label: "Mileage",
        type: "select",
        icon: "FaTachometerAlt",
        options: [
          { value: "all", label: "Any Mileage" },
          { value: "0-10000", label: "Under 10,000 miles" },
          { value: "10000-30000", label: "10,000 - 30,000 miles" },
          { value: "30000-50000", label: "30,000 - 50,000 miles" },
          { value: "50000-75000", label: "50,000 - 75,000 miles" },
          { value: "75000-100000", label: "75,000 - 100,000 miles" },
          { value: "100000-999999", label: "100,000+ miles" }
        ]
      },
      {
        key: "condition",
        label: "Condition",
        type: "select",
        icon: "FaCheckCircle",
        options: [
          { value: "all", label: "All Conditions" },
          { value: "new", label: "New" },
          { value: "like-new", label: "Like New" },
          { value: "excellent", label: "Excellent" },
          { value: "good", label: "Good" },
          { value: "fair", label: "Fair" }
        ]
      },
      {
        key: "location",
        label: "Location",
        type: "location",
        icon: "MdLocationOn"
      }
    ],
    sortOptions: [
      { value: "newest", label: "Newest First" },
      { value: "oldest", label: "Oldest First" },
      { value: "price_low", label: "Price: Low to High" },
      { value: "price_high", label: "Price: High to Low" },
      { value: "mileage_low", label: "Mileage: Low to High" },
      { value: "year_new", label: "Year: Newest First" }
    ]
  },

  // Books
  books: {
    filters: [
      {
        key: "bookCategory",
        label: "Book Category",
        type: "select",
        icon: "FaBook",
        options: [
          { value: "all", label: "All Categories" },
          { value: "fiction", label: "Fiction" },
          { value: "non-fiction", label: "Non-Fiction" },
          { value: "academic", label: "Academic" },
          { value: "children", label: "Children's Books" },
          { value: "business", label: "Business" },
          { value: "self-help", label: "Self-Help" },
          { value: "biography", label: "Biography" },
          { value: "science", label: "Science & Technology" },
          { value: "arts", label: "Arts & Literature" }
        ]
      },
      {
        key: "priceRange",
        label: "Price Range",
        type: "select",
        icon: "FaDollarSign",
        options: [
          { value: "all", label: "All Ranges" },
          { value: "0-10", label: "$0 - $10" },
          { value: "10-25", label: "$10 - $25" },
          { value: "25-50", label: "$25 - $50" },
          { value: "50-100", label: "$50 - $100" },
          { value: "100-999999", label: "$100+" }
        ]
      },
      {
        key: "bookCondition",
        label: "Condition",
        type: "select",
        icon: "FaCheckCircle",
        options: [
          { value: "all", label: "All Conditions" },
          { value: "new", label: "New" },
          { value: "like-new", label: "Like New" },
          { value: "very-good", label: "Very Good" },
          { value: "good", label: "Good" },
          { value: "acceptable", label: "Acceptable" }
        ]
      },
      {
        key: "format",
        label: "Format",
        type: "select",
        icon: "FaFile",
        options: [
          { value: "all", label: "All Formats" },
          { value: "hardcover", label: "Hardcover" },
          { value: "paperback", label: "Paperback" },
          { value: "ebook", label: "E-book" },
          { value: "audiobook", label: "Audiobook" }
        ]
      },
      {
        key: "language",
        label: "Language",
        type: "select",
        icon: "FaLanguage",
        options: [
          { value: "all", label: "All Languages" },
          { value: "english", label: "English" },
          { value: "spanish", label: "Spanish" },
          { value: "french", label: "French" },
          { value: "german", label: "German" },
          { value: "chinese", label: "Chinese" },
          { value: "japanese", label: "Japanese" },
          { value: "other", label: "Other" }
        ]
      },
      {
        key: "location",
        label: "Location",
        type: "location",
        icon: "MdLocationOn"
      }
    ],
    sortOptions: [
      { value: "relevance", label: "Most Relevant" },
      { value: "newest", label: "Newest First" },
      { value: "oldest", label: "Oldest First" },
      { value: "price_low", label: "Price: Low to High" },
      { value: "price_high", label: "Price: High to Low" },
      { value: "title", label: "Title: A-Z" },
      { value: "rating", label: "Highest Rated" }
    ]
  },

  // Technology
  technology: {
    filters: [
      {
        key: "techCategory",
        label: "Tech Category",
        type: "select",
        icon: "FaLaptop",
        options: [
          { value: "all", label: "All Categories" },
          { value: "computers", label: "Computers & Laptops" },
          { value: "smartphones", label: "Smartphones & Tablets" },
          { value: "electronics", label: "Electronics & Gadgets" },
          { value: "software", label: "Software & Apps" },
          { value: "gaming", label: "Gaming & Consoles" },
          { value: "accessories", label: "Accessories & Peripherals" }
        ]
      },
      {
        key: "priceRange",
        label: "Price Range",
        type: "select",
        icon: "FaDollarSign",
        options: [
          { value: "all", label: "All Ranges" },
          { value: "0-100", label: "$0 - $100" },
          { value: "100-500", label: "$100 - $500" },
          { value: "500-1000", label: "$500 - $1,000" },
          { value: "1000-2000", label: "$1,000 - $2,000" },
          { value: "2000-999999", label: "$2,000+" }
        ]
      },
      {
        key: "condition",
        label: "Condition",
        type: "select",
        icon: "FaCheckCircle",
        options: [
          { value: "all", label: "All Conditions" },
          { value: "new", label: "New" },
          { value: "like-new", label: "Like New" },
          { value: "excellent", label: "Excellent" },
          { value: "good", label: "Good" },
          { value: "fair", label: "Fair" }
        ]
      },
      {
        key: "brand",
        label: "Brand",
        type: "select",
        icon: "FaIndustry",
        options: [
          { value: "all", label: "All Brands" },
          { value: "apple", label: "Apple" },
          { value: "samsung", label: "Samsung" },
          { value: "dell", label: "Dell" },
          { value: "hp", label: "HP" },
          { value: "lenovo", label: "Lenovo" },
          { value: "sony", label: "Sony" },
          { value: "microsoft", label: "Microsoft" },
          { value: "lg", label: "LG" },
          { value: "other", label: "Other" }
        ]
      },
      {
        key: "location",
        label: "Location",
        type: "location",
        icon: "MdLocationOn"
      }
    ],
    sortOptions: [
      { value: "newest", label: "Newest First" },
      { value: "oldest", label: "Oldest First" },
      { value: "price_low", label: "Price: Low to High" },
      { value: "price_high", label: "Price: High to Low" },
      { value: "relevance", label: "Most Relevant" }
    ]
  },

  // General Classifieds
  classifieds: {
    filters: [
      {
        key: "category",
        label: "Category",
        type: "select",
        icon: "FaTags",
        options: [
          { value: "all", label: "All Categories" },
          { value: "electronics", label: "Electronics" },
          { value: "furniture", label: "Furniture" },
          { value: "clothing", label: "Clothing & Accessories" },
          { value: "sports", label: "Sports & Outdoors" },
          { value: "toys", label: "Toys & Games" },
          { value: "home-garden", label: "Home & Garden" },
          { value: "pets", label: "Animals and Pets" },
          { value: "health-beauty", label: "Health & Beauty" },
          { value: "other", label: "Other" }
        ]
      },
      {
        key: "priceRange",
        label: "Price Range",
        type: "select",
        icon: "FaDollarSign",
        options: [
          { value: "all", label: "All Ranges" },
          { value: "0-25", label: "$0 - $25" },
          { value: "25-50", label: "$25 - $50" },
          { value: "50-100", label: "$50 - $100" },
          { value: "100-250", label: "$100 - $250" },
          { value: "250-999999", label: "$250+" }
        ]
      },
      {
        key: "condition",
        label: "Condition",
        type: "select",
        icon: "FaCheckCircle",
        options: [
          { value: "all", label: "All Conditions" },
          { value: "new", label: "New" },
          { value: "like-new", label: "Like New" },
          { value: "excellent", label: "Excellent" },
          { value: "good", label: "Good" },
          { value: "fair", label: "Fair" }
        ]
      },
      {
        key: "location",
        label: "Location",
        type: "location",
        icon: "MdLocationOn"
      }
    ],
    sortOptions: [
      { value: "newest", label: "Newest First" },
      { value: "oldest", label: "Oldest First" },
      { value: "price_low", label: "Price: Low to High" },
      { value: "price_high", label: "Price: High to Low" }
    ]
  }
};

// Helper function to get filter configuration for a category
export const getCategoryFilters = (categoryType) => {
  return CATEGORY_FILTERS[categoryType] || CATEGORY_FILTERS.classifieds;
};

// Helper function to get all available categories
export const getAvailableCategories = () => {
  return Object.keys(CATEGORY_FILTERS);
};
