import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaImage, FaMapMarkerAlt, FaPhone, FaStar, FaCheck, FaExclamationTriangle, FaTimes, FaWifi, FaCar, FaGlassCheers, FaMusic, FaUtensils, FaHotel } from "react-icons/fa";
import Navbar from "../../Component/Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../slice/AuthSlice";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../../api";

function PostVenue() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const quillRef = React.useRef(null);
  
  const initialFormState = {
    name: "",
    images: [],
    description: "",
    venue_type: "",
    capacity: "",
    location: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    latitude: "",
    longitude: "",
    contact_phone: "",
    contact_email: "",
    website: "",
    price_range: "",
    amenities: [],
    availability: "",
    booking_requirements: "",
    cancellation_policy: "",
    social_media: {
      facebook: "",
      instagram: "",
      twitter: ""
    },
    operating_hours: {
      monday: { open: "", close: "", closed: false },
      tuesday: { open: "", close: "", closed: false },
      wednesday: { open: "", close: "", closed: false },
      thursday: { open: "", close: "", closed: false },
      friday: { open: "", close: "", closed: false },
      saturday: { open: "", close: "", closed: false },
      sunday: { open: "", close: "", closed: false }
    }
  };

  const [formState, setFormState] = useState(initialFormState);
  const [screen, setScreen] = useState("form");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || store.auth?.userDetail || {});

  const venueTypes = [
    { value: "conference_hall", label: "Conference Hall", icon: "🏢" },
    { value: "hotel_ballroom", label: "Hotel Ballroom", icon: "🏨" },
    { value: "restaurant", label: "Restaurant", icon: "🍽️" },
    { value: "outdoor_venue", label: "Outdoor Venue", icon: "🌳" },
    { value: "theater", label: "Theater", icon: "🎭" },
    { value: "gallery", label: "Art Gallery", icon: "🎨" },
    { value: "club", label: "Nightclub", icon: "🎵" },
    { value: "stadium", label: "Stadium/Arena", icon: "🏟️" },
    { value: "community_center", label: "Community Center", icon: "🏛️" },
    { value: "rooftop", label: "Rooftop Venue", icon: "🏙️" },
    { value: "beach", label: "Beach Venue", icon: "🏖️" },
    { value: "garden", label: "Garden", icon: "🌺" },
    { value: "museum", label: "Museum", icon: "🏛️" },
    { value: "warehouse", label: "Warehouse/Loft", icon: "🏭" },
    { value: "church", label: "Church/Religious Venue", icon: "⛪" },
    { value: "other", label: "Other", icon: "📍" }
  ];

  const amenitiesOptions = [
    { id: "wifi", label: "WiFi", icon: FaWifi },
    { id: "parking", label: "Parking", icon: FaCar },
    { id: "bar", label: "Bar Service", icon: FaGlassCheers },
    { id: "sound_system", label: "Sound System", icon: FaMusic },
    { id: "catering", label: "Catering", icon: FaUtensils },
    { id: "accommodation", label: "Accommodation", icon: FaHotel },
    { id: "projector", label: "Projector", icon: "📽️" },
    { id: "air_conditioning", label: "Air Conditioning", icon: "❄️" },
    { id: "wheelchair_accessible", label: "Wheelchair Accessible", icon: "♿" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "stage", label: "Stage", icon: "🎪" },
    { id: "lighting", label: "Professional Lighting", icon: "💡" }
  ];

  const priceRanges = [
    { value: "budget", label: "Budget ($)", description: "Under $500/day" },
    { value: "moderate", label: "Moderate ($$)", description: "$500 - $2,000/day" },
    { value: "premium", label: "Premium ($$$)", description: "$2,000 - $5,000/day" },
    { value: "luxury", label: "Luxury ($$$$)", description: "Over $5,000/day" }
  ];

  useEffect(() => {
    if (!userDetails) {
      dispatch(getUserDetails());
    } else {
      if (userDetails.location === null) {
        setShowProfileModal(true);
      }
    }
  }, [userDetails, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormState({
        ...formState,
        [name]: files[0],
      });
    } else if (name.includes("operating_hours.")) {
      const [day, field] = name.split(".").slice(1);
      setFormState({
        ...formState,
        operating_hours: {
          ...formState.operating_hours,
          [day]: {
            ...formState.operating_hours[day],
            [field]: value
          }
        }
      });
    } else if (name.includes("social_media.")) {
      const platform = name.split(".")[1];
      setFormState({
        ...formState,
        social_media: {
          ...formState.social_media,
          [platform]: value
        }
      });
    } else {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setFormState(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files) {
      const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`);
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
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
      const fakeEvent = {
        target: { files: files }
      };
      handleFileChange(fakeEvent);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['name', 'venue_type', 'location', 'address', 'city', 'country', 'contact_phone', 'description'];
    const missingFields = requiredFields.filter(field => !formState[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!formState.images || formState.images.length === 0) {
      toast.error("Please upload at least one image of the venue.");
      return;
    }

    if (formState.capacity && (parseInt(formState.capacity) < 1 || parseInt(formState.capacity) > 50000)) {
      toast.error("Capacity must be between 1 and 50,000.");
      return;
    }

    setScreen("review");
  };

  const onSubmit = async () => {
    if (!userDetails) {
      toast.error("User information not available. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        ...formState,
        user_id: userDetails.customer_id,
        location_id: userDetails.location?.location_id || null,
        images: formState.images.flat(),
        capacity: formState.capacity ? parseInt(formState.capacity) : null,
        latitude: formState.latitude ? parseFloat(formState.latitude) : null,
        longitude: formState.longitude ? parseFloat(formState.longitude) : null,
      };

      const response = await api.post('/venues', payload);
      
      if (response.data.status === 'Success') {
        toast.success("Your venue has been posted successfully!");
        navigate('/venues');
      } else {
        throw new Error(response.data.message || 'Failed to post venue');
      }
    } catch (error) {
      console.error('Error posting venue:', error);
      toast.error(error.message || "Failed to post venue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ProfileModal = () => {
    if (!showProfileModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowProfileModal(false)}
        />
        
        <div className="relative bg-card border rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
          <button
            onClick={() => setShowProfileModal(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <FaTimes className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <FaExclamationTriangle className="h-6 w-6 text-yellow-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Complete Your Profile
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                You need to complete your profile information before you can post a venue. This helps us provide better service and builds trust with potential customers.
              </p>
            </div>

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

  if (screen === "review") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 rounded-t-lg">
                <div className="px-6 text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Review Your Venue
                  </h1>
                  <p className="text-blue-100">
                    Please review your venue details before posting
                  </p>
                </div>
              </div>

              <div className="bg-card border-x border-b rounded-b-lg p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Venue Details</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {formState.name}</p>
                        <p><strong>Type:</strong> {venueTypes.find(t => t.value === formState.venue_type)?.label}</p>
                        <p><strong>Capacity:</strong> {formState.capacity || 'Not specified'}</p>
                        <p><strong>Price Range:</strong> {priceRanges.find(r => r.value === formState.price_range)?.label}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Location</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Address:</strong> {formState.address}</p>
                        <p><strong>City:</strong> {formState.city}</p>
                        <p><strong>Country:</strong> {formState.country}</p>
                        <p><strong>Postal Code:</strong> {formState.postal_code || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <div 
                      className="text-sm bg-muted/50 p-4 rounded-md"
                      dangerouslySetInnerHTML={{ __html: formState.description }}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {formState.amenities.map(amenityId => {
                        const amenity = amenitiesOptions.find(a => a.id === amenityId);
                        return (
                          <span key={amenityId} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                            {amenity?.label}
                          </span>
                        );
                      })}
                      {formState.amenities.length === 0 && (
                        <span className="text-muted-foreground text-sm">No amenities selected</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {formState.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Venue ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-input"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setScreen("form")}
                    className="inline-flex items-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <FaArrowLeft className="h-4 w-4" />
                    Back to Edit
                  </button>
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>Posting Venue...</>
                    ) : (
                      <>
                        <FaCheck className="h-4 w-4" />
                        Post Venue
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Post Your Venue
              </h1>
              <p className="text-blue-100 text-lg">
                List your venue and reach event organizers worldwide
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="rounded-lg border bg-card shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaMapMarkerAlt className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Venue Information</h2>
                    <p className="text-sm text-muted-foreground">Basic details about your venue</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Venue Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      placeholder="Enter your venue name"
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Venue Type *
                      </label>
                      <select
                        name="venue_type"
                        value={formState.venue_type}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Select Venue Type</option>
                        {venueTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Capacity
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={formState.capacity}
                        placeholder="Maximum number of guests"
                        onChange={handleChange}
                        min="1"
                        max="50000"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Price Range
                    </label>
                    <select
                      name="price_range"
                      value={formState.price_range}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select Price Range</option>
                      {priceRanges.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label} - {range.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Description *
                    </label>
                    <div className="border border-input rounded-md">
                      <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={formState.description}
                        onChange={(value) => setFormState({ ...formState, description: value })}
                        placeholder="Describe your venue, its unique features, atmosphere, and what makes it perfect for events..."
                        modules={{
                          toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote'],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'color': [] }, { 'background': [] }],
                            ['link', 'image'],
                            ['clean']
                          ],
                        }}
                        formats={[
                          'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                          'list', 'bullet', 'color', 'background', 'link', 'image'
                        ]}
                        style={{ minHeight: '200px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaMapMarkerAlt className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Location Details</h2>
                    <p className="text-sm text-muted-foreground">Where is your venue located?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formState.address}
                        placeholder="Street address"
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formState.city}
                        placeholder="City"
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formState.country}
                        placeholder="Country"
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formState.postal_code}
                        placeholder="Postal/ZIP code"
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Latitude (Optional)
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={formState.latitude}
                        placeholder="e.g., 40.7128"
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Longitude (Optional)
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={formState.longitude}
                        placeholder="e.g., -74.0060"
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaPhone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
                    <p className="text-sm text-muted-foreground">How can people reach you?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="contact_phone"
                        value={formState.contact_phone}
                        placeholder="+1 (555) 123-4567"
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="contact_email"
                        value={formState.contact_email}
                        placeholder="contact@venue.com"
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formState.website}
                      placeholder="https://yourvenue.com"
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaStar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Amenities</h2>
                    <p className="text-sm text-muted-foreground">What facilities does your venue offer?</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {amenitiesOptions.map(amenity => {
                    const Icon = amenity.icon;
                    const isSelected = formState.amenities.includes(amenity.id);
                    
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`p-3 rounded-lg border transition-all duration-200 text-sm font-medium ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-input hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <Icon className="h-6 w-6" />
                          <span>{amenity.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border bg-card shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaImage className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Venue Images *</h2>
                    <p className="text-sm text-muted-foreground">Showcase your venue with high-quality photos</p>
                  </div>
                </div>

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
                    id="venue-image-upload"
                    required
                  />
                  <label
                    htmlFor="venue-image-upload"
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
                
                {formState.images && formState.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-foreground mb-2">
                      Selected Images ({formState.images.length})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {formState.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Venue ${index + 1}`}
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
                  Continue to Review
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <ProfileModal />
    </div>
  );
}

export default PostVenue;
