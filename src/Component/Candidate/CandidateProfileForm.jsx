import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCandidateProfile, updateCandidateProfile } from "../../slice/CandidateSlice";
import { createCandidateUpsell } from "../../slice/UpsellSlice";
import { getCountry, getZone } from "../../slice/CategorySlice";
import toast from "react-hot-toast";
import {
  FaFileAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Navbar from "../Navbar";
import Footer from "../Footer";
import UpsellSelector from "../JobPosting/UpsellSelector";
import PaymentProcessor from "../Payment/PaymentProcessor";

const CandidateProfileForm = ({ candidateId = null, initialData = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((store) => store.candidates);

  const [formData, setFormData] = useState({
    headline: "",
    summary: "",
    skills: [],
    cv_url: "",
    location_id: "",
    location: "", // For display/search
    visibility: "public",
    ...initialData,
  });

  const [selectedUpsells, setSelectedUpsells] = useState({
    featured: false,
    job_alerts_boost: false,
  });

  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState({});
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  // Location dropdown states
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  
  // Refs for click outside detection
  const locationRef = useRef(null);
  
  // Get data from Redux store
  const countriesRaw = useSelector((store) => store.categories?.country?.data?.items);
  const zonesRaw = useSelector((store) => store.categories?.zone?.data?.items);
  
  const countries = useMemo(() => Array.isArray(countriesRaw) ? countriesRaw : [], [countriesRaw]);
  const zones = useMemo(() => Array.isArray(zonesRaw) ? zonesRaw : [], [zonesRaw]);
  
  // Load countries on mount
  useEffect(() => {
    dispatch(getCountry());
  }, [dispatch]);
  
  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLocationDropdown && locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLocationDropdown]);
  
  // Initialize location search when initialData is provided
  useEffect(() => {
    if (initialData) {
      if (initialData.location) {
        setLocationSearch(initialData.location);
      }
      if (initialData.country_id) {
        setSelectedCountryId(initialData.country_id);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      navigate("/candidates/my-profile");
    }
    if (error) {
      toast.error(error?.message || "An error occurred");
    }
  }, [message, error, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // Filtered locations based on search
  // Only show zones/cities, not countries - backend requires zone_id for location_id
  const filteredLocations = useMemo(() => {
    if (!locationSearch.trim()) {
      // If no search, show all zones if available
      if (zones.length > 0 && zones.length <= 20) {
        return zones.map((zone) => ({
          id: zone.zone_id,
          name: `${zone.zone_name}, ${zone.country_name}`,
          type: "zone",
          zone_id: zone.zone_id,
          country_id: zone.country_id,
        }));
      }
      return [];
    }
    
    const searchLower = locationSearch.toLowerCase();
    const locationList = [];
    
    // Only add zones/cities (not countries) - backend requires zone_id for location_id
    zones.forEach((zone) => {
      const zoneName = zone.zone_name?.toLowerCase() || '';
      const countryName = zone.country_name?.toLowerCase() || '';
      if (zoneName.includes(searchLower) || countryName.includes(searchLower)) {
        locationList.push({ 
          id: zone.zone_id, 
          name: `${zone.zone_name}, ${zone.country_name}`, 
          type: "zone",
          zone_id: zone.zone_id,
          country_id: zone.country_id,
        });
      }
    });
    
    return locationList.slice(0, 10); // Limit to 10 results
  }, [locationSearch, zones]);
  
  const handleLocationSelect = (location) => {
    // Ensure we're using zone_id (not country_id) for location_id
    // Backend requires location_id to be a valid zone_id
    const zoneId = location.zone_id || location.id;
    if (!zoneId) {
      toast.error("Please select a valid city or zone location.");
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      location_id: zoneId, // Must be zone_id, not country_id
      location: location.name,
      country_id: location.country_id || selectedCountryId,
    }));
    setLocationSearch(location.name);
    setShowLocationDropdown(false);
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: "" }));
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.headline.trim()) newErrors.headline = "Headline is required";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";
    if (formData.skills.length === 0) newErrors.skills = "At least one skill is required";
    if (!formData.location_id || formData.location_id === '') {
      newErrors.location = "Location is required. Please select a location from the dropdown.";
    }
    // CV URL is optional based on backend requirements

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to calculate total price of selected upsells
  const calculateTotalPrice = () => {
    const upsellPrices = {
      featured: 19.99,
      job_alerts_boost: 14.99,
    };
    return Object.entries(selectedUpsells).reduce((total, [key, selected]) => {
      return total + (selected && upsellPrices[key] ? upsellPrices[key] : 0);
    }, 0);
  };

  // Helper function to get names of selected upsells
  const getSelectedUpsellNames = () => {
    const upsellNames = {
      featured: "Featured Profile",
      job_alerts_boost: "Job Alerts Boost",
    };
    return Object.entries(selectedUpsells)
      .filter(([_, selected]) => selected)
      .map(([key]) => upsellNames[key] || key);
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentData) => {
    try {
      // If payment is pending (development mode), allow form submission
      if (paymentData.paymentMethod === "pending") {
        setPaymentCompleted(true);
        // Don't navigate yet - let the form submit button handle it
        return;
      }
      // Complete payment for upsells
      setPaymentCompleted(true);
      toast.success("Payment successful! Profile created successfully.");
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
    if (!validateForm()) return;

    try {
      // Validate location_id is a number
      const locationId = formData.location_id;
      if (!locationId || locationId === '' || isNaN(Number(locationId))) {
        toast.error("Location is required. Please select a location from the dropdown.");
        setErrors((prev) => ({ ...prev, location: "Location is required. Please select a location from the dropdown." }));
        return;
      }
      
      // Format payload according to API structure
      const profilePayload = {
        headline: formData.headline.trim(),
        summary: formData.summary.trim(),
        skills: Array.isArray(formData.skills) ? formData.skills : (formData.skills ? [formData.skills] : []),
        cv_url: formData.cv_url?.trim() || null,
        location_id: Number(locationId),
        visibility: formData.visibility || "public",
      };
      
      // Add country_id if provided
      if (formData.country_id || selectedCountryId) {
        profilePayload.country_id = Number(formData.country_id || selectedCountryId);
      }

      let createdProfile;
      if (candidateId) {
        createdProfile = await dispatch(
          updateCandidateProfile({ candidateId, profileData: profilePayload })
        ).unwrap();
      } else {
        createdProfile = await dispatch(createCandidateProfile(profilePayload)).unwrap();
      }

      const profileId = createdProfile?.data?.candidate_profile_id || createdProfile?.candidate_profile_id || candidateId;

      // Handle upsells separately if any are selected
      if (profileId && (selectedUpsells.featured || selectedUpsells.job_alerts_boost)) {
        try {
          const upsellPromises = [];
          
          if (selectedUpsells.featured) {
            upsellPromises.push(
              dispatch(createCandidateUpsell({
                candidate_profile_id: profileId,
                upsell_type: "featured_profile",
                duration_days: 30, // Default, could be made configurable
              })).unwrap()
            );
          }
          
          if (selectedUpsells.job_alerts_boost) {
            upsellPromises.push(
              dispatch(createCandidateUpsell({
                candidate_profile_id: profileId,
                upsell_type: "job_alerts_boost",
                duration_days: 30, // Default, could be made configurable
              })).unwrap()
            );
          }

          // Attempt to create upsells (may fail if payment required, but allow in dev mode)
          try {
            await Promise.all(upsellPromises);
            toast.success("Profile and upsells created successfully!");
          } catch (upsellError) {
            // In development, allow profile creation even if upsells fail
            if (process.env.NODE_ENV === 'development' || !process.env.REACT_APP_PAYPAL_CLIENT_ID) {
              toast.success("Profile created successfully! Upsells will be activated once payment is configured.");
            } else {
              throw upsellError;
            }
          }
          navigate("/dashboard");
        } catch (upsellError) {
          // If upsell creation fails but we're in dev mode, still show success
          if (process.env.NODE_ENV === 'development' || !process.env.REACT_APP_PAYPAL_CLIENT_ID) {
            toast.success("Profile created successfully! Upsells will be activated once payment is configured.");
            navigate("/dashboard");
          } else {
            throw upsellError;
          }
        }
      } else {
        toast.success("Profile created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to save profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {candidateId ? "Edit Profile" : "Create Candidate Profile"}
            </h1>
            <p className="text-muted-foreground mt-2">
              Build your professional profile to attract employers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="rounded-lg border bg-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Professional Headline <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border ${
                    errors.headline ? "border-destructive" : "border-input"
                  } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                  placeholder="e.g., Senior Software Engineer | React Specialist"
                />
                {errors.headline && (
                  <p className="text-sm text-destructive mt-1">{errors.headline}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Professional Summary <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={6}
                  className={`flex w-full rounded-md border ${
                    errors.summary ? "border-destructive" : "border-input"
                  } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                  placeholder="Describe your experience, expertise, and what you're looking for..."
                />
                {errors.summary && (
                  <p className="text-sm text-destructive mt-1">{errors.summary}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Location <span className="text-destructive">*</span>
                </label>
                
                {/* Country Selector */}
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-1 block">Country (Optional)</label>
                  <select
                    name="country_id"
                    id="country-select"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                    value={selectedCountryId || ""}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    autoComplete="country"
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
                <div className="relative" ref={locationRef}>
                  <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <input
                    type="text"
                    name="location_search"
                    id="location-search"
                    className={`flex h-10 w-full rounded-md border ${
                      errors.location ? "border-destructive" : "border-input"
                    } bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all`}
                    placeholder="Search and select a city or zone (required)"
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setShowLocationDropdown(true);
                    }}
                    onFocus={() => {
                      if (filteredLocations.length > 0) {
                        setShowLocationDropdown(true);
                      }
                    }}
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                  />
                  {showLocationDropdown && filteredLocations.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredLocations.map((location) => (
                        <button
                          key={location.zone_id || location.id}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="flex items-center gap-2">
                            <MdLocationOn className="h-3 w-3 text-muted-foreground" />
                            <span>{location.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {showLocationDropdown && locationSearch.trim() && filteredLocations.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg p-4 text-sm text-muted-foreground">
                      No cities or zones found. Try selecting a country first, or use a different search term.
                    </div>
                  )}
                </div>
                {errors.location && (
                  <p className="text-sm text-destructive mt-1">{errors.location}</p>
                )}
                {formData.location_id && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Selected: {locationSearch || formData.location}
                  </p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-lg border bg-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Skills</h2>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Add Skills <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4"
                  >
                    Add
                  </button>
                </div>
                {errors.skills && (
                  <p className="text-sm text-destructive mt-1">{errors.skills}</p>
                )}

                {/* Skills List */}
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CV and Links */}
            <div className="rounded-lg border bg-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">CV & Links</h2>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  CV/Resume URL <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="url"
                    name="cv_url"
                    value={formData.cv_url}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border ${
                      errors.cv_url ? "border-destructive" : "border-input"
                    } bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                    placeholder="https://..."
                  />
                </div>
                {errors.cv_url && (
                  <p className="text-sm text-destructive mt-1">{errors.cv_url}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Visibility</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={formData.visibility === "public"}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary"
                    />
                    <FaEye className="h-4 w-4" />
                    <span>Public - Visible to all employers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={formData.visibility === "private"}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary"
                    />
                    <FaEyeSlash className="h-4 w-4" />
                    <span>Private - Only visible to you</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Upsells */}
            <div className="rounded-lg border bg-card p-6 space-y-6">
              <h2 className="text-xl font-semibold">Boost Your Profile</h2>
              <p className="text-muted-foreground">
                Increase your visibility and get more job opportunities with our premium features.
              </p>

              <UpsellSelector
                selectedUpsells={selectedUpsells}
                setSelectedUpsells={setSelectedUpsells}
                type="candidate"
              />

              {/* Payment Section - Hidden in development when PayPal is not configured */}
              {Object.values(selectedUpsells).some((selected) => selected) && 
               process.env.REACT_APP_PAYPAL_CLIENT_ID && (
                <div className="pt-6 border-t">
                  <PaymentProcessor
                    amount={calculateTotalPrice()}
                    description={`Candidate profile upsells: ${getSelectedUpsellNames().join(", ")}`}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    upsellType="candidate"
                    upsellId={candidateId}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
              >
                {loading ? "Saving..." : candidateId ? "Update Profile" : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CandidateProfileForm;

