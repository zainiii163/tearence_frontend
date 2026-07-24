import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAffiliateList } from "../slice/AffiliateSLice";

const AffiliateAds = () => {
  const dispatch = useDispatch();
  const affiliateData = useSelector((store) => {
    return store.aff.affiliateList;
  });
  const affiliatesAds = affiliateData?.data || [];
  const itemsPerPage = 42;
  const totalDataCount = affiliatesAds?.total || 0;
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
      getAffiliateList({
        position: "",
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      })
    );
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container pt-32 sm:pt-24 pb-12">
        {/* Header Section */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FaUsers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Affiliate Ads
              </h1>
              <p className="text-muted-foreground">
                Discover affiliate opportunities and partnerships
              </p>
            </div>
          </div>
          <div className="h-px bg-border" />
        </div>
        {/* Affiliate Ads Grid */}
        {affiliatesAds.items?.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mb-12">
            {affiliatesAds.items?.map((items, index) => (
              <a
                href={`/affiliate?url=${items.link}`}
                rel="noreferrer"
                target="_blank"
                className="group"
                key={index}
              >
                {items.image_url ? (
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                      <img
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        src={items.image_url}
                        alt={items.title}
                        onError={(e) => {
                          e.target.src = "/img/no-image.png";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors flex-1">
                          {items.title}
                        </h3>
                        <FaExternalLinkAlt className="h-3 w-3 text-muted-foreground ml-2 mt-1 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-1 min-h-[200px]">
                    <div className="flex h-full p-4">
                      <div className="flex flex-col justify-between w-full">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                            <FaUsers className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium opacity-90">Affiliate</span>
                        </div>
                        <div className="flex-1 flex items-center">
                          <p className="text-sm leading-relaxed line-clamp-4 group-hover:text-primary-foreground/90 transition-colors">
                            {items.title}
                          </p>
                        </div>
                        <div className="flex justify-end mt-3">
                          <FaExternalLinkAlt className="h-3 w-3 opacity-75" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </a>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FaUsers className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No affiliate ads found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We couldn't find any affiliate ads at the moment. Check back later for new opportunities.
            </p>
          </div>
        )}
        {/* Pagination */}
        {totalDataCount > 0 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
              >
                <FaChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Page</span>
                <span className="text-sm font-medium text-foreground">
                  {currentPage} of {Math.ceil(totalDataCount / itemsPerPage)}
                </span>
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalDataCount / itemsPerPage)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
              >
                Next
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateAds;
