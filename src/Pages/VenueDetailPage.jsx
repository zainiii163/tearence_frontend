import React, { useEffect, useState, useCallback } from "react";
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaGlobe, FaStar, FaHeart, FaShare, FaCalendar, FaUsers, FaDollarSign, FaWifi, FaCar, FaGlassCheers, FaMusic, FaUtensils, FaHotel, FaEnvelope, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar";
import api from "../api";
import toast from "react-hot-toast";

function VenueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    event_date: "",
    event_type: "",
    guests: "",
    message: ""
  });

  const amenitiesIcons = {
    wifi: { icon: FaWifi, label: "WiFi" },
    parking: { icon: FaCar, label: "Parking" },
    bar: { icon: FaGlassCheers, label: "Bar Service" },
    sound_system: { icon: FaMusic, label: "Sound System" },
    catering: { icon: FaUtensils, label: "Catering" },
    accommodation: { icon: FaHotel, label: "Accommodation" },
    projector: { icon: "📽️", label: "Projector" },
    air_conditioning: { icon: "❄️", label: "Air Conditioning" },
    wheelchair_accessible: { icon: "♿", label: "Wheelchair Accessible" },
    security: { icon: "🔒", label: "Security" },
    stage: { icon: "🎪", label: "Stage" },
    lighting: { icon: "💡", label: "Professional Lighting" }
  };

  const venueTypes = {
    conference_hall: "Conference Hall",
    hotel_ballroom: "Hotel Ballroom",
    restaurant: "Restaurant",
    outdoor_venue: "Outdoor Venue",
    theater: "Theater",
    gallery: "Art Gallery",
    club: "Nightclub",
    stadium: "Stadium/Arena",
    community_center: "Community Center",
    rooftop: "Rooftop Venue",
    beach: "Beach Venue",
    garden: "Garden",
    museum: "Museum",
    warehouse: "Warehouse/Loft",
    church: "Church/Religious Venue",
    other: "Other"
  };

  const priceRanges = {
    budget: { label: "Budget ($)", description: "Under $500/day" },
    moderate: { label: "Moderate ($$)", description: "$500 - $2,000/day" },
    premium: { label: "Premium ($$$)", description: "$2,000 - $5,000/day" },
    luxury: { label: "Luxury ($$$$)", description: "Over $5,000/day" }
  };

  const getMockVenue = useCallback(() => {
    return {
      id: parseInt(id),
      name: "Grand Ballroom Plaza",
      venue_type: "hotel_ballroom",
      capacity: 500,
      price_range: "premium",
      location: "New York",
      address: "123 Grand Avenue, Manhattan",
      city: "New York",
      country: "USA",
      postal_code: "10001",
      latitude: 40.7589,
      longitude: -73.9851,
      contact_phone: "+1 555-0123",
      contact_email: "info@grandballroom.com",
      website: "https://grandballroom.com",
      description: `<p>Welcome to the Grand Ballroom Plaza, where elegance meets sophistication in the heart of Manhattan. Our stunning venue features crystal chandeliers, marble floors, and panoramic city views that will leave your guests breathless.</p><p>Perfect for weddings, corporate events, and special celebrations, our ballroom can accommodate up to 500 guests in style and comfort.</p>`,
      amenities: ["wifi", "parking", "bar", "catering", "air_conditioning", "projector", "security"],
      operating_hours: {
        monday: { open: "09:00", close: "23:00", closed: false },
        tuesday: { open: "09:00", close: "23:00", closed: false },
        wednesday: { open: "09:00", close: "23:00", closed: false },
        thursday: { open: "09:00", close: "23:00", closed: false },
        friday: { open: "09:00", close: "00:00", closed: false },
        saturday: { open: "10:00", close: "00:00", closed: false },
        sunday: { open: "10:00", close: "22:00", closed: false }
      },
      social_media: {
        facebook: "https://facebook.com/grandballroom",
        instagram: "https://instagram.com/grandballroom",
        twitter: "https://twitter.com/grandballroom"
      },
      images: [
        "https://images.unsplash.com/photo-1519167758483-26b7b24f6d8d?w=800",
        "https://images.unsplash.com/photo-1469371670807-013ccf25f02a?w=800",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
      ],
      rating: 4.8,
      reviews_count: 127,
      booking_requirements: "50% deposit required to secure booking. Full payment due 7 days before event.",
      cancellation_policy: "Cancellations made 30+ days before event receive full refund minus deposit. 14-29 days receive 50% refund. Less than 14 days no refund."
    };
  }, [id]);

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/venues/${id}`);
        
        if (response.data.status === 'Success') {
          setVenue(response.data.data);
        } else {
          // Use mock data if API is not available
          setVenue(getMockVenue());
        }
      } catch (error) {
        console.error('Error fetching venue:', error);
        // Use mock data on error
        setVenue(getMockVenue());
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
    
    const savedFavorites = localStorage.getItem('favorite_venues');
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      setIsFavorite(favorites.includes(parseInt(id)));
    }
  }, [id, getMockVenue]);

  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem('favorite_venues');
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    if (isFavorite) {
      favorites = favorites.filter(venueId => venueId !== parseInt(id));
      toast.success('Removed from favorites');
    } else {
      favorites.push(parseInt(id));
      toast.success('Added to favorites');
    }
    
    localStorage.setItem('favorite_venues', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const shareVenue = async () => {
    const shareText = `Check out ${venue.name} in ${venue.city} - ${venue.description.replace(/<[^>]*>/g, '').substring(0, 100)}...`;
    const shareUrl = window.location.href;
    
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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...contactForm,
        venue_id: venue.id,
        venue_name: venue.name
      };
      
      const response = await api.post('/venues/inquiry', payload);
      
      if (response.data.status === 'Success') {
        toast.success('Your inquiry has been sent successfully!');
        setShowContactForm(false);
        setContactForm({
          name: "",
          email: "",
          phone: "",
          event_date: "",
          event_type: "",
          guests: "",
          message: ""
        });
      } else {
        throw new Error(response.data.message || 'Failed to send inquiry');
      }
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast.error('Failed to send inquiry. Please try again.');
    }
  };

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

  if (!venue) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Venue not found</h2>
              <button
                onClick={() => navigate('/venues')}
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors"
              >
                Back to Venues
              </button>
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
        {/* Hero Section with Images */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="md:col-span-2">
              <img
                src={venue.images?.[0] || 'https://images.unsplash.com/photo-1519167758483-26b7b24f6d8d?w=800'}
                alt={venue.name}
                className="w-full h-96 md:h-[500px] object-cover"
              />
            </div>
            <div className="grid grid-cols-1 gap-0">
              {venue.images?.slice(1, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${venue.name} ${index + 2}`}
                  className="w-full h-48 md:h-[250px] object-cover"
                />
              ))}
            </div>
          </div>
          
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <button
              onClick={() => navigate('/venues')}
              className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors"
            >
              <FaArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={toggleFavorite}
                className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors"
              >
                <FaHeart className={`h-5 w-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
              </button>
              <button
                onClick={shareVenue}
                className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors"
              >
                <FaShare className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Venue Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{venue.name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="h-4 w-4" />
                        <span>{venue.city}, {venue.country}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaStar className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{venue.rating || '4.5'}</span>
                        <span>({venue.reviews_count || '0'} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {venueTypes[venue.venue_type] || venue.venue_type}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FaUsers className="h-4 w-4" />
                    <span>Up to {venue.capacity || 'N/A'} guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaDollarSign className="h-4 w-4" />
                    <span>{priceRanges[venue.price_range]?.label || 'Price on request'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">About This Venue</h2>
                <div 
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: venue.description }}
                />
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Amenities & Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {venue.amenities?.map(amenityId => {
                    const amenity = amenitiesIcons[amenityId];
                    if (!amenity) return null;
                    
                    const IconComponent = amenity.icon;
                    return (
                      <div key={amenityId} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        {typeof IconComponent === 'string' ? (
                          <span className="text-xl">{IconComponent}</span>
                        ) : (
                          <IconComponent className="h-5 w-5 text-primary" />
                        )}
                        <span className="text-sm font-medium">{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Operating Hours */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Operating Hours</h2>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="space-y-2">
                    {Object.entries(venue.operating_hours || {}).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-muted-foreground">
                          {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Policies */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Policies</h2>
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Booking Requirements</h3>
                    <p className="text-sm text-muted-foreground">
                      {venue.booking_requirements || 'Contact venue for booking requirements'}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Cancellation Policy</h3>
                    <p className="text-sm text-muted-foreground">
                      {venue.cancellation_policy || 'Contact venue for cancellation policy'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-card border rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-foreground mb-4">Contact Venue</h3>
                
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => window.location.href = `tel:${venue.contact_phone}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <FaPhone className="h-4 w-4" />
                    {venue.contact_phone}
                  </button>
                  
                  {venue.contact_email && (
                    <button
                      onClick={() => window.location.href = `mailto:${venue.contact_email}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
                    >
                      <FaEnvelope className="h-4 w-4" />
                      Send Email
                    </button>
                  )}
                  
                  {venue.website && (
                    <button
                      onClick={() => window.open(venue.website, '_blank')}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
                    >
                      <FaGlobe className="h-4 w-4" />
                      Visit Website
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors"
                >
                  <FaCalendar className="h-4 w-4 mr-2" />
                  Request Booking
                </button>

                {/* Social Media */}
                {venue.social_media && (venue.social_media.facebook || venue.social_media.instagram || venue.social_media.twitter) && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="text-sm font-medium text-foreground mb-3">Follow Us</h4>
                    <div className="flex gap-2">
                      {venue.social_media.facebook && (
                        <button
                          onClick={() => window.open(venue.social_media.facebook, '_blank')}
                          className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 transition-colors"
                        >
                          <FaFacebook className="h-4 w-4" />
                        </button>
                      )}
                      {venue.social_media.instagram && (
                        <button
                          onClick={() => window.open(venue.social_media.instagram, '_blank')}
                          className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 transition-colors"
                        >
                          <FaInstagram className="h-4 w-4" />
                        </button>
                      )}
                      {venue.social_media.twitter && (
                        <button
                          onClick={() => window.open(venue.social_media.twitter, '_blank')}
                          className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 transition-colors"
                        >
                          <FaTwitter className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Location</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>{venue.address}</p>
                  <p>{venue.city}, {venue.country} {venue.postal_code}</p>
                </div>
                
                {venue.latitude && venue.longitude && (
                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${venue.latitude},${venue.longitude}`, '_blank')}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <FaMapMarkerAlt className="h-4 w-4" />
                    View on Map
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowContactForm(false)}
          />
          
          <div className="relative bg-card border rounded-lg shadow-lg max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">Request Booking</h3>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={contactForm.event_date}
                  onChange={(e) => setContactForm({...contactForm, event_date: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Event Type *
                </label>
                <select
                  required
                  value={contactForm.event_type}
                  onChange={(e) => setContactForm({...contactForm, event_type: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select Event Type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="conference">Conference</option>
                  <option value="concert">Concert</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={contactForm.guests}
                  onChange={(e) => setContactForm({...contactForm, guests: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Additional Message
                </label>
                <textarea
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  placeholder="Any special requirements or questions..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium transition-colors"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VenueDetailPage;
