import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDashboard } from "../slice/DashboardSlice";
import { deleteAds, getMyAds } from "../slice/ListSlice";
import {
  FaTags,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaAd,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import ModalCategoryPostAd from "./ModalCategoryPostAd";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdvertPostsManagement = () => {
  const dispatch = useDispatch();
  const customerId = useSelector((store) =>
    store.auth.customerId || (store.auth?.userDetail?.data?.customer_id || localStorage.getItem("customer_id"))
  );

  const [activeTab, setActiveTab] = useState("posted");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch ads based on active tab
  const [postedAds, setPostedAds] = useState({ items: [], total: 0 });
  const [paidAds, setPaidAds] = useState({ items: [], total: 0 });
  const [expiringAds, setExpiringAds] = useState({ items: [], total: 0 });

  // Get dashboard data which includes posted_ads, paid_ads, expiring_ads
  const userDashboard = useSelector((store) => store.dashboard?.userDashboard);
  const dashboardAds = useMemo(() => {
    if (userDashboard) {
      return {
        posted: userDashboard.posted_ads || [],
        paid: userDashboard.paid_ads || [],
        expiring: userDashboard.expiring_ads || [],
      };
    }
    return { posted: [], paid: [], expiring: [] };
  }, [userDashboard]);

  useEffect(() => {
    if (!customerId) return;

    const fetchAds = async () => {
      try {
        // Use dashboard data if available, otherwise fetch from API
        if (dashboardAds.posted.length > 0 || dashboardAds.paid.length > 0 || dashboardAds.expiring.length > 0) {
          // Filter by search term
          const posted = dashboardAds.posted.filter(ad => {
            const matchesSearch = searchTerm
              ? (ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 ad.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
              : true;
            return matchesSearch;
          });

          const paid = dashboardAds.paid.filter(ad => {
            const matchesSearch = searchTerm
              ? (ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 ad.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
              : true;
            return matchesSearch;
          });

          const expiring = dashboardAds.expiring.filter(ad => {
            const matchesSearch = searchTerm
              ? (ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 ad.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
              : true;
            return matchesSearch;
          });

          setPostedAds({ items: posted, total: posted.length });
          setPaidAds({ items: paid, total: paid.length });
          setExpiringAds({ items: expiring, total: expiring.length });
          return;
        }

        // Fallback: Fetch all ads with different statuses
        const [allAdsResult, activeAdsResult] = await Promise.all([
          dispatch(getMyAds({
            id: customerId,
            status: "all",
            skip: 0,
            limit: 1000, // Get all for filtering
          })).unwrap().catch(() => ({ data: { items: [], total: 0 } })),
          dispatch(getMyAds({
            id: customerId,
            status: "active",
            skip: 0,
            limit: 1000,
          })).unwrap().catch(() => ({ data: { items: [], total: 0 } })),
        ]);

        const allAds = allAdsResult?.data?.items || allAdsResult?.items || [];
        const activeAds = activeAdsResult?.data?.items || activeAdsResult?.items || [];

        // Filter posted ads (all active ads)
        const posted = activeAds.filter(ad => {
          const matchesSearch = searchTerm
            ? (ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               ad.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            : true;
          return matchesSearch;
        });

        // Filter paid ads (ads with paid/featured/promoted/sponsored flags)
        const paid = allAds.filter(ad => {
          const isPaid = ad.is_paid || ad.is_featured || ad.is_promoted || ad.is_sponsored || ad.is_business || ad.is_store;
          const matchesSearch = searchTerm
            ? (ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               ad.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            : true;
          return isPaid && matchesSearch;
        });

        // Filter expiring ads (ads expiring within 7 days)
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const expiring = allAds.filter(ad => {
          if (!ad.end_date && !ad.expires_at) return false;
          const expiryDate = new Date(ad.end_date || ad.expires_at);
          const isExpiring = expiryDate >= now && expiryDate <= sevenDaysFromNow;
          const matchesSearch = searchTerm
            ? (ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               ad.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            : true;
          return isExpiring && matchesSearch;
        });

        setPostedAds({ items: posted, total: posted.length });
        setPaidAds({ items: paid, total: paid.length });
        setExpiringAds({ items: expiring, total: expiring.length });
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    // Fetch dashboard data if not available
    if (!userDashboard) {
      dispatch(getUserDashboard()).catch(() => {});
    }

    fetchAds();
  }, [dispatch, customerId, searchTerm, dashboardAds, userDashboard]);

  const getCurrentAds = () => {
    switch (activeTab) {
      case "posted":
        return postedAds;
      case "paid":
        return paidAds;
      case "expiring":
        return expiringAds;
      default:
        return { items: [], total: 0 };
    }
  };

  const currentAds = getCurrentAds();
  const paginatedAds = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return currentAds.items.slice(startIndex, startIndex + itemsPerPage);
  }, [currentAds.items, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(currentAds.total / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (adId) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      try {
        await dispatch(deleteAds(adId)).unwrap();
        toast.success("Ad has been deleted");
        // Refresh ads
        window.location.reload();
      } catch (error) {
        toast.error(error?.message || "Failed to delete ad");
      }
    }
  };

  const getStatusBadge = (ad) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    if (ad.is_paid || ad.is_featured || ad.is_promoted || ad.is_sponsored) {
      return (
        <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
          <FaDollarSign className="mr-1 h-3 w-3" />
          Paid
        </span>
      );
    }
    
    if (ad.status === "active") {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          <FaCheckCircle className="mr-1 h-3 w-3" />
          Active
        </span>
      );
    } else if (ad.status === "pending") {
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          <FaClock className="mr-1 h-3 w-3" />
          Pending
        </span>
      );
    } else {
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800`}>
          <FaExclamationTriangle className="mr-1 h-3 w-3" />
          {ad.status || "Inactive"}
        </span>
      );
    }
  };

  const getExpiryInfo = (ad) => {
    if (!ad.end_date && !ad.expires_at) return null;
    const expiryDate = new Date(ad.end_date || ad.expires_at);
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
      return <span className="text-red-600 text-xs font-medium">Expired</span>;
    } else if (daysLeft <= 7) {
      return <span className="text-orange-600 text-xs font-medium">{daysLeft} days left</span>;
    } else {
      return <span className="text-muted-foreground text-xs">{daysLeft} days left</span>;
    }
  };

  const tabs = [
    { id: "posted", label: "Posted Ads", count: postedAds.total },
    { id: "paid", label: "Paid Ads", count: paidAds.total },
    { id: "expiring", label: "Expiring Ads", count: expiringAds.total },
  ];

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Advert Posts Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your posted ads, paid ads, and expiring ads
          </p>
        </div>
        <ModalCategoryPostAd />
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ads..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {/* Ads List */}
      {paginatedAds.length === 0 ? (
        <div className="text-center py-12">
          <FaAd className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No {activeTab === "posted" ? "posted" : activeTab === "paid" ? "paid" : "expiring"} ads found
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {activeTab === "posted" && "You haven't posted any ads yet."}
            {activeTab === "paid" && "You don't have any paid ads."}
            {activeTab === "expiring" && "No ads are expiring soon."}
          </p>
          {activeTab === "posted" && <ModalCategoryPostAd />}
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {paginatedAds.map((ad, index) => (
              <div
                key={ad.listing_id || ad.id || index}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                {/* Image */}
                <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {ad.images && ad.images.length > 0 ? (
                    <img
                      src={ad.images[0].image_path || ad.images[0]}
                      alt={ad.title}
                      onError={(e) => {
                        e.target.src = "/img/no-image.png";
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaAd className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground truncate">
                          {ad.title || "Untitled Ad"}
                        </h3>
                        {getStatusBadge(ad)}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                        {ad.category?.name && (
                          <span className="flex items-center gap-1">
                            <FaTags className="h-3 w-3" />
                            {ad.category.name}
                          </span>
                        )}
                        {ad.location?.city && (
                          <span className="flex items-center gap-1">
                            <MdLocationOn className="h-3 w-3" />
                            {ad.location.city}
                          </span>
                        )}
                        {(ad.price !== null && ad.price !== undefined) && (
                          <span className="flex items-center gap-1">
                            <FaDollarSign className="h-3 w-3" />
                            {ad.currency?.symbol || "$"}{ad.price}
                          </span>
                        )}
                      </div>
                      {activeTab === "expiring" && getExpiryInfo(ad)}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <Link
                      to={`/listing/${ad.slug || ad.listing_id || ad.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <FaEye className="h-3 w-3" />
                      View
                    </Link>
                    <button
                      onClick={() => {
                        // Open edit overlay
                        const event = new CustomEvent("editAd", { detail: ad });
                        window.dispatchEvent(event);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <FaEdit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ad.listing_id || ad.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <FaTrash className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, currentAds.total)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">{currentAds.total}</span>{" "}
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
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  Next
                  <FaChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdvertPostsManagement;
