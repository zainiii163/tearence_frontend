import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import fundingAPI from '../api/fundingAPI';
import FundingPostFormModal from '../Component/funding/FundingPostFormModal';
import FundingCrowdfundHero from '../Component/funding/FundingCrowdfundHero';
import FundingCampaignGrid from '../Component/funding/FundingCampaignGrid';
import FundingCategoryGrid from '../Component/funding/FundingCategoryGrid';
import StandardListingFilters from '../Component/shared/StandardListingFilters';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import CompactPremiumReel from '../Component/shared/CompactPremiumReel';
import BrowsePromotionLanes from '../Component/shared/BrowsePromotionLanes';
import { getCategoryTheme } from '../constants/categoryThemes';
import useAuthRedirect from '../hooks/useAuthRedirect';
import { FUNDING_DEMO_CAMPAIGNS } from '../data/fundingDemoCampaigns';
import { splitListingsByPromotion } from '../utils/listingPromotionSort';

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
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsRes, featuredRes] = await Promise.all([
        fundingAPI.getProjects({}),
        fundingAPI.getFeaturedProjects().catch(() => null),
      ]);

      const list = projectsRes?.data?.data || projectsRes?.data || [];
      const liveProjects = Array.isArray(list) ? list : [];
      const projects = liveProjects.length ? liveProjects : FUNDING_DEMO_CAMPAIGNS;
      setProjects(projects);

      const featured = featuredRes?.data?.data || featuredRes?.data || [];
      const liveFeatured = Array.isArray(featured) ? featured : [];
      setFeaturedProjects(
        liveFeatured.length
          ? liveFeatured
          : projects.filter((p) => p.is_featured || p.featured)
      );
    } catch (err) {
      setError(null);
      console.error('Error loading funding data:', err);
      setProjects(FUNDING_DEMO_CAMPAIGNS);
      setFeaturedProjects(FUNDING_DEMO_CAMPAIGNS.filter((p) => p.is_featured || p.featured));
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
    if (searchParams.get('postForm')) {
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

    if (selectedCategory && selectedCategory !== 'all') {
      const key = String(selectedCategory).toLowerCase();
      result = result.filter((p) => {
        const cat = String(p.category || p.category_name || p.project_type || '').toLowerCase();
        return cat === key || cat.includes(key);
      });
    }

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
  }, [projects, featuredProjects, filters, selectedCategory]);

  const { promoted, regular } = useMemo(
    () => splitListingsByPromotion(filteredProjects),
    [filteredProjects]
  );

  const fundingCategories = useMemo(() => {
    const map = new Map();
    for (const p of projects) {
      const name = p.category || p.category_name || p.project_type;
      if (!name) continue;
      const key = String(name);
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, project_count]) => ({
      id: name,
      name,
      slug: String(name).toLowerCase().replace(/\s+/g, '-'),
      project_count,
    }));
  }, [projects]);

  const theme = getCategoryTheme('funding');

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
    <CategoryPageShell
      categoryId="funding"
      backHref="/"
      showBackBar
      backBarTo="/"
      backBarLabel="Back Home"
      className="bg-[#f8f8f8] flex flex-col"
      contentClassName="page-container py-4 sm:py-6 pb-10"
      hero={
        <FundingCrowdfundHero
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
        />
      }
      categoryGrid={
        fundingCategories.length > 0 ? (
          <FundingCategoryGrid
            categories={fundingCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={(cat) =>
              setSelectedCategory(String(cat) === String(selectedCategory) ? 'all' : cat)
            }
          />
        ) : null
      }
      premiumReel={
        featuredProjects.length > 0 ? (
          <CompactPremiumReel
            items={featuredProjects.slice(0, 12)}
            title="Featured"
            getHref={(item) => `/funding/${item.slug || item.id}`}
            accentClass={theme.accentText || 'text-emerald-700'}
            borderAccent="hover:border-emerald-300"
          />
        ) : null
      }
      beforeFilters={
        error ? (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-red-700 text-sm flex-1">{error}</p>
            <button type="button" onClick={() => setError(null)} className="text-red-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : null
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: clearFilters,
        theme: theme.filterTheme,
        homeHref: '/funding',
        filterFields: (
          <StandardListingFilters
            filters={pendingFilters}
            onFilterChange={handleFilterChange}
            onApply={applyFilters}
            onClear={clearFilters}
            theme={theme.filterTheme}
            searchPlaceholder="Search campaigns…"
            asPanel={false}
            showActions={false}
            showTitle={false}
          />
        ),
        activeCount: Object.entries(filters).filter(([, v]) => {
          if (typeof v === 'boolean') return v;
          return v !== '' && v != null;
        }).length,
      }}
      bottomCta={{
        buttonLabel: 'List your funding projects',
        onPostClick: handleCreateCampaign,
        theme: theme.ctaTheme,
      }}
      afterContent={
        <AnimatePresence>
          {showPostForm && (
            <FundingPostFormModal
              onClose={handleClosePostForm}
              onSubmit={handleProjectSubmit}
              editData={editData}
            />
          )}
        </AnimatePresence>
      }
    >
      <BrowsePromotionLanes
        promoted={promoted}
        paid={regular.length ? regular : filteredProjects}
        maxPromoted={9}
        renderGrid={(items) => (
          <FundingCampaignGrid campaigns={items} loading={loading && items === filteredProjects} />
        )}
      />
    </CategoryPageShell>
  );
};

export default FundingPage;
