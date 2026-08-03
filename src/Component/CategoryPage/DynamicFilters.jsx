import React, { useState, useCallback, useMemo } from "react";
import {
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaBriefcase,
  FaDollarSign,
  FaBed,
  FaBath,
  FaHome,
  FaCar,
  FaBook,
  FaTags,
  FaClock,
  FaTrophy,
  FaChartLine,
  FaCalendar,
  FaUsers,
  FaIndustry,
  FaTachometerAlt,
  FaCheckCircle,
  FaFile,
  FaLanguage,
  FaRulerCombined,
  FaTag,
  FaSearch,
  FaMapMarkerAlt
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { getCategoryFilters } from "../../config/categoryFilters";

// Icon mapping
const iconMap = {
  FaBriefcase,
  FaDollarSign,
  FaBed,
  FaBath,
  FaHome,
  FaCar,
  FaBook,
  FaTags,
  FaClock,
  FaTrophy,
  FaChartLine,
  FaCalendar,
  FaUsers,
  FaIndustry,
  FaTachometerAlt,
  FaCheckCircle,
  FaFile,
  FaLanguage,
  FaRulerCombined,
  FaTag,
  FaSearch,
  FaMapMarkerAlt,
  MdLocationOn
};

const DynamicFilters = ({ 
  categoryType, 
  selectedFilters, 
  onFilterChange, 
  onRemoveFilter,
  onClearAllFilters,
  countries = [],
  zones = [],
  onCountryChange,
  locationSearch,
  setLocationSearch,
  showLocationDropdown,
  setShowLocationDropdown,
  filteredLocations = []
}) => {
  const [expandedFilterSections, setExpandedFilterSections] = useState({});
  const [isFilterPanelVisible, setIsFilterPanelVisible] = useState(true);
  
  const filterConfig = getCategoryFilters(categoryType);
  
  // Initialize expanded sections
  React.useEffect(() => {
    const initialExpanded = {};
    filterConfig.filters.forEach(filter => {
      initialExpanded[filter.key] = true;
    });
    setExpandedFilterSections(initialExpanded);
  }, [filterConfig.filters]);

  const toggleFilterSection = useCallback((section) => {
    setExpandedFilterSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const renderFilterInput = (filter) => {
    const Icon = iconMap[filter.icon] || FaFilter;
    
    switch (filter.type) {
      case 'select':
        return (
          <div className="space-y-2">
            <button
              onClick={() => toggleFilterSection(filter.key)}
              className="flex items-center justify-between w-full text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {filter.label}
              </span>
              {expandedFilterSections[filter.key] ? (
                <FaChevronUp className="h-4 w-4" />
              ) : (
                <FaChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedFilterSections[filter.key] && (
              <div className="space-y-2 pt-2">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all min-w-0"
                  value={selectedFilters[filter.key] || "all"}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                >
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );

      case 'location':
        return (
          <div className="space-y-2">
            <button
              onClick={() => toggleFilterSection(filter.key)}
              className="flex items-center justify-between w-full text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {filter.label}
              </span>
              {expandedFilterSections[filter.key] ? (
                <FaChevronUp className="h-4 w-4" />
              ) : (
                <FaChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedFilterSections[filter.key] && (
              <div className="space-y-3 pt-2">
                {/* Country Selector */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Country</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all min-w-0"
                    value={selectedFilters.country_id || ""}
                    onChange={(e) => onCountryChange(e.target.value)}
                  >
                    <option value="">All Countries</option>
                    {countries.map((country) => (
                      <option key={country.country_id} value={country.country_id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Location Search with Autocomplete */}
                <div className="relative location-dropdown-container">
                  <label className="text-xs text-muted-foreground mb-1 block">City/Zone</label>
                  <div className="relative">
                    <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all min-w-0"
                      placeholder="Search city or zone..."
                      value={locationSearch}
                      onChange={(e) => {
                        setLocationSearch(e.target.value);
                        setShowLocationDropdown(true);
                      }}
                      onFocus={() => setShowLocationDropdown(true)}
                    />
                    {showLocationDropdown && filteredLocations.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredLocations.map((location) => (
                          <div
                            key={`${location.type}-${location.id}`}
                            className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                            onClick={() => {
                              onFilterChange("location_id", location.id);
                              setLocationSearch(location.name);
                              setShowLocationDropdown(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <MdLocationOn className="h-3 w-3 text-muted-foreground" />
                              <span>{location.name}</span>
                              {location.type === "country" && (
                                <span className="text-xs text-muted-foreground">(Country)</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <button
              onClick={() => toggleFilterSection(filter.key)}
              className="flex items-center justify-between w-full text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {filter.label}
              </span>
              {expandedFilterSections[filter.key] ? (
                <FaChevronUp className="h-4 w-4" />
              ) : (
                <FaChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedFilterSections[filter.key] && (
              <div className="space-y-3 pt-2">
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all min-w-0"
                  value={selectedFilters[filter.key] || "all"}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                >
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {/* Custom Range Inputs */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                    <input
                      type="number"
                      placeholder="Min"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm min-w-0"
                      value={selectedFilters[`${filter.key}_min`] || ""}
                      onChange={(e) => onFilterChange(`${filter.key}_min`, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                    <input
                      type="number"
                      placeholder="Max"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm min-w-0"
                      value={selectedFilters[`${filter.key}_max`] || ""}
                      onChange={(e) => onFilterChange(`${filter.key}_max`, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.keys(selectedFilters).filter(
      (key) => selectedFilters[key] && selectedFilters[key] !== "all"
    ).length;
  }, [selectedFilters]);

  // Get filter label for display
  const getFilterLabel = (filterKey, value) => {
    const filter = filterConfig.filters.find(f => f.key === filterKey);
    if (!filter) return value;
    
    if (filter.type === 'select' || filter.type === 'range') {
      const option = filter.options.find(opt => opt.value === value);
      return option ? option.label : value;
    }
    
    return value;
  };

  return (
    <div className="space-y-4">
      {/* Filter Header with Toggle Button */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <FaFilter className="h-4 w-4 text-primary" aria-hidden="true" />
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {activeFiltersCount} active
              </span>
            )}
          </div>
          <button
            onClick={() => setIsFilterPanelVisible(!isFilterPanelVisible)}
            className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            title={isFilterPanelVisible ? "Hide" : "Show"}
          >
            {isFilterPanelVisible ? (
              <FaChevronUp className="h-4 w-4" />
            ) : (
              <FaChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Filter Content */}
      {isFilterPanelVisible && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Active Filters Badges */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border bg-muted/30">
              <span className="text-sm font-medium text-muted-foreground">Active:</span>
              {Object.entries(selectedFilters).map(([key, value]) => {
                if (!value || value === "all") return null;
                
                return (
                  <span key={key} className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium bg-background">
                    {filterConfig.filters.find(f => f.key === key)?.label || key}: {getFilterLabel(key, value)}
                    <button
                      onClick={() => onRemoveFilter(key)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
              <button
                onClick={onClearAllFilters}
                className="text-sm text-primary hover:underline font-medium ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Filters Panel */}
          <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-4 shadow-lg overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 min-w-0">
              {filterConfig.filters.map((filter) => (
                <div key={filter.key} className="min-w-0">
                  {renderFilterInput(filter)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicFilters;
