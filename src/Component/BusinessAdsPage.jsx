import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaIndustry,
  FaStar,
  FaEye,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaTags
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";
import {
  getBusinessStoreBySlug,
  getStoreAds,
  clearAdsErrorAndMessage
} from "../slice/StoreSlice";
import { creatFavouriteAds } from "../slice/ListSlice";
import SkeletonCard from "./skeletons/SkeletonCard";
import SkeletonPage from "./skeletons/SkeletonPage";

export default function BusinessAdsPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { businessStore, error, loading } = useSelector((store) => store.store);
  const storeAds = useSelector((store) => store.store.storeAds);
  const [liked, setLiked] = useState({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const businessData = businessStore?.data || null;
  const adsData = storeAds?.data || null;
  const totalAds = adsData?.total || 0;
  const totalPages = Math.ceil(totalAds / itemsPerPage);
  
  useEffect(() => {
    if (slug) {
      dispatch(getBusinessStoreBySlug({ slug }));
    }
  }, [slug, dispatch]);
  
  useEffect(() => {
    if (businessData?.customer_id) {
      dispatch(getStoreAds({
        customer_id: businessData.customer_id,
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage
      }));
    }
  }, [businessData?.customer_id, currentPage, dispatch]);
  
  useEffect(() => {
    if (error === "Unauthenticated.") {
      dispatch(clearAdsErrorAndMessage());
      navigate("/login");
    }
  }, [error, dispatch, navigate]);
  
  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalAds / itemsPerPage)) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const addToFavourite = (customer_id, listing_id, index) => {
    const currentCustomerId = localStorage.getItem('customer_id') || customer_id;
    if (liked[index]) {
      dispatch(
        creatFavouriteAds({ data: { customer_id: currentCustomerId, listing_id, is_favorite: false } })
      );
    } else {
      dispatch(
        creatFavouriteAds({ data: { customer_id: currentCustomerId, listing_id, is_favorite: true } })
      );
    }
    
    setLiked((prevLiked) => ({
      ...prevLiked,
      [index]: !prevLiked[index]
    }));
  };
  
  const truncateString = (str, maxLength) => {
    if (!str) return '';
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  };
  
  const renderPageNumbers = () => {
    const pages = [];
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            currentPage === i
              ? 'bg-primary text-primary-foreground'
              : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-8">
        <div className="container mx-auto px-4">
          {/* Business Header Skeleton */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 mb-8 animate-pulse">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-blue-500/30 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-blue-500/30 rounded w-3/4"></div>
                <div className="h-4 bg-blue-500/30 rounded w-1/2"></div>
                <div className="h-4 bg-blue-500/30 rounded w-1/3"></div>
              </div>
            </div>
          </div>
          
          {/* Ads Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard 
                key={index}
                showImage={true}
                showCategory={true}
                showActions={true}
              />
            ))}
          </div>
          
          {/* Pagination Skeleton */}
          <div className="flex justify-center mt-8 animate-pulse">
            <div className="h-10 bg-muted rounded w-64"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error && error !== "Unauthenticated.") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!businessData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FaBuilding className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Business Not Found</h2>
          <p className="text-muted-foreground mb-4">The business you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 text-sm font-medium transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{businessData.business_name} - Business Ads | World Wide Adverts</title>
         <meta
           name="description"
           content={`Browse all ads from ${businessData.business_name}. ${businessData.description || 'Find great products and services from this trusted business.'}`}
         />
        <meta
          name="keywords"
          content={`${businessData.business_name}, business ads, ${businessData.business_category || ''}, ${businessData.business_address || ''}`}
        />
        <meta property="og:title" content={`${businessData.business_name} - Business Ads`} />
        <meta
          property="og:description"
          content={`Discover products and services from ${businessData.business_name}`}
        />
        <meta property="og:image" content={businessData.business_logo} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="pt-20">
          {/* Business Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="container mx-auto px-4 py-12">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 overflow-hidden">
                  <img
                    src={businessData.business_logo || "/img/no-image-available.jpg"}
                    alt={businessData.business_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/img/no-image-available.jpg";
                    }}
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{businessData.business_name}</h1>
                  {businessData.business_tagline && (
                    <p className="text-blue-100 text-lg mb-3">{businessData.business_tagline}</p>
                  )}
                  {businessData.business_address && (
                    <div className="flex items-center justify-center md:justify-start gap-2 text-blue-100">
                      <FaMapMarkerAlt className="h-4 w-4" />
                      <span>{businessData.business_address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Business Details Section */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                 {/* Business Description */}
                 {businessData.description && (
                   <div className="bg-card rounded-lg border p-6 mb-8">
                     <h2 className="text-xl font-semibold text-foreground mb-4">About Our Business</h2>
                     <p className="text-muted-foreground leading-relaxed">
                       {businessData.description}
                     </p>
                   </div>
                 )}

                {/* Ads Section Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">Business Ads</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {totalAds} ads available
                    </p>
                  </div>
                </div>

                {/* Ads Grid */}
                {adsData?.items?.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {adsData.items.map((ad, index) => (
                        <div
                          key={ad.listing_id || index}
                          className="group rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                        >
                          <Link to={`/ads-detail/${ad.slug}`}>
                            <div className="aspect-video bg-muted relative">
                              {ad.images && ad.images.length > 0 ? (
                                <img
                                  src={ad.images[0]?.image_path}
                                  alt={ad.title}
                                  onError={(e) => {
                                    e.target.src = "/img/no-image.png";
                                  }}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                  <img
                                    src="/img/no-image.png"
                                    alt="No image"
                                    className="w-16 h-16 opacity-50"
                                  />
                                </div>
                              )}
                            </div>
                          </Link>

                          <div className="p-4">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <FaTags className="h-3 w-3" />
                              <span>{ad.category?.name || 'Uncategorized'}</span>
                            </div>
                            
                            <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                              <Link
                                to={`/ads-detail/${ad.slug}`}
                                className="hover:text-primary transition-colors"
                              >
                                {truncateString(ad.title, 60)}
                              </Link>
                            </h3>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                              <MdLocationOn className="h-3 w-3" />
                              <span>{ad.location?.city || 'Location not specified'}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center gap-2">
                                <Link to={`/ads-detail/${ad.slug}`}>
                                  <button className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 transition-colors">
                                    <FaEye className="h-3 w-3" />
                                  </button>
                                </Link>
                                <button
                                  onClick={() => addToFavourite(ad.customer_id, ad.listing_id, index)}
                                  className={`inline-flex items-center justify-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground h-8 w-8 transition-colors ${
                                    liked[index] ? 'bg-red-50 text-red-600 border-red-200' : ''
                                  }`}
                                >
                                  {liked[index] ? (
                                    <FaHeart className="h-3 w-3 fill-current" />
                                  ) : (
                                    <AiOutlineHeart className="h-3 w-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Showing {((currentPage - 1) * itemsPerPage) + 1}-
                          {Math.min(currentPage * itemsPerPage, totalAds)} of {totalAds} results
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                          >
                            <FaChevronLeft className="h-3 w-3" />
                            Previous
                          </button>
                          
                          <div className="flex items-center gap-1">
                            {renderPageNumbers()}
                          </div>
                          
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage * itemsPerPage >= totalAds}
                            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                          >
                            Next
                            <FaChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-lg border bg-card p-12 text-center">
                    <FaIndustry className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Ads Yet</h3>
                    <p className="text-muted-foreground">
                      This business hasn't posted any ads yet. Check back later!
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar - Business Info */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border p-6 sticky top-24">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Business Details</h3>
                  
                  <div className="space-y-4">
                    {businessData.business_category && (
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FaIndustry className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Category
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {businessData.business_category}
                          </p>
                        </div>
                      </div>
                    )}

                    {businessData.business_website && (
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FaGlobe className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Website
                          </p>
                          <a
                            href={businessData.business_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            {businessData.business_website}
                          </a>
                        </div>
                      </div>
                    )}

                    {businessData.business_email && (
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FaEnvelope className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Email
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {businessData.business_email}
                          </p>
                        </div>
                      </div>
                    )}

                    {businessData.business_phone_number && (
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FaPhone className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Phone
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {businessData.business_phone_number}
                          </p>
                        </div>
                      </div>
                    )}

                    {businessData.business_company_no && (
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FaBuilding className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Company No.
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {businessData.business_company_no}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}