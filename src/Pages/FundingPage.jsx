import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Heart, 
  TrendingUp, 
  Star,
  Target,
  DollarSign,
  Users,
  Calendar,
  Grid,
  List,
  ChevronDown,
  X
} from 'lucide-react';

import FundingGrid from '../Component/funding/FundingGrid';
import FundingFilters from '../Component/funding/FundingFilters';
import FundingPledgeForm from '../Component/funding/FundingPledgeForm';
import FundingPostForm from '../Component/funding/FundingPostForm';
import BusinessCalculators from '../Component/calculators/BusinessCalculators';
import fundingService from '../services/FundingService';

const FundingPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [metadata, setMetadata] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    project_type: '',
    country: '',
    funding_model: '',
    sort: 'latest'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectRewards, setSelectedProjectRewards] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load metadata and projects
  useEffect(() => {
    loadMetadata();
    loadProjects();
  }, []);

  useEffect(() => {
    loadProjects();
  }, [filters]);

  const loadMetadata = async () => {
    try {
      const response = await fundingService.getMetadata();
      setMetadata(response.data);
    } catch (err) {
      console.error('Error loading metadata:', err);
    }
  };

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fundingService.getProjects(filters);
      setProjects(response.data?.data || response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const response = await fundingService.searchProjects(query, filters);
        setProjects(response.data?.data || response.data || []);
      } catch (err) {
        console.error('Error searching projects:', err);
      }
    } else {
      loadProjects();
    }
  };

  const handleBackProject = async (projectId) => {
    try {
      // Load project details and rewards
      const projectResponse = await fundingService.getProject(projectId);
      const project = projectResponse.data;
      
      setSelectedProject(project);
      setSelectedProjectRewards(project.rewards || []);
      setShowPledgeForm(true);
    } catch (err) {
      console.error('Error loading project details:', err);
      setError('Failed to load project details');
    }
  };

  const handlePledgeSuccess = (pledge) => {
    // Refresh projects to show updated funding amount
    loadProjects();
    setShowPledgeForm(false);
    setSelectedProject(null);
    setSelectedProjectRewards([]);
  };

  const handleCreateProject = () => {
    setShowCreateForm(true);
  };

  const handleProjectCreated = (project) => {
    setShowCreateForm(false);
    loadProjects(); // Refresh the projects list
  };

  const handleShareProject = (project) => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.tagline,
        url: window.location.origin + `/funding/${project.id}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/funding/${project.id}`);
      alert('Project link copied to clipboard!');
    }
  };

  const handleSaveProject = async (projectId) => {
    // This would need to be implemented in the backend
    console.log('Save project:', projectId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="page-container py-12">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              Fund Your Dreams
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl mb-8 max-w-2xl mx-auto"
            >
              Support innovative projects and bring creative ideas to life. Join our community of backers and creators.
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto mb-6"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for projects..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">
                  ${projects.reduce((sum, p) => sum + (p.amount_raised || 0), 0).toLocaleString()}
                </div>
                <div className="text-blue-100">Total Raised</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">
                  {projects.reduce((sum, p) => sum + (p.backer_count || 0), 0).toLocaleString()}
                </div>
                <div className="text-blue-100">Total Backers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{projects.length}</div>
                <div className="text-blue-100">Active Projects</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container py-8">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {Object.values(filters).some(v => v) && (
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <FundingFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={metadata?.categories ? Object.entries(metadata.categories).map(([key, value]) => ({ id: key, name: value })) : []}
              projectTypes={metadata?.project_types ? Object.entries(metadata.project_types).map(([key, value]) => ({ id: key, name: value })) : []}
              fundingModels={metadata?.funding_models ? Object.entries(metadata.funding_models).map(([key, value]) => ({ id: key, name: value })) : []}
            />
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <X className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <FundingGrid
            projects={projects}
            viewMode={viewMode}
            onBackProject={handleBackProject}
            onSaveProject={handleSaveProject}
            onShareProject={handleShareProject}
          />
        )}

        {/* No Projects State */}
        {!loading && projects.length === 0 && !error && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or be the first to create a project!</p>
            <button
              onClick={handleCreateProject}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create the First Project
            </button>
          </div>
        )}
      </div>

      {/* Pledge Form Modal */}
      {showPledgeForm && selectedProject && (
        <FundingPledgeForm
          project={selectedProject}
          rewards={selectedProjectRewards}
          onClose={() => {
            setShowPledgeForm(false);
            setSelectedProject(null);
            setSelectedProjectRewards([]);
          }}
          onSuccess={handlePledgeSuccess}
        />
      )}

      {/* Create Project Form Modal */}
      {showCreateForm && (
        <FundingPostForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleProjectCreated}
        />
      )}

      <BusinessCalculators />
    </div>
  );
};

export default FundingPage;
