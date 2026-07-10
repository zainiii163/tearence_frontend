import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaThList,
  FaChevronLeft,
  FaChevronRight,
  FaBriefcase,
  FaIndustry,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import Navbar from "../Navbar";
import Footer from "../Footer";
import FooterBanner from "../FooterBanner";
import { getCountry, getZone } from "../../slice/CategorySlice";
import DynamicFilters from "./DynamicFilters";

const ModernCategoryPage = ({ 
  categoryType = "jobs", // 'jobs', 'services', etc.
  getDataAction,
  dataSelector,
  itemComponent: ItemComponent,
}) => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState("newest");
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Get filter configuration for this category

  const itemsPerPage = 20;
  
  // Get countries and zones for location dropdown - memoized to prevent unnecessary rerenders
  const countriesRaw = useSelector((store) => store.categories?.country?.data?.items);
  const zonesRaw = useSelector((store) => store.categories?.zone?.data?.items);
  const data = useSelector(dataSelector);
  
  const countries = useMemo(() => Array.isArray(countriesRaw) ? countriesRaw : [], [countriesRaw]);
  const zones = useMemo(() => Array.isArray(zonesRaw) ? zonesRaw : [], [zonesRaw]);

  // Load countries on mount
  useEffect(() => {
    dispatch(getCountry());
  }, [dispatch]);

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLocationDropdown && !event.target.closest('.location-dropdown-container')) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLocationDropdown]);
  const loading = useSelector((store) => {
    // Try to get loading from the specific slice (jobs, candidates, etc.)
    if (categoryType === "jobs") return store.jobs?.loading || false;
    if (categoryType === "candidates") return store.candidates?.loading || false;
    return store.ads?.loading || false;
  });
  const items = data?.items || [];
  const total = data?.total || 0;

  // Calculate total pages from backend total
  const totalPages = Math.ceil(total / itemsPerPage);

  // Debounce search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data from backend with pagination
  useEffect(() => {
    if (getDataAction) {
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
        sort: sortBy === "newest" ? "newest" : sortBy === "oldest" ? "oldest" : sortBy === "salary_low" ? "salary_low" : sortBy === "salary_high" ? "salary_high" : sortBy,
      };

      // Add search query - Production API uses 'keyword' parameter for jobs
      if (debouncedSearchQuery.trim()) {
        params.keyword = debouncedSearchQuery.trim();
      }

      // Add category slug if present (for category-specific pages)
      if (slug) {
        params.category = slug;
      } else if (categoryType) {
        // For standalone pages like /jobs, use categoryType
        params.category = categoryType;
      }

      // Add filters
      Object.entries(selectedFilters).forEach(([key, value]) => {
        if (value && value !== "all") {
          // Map filter keys to API parameter names
          switch (key) {
            case "jobType":
            case "job_type":
              // API expects comma-separated if multiple
              params.job_type = Array.isArray(value) ? value.join(",") : value;
              break;
            case "salaryRange":
              const [min, max] = value.split("-").map(Number);
              if (min !== undefined && !isNaN(min)) params.salary_min = min;
              if (max !== undefined && !isNaN(max)) params.salary_max = max;
              break;
            case "salary_min":
              if (value && !isNaN(value)) params.salary_min = Number(value);
              break;
            case "salary_max":
              if (value && !isNaN(value)) params.salary_max = Number(value);
              break;
            case "country_id":
              params.country_id = value;
              break;
            case "location":
            case "location_id":
              params.location_id = value;
              break;
            case "priceRange":
              const [priceMin, priceMax] = value.split("-").map(Number);
              if (priceMin) params.price_min = priceMin;
              if (priceMax) params.price_max = priceMax;
              break;
            case "propertyType":
            case "property_type":
              params.property_type = value;
              break;
            case "bedrooms":
              params.bedrooms = value;
              break;
            case "bathrooms":
              params.bathrooms = value;
              break;
            case "businessType":
            case "business_type":
              params.business_type = value;
              break;
            case "vehicleMake":
            case "make":
              params.make = value;
              break;
            case "vehicleModel":
            case "model":
              params.model = value;
              break;
            case "vehicleYear":
            case "year":
              params.year = value;
              break;
            case "vehicleCondition":
            case "condition":
              params.condition = value;
              break;
            case "category":
            case "category_id":
              params.category_id = value;
              break;
            default:
              params[key] = value;
          }
        }
      });

      dispatch(getDataAction(params));
    }
  }, [dispatch, slug, categoryType, currentPage, selectedFilters, sortBy, itemsPerPage, getDataAction, debouncedSearchQuery]);

  const handleFilterChange = useCallback((filterKey, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: value === "all" ? undefined : value,
    }));
    setCurrentPage(1);
  }, []);

  const removeFilter = useCallback((filterKey) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedFilters({});
    setSortBy("newest");
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.keys(selectedFilters).filter(
      (key) => selectedFilters[key] && selectedFilters[key] !== "all"
    ).length;
  }, [selectedFilters]);

  // Filtered locations based on search
  const filteredLocations = useMemo(() => {
    if (!locationSearch.trim()) return [];
    
    const searchLower = locationSearch.toLowerCase();
    const locationList = [];
    
    // Add countries
    countries.forEach((country) => {
      if (country.name?.toLowerCase().includes(searchLower)) {
        locationList.push({ id: country.country_id, name: country.name, type: "country" });
      }
    });
    
    // Add zones/cities
    zones.forEach((zone) => {
      if (zone.zone_name?.toLowerCase().includes(searchLower)) {
        locationList.push({ 
          id: zone.zone_id, 
          name: `${zone.zone_name}, ${zone.country_name}`, 
          type: "zone",
          zone_id: zone.zone_id,
          country_id: zone.country_id,
        });
      }
    });
    
    return locationList.slice(0, 10); // Limit to 10 results
  }, [locationSearch, countries, zones]);

  
  const handleCountryChange = useCallback((countryId) => {
    if (countryId) {
      dispatch(getZone({ country_id: countryId }));
      handleFilterChange("country_id", countryId);
    } else {
      handleFilterChange("country_id", undefined);
      handleFilterChange("location_id", undefined);
    }
  }, [dispatch, handleFilterChange]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setCurrentPage(1);
    // Search will be handled by debounced effect
  }, []);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [totalPages]);

  const handleGoBack = useCallback(() => {
    // Navigate back to previous page or category menu
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/category-menu');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FooterBanner title={slug || categoryType} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
        {/* Header with Back Button and Post Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg hover:bg-gray-50/90 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 capitalize">
                {categoryType.replace('-', ' ')} Ads
              </h1>
              <p className="text-muted-foreground">
                Browse and post {categoryType.replace('-', ' ')} advertisements
              </p>
            </div>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <input
                type="text"
                className="flex h-12 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                placeholder={`Search ${categoryType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 shadow-sm hover:shadow-md"
            >
              <FaSearch className="h-4 w-4 mr-2" />
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border h-12 px-4 ${
                showFilters || activeFiltersCount > 0
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <FaFilter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-primary-foreground text-primary text-xs font-semibold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </form>

          {/* Jobs and Vacancies Navigation Buttons */}
          {(categoryType === "jobs" || categoryType === "vacancies") && (
            <div className="flex flex-wrap gap-2">
              <Link
                to="/jobs"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 ${
                  categoryType === "jobs"
                    ? "bg-primary text-primary-foreground"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <FaBriefcase className="h-4 w-4 mr-2" />
                Jobs
              </Link>
              <Link
                to="/vacancies"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 ${
                  categoryType === "vacancies"
                    ? "bg-primary text-primary-foreground"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <FaIndustry className="h-4 w-4 mr-2" />
                Vacancies
              </Link>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && (
            <DynamicFilters
              categoryType={categoryType}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onRemoveFilter={removeFilter}
              onClearAllFilters={clearAllFilters}
              countries={countries}
              zones={zones}
              onCountryChange={handleCountryChange}
              locationSearch={locationSearch}
              setLocationSearch={setLocationSearch}
              showLocationDropdown={showLocationDropdown}
              setShowLocationDropdown={setShowLocationDropdown}
              filteredLocations={filteredLocations}
            />
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground capitalize">
              {slug || categoryType}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {total > 0 
                ? `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, total)} of ${total} results`
                : "No results found"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Action Buttons for Jobs and Vacancies */}
            <span className="text-sm text-muted-foreground">View:</span>
            <div className="flex rounded-md border border-input bg-background">
              <button
                onClick={() => setViewMode("list")}
                className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 rounded-l-md border-r ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <FaThList className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 rounded-r-md ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <BsFillGrid3X3GapFill className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading {categoryType}...</p>
          </div>
        )}

        {/* Items Grid/List */}
        {!loading && items.length > 0 && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ItemComponent item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="animate-in fade-in slide-in-from-left-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ItemComponent item={item} viewMode="list" />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, total)} of {total} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 gap-2"
                  >
                    <FaChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 w-9 ${
                            currentPage === pageNum
                              ? "bg-primary text-primary-foreground"
                              : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || loading}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 gap-2"
                  >
                    Next
                    <FaChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 rounded-lg border bg-card">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FaBriefcase className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No {categoryType} found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
              {searchQuery
                ? `We couldn't find any ${categoryType} matching "${searchQuery}". Try different keywords.`
                : `No ${categoryType} available in this category. Check back later.`}
            </p>
          </div>
        )}
      </div>
      </div>

      <Footer />
    </div>
  );
};

export default ModernCategoryPage;

