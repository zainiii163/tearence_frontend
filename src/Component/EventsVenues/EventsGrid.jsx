import React, { useState } from 'react';
import EventCard from './EventCard';
import { ArrowUpDown, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

const EventsGrid = ({ events, loading }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const sampleEvents = [
    {
      id: 1,
      title: "Summer Music Festival 2024",
      date: "2024-07-15",
      time: "18:00",
      venueName: "Central Park Arena",
      city: "New York",
      price: "$45",
      image: "https://picsum.photos/seed/event1/400/300.jpg",
      category: "Concerts & Music",
      badge: "featured",
      rating: 4.8,
      reviews: 234,
      views: 1523
    },
    {
      id: 2,
      title: "Tech Innovation Summit",
      date: "2024-08-20",
      time: "09:00",
      venueName: "Convention Center",
      city: "San Francisco",
      price: "$299",
      image: "https://picsum.photos/seed/event2/400/300.jpg",
      category: "Business Conferences",
      badge: "sponsored",
      rating: 4.9,
      reviews: 156,
      views: 2341
    },
    {
      id: 3,
      title: "Wine Tasting Evening",
      date: "2024-06-10",
      time: "19:00",
      venueName: "Riverside Vineyard",
      city: "Napa Valley",
      price: "$75",
      image: "https://picsum.photos/seed/event3/400/300.jpg",
      category: "Food & Drink",
      badge: "promoted",
      rating: 4.7,
      reviews: 89,
      views: 987
    },
    {
      id: 4,
      title: "Charity Marathon",
      date: "2024-09-05",
      time: "07:00",
      venueName: "City Center",
      city: "Boston",
      price: "Free",
      image: "https://picsum.photos/seed/event4/400/300.jpg",
      category: "Charity Events",
      rating: 4.6,
      reviews: 67,
      views: 654
    },
    {
      id: 5,
      title: "Art Gallery Opening",
      date: "2024-07-22",
      time: "18:30",
      venueName: "Modern Art Museum",
      city: "Los Angeles",
      price: "Free",
      image: "https://picsum.photos/seed/event5/400/300.jpg",
      category: "Cultural Events",
      badge: "featured",
      rating: 4.5,
      reviews: 123,
      views: 876
    },
    {
      id: 6,
      title: "Startup Pitch Night",
      date: "2024-08-15",
      time: "17:00",
      venueName: "Innovation Hub",
      city: "Austin",
      price: "$25",
      image: "https://picsum.photos/seed/event6/400/300.jpg",
      category: "Business Conferences",
      rating: 4.4,
      reviews: 45,
      views: 543
    },
    {
      id: 7,
      title: "Jazz Night Live",
      date: "2024-06-28",
      time: "20:00",
      venueName: "Blue Note Club",
      city: "New Orleans",
      price: "$35",
      image: "https://picsum.photos/seed/event7/400/300.jpg",
      category: "Concerts & Music",
      badge: "promoted",
      rating: 4.9,
      reviews: 198,
      views: 1432
    },
    {
      id: 8,
      title: "Food Truck Festival",
      date: "2024-07-08",
      time: "11:00",
      venueName: "Waterfront Park",
      city: "Seattle",
      price: "Free",
      image: "https://picsum.photos/seed/event8/400/300.jpg",
      category: "Food & Drink",
      rating: 4.3,
      reviews: 76,
      views: 432
    },
    {
      id: 9,
      title: "Yoga in the Park",
      date: "2024-06-15",
      time: "07:00",
      venueName: "Central Park",
      city: "New York",
      price: "Free",
      image: "https://picsum.photos/seed/event9/400/300.jpg",
      category: "Workshops",
      rating: 4.7,
      reviews: 134,
      views: 765
    },
    {
      id: 10,
      title: "Comedy Night Special",
      date: "2024-07-30",
      time: "21:00",
      venueName: "Laugh Factory",
      city: "Chicago",
      price: "$20",
      image: "https://picsum.photos/seed/event10/400/300.jpg",
      category: "Parties & Nightlife",
      badge: "featured",
      rating: 4.8,
      reviews: 87,
      views: 987
    },
    {
      id: 11,
      title: "Photography Workshop",
      date: "2024-08-10",
      time: "10:00",
      venueName: "Art Studio",
      city: "Portland",
      price: "$85",
      image: "https://picsum.photos/seed/event11/400/300.jpg",
      category: "Workshops",
      rating: 4.6,
      reviews: 54,
      views: 321
    },
    {
      id: 12,
      title: "Beach Volleyball Tournament",
      date: "2024-07-20",
      time: "09:00",
      venueName: "Santa Monica Beach",
      city: "Los Angeles",
      price: "Free",
      image: "https://picsum.photos/seed/event12/400/300.jpg",
      category: "Sports Events",
      badge: "promoted",
      rating: 4.5,
      reviews: 98,
      views: 654
    }
  ];

  const displayEvents = events || sampleEvents;

  const sortedEvents = [...displayEvents].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date) - new Date(a.date);
      case 'trending':
        return b.views - a.views;
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        const priceA = a.price === 'Free' ? 0 : parseInt(a.price.replace(/[^0-9]/g, ''));
        const priceB = b.price === 'Free' ? 0 : parseInt(b.price.replace(/[^0-9]/g, ''));
        return priceA - priceB;
      case 'price-high':
        const priceA2 = a.price === 'Free' ? 0 : parseInt(a.price.replace(/[^0-9]/g, ''));
        const priceB2 = b.price === 'Free' ? 0 : parseInt(b.price.replace(/[^0-9]/g, ''));
        return priceB2 - priceA2;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = sortedEvents.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Events ({sortedEvents.length})
          </h2>
          <p className="text-gray-600 mt-1">Discover amazing events near you</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="trending">Trending</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price Low to High</option>
              <option value="price-high">Price High to Low</option>
            </select>
            <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid/List */}
      {paginatedEvents.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {paginatedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedEvents.length)} of {sortedEvents.length} events
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNumber
                        ? 'bg-purple-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsGrid;
