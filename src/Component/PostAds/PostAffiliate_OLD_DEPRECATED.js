import React, { useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { FaDollarSign, FaLink, FaTag, FaClock, FaCreditCard, FaChartLine, FaGift, FaEye } from "react-icons/fa";
import { createAffiliate } from "../../slice/AffiliateSLice";
import toast from "react-hot-toast";
import Subscription from "../Subscription";

function PostAffiliate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const initialFormState = {
    title: "",
    company: "",
    category: "",
    description: "",
    commissionType: "percentage", // percentage or fixed
    commissionValue: "",
    cookieDuration: "30",
    paymentMethod: "paypal",
    minPayout: "50",
    affiliateLink: "",
    imageUrl: null,
    position: "top",
    link: "",
    // Additional fields for enhanced tracking
    trackingMethod: "cookie", // cookie, pixel, postback
    conversionWindow: "30", // days
    recurringCommission: false,
    recurringDuration: "12", // months
    tieredCommission: false,
    bonusConditions: "",
    restrictions: "",
    promotionalMaterials: false,
    deepLinking: false,
    subAffiliateTracking: false
  };

  const [formState, setFormState] = useState(initialFormState);
  const [activeInput, setActiveInput] = useState(null);
  const [screen, setScreen] = useState("form");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Affiliate categories
  const categories = [
    { value: "ecommerce", label: "E-commerce & Shopping" },
    { value: "software", label: "Software & SaaS" },
    { value: "education", label: "Education & Courses" },
    { value: "finance", label: "Finance & Banking" },
    { value: "health", label: "Health & Wellness" },
    { value: "travel", label: "Travel & Hospitality" },
    { value: "gaming", label: "Gaming & Entertainment" },
    { value: "beauty", label: "Beauty & Fashion" },
    { value: "technology", label: "Technology & Gadgets" },
    { value: "business", label: "Business & B2B" },
    { value: "other", label: "Other" }
  ];

  // Payment methods
  const paymentMethods = [
    { value: "paypal", label: "PayPal" },
    { value: "stripe", label: "Stripe" },
    { value: "wire", label: "Wire Transfer" },
    { value: "check", label: "Check" },
    { value: "crypto", label: "Cryptocurrency" },
    { value: "bank", label: "Direct Bank Transfer" }
  ];

  const handleInputFocus = (inputName) => {
    setActiveInput(inputName);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formState.title.trim()) newErrors.title = "Title is required";
    if (!formState.company.trim()) newErrors.company = "Company name is required";
    if (!formState.category) newErrors.category = "Category is required";
    if (!formState.description.trim()) newErrors.description = "Description is required";
    if (!formState.commissionValue) newErrors.commissionValue = "Commission value is required";
    if (!formState.affiliateLink.trim()) newErrors.affiliateLink = "Affiliate link is required";
    
    // Validate URL format
    try {
      new URL(formState.affiliateLink);
    } catch {
      newErrors.affiliateLink = "Please enter a valid URL";
    }
    
    // Validate commission value
    const commissionValue = parseFloat(formState.commissionValue);
    if (isNaN(commissionValue) || commissionValue <= 0) {
      newErrors.commissionValue = "Commission must be a positive number";
    }
    
    if (formState.commissionType === "percentage" && commissionValue > 100) {
      newErrors.commissionValue = "Percentage commission cannot exceed 100%";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    
    if (type === "file") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState({
          ...formState,
          [name]: reader.result,
        });
      };
      reader.readAsDataURL(files[0]);
    } else if (type === "checkbox") {
      setFormState({
        ...formState,
        [name]: checked,
      });
    } else {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setTimeout(() => {
      setScreen("pricing");
    }, 100);
  };

  const onSubmit = async (item) => {
    try {
      setIsSubmitting(true);
      
      const affiliateData = {
        ...formState,
        package: item,
        package_id: item.package_id,
        // Calculate estimated earnings based on commission
        estimatedEarnings: calculateEstimatedEarnings(),
        // Add metadata for tracking
        postedAt: new Date().toISOString(),
        status: "active"
      };
      
      await dispatch(createAffiliate({
        formData: affiliateData,
      })).unwrap();
      
      toast.success("Your affiliate program has been created successfully!");
      navigate("/affiliate-ads");
    } catch (error) {
      console.error("Error creating affiliate:", error);
      toast.error("Failed to create affiliate program. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEstimatedEarnings = () => {
    const commissionValue = parseFloat(formState.commissionValue);
    
    if (formState.commissionType === "percentage") {
      // Estimate based on average order value (you might want to make this configurable)
      const avgOrderValue = 100; // Default assumption
      return (avgOrderValue * commissionValue / 100).toFixed(2);
    } else {
      return commissionValue.toFixed(2);
    }
  };

  const generatePreviewLink = () => {
    if (formState.affiliateLink) {
      try {
        const url = new URL(formState.affiliateLink);
        // Add demo referral code for preview
        url.searchParams.set('ref', 'DEMO123');
        return url.toString();
      } catch {
        return formState.affiliateLink;
      }
    }
    return "#";
  };

  const getCommissionDisplay = () => {
    const value = formState.commissionValue;
    if (formState.commissionType === "percentage") {
      return `${value}%`;
    } else {
      return `$${value}`;
    }
  };

  return (
    <div>
      <Navbar />
      {screen === "form" && (
        <>
          <div
            className="w-full bg-cover bg-center"
            style={{ backgroundImage: `url(/img/form-bg-1.jpg)` }}
          >
            <div className="pt-32 lg:pt-20 w-full flex flex-col justify-center items-center gap-5 bg-black bg-opacity-50">
              <form
                className="w-11/12 md:w-8/12 lg:w-6/12 bg-white p-6 rounded-lg shadow-xl"
                onSubmit={handleSubmit}
              >
                <div className="border-2 border-slate-300 shadow-lg p-6">
                  <div className="text-[#234777] text-4xl font-bold py-4 text-center">
                    Create Affiliate Program
                  </div>
                  <div className="text-center text-gray-600 mb-6">
                    Post your affiliate program and start attracting promoters
                  </div>
                  <hr className="mb-6" />
                  
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="py-2 text-[#234777] font-semibold flex items-center gap-2">
                          <FaTag className="text-sm" />
                          Program Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formState.title}
                          placeholder="e.g., Premium Software Affiliate"
                          onFocus={() => handleInputFocus("title")}
                          onBlur={handleInputBlur}
                          onChange={handleChange}
                          className={`w-full p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.title ? "border-red-500" : "border-gray-300"
                          } ${activeInput === "title" ? "ring-2 ring-blue-500" : ""}`}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                      </div>

                      <div>
                        <label className="py-2 text-[#234777] font-semibold flex items-center gap-2">
                          <FaLink className="text-sm" />
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formState.company}
                          placeholder="e.g., TechCorp Inc."
                          onFocus={() => handleInputFocus("company")}
                          onBlur={handleInputBlur}
                          onChange={handleChange}
                          className={`w-full p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.company ? "border-red-500" : "border-gray-300"
                          } ${activeInput === "company" ? "ring-2 ring-blue-500" : ""}`}
                        />
                        {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="py-2 text-[#234777] font-semibold">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formState.category}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.category ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    <div>
                      <label className="py-2 text-[#234777] font-semibold">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formState.description}
                        placeholder="Describe your affiliate program, target audience, and what makes it attractive..."
                        rows={4}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.description ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Commission Structure */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-[#234777] mb-4 flex items-center gap-2">
                        <FaDollarSign />
                        Commission Structure
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="py-2 text-[#234777] font-semibold">
                            Commission Type *
                          </label>
                          <select
                            name="commissionType"
                            value={formState.commissionType}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount ($)</option>
                          </select>
                        </div>

                        <div>
                          <label className="py-2 text-[#234777] font-semibold">
                            Commission Value *
                          </label>
                          <input
                            type="number"
                            name="commissionValue"
                            value={formState.commissionValue}
                            placeholder={formState.commissionType === "percentage" ? "e.g., 15" : "e.g., 25"}
                            step={formState.commissionType === "percentage" ? "0.1" : "1"}
                            min="0"
                            max={formState.commissionType === "percentage" ? "100" : ""}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.commissionValue ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {errors.commissionValue && <p className="text-red-500 text-sm mt-1">{errors.commissionValue}</p>}
                          <p className="text-sm text-gray-600 mt-1">
                            Commission: {getCommissionDisplay()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="recurringCommission"
                            checked={formState.recurringCommission}
                            onChange={handleChange}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm font-medium">Recurring Commission</span>
                        </label>
                        
                        {formState.recurringCommission && (
                          <div className="flex items-center gap-2">
                            <label className="text-sm">for</label>
                            <input
                              type="number"
                              name="recurringDuration"
                              value={formState.recurringDuration}
                              min="1"
                              max="60"
                              onChange={handleChange}
                              className="w-16 p-1 border rounded text-center"
                            />
                            <span className="text-sm">months</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tracking & Payment */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-[#234777] mb-4 flex items-center gap-2">
                        <FaChartLine />
                        Tracking & Payment
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="py-2 text-[#234777] font-semibold flex items-center gap-2">
                            <FaClock className="text-sm" />
                            Cookie Duration (days)
                          </label>
                          <select
                            name="cookieDuration"
                            value={formState.cookieDuration}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="7">7 days</option>
                            <option value="14">14 days</option>
                            <option value="30">30 days</option>
                            <option value="60">60 days</option>
                            <option value="90">90 days</option>
                            <option value="365">365 days</option>
                          </select>
                        </div>

                        <div>
                          <label className="py-2 text-[#234777] font-semibold flex items-center gap-2">
                            <FaCreditCard className="text-sm" />
                            Payment Method
                          </label>
                          <select
                            name="paymentMethod"
                            value={formState.paymentMethod}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {paymentMethods.map((method) => (
                              <option key={method.value} value={method.value}>
                                {method.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="py-2 text-[#234777] font-semibold">
                          Minimum Payout ($)
                        </label>
                        <input
                          type="number"
                          name="minPayout"
                          value={formState.minPayout}
                          placeholder="e.g., 50"
                          min="1"
                          onChange={handleChange}
                          className="w-full p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Affiliate Link */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-[#234777] mb-4 flex items-center gap-2">
                        <FaLink />
                        Affiliate Link
                      </h3>
                      
                      <div>
                        <label className="py-2 text-[#234777] font-semibold">
                          Affiliate Registration Link *
                        </label>
                        <input
                          type="url"
                          name="affiliateLink"
                          value={formState.affiliateLink}
                          placeholder="https://yourprogram.com/affiliate/signup"
                          onChange={handleChange}
                          className={`w-full p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.affiliateLink ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.affiliateLink && <p className="text-red-500 text-sm mt-1">{errors.affiliateLink}</p>}
                        <p className="text-sm text-gray-600 mt-1">
                          This is where potential affiliates will sign up for your program
                        </p>
                      </div>
                    </div>

                    {/* Program Preview */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-[#234777] mb-4 flex items-center gap-2">
                        <FaEye />
                        Program Preview
                      </h3>
                      
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-4">
                          {formState.imageUrl && (
                            <img 
                              src={formState.imageUrl} 
                              alt={formState.title}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900">
                              {formState.title || "Program Title"}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {formState.company || "Company Name"}
                            </p>
                            <p className="text-sm text-gray-700 mb-3">
                              {formState.description || "Program description will appear here..."}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                                {getCommissionDisplay()} Commission
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {formState.cookieDuration} days cookie
                              </span>
                              {formState.recurringCommission && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                  Recurring
                                </span>
                              )}
                              {formState.promotionalMaterials && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  Materials Provided
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500">
                                Min payout: ${formState.minPayout}
                              </div>
                              <button
                                onClick={() => {
                                  if (generatePreviewLink() !== "#") {
                                    window.open(generatePreviewLink(), '_blank');
                                  }
                                }}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                Preview Link
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Program Image */}
                    <div>
                      <label className="py-2 text-[#234777] font-semibold">
                        Program Image (Optional)
                      </label>
                      <input
                        type="file"
                        name="imageUrl"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Upload an image to represent your affiliate program
                      </p>
                    </div>

                    {/* Additional Features */}
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-[#234777] mb-4 flex items-center gap-2">
                        <FaGift />
                        Additional Features
                      </h3>
                      
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="promotionalMaterials"
                            checked={formState.promotionalMaterials}
                            onChange={handleChange}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm font-medium">Provide promotional materials</span>
                        </label>
                        
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="deepLinking"
                            checked={formState.deepLinking}
                            onChange={handleChange}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm font-medium">Support deep linking</span>
                        </label>
                        
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="subAffiliateTracking"
                            checked={formState.subAffiliateTracking}
                            onChange={handleChange}
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm font-medium">Sub-affiliate tracking</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex gap-4 py-6 text-center">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="flex-1 bg-gray-600 rounded-xl text-lg font-semibold py-3 text-white hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <BsFillArrowLeftCircleFill />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-900 rounded-xl text-lg font-semibold py-3 text-white hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Processing..." : "Continue to Pricing"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <Footer />
        </>
      )}
      {screen === "pricing" && (
        <Subscription
          data={formState}
          postType={"affiliate"}
          onBack={() => setScreen("form")}
          onSubmit={(item) => {
            onSubmit(item);
          }}
        />
      )}
    </div>
  );
}

export default PostAffiliate;
