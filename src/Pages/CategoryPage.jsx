import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiGrid, FiList, FiArrowLeft, FiPlus } from 'react-icons/fi';
import { FaTags, FaSpinner, FaBriefcase, FaIndustry, FaMapMarkerAlt, FaSearch, FaStar, FaPhone, FaGlobe, FaUsers, FaDollarSign, FaHeart, FaShare, FaCalendarAlt, FaTicketAlt, FaPlus } from 'react-icons/fa';
import CategoryServices from '../services/CategoryServices';
import ListServices from '../services/ListServices';
import CategoryItem from '../Component/CategoryPage/CategoryItem';
import DynamicFilters from '../Component/CategoryPage/DynamicFilters';
import AIAssistedFilters from '../Component/CategoryPage/AIAssistedFilters';
import UpsellModal from '../Component/UpsellModal';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import BackButton from '../Component/BackButton';
import { getSampleAdsForCategory } from '../data/sampleAds';
import api from '../api';
import toast from 'react-hot-toast';

const CategoryPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [listings, setListings] = useState([]);
  const [filteredAndSorted, setFilteredAndSorted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [listingsPage, setListingsPage] = useState(1);
  const [listingsTotalPages, setListingsTotalPages] = useState(1);
  const itemsPerPage = 12;
  
  // Parse the full path to get event subcategory
  const getFullSlug = () => {
    const pathParts = location.pathname.split('/');
    const categoryIndex = pathParts.indexOf('category');
    if (categoryIndex !== -1 && pathParts[categoryIndex + 1]) {
      return pathParts.slice(categoryIndex + 1).join('/');
    }
    return slug;
  };
  
  const fullSlug = getFullSlug();
  const isEventsCategory = fullSlug.startsWith('events');
  const eventSubtype = isEventsCategory && fullSlug.includes('/') ? fullSlug.split('/')[1] : null;
  
  // Events-specific state
  const [venues, setVenues] = useState([]);
  const [activeTab, setActiveTab] = useState('venues'); // 'venues' or 'events'
  const [venueSearchTerm, setVenueSearchTerm] = useState('');
  const [selectedVenueType, setSelectedVenueType] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Venue-related constants
  const venueTypes = [
    { value: "conference_hall", label: "Conference Hall" },
    { value: "hotel_ballroom", label: "Hotel Ballroom" },
    { value: "restaurant", label: "Restaurant" },
    { value: "outdoor_venue", label: "Outdoor Venue" },
    { value: "theater", label: "Theater" },
    { value: "gallery", label: "Art Gallery" },
    { value: "club", label: "Nightclub" },
    { value: "stadium", label: "Stadium/Arena" },
    { value: "community_center", label: "Community Center" },
    { value: "rooftop", label: "Rooftop Venue" },
    { value: "beach", label: "Beach Venue" },
    { value: "garden", label: "Garden" },
    { value: "museum", label: "Museum" },
    { value: "warehouse", label: "Warehouse/Loft" },
    { value: "church", label: "Church/Religious Venue" },
    { value: "other", label: "Other" }
  ];

  const priceRanges = [
    { value: "budget", label: "Budget ($)" },
    { value: "moderate", label: "Moderate ($$)" },
    { value: "premium", label: "Premium ($$$)" },
    { value: "luxury", label: "Luxury ($$$$)" }
  ];

  const amenitiesIcons = {
    wifi: "📶",
    parking: "🚗",
    bar: "🍷",
    sound_system: "🔊",
    catering: "🍽️",
    accommodation: "🏨",
    projector: "📽️",
    air_conditioning: "❄️",
    wheelchair_accessible: "♿",
    security: "🔒",
    stage: "🎪",
    lighting: "💡"
  };

  const sortListings = useCallback((listingsToSort) => {
    const sorted = [...listingsToSort];
    
    switch (sortBy) {
      case 'priority':
        return sorted.sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));
      case 'price_low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
      default:
        return sorted;
    }
  }, [sortBy]);

  // Filter and sort listings
  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...listings];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(listing => {
        const title = listing.title || '';
        const head = listing.head || '';
        const description = listing.description || '';
        
        return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               head.toLowerCase().includes(searchTerm.toLowerCase()) ||
               description.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    // Apply category-specific filters
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        switch (key) {
          case 'priceRange':
            if (value.includes('-')) {
              const [min, max] = value.split('-').map(Number);
              filtered = filtered.filter(listing => {
                const price = listing.price || 0;
                return price >= min && (max === 999999 ? true : price <= max);
              });
            }
            break;
          case 'location':
            filtered = filtered.filter(listing => {
              const location = listing.location;
              if (typeof location === 'string') {
                return location.toLowerCase().includes(value.toLowerCase());
              }
              if (typeof location === 'object') {
                return location.city?.toLowerCase().includes(value.toLowerCase()) ||
                       location.zone_name?.toLowerCase().includes(value.toLowerCase()) ||
                       location.country_name?.toLowerCase().includes(value.toLowerCase());
              }
              return false;
            });
            break;
          case 'condition':
            filtered = filtered.filter(listing => 
              listing.condition?.toLowerCase() === value.toLowerCase()
            );
            break;
          case 'vehicleType':
            filtered = filtered.filter(listing => 
              listing.vehicle_type?.toLowerCase() === value.toLowerCase()
            );
            break;
          case 'propertyType':
            filtered = filtered.filter(listing => 
              listing.property_type?.toLowerCase() === value.toLowerCase()
            );
            break;
          // Add more filter cases as needed
          default:
            // Generic filter - check if the listing has a matching property
            filtered = filtered.filter(listing => {
              const listingValue = listing[key];
              if (typeof listingValue === 'string') {
                return listingValue.toLowerCase().includes(value.toLowerCase());
              }
              return false;
            });
        }
      }
    });
    
    // Apply sorting
    const sorted = sortListings(filtered);
    
    // Calculate pagination
    const startIndex = (listingsPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = sorted.slice(startIndex, endIndex);
    
    setFilteredAndSorted(paginatedResults);
    setListingsTotalPages(Math.ceil(sorted.length / itemsPerPage));
  }, [listings, searchTerm, selectedFilters, listingsPage, itemsPerPage, sortListings]);

  // Apply filters and sort whenever dependencies change
  useEffect(() => {
    if (!isEventsCategory) {
      applyFiltersAndSort();
    }
  }, [applyFiltersAndSort, isEventsCategory]);

  // Filter handlers
  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setListingsPage(1); // Reset to first page when filters change
  };

  const handleRemoveFilter = (key) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setListingsPage(1);
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({});
    setSearchTerm('');
    setListingsPage(1);
  };

  const fetchListings = useCallback(async () => {
    try {
      let response;
      let listingsData = [];
      
      if (isEventsCategory) {
        // For events, we'll handle venues separately
        return;
      } else if (fullSlug === 'book') {
        response = await ListServices.getBooksList(0, 20);
        let bookData = response.data?.items || response.data?.data?.items || response.data || [];
        
        if (!Array.isArray(bookData) && bookData.items) {
          bookData = bookData.items;
        }
        
        listingsData = Array.isArray(bookData) ? bookData.map(book => ({
          listing_id: book.id || book.book_id,
          title: book.title,
          description: book.short_description || book.description,
          price: book.price,
          currency: { symbol: '$' },
          images: book.image_url ? [{ image_path: book.image_url }] : [],
          slug: book.id || book.book_id,
          link_url: book.link_url,
          upsells: book.upsells || [],
          priority_score: book.priority_score || 0,
          category: currentCategory
        })) : [];
      } else {
        response = await ListServices.getAdsList(fullSlug, 0, 20);
        listingsData = response.data?.data?.items || [];
        
        listingsData = listingsData.map(ad => ({
          ...ad,
          upsells: ad.upsells || [],
          priority_score: ad.priority_score || 0
        }));
      }
      
      // If no real listings found, use sample data
      if (listingsData.length === 0) {
        listingsData = getSampleAdsForCategory(fullSlug);
      }
      
      setListings(listingsData);
    } catch (error) {
      console.error('Error fetching listings:', error);
      // On error, use sample data as fallback
      const sampleData = getSampleAdsForCategory(fullSlug);
      setListings(sampleData);
    }
  }, [fullSlug, isEventsCategory, currentCategory]);

  const fetchCategoryData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch current category details
      const categoryResponse = await CategoryServices.detailsCategory(fullSlug);
      if (categoryResponse.data?.success) {
        setCurrentCategory(categoryResponse.data.data);
      }

      // Fetch listings for this category
      await fetchListings();
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  }, [fullSlug, fetchListings]);

  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(venueSearchTerm && { search: venueSearchTerm }),
        ...(selectedVenueType && { venue_type: selectedVenueType }),
        ...(selectedPriceRange && { price_range: selectedPriceRange }),
        ...(selectedCity && { city: selectedCity })
      });

      const response = await api.get(`/events-venues?${params}`);
      
      if (response.data.status === 'Success') {
        setVenues(response.data.data.venues || []);
        setTotalPages(response.data.data.pagination?.total_pages || 1);
      } else {
        setVenues(getMockVenues());
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      setVenues(getMockVenues());
    } finally {
      setLoading(false);
    }
  }, [currentPage, venueSearchTerm, selectedVenueType, selectedPriceRange, selectedCity]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await CategoryServices.getCategoryTree();
      if (response.data?.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (fullSlug) {
      // Redirect services category to ServicesMarketplacePage
      if (fullSlug === 'services') {
        navigate('/services-marketplace');
        return;
      }
      
      // Redirect vehicles category to new VehiclesPage
      if (fullSlug === 'vehicles' || fullSlug === 'vehicle') {
        navigate('/vehicles');
        return;
      }
      
      // Handle direct event posting redirects
      if (isEventsCategory && eventSubtype) {
        // For now, redirect to main events posting page
        // The backend should handle event type based on URL or form selection
        window.location.href = '/events-venues';
        return;
      }
      
      fetchCategoryData();
    }
  }, [fullSlug, sortBy, eventSubtype, fetchCategoryData, isEventsCategory, navigate]);

  // Additional useEffect for events-specific functionality
  useEffect(() => {
    if (isEventsCategory) {
      const savedFavorites = localStorage.getItem('favorite_venues');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [isEventsCategory]);

  useEffect(() => {
    if (isEventsCategory && activeTab === 'venues') {
      fetchVenues();
    }
  }, [isEventsCategory, activeTab, currentPage, venueSearchTerm, selectedVenueType, selectedPriceRange, selectedCity, fetchVenues]);

  const handlePostInCategory = () => {
    // Route to the dynamic posting form
    navigate(`/post/${fullSlug}`);
  };

  const handleGoBack = () => {
    // Navigate back to previous page or category menu
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/category-menu');
    }
  };

  const handleUpsellClick = (listing, closeModal) => {
    return (
      <UpsellModal
        isOpen={true}
        listing={listing}
        onClose={() => {
          closeModal();
        }}
        onSuccess={(response) => {
          console.log('Upsell purchased successfully:', response);
          fetchListings(); // Refresh listings to show updated badges
        }}
      />
    );
  };

  
  const getMockVenues = () => {
    return [
      {
        id: 1,
        name: "Grand Ballroom Plaza",
        venue_type: "hotel_ballroom",
        capacity: 500,
        price_range: "premium",
        city: "New York",
        country: "USA",
        images: ["https://images.unsplash.com/photo-1519167758483-26b7b24f6d8d?w=400"],
        description: "Elegant ballroom perfect for weddings and corporate events.",
        contact_phone: "+1 555-0123",
        website: "https://grandballroom.com",
        amenities: ["wifi", "parking", "bar", "catering", "air_conditioning"],
        rating: 4.8,
        reviews_count: 127
      },
      {
        id: 2,
        name: "Rooftop Garden Lounge",
        venue_type: "rooftop",
        capacity: 150,
        price_range: "moderate",
        city: "Los Angeles",
        country: "USA",
        images: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400"],
        description: "Stunning rooftop venue with panoramic city views.",
        contact_phone: "+1 555-0124",
        website: "https://rooftoplounge.com",
        amenities: ["wifi", "bar", "sound_system", "lighting"],
        rating: 4.6,
        reviews_count: 89
      },
      {
        id: 3,
        name: "Modern Conference Center",
        venue_type: "conference_hall",
        capacity: 1000,
        price_range: "luxury",
        city: "London",
        country: "UK",
        images: ["https://images.unsplash.com/photo-1497366214043-1365408715a5?w=400"],
        description: "State-of-the-art conference facility with advanced technology.",
        contact_phone: "+44 20-7123-4567",
        website: "https://modernconference.co.uk",
        amenities: ["wifi", "parking", "projector", "sound_system", "catering", "security"],
        rating: 4.9,
        reviews_count: 203
      }
    ];
  };

  const toggleFavorite = (venueId) => {
    const newFavorites = favorites.includes(venueId)
      ? favorites.filter(id => id !== venueId)
      : [...favorites, venueId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorite_venues', JSON.stringify(newFavorites));
    
    toast.success(favorites.includes(venueId) ? 'Removed from favorites' : 'Added to favorites');
  };

  const shareVenue = async (venue) => {
    const shareText = `Check out ${venue.name} in ${venue.city} - ${venue.description.substring(0, 100)}...`;
    const shareUrl = `${window.location.origin}/events-venues/${venue.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: venue.name,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast.success('Link copied to clipboard!');
    }
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(venueSearchTerm.toLowerCase()) ||
                         venue.description.toLowerCase().includes(venueSearchTerm.toLowerCase()) ||
                         venue.city.toLowerCase().includes(venueSearchTerm.toLowerCase());
    const matchesType = !selectedVenueType || venue.venue_type === selectedVenueType;
    const matchesPrice = !selectedPriceRange || venue.price_range === selectedPriceRange;
    const matchesCity = !selectedCity || venue.city.toLowerCase().includes(selectedCity.toLowerCase());
    
    return matchesSearch && matchesType && matchesPrice && matchesCity;
  });

  const renderCategoryBreadcrumbs = () => {
    let current = currentCategory;

    if (current) {
      // Build breadcrumb path
      const findPath = (categories, target, currentPath = []) => {
        for (const category of categories) {
          const newPath = [...currentPath, category];
          if (category.category_id === target.category_id) {
            return newPath;
          }
          if (category.children) {
            const found = findPath(category.children, target, newPath);
            if (found) return found;
          }
        }
        return null;
      };

      const pathArray = findPath(categories, current) || [current];
      
      return (
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <FiChevronRight className="h-4 w-4" />
          <Link to="/category-menu" className="hover:text-primary transition-colors">Categories</Link>
          <FiChevronRight className="h-4 w-4" />
          {pathArray.map((cat, index) => (
            <React.Fragment key={cat.category_id}>
              {index > 0 && <FiChevronRight className="h-4 w-4" />}
              {index === pathArray.length - 1 ? (
                <span className="text-gray-900 font-medium">{cat.name}</span>
              ) : (
                <Link 
                  to={`/category/${cat.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {cat.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      );
    }

    // Freadcrumb for non-existent categories
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <FiChevronRight className="h-4 w-4" />
        <Link to="/category-menu" className="hover:text-primary transition-colors">Categories</Link>
        <FiChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium capitalize">
          {fullSlug.replace(/-/g, ' ')}
        </span>
      </nav>
    );
  };

  const renderSubcategories = () => {
    if (!currentCategory?.children || currentCategory.children.length === 0) {
      return null;
    }

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Subcategories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentCategory.children.map((subcategory) => (
            <Link
              key={subcategory.category_id}
              to={`/category/${subcategory.slug}`}
              className="block p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <FaTags className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-medium text-sm">{subcategory.name}</h4>
                {subcategory.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {subcategory.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  if (loading && !currentCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
      {/* Category Header with Banner */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <BackButton 
            onClick={handleGoBack}
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50"
          />
          <button
            onClick={handlePostInCategory}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <FaPlus className="h-4 w-4 mr-2" />
            Post in {currentCategory?.name || fullSlug.replace(/-/g, ' ')}
          </button>
        </div>
        
        {renderCategoryBreadcrumbs()}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <FaTags className="h-10 w-10 text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                {currentCategory?.name || fullSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h1>
              <p className="text-white/90 text-lg leading-relaxed">
                {currentCategory?.description || `Discover amazing ${fullSlug.replace(/-/g, ' ')} opportunities in your area`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Category Stats Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-8">
              <div className="text-center group">
                <div className="text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-200">{listings.length}</div>
                <div className="text-sm text-gray-600 font-medium">Active Listings</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-200">{currentCategory?.children?.length || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Subcategories</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-200">24/7</div>
                <div className="text-sm text-gray-600 font-medium">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      {renderSubcategories()}

      {/* Jobs and Vacancies Navigation Buttons */}
      {slug === 'jobs' || slug === 'vacancies' ? (
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <Link
            to="/jobs"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 ${
              slug === 'jobs'
                ? 'bg-primary text-primary-foreground'
                : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <FaBriefcase className="h-4 w-4 mr-2" />
            Jobs
          </Link>
          <Link
            to="/vacancies"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 ${
              slug === 'vacancies'
                ? 'bg-primary text-primary-foreground'
                : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <FaIndustry className="h-4 w-4 mr-2" />
            Vacancies
          </Link>
        </div>
      ) : null}

      {/* Events-specific content */}
      {isEventsCategory && (
        <div className="mb-8">
          {/* Event Subtype Header */}
          {eventSubtype && (
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {eventSubtype} Events
              </h2>
              <p className="text-gray-600 mt-2">
                Discover and post {eventSubtype} events worldwide
              </p>
            </div>
          )}
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-1 inline-flex shadow-sm">
              <button
                onClick={() => setActiveTab("venues")}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === "venues"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <FaMapMarkerAlt className="inline mr-2" />
                Find Venues
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === "events"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <FaCalendarAlt className="inline mr-2" />
                Post Events
              </button>
            </div>
          </div>

          {activeTab === "venues" && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search venues by name, city, or description..."
                  value={venueSearchTerm}
                  onChange={(e) => setVenueSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>
          )}

          {activeTab === "venues" && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="lg:w-80">
                <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Venue Type
                      </label>
                      <select
                        value={selectedVenueType}
                        onChange={(e) => setSelectedVenueType(e.target.value)}
                        className="w-full flex h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">All Types</option>
                        {venueTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Price Range
                      </label>
                      <select
                        value={selectedPriceRange}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="w-full flex h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">All Prices</option>
                        {priceRanges.map(range => (
                          <option key={range.value} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Enter city name"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full flex h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setSelectedVenueType("");
                        setSelectedPriceRange("");
                        setSelectedCity("");
                        setVenueSearchTerm("");
                      }}
                      className="w-full inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 h-10 px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Venues Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredVenues.length} Venues Found
                  </h2>
                  <button
                    onClick={() => window.location.href = '/events-venues'}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 h-11 px-6 py-2 text-sm font-medium transition-colors shadow-sm"
                  >
                    <FaMapMarkerAlt className="h-4 w-4" />
                    Post Your Venue
                  </button>
                </div>

                {filteredVenues.length === 0 ? (
                  <div className="text-center py-12">
                    <FaMapMarkerAlt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No venues found</h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <button
                      onClick={() => {
                        setSelectedVenueType("");
                        setSelectedPriceRange("");
                        setSelectedCity("");
                        setVenueSearchTerm("");
                      }}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 h-10 px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredVenues.map((venue) => (
                      <div key={venue.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="relative">
                          <img
                            src={venue.images?.[0] || 'https://images.unsplash.com/photo-1519167758483-26b7b24f6d8d?w=400'}
                            alt={venue.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button
                              onClick={() => toggleFavorite(venue.id)}
                              className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-sm"
                            >
                              <FaHeart className={`h-4 w-4 ${favorites.includes(venue.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                            </button>
                            <button
                              onClick={() => shareVenue(venue)}
                              className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-sm"
                            >
                              <FaShare className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                              {venueTypes.find(t => t.value === venue.venue_type)?.label || venue.venue_type}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{venue.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <FaMapMarkerAlt className="h-3 w-3" />
                                <span>{venue.city}, {venue.country}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <FaStar className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-900">{venue.rating || '4.5'}</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                ({venue.reviews_count || '0'} reviews)
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {venue.description}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <FaUsers className="h-4 w-4" />
                              <span>Up to {venue.capacity || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FaDollarSign className="h-4 w-4" />
                              <span>{priceRanges.find(r => r.value === venue.price_range)?.label || 'Price on request'}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {venue.amenities?.slice(0, 4).map(amenity => (
                              <span key={amenity} className="text-lg" title={amenity.replace('_', ' ')}>
                                {amenitiesIcons[amenity] || '✨'}
                              </span>
                            ))}
                            {venue.amenities?.length > 4 && (
                              <span className="text-xs text-gray-500 self-center">
                                +{venue.amenities.length - 4} more
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => window.location.href = `/venues/${venue.id}`}
                              className="flex-1 inline-flex items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2 text-sm font-medium transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => window.location.href = `tel:${venue.contact_phone}`}
                              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 h-10 w-10 p-0 transition-colors"
                            >
                              <FaPhone className="h-4 w-4 text-gray-600" />
                            </button>
                            {venue.website && (
                              <button
                                onClick={() => window.open(venue.website, '_blank')}
                                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 h-10 w-10 p-0 transition-colors"
                              >
                                <FaGlobe className="h-4 w-4 text-gray-600" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`inline-flex items-center justify-center rounded-lg h-10 w-10 text-sm font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
                <FaCalendarAlt className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Post Your Event
                </h2>
                <p className="text-gray-600 mb-6">
                  Create and promote your events to reach thousands of potential attendees
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.href = '/category/events/conference'}
                    className="inline-flex items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-700 h-12 px-6 py-3 font-medium transition-colors shadow-sm"
                  >
                    <FaTicketAlt className="h-5 w-5 mr-2" />
                    Post Conference Event
                  </button>
                  <button
                    onClick={() => window.location.href = '/category/events/concert'}
                    className="inline-flex items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-700 h-12 px-6 py-3 font-medium transition-colors shadow-sm"
                  >
                    <FaTicketAlt className="h-5 w-5 mr-2" />
                    Post Concert Event
                  </button>
                  <button
                    onClick={() => window.location.href = '/category/events/festival'}
                    className="inline-flex items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-700 h-12 px-6 py-3 font-medium transition-colors shadow-sm"
                  >
                    <FaTicketAlt className="h-5 w-5 mr-2" />
                    Post Festival Event
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters and Sort */}
      {!isEventsCategory && (
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Assisted Filters */}
            <div className="lg:col-span-1">
              <AIAssistedFilters
                category={fullSlug}
                onFiltersChange={handleFilterChange}
                currentFilters={selectedFilters}
              />
            </div>
            
            {/* Dynamic Filters */}
            <div className="lg:col-span-2">
              <DynamicFilters
                categoryType={fullSlug}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                onRemoveFilter={handleRemoveFilter}
                onClearAllFilters={handleClearAllFilters}
              />
            </div>
          </div>
        </div>
      )}

      {/* Listings */}
      {!isEventsCategory && (loading ? (
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading listings...</span>
        </div>
      ) : filteredAndSorted.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing {((listingsPage - 1) * itemsPerPage) + 1}-
              {Math.min(listingsPage * itemsPerPage, filteredAndSorted.length)} of {listings.length} listings
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priority">Priority</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <FiGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <FiList className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredAndSorted.map((listing) => (
              <CategoryItem
                key={listing.listing_id}
                item={listing}
                viewMode={viewMode}
                onUpsellClick={handleUpsellClick}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {listingsTotalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setListingsPage(prev => Math.max(1, prev - 1))}
                disabled={listingsPage === 1}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, listingsTotalPages) }, (_, i) => {
                  let pageNum;
                  if (listingsTotalPages <= 5) {
                    pageNum = i + 1;
                  } else if (listingsPage <= 3) {
                    pageNum = i + 1;
                  } else if (listingsPage >= listingsTotalPages - 2) {
                    pageNum = listingsTotalPages - 4 + i;
                  } else {
                    pageNum = listingsPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setListingsPage(pageNum)}
                      className={`inline-flex items-center justify-center rounded-lg h-10 w-10 text-sm font-medium transition-colors ${
                        listingsPage === pageNum
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setListingsPage(prev => Math.min(listingsTotalPages, prev + 1))}
                disabled={listingsPage === listingsTotalPages}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTags className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {listings.length === 0 ? 'No listings found in this category' : 'No listings match your filters'}
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              {listings.length === 0 
                ? `Be the first to post in ${currentCategory?.name || fullSlug.replace(/-/g, ' ')} and reach thousands of potential customers!`
                : 'Try adjusting your filters to see more listings.'
              }
            </p>
            {listings.length === 0 ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/post-ad"
                  className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg text-lg font-medium"
                >
                  <FaTags className="h-5 w-5 mr-2" />
                  Be the First to Post
                </Link>
                <button
                  onClick={() => window.location.href = '/category-menu'}
                  className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
                >
                  Browse Other Categories
                </button>
              </div>
            ) : (
              <button
                onClick={handleClearAllFilters}
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ))}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
