import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import jobService from '../../services/JobServices';
import jobsAPI from '../../api/jobsAPI';
import { extractJobsList, normalizeJobForCard } from '../../utils/jobsHelpers';
import { splitListingsByPromotion } from '../../utils/listingPromotionSort';
import UnifiedNavbar from '../UnifiedNavbar';
import JobsHero from './JobsHero';
import JobsGrid from './JobsGrid';
import JobSeekerCard from './JobSeekerCard';
import JobsCategoryGrid from './JobsCategoryGrid';
import JobsModalForm from './JobsModalForm';
import BrowseBottomPostCta from '../shared/BrowseBottomPostCta';
import BrowsePageBackBar from '../shared/BrowsePageBackBar';
import StandardListingFilters from '../shared/StandardListingFilters';
import { BrowseFilterLayout } from '../shared/BrowseFilterLayout';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Footer from '../Footer';

const extractSeekersList = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data?.data)) return response.data.data;
  if (Array.isArray(response.seekers)) return response.seekers;
  return [];
};

const matchesPostTypeFilters = (job, activeFilters) => {
  const checks = [];
  if (activeFilters.featured) checks.push(!!(job.featured || job.is_featured));
  if (activeFilters.promoted) checks.push(!!(job.is_promoted || job.promoted));
  if (activeFilters.sponsored) checks.push(!!(job.is_sponsored || job.sponsored));
  if (!activeFilters.featured && !activeFilters.promoted && !activeFilters.sponsored) return true;
  return checks.some(Boolean);
};

const hasActiveFilters = (activeFilters = {}) =>
  Object.entries(activeFilters).some(([, value]) => {
    if (typeof value === 'boolean') return value;
    return value !== '' && value != null;
  });

const applyClientFilters = (items, activeFilters) => {
  let result = [...items];

  if (activeFilters.featured || activeFilters.promoted || activeFilters.sponsored) {
    result = result.filter((job) => matchesPostTypeFilters(job, activeFilters));
  } else if (activeFilters.other) {
    result = result.filter(
      (job) =>
        !job.featured &&
        !job.is_featured &&
        !job.is_promoted &&
        !job.promoted &&
        !job.is_sponsored &&
        !job.sponsored
    );
  }

  if (activeFilters.city) {
    const q = activeFilters.city.toLowerCase();
    result = result.filter((job) =>
      [job.city, job.location, job.country].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }

  if (activeFilters.search) {
    const q = String(activeFilters.search).toLowerCase();
    result = result.filter((job) =>
      [job.title, job.company_name, job.company, job.description, job.desired_role, job.full_name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }

  return result;
};

/**
 * mode: 'home' | 'vacancies' | 'seekers'
 * Clive: main page mixes featured vacancies + seekers (no Post).
 * Vacancies / Job Seekers pages own their Post CTAs.
 */
const JobsBrowsePage = ({ mode = 'home' }) => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(
    searchParams.get('category') || ''
  );
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showPostForm, setShowPostForm] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [seekers, setSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topSearch, setTopSearch] = useState('');

  const isHome = mode === 'home';
  const isVacancies = mode === 'vacancies';
  const isSeekers = mode === 'seekers';
  const isCategoryView = Boolean(selectedCategorySlug);
  const postTypeFilterActive = !!(filters.featured || filters.promoted || filters.sponsored);

  const basePath = isVacancies ? '/jobs/vacancies' : isSeekers ? '/jobs/seekers' : '/jobs';

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    setSelectedCategorySlug(cat);
  }, [searchParams]);

  const handlePostClick = () => {
    const postType = isSeekers ? 'jobseeker' : isVacancies ? 'employer' : null;
    const msg = isSeekers
      ? 'You must be logged in to post a job seeker profile.'
      : isVacancies
        ? 'You must be logged in to post a vacancy.'
        : 'You must be logged in to post to Jobs.';
    const path = `${basePath}?postForm=true`;
    if (requireAuth(path, msg)) {
      setShowPostForm(true);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('postForm', 'true');
        if (postType) next.set('type', postType);
        return next;
      });
    }
  };

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        per_page: isHome ? 24 : 48,
        limit: isHome ? 24 : 48,
        sort_by: 'newest',
        search: filters.search || '',
        country: filters.country || '',
        location: filters.city || '',
      };
      if (selectedCategorySlug) {
        params.category = selectedCategorySlug;
      }

      if (isSeekers) {
        const response = await jobsAPI.getJobSeekers(params);
        setSeekers(applyClientFilters(extractSeekersList(response), filters));
        setJobs([]);
      } else if (isVacancies) {
        const response = await jobService.getJobs(params);
        const list = extractJobsList(response).map(normalizeJobForCard);
        setJobs(applyClientFilters(list, filters));
        setSeekers([]);
      } else {
        const [jobsRes, seekersRes] = await Promise.all([
          jobService.getJobs(params).catch(() => ({})),
          jobsAPI.getJobSeekers(params).catch(() => ({})),
        ]);
        const jobList = extractJobsList(jobsRes).map(normalizeJobForCard);
        setJobs(applyClientFilters(jobList, filters));
        setSeekers(applyClientFilters(extractSeekersList(seekersRes), filters));
      }
    } catch (error) {
      console.error('Error fetching jobs listings:', error);
      setJobs([]);
      setSeekers([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategorySlug, filters, isHome, isVacancies, isSeekers]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const { featured, sponsored, regular } = useMemo(
    () => splitListingsByPromotion(jobs),
    [jobs]
  );

  const featuredSeekers = useMemo(() => {
    const flagged = seekers.filter((s) => s.featured || s.is_featured || s.is_promoted);
    return (flagged.length ? flagged : seekers).slice(0, isHome ? 6 : 12);
  }, [seekers, isHome]);

  const handleFilterChange = (filterName, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [filterName]: value };
      if (typeof value === 'boolean' && !value) delete next[filterName];
      if ((typeof value === 'string' || typeof value === 'number') && value === '') delete next[filterName];
      return next;
    });
  };

  const applyFilters = () => {
    setFilters({ ...pendingFilters });
  };

  const clearFilters = () => {
    if (isCategoryView) {
      navigate(basePath);
      return;
    }
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
  };

  const clearExtraFilters = () => {
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
  };

  const applyTopSearch = () => {
    const next = { ...pendingFilters, search: topSearch };
    if (!topSearch.trim()) delete next.search;
    setPendingFilters(next);
    setFilters(next);
  };

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('postForm');
      next.delete('type');
      return next;
    });
    fetchListings();
  };

  const handleCategorySelect = (slug) => {
    if (selectedCategorySlug === slug) {
      navigate(basePath);
      return;
    }
    navigate(`${basePath}?category=${encodeURIComponent(slug)}`);
  };

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme="blue"
      asPanel={false}
      showActions={false}
      showTitle={false}
      showPrice={false}
    />
  );

  const activeFilterCount = Object.entries(filters).filter(([, v]) => {
    if (typeof v === 'boolean') return v;
    return v !== '' && v != null;
  }).length;

  const heroTitle = isVacancies
    ? 'Vacancies'
    : isSeekers
      ? 'Job Seekers'
      : 'Jobs & Vacancies';

  const countLabel = loading
    ? 'Loading…'
    : isSeekers
      ? `${seekers.length} seekers`
      : isVacancies
        ? `${jobs.length} vacancies`
        : `${featured.length || Math.min(jobs.length, 6)} featured · ${featuredSeekers.length} seekers`;

  const empty =
    !loading &&
    ((isSeekers && seekers.length === 0) ||
      (isVacancies && jobs.length === 0) ||
      (isHome && jobs.length === 0 && seekers.length === 0));

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <UnifiedNavbar showBackButton backHref={isHome && !isCategoryView ? '/' : '/jobs'} />

        <JobsHero
          title={heroTitle}
          categoryLabel={
            isCategoryView
              ? selectedCategorySlug.replace(/-/g, ' ')
              : null
          }
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
        />

        <div className="page-container py-4 sm:py-6">
          <BrowsePageBackBar
            to={isHome && !isCategoryView ? '/' : '/jobs'}
            label={isHome && !isCategoryView ? 'Back to Home' : 'Back to Jobs'}
          />
          <JobsCategoryGrid
            selectedCategorySlug={selectedCategorySlug}
            onSelectCategory={handleCategorySelect}
          />

          <BrowseFilterLayout
            open={showFilters}
            onOpenChange={setShowFilters}
            onApply={applyFilters}
            onClear={isCategoryView ? clearExtraFilters : clearFilters}
            theme="blue"
            homeHref="/jobs"
            filterFields={filterFields}
            activeCount={activeFilterCount}
            toolbarLeft={<p className="text-sm text-gray-600">{countLabel}</p>}
            toolbarRight={
              isHome ? (
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/jobs/seekers"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg"
                  >
                    Job Seekers
                  </Link>
                  <Link
                    to="/jobs/vacancies"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Vacancies
                  </Link>
                </div>
              ) : null
            }
          >
            {hasActiveFilters(filters) && empty && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={clearExtraFilters}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Clear and show all
                </button>
              </div>
            )}

            {empty ? (
              <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {isSeekers ? 'No job seekers found' : isVacancies ? 'No vacancies found' : 'No listings yet'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">Try changing your selection</p>
                <button
                  type="button"
                  onClick={clearExtraFilters}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Reset
                </button>
              </div>
            ) : (
              <>
                {(isHome || isVacancies) && (
                  <>
                    {isHome && (
                      <section className="mb-6">
                        <div className="flex items-end justify-between gap-2 mb-2">
                          <h2 className="text-sm font-bold text-gray-900">Featured vacancies</h2>
                          <Link to="/jobs/vacancies" className="text-xs font-semibold text-blue-700 hover:underline">
                            View all
                          </Link>
                        </div>
                        <JobsGrid
                          jobs={featured.length ? featured : jobs}
                          loading={loading && jobs.length === 0}
                          maxItems={6}
                          emptyMessage="No vacancies yet."
                        />
                      </section>
                    )}

                    {isVacancies && (
                      <>
                        {postTypeFilterActive ? (
                          <JobsGrid jobs={jobs} loading={loading} maxItems={12} />
                        ) : (
                          <>
                            {featured.length > 0 && (
                              <section className="mb-4">
                                <h2 className="text-sm font-bold text-gray-900 mb-2">Featured</h2>
                                <JobsGrid jobs={featured} loading={false} maxItems={3} />
                              </section>
                            )}
                            <JobsGrid jobs={regular} loading={loading} maxItems={12} />
                            {sponsored.length > 0 && (
                              <section className="mt-4">
                                <h2 className="text-sm font-bold text-gray-900 mb-2">Sponsored</h2>
                                <JobsGrid jobs={sponsored} loading={false} maxItems={3} />
                              </section>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}

                {(isHome || isSeekers) && seekers.length > 0 && (
                  <section className={isHome ? 'mt-2' : ''}>
                    {isHome && (
                      <div className="flex items-end justify-between gap-2 mb-2">
                        <h2 className="text-sm font-bold text-gray-900">Featured job seekers</h2>
                        <Link to="/jobs/seekers" className="text-xs font-semibold text-blue-700 hover:underline">
                          View all
                        </Link>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(isHome ? featuredSeekers : seekers).map((seeker) => (
                        <JobSeekerCard key={seeker.id || seeker.slug} seeker={seeker} />
                      ))}
                    </div>
                  </section>
                )}

                {isSeekers && !loading && seekers.length === 0 ? null : null}
              </>
            )}
          </BrowseFilterLayout>

          <BrowseBottomPostCta
            title={
              isSeekers
                ? 'Create a job seeker profile'
                : isVacancies
                  ? 'Post a vacancy'
                  : 'Hire or get hired'
            }
            description={
              isSeekers
                ? 'Share your skills and get discovered by employers worldwide.'
                : isVacancies
                  ? 'Reach candidates across Worldwide Adverts with your vacancy.'
                  : 'Post a vacancy or create a job seeker profile — Free, Paid, Featured or Sponsored.'
            }
            buttonLabel="Start selling"
            onPostClick={handlePostClick}
            theme="blue"
          />
        </div>

        <AnimatePresence>
          {showPostForm && (
            <JobsModalForm
              onClose={handleClosePostForm}
              onSuccess={fetchListings}
              defaultPostType={isSeekers ? 'jobseeker' : isVacancies ? 'employer' : undefined}
              lockPostType={!isHome}
            />
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default JobsBrowsePage;
