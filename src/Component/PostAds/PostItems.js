import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaImage, FaDollarSign, FaCheck, FaExclamationTriangle, FaTimes, FaBox } from "react-icons/fa";
import Navbar from "../Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createAdsList } from "../../slice/ListSlice";
import { CategoryTreeChild, getCurrency } from "../../slice/CategorySlice";
import { getUserDetails } from "../../slice/AuthSlice";
import Subscription from "../Subscription";
import UpsellOptions from "./UpsellOptions";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { listingPayloadFromPackage } from "../../utils/listingPackagePayment";

function PostItems() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const quillRef = React.useRef(null); // Add ref for ReactQuill
  const initialFormState = {
    title: "",
    images: [],
    category_id: id,
    user_id: "",
    currency_id: 0,
    price: "",
    description: "",
    item_type: "",
    condition: "",
    brand: "",
    model: "",
    color: "",
    dimensions: "",
    weight: "",
    location: "",
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
  const { kycRequired, kycStatus } = useSelector((store) => store.kyc);
  const businessStore = useSelector((store) => store.store?.businessStore?.data || {});
  const storeDetail = useSelector((store) => store.store?.storeDetail?.data || {});

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
      formState.title === "" ||
      formState.description === "" ||
      formState.item_type === "" ||
      formState.condition === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!formState.images || formState.images.length === 0) {
      alert("Please select at least one image.");
      return;
    }
    // For "give away" items, price is not required
    if (formState.item_type !== "give_away" && (formState.currency_id === 0 || formState.price === "")) {
      alert("Please fill in price information.");
      return;
    }
    if (parseFloat(formState.price) < 0) {
      alert("Price cannot be negative.");
      return;
    }
    setTimeout(() => {
      setScreen("upsells");
    }, 100);
  };

  const onSubmit = async (item, payment = null) => {
    // Check KYC requirement before posting
    if (kycRequired && kycStatus !== 'verified') {
      alert('KYC verification is required to post more ads. Please complete your verification.');
      return;
    }
    
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

    const packageFields = listingPayloadFromPackage(item, payment);

    const payload = {
      ...formState,
      location_id: userDetails.location.location_id,
      user_id: userDetails.customer_id,
      ...packageFields,
      currency_id: formState.item_type === "give_away" ? 0 : parseInt(formState.currency_id),
      weight: formState.weight ? parseFloat(formState.weight) : null,
      dimensions: formState.dimensions ? formState.dimensions : null,
    };
    
    // Ensure images is properly formatted as flat array for backend
    if (payload.images && Array.isArray(payload.images)) {
      payload.images = payload.images.flat();
    }
    
    try {
      await dispatch(
        createAdsList({
          formData: payload,
          user: userDetails,
          businessStore: businessStore,
          storeDetail: storeDetail,
          isAdmin: false
        })
      ).unwrap();
      toast.success(
        packageFields.is_paid
          ? "Payment verified — your paid listing is live"
          : "Your item post is created"
      );
      navigate("/");
    } catch (error) {
      alert(error);
      throw error;
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
                You need to complete your profile information before you can post an ad. This helps us provide better service and builds trust with potential buyers.
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
            <div className="page-container">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                  Post New Item Ad
                </h1>
                <p className="text-blue-100 text-lg">
                  Create your item listing for sale, swap, or giveaway
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
                      <FaBox className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Item Details</h2>
                      <p className="text-sm text-muted-foreground">Fill in your item information</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Ad Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formState.title}
                        placeholder="Enter a descriptive title for your item"
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Item Type *
                        </label>
                        <select
                          name="item_type"
                          value={formState.item_type}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="for_sale">For Sale</option>
                          <option value="for_swap">For Swap</option>
                          <option value="give_away">Give Away</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Condition *
                        </label>
                        <select
                          name="condition"
                          value={formState.condition}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        >
                          <option value="">Select Condition</option>
                          <option value="new">New</option>
                          <option value="like_new">Like New</option>
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Brand
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={formState.brand}
                          placeholder="e.g., Apple, Samsung, Nike"
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Model
                        </label>
                        <input
                          type="text"
                          name="model"
                          value={formState.model}
                          placeholder="e.g., iPhone 14, Galaxy S23"
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Color
                        </label>
                        <input
                          type="text"
                          name="color"
                          value={formState.color}
                          placeholder="e.g., Black, White, Blue"
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Dimensions
                        </label>
                        <input
                          type="text"
                          name="dimensions"
                          value={formState.dimensions}
                          placeholder="e.g., 10x5x3 inches"
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="weight"
                          value={formState.weight}
                          placeholder="e.g., 2.5"
                          step="0.1"
                          min="0"
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
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
                        <FaImage className={`h-8 w-8 mx-auto mb-2 transition-colors ${
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

                    {/* Price section - only show if not give away */}
                    {formState.item_type !== "give_away" && (
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
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Price *
                          </label>
                          <div className="relative">
                            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                              type="number"
                              name="price"
                              min="0"
                              value={formState.price}
                              onChange={handleChange}
                              className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              placeholder="Enter price"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Description *
                      </label>
                      <div className="border border-input rounded-md">
                        <ReactQuill
                          ref={quillRef}
                          value={formState.description}
                          onChange={(value) => {
                            setFormState({ ...formState, description: value });
                          }}
                          style={{ 
                            height: "200px",
                            marginBottom: "42px"
                          }}
                          theme="snow"
                          placeholder="Describe your item in detail including features, usage history, reason for selling/swapping, etc..."
                        />
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
                    className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 text-sm font-medium transition-colors"
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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 rounded-t-lg">
                <div className="px-6 text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Boost Your Listing
                  </h1>
                  <p className="text-blue-100">
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
            postType={"ads"}
            onBack={() => setScreen("upsells")}
            onSubmit={(item, payment) => onSubmit(item, payment)}
          />
        </div>
      )}
      
      {/* Profile Completion Modal */}
      <ProfileModal />
    </div>
  );
}

export default PostItems;
