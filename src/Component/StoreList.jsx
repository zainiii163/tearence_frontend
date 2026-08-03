/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { FaBuilding, FaMapMarkerAlt, FaStar, FaSearch, FaFilter } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getStoreList } from "../slice/StoreSlice";
import { Helmet } from "react-helmet";
import SkeletonCard from "./skeletons/SkeletonCard";
import BusinessTabs from "./BusinessTabs";

function StoreList() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    location: '',
    sortBy: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);
  const limit = 12;
  
  const { businessList, loading, error } = useSelector((store) => store.store);
  const stores = businessList?.data?.items || [];
  const total = businessList?.data?.total || 0;
  const lastPage = businessList?.data?.last_page || 1;

  const fetchStores = (page = 1, search = '', filters = {}) => {
    const params = {
      page,
      limit,
      search,
      sort: filters.sortBy === 'newest' ? 'store_id' : filters.sortBy,
      sort_type: filters.sortBy === 'oldest' ? 'asc' : 'desc'
    };
    
    if (filters.status && filters.status !== 'all') {
      params.status = filters.status;
    }
    
    if (filters.location) {
      params.location = filters.location;
    }
    
    dispatch(getStoreList(params));
  };

  useEffect(() => {
    fetchStores(1, searchTerm, selectedFilters);
  }, [searchTerm, selectedFilters]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedFilters({
      status: 'all',
      location: '',
      sortBy: 'newest'
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      fetchStores(page, searchTerm, selectedFilters);
      window.scrollTo(0, 0);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStores(1, searchTerm, selectedFilters);
  };


  const StoreCard = ({ store }) => (
    <div className="group rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/store/${store.slug}`}>
        <div className="aspect-video bg-muted relative">
          <img
            src={store.store_logo || "/img/no-image-available.jpg"}
            alt={store.store_name}
            onError={(e) => {
              e.target.src = "/img/no-image-available.jpg";
            }}
            className="w-full h-full object-cover"
          />
          {store.is_featured && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                <FaStar className="h-3 w-3" />
                Featured
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/store/${store.slug}`}>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {store.store_name}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-2">
          {store.company_name}
        </p>
        
        {store.store_address && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <FaMapMarkerAlt className="h-3 w-3 flex-shrink-0" />
            <span className="line-clamp-1">{store.store_address}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            store.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {store.status === 'active' ? 'Active' : 'Inactive'}
          </span>
          
          <Link 
            to={`/store/${store.slug}`}
            className="text-sm text-primary hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  const Pagination = () => (
    <div className="flex items-center justify-between mt-8">
      <div className="text-sm text-muted-foreground">
        Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} results
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          Previous
        </button>
        
        {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
          const page = Math.max(1, Math.min(currentPage - 2, lastPage - 4)) + i;
          return page <= lastPage ? (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`inline-flex items-center justify-center h-9 w-9 text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {page}
            </button>
          ) : null;
        })}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Store Directory - Find Local Stores</title>
        <meta name="description" content="Browse our directory of local stores. Find the best services and products in your area." />
        <meta name="keywords" content="store directory, local stores, services, products, companies" />
      </Helmet>
      
      <div className="min-h-screen bg-background pt-32 md:pt-36 pb-8">
        <div className="page-container">
          <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Store Directory</h1>
            <p className="text-muted-foreground">
              Discover amazing local stores in your area
            </p>
          </div>

          {/* Business Tabs */}
          <div className="mb-8">
            <BusinessTabs />
          </div>

          {/* Search and Filters */}
          <div className="bg-card border rounded-lg p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search stores by name, company, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Search
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                >
                  <FaFilter className="h-4 w-4" />
                  Filters
                </button>
              </div>
              
              {/* Filters Panel */}
              {showFilters && (
                <div className="pt-4 border-t space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={selectedFilters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    
                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <input
                        type="text"
                        placeholder="Filter by location..."
                        value={selectedFilters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    {/* Sort By Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Sort By</label>
                      <select
                        value={selectedFilters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="name_desc">Name (Z-A)</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Clear all Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="px-4 py-2 text-sm text-primary hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <SkeletonCard 
                  key={index}
                  showImage={true}
                  showCategory={true}
                  showActions={false}
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Store Grid */}
          {!loading && !error && (
            <>
              {stores.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stores.map((store) => (
                      <StoreCard key={store.store_id} store={store} />
                    ))}
                  </div>
                  
                  <Pagination />
                </>
              ) : (
                <div className="text-center py-12">
                  <FaBuilding className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No stores found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Try adjusting your search criteria" 
                      : "No stores are currently listed"
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        </div>
      </div>
    </>
  );
}

export default StoreList;