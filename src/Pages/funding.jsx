import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Users,
  Target,
  DollarSign,
  Eye,
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  AlertCircle,
  X,
  Filter,
  TrendingUp,
  Shield,
  CheckCircle,
  Star,
  Award,
  Zap,
  Globe,
  Sparkles
} from 'lucide-react';
import fundingAPI from '../api/fundingAPI';
import FundingPostFormModal from '../Component/funding/FundingPostFormModal';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';

const FundingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    project_type: '',
    country: '',
    funding_model: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    loadInitialData();
    // Check if postForm parameter is present in URL
    if (searchParams.get('postForm') === 'true') {
      setShowPostForm(true);
      // Remove the parameter from URL
      window.history.replaceState({}, '', '/funding');
    }
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load projects, featured projects, metadata, and statistics in parallel
      const [projectsRes, featuredRes, metadataRes, statsRes] = await Promise.all([
        fundingAPI.getProjects(filters),
        fundingAPI.getFeaturedProjects(),
        fundingAPI.getMetadata(),
        fundingAPI.getStatistics().catch(() => null)
      ]);

      if (projectsRes.success || projectsRes.data) {
        setProjects(projectsRes.data?.data || projectsRes.data || []);
      }

      if (featuredRes.success || featuredRes.data) {
        setFeaturedProjects(featuredRes.data?.data || featuredRes.data || []);
      }

      if (metadataRes.success || metadataRes.data) {
        setMetadata(metadataRes.data);
      }

      if (statsRes?.success || statsRes?.data) {
        setStatistics(statsRes.data);
      }
    } catch (err) {
      setError('Failed to load funding projects. Please try again.');
      console.error('Error loading funding data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    loadInitialData();
  }, [filters]);

  const handleCreateProject = () => {
    setEditData(null);
    setShowPostForm(true);
  };

  const handleEditProject = (project) => {
    setEditData(project);
    setShowPostForm(true);
  };

  const handleProjectSubmit = async (projectData) => {
    await loadInitialData();
    setShowPostForm(false);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await fundingAPI.deleteProject(projectId);
      await loadInitialData();
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    }
  };

  const handleSaveProject = async (projectId) => {
    // Implement save/favorite functionality
    console.log('Save project:', projectId);
  };

  const handleShareProject = (project) => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.origin + `/funding/project/${project.id}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/funding/project/${project.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const filteredProjects = projects.filter(project => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.tagline?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const ProjectCard = ({ project, isFeatured = false }) => {
    const progress = project.funding_goal > 0
      ? ((project.current_funded || 0) / project.funding_goal) * 100
      : 0;

    const daysLeft = project.funding_deadline
      ? Math.ceil((new Date(project.funding_deadline) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    const getRiskBadge = (riskLevel) => {
      switch(riskLevel) {
        case 'low':
          return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Low Risk</span>;
        case 'high':
          return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">High Risk</span>;
        default:
          return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Medium Risk</span>;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${
          isFeatured ? 'ring-2 ring-yellow-400' : ''
        }`}
      >
        {/* Project Image */}
        <div className="h-52 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
          {project.cover_image ? (
            <img
              src={project.cover_image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Target className="w-12 h-12 text-white opacity-50" />
            </div>
          )}

          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {project.is_verified && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-md">
                <CheckCircle className="w-3 h-3" />
                Verified Creator
              </span>
            )}
            {isFeatured && (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full shadow-md">
                Featured
              </span>
            )}
            {project.is_promoted && (
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full shadow-md">
                Promoted
              </span>
            )}
            {project.is_sponsored && (
              <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full shadow-md">
                Sponsored
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => handleSaveProject(project.id)}
              className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleShareProject(project)}
              className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-6">
          {/* Title and Tagline */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {project.title}
            </h3>
            {project.tagline && (
              <p className="text-sm text-gray-600 line-clamp-1">{project.tagline}</p>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.risk_level && getRiskBadge(project.risk_level)}
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {project.category}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {project.project_type}
            </span>
          </div>

          {/* Project Meta */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {project.country}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {project.backers_count || 0} backers
            </span>
            {daysLeft !== null && daysLeft > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {daysLeft} days left
              </span>
            )}
          </div>

          {/* Funding Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-2xl font-bold text-gray-900">
                {project.currency || '$'}{(project.current_funded || 0).toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">
                of {project.currency || '$'}{project.funding_goal?.toLocaleString() || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  progress >= 100 ? 'bg-green-500' :
                  progress >= 75 ? 'bg-blue-500' :
                  progress >= 50 ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 font-medium">
              {progress.toFixed(1)}% funded
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedProject(project)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm"
            >
              View Details
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading funding projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UnifiedNavbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-10 h-10 text-yellow-300" />
                <h1 className="text-4xl md:text-5xl font-bold">Fuel Ideas. Fund Impact.</h1>
                <Sparkles className="w-10 h-10 text-yellow-300" />
              </div>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Connect with global funders. Launch your next big idea. Discover projects seeking funding or become an investor in the next breakthrough.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => document.getElementById('projects-section').scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-center gap-2 bg-blue-500/30 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-500/50 transition-all duration-200 border border-white/30"
                >
                  <Target className="w-5 h-5" />
                  Browse Projects
                </button>
              </div>
            </motion.div>
          </div>

          {/* Trust Signals */}
          {statistics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-6 h-6 text-yellow-300" />
                  <span className="text-3xl font-bold">{statistics.active_projects || 0}</span>
                </div>
                <p className="text-blue-100 text-sm">Active Funders</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-6 h-6 text-green-300" />
                  <span className="text-3xl font-bold">${((statistics.total_funded || 0) / 1000000).toFixed(1)}M</span>
                </div>
                <p className="text-blue-100 text-sm">Total Funded</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <span className="text-3xl font-bold">{statistics.successful_projects || 0}</span>
                </div>
                <p className="text-blue-100 text-sm">Successful Projects</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Globe className="w-6 h-6 text-blue-300" />
                  <span className="text-3xl font-bold">{statistics.countries || 0}</span>
                </div>
                <p className="text-blue-100 text-sm">Countries</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="projects-section">
        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Technology', icon: Zap, color: 'from-blue-500 to-blue-600' },
              { name: 'Creative Arts', icon: Star, color: 'from-purple-500 to-purple-600' },
              { name: 'Community', icon: Users, color: 'from-green-500 to-green-600' },
              { name: 'Startups', icon: TrendingUp, color: 'from-orange-500 to-orange-600' },
              { name: 'Health', icon: Shield, color: 'from-red-500 to-red-600' },
              { name: 'Education', icon: Award, color: 'from-indigo-500 to-indigo-600' },
              { name: 'Real Estate', icon: Globe, color: 'from-teal-500 to-teal-600' },
              { name: 'Environment', icon: Sparkles, color: 'from-emerald-500 to-emerald-600' },
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => handleFilterChange('category', category.name.toLowerCase().replace(' ', '_').replace('&', '_and_'))}
                className={`p-4 rounded-xl bg-gradient-to-br ${category.color} text-white text-center hover:scale-105 transition-transform duration-200 shadow-md hover:shadow-lg ${
                  filters.category === category.name.toLowerCase().replace(' ', '_').replace('&', '_and_') ? 'ring-4 ring-offset-2 ring-blue-500' : ''
                }`}
              >
                <category.icon className="w-8 h-8 mx-auto mb-2" />
                <span className="font-medium text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search projects by title, description, or tagline..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            
            {metadata && (
              <>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {Object.entries(metadata.data?.categories || {}).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>

                <select
                  value={filters.project_type}
                  onChange={(e) => handleFilterChange('project_type', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {Object.entries(metadata.data?.project_types || {}).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>

                <select
                  value={filters.funding_model}
                  onChange={(e) => handleFilterChange('funding_model', e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Models</option>
                  {Object.entries(metadata.data?.funding_models || {}).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 3).map(project => (
                <ProjectCard key={project.id} project={project} isFeatured={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Projects */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Projects ({filteredProjects.length})
          </h2>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Be the first to create a project!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Project Modal */}
      <AnimatePresence>
        {showPostForm && (
          <FundingPostFormModal
            onClose={() => setShowPostForm(false)}
            onSubmit={handleProjectSubmit}
            editData={editData}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default FundingPage;
