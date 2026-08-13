import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAds, getMyAds } from "../slice/ListSlice";
import { FaTags, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaSearch, FaAd, FaRedo } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import EditAdsOverlay from './EditAdsOverlay';
import ModalCategoryPostAd from "./ModalCategoryPostAd";
import RepostAd from './RepostAd';
import AdStatusBadge from './AdStatusBadge';
import toast from "react-hot-toast";

const MyAds = () => {
  const dispatch = useDispatch();
  const customerId = useSelector((store) => store.auth.customerId);
  const MyAdsData = useSelector((store) => store.ads?.myAds);
  const adsData = MyAdsData?.data || [];
  const [isEditOverlayOpen, setEditOverlayOpen] = useState(false);
  const [selected, setSelected] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;
  const totalDataCount = adsData?.total || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalDataCount / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    dispatch(
      getMyAds({
        id: customerId,
        status: "active",
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, currentPage, customerId]);



  const handleDelete = async (adId) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      try {
        await dispatch(deleteAds(adId)).unwrap();
        toast.success("Ad has been deleted");
        dispatch(
          getMyAds({
            id: customerId,
            status: "active",
            skip: (currentPage - 1) * itemsPerPage,
            limit: itemsPerPage,
          })
        );
      } catch (error) {
        toast.error(error?.message || error);
      }
    }
  };

  const handleEdit = (data) => {
    setSelected(data);
    setTimeout(() => {
      setEditOverlayOpen(true);
    }, 100);
  };

  const handleEditClose = () => {
    setEditOverlayOpen(false);
    dispatch(
      getMyAds({
        id: customerId,
        status: "active",
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      })
    );
  };



  const getStatusBadge = (status) => {
    return <AdStatusBadge status={status} size="sm" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  My Classified Ads
                </h1>
                <p className="text-blue-100 text-lg mb-6">
                  Manage and track your published advertisements. Monitor performance, edit details, and optimize your listings for better visibility and engagement.
                </p>
                <ModalCategoryPostAd />
              </div>
              <div className="hidden lg:flex justify-end">
                <img
                  className="w-80 h-80 object-contain"
                  src="/img/my-ads.png"
                  alt="My Ads"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-container py-8">
          {/* Search and Stats */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Classified Ads</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {totalDataCount} classified ads
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search classified ads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          {/* Ads Grid */}
          {!adsData?.items || adsData.items.length === 0 ? (
            <div className="rounded-lg border bg-card p-12 text-center mb-8">
              <FaAd className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No ads found</h3>
              <p className="text-sm text-muted-foreground mb-6">
                You haven't created any ads yet. Start by posting your first ad!
              </p>
              <ModalCategoryPostAd />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {adsData?.items?.map((ad, index) => (
                  <div
                    key={index}
                    className="group rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-muted relative">
                      <div className="absolute top-2 left-2 z-10">
                        <AdStatusBadge status={ad?.status} size="sm" />
                      </div>
                      {ad?.images && ad.images.length > 0 ? (
                        <img
                          src={ad.images[0].image_path}
                          alt={ad.title}
                          onError={(e) => {
                            e.target.src = "/img/no-image.png";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                          <div className="text-center">
                            <FaAd className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">No image available</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <FaTags className="h-3 w-3" />
                        <span>{ad?.category?.name || 'Uncategorized'}</span>
                      </div>
                      
                      <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                        {ad?.title || 'Untitled Ad'}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <MdLocationOn className="h-3 w-3" />
                        <span>{ad?.location?.city || 'No location'}</span>
                      </div>

                      {(ad?.price !== null && ad?.price !== undefined) && (
                        <div className="text-sm font-bold text-primary mb-3">
                          {ad?.currency?.symbol}{ad?.price}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(ad)}
                            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 transition-colors"
                            title="Edit Ad"
                          >
                            <FaEdit className="h-3 w-3" />
                          </button>
                          <RepostAd 
                            adId={ad.listing_id}
                            adTitle={ad.title || ad.name || ''}
                            adDescription={ad.description || ''}
                            onRepostSuccess={() => {
                              dispatch(
                                getMyAds({
                                  id: customerId,
                                  status: "active",
                                  skip: (currentPage - 1) * itemsPerPage,
                                  limit: itemsPerPage,
                                })
                              );
                            }}
                          />
                          <button
                            onClick={() => handleDelete(ad.listing_id)}
                            className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 transition-colors"
                            title="Delete Ad"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>



              {/* Pagination */}
              <div className="flex items-center justify-between mb-8">
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
          )}
        </div>
      </div>

      {/* Edit Overlay */}
      {isEditOverlayOpen && (
        <EditAdsOverlay onClose={handleEditClose} data={selected} />
      )}
    </div>
  );
};

export default MyAds;
