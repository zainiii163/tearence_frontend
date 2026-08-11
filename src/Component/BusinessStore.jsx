/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaCamera,
  FaEdit,
  FaGlobe,
  FaTags,
  FaEye,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaIndustry
} from "react-icons/fa";
import EditBusinessStoreOverlay from "./EditBusinessStoreOverlay";
import EditBannerStoreOverlay from "./EditBannerStoreOverlay";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import {
  getBusinessStore,
  getStoreAds,
  clearAdsErrorAndMessage,
  getBusinessStoreBySlug,
} from "../slice/StoreSlice";
import { creatFavouriteAds } from "../slice/ListSlice";

import { MdLocationOn } from "react-icons/md";
import MyBanner from "./MyBanner";
import { Helmet } from "react-helmet";
import BusinessMembersManager from "./BusinessMembersManager";
import BusinessSubscriptionPanel from "./Business/BusinessSubscriptionPanel";
import businessService from "../services/BusinessService";
import toast from "react-hot-toast";

function MyStoreAds() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [liked, setLiked] = useState({});

  const { slug } = useParams();
  const location = useLocation();
  const { businessStore, error } = useSelector((store) => store.store);
  const storeAds = useSelector((store) => store.store.storeAds);
  const [storeDetailData, setStoreDetailData] = useState(
    businessStore?.data || null
  );
  const [storeAdsData, setStoreAdsData] = useState(storeAds?.data || null);
  const [keyBanner, setKeyBanner] = useState(Math.random());

  const membershipRole = storeDetailData?.membership_role;
  const currentUserId = localStorage.getItem('customer_id');
  const canManageBusiness =
    !slug ||
    storeDetailData?.is_owner ||
    storeDetailData?.customer_id === currentUserId ||
    ["owner", "admin", "manager"].includes(membershipRole);

  const itemsPerPage = 16;
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
      if (slug) {
        if (isNaN(parseInt(slug))) {
          dispatch(
            getBusinessStoreBySlug({
              slug,
            })
          );
        } else {
          dispatch(
            getBusinessStore({
              customer_id: slug,
            })
          );
        }
      } else {
        dispatch(getBusinessStore({}));
      }
    } catch (error) {
      if (error?.message === "Unauthenticated.") {
        clearAdsErrorAndMessage();
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    setCurrentPage(1);
    init();
  }, [slug]);
  useEffect(() => {
    setKeyBanner(Math.random());
  }, [location.pathname]);
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
      clearAdsErrorAndMessage();
      navigate("/Login");
    }
    setStoreDetailData(businessStore?.data);
  }, [businessStore, slug]);

  useEffect(() => {
    setStoreAdsData(storeAds?.data);
  }, [storeAds]);

  // Accept pending staff invite from email link: /my-business?invite=TOKEN
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('invite');
    if (!token || slug) return;
    let cancelled = false;
    (async () => {
      try {
        await businessService.acceptStaffInvite(token);
        if (!cancelled) {
          toast.success('Invite accepted — you can manage this business page.');
          navigate('/my-business', { replace: true });
          init();
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(err?.response?.data?.message || err?.message || 'Could not accept invite');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location.search, slug]);

  // const truncateString = (str, maxLength) => {
  //   if (str.length > maxLength) {
  //     return str.substring(0, maxLength) + "...";
  //   }
  //   return str;
  // }; // Commented out as unused

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
  const [activeTab, setActiveTab] = useState('ads'); // 'ads' or 'subscription'
  const [subscriptionData, setSubscriptionData] = useState(null);

  // Handler to open the edit overlay
  const handleEditClick = () => {
    setEditOverlayOpen(true);
  };

  // Handler to close the edit overlay
  const handleEditClose = () => {
    init();
    setEditOverlayOpen(false);
    setEditBannerOverlayOpen(false);
  };

  const handleSubscriptionChange = (newSubscriptionData) => {
    setSubscriptionData(newSubscriptionData);
    init(); // Refresh business data to show new subscription
  };

  const handleEditBannerClick = () => {
    setEditBannerOverlayOpen(true);
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
    <>
      <Helmet>
        <title>
          {`${storeDetailData?.business_name}`} - Business Information
        </title>
        <meta
          name="description"
          content={`${storeDetailData?.business_name} Business information.`}
        />
        <meta
          name="keywords"
          content={`${storeDetailData?.business_name}, business, information`}
        />
        <meta property="og:title" content={storeDetailData?.business_name} />
        <meta
          property="og:description"
          content={`Discover the information of ${storeDetailData?.business_name}.`}
        />
        <meta property="og:image" content={storeDetailData?.business_logo} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="pt-20">
          {/* Hero Banner Section */}
          <div className="relative">
            <div className="h-80 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
              <img
                src={"/img/header-business-store.jpeg"}
                className="w-full h-full object-cover opacity-30"
                alt="Business Banner"
              />
              {canManageBusiness && (
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

          {/* Business Profile Section */}
          <div className="page-container -mt-32 relative z-10">
            <div className="rounded-lg border bg-card shadow-lg">
              <div className="p-6">
                {/* Business Header */}
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                  {/* Left Side - Logo and Basic Info */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background bg-muted">
                        <img
                          src={storeDetailData?.business_logo || "/img/no-image-available.jpg"}
                          alt="Business Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-foreground mb-2">
                        {storeDetailData?.business_name || 'Business Name'}
                      </h1>
                      <div className="flex items-center gap-2 mb-2">
                        <FaIndustry className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Business</span>
                        <span className={getStatusBadge(storeDetailData?.status)}>
                          {storeDetailData?.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {storeDetailData?.business_address && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FaMapMarkerAlt className="h-4 w-4" />
                          <span>{storeDetailData.business_address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Edit Button */}
                  {canManageBusiness && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={handleEditClick}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 text-sm font-medium transition-colors"
                      >
                        <FaEdit className="h-4 w-4" />
                        {storeDetailData?.id ? "Edit Business" : "Upgrade to Business"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Business Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FaBuilding className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Company No.
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {storeDetailData?.business_company_no || 'Not provided'}
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
                          Website
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {storeDetailData?.business_website ? (
                            <Link
                              to={storeDetailData.business_website}
                              target="_blank"
                              className="text-primary hover:underline"
                            >
                              {storeDetailData.business_website}
                            </Link>
                          ) : (
                            'Not provided'
                          )}
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
                          Business Email
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {storeDetailData?.business_email || 'Not provided'}
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
                          Business Phone
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {storeDetailData?.business_phone_number || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>
      {!slug && storeDetailData?.id && (
        <div className="page-container mt-8">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <BusinessMembersManager
                businessId={storeDetailData.id}
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
            {/* Tab Navigation */}
            {canManageBusiness && (
              <div className="mb-8">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab('ads')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'ads'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Business Ads
                    </button>
                    <button
                      onClick={() => setActiveTab('subscription')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === 'subscription'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Subscription & Credits
                    </button>
                  </nav>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Content Section */}
              <div className="lg:col-span-3">
                {activeTab === 'ads' ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-semibold text-foreground">Business Ads</h2>
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
                              {items && items.slug ? (
                                <Link to={`/ads-detail/${items.slug}`}>
                                  <div className="aspect-video bg-muted">
                                    {items.images && items.images.length > 0 ? (
                                      <img
                                        src={items.images[0]?.image_path}
                                        alt={items.title || 'Product image'}
                                        onError={(e) => {
                                          e.target.src = "/img/no-image.png";
                                        }}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <img
                                          src="/img/no-image.png"
                                          alt="No preview available"
                                          className="w-16 h-16 opacity-50"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              ) : (
                                <div className="aspect-video bg-muted">
                                  {items.images && items.images.length > 0 ? (
                                    <img
                                      src={items.images[0]?.image_path}
                                      alt={items.title || 'Product image'}
                                      onError={(e) => {
                                        e.target.src = "/img/no-image.png";
                                      }}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <img
                                        src="/img/no-image.png"
                                        alt="No preview available"
                                        className="w-16 h-16 opacity-50"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="p-4">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                  <FaTags className="h-3 w-3" />
                                  <span>{items?.category?.name || 'Uncategorized'}</span>
                                </div>
                                
                                <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                                  {items && items.slug ? (
                                    <Link
                                      to={`/ads-detail/${items.slug}`}
                                      className="hover:text-primary transition-colors"
                                    >
                                      {items?.title || 'Untitled'}
                                    </Link>
                                  ) : (
                                    <span className="text-gray-500">{items?.title || 'Untitled'}</span>
                                  )}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                  <MdLocationOn className="h-3 w-3" />
                                  <span>{items?.location?.city || 'Location not specified'}</span>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t">
                                  <div className="flex items-center gap-2">
                                    {items && items.slug ? (
                                      <Link to={`/ads-detail/${items.slug}`}>
                                        <button className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 transition-colors">
                                          <FaEye className="h-3 w-3" />
                                        </button>
                                      </Link>
                                    ) : (
                                      <button 
                                        className="inline-flex items-center justify-center rounded-md bg-gray-300 text-gray-500 h-8 w-8 transition-colors"
                                        disabled
                                      >
                                        <FaEye className="h-3 w-3" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() =>
                                        items && items.customer_id && items.listing_id &&
                                        addToFavourite(
                                          items.customer_id,
                                          items.listing_id,
                                          index
                                        )
                                      }
                                      className={`inline-flex items-center justify-center rounded-md border border-input hover:bg-accent hover:text-accent-foreground h-8 w-8 transition-colors ${
                                        liked[index] ? 'bg-red-50 text-red-600 border-red-200' : ''
                                      }`}
                                      disabled={!items || !items.customer_id || !items.listing_id}
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
                        <FaIndustry className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No ads found</h3>
                        <p className="text-sm text-muted-foreground">
                          This business doesn't have any ads yet.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <BusinessSubscriptionPanel
                    businessId={storeDetailData?.id}
                    currentSubscription={subscriptionData}
                    onSubscriptionChange={handleSubscriptionChange}
                  />
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1" key={keyBanner}>
                {slug && storeDetailData?.customer_id ? (
                  <MyBanner customerId={storeDetailData.customer_id} />
                ) : (
                  <>{!slug && <MyBanner />}</>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Display the EditOverlay component when isEditOverlayOpen is true */}
        {isEditOverlayOpen && (
          <EditBusinessStoreOverlay
            onClose={handleEditClose}
            data={storeDetailData}
          />
        )}
        {isEditBannerOverlayOpen && (
          <EditBannerStoreOverlay
            onClose={handleEditClose}
            imageBanner={""}
            type={"business"}
          />
        )}
      </div>
    </>
  );
}

export default MyStoreAds;
