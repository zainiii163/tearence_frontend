/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { FaBuilding, FaMapMarkerAlt, FaStar, FaSearch, FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getBusinessList } from "../slice/StoreSlice";
import { Helmet } from "react-helmet";
import SkeletonCard from "./skeletons/SkeletonCard";
import BusinessTabs from "./BusinessTabs";

function BusinessList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFeatured, setFilterFeatured] = useState('all');
  const limit = 12;

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  
  const { businessList, loading, error } = useSelector((store) => store.store);
  const businesses = businessList?.data?.items || [];
  const total = businessList?.data?.total || 0;
  const lastPage = businessList?.data?.last_page || 1;

  const fetchBusinesses = (page = 1, search = '', status = 'all', featured = 'all') => {
    const params = {
      page,
      limit,
      search,
      sort: 'is_featured',
      sort_type: 'desc'
    };
    
    if (status !== 'all') {
      params.status = status;
    }
    
    if (featured !== 'all') {
      params.is_featured = featured === 'featured' ? 1 : 0;
    }
    
    dispatch(getBusinessList(params));
  };

  useEffect(() => {
    fetchBusinesses(1, searchTerm, filterStatus, filterFeatured);
  }, [searchTerm, filterStatus, filterFeatured]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      fetchBusinesses(page, searchTerm, filterStatus, filterFeatured);
      window.scrollTo(0, 0);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBusinesses(1, searchTerm, filterStatus, filterFeatured);
  };

  const handleFilterChange = (type, value) => {
    setCurrentPage(1);
    if (type === 'status') {
      setFilterStatus(value);
    } else if (type === 'featured') {
      setFilterFeatured(value);
    }
  };


  const BusinessCard = ({ business }) => (
    <div className="group rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/business/${business.slug}`}>
        <div className="aspect-video bg-muted relative">
          <img
            src={business.business_logo || "/img/no-image-available.jpg"}
            alt={business.business_name}
            onError={(e) => {
              e.target.src = "/img/no-image-available.jpg";
            }}
            className="w-full h-full object-cover"
          />
          {business.is_featured && (
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
        <Link to={`/business/${business.slug}`}>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {business.business_name}
          </h3>
        </Link>
        
        {business.business_address && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <FaMapMarkerAlt className="h-3 w-3 flex-shrink-0" />
            <span className="line-clamp-1">{business.business_address}</span>
          </div>
        )}
        
        {business.business_owner && (
          <p className="text-sm text-muted-foreground mb-3">
            Owner: {business.business_owner}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            business.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {business.status === 'active' ? 'Active' : 'Inactive'}
          </span>
          
          <Link 
            to={`/business/${business.slug}`}
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
        <title>Business Directory - Find Local Businesses</title>
        <meta name="description" content="Browse our directory of local businesses. Find the best services and products in your area." />
        <meta name="keywords" content="business directory, local businesses, services, products, companies" />
      </Helmet>
      
      <div className="min-h-screen bg-background pt-32 md:pt-36 pb-8">
        <div className="container mx-auto px-4">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Business Directory</h1>
            <p className="text-muted-foreground">
              Discover amazing local businesses in your area
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
                    placeholder="Search businesses by name, address, or owner..."
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
              </div>
              
              {/* Filter Section */}
              <div className="flex flex-col md:flex-row gap-4 pt-4 border-t">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-2">Featured</label>
                  <select
                    value={filterFeatured}
                    onChange={(e) => handleFilterChange('featured', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Businesses</option>
                    <option value="featured">Featured Only</option>
                    <option value="regular">Regular Only</option>
                  </select>
                </div>
              </div>
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

          {/* Business Grid */}
          {!loading && !error && (
            <>
              {businesses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {businesses.map((business) => (
                      <BusinessCard key={business.id} business={business} />
                    ))}
                  </div>
                  
                  <Pagination />
                </>
              ) : (
                <div className="text-center py-12">
                  <FaBuilding className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No businesses found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Try adjusting your search criteria" 
                      : "No businesses are currently listed"
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default BusinessList;