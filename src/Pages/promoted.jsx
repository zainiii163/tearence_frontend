import React, { useState, useEffect } from 'react';
import { Plus, Grid, List, Search } from 'lucide-react';
import PromotedPostForm from '../Component/promoted-new/PromotedPostForm';
import PromotedHero from '../Component/promoted-new/PromotedHero';
import PromotedCategoryGrid from '../Component/promoted-new/PromotedCategoryGrid';
import PromotedFilters from '../Component/promoted-new/PromotedFilters';
import PromotedActivityFeed from '../Component/promoted-new/PromotedActivityFeed';
import PromotedCard from '../Component/promoted-new/PromotedCard';
import { promotedAdvertsAPI, categoriesAPI } from '../services/promotedAdvertsAPI';

const PromotedAdvertsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [adverts, setAdverts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category_id: '',
    country: '',
    advert_type: '',
    promotion_tier: '',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadAdverts();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [advertsData, categoriesData, statsData] = await Promise.all([
        promotedAdvertsAPI.getAdverts(filters),
        categoriesAPI.getCategories(),
        promotedAdvertsAPI.getStatistics(),
      ]);

      if (advertsData.success) {
        setAdverts(advertsData.data?.data || []);
      }
      if (categoriesData.success) {
        setCategories(categoriesData.data || []);
      }
      if (statsData.success) {
        setStatistics(statsData.data);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAdverts = async () => {
    try {
      setLoading(true);
      const response = await promotedAdvertsAPI.getAdverts(filters);
      if (response.success) {
        setAdverts(response.data?.data || []);
      }
    } catch (err) {
      console.error('Failed to load adverts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleCategorySelect = (categorySlug) => {
    const category = categories.find(c => c.slug === categorySlug);
    if (category) {
      handleFilterChange({ category_id: category.id });
    } else {
      handleFilterChange({ category_id: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PromotedHero statistics={statistics} />

      {/* Main Content */}
      <div className="page-container py-8">
        {/* Category Grid */}
        <PromotedCategoryGrid 
          categories={categories} 
          onCategorySelect={handleCategorySelect}
          selectedCategory={filters.category_id}
        />

        {/* Filters */}
        <div className="mt-8 mb-6">
          <PromotedFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            categories={categories}
          />
        </div>

        {/* Header with Create Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Promoted Adverts</h2>
            <p className="text-gray-600">{adverts.length} listings available</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Promoted Advert
            </button>
          </div>
        </div>

        {/* Adverts Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-80 animate-pulse" />
            ))}
          </div>
        ) : adverts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No promoted adverts found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or create a new promoted advert</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Promoted Advert
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adverts.map((advert) => (
              <PromotedCard key={advert.id} advert={advert} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {adverts.map((advert) => (
              <PromotedCard key={advert.id} advert={advert} viewMode="list" />
            ))}
          </div>
        )}

        {/* Activity Feed */}
        <div className="mt-12">
          <PromotedActivityFeed />
        </div>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <PromotedPostForm onClose={() => {
          setShowForm(false);
          loadData();
        }} />
      )}
    </div>
  );
};

export default PromotedAdvertsPage;
