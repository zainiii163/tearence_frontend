import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getJobsList } from "../../slice/JobSlice";
import JobItem from "../CategoryPage/JobItem";

const JobsSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Set initial tab based on current route
  const getInitialTab = () => {
    if (location.pathname.includes("vacancies")) return "vacancies";
    return "jobs";
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [filters, setFilters] = useState({
    jobType: "",
    salaryRange: "",
    location: "",
    category: "",
    experience: ""
  });
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  const { jobsList, loading } = useSelector((store) => store.jobs);

  useEffect(() => {
    dispatch(getJobsList());
  }, [dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (value) => {
    setSortBy(value);
  };

  const filteredJobs = useMemo(() => {
    let jobsArray = [];
    
    if (Array.isArray(jobsList)) {
      jobsArray = jobsList;
    } else if (jobsList && typeof jobsList === 'object') {
      // Try common data properties
      if (Array.isArray(jobsList.data)) {
        jobsArray = jobsList.data;
      } else if (Array.isArray(jobsList.items)) {
        jobsArray = jobsList.items;
      } else if (Array.isArray(jobsList.list)) {
        jobsArray = jobsList.list;
      }
    }
    
    return jobsArray.filter(job => {
    const matchesTab = activeTab === "jobs" 
      ? job.type === "job" 
      : job.type === "vacancy";
    
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
    const matchesSalary = !filters.salaryRange || job.salaryRange === filters.salaryRange;
    const matchesLocation = !filters.location || job.location?.toLowerCase().includes(filters.location.toLowerCase());
    const matchesCategory = !filters.category || job.category === filters.category;
    const matchesExperience = !filters.experience || job.experienceLevel === filters.experience;

    return matchesTab && matchesSearch && matchesJobType && matchesSalary && 
           matchesLocation && matchesCategory && matchesExperience;
    });
  }, [jobsList, activeTab, searchTerm, filters]);

  const sortedJobs = useMemo(() => [...filteredJobs].sort((a, b) => {
    switch(sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "salary_low":
        return (a.salaryMin || 0) - (b.salaryMin || 0);
      case "salary_high":
        return (b.salaryMin || 0) - (a.salaryMin || 0);
      case "relevance":
        return 0; // Would need more sophisticated relevance scoring
      default:
        return 0;
    }
  }), [filteredJobs, sortBy]);

  const filterOptions = [
    {
      key: "jobType",
      label: "Job Type",
      type: "select",
      options: [
        { value: "", label: "All Types" },
        { value: "full-time", label: "Full Time" },
        { value: "part-time", label: "Part Time" },
        { value: "contract", label: "Contract" },
        { value: "freelance", label: "Freelance" },
        { value: "internship", label: "Internship" }
      ]
    },
    {
      key: "salaryRange",
      label: "Salary Range",
      type: "select",
      options: [
        { value: "", label: "All Ranges" },
        { value: "0-25k", label: "Under $25,000" },
        { value: "25k-50k", label: "$25,000 - $50,000" },
        { value: "50k-75k", label: "$50,000 - $75,000" },
        { value: "75k-100k", label: "$75,000 - $100,000" },
        { value: "100k+", label: "Over $100,000" }
      ]
    },
    {
      key: "location",
      label: "Location",
      type: "text",
      placeholder: "Enter location..."
    },
    {
      key: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "", label: "All Categories" },
        { value: "technology", label: "Technology" },
        { value: "healthcare", label: "Healthcare" },
        { value: "finance", label: "Finance" },
        { value: "education", label: "Education" },
        { value: "marketing", label: "Marketing" },
        { value: "sales", label: "Sales" },
        { value: "customer-service", label: "Customer Service" },
        { value: "hr", label: "Human Resources" },
        { value: "operations", label: "Operations" }
      ]
    },
    {
      key: "experience",
      label: "Experience Level",
      type: "select",
      options: [
        { value: "", label: "All Levels" },
        { value: "entry", label: "Entry Level" },
        { value: "mid", label: "Mid Level" },
        { value: "senior", label: "Senior Level" },
        { value: "executive", label: "Executive Level" }
      ]
    }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "salary_low", label: "Salary: Low to High" },
    { value: "salary_high", label: "Salary: High to Low" },
    { value: "relevance", label: "Most Relevant" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream {activeTab === "jobs" ? "Job" : "Vacancy"}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover opportunities that match your skills and aspirations
          </p>
          
          {/* Tab Buttons */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => handleTabChange("jobs")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "jobs"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => handleTabChange("vacancies")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "vacancies"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Vacancies
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder={`Search ${activeTab} by title, company, or location...`}
                className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filterOptions.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {filter.label}
                </label>
                {filter.type === "select" ? (
                  <select
                    value={filters[filter.key]}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={filters[filter.key]}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={filter.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              {sortedJobs.length} {activeTab} found
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading {activeTab}...</p>
            </div>
          ) : sortedJobs.length > 0 ? (
            sortedJobs.map((job) => (
              <JobItem key={job.id} job={job} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No {activeTab} found</h3>
              <p className="mt-2 text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(activeTab === "jobs" ? "/jobs/post" : "/vacancies/post")}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post {activeTab === "jobs" ? "Job" : "Vacancy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobsSection;
