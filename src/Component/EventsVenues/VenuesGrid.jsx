import React, { useState } from 'react';
import VenueCard from './VenueCard';
import { ArrowUpDown, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

const VenuesGrid = ({ venues, loading }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const sampleVenues = [
    {
      id: 1,
      name: "Grand Ballroom Plaza",
      category: "Wedding Venues",
      city: "New York",
      country: "USA",
      capacity: 500,
      priceRange: "$5,000 - $10,000",
      image: "https://picsum.photos/seed/venue1/400/300.jpg",
      badge: "featured",
      rating: 4.9,
      reviews: 234,
      views: 1823,
      amenities: ["WiFi", "Parking", "Catering", "AV Equipment"]
    },
    {
      id: 2,
      name: "Tech Conference Center",
      category: "Conference Centres",
      city: "San Francisco",
      country: "USA",
      capacity: 1000,
      priceRange: "$3,000 - $8,000",
      image: "https://picsum.photos/seed/venue2/400/300.jpg",
      badge: "sponsored",
      rating: 4.8,
      reviews: 156,
      views: 2654
    },
    {
      id: 3,
      name: "Riverside Garden Venue",
      category: "Outdoor Spaces",
      city: "Napa Valley",
      country: "USA",
      capacity: 200,
      priceRange: "$2,000 - $5,000",
      image: "https://picsum.photos/seed/venue3/400/300.jpg",
      badge: "promoted",
      rating: 4.7,
      reviews: 89,
      views: 1234
    },
    {
      id: 4,
      name: "Luxury Hotel Banquet Hall",
      category: "Hotels & Banquet Rooms",
      city: "Los Angeles",
      country: "USA",
      capacity: 300,
      priceRange: "$4,000 - $7,000",
      image: "https://picsum.photos/seed/venue4/400/300.jpg",
      rating: 4.6,
      reviews: 67,
      views: 987
    },
    {
      id: 5,
      name: "Modern Art Gallery Space",
      category: "Exhibition Spaces",
      city: "Chicago",
      country: "USA",
      capacity: 150,
      priceRange: "$1,500 - $3,000",
      image: "https://picsum.photos/seed/venue5/400/300.jpg",
      badge: "featured",
      rating: 4.8,
      reviews: 123,
      views: 876
    },
    {
      id: 6,
      name: "Rooftop Party Lounge",
      category: "Bars & Restaurants",
      city: "Miami",
      country: "USA",
      capacity: 100,
      priceRange: "$1,000 - $2,500",
      image: "https://picsum.photos/seed/venue6/400/300.jpg",
      rating: 4.5,
      reviews: 45,
      views: 654
    },
    {
      id: 7,
      name: "Corporate Meeting Center",
      category: "Meeting Rooms",
      city: "Boston",
      country: "USA",
      capacity: 50,
      priceRange: "$500 - $1,500",
      image: "https://picsum.photos/seed/venue7/400/300.jpg",
      badge: "promoted",
      rating: 4.4,
      reviews: 78,
      views: 543
    },
    {
      id: 8,
      name: "Sports Complex Arena",
      category: "Sports Venues",
      city: "Dallas",
      country: "USA",
      capacity: 2000,
      priceRange: "$10,000 - $25,000",
      image: "https://picsum.photos/seed/venue8/400/300.jpg",
      rating: 4.7,
      reviews: 134,
      views: 1432
    },
    {
      id: 9,
      name: "Intimate Wedding Chapel",
      category: "Wedding Venues",
      city: "Las Vegas",
      country: "USA",
      capacity: 80,
      priceRange: "$800 - $2,000",
      image: "https://picsum.photos/seed/venue9/400/300.jpg",
      rating: 4.9,
      reviews: 198,
      views: 1876
    },
    {
      id: 10,
      name: "Beachfront Event Space",
      category: "Outdoor Spaces",
      city: "San Diego",
      country: "USA",
      capacity: 250,
      priceRange: "$3,000 - $6,000",
      image: "https://picsum.photos/seed/venue10/400/300.jpg",
      badge: "featured",
      rating: 4.6,
      reviews: 87,
      views: 987
    },
    {
      id: 11,
      name: "Historic Mansion Venue",
      category: "Party Halls",
      city: "New Orleans",
      country: "USA",
      capacity: 180,
      priceRange: "$2,500 - $5,000",
      image: "https://picsum.photos/seed/venue11/400/300.jpg",
      rating: 4.8,
      reviews: 154,
      views: 1234
    },
    {
      id: 12,
      name: "Downtown Conference Hall",
      category: "Conference Centres",
      city: "Seattle",
      country: "USA",
      capacity: 750,
      priceRange: "$4,000 - $9,000",
      image: "https://picsum.photos/seed/venue12/400/300.jpg",
      badge: "sponsored",
      rating: 4.5,
      reviews: 98,
      views: 765
    }
  ];

  const displayVenues = venues || sampleVenues;

  const sortedVenues = [...displayVenues].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.id - a.id;
      case 'trending':
        return b.views - a.views;
      case 'rating':
        return b.rating - a.rating;
      case 'capacity-low':
        return a.capacity - b.capacity;
      case 'capacity-high':
        return b.capacity - a.capacity;
      case 'price-low':
        const priceA = parseInt(a.priceRange.replace(/[^0-9]/g, '')) || 0;
        const priceB = parseInt(b.priceRange.replace(/[^0-9]/g, '')) || 0;
        return priceA - priceB;
      case 'price-high':
        const priceA2 = parseInt(a.priceRange.replace(/[^0-9]/g, '')) || 0;
        const priceB2 = parseInt(b.priceRange.replace(/[^0-9]/g, '')) || 0;
        return priceB2 - priceA2;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedVenues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVenues = sortedVenues.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Venues ({sortedVenues.length})
          </h2>
          <p className="text-gray-600 mt-1">Find the perfect venue for your event</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="trending">Trending</option>
              <option value="rating">Highest Rated</option>
              <option value="capacity-low">Capacity Low to High</option>
              <option value="capacity-high">Capacity High to Low</option>
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

      {/* Venues Grid/List */}
      {paginatedVenues.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {paginatedVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedVenues.length)} of {sortedVenues.length} venues
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
                        ? 'bg-teal-600 text-white'
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

export default VenuesGrid;
