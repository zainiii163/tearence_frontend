import React, { useEffect, useState, useCallback } from "react";
import { FaArrowLeft, FaImage, FaTag, FaDollarSign, FaCheck, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import Navbar from "../../Component/Navbar";
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
import api from "../../api";

function PostEvents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug, id } = useParams();
  const quillRef = React.useRef(null); // Add ref for ReactQuill
  
  // Detect event type from URL path
  const getEventTypeFromUrl = () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/conference')) return 'conference-academic';
    if (currentPath.includes('/concert')) return 'concert-rock';
    if (currentPath.includes('/festival')) return 'festival-music';
    return '';
  };
  const initialFormState = {
    title: "",
    images: [],
    category_id: id,
    user_id: "",
    currency_id: 0,
    price: "",
    description: "",
    event_date: "",
    event_time: "",
    event_end_time: "",
    location: "",
    venue: "",
    event_type: getEventTypeFromUrl(), // Auto-detect from URL
    organizer: "",
    contact_info: "",
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
  const [showVenueSearch, setShowVenueSearch] = useState(false);
  const [venues, setVenues] = useState([]);
  const [venueSearchTerm, setVenueSearchTerm] = useState("");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const categoryAdsData = useSelector((store) => store.categories.catTreeChild);
  const SubCatPost = categoryAdsData?.data || [];

  const catMasterData = useSelector((store) => store.categories.currency);
  const CatMaster = catMasterData?.data || [];
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || store.auth?.userDetail || {});



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

  const searchVenues = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setVenues([]);
      return;
    }

    try {
      setLoadingVenues(true);
      const response = await api.get(`/venues?search=${encodeURIComponent(searchTerm)}&limit=5`);
      
      if (response.data.status === 'Success') {
        setVenues(response.data.data.venues || []);
      } else {
        // Use mock data for now
        setVenues(getMockVenues(searchTerm));
      }
    } catch (error) {
      console.error('Error searching venues:', error);
      // Use mock data on error
      setVenues(getMockVenues(searchTerm));
    } finally {
      setLoadingVenues(false);
    }
  }, []);

  const getMockVenues = (searchTerm) => {
    const mockVenues = [
      {
        id: 1,
        name: "Grand Ballroom Plaza",
        venue_type: "hotel_ballroom",
        city: "New York",
        country: "USA",
        address: "123 Grand Avenue, Manhattan"
      },
      {
        id: 2,
        name: "Rooftop Garden Lounge",
        venue_type: "rooftop",
        city: "Los Angeles",
        country: "USA",
        address: "456 Sunset Blvd"
      },
      {
        id: 3,
        name: "Modern Conference Center",
        venue_type: "conference_hall",
        city: "London",
        country: "UK",
        address: "789 Business Park"
      }
    ];

    return mockVenues.filter(venue => 
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const selectVenue = (venue) => {
    setSelectedVenue(venue);
    setFormState({
      ...formState,
      venue: venue.name,
      location: `${venue.city}, ${venue.country}`,
      venue_id: venue.id
    });
    setShowVenueSearch(false);
    setVenueSearchTerm("");
    setVenues([]);
  };

  const clearSelectedVenue = () => {
    setSelectedVenue(null);
    setFormState({
      ...formState,
      venue: "",
      venue_id: null
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchVenues(venueSearchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [venueSearchTerm, searchVenues]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showVenueSearch && !event.target.closest('.venue-search-container')) {
        setShowVenueSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVenueSearch]);
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
      formState.event_type === "" ||
      formState.event_date === "" ||
      formState.event_time === "" ||
      formState.location === "" ||
      formState.venue === "" ||
      formState.organizer === "" ||
      formState.contact_info === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!formState.images || formState.images.length === 0) {
      alert("Please select at least one image.");
      return;
    }
    // Price is optional for events (some events may be free)
    if (formState.price !== "" && parseFloat(formState.price) < 0) {
      alert("Price cannot be negative.");
      return;
    }
    setTimeout(() => {
      setScreen("upsells");
    }, 100);
    // // console.log(formState);
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

    const payload = {
      ...formState,
      location_id: userDetails.location.location_id,
      user_id: userDetails.customer_id,
      package: item,
      package_id: item.package_id,
      currency_id: formState.price ? parseInt(formState.currency_id) : 0,
      // Add selected upsells
      upsells: Object.keys(selectedUpsells).filter(key => selectedUpsells[key]),
      is_paid: selectedUpsells.paid || false,
      is_featured: selectedUpsells.featured || false,
      is_promoted: selectedUpsells.promoted || false,
      is_sponsored: selectedUpsells.sponsored || false,
      is_business: selectedUpsells.business || false,
      is_store: selectedUpsells.store || false,
    };
    
    // Ensure images is properly formatted as flat array for backend
    if (payload.images && Array.isArray(payload.images)) {
      payload.images = payload.images.flat();
    }
    
    console.log(payload);
    try {
      await dispatch(
        createAdsList({
          formData: payload,
        })
      ).unwrap();
      toast.success("Your post is created");
      navigate("/");
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
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {formState.event_type.startsWith('festival') 
                    ? 'Post Festival Event' 
                    : formState.event_type.startsWith('conference')
                    ? 'Post Conference Event'
                    : formState.event_type.startsWith('concert')
                    ? 'Post Concert Event'
                    : `Post New ${slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Event'} Ad`
                  }
                </h1>
                <p className="text-blue-100 text-lg">
                  Create and promote your {formState.event_type.startsWith('festival') ? 'festival' : formState.event_type.startsWith('conference') ? 'conference' : formState.event_type.startsWith('concert') ? 'concert' : 'event'} to reach thousands of potential attendees
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="rounded-lg border bg-card shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FaTag className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Ad Details</h2>
                      <p className="text-sm text-muted-foreground">Fill in your ad information</p>
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
                        placeholder="Enter a descriptive title for your ad"
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Event Type *
                        </label>
                        {formState.event_type && (
                          <div className="text-xs text-primary bg-primary/10 p-2 rounded-md mb-2">
                            Event type pre-selected based on your choice. You can change it if needed.
                          </div>
                        )}
                        <select
                          name="event_type"
                          value={formState.event_type}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        >
                          <option value="">Select Event Type</option>
                          <optgroup label="Conferences">
                            <option value="conference-academic">Academic Conference</option>
                            <option value="conference-business">Business Conference</option>
                            <option value="conference-tech">Technology Conference</option>
                            <option value="conference-medical">Medical Conference</option>
                            <option value="conference-trade">Trade Show/Exhibition</option>
                          </optgroup>
                          <optgroup label="Concerts">
                            <option value="concert-classical">Classical Concert</option>
                            <option value="concert-rock">Rock/Pop Concert</option>
                            <option value="concert-jazz">Jazz Concert</option>
                            <option value="concert-electronic">Electronic/DJ Concert</option>
                            <option value="concert-folk">Folk/Traditional Concert</option>
                          </optgroup>
                          <optgroup label="Festivals">
                            <option value="festival-music">Music Festival</option>
                            <option value="festival-food">Food Festival</option>
                            <option value="festival-art">Art Festival</option>
                            <option value="festival-film">Film Festival</option>
                            <option value="festival-cultural">Cultural Festival</option>
                            <option value="festival-religious">Religious Festival</option>
                          </optgroup>
                          <optgroup label="Special Occasions">
                            <option value="occasion-wedding">Wedding Reception</option>
                            <option value="occasion-birthday">Birthday Party</option>
                            <option value="occasion-anniversary">Anniversary Celebration</option>
                            <option value="occasion-graduation">Graduation Ceremony</option>
                            <option value="occasion-corporate">Corporate Event</option>
                            <option value="occasion-charity">Charity Gala/Fundraiser</option>
                          </optgroup>
                          <optgroup label="Other Events">
                            <option value="workshop">Workshop</option>
                            <option value="seminar">Seminar</option>
                            <option value="sports">Sports Event</option>
                            <option value="exhibition">Exhibition</option>
                            <option value="other">Other</option>
                          </optgroup>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Event Date *
                        </label>
                        <input
                          type="date"
                          name="event_date"
                          value={formState.event_date}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Start Time *
                        </label>
                        <input
                          type="time"
                          name="event_time"
                          value={formState.event_time}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          End Time
                        </label>
                        <input
                          type="time"
                          name="event_end_time"
                          value={formState.event_end_time}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                    </div>

                    {/* Dynamic Fields Based on Event Type */}
                    {formState.event_type && (
                      <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
                        <h3 className="text-sm font-medium text-foreground mb-4">
                          {formState.event_type.startsWith('conference') && 'Conference Details'}
                          {formState.event_type.startsWith('concert') && 'Concert Details'}
                          {formState.event_type.startsWith('festival') && 'Festival Details'}
                          {formState.event_type.startsWith('occasion') && 'Special Occasion Details'}
                        </h3>
                        
                        {/* Conference-specific fields */}
                        {formState.event_type.startsWith('conference') && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Speakers/Presenters
                              </label>
                              <input
                                type="text"
                                name="speakers"
                                value={formState.speakers || ''}
                                onChange={handleChange}
                                placeholder="Key speakers or presenters"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Topics Covered
                              </label>
                              <input
                                type="text"
                                name="topics"
                                value={formState.topics || ''}
                                onChange={handleChange}
                                placeholder="Main topics or themes"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Registration Required
                              </label>
                              <select
                                name="registration_required"
                                value={formState.registration_required || ''}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select</option>
                                <option value="yes">Yes, registration required</option>
                                <option value="no">No registration needed</option>
                                <option value="optional">Optional registration</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Certificate Provided
                              </label>
                              <select
                                name="certificate_provided"
                                value={formState.certificate_provided || ''}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Concert-specific fields */}
                        {formState.event_type.startsWith('concert') && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Artists/Performers
                              </label>
                              <input
                                type="text"
                                name="artists"
                                value={formState.artists || ''}
                                onChange={handleChange}
                                placeholder="Main artists or performers"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Music Genre
                              </label>
                              <select
                                name="music_genre"
                                value={formState.music_genre || ''}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select Genre</option>
                                <option value="rock">Rock</option>
                                <option value="pop">Pop</option>
                                <option value="classical">Classical</option>
                                <option value="jazz">Jazz</option>
                                <option value="electronic">Electronic</option>
                                <option value="folk">Folk</option>
                                <option value="metal">Metal</option>
                                <option value="hip-hop">Hip-Hop</option>
                                <option value="country">Country</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Age Restriction
                              </label>
                              <select
                                name="age_restriction"
                                value={formState.age_restriction || ''}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select</option>
                                <option value="all">All Ages</option>
                                <option value="18+">18+</option>
                                <option value="21+">21+</option>
                                <option value="16+">16+</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Seating Type
                              </label>
                              <select
                                name="seating_type"
                                value={formState.seating_type || ''}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select</option>
                                <option value="assigned">Assigned Seating</option>
                                <option value="general">General Admission</option>
                                <option value="standing">Standing Only</option>
                                <option value="mixed">Mixed Seating</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Festival-specific fields */}
                        {formState.event_type.startsWith('festival') && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Festival Duration
                              </label>
                              <select
                                name="duration"
                                value={formState.duration || ''}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select Duration</option>
                                <option value="1-day">1 Day</option>
                                <option value="2-days">2 Days</option>
                                <option value="3-days">3 Days</option>
                                <option value="weekend">Weekend</option>
                                <option value="week">1 Week</option>
                                <option value="multiple">Multiple Days</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Multiple Venues
                              </label>
                              <select
                                name="multiple_venues"
                                value={formState.multiple_venues || ''}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select</option>
                                <option value="yes">Yes, multiple venues</option>
                                <option value="no">Single venue</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Camping Available
                              </label>
                              <select
                                name="camping"
                                value={formState.camping || ''}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                                <option value="nearby">Nearby facilities</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Food & Drinks
                              </label>
                              <select
                                name="food_drinks"
                                value={formState.food_drinks || ''}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select</option>
                                <option value="included">Included</option>
                                <option value="available">Available for purchase</option>
                                <option value="outside">Outside food allowed</option>
                                <option value="restricted">Restricted</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Special Occasion-specific fields */}
                        {formState.event_type.startsWith('occasion') && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Event Theme
                              </label>
                              <input
                                type="text"
                                name="event_theme"
                                value={formState.event_theme || ''}
                                onChange={handleChange}
                                placeholder="e.g., Formal, Casual, Theme Party"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Dress Code
                              </label>
                              <input
                                type="text"
                                name="dress_code"
                                value={formState.dress_code || ''}
                                onChange={handleChange}
                                placeholder="e.g., Black Tie, Casual, Traditional"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Expected Guests
                              </label>
                              <input
                                type="number"
                                name="expected_guests"
                                value={formState.expected_guests || ''}
                                onChange={handleChange}
                                placeholder="Number of expected guests"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-2 block">
                                Catering Available
                              </label>
                              <select
                                name="catering"
                                value={formState.catering || ''}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select</option>
                                <option value="full">Full Catering</option>
                                <option value="partial">Partial Catering</option>
                                <option value="drinks">Drinks Only</option>
                                <option value="none">No Catering</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Location *
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formState.location}
                          placeholder="e.g., New York, London, Dubai"
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Venue *
                        </label>
                        <div className="relative venue-search-container">
                          {selectedVenue ? (
                            <div className="flex items-center gap-2 p-3 border border-input rounded-md bg-muted/30">
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{selectedVenue.name}</p>
                                <p className="text-sm text-muted-foreground">{selectedVenue.city}, {selectedVenue.country}</p>
                              </div>
                              <button
                                type="button"
                                onClick={clearSelectedVenue}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <FaTimes className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <input
                                type="text"
                                name="venue"
                                value={formState.venue}
                                placeholder="Search for a venue or enter manually"
                                onChange={(e) => {
                                  handleChange(e);
                                  setVenueSearchTerm(e.target.value);
                                  setShowVenueSearch(true);
                                }}
                                onFocus={() => setShowVenueSearch(true)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                              />
                              {showVenueSearch && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                  {loadingVenues ? (
                                    <div className="p-3 text-center text-muted-foreground">
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto"></div>
                                    </div>
                                  ) : venues.length > 0 ? (
                                    venues.map(venue => (
                                      <button
                                        key={venue.id}
                                        type="button"
                                        onClick={() => selectVenue(venue)}
                                        className="w-full p-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
                                      >
                                        <p className="font-medium text-foreground">{venue.name}</p>
                                        <p className="text-sm text-muted-foreground">{venue.city}, {venue.country}</p>
                                        <p className="text-xs text-muted-foreground truncate">{venue.address}</p>
                                      </button>
                                    ))
                                  ) : venueSearchTerm ? (
                                    <div className="p-3 text-center text-muted-foreground">
                                      <p>No venues found</p>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShowVenueSearch(false);
                                          toast.info("Consider posting your venue first!");
                                        }}
                                        className="text-primary hover:text-primary/80 underline text-sm mt-1"
                                      >
                                        Post a new venue
                                      </button>
                                    </div>
                                  ) : null}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Search from existing venues or enter manually
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Organizer *
                        </label>
                        <input
                          type="text"
                          name="organizer"
                          value={formState.organizer}
                          placeholder="Event organizer name"
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Contact Information *
                        </label>
                        <input
                          type="text"
                          name="contact_info"
                          value={formState.contact_info}
                          placeholder="Email, phone, or website"
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          required
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
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_free_event"
                          checked={!formState.price}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormState({ ...formState, price: "", currency_id: "0" });
                            }
                          }}
                          className="h-4 w-4 rounded border border-input text-primary focus:ring-primary"
                        />
                        <label htmlFor="is_free_event" className="text-sm font-medium text-foreground">
                          This is a free event
                        </label>
                      </div>

                      {!formState.price || formState.price === "" ? (
                        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                          Free events don't require pricing information
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Currency
                            </label>
                            <select
                              name="currency_id"
                              value={formState.currency_id}
                              onChange={handleChange}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                              Price
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
                              />
                            </div>
                          </div>
                        </div>
                      )}
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
                          placeholder="Enter a detailed description of your event..."
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
          <div className="container mx-auto px-4 py-8">
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
}

export default PostEvents;
