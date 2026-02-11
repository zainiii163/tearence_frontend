import React, { useEffect, useState, useCallback } from "react";
import { FaMapMarkerAlt, FaSearch, FaFilter, FaStar, FaPhone, FaGlobe, FaUsers, FaDollarSign, FaHeart, FaShare } from "react-icons/fa";
import Navbar from "../Component/Navbar";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

function VenuesPage() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const fetchVenues = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedType && { venue_type: selectedType }),
        ...(selectedPriceRange && { price_range: selectedPriceRange }),
        ...(selectedCity && { city: selectedCity })
      });

      const response = await api.get(`/venues?${params}`);
      
      if (response.data.status === 'Success') {
        setVenues(response.data.data.venues || []);
        setTotalPages(response.data.data.pagination?.total_pages || 1);
      } else {
        // For now, use mock data if API is not available
        setVenues(getMockVenues());
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
      // Use mock data on error
      setVenues(getMockVenues());
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedType, selectedPriceRange, selectedCity]);

  useEffect(() => {
    fetchVenues();
    const savedFavorites = localStorage.getItem('favorite_venues');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [currentPage, searchTerm, selectedType, selectedPriceRange, selectedCity, fetchVenues]);

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
    const shareUrl = `${window.location.origin}/venues/${venue.id}`;
    
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast.success('Link copied to clipboard!');
    }
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || venue.venue_type === selectedType;
    const matchesPrice = !selectedPriceRange || venue.price_range === selectedPriceRange;
    const matchesCity = !selectedCity || venue.city.toLowerCase().includes(selectedCity.toLowerCase());
    
    return matchesSearch && matchesType && matchesPrice && matchesCity;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                Discover Event Venues Worldwide
              </h1>
              <p className="text-blue-100 text-lg mb-8">
                Find the perfect venue for your next event - from intimate gatherings to grand celebrations
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80">
              <div className="bg-card border rounded-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <FaFilter />
                    {showFilters ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Search Bar */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Search Venues
                    </label>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                      <input
                        type="text"
                        placeholder="Search venues by name, city, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Venue Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Price Range
                    </label>
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city name"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setSelectedType("");
                      setSelectedPriceRange("");
                      setSelectedCity("");
                      setSearchTerm("");
                    }}
                    className="w-full inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Venues Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {filteredVenues.length} Venues Found
                </h2>
                <button
                  onClick={() => navigate('/venues/post')}
                  className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors"
                >
                  <FaMapMarkerAlt className="h-4 w-4" />
                  Post Your Venue
                </button>
              </div>

              {filteredVenues.length === 0 ? (
                <div className="text-center py-12">
                  <FaMapMarkerAlt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No venues found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={() => {
                      setSelectedType("");
                      setSelectedPriceRange("");
                      setSelectedCity("");
                      setSearchTerm("");
                    }}
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVenues.map((venue) => (
                    <div key={venue.id} className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <img
                          src={venue.images?.[0] || 'https://images.unsplash.com/photo-1519167758483-26b7b24f6d8d?w=400'}
                          alt={venue.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => toggleFavorite(venue.id)}
                            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                          >
                            <FaHeart className={`h-4 w-4 ${favorites.includes(venue.id) ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
                          </button>
                          <button
                            onClick={() => shareVenue(venue)}
                            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                          >
                            <FaShare className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                            {venueTypes.find(t => t.value === venue.venue_type)?.label || venue.venue_type}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">{venue.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FaMapMarkerAlt className="h-3 w-3" />
                              <span>{venue.city}, {venue.country}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <FaStar className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{venue.rating || '4.5'}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({venue.reviews_count || '0'} reviews)
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {venue.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
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
                            <span className="text-xs text-muted-foreground self-center">
                              +{venue.amenities.length - 4} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/venues/${venue.id}`)}
                            className="flex-1 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 text-sm font-medium transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => window.location.href = `tel:${venue.contact_phone}`}
                            className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 transition-colors"
                          >
                            <FaPhone className="h-4 w-4" />
                          </button>
                          {venue.website && (
                            <button
                              onClick={() => window.open(venue.website, '_blank')}
                              className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 transition-colors"
                            >
                              <FaGlobe className="h-4 w-4" />
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
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className={`inline-flex items-center justify-center rounded-md h-10 w-10 text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
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
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VenuesPage;
