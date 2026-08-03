import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import jobService from '../../services/JobServices';
import { extractJobsList, normalizeJobForCard } from '../../utils/jobsHelpers';
import { splitListingsByPromotion } from '../../utils/listingPromotionSort';
import UnifiedNavbar from '../UnifiedNavbar';
import JobsHero from './JobsHero';
import JobsGrid from './JobsGrid';
import JobsCategoryGrid from './JobsCategoryGrid';
import JobsModalForm from './JobsModalForm';
import BrowseBottomPostCta from '../shared/BrowseBottomPostCta';
import StandardListingFilters from '../shared/StandardListingFilters';
import { BrowseFilterLayout } from '../shared/BrowseFilterLayout';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Footer from '../Footer';

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

  return result;
};

const JobsBrowsePage = () => {
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
  const [loading, setLoading] = useState(true);
  const [topSearch, setTopSearch] = useState('');

  const isCategoryView = Boolean(selectedCategorySlug);
  const postTypeFilterActive = !!(filters.featured || filters.promoted || filters.sponsored);

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    setSelectedCategorySlug(cat);
  }, [searchParams]);

  const handlePostClick = () => {
    if (requireAuth('/jobs?postForm=true', 'You must be logged in to post a job.')) {
      setShowPostForm(true);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('postForm', 'true');
        return next;
      });
    }
  };

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        per_page: 48,
        sort_by: 'newest',
        search: filters.search || '',
        country: filters.country || '',
        location: filters.city || '',
      };
      if (selectedCategorySlug) {
        params.category = selectedCategorySlug;
      }

      const response = await jobService.getJobs(params);
      const list = extractJobsList(response).map(normalizeJobForCard);
      setJobs(applyClientFilters(list, filters));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategorySlug, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const { featured, sponsored, regular } = useMemo(
    () => splitListingsByPromotion(jobs),
    [jobs]
  );

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
      navigate('/jobs');
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
      return next;
    });
    fetchJobs();
  };

  const handleCategorySelect = (slug) => {
    if (selectedCategorySlug === slug) {
      navigate('/jobs');
      return;
    }
    navigate(`/jobs?category=${encodeURIComponent(slug)}`);
  };

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme="blue"
      searchPlaceholder="Search by job title or company…"
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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <UnifiedNavbar showBackButton backHref={isCategoryView ? '/jobs' : '/'} />

        <JobsHero
          categoryLabel={isCategoryView ? selectedCategorySlug.replace(/-/g, ' ') : null}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
          templatesHref="/jobs/templates"
          calculatorsHref="/jobs/calculators"
        />

        <div className="page-container py-4 sm:py-6">
          {!isCategoryView && (
            <JobsCategoryGrid
              selectedCategorySlug={selectedCategorySlug}
              onSelectCategory={handleCategorySelect}
            />
          )}

          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <Link
              to="/job-seekers"
              className="inline-flex items-center rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-semibold text-blue-700 hover:bg-blue-50"
            >
              Browse job seekers
            </Link>
          </div>

          <BrowseFilterLayout
            open={showFilters}
            onOpenChange={setShowFilters}
            onApply={applyFilters}
            onClear={isCategoryView ? clearExtraFilters : clearFilters}
            theme="blue"
            homeHref="/jobs"
            filterFields={filterFields}
            activeCount={activeFilterCount}
            toolbarLeft={
              <p className="text-sm text-gray-600">
                {loading ? 'Loading…' : `${jobs.length} jobs`}
              </p>
            }
            toolbarRight={
              <button
                type="button"
                onClick={handlePostClick}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg self-start sm:self-auto"
              >
                <FiPlus className="h-3.5 w-3.5" />
                Post a job
              </button>
            }
          >
            {hasActiveFilters(filters) && !loading && jobs.length === 0 && (
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

            {!loading && jobs.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-2">No jobs found</h3>
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
          </BrowseFilterLayout>

          <BrowseBottomPostCta
            title="Post a job opening"
            buttonLabel="Post a job opening"
            onPostClick={handlePostClick}
            theme="blue"
            compact
          />
        </div>

        <AnimatePresence>
          {showPostForm && (
            <JobsModalForm onClose={handleClosePostForm} onSuccess={fetchJobs} />
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default JobsBrowsePage;
