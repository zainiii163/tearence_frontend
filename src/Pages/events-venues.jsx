import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { isAuthenticated as hasToken } from '../utils/auth';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import EventsVenuesHero from '../Component/events-venues/EventsVenuesHero';
import EventsVenuesCard from '../Component/events-venues/EventsVenuesCard';
import EventsVenuesCategoryGrid from '../Component/events-venues/EventsVenuesCategoryGrid';
import EventsVenuesFilters from '../Component/events-venues/EventsVenuesFilters';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import BrowseBottomPostCta from '../Component/shared/BrowseBottomPostCta';
import eventsVenuesAPI from '../services/eventsVenuesAPI';

/**
 * mode: 'home' | 'events' | 'venues'
 * Clive: browse public; post requires login; Post Event / Post Venue on their pages.
 */
const EventsVenuesPage = ({ mode = 'home' }) => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams] = useSearchParams();
  const viewType = mode === 'venues' ? 'venue' : 'event';
  const isHome = mode === 'home';

  const [adverts, setAdverts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isHome);
  const [savedAdverts, setSavedAdverts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState(() => ({
    category_id: searchParams.get('category_id') || undefined,
  }));
  const [topSearch, setTopSearch] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      const params = isHome ? {} : { type: viewType };
      const categoriesRes = await eventsVenuesAPI.getCategories(params);
      setCategories(categoriesRes.data || categoriesRes || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  }, [isHome, viewType]);

  const loadAdverts = useCallback(async () => {
    if (isHome) return;
    setLoading(true);
    try {
      const params = {
        advert_type: viewType,
        page: currentPage,
        per_page: 12,
        ...filters,
      };
      const response = await eventsVenuesAPI.getAdverts(params);
      const payload = response.data || response;
      setAdverts(payload?.data || (Array.isArray(payload) ? payload : []) || []);
      setTotalPages(payload?.last_page || 1);
    } catch (error) {
      console.error('Error loading adverts:', error);
      setAdverts([]);
    } finally {
      setLoading(false);
    }
  }, [isHome, viewType, filters, currentPage]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadAdverts();
  }, [loadAdverts]);

  useEffect(() => {
    if (!hasToken()) {
      setSavedAdverts([]);
      return;
    }
    (async () => {
      try {
        const savedRes = await eventsVenuesAPI.getSavedAdverts();
        setSavedAdverts(savedRes.data?.data || savedRes.data || []);
      } catch {
        setSavedAdverts([]);
      }
    })();
  }, [isAuthenticated]);

  const handleSearch = (searchData) => {
    if (isHome) {
      const q = (searchData.search || '').trim();
      const loc = (searchData.location || '').trim();
      const params = new URLSearchParams();
      if (q) params.set('search', q);
      if (loc) params.set('location', loc);
      navigate(`/events-venues/events${params.toString() ? `?${params}` : ''}`);
      return;
    }
    setFilters((prev) => ({
      ...prev,
      search: searchData.search || undefined,
      country: searchData.location || undefined,
    }));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isHome) return;
    const s = searchParams.get('search');
    const loc = searchParams.get('location');
    const cat = searchParams.get('category_id');
    if (s || loc || cat) {
      setTopSearch(s || '');
      setLocationQuery(loc || '');
      setFilters((prev) => ({
        ...prev,
        search: s || undefined,
        country: loc || undefined,
        category_id: cat || undefined,
      }));
    }
  }, [searchParams, isHome]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSaveAdvert = async (advertId) => {
    if (
      !requireAuth(
        `/events-venues/${mode === 'venues' ? 'venues' : 'events'}`,
        'You must be logged in to save listings.'
      )
    ) {
      return;
    }
    try {
      await eventsVenuesAPI.saveAdvert(advertId);
      const savedRes = await eventsVenuesAPI.getSavedAdverts();
      setSavedAdverts(savedRes.data?.data || savedRes.data || []);
      loadAdverts();
    } catch (error) {
      console.error('Error saving advert:', error);
    }
  };

  const isSaved = (advertId) => savedAdverts.some((saved) => saved.advert_id === advertId || saved.id === advertId);

  const handlePostClick = () => {
    const type = mode === 'venues' ? 'venue' : 'event';
    const path = `/events-venues/post?type=${type}`;
    requireAuth(
      path,
      mode === 'venues'
        ? 'You must be logged in to post a venue.'
        : 'You must be logged in to post an event.'
    ) && navigate(path);
  };

  const backHref = isHome ? '/' : '/events-venues';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UnifiedNavbar showBackButton backHref={backHref} />

      <EventsVenuesHero
        mode={mode}
        onSearch={handleSearch}
        searchValue={topSearch}
        onSearchChange={(e) => setTopSearch(e.target.value)}
        locationValue={locationQuery}
        onLocationChange={(e) => setLocationQuery(e.target.value)}
      />

      <div className="page-container py-4 sm:py-6 flex-1">
        {isHome ? (
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <p className="text-sm text-gray-600">
              Browse events and venues without an account. Sign in only when you want to post.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/events-venues/events"
                className="rounded-xl border border-purple-200 bg-white p-5 text-left hover:border-purple-400 hover:shadow-sm transition"
              >
                <h2 className="text-base font-bold text-gray-900">Events</h2>
                <p className="text-xs text-gray-500 mt-1">Concerts, conferences, festivals and more</p>
                <span className="inline-block mt-3 text-xs font-semibold text-purple-700">Explore Events →</span>
              </Link>
              <Link
                to="/events-venues/venues"
                className="rounded-xl border border-indigo-200 bg-white p-5 text-left hover:border-indigo-400 hover:shadow-sm transition"
              >
                <h2 className="text-base font-bold text-gray-900">Venues</h2>
                <p className="text-xs text-gray-500 mt-1">Halls, hotels, outdoor spaces and venues for hire</p>
                <span className="inline-block mt-3 text-xs font-semibold text-indigo-700">Explore Venues →</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {mode === 'venues' ? 'Venues' : 'Events'}
                {!loading && (
                  <span className="text-gray-500 font-normal text-sm ml-2">
                    ({adverts.length})
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={handlePostClick}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-semibold px-3 py-2"
              >
                <Plus className="h-4 w-4" />
                {mode === 'venues' ? 'Post Venue' : 'Post Event'}
              </button>
            </div>

            <EventsVenuesCategoryGrid categories={categories} viewType={viewType} />
            <EventsVenuesFilters viewType={viewType} onFilterChange={handleFilterChange} />

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
              </div>
            ) : adverts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-700 text-lg font-semibold">
                  No {mode === 'venues' ? 'venues' : 'events'} found
                </p>
                <p className="text-gray-500 mt-2 text-sm">Try adjusting your search or selection</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {adverts.map((advert) => (
                    <EventsVenuesCard
                      key={advert.id}
                      advert={advert}
                      onSave={handleSaveAdvert}
                      isSaved={isSaved(advert.id)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

            <BrowseBottomPostCta
              title={mode === 'venues' ? 'List your venue' : 'Promote your event'}
              buttonLabel={mode === 'venues' ? 'Post Venue' : 'Post Event'}
              onPostClick={handlePostClick}
              theme="purple"
              compact
            />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EventsVenuesPage;
