import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Plus,
  Users,
  Target,
  Award,
  Shield,
  Zap,
  ArrowRight,
  Eye,
  Menu,
  X,
  Home,
  Grid3x3,
  Car,
  BookOpen,
  Plane,
  ShoppingBag,
  Briefcase,
  Calendar,
  ArrowLeft,
  UserCheck,
  HandHeart,
  Crown,
  Gem,
  Sparkles,
  Heart,
  Loader2,
  AlertCircle,
  Globe,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';

// Import components
import FundingNavbar from '../Component/funding/FundingNavbar';
import FundingHero from '../Component/funding/FundingHero';
import FundingCategoryGrid from '../Component/funding/FundingCategoryGrid';
import FundingFilters from '../Component/funding/FundingFilters';
import FundingGrid from '../Component/funding/FundingGrid';
import FundingActivityFeed from '../Component/funding/FundingActivityFeed';
import FundingPostForm from '../Component/funding/FundingPostForm';
import FundingFooter from '../Component/funding/FundingFooter';

// Import hooks and API
import useFunding from '../hooks/useFunding';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import fundingService from '../services/FundingService';

const FundingHub = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { requireAuth } = useAuthRedirect();
  const {
    projects,
    featuredProjects,
    trendingProjects,
    endingSoonProjects,
    metadata,
    loading,
    error,
    loadProjects,
    createProject,
    makePledge,
    purchaseUpsell,
    clearError
  } = useFunding();
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    country: '',
    fundingGoal: '',
    verifiedOnly: false,
    sortBy: 'newest'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const projectsPerPage = 12;

  // Handle URL parameter for post form
  useEffect(() => {
    const postFormParam = searchParams.get('postForm');
    if (postFormParam === 'true') {
      // Check authentication before showing post form
      if (requireAuth('/funding?postForm=true', 'You must be logged in to create a funding project.')) {
        setShowPostForm(true);
      }
    }
  }, [searchParams, requireAuth]);

  // Update filtered projects when projects data changes
  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  // Filter and sort projects
  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Apply advanced filters
    if (filters.category) {
      filtered = filtered.filter(project => project.category === filters.category);
    }

    if (filters.country) {
      filtered = filtered.filter(project => 
        project.country?.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    if (filters.verifiedOnly) {
      filtered = filtered.filter(project => project.is_verified || project.verifiedCreator);
    }

    if (filters.fundingGoal) {
      filtered = filtered.filter(project => project.funding_goal <= parseInt(filters.fundingGoal));
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'mostFunded':
        filtered.sort((a, b) => {
          const aPercentage = a.funding_goal > 0 ? (a.amount_raised / a.funding_goal) : 0;
          const bPercentage = b.funding_goal > 0 ? (b.amount_raised / b.funding_goal) : 0;
          return bPercentage - aPercentage;
        });
        break;
      case 'trending':
        filtered.sort((a, b) => (b.backer_count || 0) - (a.backer_count || 0));
        break;
      case 'endingSoon':
        filtered.sort((a, b) => {
          const aDays = a.days_remaining || Infinity;
          const bDays = b.days_remaining || Infinity;
          return aDays - bDays;
        });
        break;
      default:
        break;
    }

    setFilteredProjects(filtered);
    setCurrentPage(1);
  }, [projects, selectedCategory, searchQuery, filters]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      country: '',
      fundingGoal: '',
      verifiedOnly: false,
      sortBy: 'newest'
    });
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const handleProjectSubmit = async (projectData) => {
    try {
      await createProject(projectData);
      setShowPostForm(false);
      // Show success message (you could add a toast notification here)
      console.log('Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
      // Error is already handled by the hook
    }
  };

  const handleBackProject = async (projectId) => {
    try {
      await makePledge(projectId, { amount: 25 }); // Default pledge amount
      console.log('Successfully backed project:', projectId);
    } catch (error) {
      console.error('Error backing project:', error);
      throw error;
    }
  };

  const handleSaveProject = async (projectId) => {
    try {
      // Implement save/favorite functionality via API
      console.log('Saved project:', projectId);
      // await fundingService.saveProject(projectId);
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  };

  const handleShareProject = (project) => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.tagline || project.description,
        url: window.location.origin + `/funding/${project.id}`
      });
    }
  };

  const handlePostProjectClick = () => {
    if (requireAuth('/funding?postForm=true', 'You must be logged in to create a funding project.')) {
      setShowPostForm(true);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);

  // Get categories from metadata or use fallback
  const categories = metadata?.categories || [
    {
      id: 1,
      name: "Technology & Innovation",
      icon: <Zap className="w-6 h-6" />,
      color: "from-blue-500 to-purple-600",
      count: 234,
      trending: 45,
      mostFunded: 12,
      newThisWeek: 8
    },
    {
      id: 2,
      name: "Creative Arts",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-pink-500 to-rose-600",
      count: 189,
      trending: 32,
      mostFunded: 8,
      newThisWeek: 15
    },
    {
      id: 3,
      name: "Community & Social Impact",
      icon: <HandHeart className="w-6 h-6" />,
      color: "from-green-500 to-teal-600",
      count: 156,
      trending: 28,
      mostFunded: 6,
      newThisWeek: 12
    },
    {
      id: 4,
      name: "Startups & Small Business",
      icon: <Briefcase className="w-6 h-6" />,
      color: "from-orange-500 to-red-600",
      count: 298,
      trending: 67,
      mostFunded: 23,
      newThisWeek: 19
    },
    {
      id: 5,
      name: "Health & Wellness",
      icon: <Heart className="w-6 h-6" />,
      color: "from-red-500 to-pink-600",
      count: 145,
      trending: 23,
      mostFunded: 9,
      newThisWeek: 7
    },
    {
      id: 6,
      name: "Education",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-indigo-500 to-purple-600",
      count: 178,
      trending: 34,
      mostFunded: 11,
      newThisWeek: 14
    },
    {
      id: 7,
      name: "Real Estate & Construction",
      icon: <Home className="w-6 h-6" />,
      color: "from-yellow-500 to-orange-600",
      count: 92,
      trending: 18,
      mostFunded: 5,
      newThisWeek: 6
    },
    {
      id: 8,
      name: "Environment & Sustainability",
      icon: <Globe className="w-6 h-6" />,
      color: "from-green-600 to-emerald-600",
      count: 124,
      trending: 41,
      mostFunded: 15,
      newThisWeek: 9
    }
  ];

  // Get platform stats from API or use fallback
  const [platformStats, setPlatformStats] = useState({
    activeFunders: 15234,
    totalFunded: 12500000,
    successfulProjects: 3456,
    countries: 142
  });

  // Load platform stats
  useEffect(() => {
    const loadPlatformStats = async () => {
      try {
        const response = await fundingService.getPlatformStats();
        if (response.data) {
          setPlatformStats({
            activeFunders: response.data.active_funders || 15234,
            totalFunded: response.data.total_funded || 12500000,
            successfulProjects: response.data.successful_projects || 3456,
            countries: response.data.countries || 142
          });
        }
      } catch (error) {
        console.error('Error loading platform stats:', error);
        // Keep fallback values
      }
    };
    loadPlatformStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading State */}
      {loading && projects.length === 0 && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-600">Loading funding projects...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error loading projects</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      {/* Navbar */}
      <FundingNavbar 
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        onPostProject={handlePostProjectClick}
      />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      {/* Hero Section */}
      <FundingHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onPostProject={handlePostProjectClick}
        platformStats={platformStats}
      />

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 sm:gap-8">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  <span className="text-lg font-bold text-blue-600">{platformStats.activeFunders.toLocaleString()}</span> Active Funders
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  <span className="text-lg font-bold text-green-600">${(platformStats.totalFunded / 1000000).toFixed(1)}M</span> Funded
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">
                  <span className="text-lg font-bold text-purple-600">{platformStats.successfulProjects.toLocaleString()}</span> Successful Projects
                </span>
              </div>
            </div>
            <button
              onClick={handlePostProjectClick}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Post Project
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <FundingCategoryGrid 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <FundingFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearAllFilters}
              categories={categories}
            />
          </div>

          {/* Projects Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory ? selectedCategory : 'All Projects'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredProjects.length} projects found
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Grid/List */}
            <FundingGrid 
              projects={paginatedProjects}
              viewMode={viewMode}
              onBackProject={handleBackProject}
              onSaveProject={handleSaveProject}
              onShareProject={handleShareProject}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg ${currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-12">
          <FundingActivityFeed platformStats={[
            { label: 'Active Funders', value: platformStats.activeFunders.toLocaleString(), icon: <Users className="w-5 h-5" />, color: 'text-blue-600' },
            { label: 'Countries', value: platformStats.countries.toLocaleString(), icon: <Globe className="w-5 h-5" />, color: 'text-green-600' },
            { label: 'Total Views', value: '2.5M', icon: <Eye className="w-5 h-5" />, color: 'text-purple-600' },
            { label: 'Success Rate', value: '89%', icon: <Target className="w-5 h-5" />, color: 'text-amber-600' }
          ]} />
        </div>
      </div>

      {/* Footer */}
      <FundingFooter />

      {/* Post Project Modal */}
      <AnimatePresence>
        {showPostForm && (
          <FundingPostForm 
            onClose={() => setShowPostForm(false)}
            onSubmit={handleProjectSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FundingHub;
