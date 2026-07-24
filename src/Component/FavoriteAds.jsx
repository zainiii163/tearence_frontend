import React, { useEffect, useState } from "react";
import { FaRegStar, FaStar, FaTags, FaHeart, FaEye, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
import { BiExitFullscreen } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  getFavouriteAds,
  removeFabAds,
  updateFavAdsList,
} from "../slice/ListSlice";
import toast from "react-hot-toast";

const FavoriteAds = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const favouriteAdsData = useSelector((store) => store.ads.favouriteAds);
  const favouriteAds = favouriteAdsData?.data || [];

  const itemsPerPage = 10;
  const totalDataCount = favouriteAds?.total || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalDataCount / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const customerId = localStorage.getItem('customer_id') || null;
    dispatch(
      getFavouriteAds({
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
        id: customerId,
      })
    );
  }, [dispatch, currentPage]);

  const handleRemoveFromFavorites = (favouriteId) => {
    dispatch(removeFabAds({ id: favouriteId }));
    toast.success("Removed from favorites successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
          <div className="page-container">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Favorite Ads
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Your saved advertisements in one convenient place. Easily manage and revisit the ads that caught your interest.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-container py-8">
          {/* Search and Stats */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">My Favorites</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {totalDataCount} saved ads
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search favorite ads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
          {/* Ads Grid */}
          {favouriteAds.items?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {favouriteAds.items?.map((item, index) => (
                  <div
                    key={index}
                    className="group rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <Link to={`/favourite-ads/${item.favorite_id}`}>
                      <div className="aspect-video bg-muted">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={item.listing.images[0]?.image_path}
                          alt={item.listing.title}
                          onError={(e) => {
                            e.target.src = "/img/no-image.png";
                          }}
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <FaTags className="h-3 w-3" />
                        <span>{item.listing.category?.name}</span>
                      </div>
                      
                      <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                        <Link
                          to={`/favourite-ads/${item.favorite_id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {item.listing.title}
                        </Link>
                      </h3>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <MdLocationOn className="h-3 w-3" />
                        <span>{item.listing.location?.city}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <Link to={`/favourite-ads/${item.favorite_id}`}>
                            <button className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 transition-colors">
                              <FaEye className="h-3 w-3" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleRemoveFromFavorites(item.favorite_id)}
                            className="inline-flex items-center justify-center rounded-md bg-red-100 text-red-600 hover:bg-red-200 h-8 w-8 transition-colors"
                          >
                            <FaHeart className="h-3 w-3 fill-current" />
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
              <FaHeart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No favorite ads yet</h3>
              <p className="text-sm text-muted-foreground">
                Start browsing ads and save your favorites to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteAds;
