import React, { useState } from "react";
import { 
  FaPlus, 
  FaDollarSign, 
  FaTag, 
  FaFileAlt, 
  FaImage,
  FaCheckCircle,
  FaTimes,
  FaEye
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
// import AffiliateServices from "../../services/AffiliateServices"; // Commented out as unused
import toast from "react-hot-toast";

const PostAffiliateProgram = ({ className = "" }) => {
  // const dispatch = useDispatch(); // Commented out as unused
  const { userDetail } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  
  const [programData, setProgramData] = useState({
    // Basic Information
    title: "",
    company: userDetail?.businessName || "",
    category: "",
    subcategory: "",
    description: "",
    longDescription: "",
    
    // Affiliate Details
    affiliateLink: "",
    commissionType: "percentage",
    commissionValue: "",
    recurringCommission: false,
    recurringDuration: "12",
    cookieDuration: "30",
    
    // Product/Service Details
    productType: "digital",
    priceRange: "",
    targetAudience: "",
    benefits: [""],
    requirements: [""],
    
    // Visuals
    bannerImage: "",
    logoImage: "",
    additionalImages: [""],
    
    // Contact & Support
    supportEmail: userDetail?.email || "",
    supportPhone: "",
    website: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: ""
    },
    
    // Settings
    status: "active",
    featured: false,
    startDate: "",
    endDate: "",
    
    // Agreement
    agreeToTerms: false,
    agreeToGuidelines: false
  });

  const categories = [
    {
      id: "technology",
      name: "Technology & Software",
      subcategories: ["SaaS", "Mobile Apps", "Web Tools", "AI/ML", "Cybersecurity", "Development Tools"]
    },
    {
      id: "ecommerce",
      name: "E-commerce & Retail",
      subcategories: ["Fashion", "Electronics", "Home & Garden", "Health & Beauty", "Sports", "Toys"]
    },
    {
      id: "education",
      name: "Education & Learning",
      subcategories: ["Online Courses", "Tutorials", "Certifications", "Language Learning", "Skills Training"]
    },
    {
      id: "finance",
      name: "Finance & Investment",
      subcategories: ["Banking", "Investment", "Insurance", "Cryptocurrency", "Trading", "Loans"]
    },
    {
      id: "health",
      name: "Health & Wellness",
      subcategories: ["Fitness", "Nutrition", "Mental Health", "Supplements", "Medical Services"]
    },
    {
      id: "travel",
      name: "Travel & Hospitality",
      subcategories: ["Hotels", "Flights", "Car Rental", "Vacation Packages", "Travel Insurance"]
    },
    {
      id: "entertainment",
      name: "Entertainment & Media",
      subcategories: ["Streaming", "Gaming", "Music", "Books", "Events", "Magazines"]
    },
    {
      id: "business",
      name: "Business & B2B",
      subcategories: ["Marketing", "Consulting", "Software", "Services", "Office Supplies"]
    },
    {
      id: "lifestyle",
      name: "Lifestyle & Home",
      subcategories: ["Home Decor", "Food & Drink", "Pets", "Hobbies", "Personal Care"]
    },
    {
      id: "other",
      name: "Other Categories",
      subcategories: ["Non-profit", "Religious", "Political", "Adult", "Miscellaneous"]
    }
  ];

  const steps = [
    { id: 1, title: "Basic Information", icon: <FaFileAlt /> },
    { id: 2, title: "Commission Details", icon: <FaDollarSign /> },
    { id: 3, title: "Product Details", icon: <FaTag /> },
    { id: 4, title: "Visual Assets", icon: <FaImage /> },
    { id: 5, title: "Review & Submit", icon: <FaCheckCircle /> }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProgramData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProgramData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setProgramData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setProgramData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayItem = (field, index) => {
    setProgramData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 1:
        if (!programData.title.trim()) errors.title = "Program title is required";
        if (!programData.company.trim()) errors.company = "Company name is required";
        if (!programData.category) errors.category = "Category is required";
        if (!programData.description.trim()) errors.description = "Description is required";
        break;
        
      case 2:
        if (!programData.affiliateLink.trim()) errors.affiliateLink = "Affiliate link is required";
        if (!programData.commissionValue) errors.commissionValue = "Commission value is required";
        if (!programData.cookieDuration) errors.cookieDuration = "Cookie duration is required";
        break;
        
      case 3:
        if (!programData.productType) errors.productType = "Product type is required";
        if (!programData.targetAudience.trim()) errors.targetAudience = "Target audience is required";
        if (programData.benefits.filter(b => b.trim()).length === 0) {
          errors.benefits = "Add at least one benefit";
        }
        break;
        
      case 4:
        // Visual assets are optional but should validate URLs if provided
        if (programData.bannerImage && !isValidUrl(programData.bannerImage)) {
          errors.bannerImage = "Invalid banner image URL";
        }
        break;
        
      case 5:
        if (!programData.agreeToTerms) errors.agreeToTerms = "You must agree to the terms";
        if (!programData.agreeToGuidelines) errors.agreeToGuidelines = "You must agree to the guidelines";
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const nextStep = () => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      Object.values(errors).forEach(error => toast.error(error));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitProgram = async () => {
    try {
      setLoading(true);
      
      // const submissionData = { // Commented out as unused
      //   ...programData,
      //   userId: userDetail?.id,
      //   submittedAt: new Date().toISOString(),
      //   benefits: programData.benefits.filter(b => b.trim()),
      //   requirements: programData.requirements.filter(r => r.trim()),
      //   additionalImages: programData.additionalImages.filter(img => img.trim())
      // };
      
      // In production, replace with actual API call
      // await AffiliateServices.postAffiliateProgram(submissionData);
      
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Affiliate program posted successfully!");
      
      // Reset form or redirect
      // Reset to step 1 for new posting
      setCurrentStep(1);
      setProgramData({
        ...programData,
        title: "",
        description: "",
        affiliateLink: "",
        commissionValue: "",
        benefits: [""],
        requirements: [""],
        agreeToTerms: false,
        agreeToGuidelines: false
      });
      
    } catch (error) {
      console.error("Error submitting program:", error);
      toast.error("Failed to submit program. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program Title *</label>
                <input
                  type="text"
                  value={programData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Premium Software Affiliate Program"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  value={programData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your company name"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={programData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                <select
                  value={programData.subcategory}
                  onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!programData.category}
                >
                  <option value="">Select a subcategory</option>
                  {programData.category && categories.find(cat => cat.id === programData.category)?.subcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
              <textarea
                value={programData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of your affiliate program (max 200 characters)"
              />
              <p className="text-sm text-gray-500 mt-1">{programData.description.length}/200 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Long Description</label>
              <textarea
                value={programData.longDescription}
                onChange={(e) => handleInputChange('longDescription', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description of your program, products, and what affiliates can expect"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Commission Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Affiliate Link *</label>
              <input
                type="url"
                value={programData.affiliateLink}
                onChange={(e) => handleInputChange('affiliateLink', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://youraffiliate.link/program"
              />
              <p className="text-sm text-gray-500 mt-1">The link affiliates will use to promote your products</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commission Type *</label>
                <select
                  value={programData.commissionType}
                  onChange={(e) => handleInputChange('commissionType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                  <option value="hybrid">Hybrid (% + $)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commission Value *</label>
                <input
                  type="number"
                  value={programData.commissionValue}
                  onChange={(e) => handleInputChange('commissionValue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={programData.commissionType === 'percentage' ? 'e.g., 15' : 'e.g., 50'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cookie Duration (days) *</label>
                <select
                  value={programData.cookieDuration}
                  onChange={(e) => handleInputChange('cookieDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="365">365 days</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={programData.recurringCommission}
                  onChange={(e) => handleInputChange('recurringCommission', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Recurring Commission</span>
              </label>
              
              {programData.recurringCommission && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recurring Duration</label>
                  <select
                    value={programData.recurringDuration}
                    onChange={(e) => handleInputChange('recurringDuration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">1 month</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                <input
                  type="email"
                  value={programData.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="affiliates@yourcompany.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={programData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Type *</label>
                <select
                  value={programData.productType}
                  onChange={(e) => handleInputChange('productType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="digital">Digital Product</option>
                  <option value="physical">Physical Product</option>
                  <option value="service">Service</option>
                  <option value="subscription">Subscription</option>
                  <option value="course">Online Course</option>
                  <option value="software">Software</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={programData.priceRange}
                  onChange={(e) => handleInputChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select price range</option>
                  <option value="0-25">$0 - $25</option>
                  <option value="25-50">$25 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100-250">$100 - $250</option>
                  <option value="250-500">$250 - $500</option>
                  <option value="500+">$500+</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience *</label>
              <textarea
                value={programData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your ideal customers and target audience"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Benefits for Affiliates *</label>
              {programData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., High conversion rates, 30-day cookie, dedicated support"
                  />
                  {programData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('benefits', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('benefits')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <FaPlus /> Add Benefit
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements for Affiliates</label>
              {programData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Minimum 1,000 monthly visitors, professional website"
                  />
                  {programData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <FaPlus /> Add Requirement
              </button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Visual Assets</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image URL</label>
              <input
                type="url"
                value={programData.bannerImage}
                onChange={(e) => handleInputChange('bannerImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourcompany.com/banner.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">Recommended size: 1200x400px</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo Image URL</label>
              <input
                type="url"
                value={programData.logoImage}
                onChange={(e) => handleInputChange('logoImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://yourcompany.com/logo.png"
              />
              <p className="text-sm text-gray-500 mt-1">Recommended size: 200x200px</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
              {programData.additionalImages.map((image, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleArrayChange('additionalImages', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional image URL"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('additionalImages', index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('additionalImages')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <FaPlus /> Add Image
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                <input
                  type="tel"
                  value={programData.supportPhone}
                  onChange={(e) => handleInputChange('supportPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={programData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={programData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Review & Submit</h3>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Program Summary</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p><strong>Title:</strong> {programData.title}</p>
                  <p><strong>Company:</strong> {programData.company}</p>
                  <p><strong>Category:</strong> {categories.find(cat => cat.id === programData.category)?.name}</p>
                  <p><strong>Product Type:</strong> {programData.productType}</p>
                  <p><strong>Commission:</strong> {programData.commissionType === 'percentage' ? `${programData.commissionValue}%` : `$${programData.commissionValue}`}</p>
                  {programData.recurringCommission && (
                    <p><strong>Recurring:</strong> {programData.recurringDuration} {programData.recurringDuration === 'lifetime' ? '' : 'months'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <p><strong>Cookie Duration:</strong> {programData.cookieDuration} days</p>
                  <p><strong>Target Audience:</strong> {programData.targetAudience}</p>
                  <p><strong>Benefits:</strong> {programData.benefits.filter(b => b.trim()).length} listed</p>
                  <p><strong>Requirements:</strong> {programData.requirements.filter(r => r.trim()).length} listed</p>
                  <p><strong>Support Email:</strong> {programData.supportEmail}</p>
                  {programData.website && <p><strong>Website:</strong> {programData.website}</p>}
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Affiliate Link Preview</h4>
              <div className="bg-white rounded-md p-4 border border-blue-200">
                <p className="font-mono text-sm break-all">{programData.affiliateLink}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={programData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="rounded text-blue-600 mt-1"
                />
                <span className="text-sm text-gray-700">
                  I agree to the WWA Affiliate Program Terms and Conditions and certify that all information provided is accurate.
                </span>
              </label>
              
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={programData.agreeToGuidelines}
                  onChange={(e) => handleInputChange('agreeToGuidelines', e.target.checked)}
                  className="rounded text-blue-600 mt-1"
                />
                <span className="text-sm text-gray-700">
                  I agree to follow WWA's affiliate marketing guidelines and ethical practices.
                </span>
              </label>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-8 ${className}`}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {step.icon}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-full h-1 mx-2 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step) => (
            <div key={step.id} className="text-xs text-gray-600 text-center w-20">
              {step.title}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex items-center gap-2"
          >
            <FaEye />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          
          {currentStep === steps.length ? (
            <button
              onClick={submitProgram}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  Submit Program
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostAffiliateProgram;
