import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaHeart, FaCheck, FaExclamationTriangle, FaTimes, FaHandHoldingHeart } from 'react-icons/fa';
import Navbar from "../Navbar";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createAdsList } from "../../slice/ListSlice";
import { CategoryTreeChild, getCurrency } from "../../slice/CategorySlice";
import { getUserDetails } from "../../slice/AuthSlice";
import { createListingWithPosterName } from '../../utils/posterHelper';
import toast from 'react-hot-toast';
import ReactQuillWrapper from "../ReactQuillWrapper";
import "react-quill/dist/quill.snow.css";
import UpsellOptions from "./UpsellOptions";
import Subscription from "../Subscription";

const PostCharities = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Get user, business, and store data from Redux
  const auth = useSelector(state => state.auth);
  const store = useSelector(state => state.store);
  
  const user = auth.userDetail?.data || auth.userInfo;
  const businessStore = store.businessStore?.data || store.businessStore;
  const storeDetail = store.storeDetail?.data || store.storeDetail;
  
  // Check if current context is admin dashboard
  const isAdmin = window.location.pathname.includes('/admin') || user?.role === 'admin';
  const initialFormState = {
    title: "",
    organizationName: "",
    category: "",
    description: "",
    mission: "",
    cause: "",
    donationGoal: "",
    currentDonations: "",
    deadline: "",
    location: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
    taxId: "",
    images: [],
    category_id: id,
    user_id: "",
    currency_id: 0,
    price: "",
  };

  const [formState, setFormState] = useState(initialFormState);
  const [screen, setScreen] = useState("form");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedUpsells, setSelectedUpsells] = useState({
    paid: false,
    featured: false,
    promoted: false,
    sponsored: false,
    business: false,
    store: false,
  });
  const categoryAdsData = useSelector((store) => store.categories.catTreeChild);
  const SubCatPost = categoryAdsData?.data || [];

  const catMasterData = useSelector((store) => store.categories.currency);
  const CatMaster = catMasterData?.data || [];
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || {});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormState({
        ...formState,
        [name]: files[0],
      });
    } else {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files) {
      // Validate file types and sizes
      const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`);
          return false;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast.error(`${file.name} is too large. Maximum size is 10MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const promises = validFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      });

      Promise.all(promises)
        .then((base64Strings) => {
          const currentImages = formState.images || [];
          const newImages = [...currentImages, ...base64Strings];
          setFormState({ ...formState, images: newImages });
          toast.success(`${validFiles.length} image(s) uploaded successfully`);
        })
        .catch((error) => {
          console.error("Error converting files:", error);
          toast.error("Error uploading images");
        });
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files) {
      // Create a fake event object to use with handleFileChange
      const fakeEvent = {
        target: { files: files }
      };
      handleFileChange(fakeEvent);
    }
  };

  useEffect(() => {
    dispatch(getCurrency());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      setFormState((prev) => ({ ...prev, category_id: parseInt(id) }));
      dispatch(CategoryTreeChild({ id }));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!userDetails) {
      dispatch(getUserDetails());
    } else {
      if (userDetails.location === null) {
        setShowProfileModal(true);
      }
    }
  }, [userDetails, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formState.organizationName === "" ||
      formState.description === "" ||
      formState.mission === "" ||
      formState.cause === "" ||
      formState.category === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!formState.images || formState.images.length === 0) {
      alert("Please select at least one image.");
      return;
    }
    if (formState.currency_id === 0 || formState.donationGoal === "") {
      alert("Please fill in donation goal information.");
      return;
    }
    if (parseFloat(formState.donationGoal.replace(/[^0-9.-]+/g,"")) < 0) {
      alert("Donation goal cannot be negative.");
      return;
    }
    setTimeout(() => {
      setScreen("upsells");
    }, 100);
  };

  const onSubmit = async (item) => {
    // Validate user details and location
    if (!userDetails) {
      toast.error("User information not available. Please refresh the page.");
      return;
    }

    if (!userDetails.location || !userDetails.location.location_id) {
      toast.error("Please update your location in your profile before posting.");
      setShowProfileModal(true);
      return;
    }

    // Create base payload
    const basePayload = {
      ...formState,
      title: formState.organizationName,
      price: parseFloat(formState.donationGoal.replace(/[^0-9.-]+/g,"")) || 0,
      location_id: userDetails.location.location_id,
      user_id: userDetails.customer_id,
      package: item,
      package_id: item.package_id,
      currency_id: parseInt(formState.currency_id),
      // Add selected upsells
      upsells: Object.keys(selectedUpsells).filter(key => selectedUpsells[key]),
      is_paid: selectedUpsells.paid || false,
      is_featured: selectedUpsells.featured || false,
      is_promoted: selectedUpsells.promoted || false,
      is_sponsored: selectedUpsells.sponsored || false,
      is_business: selectedUpsells.business || false,
      is_store: selectedUpsells.store || false,
    };
    
    try {
      // Create enhanced listing data with proper poster name
      const enhancedPayload = await createListingWithPosterName(
        basePayload,
        user,
        businessStore,
        storeDetail,
        isAdmin
      );
      
      // Ensure images is properly formatted as flat array for backend
      if (enhancedPayload.images && Array.isArray(enhancedPayload.images)) {
        enhancedPayload.images = enhancedPayload.images.flat();
      }
      
      console.log('Charity posting data with poster name:', enhancedPayload);
      
      await dispatch(
        createAdsList({
          formData: enhancedPayload,
        })
      ).unwrap();
      toast.success("Your charity post is created");
      navigate("/charities");
    } catch (error) {
      alert(error);
    }
  };

  // Custom Profile Completion Modal
  const ProfileModal = () => {
    if (!showProfileModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowProfileModal(false)}
        />
        
        {/* Modal */}
        <div className="relative bg-card border rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
          {/* Close button */}
          <button
            onClick={() => setShowProfileModal(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <FaTimes className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon */}
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
            </div>

            {/* Title */}
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Complete Your Profile
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                You need to complete your profile information before you can post a charity request. This helps us provide better service and builds trust with potential donors.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  navigate("/account?component=AccountInfo");
                }}
                className="flex-1 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {screen === "form" && (
        <div className="pt-20">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 py-16">
            <div className="page-container">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Post Charity/Donation Request
                </h1>
                <p className="text-green-100 text-lg">
                  Share your cause and connect with generous donors
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="page-container py-8">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="rounded-lg border bg-card shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FaHandHoldingHeart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Charity Information</h2>
                      <p className="text-sm text-muted-foreground">Tell us about your organization and cause</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Organization Name *
                        </label>
                        <input
                          type="text"
                          name="organizationName"
                          value={formState.organizationName}
                          placeholder="e.g. Help Children Foundation"
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formState.category}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        >
                          <option value="">Select category</option>
                          <option value="education">Education</option>
                          <option value="health">Health</option>
                          <option value="environment">Environment</option>
                          <option value="animals">Animal Welfare</option>
                          <option value="poverty">Poverty Alleviation</option>
                          <option value="disaster-relief">Disaster Relief</option>
                          <option value="human-rights">Human Rights</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Organization Description *
                      </label>
                      <div className="border border-input rounded-md">
                        <ReactQuillWrapper
                          value={formState.description}
                          onChange={(value) => {
                            setFormState({ ...formState, description: value });
                          }}
                          style={{ 
                            height: "120px",
                            marginBottom: "42px"
                          }}
                          theme="snow"
                          placeholder="Describe your organization and its work..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Mission Statement *
                      </label>
                      <div className="border border-input rounded-md">
                        <ReactQuillWrapper
                          value={formState.mission}
                          onChange={(value) => {
                            setFormState({ ...formState, mission: value });
                          }}
                          style={{ 
                            height: "100px",
                            marginBottom: "42px"
                          }}
                          theme="snow"
                          placeholder="What is your organization's mission?"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Specific Cause/Project *
                      </label>
                      <div className="border border-input rounded-md">
                        <ReactQuillWrapper
                          value={formState.cause}
                          onChange={(value) => {
                            setFormState({ ...formState, cause: value });
                          }}
                          style={{ 
                            height: "100px",
                            marginBottom: "42px"
                          }}
                          theme="snow"
                          placeholder="Describe the specific cause or project you're raising funds for..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Donation Goal *
                        </label>
                        <input
                          type="text"
                          name="donationGoal"
                          value={formState.donationGoal}
                          onChange={handleChange}
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="e.g. $10,000"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Current Donations
                        </label>
                        <input
                          type="text"
                          name="currentDonations"
                          value={formState.currentDonations}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="e.g. $2,500"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Deadline
                        </label>
                        <input
                          type="date"
                          name="deadline"
                          value={formState.deadline}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Location *
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formState.location}
                          onChange={handleChange}
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="City, Country"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formState.website}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="https://charity.org"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Tax ID / Registration Number
                        </label>
                        <input
                          type="text"
                          name="taxId"
                          value={formState.taxId}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="Non-profit registration number"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Contact Email *
                        </label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formState.contactEmail}
                          onChange={handleChange}
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="contact@charity.org"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formState.contactPhone}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Images *
                      </label>
                      <div 
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                          dragActive 
                            ? 'border-primary bg-primary/5 scale-105' 
                            : 'border-input hover:border-primary/50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <FaHeart className={`h-8 w-8 mx-auto mb-2 transition-colors ${
                          dragActive ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          name="images"
                          onChange={handleFileChange}
                          className="hidden"
                          id="image-upload"
                          required
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {dragActive ? 'Drop images here' : 'Click to upload images or drag and drop'}
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, GIF up to 10MB each
                        </p>
                        {formState.images && formState.images.length > 0 && (
                          <p className="text-xs text-primary mt-1 font-medium">
                            {formState.images.length} image(s) selected
                          </p>
                        )}
                      </div>
                      
                      {/* Image Preview Section */}
                      {formState.images && formState.images.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-foreground mb-2">
                            Selected Images ({formState.images.length})
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {formState.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-input"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = formState.images.filter((_, i) => i !== index);
                                    setFormState({...formState, images: newImages});
                                  }}
                                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Only show subcategory selection if subcategories exist */}
                    {SubCatPost.items &&
                      SubCatPost.items.length > 0 &&
                      SubCatPost.items[0]?.childs &&
                      SubCatPost.items[0].childs.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Sub Category *
                        </label>
                        <select
                          name="category_id"
                          value={formState.category_id}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        >
                          <option value="">Select Sub Category</option>
                          {SubCatPost.items[0].childs.map((subCat, i) => {
                            return (
                              <option key={i} value={subCat.category_id}>
                                {subCat.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}

                    {/* Currency section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Currency *
                        </label>
                        <select
                          name="currency_id"
                          value={formState.currency_id}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        >
                          <option value="0">Select Currency</option>
                          {CatMaster.items &&
                            CatMaster.items.map((currency, i) => {
                              return (
                                <option key={i} value={currency.currency_id}>
                                  {currency.name}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <FaArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md bg-green-600 text-primary-foreground hover:bg-green-700 h-10 px-6 py-2 text-sm font-medium transition-colors"
                  >
                    <FaCheck className="h-4 w-4" />
                    Continue to Pricing
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {screen === "upsells" && (
        <div className="pt-20">
          <div className="page-container py-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-teal-600 py-8 rounded-t-lg">
                <div className="px-6 text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Boost Your Charity Campaign
                  </h1>
                  <p className="text-green-100">
                    Select additional features to increase visibility (optional)
                  </p>
                </div>
              </div>

              {/* Upsell Options */}
              <div className="bg-card border-x border-b rounded-b-lg p-6">
                <UpsellOptions
                  selectedUpsells={selectedUpsells}
                  setSelectedUpsells={setSelectedUpsells}
                />

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setScreen("form")}
                    className="inline-flex items-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <FaArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setScreen("pricing")}
                    className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 text-sm font-medium transition-colors"
                  >
                    Continue to Pricing
                    <FaCheck className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {screen === "pricing" && (
        <div className="pt-20">
          <Subscription
            data={formState}
            postType={"charity"}
            onBack={() => setScreen("upsells")}
            onSubmit={(item) => {
              onSubmit(item);
            }}
          />
        </div>
      )}
      
      {/* Profile Completion Modal */}
      <ProfileModal />
    </div>
  );
};

export default PostCharities;
