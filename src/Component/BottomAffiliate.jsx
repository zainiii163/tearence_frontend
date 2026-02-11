/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getAffiliateList } from "../slice/AffiliateSLice";

const BottomAffiliate = () => {
  const dispatch = useDispatch();
  const affiliateData = useSelector((store) => {
    return store.aff.affiliateList
  });
  const affiliates = affiliateData?.data || [];
  useEffect(() => {
    dispatch(getAffiliateList({
      position: 'bottom',
      skip: 0,
      limit: 0,
    }));
  }, []);
  
  return (
    <div>
      <div className="flex flex-wrap justify-center">
        <h1 className="text-blue-500 font-bold text-4xl">
          <span className="text-[#234777]">More</span>
          <span className="text-[#01C6DA]"> Affiliate</span>
        </h1>
      </div>
      <div className='w-full flex flex-wrap justify-center mt-10 mb-10'>
        {affiliates?.items?.map((item, i) => (
          <div key={i} className="p-4 max-w-sm min-w-[500px]">
              <div className="flex rounded-lg h-full bg-gradient-to-r from-blue-950 to-cyan-700 p-8 flex-col">
                  <div className="flex items-center mb-3">
                      <div
                          className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
                          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                          </svg>
                      </div>
                      <h2 className="text-white text-lg font-medium">Affiliate {i + 1}</h2>
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                      <p className="leading-relaxed text-base text-white">
                          {item.title}
                      </p>
                      <a href={`/affiliate?url=${item.link}`} target="_blank" className="mt-3 text-white hover:text-yellow-400 inline-flex items-center" rel="noreferrer">Learn More
                          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                              <path d="M5 12h14M12 5l7 7-7 7"></path>
                          </svg>
                      </a>
                  </div>
              </div>
          </div>
        ))}
      </div>
    </div>
    
  )
}

export default BottomAffiliate