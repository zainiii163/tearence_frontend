import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  Clock, 
  Globe, 
  CheckCircle, 
  Star,
  Filter,
  ChevronDown,
  Plus,
  Users,
  DollarSign,
  Target,
  Award,
  Shield,
  Zap,
  ArrowRight,
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
  UserCheck,
  HandHeart,
  Crown,
  Gem,
  Sparkles,
  Heart
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

// Sample data
const sampleProjects = [
  {
    id: 1,
    title: "AI-Powered Learning Platform",
    tagline: "Revolutionizing education with personalized AI tutors",
    category: "Technology & Innovation",
    country: "United States",
    fundingGoal: 50000,
    currentFunding: 32500,
    backers: 234,
    daysLeft: 15,
    riskLevel: "Low",
    verifiedCreator: true,
    creatorName: "TechEd Solutions",
    image: "/api/placeholder/400/300",
    updates: 12,
    featured: true,
    promoted: true
  },
  {
    id: 2,
    title: "Sustainable Urban Farming",
    tagline: "Bringing fresh produce to cities with vertical farms",
    category: "Environment & Sustainability",
    country: "Netherlands",
    fundingGoal: 75000,
    currentFunding: 45000,
    backers: 189,
    daysLeft: 22,
    riskLevel: "Medium",
    verifiedCreator: true,
    creatorName: "GreenCity Initiative",
    image: "/api/placeholder/400/300",
    updates: 8,
    featured: false,
    promoted: true
  },
  {
    id: 3,
    title: "Community Art Center",
    tagline: "Creating a vibrant space for local artists and youth",
    category: "Creative Arts",
    country: "Canada",
    fundingGoal: 25000,
    currentFunding: 18000,
    backers: 156,
    daysLeft: 8,
    riskLevel: "Low",
    verifiedCreator: false,
    creatorName: "ArtSpace Collective",
    image: "/api/placeholder/400/300",
    updates: 6,
    featured: false,
    promoted: false
  },
  {
    id: 4,
    title: "Healthcare Access App",
    tagline: "Connecting underserved communities with medical providers",
    category: "Health & Wellness",
    country: "Kenya",
    fundingGoal: 40000,
    currentFunding: 28000,
    backers: 312,
    daysLeft: 18,
    riskLevel: "Medium",
    verifiedCreator: true,
    creatorName: "HealthBridge Africa",
    image: "/api/placeholder/400/300",
    updates: 15,
    featured: true,
    promoted: false
  },
  {
    id: 5,
    title: "Startup Incubator Program",
    tagline: "Supporting early-stage entrepreneurs with mentorship and resources",
    category: "Startups & Small Business",
    country: "United Kingdom",
    fundingGoal: 100000,
    currentFunding: 67000,
    backers: 89,
    daysLeft: 30,
    riskLevel: "High",
    verifiedCreator: true,
    creatorName: "LaunchPad London",
    image: "/api/placeholder/400/300",
    updates: 20,
    featured: false,
    promoted: false
  },
  {
    id: 6,
    title: "Digital Literacy for Seniors",
    tagline: "Empowering elderly citizens with essential tech skills",
    category: "Education",
    country: "Australia",
    fundingGoal: 15000,
    currentFunding: 12000,
    backers: 78,
    daysLeft: 12,
    riskLevel: "Low",
    verifiedCreator: true,
    creatorName: "SeniorTech Connect",
    image: "/api/placeholder/400/300",
    updates: 4,
    featured: false,
    promoted: false
  }
];

const categories = [
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

const FundingHub = () => {
  const [projects, setProjects] = useState(sampleProjects);
  const [filteredProjects, setFilteredProjects] = useState(sampleProjects);
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

  // Filter and sort projects
  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase())
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
      filtered = filtered.filter(project => project.country.toLowerCase().includes(filters.country.toLowerCase()));
    }

    if (filters.verifiedOnly) {
      filtered = filtered.filter(project => project.verifiedCreator);
    }

    if (filters.fundingGoal) {
      filtered = filtered.filter(project => project.fundingGoal <= parseInt(filters.fundingGoal));
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'mostFunded':
        filtered.sort((a, b) => (b.currentFunding / b.fundingGoal) - (a.currentFunding / a.fundingGoal));
        break;
      case 'trending':
        filtered.sort((a, b) => b.backers - a.backers);
        break;
      case 'endingSoon':
        filtered.sort((a, b) => a.daysLeft - b.daysLeft);
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

  const handleProjectSubmit = (projectData) => {
    // In a real app, this would send data to backend
    const newProject = {
      id: projects.length + 1,
      ...projectData,
      currentFunding: 0,
      backers: 0,
      daysLeft: 30,
      updates: 0,
      image: "/api/placeholder/400/300"
    };
    setProjects([newProject, ...projects]);
    setShowPostForm(false);
  };

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <FundingNavbar 
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        onPostProject={() => setShowPostForm(true)}
      />

      {/* Hero Section */}
      <FundingHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onPostProject={() => setShowPostForm(true)}
      />

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 sm:gap-8">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  <span className="text-lg font-bold text-blue-600">15,234</span> Active Funders
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  <span className="text-lg font-bold text-green-600">$12.5M</span> Funded
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">
                  <span className="text-lg font-bold text-purple-600">3,456</span> Successful Projects
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowPostForm(true)}
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
          <FundingActivityFeed />
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
