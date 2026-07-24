import React, { useEffect, useState, useCallback } from "react";
import {
  FaIndustry,
  FaStar,
  FaThList,
  FaEye,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaDollarSign,
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import Navbar from "../Navbar";
import Footer from "../Footer";
import FooterBanner from "../FooterBanner";
import Filter from "../Filter";
import LazyImage from "../LazyLoading/LazyImage";


import { Link, useParams } from "react-router-dom";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { creatFavouriteAds, getAdsList, getGlobalSearch } from "../../slice/ListSlice";
import { getFilterCat } from "../../slice/CategorySlice";
import { getSampleAdsForCategory } from "../../data/sampleAds";


const truncateDescription = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

const Business = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [liked, setLiked] = useState({});
  const [singleColumnView, setSingleColumnView] = useState(true);
  const [multipleColumnView, setMultipleColumnView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState("");
  
  const [localLoading, setLocalLoading] = useState(true);
  
  const businessAdsData = useSelector((store) => store.ads.catAdsList);
  const searchResults = useSelector((store) => store.ads.globalSearch);
  const categoryTreeData = useSelector((store) => store.categories.catFilter);
  
  // For search results, we need to access the listing data specifically
  const businessAds = isSearching 
    ? { 
        items: searchResults?.data?.listing?.items || [], 
        total: searchResults?.data?.listing?.total || 0 
      }
    : (businessAdsData?.data || {});
  
  // Use sample data if no real ads are available
  const hasRealAds = businessAds?.items && businessAds.items.length > 0;
  const displayAds = hasRealAds ? businessAds : {
    items: getSampleAdsForCategory(slug),
    total: getSampleAdsForCategory(slug).length,
    isSampleData: true
  };
  
  const itemsPerPage = 10;
  const totalDataCount = displayAds?.total || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const maxLength = 100;

  // Load subcategories when component mounts or slug changes
  useEffect(() => {
    dispatch(getFilterCat());
  }, [dispatch]);

  // Set subcategories when category tree data is loaded
  useEffect(() => {
    if (categoryTreeData?.data?.items && slug) {
      const currentCategory = categoryTreeData.data.items.find(
        (item) => item.slug.toLowerCase() === slug.toLowerCase()
      );
      
      if (currentCategory && currentCategory.childs) {
        setSubcategories(currentCategory.childs);
      } else {
        setSubcategories([]);
      }
      setActiveSubcategory(""); // Reset active subcategory when category changes
    }
  }, [categoryTreeData, slug]);

  useEffect(() => {
    if (isSearching && searchQuery.trim()) {
      setLocalLoading(true);
      dispatch(
        getGlobalSearch({
          searchData: {
            keyword: searchQuery.trim(),
            category: activeSubcategory || slug,
            skip: (currentPage - 1) * itemsPerPage,
            limit: itemsPerPage,
          },
        })
      );
    } else if (!isSearching) {
      setLocalLoading(true);
      dispatch(
        getAdsList({
          category: activeSubcategory || slug,
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        })
      );
    }
  }, [dispatch, slug, currentPage, isSearching, searchQuery, activeSubcategory]);

  // Effect to handle loading state when data changes
  useEffect(() => {
    if (isSearching) {
      if (searchResults?.data) {
        setLocalLoading(false);
      }
    } else {
      if (businessAdsData?.data) {
        setLocalLoading(false);
      }
    }
  }, [businessAdsData, searchResults, isSearching]);



  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= Math.ceil(totalDataCount / itemsPerPage)) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [totalDataCount, itemsPerPage]);

  const handleSingleColumnView = useCallback(() => {
    setSingleColumnView(true);
    setMultipleColumnView(false);
  }, []);

  const handleMultipleColumnView = useCallback(() => {
    setSingleColumnView(false);
    setMultipleColumnView(true);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      setCurrentPage(1);
      setLocalLoading(true);
      dispatch(
        getGlobalSearch({
          searchData: {
            keyword: searchQuery.trim(),
            category: slug,
            skip: 0,
            limit: itemsPerPage,
          },
        })
      );
    }
  }, [searchQuery, slug, itemsPerPage, dispatch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
    setCurrentPage(1);
    setLocalLoading(true);
    dispatch(
      getAdsList({
        category: activeSubcategory || slug,
        skip: 0,
        limit: itemsPerPage,
      })
    );
  }, [activeSubcategory, slug, itemsPerPage, dispatch]);

  const handleSubcategoryClick = useCallback((subcategorySlug) => {
    setActiveSubcategory(subcategorySlug);
    setCurrentPage(1);
    setIsSearching(false);
    setSearchQuery("");
  }, []);

  const handleAllCategoriesClick = useCallback(() => {
    setActiveSubcategory("");
    setCurrentPage(1);
    setIsSearching(false);
    setSearchQuery("");
  }, []);

  const addToFavourite = useCallback((customer_id, listing_id, index) => {
    const currentCustomerId = localStorage.getItem('customer_id') || customer_id;
    if (liked[index]) {
      dispatch(
        creatFavouriteAds({
          data: { customer_id: currentCustomerId, listing_id, is_favorite: false },
        })
      );
    } else {
      dispatch(
        creatFavouriteAds({
          data: { customer_id: currentCustomerId, listing_id, is_favorite: true },
        })
      );
    }

    setLiked((prevLiked) => ({
      ...prevLiked,
      [index]: !prevLiked[index],
    }));
  }, [dispatch, liked]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FooterBanner title={slug} />

      {/* Subcategory Tabs */}
      {subcategories.length > 0 && (
        <div className="bg-white border-b">
          <div className="page-container">
            <div className="flex overflow-x-auto scrollbar-hide">
              <nav className="flex space-x-8" aria-label="Tabs">
                {/* All Categories Tab */}
                <button
                  onClick={handleAllCategoriesClick}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeSubcategory === ""
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  All {slug}
                </button>
                
                {/* Subcategory Tabs */}
                {subcategories.map((subcategory) => (
                  <button
                    key={subcategory.category_id}
                    onClick={() => handleSubcategoryClick(subcategory.slug)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeSubcategory === subcategory.slug
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {subcategory.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="page-container pt-8 pb-12">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4">
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={`Search in ${slug} category...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  <FaSearch className="h-4 w-4 mr-2" />
                  Search
                </button>
                {isSearching && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    Clear
                  </button>
                )}
              </form>
              {isSearching && (
                <div className="mt-3 text-sm text-muted-foreground">
                  Showing search results for "{searchQuery}" in {activeSubcategory ? subcategories.find(sub => sub.slug === activeSubcategory)?.name : slug} category
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row gap-6">
          <Filter />
          {localLoading ? (
            <div className="flex-1 lg:w-3/4 lg:min-w-0 space-y-6">
              {/* Header Skeleton */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                  <div className="flex rounded-md border border-input bg-background">
                    <div className="h-9 w-9 bg-gray-200 rounded-l-md animate-pulse"></div>
                    <div className="h-9 w-9 bg-gray-200 rounded-r-md animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Content Skeletons */}
              {singleColumnView ? (
                // Single Column Skeletons
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="rounded-lg border bg-card shadow-sm">
                      <div className="flex flex-col md:flex-row gap-4 p-6">
                        {/* Image Skeleton */}
                        <div className="w-full md:w-48 flex-shrink-0">
                          <div className="aspect-video md:aspect-square overflow-hidden rounded-lg bg-gray-200 animate-pulse"></div>
                        </div>
                        
                        {/* Content Skeleton */}
                        <div className="flex-1 space-y-3">
                          {/* Category Badge Skeleton */}
                          <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                          
                          {/* Title and Description Skeleton */}
                          <div className="space-y-2">
                            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                          </div>
                          
                          {/* Location Skeleton */}
                          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                          
                          {/* Price and Actions Skeleton */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                            <div className="flex gap-2">
                              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Grid Column Skeletons
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="rounded-lg border bg-card shadow-sm">
                      {/* Image Skeleton */}
                      <div className="aspect-video overflow-hidden rounded-t-lg bg-gray-200 animate-pulse"></div>
                      
                      {/* Content Skeleton */}
                      <div className="p-4 space-y-3">
                        {/* Category Badge Skeleton */}
                        <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                        
                        {/* Title and Description Skeleton */}
                        <div className="space-y-2">
                          <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        </div>
                        
                        {/* Location Skeleton */}
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        
                        {/* Price and Actions Skeleton */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                          <div className="flex gap-2">
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Skeleton */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border bg-card">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="h-9 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-9 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : displayAds.items?.length > 0 ? (
            <div className="flex-1 lg:w-3/4 lg:min-w-0 space-y-6">
              {/* Sample Data Notice */}
              {displayAds.isSampleData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-600 mt-0.5">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-blue-800">Sample Data Display</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        We're showing sample listings to demonstrate what this category looks like. 
                        <Link to="/dashboard" className="font-medium underline hover:text-blue-800 ml-1">
                          Post from your dashboard after logging in.
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Header with controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalDataCount)} of {totalDataCount} results
                  </span>
                  {displayAds.isSampleData && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Sample Data
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground mr-2">View:</span>
                  <div className="flex rounded-md border border-input bg-background">
                    <button
                      onClick={handleSingleColumnView}
                      className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 rounded-l-md border-r ${
                        singleColumnView 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <FaThList className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleMultipleColumnView}
                      className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 rounded-r-md ${
                        multipleColumnView 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <BsFillGrid3X3GapFill className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              {singleColumnView && (
                <div className="space-y-4">
                  {displayAds.items?.map((items, index) => (
                    <div
                      key={index}
                      className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col md:flex-row gap-4 p-6">
                        <Link
                          to={`/ads-detail/${items.slug}`}
                          className="w-full md:w-48 flex-shrink-0"
                        >
                          <div className="aspect-video md:aspect-square overflow-hidden rounded-lg bg-muted">
                            <LazyImage
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              src={items?.images?.[0]?.image_path}
                              alt={items.title || 'Business listing'}
                              placeholder="/img/no-image.png"
                            />
                          </div>
                        </Link>
                        
                        <div className="flex-1 space-y-3">
                          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary/10 text-primary">
                            {slug === 'events' ? (
                              <FaCalendarAlt className="mr-1 h-3 w-3" />
                            ) : (
                              <FaIndustry className="mr-1 h-3 w-3" />
                            )}
                            {items.category?.name || 'Uncategorized'}
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">
                              <Link
                                to={`/ads-detail/${items.slug}`}
                                className="hover:text-primary transition-colors"
                              >
                                {items.title}
                              </Link>
                            </h3>
                            {items.head && (
                              <p className="text-sm text-muted-foreground">
                                {truncateDescription(items.head, maxLength)}
                              </p>
                            )}
                          </div>

                          {/* Event-specific information */}
                          {slug === 'events' && items.event_date && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FaCalendarAlt className="h-4 w-4" />
                                <span>{new Date(items.event_date).toLocaleDateString()}</span>
                                {items.event_time && (
                                  <>
                                    <FaClock className="h-3 w-3 ml-2" />
                                    <span>{items.event_time}</span>
                                  </>
                                )}
                              </div>
                              {items.venue && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <FaMapMarkerAlt className="h-4 w-4" />
                                  <span>{items.venue}</span>
                                </div>
                              )}
                              {items.event_type && (
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary/10 text-secondary">
                                  {items.event_type.replace('-', ' ').charAt(0).toUpperCase() + items.event_type.replace('-', ' ').slice(1)}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Regular location for non-events */}
                          {slug !== 'events' && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MdLocationPin className="h-4 w-4" />
                              <span>{items.location?.city || items.location?.name || 'Location not specified'}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1 text-lg font-semibold text-primary">
                              <FaDollarSign className="h-4 w-4" />
                              <span>{items.currency?.symbol || '$'}{items.price || (slug === 'events' ? 'Free' : 'N/A')}</span>
                            </div>
                            
                            <div className="flex gap-2">
                              <Link to={`/ads-detail/${items.slug}`}>
                                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                                  <FaEye className="h-3 w-3" />
                                </button>
                              </Link>
                              <button
                                onClick={() =>
                                  addToFavourite(
                                    items.customer_id,
                                    items.listing_id,
                                    index
                                  )
                                }
                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 ${
                                  liked[index] ? 'text-yellow-500' : ''
                                }`}
                              >
                                {liked[index] ? (
                                  <FaStar className="h-3 w-3" />
                                ) : (
                                  <FaHeart className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {multipleColumnView && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayAds.items?.map((items, index) => (
                    <div
                      key={index}
                      className="group rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                    >
                      <Link to={`/ads-detail/${items.slug}`}>
                        <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                          <LazyImage
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            src={items?.images[0]?.image_path}
                            alt={items.title}
                            placeholder="/img/no-image.png"
                          />
                        </div>
                      </Link>
                      
                      <div className="p-4 space-y-3">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary/10 text-primary">
                          {slug === 'events' ? (
                            <FaCalendarAlt className="mr-1 h-3 w-3" />
                          ) : (
                            <FaIndustry className="mr-1 h-3 w-3" />
                          )}
                          {items.category?.name || 'Uncategorized'}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold leading-tight text-foreground line-clamp-2 mb-1">
                            <Link
                              to={`/ads-detail/${items.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {items.title}
                            </Link>
                          </h3>
                          {items.head && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {items.head}
                            </p>
                          )}
                        </div>

                        {/* Event-specific information for grid view */}
                        {slug === 'events' && items.event_date && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FaCalendarAlt className="h-3 w-3" />
                              <span>{new Date(items.event_date).toLocaleDateString()}</span>
                              {items.event_time && (
                                <>
                                  <FaClock className="h-3 w-3 ml-1" />
                                  <span>{items.event_time}</span>
                                </>
                              )}
                            </div>
                            {items.venue && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FaMapMarkerAlt className="h-3 w-3" />
                                <span className="truncate">{items.venue}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Regular location for non-events */}
                        {slug !== 'events' && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MdLocationPin className="h-4 w-4" />
                            <span className="truncate">{items.location?.city || items.location?.name || 'Location not specified'}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                            <FaDollarSign className="h-3 w-3" />
                            <span>{items.currency?.symbol || '$'}{items.price || (slug === 'events' ? 'Free' : 'N/A')}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Link to={`/ads-detail/${items.slug}`}>
                              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                                <FaEye className="h-3 w-3" />
                              </button>
                            </Link>
                            <button
                              onClick={() =>
                                addToFavourite(
                                  items.customer_id,
                                  items.listing_id,
                                  index
                                )
                              }
                              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 ${
                                liked[index] ? 'text-yellow-500' : ''
                              }`}
                            >
                              {liked[index] ? (
                                <FaStar className="h-3 w-3" />
                              ) : (
                                <FaHeart className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Pagination */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border bg-card">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {startIndex + 1}-{Math.min(endIndex, totalDataCount)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-foreground">{totalDataCount}</span>{" "}
                  results
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
                  >
                    <FaChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">Page</span>
                    <span className="text-sm font-medium text-foreground">
                      {currentPage} of {Math.ceil(totalDataCount / itemsPerPage)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(totalDataCount / itemsPerPage)}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
                  >
                    Next
                    <FaChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 lg:w-3/4 lg:min-w-0">
              <div className="flex flex-col items-center justify-center py-12 rounded-lg border bg-card">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <FaIndustry className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {isSearching ? 'No search results found' : 'No ads found'}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                  {isSearching 
                    ? `We couldn't find any ads matching "${searchQuery}" in the ${activeSubcategory ? subcategories.find(sub => sub.slug === activeSubcategory)?.name : slug} category. Try different keywords or clear the search.`
                    : `We couldn't find any ads in this ${activeSubcategory ? 'subcategory' : 'category'}. Try adjusting your filters or check back later.`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Business;
