import React, { useEffect, useState } from "react";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyAffiliate } from "../slice/AffiliateSLice";
import AffiliateDetailForAuthor from "./AffiliateDetailForAuthor";
import { BsFillPlusCircleFill } from "react-icons/bs";

const MyAffiliateAds = () => {
  const dispatch = useDispatch();
  const affiliateData = useSelector((store) => {
    return store.aff.myAffiliateList;
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const affiliatesAds = affiliateData?.data || [];
  const itemsPerPage = 42;
  const totalDataCount = affiliatesAds?.total || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const maxLength = 100;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalDataCount / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const init = () => {
    dispatch(
      getMyAffiliate({
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      })
    );
  };
  useEffect(() => {
    init();
  }, [currentPage]);

  const onRefresh = () => {
    setCurrentPage(1);
    init();
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  My Affiliate Adverts
                </h1>
                <p className="text-blue-100 text-lg mb-6">
                  Affiliate ads are a cost-effective marketing strategy where businesses partner with affiliates to promote their products, paying only for successful leads or sales, thus expanding reach and building trust through diverse, scalable channels.
                </p>
                <Link
                  to={`/postaffiliate`}
                  className="inline-flex items-center gap-2 rounded-md bg-white text-blue-600 hover:bg-blue-50 h-10 px-6 text-sm font-medium transition-colors"
                >
                  <BsFillPlusCircleFill className="h-4 w-4" />
                  Post New Ad
                </Link>
              </div>
              <div className="hidden lg:flex justify-end">
                <img
                  className="w-80 h-80 object-contain"
                  src="/img/affliate-ads-vector.png"
                  alt="Affiliate Ads"
                />
              </div>
            </div>
          </div>
        </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Affiliate Ads</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalDataCount} affiliate ads
                </p>
              </div>
            </div>

            {/* Ads Grid */}
            {affiliatesAds.items?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
                  {affiliatesAds.items?.map((items, index) => (
                    <button
                      onClick={() => {
                        setSelectedData(items);
                        setIsOpen(true);
                      }}
                      className="group rounded-lg border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      key={index}
                    >
                      {items.image_url ? (
                        <div className="w-full">
                          <div className="aspect-square bg-muted">
                            <img
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              src={items.image_url}
                              alt={items.title}
                              onError={(e) => {
                                e.target.src = "/img/no-image.png";
                              }}
                            />
                          </div>
                          <div className="p-4">
                            <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {items.title}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full aspect-square bg-gradient-to-r from-blue-900 to-cyan-700 p-4 flex items-center justify-center">
                          <div className="text-sm font-medium text-white text-center group-hover:text-yellow-300 transition-colors line-clamp-4">
                            {items.title}
                          </div>
                        </div>
                      )}
                    </button>
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
                <div className="h-12 w-12 text-muted-foreground mx-auto mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No affiliate ads yet</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first affiliate ad to start earning commissions
                </p>
              </div>
            )}

            {/* Modal */}
            <AffiliateDetailForAuthor
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              data={selectedData}
              onRefresh={() => {
                onRefresh();
              }}
            />
          </div>
        </div>
      </div>
  );
};

export default MyAffiliateAds;
