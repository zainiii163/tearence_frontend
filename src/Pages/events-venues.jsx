import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useAuthRedirect from '../hooks/useAuthRedirect';
import Navbar from '../Component/EventsVenues/Navbar';
import Hero from '../Component/EventsVenues/Hero';
import PageToggle from '../Component/EventsVenues/PageToggle';
import FeaturedEventsCarousel from '../Component/EventsVenues/FeaturedEventsCarousel';
import EventCategories from '../Component/EventsVenues/EventCategories';
import EventFilters from '../Component/EventsVenues/EventFilters';
import EventsGrid from '../Component/EventsVenues/EventsGrid';
import VenueCategories from '../Component/EventsVenues/VenueCategories';
import VenueFilters from '../Component/EventsVenues/VenueFilters';
import VenuesGrid from '../Component/EventsVenues/VenuesGrid';
import LiveActivityFeed from '../Component/EventsVenues/LiveActivityFeed';
import EventPostForm from '../Component/EventsVenues/EventPostForm';
import VenuePostForm from '../Component/EventsVenues/VenuePostForm';
import Footer from '../Component/EventsVenues/Footer';
import eventsVenuesService from '../services/EventsVenuesService';
import {
  mockEvents,
  mockVenues,
  mockLiveActivity,
  mockCategories
} from '../data/mockEventsVenuesData';

const EventsVenuesPage = () => {
  const { logIn } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const [activeTab, setActiveTab] = useState('events');

  // Handle post event/venue with authentication
  const handlePostEvent = () => {
    requireAuth('/events-venues?postForm=event', 'You must be logged in to post an event.');
  };

  const handlePostVenue = () => {
    requireAuth('/events-venues?postForm=venue', 'You must be logged in to post a venue.');
  };
  const [showEventForm, setShowEventForm] = useState(false);
  const [showVenueForm, setShowVenueForm] = useState(false);
  const [eventFilters, setEventFilters] = useState({});
  const [venueFilters, setVenueFilters] = useState({});
  
  // Data states
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [liveActivity, setLiveActivity] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for custom events to open forms
    const handleOpenEventForm = () => {
      if (!logIn) {
        window.location.href = '/login';
        return;
      }
      setShowEventForm(true);
    };
    
    const handleOpenVenueForm = () => {
      if (!logIn) {
        window.location.href = '/login';
        return;
      }
      setShowVenueForm(true);
    };

    window.addEventListener('openEventForm', handleOpenEventForm);
    window.addEventListener('openVenueForm', handleOpenVenueForm);

    return () => {
      window.removeEventListener('openEventForm', handleOpenEventForm);
      window.removeEventListener('openVenueForm', handleOpenVenueForm);
    };
  }, [logIn]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load data using real API calls
        const [eventsResponse, venuesResponse, featuredEventsResponse, featuredVenuesResponse, activityResponse] = await Promise.all([
          eventsVenuesService.getEvents(),
          eventsVenuesService.getVenues(),
          eventsVenuesService.getFeaturedEvents(),
          eventsVenuesService.getFeaturedVenues(),
          eventsVenuesService.getLiveActivity()
        ]);

        // Set data from API responses
        setEvents(eventsResponse.data?.events || mockEvents);
        setVenues(venuesResponse.data?.venues || mockVenues);
        setFeaturedEvents(featuredEventsResponse.data?.events || mockEvents.filter(event => event.promotion_tier !== 'standard'));
        setFeaturedVenues(featuredVenuesResponse.data?.venues || mockVenues.filter(venue => venue.promotion_tier !== 'standard'));
        setLiveActivity(activityResponse.data?.activities || mockLiveActivity);
        
        // Load categories
        try {
          const categoriesResponse = await eventsVenuesService.getEventCategories();
          setCategories(categoriesResponse.data || mockCategories);
        } catch (catError) {
          console.warn('Failed to load categories, using mock data:', catError);
          setCategories(mockCategories);
        }

      } catch (err) {
        console.error('Error loading initial data:', err);
        // Fallback to mock data if API fails
        setEvents(mockEvents);
        setVenues(mockVenues);
        setFeaturedEvents(mockEvents.filter(event => event.promotion_tier !== 'standard'));
        setFeaturedVenues(mockVenues.filter(venue => venue.promotion_tier !== 'standard'));
        setLiveActivity(mockLiveActivity);
        setCategories(mockCategories);
        setError('Failed to load data from server. Using sample data.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handle search with API
  const handleSearch = async (filters) => {
    try {
      console.log('Search filters:', filters);
      
      // Use real API calls based on active tab
      if (activeTab === 'events') {
        const response = await eventsVenuesService.getEvents(filters);
        setEvents(response.data?.events || []);
      } else {
        const response = await eventsVenuesService.getVenues(filters);
        setVenues(response.data?.venues || []);
      }
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
      // Fallback to filtered mock data
      if (activeTab === 'events') {
        const filtered = mockEvents.filter(event => 
          event.title.toLowerCase().includes(filters.query?.toLowerCase() || '')
        );
        setEvents(filtered);
      } else {
        const filtered = mockVenues.filter(venue => 
          venue.name.toLowerCase().includes(filters.query?.toLowerCase() || '')
        );
        setVenues(filtered);
      }
    }
  };

  // Handle event filters with API
  const handleEventFilterChange = async (filters) => {
    try {
      setEventFilters(filters);
      
      // Use real API calls
      const response = await eventsVenuesService.getEvents(filters);
      setEvents(response.data?.events || []);
      
    } catch (err) {
      console.error('Event filter error:', err);
      setError('Filter application failed. Please try again.');
      // Fallback to filtered mock data
      let filtered = mockEvents;
      if (filters.category) {
        filtered = filtered.filter(event => event.category === filters.category);
      }
      if (filters.country) {
        filtered = filtered.filter(event => event.country === filters.country);
      }
      setEvents(filtered);
    }
  };

  // Handle venue filters with API
  const handleVenueFilterChange = async (filters) => {
    try {
      setVenueFilters(filters);
      
      // Use real API calls
      const response = await eventsVenuesService.getVenues(filters);
      setVenues(response.data?.venues || []);
      
    } catch (err) {
      console.error('Venue filter error:', err);
      setError('Filter application failed. Please try again.');
      // Fallback to filtered mock data
      let filtered = mockVenues;
      if (filters.venue_type) {
        filtered = filtered.filter(venue => venue.venue_type === filters.venue_type);
      }
      if (filters.country) {
        filtered = filtered.filter(venue => venue.country === filters.country);
      }
      setVenues(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      {/* Hero Section */}
      <Hero onSearch={handleSearch} onPostEvent={handlePostEvent} onPostVenue={handlePostVenue} />

      {/* Page Toggle */}
      <PageToggle activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {activeTab === 'events' ? (
                <EventFilters 
                  filters={eventFilters} 
                  onFilterChange={handleEventFilterChange} 
                  categories={categories.events}
                />
              ) : (
                <VenueFilters 
                  filters={venueFilters} 
                  onFilterChange={handleVenueFilterChange} 
                  categories={categories.venues}
                />
              )}
              
              {/* Live Activity Feed */}
              <div className="mt-6">
                <LiveActivityFeed activities={liveActivity} />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {activeTab === 'events' ? (
                <>
                  {/* Featured Events Carousel */}
                  <div className="mb-12">
                    <FeaturedEventsCarousel events={featuredEvents} />
                  </div>

                  {/* Event Categories */}
                  <div className="mb-12">
                    <EventCategories categories={categories.events} />
                  </div>

                  {/* Events Grid */}
                  <div>
                    <EventsGrid 
                      events={events} 
                      loading={loading}
                      onEventClick={(event) => console.log('Event clicked:', event)}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Featured Venues Carousel */}
                  <div className="mb-12">
                    <FeaturedEventsCarousel venues={featuredVenues} isVenue={true} />
                  </div>

                  {/* Venue Categories */}
                  <div className="mb-12">
                    <VenueCategories categories={categories.venues} />
                  </div>

                  {/* Venues Grid */}
                  <div>
                    <VenuesGrid 
                      venues={venues} 
                      loading={loading}
                      onVenueClick={(venue) => console.log('Venue clicked:', venue)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <Footer />

      {/* Event Posting Form Modal */}
      <EventPostForm 
        isOpen={showEventForm} 
        onClose={() => setShowEventForm(false)} 
      />

      {/* Venue Posting Form Modal */}
      <VenuePostForm 
        isOpen={showVenueForm} 
        onClose={() => setShowVenueForm(false)} 
      />
    </div>
  );
};

export default EventsVenuesPage;
