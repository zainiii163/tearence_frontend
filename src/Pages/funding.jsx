import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import fundingAPI from '../api/fundingAPI';
import FundingPostFormModal from '../Component/funding/FundingPostFormModal';
import FundingCrowdfundHero from '../Component/funding/FundingCrowdfundHero';
import FundingCampaignGrid from '../Component/funding/FundingCampaignGrid';
import BrowseCenteredSearch from '../Component/shared/BrowseCenteredSearch';
import StandardListingFilters from '../Component/shared/StandardListingFilters';
import { BrowseFilterLayout } from '../Component/shared/BrowseFilterLayout';
import BrowseBottomPostCta from '../Component/shared/BrowseBottomPostCta';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import useAuthRedirect from '../hooks/useAuthRedirect';
import {
  getPixmuseFundingPrefill,
  isPixmuseDemo,
} from '../data/pixmuseDemoPrefill';

const FundingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuthRedirect();

  const [projects, setProjects] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [topSearch, setTopSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const wantsForm = searchParams.get('postForm') === 'true';
    const demo = isPixmuseDemo(searchParams);
    if (wantsForm && (demo || isAuthenticated)) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  const demoMode = isPixmuseDemo(searchParams);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsRes, featuredRes] = await Promise.all([
        fundingAPI.getProjects({}),
        fundingAPI.getFeaturedProjects().catch(() => null),
      ]);

      if (projectsRes.success || projectsRes.data) {
        setProjects(projectsRes.data?.data || projectsRes.data || []);
      }

      if (featuredRes?.success || featuredRes?.data) {
        setFeaturedProjects(featuredRes.data?.data || featuredRes.data || []);
      }
    } catch (err) {
      setError('Failed to load funding campaigns. Please try again.');
      console.error('Error loading funding data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setEditData(null);
    if (searchParams.get('postForm') || searchParams.get('demo')) {
      setSearchParams({}, { replace: true });
    }
  };

  const handleCreateCampaign = () => {
    if (requireAuth('/funding?postForm=true', 'You must be logged in to post a funding request.')) {
      setEditData(null);
      setShowPostForm(true);
    }
  };

  const handleProjectSubmit = async () => {
    await loadInitialData();
    handleClosePostForm();
  };

  const handleFilterChange = (key, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (typeof value === 'boolean' && !value) delete next[key];
      if ((typeof value === 'string' || typeof value === 'number') && value === '') delete next[key];
      return next;
    });
  };

  const applyFilters = () => setFilters({ ...pendingFilters });

  const clearFilters = () => {
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

  const filteredProjects = useMemo(() => {
    let result = projects;
    const search = (filters.search || '').trim().toLowerCase();

    if (search) {
      result = result.filter((p) => {
        const haystack = [p.title, p.tagline, p.description, p.category, p.country, p.city]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    if (filters.country) {
      const q = filters.country.toLowerCase();
      result = result.filter((p) => (p.country || '').toLowerCase().includes(q));
    }
    if (filters.city) {
      const q = filters.city.toLowerCase();
      result = result.filter((p) => (p.city || '').toLowerCase().includes(q));
    }
    if (filters.priceMin) {
      const min = Number(filters.priceMin);
      result = result.filter((p) => Number(p.funding_goal || p.goal_amount || 0) >= min);
    }
    if (filters.priceMax) {
      const max = Number(filters.priceMax);
      result = result.filter((p) => Number(p.funding_goal || p.goal_amount || 0) <= max);
    }

    if (filters.featured || filters.promoted || filters.sponsored) {
      const featuredIds = new Set(featuredProjects.map((p) => p.id));
      result = result.filter((p) => {
        const checks = [];
        if (filters.featured) checks.push(featuredIds.has(p.id) || !!(p.featured || p.is_featured));
        if (filters.promoted) checks.push(!!(p.promoted || p.is_promoted || p.promotion_tier === 'promoted'));
        if (filters.sponsored) checks.push(!!(p.sponsored || p.is_sponsored || p.promotion_tier === 'sponsored'));
        return checks.some(Boolean);
      });
    }

    return result;
  }, [projects, featuredProjects, filters]);

  if (loading && !projects.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#02a95c] animate-spin mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Loading funding campaigns…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex flex-col">
      <UnifiedNavbar />
      <FundingCrowdfundHero />

      {error && (
        <div className="page-container pt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-red-700 text-sm flex-1">{error}</p>
            <button type="button" onClick={() => setError(null)} className="text-red-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="page-container py-4 sm:py-6 pb-10" id="campaigns-section">
        <BrowseCenteredSearch
          value={topSearch}
          onChange={(e) => setTopSearch(e.target.value)}
          onSubmit={applyTopSearch}
          placeholder="Search by campaign or business name…"
          theme="green"
        />

        <BrowseFilterLayout
          open={showFilters}
          onOpenChange={setShowFilters}
          onApply={applyFilters}
          onClear={clearFilters}
          theme="green"
          homeHref="/funding"
          filterFields={
            <StandardListingFilters
              filters={pendingFilters}
              onFilterChange={handleFilterChange}
              onApply={applyFilters}
              onClear={clearFilters}
              theme="green"
              searchPlaceholder="Search campaigns…"
              asPanel={false}
              showActions={false}
              showTitle={false}
            />
          }
          activeCount={Object.entries(filters).filter(([, v]) => {
            if (typeof v === 'boolean') return v;
            return v !== '' && v != null;
          }).length}
          toolbarLeft={
            <p className="text-sm text-gray-600">
              {loading ? 'Loading…' : `${filteredProjects.length} campaigns`}
            </p>
          }
        >
          <FundingCampaignGrid campaigns={filteredProjects} loading={loading} />

          <BrowseBottomPostCta
            title="Need funding for your business?"
            description="Log in and create a campaign — Free, Paid, Featured or Sponsored."
            buttonLabel="Start a funding request"
            onPostClick={handleCreateCampaign}
            theme="green"
          />
        </BrowseFilterLayout>
      </div>

      <AnimatePresence>
        {showPostForm && (
          <FundingPostFormModal
            onClose={handleClosePostForm}
            onSubmit={handleProjectSubmit}
            editData={editData}
            demoMode={demoMode}
            prefillData={demoMode ? getPixmuseFundingPrefill() : null}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default FundingPage;
