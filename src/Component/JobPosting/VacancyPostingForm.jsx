import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createJob, updateJob } from "../../slice/JobSlice";
import { createJobUpsell } from "../../slice/UpsellSlice";
import { getCountry, getZone, getFilterCat, getCurrency } from "../../slice/CategorySlice";
import toast from "react-hot-toast";
import {
  FaBriefcase,
  FaCheckCircle,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Navbar from "../Navbar";
import Footer from "../Footer";
import UpsellSelector from "./UpsellSelector";
import PaymentProcessor from "../Payment/PaymentProcessor";

const VacancyPostingForm = ({ jobId = null, initialData = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((store) => store.jobs);

  // Check authentication on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to post a vacancy");
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
  const [showPayment, setShowPayment] = useState(false);

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
        navigate("/vacancies/my-vacancies");
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
        newErrors.title = "Vacancy title is required";
      } else if (formData.title.trim().length < 3) {
        newErrors.title = "Vacancy title must be at least 3 characters";
      }
      
      if (!formData.description.trim()) {
        newErrors.description = "Vacancy description is required";
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
      featured: "Featured Vacancy",
      suggested: "Suggested Vacancies",
    };
    return Object.entries(selectedUpsells)
      .filter(([_, selected]) => selected)
      .map(([key]) => upsellNames[key] || key);
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Complete payment for upsells
      toast.success("Payment successful! Vacancy posted successfully.");
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
          currencyId = null;
        }
      } else {
        currencyId = null;
      }

      const vacancyPayload = {
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
        ...(formData.country_id && { country_id: Number(formData.country_id) }),
        ...(selectedCountryId && !formData.country_id && { country_id: Number(selectedCountryId) }),
        // Mark as vacancy type
        listing_type: "vacancy",
      };

      let createdVacancy;
      if (jobId) {
        createdVacancy = await dispatch(updateJob({ jobId, jobData: vacancyPayload })).unwrap();
      } else {
        createdVacancy = await dispatch(createJob(vacancyPayload)).unwrap();
      }

      const newVacancyId = createdVacancy?.data?.id || createdVacancy?.data?.listing_id || createdVacancy?.id || createdVacancy?.listing_id || jobId;

      // Handle upsells separately if any are selected
      if (newVacancyId && (selectedUpsells.featured || selectedUpsells.suggested)) {
        const upsellPromises = [];
        if (selectedUpsells.featured) {
          upsellPromises.push(
            dispatch(createJobUpsell({
              listing_id: newVacancyId,
              upsell_type: "featured",
              duration_days: 30,
            })).unwrap()
          );
        }
        
        if (selectedUpsells.suggested) {
          upsellPromises.push(
            dispatch(createJobUpsell({
              listing_id: newVacancyId,
              upsell_type: "suggested",
              duration_days: 30,
            })).unwrap()
          );
        }

        const upsellResults = await Promise.all(upsellPromises);
        
        const paymentUrls = upsellResults
          .map(result => result?.data?.payment_url || result?.payment_url)
          .filter(Boolean);
        
        if (paymentUrls.length > 0) {
          setShowPayment(true);
        } else {
          toast.success("Vacancy posted successfully!");
          navigate("/dashboard");
        }
      } else {
        toast.success("Vacancy posted successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to save vacancy posting");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Post a Vacancy</h1>
            <p className="text-muted-foreground">Find the perfect candidate for your open position</p>
          </div>

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
                    Vacancy Title <span className="text-destructive">*</span>
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
                    Vacancy Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className={`flex w-full rounded-md border ${
                      errors.description ? "border-destructive" : "border-input"
                    } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none`}
                    placeholder="Describe the vacancy, responsibilities, requirements, etc..."
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Location and Category fields (similar to JobPostingForm) */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Location <span className="text-destructive">*</span>
                  </label>
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
                    <p className="text-sm text-destructive mt-1">{errors.location}</p>
                  )}
                </div>

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
                    </div>
                    
                    {showCategoryDropdown && filteredCategories.length > 0 && (
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
                    )}
                  </div>
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1">{errors.category}</p>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <div></div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="rounded-lg border bg-card p-6 space-y-6">
                <h2 className="text-2xl font-bold">Vacancy Details</h2>
                
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Minimum Salary
                    </label>
                    <input
                      type="number"
                      name="salary_min"
                      value={formData.salary_min}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border ${
                        errors.salary_min ? "border-destructive" : "border-input"
                      } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                      placeholder="e.g., 50000"
                    />
                    {errors.salary_min && (
                      <p className="text-sm text-destructive mt-1">{errors.salary_min}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Maximum Salary
                    </label>
                    <input
                      type="number"
                      name="salary_max"
                      value={formData.salary_max}
                      onChange={handleChange}
                      className={`flex h-10 w-full rounded-md border ${
                        errors.salary_max ? "border-destructive" : "border-input"
                      } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                      placeholder="e.g., 80000"
                    />
                    {errors.salary_max && (
                      <p className="text-sm text-destructive mt-1">{errors.salary_max}</p>
                    )}
                  </div>
                </div>

                {errors.salary && (
                  <p className="text-sm text-destructive mt-1">{errors.salary}</p>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Application URL <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="url"
                    name="apply_url"
                    value={formData.apply_url}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border ${
                      errors.apply_url ? "border-destructive" : "border-input"
                    } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                    placeholder="https://yourcompany.com/careers/apply"
                  />
                  {errors.apply_url && (
                    <p className="text-sm text-destructive mt-1">{errors.apply_url}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border ${
                      errors.end_date ? "border-destructive" : "border-input"
                    } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                  />
                  {errors.end_date && (
                    <p className="text-sm text-destructive mt-1">{errors.end_date}</p>
                  )}
                </div>

                <div className="flex justify-between pt-4">
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
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Upsells */}
            {currentStep === 3 && (
              <div className="rounded-lg border bg-card p-6 space-y-6">
                <h2 className="text-2xl font-bold">Boost Your Vacancy</h2>
                <p className="text-muted-foreground">Get more visibility for your vacancy with our premium features</p>
                
                <UpsellSelector
                  selectedUpsells={selectedUpsells}
                  setSelectedUpsells={setSelectedUpsells}
                  listingType="vacancy"
                />

                {showPayment && (
                  <PaymentProcessor
                    totalPrice={calculateTotalPrice()}
                    selectedUpsells={getSelectedUpsellNames()}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
                  >
                    {loading ? "Posting..." : "Post Vacancy"}
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

export default VacancyPostingForm;
