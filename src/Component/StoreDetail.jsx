/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaIndustry,
  FaEye,
  FaHeart,
  FaEdit,
  FaCamera
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getStoreBySlug, getStoreAds } from "../slice/StoreSlice";
import { creatFavouriteAds } from "../slice/ListSlice";
import { Helmet } from "react-helmet";
import EditStoreOverlay from "./EditStoreOverlay";
import EditBannerStoreOverlay from "./EditBannerStoreOverlay";

function StoreDetail() {
  const dispatch = useDispatch();
  const { slug } = useParams();
  
  const { storeDetail, error } = useSelector((store) => store.store);
  const storeAds = useSelector((store) => store.store.storeAds);
  const [storeDetailData, setStoreDetailData] = useState(storeDetail?.data || null);
  const [storeAdsData, setStoreAdsData] = useState(storeAds?.data || null);
  const [liked, setLiked] = useState({});
  const [isEditOverlayOpen, setEditOverlayOpen] = useState(false);
  const [isEditBannerOverlayOpen, setEditBannerOverlayOpen] = useState(false);

  // Check if current user can manage this store
  const currentUserId = localStorage.getItem('customer_id');
  const canManageStore = 
    storeDetailData?.is_owner ||
    storeDetailData?.customer_id === currentUserId;

  const itemsPerPage = 16;
  const totalDataCount = storeAdsData?.total || 0;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (slug) {
      dispatch(getStoreBySlug({ slug: slug }));
    }
  }, [slug]);

  useEffect(() => {
    if (storeDetailData?.customer_id) {
      dispatch(
        getStoreAds({
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
          customer_id: storeDetailData?.customer_id ?? "",
        })
      );
    }
  }, [currentPage, storeDetailData?.customer_id]);

  useEffect(() => {
    setStoreDetailData(storeDetail?.data);
  }, [storeDetail]);

  useEffect(() => {
    setStoreAdsData(storeAds?.data);
  }, [storeAds]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalDataCount / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const addToFavourite = (customer_id, listing_id, index) => {
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
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    if (status === "active") {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  const handleEditClick = () => {
    setEditOverlayOpen(true);
  };

  const handleEditClose = () => {
    setEditOverlayOpen(false);
    dispatch(getStoreBySlug({ slug: slug }));
  };

  const handleEditBannerClick = () => {
    setEditBannerOverlayOpen(true);
  };

  const handleEditBannerClose = () => {
    setEditBannerOverlayOpen(false);
    dispatch(getStoreBySlug({ slug: slug }));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">Store Not Found</h2>
            <p className="text-red-600">The store you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {`${storeDetailData?.store_name || 'Store'} - Store Information`}
        </title>
        <meta
          name="description"
          content={`${storeDetailData?.store_name || 'Store'} information.`}
        />
        <meta
          name="keywords"
          content={`${storeDetailData?.store_name}, store, information`}
        />
        <meta property="og:title" content={storeDetailData?.store_name || 'Store'} />
        <meta
          property="og:description"
          content={`Discover the information of ${storeDetailData?.store_name || 'this store'}.`}
        />
        <meta property="og:image" content={storeDetailData?.store_logo} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-background pt-28 pb-8">
        <div className="container mx-auto px-4">
          {/* Store Profile Section */}
          <div className="rounded-lg border bg-card shadow-lg mb-8">
            {/* Store Banner */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg overflow-hidden">
              {storeDetailData?.store_banner ? (
                <img
                  src={storeDetailData.store_banner}
                  alt="Store Banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <FaBuilding className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-lg font-medium opacity-75">Store Banner</p>
                  </div>
                </div>
              )}
              {canManageStore && (
                <button
                  onClick={handleEditBannerClick}
                  className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white h-10 w-10 text-foreground transition-colors"
                  title="Edit Banner"
                >
                  <FaCamera className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="p-6">
              {/* Store Header */}
              <div className="flex flex-col lg:flex-row gap-6 mb-6">
                {/* Left Side - Logo and Basic Info */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background bg-muted">
                      <img
                        src={storeDetailData?.store_logo || "/img/no-image-available.jpg"}
                        alt="Store Logo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/img/no-image-available.jpg";
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-2xl font-bold text-foreground">
                        {storeDetailData?.store_name || 'Store Name'}
                      </h1>
                      {canManageStore && (
                        <button
                          onClick={handleEditClick}
                          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 text-sm font-medium transition-colors"
                        >
                          <FaEdit className="h-3 w-3" />
                          Edit Store
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaIndustry className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Store</span>
                      <span className={getStatusBadge(storeDetailData?.status)}>
                        {storeDetailData?.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {storeDetailData?.store_address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FaMapMarkerAlt className="h-4 w-4" />
                        <span>{storeDetailData.store_address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Store Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FaBuilding className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Company Name
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {storeDetailData?.company_name || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FaGlobe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Company No.
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {storeDetailData?.company_no || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FaEnvelope className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        VAT
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {storeDetailData?.vat || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FaPhone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {storeDetailData?.status ? storeDetailData.status.charAt(0).toUpperCase() + storeDetailData.status.slice(1) : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
               </div>

               {/* Store Description */}
               {storeDetailData?.description && (
                 <div className="mt-6 pt-6 border-t">
                   <h3 className="text-lg font-semibold text-foreground mb-4">About This Store</h3>
                   <p className="text-muted-foreground leading-relaxed">
                     {storeDetailData.description}
                   </p>
                 </div>
               )}
             </div>
           </div>

           {/* Store Ads Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Store Ads</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalDataCount} ads available
                </p>
              </div>
            </div>

            {storeAdsData?.items?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {storeAdsData?.items.map((item, index) => (
                    <div
                      key={index}
                      className="group rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <Link to={`/ads-detail/${item.slug}`}>
                        <div className="aspect-video bg-muted">
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]?.image_path}
                              alt={item.title}
                              onError={(e) => {
                                e.target.src = "/img/no-image.png";
                              }}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
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
                        <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                          <Link
                            to={`/ads-detail/${item.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {item.title}
                          </Link>
                        </h3>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <Link to={`/ads-detail/${item.slug}`}>
                              <button className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 transition-colors">
                                <FaEye className="h-3 w-3" />
                              </button>
                            </Link>
                            <button
                              onClick={() =>
                                addToFavourite(
                                  item.customer_id,
                                  item.listing_id,
                                  index
                                )
                              }
                              className={`inline-flex items-center justify-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground h-8 w-8 transition-colors ${
                                liked[index] ? 'bg-red-50 text-red-600 border-red-200' : ''
                              }`}
                            >
                              <FaHeart className={`h-3 w-3 ${liked[index] ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalDataCount)} to {Math.min(currentPage * itemsPerPage, totalDataCount)} of {totalDataCount} results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage * itemsPerPage >= totalDataCount}
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-lg border bg-card p-12 text-center">
                <FaIndustry className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No ads found</h3>
                <p className="text-sm text-muted-foreground">
                  This store doesn't have any ads yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Store Overlay */}
      {isEditOverlayOpen && (
        <EditStoreOverlay
          onClose={handleEditClose}
          data={storeDetailData}
        />
      )}
      {isEditBannerOverlayOpen && (
        <EditBannerStoreOverlay
          onClose={handleEditBannerClose}
          imageBanner={storeDetailData?.store_banner || ""}
          type={"store"}
        />
      )}
    </>
  );
}

export default StoreDetail;