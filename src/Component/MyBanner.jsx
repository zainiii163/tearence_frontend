import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyBanner, getBannerList } from "../slice/BannerSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import BannerDetailForAuthor from "./BannerDetailForAuthor";
import BannerDetail from "./BannerDetail";
import { useLocation } from "react-router-dom";

const MyBanner = ({ customerId }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const bannerListData = useSelector((store) => store.banner.myBannerList);
  const bannerListDataPub = useSelector((store) => store.banner.bannerList);
  const banner = useSelector((store) => store.banner);
  const loader = useRef(null);

  // Banner state
  const [dataBanner, setDataBanner] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const [page, setPage] = useState(1);
  const limit = 20;
  const sort_type = "desc";
  const [isOpen, setIsOpen] = useState(false);

  // Function to fetch data
  const fetchData = (reset = false) => {
    const skip = (page - 1) * limit;

    // If reset, start fresh
    if (reset) {
      setDataBanner([]); // Clear the banner data
    }

    if (customerId) {
      dispatch(getBannerList({ skip, limit, sort_type, user_id: customerId }));
    } else {
      dispatch(getMyBanner({ skip, limit, sort_type }));
    }
  };

  // Reset and reload data on pathname or customerId change
  const onRefresh = () => {
    setPage(1); // Reset the page number
    fetchData(true); // Reset and fetch new data
  };

  // Fetch data when page changes
  useEffect(() => {
    fetchData();
  }, [page]);

  // Refresh the data when URL path or customerId changes
  useEffect(() => {
    onRefresh();
  }, [location.pathname, customerId]);

  // Append new data to dataBanner without duplicating
  useEffect(() => {
    if (customerId && bannerListDataPub?.data?.items?.length) {
      const newData = bannerListDataPub.data.items.map((item) => ({
        ...item,
      }));
      setDataBanner((prevData) => [
        ...(page === 1 ? [] : prevData),
        ...newData,
      ]); // Reset when page is 1
    } else if (bannerListData?.data?.items?.length) {
      const newData = bannerListData.data.items.map((item) => ({
        ...item,
      }));
      setDataBanner((prevData) => [
        ...(page === 1 ? [] : prevData),
        ...newData,
      ]); // Reset when page is 1
    }
  }, [bannerListData, bannerListDataPub]);

  return (
    <>
      <div className="text-3xl font-bold py-4">Banner Adverts</div>
      <div className="h-[865px] overflow-y-auto">
        <div className="flex-grow flex flex-col justify-between">
          <InfiniteScroll
            dataLength={dataBanner.length}
            next={() => setPage((prev) => prev + 1)} // Pagination
            hasMore={true}
            loader={
              <div ref={loader} style={{ height: "200px" }}>
                {banner.loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
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
              </div>
            }
          >
            <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1 }}>
              <Masonry gutter="20px">
                {dataBanner.map((item, i) => (
                  <button
                    onClick={() => {
                      setSelectedData(item);
                      setIsOpen(true);
                    }}
                    key={i}
                    className="w-full block overflow-hidden"
                  >
                    <img
                      className="w-full rounded-md h-auto max-h-[500px] object-cover"
                      src={item.img}
                      alt={item.title}
                    />
                  </button>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </InfiniteScroll>
        </div>
      </div>
      {customerId ? (
        <BannerDetail
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          data={selectedData}
        />
      ) : (
        <BannerDetailForAuthor
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          data={selectedData}
          onRefresh={onRefresh}
        />
      )}
    </>
  );
};

export default MyBanner;
