import React, { useEffect, useState } from "react";
import { FaStar, FaTags, FaRegStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { BiExitFullscreen } from "react-icons/bi";
import { Link } from "react-router-dom";
import { creatFavouriteAds, getNewAds } from "../slice/ListSlice";
import { useDispatch, useSelector } from "react-redux";
import NewAdsSlide from "../Component/NewAdsSlide";
import utils from "../helper/utils";

const RenderImage = ({ url, items }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkImage = async () => {
      const valid = await utils.isValidImageURL(url);
      setIsValid(valid);
    };

    checkImage();
  }, [url]);
  if (!url) {
    return (
      <Link to={`/ads-detail/${items.slug}`}>
        <div className="h-48 flex justify-center items-center">
          <img
            src="/img/no-image.png"
            alt={items.title}
            className="transform duration-500 hover:scale-105 w-1/2 object-cover"
          />
        </div>
      </Link>
    );
  }
  return (
    <>
      {isValid && (
        <Link to={`/ads-detail/${items.slug}`}>
          <div className="h-48">
            <img
              src={items.images[0]?.image_path}
              alt={items.title}
              onError={(e) => {
                e.target.src = "/img/no-image-classified.jpg";
              }}
              className="transform duration-500 hover:scale-105 h-full w-full object-cover"
            />
          </div>
        </Link>
      )}
    </>
  );
};

const ClassifiedAds = () => {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState({});
  const newAdsData = useSelector((store) => store.ads.newAds);
  const newAdsList = newAdsData?.data || [];
  const itemsPerPage = 20;
  const totalDataCount = newAdsList?.total || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(totalDataCount / itemsPerPage)) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    dispatch(
      getNewAds({
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
          <span className="text-[#234777]">Classifieds</span>
          <span className="text-[#01C6DA]"> Ads</span>
        </h1>
        <div className="flex justify-between gap-4 pt-6 lg:py-0">
          <button
            className="flex justify-center items-center text-sm font-semibold border-2 rounded-md border-[#234777] hover:bg-[#234777] hover:text-white py-1 px-4"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <div>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-xl " height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path className="hover:text-white" fill="currentColor" stroke="currentColor" strokeWidth="2" d="M6,12.4 L18,12.4 M12.6,7 L18,12.4 L12.6,17.8" transform="matrix(-1 0 0 1 24 0)"></path></svg>
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
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path className="hover:text-white" fill="currentColor" stroke="currentColor" strokeWidth="2" d="M6,12.4 L18,12.4 M12.6,7 L18,12.4 L12.6,17.8"></path></svg>
            </div>
          </button>
        </div>
      </div>
      {/* <div className="bg-yellow-400 flex flex-wrap  mt-10 w-full "> */}
      {newAdsList.items?.length > 0 ? (
        <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 sm:justify-center md:grid-cols-2 lg:grid-cols-5 lg:justify-between ">
          {newAdsList.items?.map((items, index) => (
            <div
              key={index}
              className="group w-full overflow-hidden  border border-slate-200 shadow-lg rounded-lg"
            >
              <RenderImage url={items.images[0]?.image_path} items={items} />
              <div className="p-4">
                <div className="flex items-center gap-1 text-[#999999] pb-2">
                  <div>
                    <FaTags />
                  </div>
                  <div>{items.category.name}</div>
                </div>
                <div>
                  <hr className="border-1 text-[#999999]" />
                </div>
                <div className="text-lg text-[#232D3B] py-1">
                  <Link
                    to={`/ads-detail/${items.slug}`}
                    className="font-bold group-hover:text-yellow-500"
                  >
                    {truncateString(items.title, 30)}
                  </Link>
                </div>
                <div className="flex items-start gap-1 pb-2 text-[#999999]">
                  <div className="pt-1">
                    <MdLocationOn />
                  </div>
                  <div className="">{items.location.city}</div>
                </div>
                <div>
                  <hr className="border-1 text-[#999999]" />
                </div>
                <div className="flex justify-end align-middle font-bold text-[#232D3B] text-lg py-2">
                  {/* <div className="font-bold text-[#232D3B]  w-7/12">
                    {items.price}
                  </div> */}
                  <div className=" w-3/12 flex justify-end">
                    <div className=" border-l-2 border-slate-200">
                      <Link to={`/ads-detail/${items.slug}`} key={index}>
                        <button className="p-1 hover:scale-110 duration-300">
                          <BiExitFullscreen className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>
                    <div className=" border-l-2 border-slate-200">
                      <button
                        className="p-1 hover:scale-110 duration-300"
                        onClick={() =>
                          addToFavourite(
                            items.customer_id,
                            items.listing_id,
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
        <p>no new ads Available</p>
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
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-xl " height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path className="hover:text-white" fill="currentColor" stroke="currentColor" strokeWidth="2" d="M6,12.4 L18,12.4 M12.6,7 L18,12.4 L12.6,17.8" transform="matrix(-1 0 0 1 24 0)"></path></svg>
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
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path className="hover:text-white" fill="currentColor" stroke="currentColor" strokeWidth="2" d="M6,12.4 L18,12.4 M12.6,7 L18,12.4 L12.6,17.8"></path></svg>
            </div>
          </button>
        </div>
      </div>
      <NewAdsSlide />
    </div>
  );
};

export default ClassifiedAds;
