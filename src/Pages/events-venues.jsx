import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
import {
  mockEvents,
  mockVenues,
  mockLiveActivity,
  mockCategories
} from '../data/mockEventsVenuesData';

const EventsVenuesPage = () => {
  const { logIn } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState('events');
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

        // Load data using mock data for now (replace with real API calls)
        
        // Set data
        setEvents(mockEvents);
        setVenues(mockVenues);
        setFeaturedEvents(mockEvents.filter(event => event.promotion_tier !== 'standard'));
        setFeaturedVenues(mockVenues.filter(venue => venue.promotion_tier !== 'standard'));
        setLiveActivity(mockLiveActivity);
        setCategories(mockCategories);

        // In production, replace with real API calls:
        // const eventsResponse = await eventsVenuesAPI.events.getAllEvents();
        // const venuesResponse = await eventsVenuesAPI.venues.getAllVenues();
        // const featuredEventsResponse = await eventsVenuesAPI.events.getFeaturedEvents();
        // const featuredVenuesResponse = await eventsVenuesAPI.venues.getFeaturedVenues();
        // const activityResponse = await eventsVenuesAPI.getLiveActivity();
        // const categoriesResponse = await eventsVenuesAPI.getAllCategories();

      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load data. Please try again.');
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
      
      // In production, use real API calls:
      // if (activeTab === 'events') {
      //   const response = await eventsVenuesAPI.events.searchEvents(filters.query, filters);
      //   setEvents(response.data.events);
      // } else {
      //   const response = await eventsVenuesAPI.venues.searchVenues(filters.query, filters);
      //   setVenues(response.data.venues);
      // }
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    }
  };

  // Handle event filters with API
  const handleEventFilterChange = async (filters) => {
    try {
      setEventFilters(filters);
      
      // In production, use real API calls:
      // const response = await eventsVenuesAPI.events.getAllEvents(filters);
      // setEvents(response.data.events);
      
      console.log('Event filters:', filters);
    } catch (err) {
      console.error('Event filter error:', err);
      setError('Filter application failed. Please try again.');
    }
  };

  // Handle venue filters with API
  const handleVenueFilterChange = async (filters) => {
    try {
      setVenueFilters(filters);
      
      // In production, use real API calls:
      // const response = await eventsVenuesAPI.venues.getAllVenues(filters);
      // setVenues(response.data.venues);
      
      console.log('Venue filters:', filters);
    } catch (err) {
      console.error('Venue filter error:', err);
      setError('Filter application failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero onSearch={handleSearch} />

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
