import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import EventsVenuesHero from '../Component/events-venues/EventsVenuesHero';
import EventsVenuesCard from '../Component/events-venues/EventsVenuesCard';
import EventsVenuesCategoryGrid from '../Component/events-venues/EventsVenuesCategoryGrid';
import EventsVenuesFilters from '../Component/events-venues/EventsVenuesFilters';
import EventsVenuesActivityFeed from '../Component/events-venues/EventsVenuesActivityFeed';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import eventsVenuesAPI from '../services/eventsVenuesAPI';
import { getEventsVenuesImageUrl } from '../utils/eventsVenuesImages';

const EventsVenuesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState(searchParams.get('advert_type') || 'event');
  const [adverts, setAdverts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedAdverts, setSavedAdverts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, [viewType]);

  useEffect(() => {
    loadAdverts();
  }, [viewType, filters, currentPage]);

  const loadInitialData = async () => {
    try {
      const [categoriesRes, statsRes] = await Promise.all([
        eventsVenuesAPI.getCategories(),
        eventsVenuesAPI.getStatistics(),
      ]);
      setCategories(categoriesRes.data || []);
      setStatistics(statsRes.data || null);
      
      // Load saved adverts if authenticated
      try {
        const savedRes = await eventsVenuesAPI.getSavedAdverts();
        setSavedAdverts(savedRes.data?.data || []);
      } catch (error) {
        // User might not be authenticated
        setSavedAdverts([]);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadAdverts = async () => {
    setLoading(true);
    try {
      const params = {
        advert_type: viewType,
        page: currentPage,
        per_page: 12,
        ...filters,
      };
      const response = await eventsVenuesAPI.getAdverts(params);
      setAdverts(response.data?.data || []);
      setTotalPages(response.data?.last_page || 1);
    } catch (error) {
      console.error('Error loading adverts:', error);
      setAdverts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchData) => {
    const newFilters = {
      ...filters,
      search: searchData.search,
      country: searchData.location,
    };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSaveAdvert = async (advertId) => {
    try {
      await eventsVenuesAPI.saveAdvert(advertId);
      // Refresh saved adverts
      const savedRes = await eventsVenuesAPI.getSavedAdverts();
      setSavedAdverts(savedRes.data?.data || []);
      // Reload adverts to update save status
      loadAdverts();
    } catch (error) {
      console.error('Error saving advert:', error);
    }
  };

  const isSaved = (advertId) => {
    return savedAdverts.some(saved => saved.advert_id === advertId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <UnifiedNavbar showBackButton={true} />

      {/* Hero Section */}
      <div className="pt-16">
        <EventsVenuesHero
          viewType={viewType}
          setViewType={setViewType}
          onSearch={handleSearch}
          statistics={statistics}
        />

        {/* Category Grid */}
        <EventsVenuesCategoryGrid categories={categories} viewType={viewType} />

        {/* Filters */}
        <EventsVenuesFilters viewType={viewType} onFilterChange={handleFilterChange} />

        {/* Main Content */}
        <div className="page-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Adverts Grid */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {viewType === 'event' ? 'Events' : 'Venues'}
                {!loading && adverts.length > 0 && (
                  <span className="text-gray-500 font-normal text-lg ml-2">
                    ({adverts.length} found)
                  </span>
                )}
              </h2>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                </div>
              ) : adverts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-gray-600 text-lg">No {viewType === 'event' ? 'events' : 'venues'} found</p>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {adverts.map((advert) => (
                      <EventsVenuesCard
                        key={advert.id}
                        advert={advert}
                        onSave={handleSaveAdvert}
                        isSaved={isSaved(advert.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 border rounded-lg ${
                            currentPage === page
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Activity Feed */}
              <EventsVenuesActivityFeed />

              {/* Featured Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Featured {viewType === 'event' ? 'Events' : 'Venues'}</h3>
                <div className="space-y-3">
                  {adverts.slice(0, 3).map((advert) => (
                    <div
                      key={advert.id}
                      onClick={() => navigate(`/events-venues/${advert.slug}`)}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <img
                        src={getEventsVenuesImageUrl(advert)}
                        alt={advert.title}
                        className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.src = '/img/sample-electronics.jpg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm truncate">{advert.title}</h4>
                        <p className="text-xs text-gray-600 truncate">{advert.city}, {advert.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EventsVenuesPage;
