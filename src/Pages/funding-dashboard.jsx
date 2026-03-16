import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Award,
  Eye,
  Clock,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Briefcase,
  Heart,
  Zap,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Download,
  Settings,
  AlertCircle,
  CheckCircle,
  Users,
  DollarSign
} from 'lucide-react';

import { useFundingData, useMyProjects, useFundingStats, usePromotionPlans } from '../hooks/useFundingData';
import fundingService from '../services/FundingService';

const FundingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Custom hooks for data
  const { stats, loading: statsLoading, error: statsError } = useFundingStats();
  const { projects, loading: projectsLoading, error: projectsError, refetch } = useFundingData();
  const { projects: myProjects, loading: myProjectsLoading } = useMyProjects();
  const { plans, loading: plansLoading } = usePromotionPlans();

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async () => {
    try {
      const response = await fundingService.createProject({
        title: 'New Project',
        project_type: 'general',
        funding_model: 'reward',
        status: 'draft'
      });
      
      // Redirect to project creation page
      window.location.href = `/funding/create?projectId=${response.data.id}`;
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handlePromoteProject = async (projectId, planId) => {
    try {
      await fundingService.purchaseUpsell(projectId, planId);
      refetch(); // Refresh data
    } catch (error) {
      console.error('Error purchasing promotion:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, color = 'blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  const ProjectCard = ({ project }) => {
    const progress = project.funding_goal > 0 
      ? (project.current_funding / project.funding_goal) * 100 
      : 0;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Project Header */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.status === 'active' ? 'bg-green-100 text-green-700' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
              project.status === 'draft' ? 'bg-gray-100 text-gray-700' :
              'bg-red-100 text-red-700'
            }`}>
              {project.status}
            </span>
          </div>

          {/* Funding Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${project.current_funding?.toLocaleString() || 0}</span>
              <span>${project.funding_goal?.toLocaleString() || 0}</span>
            </div>
          </div>

          {/* Project Details */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {project.project_type}
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {project.backer_count || 0}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {project.promotion_tier !== 'basic' && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  project.promotion_tier === 'sponsored' ? 'bg-purple-100 text-purple-700' :
                  project.promotion_tier === 'featured' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {project.promotion_tier}
                </span>
              )}
              <button
                onClick={() => window.location.href = `/funding/project/${project.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (statsLoading || projectsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Funding Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['overview', 'my-projects', 'all-projects', 'promotions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Projects"
                value={stats.totalProjects}
                icon={Briefcase}
                change={12}
                color="blue"
              />
              <StatCard
                title="Active Campaigns"
                value={stats.activeProjects}
                icon={Activity}
                change={8}
                color="green"
              />
              <StatCard
                title="Total Funding"
                value={`$${(stats.totalFunding / 1000).toFixed(0)}K`}
                icon={DollarSign}
                change={25}
                color="purple"
              />
              <StatCard
                title="Success Rate"
                value={`${stats.successRate}%`}
                icon={Target}
                change={5}
                color="yellow"
              />
            </div>

            {/* Featured Projects */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.featuredProjects.slice(0, 6).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Projects Tab */}
        {activeTab === 'my-projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">My Projects</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </button>
            </div>

            {myProjectsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your projects...</p>
              </div>
            ) : myProjects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-4">Create your first funding project to get started</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Projects Tab */}
        {activeTab === 'all-projects' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Projects Grid */}
            {projectsError ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading projects</h3>
                <p className="text-gray-600 mb-4">{projectsError}</p>
                <button
                  onClick={refetch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Promotions Tab */}
        {activeTab === 'promotions' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Promotion Plans</h2>
            
            {plansLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading promotion plans...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-3xl font-bold text-blue-600 mb-4">
                        ${plan.price}
                        <span className="text-sm text-gray-500 font-normal">/{plan.duration || 'month'}</span>
                      </p>
                      <ul className="text-left space-y-2 mb-6">
                        {plan.features?.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => {
                          // Handle promotion purchase
                          console.log('Purchase plan:', plan.id);
                        }}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          plan.id === 'basic' 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {plan.id === 'basic' ? 'Current Plan' : 'Upgrade'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Project</h3>
            <p className="text-gray-600 mb-6">
              Start a new funding campaign and bring your ideas to life.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCreateProject}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FundingDashboard;
