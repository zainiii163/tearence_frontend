import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFavouriteAds, removeFabAds } from "../slice/ListSlice";
import { Link } from "react-router-dom";
import { FaEye, FaHeart, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { IoIosRemoveCircleOutline } from "react-icons/io";

const UserFavouriteAds = () => {
  const dispatch = useDispatch();
  const favouriteAdsData = useSelector((store) => store.ads.favouriteAds);
  const favouriteAds = favouriteAdsData?.data || [];
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 5;
  const totalDataCount = favouriteAds?.total || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalDataCount / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const handleRemove = (adId) => {
    if (!adId) return;
    // Dispatch the thunk to remove the favorite. The reducer will update
    // `state.favouriteAds` on fulfilled so the UI updates without a page refresh.
    dispatch(removeFabAds({ id: adId }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredAds = favouriteAds.items?.filter(item =>
    item.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Favorite Ads</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your saved advertisements
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <FaHeart className="h-5 w-5" />
          <span className="text-sm font-medium">{totalDataCount} favorites</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search favorite ads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Ads List */}
      {!favouriteAds.items || favouriteAds.items.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center">
          <FaHeart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No favorite ads yet</h3>
          <p className="text-sm text-muted-foreground">
            Start browsing ads and save your favorites to see them here
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date Added
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {favouriteAds.items?.map((item, index) => (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={item.listing?.images?.[0]?.image_path}
                            alt={item.listing?.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/img/no-image.png";
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {item.listing?.title || 'Untitled Ad'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FaCalendarAlt className="h-3 w-3" />
                          {formatDate(item.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/favourite-ads/${item.favorite_id}`}>
                            <button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 text-xs font-medium transition-colors">
                              <FaEye className="h-3 w-3" />
                              View
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleRemove(item.favorite_id)}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 px-3 text-xs font-medium transition-colors"
                          >
                            <IoIosRemoveCircleOutline className="h-3 w-3" />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
      )}
    </div>
  );
};

export default UserFavouriteAds;
