/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaCamera,
  FaLocationArrow,
  FaRegStar,
  FaStar,
  FaTags,
  FaEdit,
  FaEye,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaStore,
  FaMapMarkerAlt,
  FaGlobe,
  FaEnvelope,
  FaPhone
} from "react-icons/fa";
import EditStoreOverlay from "./EditStoreOverlay";
import EditBannerStoreOverlay from "./EditBannerStoreOverlay";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { getStore, getStoreAds } from "../slice/StoreSlice";
import { creatFavouriteAds, getMyAds } from "../slice/ListSlice";
import { MdLocationOn } from "react-icons/md";
import { BiExitFullscreen } from "react-icons/bi";
import { HiOutlineStatusOnline } from "react-icons/hi";
import MyBanner from "./MyBanner";
import StoreMembersManager from "./StoreMembersManager";

function MyStoreAds() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [liked, setLiked] = useState({});

  const { slug } = useParams();
  const location = useLocation();
  const { storeDetail, error } = useSelector((store) => store.store);
  const storeAds = useSelector((store) => store.store.storeAds);
  const [storeDetailData, setStoreDetailData] = useState(
    storeDetail?.data || null
  );
  const [storeAdsData, setStoreAdsData] = useState(storeAds?.data || null);

  const itemsPerPage = 6;
  const totalDataCount = storeAdsData?.total || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // const maxLength = 100;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalDataCount / itemsPerPage)) {
      setCurrentPage(page);
    }
  };
  const init = async () => {
    try {
      await dispatch(
        getStore({
          customer_id: slug ?? "",
        })
      ).unwrap();
    } catch (error) {
      if (error?.message === "Unauthenticated.") {
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    setCurrentPage(1);
    init();
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
    if (error === "Unauthenticated.") {
      navigate("/Login");
    }
    setStoreDetailData(storeDetail?.data);
  }, [storeDetail, slug]);

  useEffect(() => {
    setStoreAdsData(storeAds?.data);
  }, [storeAds]);

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
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
      [index]: !prevLiked[index],
    }));
  };
  const [isEditOverlayOpen, setEditOverlayOpen] = useState(false);
  const [isEditBannerOverlayOpen, setEditBannerOverlayOpen] = useState(false);

  const membershipRole = storeDetailData?.membership_role;
  const canManageStore =
    !slug &&
    (storeDetailData?.is_owner ||
      ["owner", "admin", "manager"].includes(membershipRole));

  // Handler to open the edit overlay
  const handleEditClick = () => {
    setEditOverlayOpen(true);
  };
  const handleEditBannerClick = () => {
    setEditBannerOverlayOpen(true);
  };

  // Handler to close the edit overlay
  const handleEditClose = () => {
    init();
    setEditOverlayOpen(false);
    setEditBannerOverlayOpen(false);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    if (status === "active") {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20">
        {/* Hero Banner Section */}
        <div className="relative">
          <div className="h-64 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
            <img
              src={"/img/bg-default-banner-store.jpg"}
              className="w-full h-full object-cover opacity-30"
              alt="Store Banner"
            />
            {canManageStore && (
              <button
                onClick={handleEditBannerClick}
                className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white h-10 w-10 text-foreground transition-colors"
              >
                <FaCamera className="h-4 w-4" />
              </button>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-800/80" />
          </div>
        </div>

        {/* Store Profile Section */}
        <div className="page-container -mt-20 relative z-10">
          <div className="rounded-lg border bg-card shadow-lg">
            <div className="p-6">
              {/* Store Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background bg-muted">
                    <img
                      src={storeDetailData?.store_logo || "/img/no-image-available.jpg"}
                      alt="Store Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground mb-2">
                        {storeDetailData?.store_name || 'Store Name'}
                      </h1>
                      <div className="flex items-center gap-2 mb-2">
                        <FaStore className="h-4 w-4 text-muted-foreground" />
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
                    
                    {canManageStore && (
                      <button
                        onClick={handleEditClick}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 text-sm font-medium transition-colors"
                      >
                        <FaEdit className="h-4 w-4" />
                        {storeDetailData?.store_id ? "Edit Store" : "Upgrade to Store"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Store Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FaBuilding className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Store Name
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {storeDetailData?.store_name || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FaMapMarkerAlt className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Address
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {storeDetailData?.store_address || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <HiOutlineStatusOnline className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {storeDetailData?.status === "active" ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      {!slug && storeDetailData?.store_id && (
        <div className="page-container mt-8">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <StoreMembersManager
                storeId={storeDetailData.store_id}
                fallbackMembers={storeDetailData?.members}
                fallbackRoles={storeDetailData?.available_roles}
                isOwner={Boolean(storeDetailData?.is_owner)}
              />
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="page-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Ads Section */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    {slug ? "Store Ads" : "My Store Ads"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {totalDataCount} ads available
                  </p>
                </div>
              </div>

              {storeAdsData?.items?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {storeAdsData?.items.map((items, index) => (
                      <div
                        key={index}
                        className="group rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <Link to={`/ads-detail/${items.slug}`}>
                          <div className="aspect-video bg-muted">
                            {items.images && items.images.length > 0 ? (
                              <img
                                src={items.images[0]?.image_path}
                                alt={items.title}
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
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <FaTags className="h-3 w-3" />
                            <span>{items.category?.name}</span>
                          </div>
                          
                          <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                            <Link
                              to={`/ads-detail/${items.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {items.title}
                            </Link>
                          </h3>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <MdLocationOn className="h-3 w-3" />
                            <span>{items.location?.city}</span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-2">
                              <Link to={`/ads-detail/${items.slug}`}>
                                <button className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 transition-colors">
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
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <FaChevronLeft className="h-3 w-3" />
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage * itemsPerPage >= totalDataCount}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Next
                        <FaChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border bg-card p-12 text-center">
                  <FaStore className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No ads found</h3>
                  <p className="text-sm text-muted-foreground">
                    {slug ? "This store doesn't have any ads yet." : "You haven't posted any ads to your store yet."}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <MyBanner customerId={slug} />
            </div>
          </div>
        </div>
      </div>

      {/* Display the EditOverlay component when isEditOverlayOpen is true */}
      {isEditOverlayOpen && (
        <EditStoreOverlay onClose={handleEditClose} data={storeDetailData} />
      )}
      {isEditBannerOverlayOpen && (
        <EditBannerStoreOverlay
          onClose={handleEditClose}
          imageBanner={""}
          type={"store"}
        />
      )}
    </div>
  );
}

export default MyStoreAds;
