/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAffiliateListTop } from "../slice/AffiliateSLice_OLD_DEPRECATED";

const TopAffiliate = () => {
  const dispatch = useDispatch();
  const affiliateData = useSelector((store) => {
    return store.aff.affiliateListTop;
  });
  const affiliates = affiliateData?.data || [];
  useEffect(() => {
    dispatch(getAffiliateListTop());
  }, []);
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Top Affiliates</h2>
        <p className="text-muted-foreground">Discover our featured affiliate partners</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {affiliates?.items?.slice(0, 6).map((items, index) => (
            <a
              target="_blank"
              rel="noreferrer"
              href={`/affiliate?url=${items.link}`}
              key={index}
              className="block group"
            >
              {items.image_url ? (
                <div className="rounded-lg border bg-card shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      src={items.image_url}
                      alt={items.title}
                      onError={(e) => {
                        e.target.src = "/img/no-image.png";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {items.title}
                    </h3>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-gradient-to-r from-primary to-primary/80 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                  <div className="aspect-[4/3] p-6 flex items-center justify-center">
                    <h3 className="text-primary-foreground font-semibold text-center line-clamp-4 group-hover:text-yellow-200 transition-colors">
                      {items.title}
                    </h3>
                  </div>
                </div>
              )}
            </a>
          ))}
      </div>
    </div>
  );
};

export default TopAffiliate;
