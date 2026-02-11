import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createJob, updateJob } from "../../slice/JobSlice";
import { createJobUpsell } from "../../slice/UpsellSlice";
import { getCountry, getZone, getFilterCat, getCurrency } from "../../slice/CategorySlice";
import toast from "react-hot-toast";
import {
  FaBriefcase,
  FaDollarSign,
  FaCalendar,
  FaLink,
  FaChevronDown,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Navbar from "../Navbar";
import Footer from "../Footer";
import UpsellSelector from "./UpsellSelector";
import PaymentProcessor from "../Payment/PaymentProcessor";

const JobPostingForm = ({ jobId = null, initialData = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((store) => store.jobs);

  // Check authentication on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to post a job");
        navigate("/Login");
        return;
      }
      
      // Verify token with backend instead of just checking localStorage
      try {
        const api = (await import('../../api')).default;
        await api.get('/v1/auth/user-profile');
        
        // If we get here, token is valid
        console.log('Authentication verified successfully');
      } catch (error) {
        console.error('Authentication verification failed:', error);
        
        // Only clear tokens and redirect for definite auth failures
        if (error.status === 401 || (
          error.response?.status === 401 && 
          !error.preserveAuth
        )) {
          localStorage.removeItem("jwt_token");
          localStorage.removeItem("refresh_token");
          toast.error("Your session has expired. Please login again.");
          navigate("/Login");
        }
        // For other errors (500, network, etc.), preserve the token and let the user continue
      }
    };
    
    checkAuthentication();
  }, [navigate]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company_name: "",
    company_logo: null,
    location_id: "",
    location: "", // For display/search
    country_id: "",
    job_type: "full-time",
    salary_min: "",
    salary_max: "",
    currency_id: "",
    currency: "USD", // For display
    apply_url: "",
    category_id: "",
    category: "", // For display/search
    end_date: "",
    ...initialData,
  });
  
  // Initialize location and category search when initialData is provided
  useEffect(() => {
    if (initialData) {
      if (initialData.location) {
        setLocationSearch(initialData.location);
      }
      if (initialData.category) {
        setCategorySearch(initialData.category);
      }
      if (initialData.country_id) {
        setSelectedCountryId(initialData.country_id);
      }
    }
  }, [initialData]);

  const [selectedUpsells, setSelectedUpsells] = useState({
    featured: false,
    suggested: false,
  });
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  // Location and Category dropdown states
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState("");

  // Refs for click outside detection
  const locationRef = useRef(null);
  const categoryRef = useRef(null);

  // Get data from Redux store - memoized to prevent unnecessary rerenders
  const countriesRaw = useSelector((store) => store.categories?.country?.data?.items);
  const zonesRaw = useSelector((store) => store.categories?.zone?.data?.items);
  const categoriesRaw = useSelector((store) => store.categories?.catFilter?.data?.items);
  const currenciesRaw = useSelector((store) => store.categories?.currency?.data?.items);
  
  const countries = useMemo(() => Array.isArray(countriesRaw) ? countriesRaw : [], [countriesRaw]);
  const zones = useMemo(() => Array.isArray(zonesRaw) ? zonesRaw : [], [zonesRaw]);
  const categories = useMemo(() => Array.isArray(categoriesRaw) ? categoriesRaw : [], [categoriesRaw]);
  const currencies = useMemo(() => Array.isArray(currenciesRaw) ? currenciesRaw : [], [currenciesRaw]);

  const jobTypes = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" },
  ];

  // Load initial data
  useEffect(() => {
    dispatch(getCountry());
    dispatch(getFilterCat());
    dispatch(getCurrency());
  }, [dispatch]);

  // Load zones when country is selected
  useEffect(() => {
    if (selectedCountryId) {
      dispatch(getZone({ country_id: selectedCountryId }));
    }
  }, [selectedCountryId, dispatch]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered locations based on search
  const filteredLocations = useMemo(() => {
    if (!locationSearch.trim()) return [];
    
    const searchLower = locationSearch.toLowerCase();
    const locationList = [];
    
    // Add countries
    countries.forEach((country) => {
      if (country.name?.toLowerCase().includes(searchLower)) {
        locationList.push({ 
          id: country.country_id, 
          name: country.name, 
          type: "country",
          country_id: country.country_id,
        });
      }
    });
    
    // Add zones/cities (filter by selected country if any)
    zones.forEach((zone) => {
      if (zone.zone_name?.toLowerCase().includes(searchLower)) {
        if (!selectedCountryId || zone.country_id === selectedCountryId) {
          locationList.push({ 
            id: zone.zone_id, 
            name: `${zone.zone_name}, ${zone.country_name}`, 
            type: "zone",
            zone_id: zone.zone_id,
            country_id: zone.country_id,
          });
        }
      }
    });
    
    return locationList.slice(0, 10); // Limit to 10 results
  }, [locationSearch, countries, zones, selectedCountryId]);

  // Filtered categories based on search (flatten category tree)
  const filteredCategories = useMemo(() => {
    const searchLower = categorySearch.trim().toLowerCase();
    const categoryList = [];
    
    const flattenCategories = (cats, parentName = "") => {
      cats.forEach((cat) => {
        const fullName = parentName ? `${parentName} > ${cat.name}` : cat.name;
        // If no search, show all; otherwise filter by search
        if (!searchLower || cat.name?.toLowerCase().includes(searchLower)) {
          categoryList.push({
            id: cat.category_id || cat.id,
            name: cat.name,
            fullName: fullName,
            slug: cat.slug,
          });
        }
        if (cat.childs && cat.childs.length > 0) {
          flattenCategories(cat.childs, fullName);
        }
      });
    };
    
    if (categories && categories.length > 0) {
      flattenCategories(categories);
    }
    
    // Limit results to prevent overwhelming UI
    return categoryList.slice(0, 20);
  }, [categorySearch, categories]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      if (!jobId) {
        navigate("/jobs/my-jobs");
      }
    }
    if (error) {
      toast.error(error?.message || "An error occurred");
    }
  }, [message, error, navigate, jobId]);

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = "Job title is required";
      } else if (formData.title.trim().length < 3) {
        newErrors.title = "Job title must be at least 3 characters";
      }
      
      if (!formData.description.trim()) {
        newErrors.description = "Job description is required";
      } else if (formData.description.trim().length < 50) {
        newErrors.description = "Description must be at least 50 characters";
      }
      
      if (!formData.company_name.trim()) {
        newErrors.company_name = "Company name is required";
      }
      
      if (!formData.location_id || formData.location_id === '') {
        newErrors.location = "Location is required. Please select a location from the dropdown.";
      }
      
      if (!formData.category_id || formData.category_id === '') {
        newErrors.category = "Category is required. Please select a category from the dropdown.";
      }
    }
    
    if (step === 2) {
      if (!formData.job_type) {
        newErrors.job_type = "Job type is required";
      }
      
      // Salary validation
      if (formData.salary_min || formData.salary_max) {
        const min = parseFloat(formData.salary_min);
        const max = parseFloat(formData.salary_max);
        
        if (formData.salary_min && (isNaN(min) || min < 0)) {
          newErrors.salary_min = "Minimum salary must be a valid positive number";
        }
        if (formData.salary_max && (isNaN(max) || max < 0)) {
          newErrors.salary_max = "Maximum salary must be a valid positive number";
        }
        if (formData.salary_min && formData.salary_max) {
          if (min > max) {
            newErrors.salary = "Minimum salary cannot be greater than maximum salary";
          }
        }
      }
      
      // URL validation
      if (!formData.apply_url.trim()) {
        newErrors.apply_url = "Apply URL is required";
      } else {
        try {
          const url = new URL(formData.apply_url);
          if (!['http:', 'https:'].includes(url.protocol)) {
            newErrors.apply_url = "URL must start with http:// or https://";
          }
        } catch (e) {
          newErrors.apply_url = "Please enter a valid URL";
        }
      }
      
      // Date validation
      if (formData.end_date) {
        const endDate = new Date(formData.end_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (endDate < today) {
          newErrors.end_date = "End date cannot be in the past";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "company_logo" && files[0]) {
      // Validate file size (max 5MB)
      if (files[0].size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          company_logo: "File size must be less than 5MB",
        }));
        return;
      }
      // Validate file type
      if (!files[0].type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          company_logo: "Please upload an image file",
        }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          company_logo: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      location_id: location.id,
      location: location.name,
      country_id: location.country_id || selectedCountryId,
    }));
    setLocationSearch(location.name);
    setShowLocationDropdown(false);
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: "" }));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category_id: category.id,
      category: category.name,
    }));
    setCategorySearch(category.name);
    setShowCategoryDropdown(false);
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleCountryChange = (countryId) => {
    setSelectedCountryId(countryId);
    if (countryId) {
      dispatch(getZone({ country_id: countryId }));
      // Clear location if country changes
      setFormData((prev) => ({
        ...prev,
        location_id: "",
        location: "",
        country_id: countryId,
      }));
      setLocationSearch("");
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Helper function to calculate total price of selected upsells
  const calculateTotalPrice = () => {
    const upsellPrices = {
      featured: 29.99,
      suggested: 49.99,
    };
    return Object.entries(selectedUpsells).reduce((total, [key, selected]) => {
      return total + (selected && upsellPrices[key] ? upsellPrices[key] : 0);
    }, 0);
  };

  // Helper function to get names of selected upsells
  const getSelectedUpsellNames = () => {
    const upsellNames = {
      featured: "Featured Job",
      suggested: "Suggested Jobs",
    };
    return Object.entries(selectedUpsells)
      .filter(([_, selected]) => selected)
      .map(([key]) => upsellNames[key] || key);
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Complete payment for upsells
      // This would need to be called for each upsell that was created
      // The payment component should handle this
      setPaymentCompleted(true);
      toast.success("Payment successful! Job posted successfully.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.message || "Failed to complete payment");
    }
  };

  // Handle payment errors
  const handlePaymentError = (error) => {
    toast.error(error?.message || "Payment failed. Please try again.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    try {
      // Format payload according to API structure
      // Find currency_id from selected currency
      let currencyId = formData.currency_id;
      if (!currencyId || currencyId === '') {
        const selectedCurrency = currencies.find(
          (curr) => curr.name === formData.currency || 
                   curr.value === formData.currency ||
                   curr.currency_name === formData.currency ||
                   curr.id === formData.currency ||
                   curr.currency_id === formData.currency
        );
        currencyId = selectedCurrency?.currency_id || selectedCurrency?.id || formData.currency;
      }
      
      // Ensure currency_id is a number if provided
      if (currencyId && currencyId !== '') {
        currencyId = Number(currencyId);
        if (isNaN(currencyId)) {
          currencyId = null; // Invalid currency ID
        }
      } else {
        currencyId = null;
      }

      const jobPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category_id: Number(formData.category_id),
        location_id: Number(formData.location_id),
        job_type: formData.job_type,
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        currency_id: currencyId,
        apply_url: formData.apply_url.trim() || null,
        end_date: formData.end_date || null,
        // Optional fields
        ...(formData.company_name && { company_name: formData.company_name.trim() }),
        ...(formData.company_logo && { company_logo: formData.company_logo }),
        // Only include country_id if it's provided
        ...(formData.country_id && { country_id: Number(formData.country_id) }),
        ...(selectedCountryId && !formData.country_id && { country_id: Number(selectedCountryId) }),
      };

      let createdJob;
      if (jobId) {
        createdJob = await dispatch(updateJob({ jobId, jobData: jobPayload })).unwrap();
      } else {
        createdJob = await dispatch(createJob(jobPayload)).unwrap();
      }

      // Get job ID from response - API docs show "id" field
      const newJobId = createdJob?.data?.id || createdJob?.data?.listing_id || createdJob?.id || createdJob?.listing_id || jobId;

      // Handle upsells separately if any are selected
      // API docs: POST /v1/jobs/:id/upsells requires jobId and payload with upsell_type, price, etc.
      if (newJobId && (selectedUpsells.featured || selectedUpsells.suggested)) {
        const upsellPromises = [];
        
        if (selectedUpsells.featured) {
          upsellPromises.push(
            dispatch(createJobUpsell({
              listing_id: newJobId, // Production API uses listing_id
              upsell_type: "featured",
              duration_days: 30, // Default, could be made configurable
            })).unwrap()
          );
        }
        
        if (selectedUpsells.suggested) {
          upsellPromises.push(
            dispatch(createJobUpsell({
              listing_id: newJobId, // Production API uses listing_id
              upsell_type: "suggested",
              duration_days: 30, // Default, could be made configurable
            })).unwrap()
          );
        }

        const upsellResults = await Promise.all(upsellPromises);
        
        // If payment URLs are returned, show payment modal
        const paymentUrls = upsellResults
          .map(result => result?.data?.payment_url || result?.payment_url)
          .filter(Boolean);
        
        if (paymentUrls.length > 0) {
          // Store upsell IDs for payment completion
          // This would need to be handled by the payment component
          toast.success("Job posted successfully! Payment required for upsells.");
          navigate("/dashboard");
        } else {
          toast.success("Job posted successfully!");
          navigate("/dashboard");
        }
      } else {
        toast.success("Job posted successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to save job posting");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        currentStep >= step
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      {step}
                    </div>
                    <span className="ml-2 text-sm font-medium hidden sm:block">
                      {step === 1 ? "Basic Info" : step === 2 ? "Details" : "Upsells"}
                    </span>
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        currentStep > step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="rounded-lg border bg-card p-6 space-y-6">
                <h2 className="text-2xl font-bold">Basic Information</h2>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Job Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border ${
                      errors.title ? "border-destructive" : "border-input"
                    } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                    placeholder="e.g., Senior Software Engineer"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Company Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border ${
                      errors.company_name ? "border-destructive" : "border-input"
                    } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                    placeholder="Company name"
                  />
                  {errors.company_name && (
                    <p className="text-sm text-destructive mt-1">{errors.company_name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Company Logo <span className="text-xs text-muted-foreground font-normal">(Optional, max 5MB)</span>
                  </label>
                  <input
                    type="file"
                    name="company_logo"
                    accept="image/*"
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border ${
                      errors.company_logo ? "border-destructive" : "border-input"
                    } bg-background px-3 py-2 text-sm`}
                  />
                  {errors.company_logo && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <FaExclamationCircle className="h-3 w-3" />
                      {errors.company_logo}
                    </p>
                  )}
                  {formData.company_logo && !errors.company_logo && (
                    <div className="mt-3">
                      <img
                        src={formData.company_logo}
                        alt="Company logo preview"
                        className="h-24 w-24 object-cover rounded-lg border border-input"
                      />
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <FaCheckCircle className="h-3 w-3" />
                        Logo uploaded successfully
                      </p>
                    </div>
                  )}
                </div>

                {/* Location Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Location <span className="text-destructive">*</span>
                  </label>
                  
                  {/* Country Dropdown */}
                  <div className="mb-3">
                    <label className="text-xs text-muted-foreground mb-1 block">Country (Optional - helps filter cities)</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={selectedCountryId}
                      onChange={(e) => handleCountryChange(e.target.value)}
                    >
                      <option value="">All Countries</option>
                      {countries.map((country) => (
                        <option key={country.country_id} value={country.country_id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Search with Autocomplete */}
                  <div className="relative location-dropdown-container" ref={locationRef}>
                    <div className="relative">
                      <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <input
                        type="text"
                        name="location"
                        value={locationSearch || formData.location}
                        onChange={(e) => {
                          setLocationSearch(e.target.value);
                          setShowLocationDropdown(true);
                          handleChange(e);
                        }}
                        onFocus={() => setShowLocationDropdown(true)}
                        className={`flex h-10 w-full rounded-md border ${
                          errors.location ? "border-destructive" : "border-input"
                        } bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                        placeholder="Search city or country..."
                      />
                      {formData.location_id && (
                        <FaCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    
                    {showLocationDropdown && filteredLocations.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredLocations.map((location) => (
                          <button
                            key={location.id}
                            type="button"
                            className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                            onClick={() => handleLocationSelect(location)}
                          >
                            <div className="flex items-center gap-2">
                              <MdLocationOn className="h-3 w-3 text-muted-foreground" />
                              <span>{location.name}</span>
                              <span className="ml-auto text-xs text-muted-foreground">{location.type}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {errors.location && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <FaExclamationCircle className="h-3 w-3" />
                      {errors.location}
                    </p>
                  )}
                  {formData.location_id && !errors.location && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FaCheckCircle className="h-3 w-3" />
                      Location selected
                    </p>
                  )}
                </div>

                {/* Category Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category <span className="text-destructive">*</span>
                  </label>
                  <div className="relative category-dropdown-container" ref={categoryRef}>
                    <div className="relative">
                      <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <input
                        type="text"
                        name="category"
                        value={categorySearch || formData.category}
                        onChange={(e) => {
                          setCategorySearch(e.target.value);
                          setShowCategoryDropdown(true);
                          handleChange(e);
                        }}
                        onFocus={() => setShowCategoryDropdown(true)}
                        className={`flex h-10 w-full rounded-md border ${
                          errors.category ? "border-destructive" : "border-input"
                        } bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                        placeholder="Search job category..."
                      />
                      {formData.category_id && (
                        <FaCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                      <FaChevronDown className="absolute right-8 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                    </div>
                    
                    {showCategoryDropdown && (
                      <>
                        {filteredCategories.length > 0 ? (
                          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredCategories.map((category) => (
                              <button
                                key={category.id}
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                                onClick={() => handleCategorySelect(category)}
                              >
                                <div className="flex items-center gap-2">
                                  <FaBriefcase className="h-3 w-3 text-muted-foreground" />
                                  <span>{category.fullName || category.name}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg p-4 text-sm text-muted-foreground text-center">
                            {categorySearch ? "No categories found" : "Loading categories..."}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <FaExclamationCircle className="h-3 w-3" />
                      {errors.category}
                    </p>
                  )}
                  {formData.category_id && !errors.category && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <FaCheckCircle className="h-3 w-3" />
                      Category selected
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Job Description <span className="text-destructive">*</span>
                    <span className="text-xs text-muted-foreground font-normal ml-2">
                      ({formData.description.length}/50 minimum characters)
                    </span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={8}
                    className={`flex w-full rounded-md border ${
                      errors.description ? "border-destructive" : "border-input"
                    } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                    placeholder="Describe the job responsibilities, requirements, and benefits..."
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <FaExclamationCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                  {!errors.description && formData.description.length > 0 && (
                    <p className={`text-xs mt-1 ${
                      formData.description.length >= 50 ? "text-green-600" : "text-muted-foreground"
                    }`}>
                      {formData.description.length < 50 
                        ? `${50 - formData.description.length} more characters needed`
                        : "Description length is sufficient"
                      }
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
                  >
                    Next: Job Details
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Job Details */}
            {currentStep === 2 && (
              <div className="rounded-lg border bg-card p-6 space-y-6">
                <h2 className="text-2xl font-bold">Job Details</h2>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Job Type <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border ${
                      errors.job_type ? "border-destructive" : "border-input"
                    } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                  >
                    {jobTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.job_type && (
                    <p className="text-sm text-destructive mt-1">{errors.job_type}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Salary Min <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="number"
                        name="salary_min"
                        value={formData.salary_min}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        className={`flex h-10 w-full rounded-md border ${
                          errors.salary_min ? "border-destructive" : "border-input"
                        } bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                        placeholder="0"
                      />
                    </div>
                    {errors.salary_min && (
                      <p className="text-xs text-destructive mt-1">{errors.salary_min}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Salary Max <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="number"
                        name="salary_max"
                        value={formData.salary_max}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        className={`flex h-10 w-full rounded-md border ${
                          errors.salary_max ? "border-destructive" : "border-input"
                        } bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                        placeholder="0"
                      />
                    </div>
                    {errors.salary_max && (
                      <p className="text-xs text-destructive mt-1">{errors.salary_max}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Currency</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {currencies.length > 0 ? (
                        currencies.map((curr) => (
                          <option key={curr.currency_id || curr.value} value={curr.name || curr.value}>
                            {curr.symbol || "$"} {curr.name || curr.value}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="USD">$ USD</option>
                          <option value="EUR">€ EUR</option>
                          <option value="GBP">£ GBP</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                {errors.salary && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <FaExclamationCircle className="h-3 w-3" />
                    {errors.salary}
                  </p>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Apply URL <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="url"
                      name="apply_url"
                      value={formData.apply_url}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border ${
                        errors.apply_url ? "border-destructive" : "border-input"
                      } bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                      placeholder="https://company.com/careers/apply"
                    />
                    {formData.apply_url && !errors.apply_url && (
                      <FaCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {errors.apply_url && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <FaExclamationCircle className="h-3 w-3" />
                      {errors.apply_url}
                    </p>
                  )}
                  {!errors.apply_url && formData.apply_url && (
                    <p className="text-xs text-green-600 mt-1">Valid URL format</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Application End Date <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`flex h-10 w-full rounded-md border ${
                        errors.end_date ? "border-destructive" : "border-input"
                      } bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                    />
                  </div>
                  {errors.end_date && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <FaExclamationCircle className="h-3 w-3" />
                      {errors.end_date}
                    </p>
                  )}
                  {!errors.end_date && formData.end_date && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Application deadline: {new Date(formData.end_date).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
                  >
                    Next: Upsells
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Upsells */}
            {currentStep === 3 && (
              <div className="rounded-lg border bg-card p-6 space-y-6">
                <h2 className="text-2xl font-bold">Boost Your Job Posting</h2>
                <p className="text-muted-foreground">
                  Increase visibility and get more applications with our premium features.
                </p>

                <UpsellSelector
                  selectedUpsells={selectedUpsells}
                  setSelectedUpsells={setSelectedUpsells}
                  type="job"
                />

                {/* Payment Section - Show if upsells are selected */}
                {Object.values(selectedUpsells).some((selected) => selected) && (
                  <div className="pt-6 border-t">
                    <PaymentProcessor
                      amount={calculateTotalPrice()}
                      description={`Job posting upsells: ${getSelectedUpsellNames().join(", ")}`}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      upsellType="job"
                      upsellId={jobId}
                    />
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || (Object.values(selectedUpsells).some((s) => s) && !paymentCompleted)}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
                  >
                    {loading ? "Saving..." : paymentCompleted ? "Complete Payment to Post" : jobId ? "Update Job" : "Post Job"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobPostingForm;

