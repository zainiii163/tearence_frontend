import React, { useEffect, useState } from "react";
import { FaStar, FaTags, FaRegStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { BiExitFullscreen } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { creatFavouriteAds, getFeaturedAds } from "../slice/ListSlice";
import FeaturedAdsSlide from "../Component/FeaturedAdsSlide";

const FeatureAds = () => {
  const dispatch = useDispatch();
  const featuredAdsData = useSelector((store) => store.ads.adsList);
  const featuredAds = featuredAdsData?.data || [];
  const itemsPerPage = 20;
  const totalDataCount = featuredAds?.total || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [liked, setLiked] = useState(Array(featuredAds.length).fill(false));

  useEffect(() => {
    dispatch(
      getFeaturedAds({
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
      })
    );
  }, [currentPage, dispatch, itemsPerPage]);

  const addToFavourite = (customer_id, listing_id, index) => {
    const currentCustomerId = localStorage.getItem('customer_id') || customer_id;
    if (liked[index]) {
      dispatch(
        creatFavouriteAds({
          data: { customer_id: currentCustomerId, listing_id, is_favorite: false },
        })
      );
    } else {
      dispatch(
        creatFavouriteAds({
          data: { customer_id: currentCustomerId, listing_id, is_favorite: true },
        })
      );
    }

    setLiked((prevLiked) => ({
      ...prevLiked,
      [index]: !prevLiked[index],
    }));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalDataCount / itemsPerPage)) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const truncateString = (str, maxLength) => {
    if (!str) return '';
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  };

  return (
    <div className=" relative mt-32 lg:mt-20 w-11/12 mx-auto bg-transparent">
      <div className=" flex flex-col justify-between py-5">
        <h1 className="text-blue-500 font-bold text-4xl mb-5">
          <span className="text-[#234777]">Feature</span>
          <span className="text-[#01C6DA]"> Ads</span>
        </h1>
        <div className="pt-8 md:pt-0 flex justify-between gap-5 py-2">
          <button
            className="flex justify-center items-center text-sm font-semibold border-2 rounded-md border-[#234777] hover:bg-[#234777] hover:text-white py-1 px-4"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <div>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-xl " height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path className="hover:text-white" fill="currentColor" stroke="currentColor" stroke-width="2" d="M6,12.4 L18,12.4 M12.6,7 L18,12.4 L12.6,17.8" transform="matrix(-1 0 0 1 24 0)"></path></svg>
            </div>
            PREVIOUS
          </button>
          <button
            className="flex justify-center items-center text-sm font-semibold border-2 rounded-md border-[#234777] hover:bg-[#234777] hover:text-white py-1 px-4"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= totalDataCount}
          >
            NEXT
            <div>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path className="hover:text-white" fill="currentColor" stroke="currentColor" stroke-width="2" d="M6,12.4 L18,12.4 M12.6,7 L18,12.4 L12.6,17.8"></path></svg>
            </div>
          </button>
        </div>
        {/* {JSON.stringify(JSON.parse(featuredAds).data.data)} */}
      </div>
      {featuredAds.items?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 sm:justify-center md:grid-cols-2 lg:grid-cols-2 lg:justify-between">
          {featuredAds.items?.map((item, index) => (
            <div
              className="group w-full flex overflow-hidden border border-slate-200 shadow-lg rounded-lg"
              key={index}
            >
              <div className="w-1/3 h-56 bg-slate-100 flex items-center">
                <Link to={`/ads-detail/${item.slug}`}>
                  {item.images.length > 0 ? (
                    <img
                      src={item.images[0].image_path}
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = "/img/no-image-featured.jpg";
                      }}
                      style={{ width: "100%", height: "100%" }}
                      className="object-cover transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <img
                      src="/img/no-image-featured.jpg"
                      alt="Default"
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                </Link>
              </div>

              <div className="w-7/12 p-4">
                <div className="flex items-center gap-1 text-[#999999] pb-2">
                  <div>
                    <FaTags />
                  </div>
                  <div>{item.category.name}</div>
                </div>
                <div>
                  <hr className="border-1 text-[#999999]" />
                </div>
                <div className="text-lg text-[#232D3B] py-1">
                  <Link
                    to={`/ads-detail/${item.slug}`}
                    className="font-bold group-hover:text-yellow-500"
                  >
                    {item.title}
                  </Link>
                </div>
                <div className="flex items-start gap-1 pb-2 text-[#999999]">
                  <div className="pt-1">
                    <MdLocationOn />
                  </div>
                  <div>{item.location.city}</div>
                </div>
                <div>
                  <hr className="border-1 text-[#999999]" />
                </div>
                <div className="flex justify-end align-middle font-bold text-[#232D3B] text-lg py-2">
                  {/* <div className="font-bold text-[#232D3B] text-lg py-2">
                    <div>
                      {item.currency.symbol} {item.price}
                    </div>
                  </div> */}
                  <div className=" w-1/4 flex justify-end">
                    <div className=" border-slate-200">
                      <Link to={`/ads-detail/${item.slug}`} key={index}>
                        <button className="p-1 hover:scale-110 duration-300">
                          <BiExitFullscreen className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>
                    <span className="border max-h-[70%]"></span>
                    <div className="  border-slate-300">
                      <button
                        className="p-1 hover:scale-110 duration-300"
                        onClick={() =>
                          addToFavourite(
                            item.customer_id,
                            item.listing_id,
                            index
                          )
                        }
                      >
                        {liked[index] ? (
                          <FaStar className="text-yellow-400 w-5 h-5" />
                        ) : (
                          <FaRegStar className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex  flex-col justify-center  lg:min-h-[24vh] md:min-h-[30vh] xl:min-h-[27vh] 2xl:min-h-[34.8vh">
          <div className=" text-[#01c6da] border-2 border-[#234777] rounded-md py-10 text-center">
            {" "}
            <span className="text-2xl italic">No results found</span>
          </div>
        </div>
      )}
      <div className="flex justify-between py-6">
        <div className="mt-2 text-lg">
          Showing{" "}
          <strong>
            {startIndex + 1}-{Math.min(endIndex, totalDataCount)}{" "}
          </strong>{" "}
          of <strong>{totalDataCount}</strong> results.
        </div>
        <div className="flex justify-between gap-4 pt-6 lg:py-0">
          <button
            className="flex justify-center items-center text-sm font-semibold border-2 rounded-md border-[#234777] hover:bg-[#234777] hover:text-white py-1 px-4"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <div>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-xl " height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path className="hover:text-white" fill="currentColor" stroke="currentColor" stroke-width="2" d="M6,12.4 L18,12.4 M12.6,7 L18,12.4 L12.6,17.8" transform="matrix(-1 0 0 1 24 0)"></path></svg>
            </div>
            PREVIOUS
          </button>
          <button
            className="flex justify-center items-center text-sm font-semibold border-2 rounded-md border-[#234777] hover:bg-[#234777] hover:text-white py-1 px-4"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= totalDataCount}
          >
            NEXT
            <div>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path className="hover:text-white" fill="currentColor" stroke="currentColor" stroke-width="2" d="M6,12.4 L18,12.4 M12.6,7 L18,12.4 L12.6,17.8"></path></svg>
            </div>
          </button>
        </div>
      </div>
      <FeaturedAdsSlide />
    </div>
  );
};

export default FeatureAds;
