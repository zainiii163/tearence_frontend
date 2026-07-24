import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart, 
  Users, 
  Target, 
  Calendar,
  TrendingUp,
  Star,
  ChevronRight,
  ArrowRight,
  Award,
  Zap,
  Eye,
  Clock,
  DollarSign,
  Briefcase,
  MapPin,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { useFundingData, usePromotionPlans } from '../hooks/useFundingData';
import fundingService from '../services/FundingService';

const FundingProjects = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    project_type: 'all',
    funding_model: 'all',
    promotion_tier: 'all',
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  const { 
    projects, 
    loading, 
    error, 
    pagination, 
    fetchProjects, 
    loadMore 
  } = useFundingData(filters);
  
  const { plans } = usePromotionPlans();

  // Apply search filter
  const filteredProjects = projects.filter(project => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      project.title?.toLowerCase().includes(searchLower) ||
      project.description?.toLowerCase().includes(searchLower) ||
      project.project_type?.toLowerCase().includes(searchLower)
    );
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sort_by: sortBy,
      sort_order: prev.sort_by === sortBy && prev.sort_order === 'desc' ? 'asc' : 'desc'
    }));
  };

  const ProjectCard = ({ project, isListView = false }) => {
    const progress = project.funding_goal > 0 
      ? (project.current_funding / project.funding_goal) * 100 
      : 0;
    
    const daysLeft = project.end_date 
      ? Math.ceil((new Date(project.end_date) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${
          isListView ? 'flex' : ''
        }`}
      >
        {/* Project Image/Thumbnail */}
        <div className={`${isListView ? 'w-64 h-48' : 'h-48'} bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden`}>
          {project.cover_image ? (
            <img 
              src={project.cover_image} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Briefcase className="w-12 h-12 text-white opacity-50" />
            </div>
          )}
          
          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {project.status === 'active' && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                Active
              </span>
            )}
            {project.promotion_tier !== 'basic' && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                project.promotion_tier === 'sponsored' ? 'bg-purple-500 text-white' :
                project.promotion_tier === 'featured' ? 'bg-yellow-500 text-white' :
                'bg-blue-500 text-white'
              }`}>
                {project.promotion_tier}
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Content */}
        <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          </div>

          {/* Project Meta */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
            <span className="flex items-center">
              <Target className="w-4 h-4 mr-1" />
              {project.project_type}
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {project.location || 'Global'}
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {project.backer_count || 0} backers
            </span>
            {daysLeft !== null && (
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {daysLeft} days left
              </span>
            )}
          </div>

          {/* Funding Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-2xl font-bold text-gray-900">
                ${project.current_funding?.toLocaleString() || 0}
              </span>
              <span className="text-sm text-gray-500">
                of ${project.funding_goal?.toLocaleString() || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  progress >= 100 ? 'bg-green-500' :
                  progress >= 75 ? 'bg-blue-500' :
                  progress >= 50 ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">{progress.toFixed(1)}% funded</span>
              {daysLeft !== null && (
                <span className="text-gray-500">{daysLeft} days left</span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setSelectedProject(project)}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            View Project
            <ArrowRight className="w-4 h-4 ml-2 inline" />
          </button>
        </div>
      </motion.div>
    );
  };

  const FilterPanel = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Project Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
          <select
            value={filters.project_type}
            onChange={(e) => handleFilterChange('project_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="technology">Technology</option>
            <option value="social">Social</option>
            <option value="environment">Environment</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="arts">Arts</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* Funding Model Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Funding Model</label>
          <select
            value={filters.funding_model}
            onChange={(e) => handleFilterChange('funding_model', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Models</option>
            <option value="donation">Donation</option>
            <option value="reward">Reward-based</option>
            <option value="equity">Equity</option>
            <option value="loan">Loan</option>
          </select>
        </div>

        {/* Promotion Tier Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Promotion Tier</label>
          <select
            value={filters.promotion_tier}
            onChange={(e) => handleFilterChange('promotion_tier', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Tiers</option>
            <option value="basic">Basic</option>
            <option value="promoted">Promoted</option>
            <option value="featured">Featured</option>
            <option value="sponsored">Sponsored</option>
          </select>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        {[
          { key: 'created_at', label: 'Latest' },
          { key: 'funding_goal', label: 'Goal Amount' },
          { key: 'current_funding', label: 'Amount Raised' },
          { key: 'backer_count', label: 'Backers' },
          { key: 'end_date', label: 'Ending Soon' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleSortChange(key)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              filters.sort_by === key
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
            {filters.sort_by === key && (
              <span className="ml-1">
                {filters.sort_order === 'desc' ? '↓' : '↑'}
              </span>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-container">
          <div className="py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Funding Projects</h1>
                <p className="text-gray-600 mt-1">
                  Discover and support innovative projects from around the world
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects, categories, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-3 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-500 text-blue-600' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
                {Object.values(filters).filter(v => v !== 'all').length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {Object.values(filters).filter(v => v !== 'all').length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && <FilterPanel />}
      </AnimatePresence>

      {/* Main Content */}
      <div className="page-container py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-600">
              Showing {filteredProjects.length} of {pagination.totalItems} projects
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filters.sort_by}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="created_at">Latest</option>
              <option value="funding_goal">Goal Amount</option>
              <option value="current_funding">Amount Raised</option>
              <option value="backer_count">Most Backers</option>
              <option value="end_date">Ending Soon</option>
            </select>
          </div>
        </div>

        {/* Projects Grid/List */}
        {error ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading projects</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchProjects()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new projects'}
            </p>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  isListView={viewMode === 'list'}
                />
              ))}
            </div>

            {/* Load More Button */}
            {pagination.currentPage < pagination.totalPages && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Projects'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-600 mb-6">{selectedProject.description}</p>
                  
                  {/* Project Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Raised</p>
                      <p className="text-lg font-bold">${selectedProject.current_funding?.toLocaleString() || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Goal</p>
                      <p className="text-lg font-bold">${selectedProject.funding_goal?.toLocaleString() || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Backers</p>
                      <p className="text-lg font-bold">{selectedProject.backer_count || 0}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Days Left</p>
                      <p className="text-lg font-bold">
                        {selectedProject.end_date 
                          ? Math.ceil((new Date(selectedProject.end_date) - new Date()) / (1000 * 60 * 60 * 24))
                          : '∞'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => window.location.href = `/funding/project/${selectedProject.id}`}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      View Full Project
                    </button>
                    <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                      Save Project
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FundingProjects;
