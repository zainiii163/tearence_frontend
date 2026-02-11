import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBannerList } from "../slice/BannerSlice";
import BannerDetail from "./BannerDetail";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Helmet } from "react-helmet";
import BusinessTabs from "./BusinessTabs";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const BannerList = () => {
  const dispatch = useDispatch();
  const bannerListData = useSelector((store) => store.banner.bannerList);
  const { loading } = useSelector((store) => store.banner);

  const [selectedData, setSelectedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const sort_type = "desc";
  const [isOpen, setIsOpen] = useState(false);

  const bannerItems = bannerListData?.data?.items || [];
  const total = bannerListData?.data?.total || 0;
  const lastPage = Math.ceil(total / limit) || 1;

  const init = () => {
    const skip = (currentPage - 1) * limit;
    dispatch(getBannerList({ skip, limit, sort_type }));
  };
  
  useEffect(() => {
    init();
  }, [currentPage, dispatch]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Helmet>
        <title>Banner Ads - Discover Professional Banner Advertisements</title>
        <meta name="description" content="Browse our collection of professional banner ads. Find the perfect banner advertisements for your marketing campaigns." />
        <meta name="keywords" content="banner ads, advertisements, marketing, digital ads, promotional banners" />
      </Helmet>
      
      <div className="min-h-screen bg-background pt-32 md:pt-36 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Banner Advertisements</h1>
            <p className="text-muted-foreground">
              Discover professional banner ads for your marketing campaigns
            </p>
          </div>

          {/* Business Tabs */}
          <div className="mb-8">
            <BusinessTabs />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-card shadow-sm animate-pulse">
                  <div className="aspect-video bg-muted rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-muted rounded w-20"></div>
                      <div className="h-8 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Banner Masonry Grid */}
          {!loading && bannerItems.length > 0 && (
            <div className="mb-8">
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3, 1280: 4 }}
              >
                <Masonry gutter="16px">
                  {bannerItems.map((item, i) => (
                    <button
                      onClick={() => {
                        setSelectedData(item);
                        setIsOpen(true);
                      }}
                      key={i}
                      className="w-full block overflow-hidden rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        className="w-full h-auto object-cover"
                        src={item.img}
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = "/img/no-image-available.jpg";
                        }}
                        style={{ 
                          maxHeight: 'none',
                          height: 'auto'
                        }}
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {item.description}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {item.size_img}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </div>
          )}

          {/* Empty State */}
          {!loading && bannerItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No banner ads available</h3>
              <p className="text-muted-foreground">
                Check back later for new banner advertisements.
              </p>
            </div>
          )}

          {/* Pagination */}
          {bannerItems.length > 0 && total > limit && (
            <div className="flex items-center justify-between mb-8">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, total)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">{total}</span>{" "}
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
                  disabled={currentPage * limit >= total}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  Next
                  <FaChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <BannerDetail isOpen={isOpen} setIsOpen={setIsOpen} data={selectedData} />
    </>
  );
};
export default BannerList;