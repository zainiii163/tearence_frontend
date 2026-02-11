import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MultiSelect from "./MultiSelectDropdown";
import DataDummy from "../data/dummy-banner.json";
import BannerDetail from "./BannerDetail";
import { getBannerList, getMyBanner } from "../slice/BannerSlice";
import { Gallery } from "react-grid-gallery";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import BannerDetailForAuthor from "./BannerDetailForAuthor";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const useMediaQuery = () => {
  const [screenSize, setScreenSize] = useState("2xl");

  const checkScreenSize = () => {
    const width = window.innerWidth;
    if (width < 640) {
      setScreenSize("xs");
    } else if (width >= 640 && width < 768) {
      setScreenSize("sm");
    } else if (width >= 768 && width < 1024) {
      setScreenSize("md");
    } else if (width >= 1024 && width < 1280) {
      setScreenSize("lg");
    } else if (width >= 1280 && width < 1536) {
      setScreenSize("xl");
    } else {
      setScreenSize("2xl");
    }
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return screenSize;
};

const MyBannerList = () => {
  const dispatch = useDispatch();
  const categoryAdsData = useSelector((store) => store.categories.categoryList);
  const bannerListData = useSelector((store) => store.banner.myBannerList);
  const { loading } = useSelector((store) => store.banner);

  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const sort_type = "desc";
  const [isOpen, setIsOpen] = useState(false);

  const bannerItems = bannerListData?.data?.items || [];
  const total = bannerListData?.data?.total || 0;
  const lastPage = bannerListData?.data?.last_page || 1;

  const loader = useRef(null);
  useEffect(() => {
    const options = categoryAdsData?.data?.items.map((o) => {
      {
        return {
          CategoryID: o.category_id,
          Name: o.name,
        };
      }
    });
    setOptionsCategory(options);
    return () => {};
  }, [categoryAdsData]);

  const init = () => {
    const skip = (currentPage - 1) * limit;
    dispatch(getMyBanner({ skip, limit, sort_type }));
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

  const onRefresh = () => {
    setCurrentPage(1);
    init();
  };

  const screenSize = useMediaQuery();

  return (
    <div className="relative pt-32 pb-10 lg:pt-20 w-11/12 mx-auto bg-transparent">
      <div className=" flex flex-col sm:flex-row sm:flex justify-between py-5"></div>
      <div className="p-10 bg-gray-200 rounded-2xl flex justify-between items-center mb-5">
        <div className="flex-1">
          <h1 className="text-blue-500 font-bold text-4xl mb-5">
            <span className="text-[#234777]">My Banner</span>
            <span className="text-[#01C6DA]"> Adverts</span>
          </h1>
          <p>
            Maximize your website's revenue potential by integrating banner
            affiliate ads, allowing you to earn commissions for every click or
            conversion generated through your eye-catching advertisements.
          </p>
          <div className="flex mt-8">
            <Link
              key={"banner"}
              to={`/postbanner`}
              className="flex items-center gap-2 text-lg g:px-7 px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
            >
              <BsFillPlusCircleFill /> <span className="">POST NEW BANNER</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-1 justify-end">
          <img
            className="transform duration-500 hover:scale-105 w-[250px] object-cover"
            src="/img/ilustration-banner.png"
            alt="header"
          />
        </div>
      </div>
      
      <div className="min-h-screen flex flex-col">
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

        {/* Banner Grid */}
        {!loading && bannerItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
                  className="w-full rounded-t-lg h-auto max-h-[300px] object-cover"
                  src={item.img}
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = "/img/no-image-available.jpg";
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
                    <span className="text-sm text-primary hover:underline">
                      View Details
                    </span>
                  </div>
                </div>
              </button>
            ))}
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
            <h3 className="text-lg font-medium text-foreground mb-2">No banner ads found</h3>
            <p className="text-muted-foreground mb-6">
              You haven't created any banner ads yet. Get started by posting your first banner!
            </p>
            <Link
              to="/postbanner"
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <BsFillPlusCircleFill />
              Create Your First Banner
            </Link>
          </div>
        )}

        {/* Pagination */}
        {bannerItems.length > 0 && (
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
                disabled={currentPage >= lastPage}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                Next
                <FaChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      <BannerDetailForAuthor
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={selectedData}
        onRefresh={() => {
          onRefresh();
        }}
      />
    </div>
  );
};
export default MyBannerList;